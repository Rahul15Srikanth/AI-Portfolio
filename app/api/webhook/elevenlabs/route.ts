import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/utils/supabase/server";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TranscriptMessage {
  role: "agent" | "user";
  message: string;
  time_in_call_secs?: number;
}

interface WebhookConversationData {
  conversation_id: string;
  agent_id: string;
  status: string;
  transcript?: TranscriptMessage[];
  metadata?: {
    start_time_unix_secs?: number;
    call_duration_secs?: number;
  };
  analysis?: {
    transcript_summary?: string;
    call_successful?: string;
    evaluation_criteria_results?: Record<string, unknown>;
    data_collection_results?: Record<string, unknown>;
  };
}

interface WebhookPayload {
  type: string;
  event_timestamp: number;
  data: WebhookConversationData;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EXPECTED_AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
const WEBHOOK_SECRET = process.env.ELEVENLABS_WEBHOOK_SECRET;
/** Reject webhooks with a timestamp older than 5 minutes */
const TIMESTAMP_TOLERANCE_SECONDS = 300;

// ─── HMAC Verification ────────────────────────────────────────────────────────

/**
 * Verifies the ElevenLabs webhook signature.
 *
 * Header format: ElevenLabs-Signature: t=<unix_timestamp>,v0=<hex_hmac>
 * Signed payload: `${timestamp}.${rawBody}`
 * Algorithm: HMAC-SHA256
 */
function verifyWebhookSignature(
  signatureHeader: string,
  rawBody: string,
  secret: string
): { valid: boolean; reason?: string } {
  const parts = signatureHeader.split(",");
  const tPart = parts.find((p) => p.startsWith("t="));
  const v0Part = parts.find((p) => p.startsWith("v0="));

  if (!tPart || !v0Part) {
    return { valid: false, reason: "Malformed signature header" };
  }

  const timestamp = tPart.slice(2);
  const receivedHmac = v0Part.slice(3);

  // Reject replayed webhooks outside the tolerance window
  const now = Math.floor(Date.now() / 1000);
  const webhookTime = parseInt(timestamp, 10);
  if (isNaN(webhookTime) || Math.abs(now - webhookTime) > TIMESTAMP_TOLERANCE_SECONDS) {
    return { valid: false, reason: "Webhook timestamp out of tolerance window" };
  }

  // Compute expected HMAC
  const signedMessage = `${timestamp}.${rawBody}`;
  const expectedHmac = createHmac("sha256", secret)
    .update(signedMessage)
    .digest("hex");

  // Timing-safe comparison to prevent timing attacks
  try {
    const receivedBuf = Buffer.from(receivedHmac, "hex");
    const expectedBuf = Buffer.from(expectedHmac, "hex");

    if (receivedBuf.length !== expectedBuf.length) {
      return { valid: false, reason: "HMAC length mismatch" };
    }

    if (!timingSafeEqual(receivedBuf, expectedBuf)) {
      return { valid: false, reason: "HMAC signature mismatch" };
    }
  } catch {
    return { valid: false, reason: "HMAC comparison failed" };
  }

  return { valid: true };
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // 1. Validate environment configuration
  if (!WEBHOOK_SECRET) {
    console.error("[webhook] ELEVENLABS_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  if (!EXPECTED_AGENT_ID) {
    console.error("[webhook] NEXT_PUBLIC_ELEVENLABS_AGENT_ID is not configured");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  // 2. Read raw body BEFORE parsing JSON (required for correct HMAC verification)
  const rawBody = await request.text();

  // 3. Extract and verify HMAC signature
  const signatureHeader = request.headers.get("elevenlabs-signature");
  if (!signatureHeader) {
    return NextResponse.json({ error: "Missing signature header" }, { status: 401 });
  }

  const { valid, reason } = verifyWebhookSignature(signatureHeader, rawBody, WEBHOOK_SECRET);
  if (!valid) {
    console.warn("[webhook] Signature verification failed:", reason);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // 4. Parse and validate payload
  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  // 5. Only handle post_call_transcription events
  if (payload.type !== "post_call_transcription") {
    // Acknowledge other event types gracefully without processing
    return NextResponse.json({ received: true });
  }

  const { data } = payload;

  // 6. Validate required fields
  if (!data?.conversation_id || typeof data.conversation_id !== "string") {
    return NextResponse.json({ error: "Missing conversation_id" }, { status: 400 });
  }

  // 7. Verify this webhook is for our expected agent (prevent cross-agent injection)
  if (data.agent_id !== EXPECTED_AGENT_ID) {
    console.warn(
      `[webhook] Agent ID mismatch. Expected ${EXPECTED_AGENT_ID}, got ${data.agent_id}`
    );
    return NextResponse.json({ error: "Agent ID mismatch" }, { status: 403 });
  }

  // 8. Map call status
  const callStatus =
    data.analysis?.call_successful === "success"
      ? "success"
      : data.analysis?.call_successful === "failure"
      ? "failure"
      : "unknown";

  // 9. Calculate timestamps
  const startedAt = data.metadata?.start_time_unix_secs
    ? new Date(data.metadata.start_time_unix_secs * 1000).toISOString()
    : null;
  const durationSeconds = data.metadata?.call_duration_secs ?? null;
  const endedAt =
    startedAt && durationSeconds
      ? new Date(
          data.metadata!.start_time_unix_secs! * 1000 + durationSeconds * 1000
        ).toISOString()
      : null;

  // 10. Upsert into Supabase using service role (bypasses RLS for server writes)
  try {
    const supabase = createServiceRoleClient();

    const { error } = await supabase.from("conversations").upsert(
      {
        conversation_id: data.conversation_id,
        agent_id: data.agent_id,
        started_at: startedAt,
        ended_at: endedAt,
        duration_seconds: durationSeconds,
        call_status: callStatus,
        summary_title: data.analysis?.transcript_summary
          ? data.conversation_id // ElevenLabs summary title not in this payload, use ID as fallback
          : null,
        summary_text: data.analysis?.transcript_summary ?? null,
        transcript: data.transcript ?? null,
        data_source: "webhook",
      },
      {
        onConflict: "conversation_id", // idempotent: safe to retry
        ignoreDuplicates: false,        // update on conflict (in case API fallback ran first)
      }
    );

    if (error) {
      console.error("[webhook] Supabase upsert error:", error.message);
      // Return 500 so ElevenLabs will retry with exponential backoff
      return NextResponse.json({ error: "Database write failed" }, { status: 500 });
    }
  } catch (err) {
    console.error("[webhook] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  console.log(`[webhook] Saved conversation: ${data.conversation_id} (${callStatus})`);

  // ElevenLabs requires a 200 response to confirm receipt
  return NextResponse.json({ received: true });
}
