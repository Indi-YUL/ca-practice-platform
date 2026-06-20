import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAssignmentsQuery } from "@/store/api/assignmentApi";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, CalendarDays, List } from "lucide-react";

const COMPLIANCE_DATES = [
  { day: 7, label: "TDS Payment", dept: "Income Tax & TDS", recurring: "monthly" },
  { day: 11, label: "GSTR-1 Due", dept: "GST & Consultancy", recurring: "monthly" },
  { day: 20, label: "GSTR-3B Due", dept: "GST & Consultancy", recurring: "monthly" },
  { day: 15, label: "TDS Return (Quarterly)", dept: "Income Tax & TDS", recurring: "quarterly", months: [4, 7, 10, 1] },
];

type ViewMode = "calendar" | "timeline";

export function CalendarPage() {
  const { data: assignments = [] } = useGetAssignmentsQuery();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewMode>("calendar");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  function prevMonth() { setCurrentDate(new Date(year, month - 1, 1)); }
  function nextMonth() { setCurrentDate(new Date(year, month + 1, 1)); }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  function getDeadlinesForDay(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const assignmentDeadlines = assignments
      .filter((a) => a.dueDate === dateStr && !["billed"].includes(a.status))
      .map((a) => ({ label: `${a.clientName} - ${a.serviceName}`, dept: "", type: "assignment" as const, id: a.id, priority: a.priority }));

    const compliance = COMPLIANCE_DATES
      .filter((c) => c.day === day && (!c.months || c.months.includes(month + 1)))
      .map((c) => ({ label: c.label, dept: c.dept, type: "compliance" as const, id: "", priority: "medium" as const }));

    return [...compliance, ...assignmentDeadlines];
  }

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Timeline view data
  const allDeadlines = assignments
    .filter((a) => !["billed"].includes(a.status))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const overdue = allDeadlines.filter((a) => a.dueDate < todayStr);
  const thisWeek = allDeadlines.filter((a) => {
    const d = new Date(a.dueDate);
    const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return d >= today && d <= weekEnd;
  });
  const nextWeek = allDeadlines.filter((a) => {
    const d = new Date(a.dueDate);
    const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const twoWeeks = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    return d > weekEnd && d <= twoWeeks;
  });
  const later = allDeadlines.filter((a) => {
    const d = new Date(a.dueDate);
    const twoWeeks = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    return d > twoWeeks;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Compliance Calendar</h1>
          <p className="text-sm text-muted-foreground">Deadlines, due dates & compliance schedule</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border p-1">
          <button onClick={() => setView("calendar")} className={cn("rounded-md px-3 py-1.5 text-sm font-medium", view === "calendar" ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
            <CalendarDays className="h-4 w-4" />
          </button>
          <button onClick={() => setView("timeline")} className={cn("rounded-md px-3 py-1.5 text-sm font-medium", view === "timeline" ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {view === "calendar" ? (
        <div className="rounded-lg border bg-card">
          {/* Month navigation */}
          <div className="flex items-center justify-between border-b p-4">
            <button onClick={prevMonth} className="rounded-lg p-2 hover:bg-muted"><ChevronLeft className="h-4 w-4" /></button>
            <h2 className="text-lg font-semibold">
              {currentDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </h2>
            <button onClick={nextMonth} className="rounded-lg p-2 hover:bg-muted"><ChevronRight className="h-4 w-4" /></button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="p-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[80px] border-b border-r p-1" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const deadlines = getDeadlinesForDay(day);
              const isToday = dateStr === todayStr;
              return (
                <div key={day} className={cn("min-h-[80px] border-b border-r p-1", isToday && "bg-primary/5")}>
                  <span className={cn("inline-flex h-6 w-6 items-center justify-center rounded-full text-xs", isToday && "bg-primary text-primary-foreground font-bold")}>
                    {day}
                  </span>
                  <div className="mt-0.5 space-y-0.5">
                    {deadlines.slice(0, 3).map((d, idx) => (
                      <div key={idx} className={cn("truncate rounded px-1 py-0.5 text-[10px] font-medium",
                        d.type === "compliance" ? "bg-blue-100 text-blue-700" :
                        d.priority === "high" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      )}>
                        {d.label}
                      </div>
                    ))}
                    {deadlines.length > 3 && <p className="text-[10px] text-muted-foreground px-1">+{deadlines.length - 3} more</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {overdue.length > 0 && (
            <TimelineSection title="Overdue" badge={`${overdue.length}`} badgeColor="bg-red-100 text-red-700" items={overdue} />
          )}
          <TimelineSection title="This Week" badge={`${thisWeek.length}`} badgeColor="bg-yellow-100 text-yellow-700" items={thisWeek} />
          <TimelineSection title="Next Week" badge={`${nextWeek.length}`} badgeColor="bg-blue-100 text-blue-700" items={nextWeek} />
          {later.length > 0 && (
            <TimelineSection title="Later" badge={`${later.length}`} badgeColor="bg-gray-100 text-gray-700" items={later} />
          )}
        </div>
      )}
    </div>
  );
}

function TimelineSection({ title, badge, badgeColor, items }: {
  title: string; badge: string; badgeColor: string; items: { id: string; clientName: string; serviceName: string; dueDate: string; assigneeName: string; priority: string }[];
}) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center gap-2 border-b p-4">
        <h2 className="font-semibold">{title}</h2>
        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", badgeColor)}>{badge}</span>
      </div>
      <div className="divide-y">
        {items.map((a) => (
          <Link key={a.id} to={`/assignments/${a.id}`} className="flex items-center justify-between p-4 hover:bg-muted/50">
            <div>
              <p className="text-sm font-medium">{a.clientName}</p>
              <p className="text-xs text-muted-foreground">{a.serviceName} · {a.assigneeName}</p>
            </div>
            <div className="text-right">
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium",
                a.priority === "high" ? "bg-red-100 text-red-700" : a.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
              )}>{a.priority}</span>
              <p className="mt-1 text-xs text-muted-foreground">{a.dueDate}</p>
            </div>
          </Link>
        ))}
        {items.length === 0 && <p className="p-4 text-sm text-muted-foreground">No items.</p>}
      </div>
    </div>
  );
}
