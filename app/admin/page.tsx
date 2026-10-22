import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  AlertCircle,
} from "lucide-react";
import { deleteConversation } from "./actions";

export const metadata = {
  title: "Analytics Dashboard | Admin",
  robots: { index: false, follow: false },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Conversation {
  id: string;
  conversation_id: string;
  started_at: string | null;
  ended_at: string | null;
  duration_seconds: number | null;
  call_status: "success" | "failure" | "unknown" | null;
  summary_text: string | null;
  data_source: "webhook" | "api_fallback" | null;
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds: number | null): string {
  if (!seconds) return "—";
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function StatusBadge({ status }: { status: Conversation["call_status"] }) {
  if (status === "success")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
        <CheckCircle className="w-3 h-3" /> Success
      </span>
    );
  if (status === "failure")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
        <XCircle className="w-3 h-3" /> Failure
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
      <AlertCircle className="w-3 h-3" /> Unknown
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Re-validate user server-side inside the page as defence-in-depth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const adminUserId = process.env.ADMIN_USER_ID;
  if (!user || user.id !== adminUserId) redirect("/admin/login");

  // Fetch all conversations, newest first
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return (
      <div className="text-red-400 text-sm">
        Failed to load conversations: {error.message}
      </div>
    );
  }

  const rows = (conversations ?? []) as Conversation[];

  // ── Stats ──────────────────────────────────────────────────────────────────
  const total = rows.length;
  const successful = rows.filter((r) => r.call_status === "success").length;
  const avgDuration =
    rows.length > 0
      ? Math.round(
          rows.reduce((sum, r) => sum + (r.duration_seconds ?? 0), 0) /
            rows.length
        )
      : 0;
  const successRate = total > 0 ? Math.round((successful / total) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Conversation Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          LUNA voice conversations with portfolio visitors
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Conversations",
            value: total,
            icon: MessageSquare,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Successful",
            value: successful,
            icon: CheckCircle,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Avg Duration",
            value: formatDuration(avgDuration),
            icon: Clock,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            label: "Success Rate",
            value: `${successRate}%`,
            icon: CheckCircle,
            color: "text-violet-400",
            bg: "bg-violet-500/10",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div
              className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}
            >
              <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Conversations table */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Recent Conversations
          </h2>
          <span className="text-xs text-muted-foreground">{total} total</span>
        </div>

        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No conversations recorded yet.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Conversations will appear here after visitors talk to LUNA.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                    Date
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
                    Duration
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">
                    Summary
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">
                    Source
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((conv, i) => (
                  <tr
                    key={conv.id}
                    className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${i === rows.length - 1 ? "border-b-0" : ""}`}
                  >
                    <td className="px-6 py-4 text-foreground whitespace-nowrap">
                      <span className="text-xs text-muted-foreground block">
                        {formatDate(conv.started_at ?? conv.created_at)}
                      </span>
                      <span className="text-[10px] text-muted-foreground/50 font-mono">
                        {conv.conversation_id.slice(0, 16)}…
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground whitespace-nowrap text-xs">
                      {formatDuration(conv.duration_seconds)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={conv.call_status} />
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell max-w-xs">
                      <p className="text-xs text-muted-foreground truncate">
                        {conv.summary_text ?? "—"}
                      </p>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-[10px] text-muted-foreground/60 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        {conv.data_source ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/conversations/${conv.conversation_id}`}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                          title="View transcript"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <form action={deleteConversation}>
                          <input
                            type="hidden"
                            name="id"
                            value={conv.conversation_id}
                          />
                          <button
                            type="submit"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete conversation"
                            onClick={(e) => {
                              if (
                                !confirm(
                                  "Delete this conversation record? This cannot be undone."
                                )
                              ) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Privacy footer */}
      <p className="text-xs text-muted-foreground/40 text-center pb-4">
        All data is anonymised. No visitor identifiers are stored. Records can be
        deleted at any time using the delete button above.
      </p>
    </div>
  );
}
