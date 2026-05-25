import { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";
import { Bot, Send, Sparkles, Clock, AlertTriangle, Users, FileText } from "lucide-react";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  { icon: Clock, text: "What's my priority today?" },
  { icon: AlertTriangle, text: "Show me overdue items" },
  { icon: Users, text: "How is my team's workload?" },
  { icon: FileText, text: "Brief me on Gujarat Ceramics" },
];

export function AiBriefingPage() {
  const { currentUser } = useAppSelector((state) => state.auth);
  const assignments = useAppSelector((state) => state.assignments.items);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showBriefing, setShowBriefing] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const today = new Date().toISOString().split("T")[0];
  const overdue = assignments.filter((a) => a.dueDate < today && !["completed", "closed"].includes(a.status));
  const dueThisWeek = assignments.filter((a) => {
    const due = new Date(a.dueDate);
    const now = new Date();
    const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return due >= now && due <= weekEnd && !["completed", "closed"].includes(a.status);
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  function getAiResponse(question: string): string {
    const q = question.toLowerCase();

    if (q.includes("priority") || q.includes("today") || q.includes("morning")) {
      return `Good morning, ${currentUser.name.split(" ")[0]}! Here's your priority summary:

**🔴 Immediate Attention (${overdue.length} overdue):**
${overdue.map((a) => `• ${a.clientName} — ${a.serviceName} (was due ${a.dueDate})`).join("\n")}

**📋 Coming Up This Week (${dueThisWeek.length} items):**
${dueThisWeek.length > 0 ? dueThisWeek.map((a) => `• ${a.clientName} — ${a.serviceName} (due ${a.dueDate})`).join("\n") : "No items due this week."}

**💡 Recommendation:** Focus on the Gujarat Ceramics GST query first — it's blocking the return filing and the client has a history of late penalties.`;
    }

    if (q.includes("overdue")) {
      if (overdue.length === 0) return "Great news! There are no overdue items currently. Your team is on track. 🎉";
      return `You have **${overdue.length} overdue item(s)**:

${overdue.map((a) => `**${a.clientName}** — ${a.serviceName}
  • Period: ${a.period}
  • Assigned to: ${a.assigneeName}
  • Was due: ${a.dueDate}
  • Status: ${a.status.replace(/_/g, " ")}
  • Risk: ${a.status === "query_raised" ? "⚠️ Blocked on client response" : "🔴 Needs immediate action"}`).join("\n\n")}

**Suggested action:** I recommend calling ${overdue[0].assigneeName} for a quick status update and setting a revised deadline.`;
    }

    if (q.includes("workload") || q.includes("team") || q.includes("staff")) {
      const staffStats = [
        { name: "Meera Joshi", id: "u10" },
        { name: "Rahul Trivedi", id: "u7" },
        { name: "Vishal Shah", id: "u9" },
        { name: "Pooja Bhatt", id: "u8" },
        { name: "Darshan Prajapati", id: "u11" },
      ].map((s) => ({
        ...s,
        active: assignments.filter((a) => a.assigneeId === s.id && !["completed", "closed"].includes(a.status)).length,
        completed: assignments.filter((a) => a.assigneeId === s.id && a.status === "completed").length,
      }));

      const overloaded = staffStats.filter((s) => s.active >= 3);
      const available = staffStats.filter((s) => s.active < 2);

      return `**Team Workload Analysis:**

${staffStats.map((s) => `• **${s.name}** — ${s.active} active, ${s.completed} completed ${s.active >= 3 ? "⚠️ Heavy" : "✅ OK"}`).join("\n")}

${overloaded.length > 0 ? `\n**⚠️ Overloaded:** ${overloaded.map((s) => s.name).join(", ")} — consider redistributing.` : ""}
${available.length > 0 ? `\n**Available capacity:** ${available.map((s) => s.name).join(", ")} — can take on new assignments.` : ""}

**Insight:** Meera has 2 active audits (Shreeji Industries & Balaji Infra). Both have June deadlines. Consider assigning the Balaji audit planning to someone with capacity.`;
    }

    if (q.includes("gujarat ceramics") || q.includes("ceramics")) {
      return `**Client Brief: Gujarat Ceramics Ltd**

📊 **Status Summary:**
• Active assignments: 1 (GST Return - April 2026)
• Current status: **Query Raised** ⚠️
• Assigned to: Vishal Shah | Reviewer: Sneha Desai

📋 **Current Issue:**
A credit note from vendor ABC is missing in their GSTR-1. Vishal raised a query on May 18 — the team decided not to claim ITC until the vendor confirms.

📞 **Action Required:**
Client needs to follow up with their vendor. If unresolved by May 25, we risk a late filing penalty (₹50/day under Section 47).

📈 **Client History:**
• Entity: Pvt Ltd | GSTIN: 24AABCG9012C1Z1
• Services: Statutory Audit, GST Return, Accounting
• Office: Ahmedabad
• Total assignments this year: 10
• Payment history: Generally on time

💡 **AI Suggestion:** Send a reminder email to Suresh Modi (contact person) today. If no response by EOD tomorrow, escalate to partner Amit Patel for client call.`;
    }

    if (q.includes("shreeji") || q.includes("industries")) {
      return `**Client Brief: Shreeji Industries Pvt Ltd**

📊 **Status Summary:**
• Active assignment: Statutory Audit (FY 2025-26)
• Status: **In Progress** 🟡
• Assigned to: Meera Joshi | Reviewer: Ketan Mehta
• Due: June 30, 2026 (36 days remaining)

📋 **Progress:**
• ✅ Trial balance collected and reviewed
• ✅ Fixed assets register verified
• ⬜ Bank reconciliation review (pending)
• ⬜ Audit report draft (pending)
• Time spent so far: 7 hours

⚠️ **Reviewer Note (May 18):**
Ketan flagged an inconsistency in inventory valuation method vs. last year. This needs to be resolved before the report can be drafted.

📈 **Group Info:**
Part of Shreeji Group (also includes Charotar Developers). Group contact: Bhavesh Patel.

💡 **AI Suggestion:** Schedule a 30-min call with Meera to discuss the inventory valuation issue. If they changed from FIFO to weighted average, we need a disclosure note in the audit report.`;
    }

    if (q.includes("compliance") || q.includes("deadline") || q.includes("calendar")) {
      return `**Upcoming Compliance Calendar:**

**May 2026:**
• GST Returns (GSTR-3B) — Due May 20 ✅ (NK Enterprises filed)
• TDS Return Q4 — Due May 15 ⚠️ (Anand Textiles under review)

**June 2026:**
• Accounting close (Sunshine Pharma) — Due Jun 10
• Statutory Audit (Shreeji Industries) — Due Jun 30
• Statutory Audit (Balaji Infra) — Due Jun 15

**July 2026:**
• ITR Filing season begins
• Patel & Sons LLP — ITR due Jul 31
• Mehsana Dairy Co-op — ITR due Jul 31
• Rajendra Shah HUF — ITR due Jul 31

**💡 Tip:** July will be heavy with 3+ ITR filings. I suggest starting computation work for Patel & Sons and Rajendra Shah in early June to avoid last-minute rush.`;
    }

    return `I can help you with:
• **Priority briefing** — what needs attention today
• **Overdue alerts** — items past their deadline
• **Team workload** — who's overloaded, who has capacity
• **Client briefs** — detailed status on any client (try "Brief me on Gujarat Ceramics")
• **Compliance calendar** — upcoming deadlines

What would you like to know?`;
  }

  async function handleSend(text?: string) {
    const question = text || input;
    if (!question.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: question,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setShowBriefing(false);

    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1500));

    const response = getAiResponse(question);
    const aiMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: response,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };
    setIsTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="rounded-lg bg-gradient-to-br from-primary to-blue-600 p-2.5">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            AI Practice Assistant
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Online</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Your intelligent briefing & query assistant
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-4">
        {/* Morning Briefing Card */}
        {showBriefing && messages.length === 0 && (
          <div className="rounded-xl border bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Morning Briefing</span>
            </div>
            <p className="text-sm mb-1">
              Good morning, <strong>{currentUser.name.split(" ")[0]}</strong>! Here's your snapshot:
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="rounded-lg bg-white/80 p-3 border">
                <p className="text-xs text-muted-foreground">Overdue Items</p>
                <p className={cn("text-xl font-bold", overdue.length > 0 ? "text-red-600" : "text-green-600")}>{overdue.length}</p>
              </div>
              <div className="rounded-lg bg-white/80 p-3 border">
                <p className="text-xs text-muted-foreground">Due This Week</p>
                <p className="text-xl font-bold text-yellow-600">{dueThisWeek.length}</p>
              </div>
              <div className="rounded-lg bg-white/80 p-3 border">
                <p className="text-xs text-muted-foreground">Active Work</p>
                <p className="text-xl font-bold text-primary">{assignments.filter((a) => !["completed", "closed"].includes(a.status)).length}</p>
              </div>
            </div>
            {overdue.length > 0 && (
              <div className="mt-3 rounded-lg bg-red-50 border border-red-100 p-3">
                <p className="text-xs font-medium text-red-700 mb-1">⚠️ Needs Attention:</p>
                {overdue.slice(0, 2).map((a) => (
                  <p key={a.id} className="text-xs text-red-600">• {a.clientName} — {a.serviceName} (due {a.dueDate})</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[85%] rounded-xl px-4 py-3", msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {formatMessage(msg.content)}
              </div>
              <p className={cn("mt-1 text-xs", msg.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground")}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="rounded-xl bg-muted px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-xs text-muted-foreground">Analyzing your practice data...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      {messages.length < 2 && (
        <div className="border-t pt-3 pb-2">
          <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q.text}
                onClick={() => handleSend(q.text)}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
              >
                <q.icon className="h-3 w-3 text-muted-foreground" />
                {q.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t pt-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask about clients, deadlines, workload..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            disabled={isTyping}
            className="flex-1 rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={isTyping || !input.trim()}
            className="rounded-lg bg-primary px-4 py-2.5 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function formatMessage(content: string) {
  return content.split("\n").map((line, i) => {
    let formatted = line;
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    if (line.startsWith("• ") || line.startsWith("- ")) {
      return <p key={i} className="ml-2" dangerouslySetInnerHTML={{ __html: formatted }} />;
    }
    return <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} />;
  });
}
