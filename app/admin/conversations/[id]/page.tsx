import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ArrowLeft, User, Bot, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface TranscriptMessage {
  role: "agent" | "user";
  message: string;
  time_in_call_secs?: number;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "medium",
  });
}

function formatTime(secs?: number): string {
  if (secs === undefined) return "";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default async function TranscriptPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Re-validate admin user server-side (defence-in-depth)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const adminUserId = process.env.ADMIN_USER_ID;
  if (!user || user.id !== adminUserId) redirect("/admin/login");

  // Fetch conversation — RLS ensures only admin can read
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("conversation_id", id)
    .single();

  if (error || !data) notFound();

  const transcript = (data.transcript ?? []) as TranscriptMessage[];
  const hasTranscript = transcript.length > 0;

  const statusIcon =
    data.call_status === "success" ? (
      <CheckCircle className="w-4 h-4 text-emerald-400" />
    ) : data.call_status === "failure" ? (
      <XCircle className="w-4 h-4 text-red-400" />
    ) : (
      <AlertCircle className="w-4 h-4 text-muted-foreground" />
    );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      {/* Conversation metadata */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-foreground">
              Conversation Transcript
            </h1>
            <p className="text-xs font-mono text-muted-foreground/60 mt-0.5">
              {data.conversation_id}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            {statusIcon}
            <span className="text-sm text-muted-foreground capitalize">
              {data.call_status ?? "unknown"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
          <div>
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">
              Started
            </p>
            <p className="text-xs text-foreground">{formatDate(data.started_at)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">
              Duration
            </p>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground/60" />
              <p className="text-xs text-foreground">
                {formatDuration(data.duration_seconds)}
              </p>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">
              Data Source
            </p>
            <p className="text-xs text-foreground">{data.data_source ?? "—"}</p>
          </div>
        </div>

        {/* AI Summary */}
        {data.summary_text && (
          <div className="pt-2 border-t border-white/10">
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2">
              AI Summary
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {data.summary_text}
            </p>
          </div>
        )}
      </div>

      {/* Transcript messages */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-foreground">
            Full Transcript
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {transcript.length} message{transcript.length !== 1 ? "s" : ""}
          </p>
        </div>

        {!hasTranscript ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Transcript not yet available.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              It may still be processing on ElevenLabs&apos; servers.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {transcript.map((msg, i) => {
              const isAgent = msg.role === "agent";
              return (
                <div
                  key={i}
                  className={`flex gap-3 ${isAgent ? "flex-row" : "flex-row-reverse"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${isAgent ? "bg-primary/10 border border-primary/20" : "bg-white/5 border border-white/10"}`}
                  >
                    {isAgent ? (
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[80%] ${isAgent ? "" : "items-end"} flex flex-col gap-1`}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground/60 font-medium">
                        {isAgent ? "LUNA" : "Visitor"}
                      </span>
                      {msg.time_in_call_secs !== undefined && (
                        <span className="text-[10px] text-muted-foreground/40">
                          {formatTime(msg.time_in_call_secs)}
                        </span>
                      )}
                    </div>
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isAgent ? "bg-primary/10 border border-primary/20 text-foreground rounded-tl-sm" : "bg-white/5 border border-white/10 text-muted-foreground rounded-tr-sm"}`}
                    >
                      {msg.message}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground/40 text-center pb-4">
        This conversation is stored anonymously. No visitor identifiers are retained.
      </p>
    </div>
  );
}
