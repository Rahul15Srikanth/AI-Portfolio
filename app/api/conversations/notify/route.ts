import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/utils/supabase/server";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ElevenLabsTranscriptMessage {
  role: "agent" | "user";
  message: string;
  time_in_call_secs?: number;
}

interface ElevenLabsConversation {
  conversation_id: string;
  agent_id: string;
  status: string;
  metadata?: {
    start_time_unix_secs?: number;
    call_duration_secs?: number;
  };
  transcript?: ElevenLabsTranscriptMessage[];
  analysis?: {
    transcript_summary?: string;
    call_successful?: string;
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EXPECTED_AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
/**
 * ElevenLabs conversation IDs follow the pattern conv_<alphanumeric>
 * We validate this server-side to reject obviously invalid or malicious IDs.
 */
const CONVERSATION_ID_REGEX = /^conv_[a-zA-Z0-9]{10,60}$/;

// ─── ElevenLabs API Fetch ─────────────────────────────────────────────────────

async function fetchConversationFromElevenLabs(
  conversationId: string
): Promise<ElevenLabsConversation | null> {
  if (!ELEVENLABS_API_KEY) {
    console.error("[notify] ELEVENLABS_API_KEY is not configured");
    return null;
  }

  const url = `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`;

  try {
    const res = await fetch(url, {
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      // Next.js: opt out of caching so we always get live data
      cache: "no-store",
    });

    if (res.status === 404) {
      console.warn(`[notify] Conversation ${conversationId} not found on ElevenLabs`);
      return null;
    }

    if (!res.ok) {
      console.error(`[notify] ElevenLabs API error: ${res.status} ${res.statusText}`);
      return null;
    }

    return (await res.json()) as ElevenLabsConversation;
  } catch (err) {
    console.error("[notify] Failed to fetch from ElevenLabs:", err);
    return null;
  }
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // 1. Validate environment configuration
  if (!EXPECTED_AGENT_ID || !ELEVENLABS_API_KEY) {
    console.error("[notify] Missing required environment variables");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  // 2. Parse and validate request body
  let body: { conversation_id?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const conversationId = body?.conversation_id;

  if (typeof conversationId !== "string" || !CONVERSATION_ID_REGEX.test(conversationId)) {
    return NextResponse.json(
      { error: "Invalid or missing conversation_id" },
      { status: 400 }
    );
  }

  // 3. Idempotency check: if we already have a complete webhook record for this
  //    conversation, skip the API call entirely.
  try {
    const supabase = createServiceRoleClient();
    const { data: existing } = await supabase
      .from("conversations")
      .select("conversation_id, data_source")
      .eq("conversation_id", conversationId)
      .single();

    if (existing?.data_source === "webhook") {
      // Webhook already delivered a full record — no need to re-fetch
      return NextResponse.json({ received: true, skipped: true });
    }
  } catch {
    // If the check fails, proceed to fetch anyway (safe to retry)
  }

  // 4. Fetch authoritative conversation data server-side from ElevenLabs
  //    We wait a few seconds to give ElevenLabs time to finish processing.
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const data = await fetchConversationFromElevenLabs(conversationId);

  if (!data) {
    // Non-critical: the webhook may deliver the data shortly after.
    return NextResponse.json({ received: true, fetched: false });
  }

  // 5. Verify agent_id server-side — never trust the browser for this
  if (data.agent_id !== EXPECTED_AGENT_ID) {
    console.warn(
      `[notify] Agent ID mismatch. Expected ${EXPECTED_AGENT_ID}, got ${data.agent_id}`
    );
    return NextResponse.json({ error: "Agent ID mismatch" }, { status: 403 });
  }

  // 6. Map status
  const callStatus =
    data.analysis?.call_successful === "success"
      ? "success"
      : data.analysis?.call_successful === "failure"
      ? "failure"
      : "unknown";

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

  // 7. Upsert into Supabase — idempotent, safe to call multiple times
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
        summary_text: data.analysis?.transcript_summary ?? null,
        transcript: data.transcript ?? null,
        data_source: "api_fallback",
      },
      {
        onConflict: "conversation_id",
        ignoreDuplicates: false,
      }
    );

    if (error) {
      console.error("[notify] Supabase upsert error:", error.message);
      return NextResponse.json({ error: "Database write failed" }, { status: 500 });
    }
  } catch (err) {
    console.error("[notify] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  console.log(`[notify] Saved conversation via fallback: ${conversationId} (${callStatus})`);
  return NextResponse.json({ received: true, fetched: true });
}
