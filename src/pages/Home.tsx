import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Bot,
  CheckCheck,
  ClipboardList,
  Clock3,
  FileText,
  ListTodo,
  Package,
  Plus,
  ShieldCheck,
  Truck,
  Wrench,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type Role = "admin" | "user";

export type RecordRow = {
  id: string;
  module: string;
  title: string;
  description?: string;
  location?: string;
  priority: "Low" | "Medium" | "High" | "Critical" | string;
  status: "Pending" | "Approved" | "Rejected" | "Completed" | string;
  created_at?: string;
};

type Props = {
  name?: string;
  role?: Role;
  department?: string;
  records?: RecordRow[];
  bannerImage?: string;
  onOpen?: (module: string) => void;
  onCreate?: (module: string) => void;
  onOpenGuide?: () => void;
  onToggleTasks?: () => void;
  onToggleAssistant?: () => void;
};

const moduleCards = [
  {
    id: "IR",
    title: "Incident Report",
    description: "Report incidents. Protect your people.",
    action: "Create IR",
    icon: AlertTriangle,
    openDirect: false,
  },
  {
    id: "NCR",
    title: "Non-Conformance Report",
    description: "Raise standards. Resolve deviations.",
    action: "Create NCR",
    icon: ShieldCheck,
    openDirect: false,
  },
  {
    id: "WO",
    title: "Work Orders",
    description: "Plan, assign, and get work done.",
    action: "Create WO",
    icon: Wrench,
    openDirect: false,
  },
  {
    id: "PR",
    title: "Purchase Requests",
    description: "Everything you need, properly approved.",
    action: "Create PR",
    icon: ShoppingCart,
    openDirect: false,
  },
  {
    id: "INV",
    title: "Invoicing Centre",
    description: "Keep your billing moving forward.",
    action: "Invoices",
    icon: FileText,
    openDirect: true,
  },
  {
    id: "RPT",
    title: "Reporting Centre",
    description: "Turn operational data into insight.",
    action: "Create a Report",
    icon: BarChart3,
    openDirect: true,
  },
  {
    id: "FMS",
    title: "Fleet Management",
    description: "A connected fleet. Ready for anything.",
    action: "Go to FMS",
    icon: Truck,
    openDirect: true,
  },
  {
    id: "IMS",
    title: "Inventory Management",
    description: "The right stock, in the right place.",
    action: "Go to IMS",
    icon: Package,
    openDirect: true,
  },
] as const;

function dashboardSummary(records: RecordRow[]) {
  const pending = records.filter((r) => r.status === "Pending");
  return {
    total: records.length,
    pending: pending.length,
    approved: records.filter(
      (r) => r.status === "Approved" || r.status === "Completed",
    ).length,
    rejected: records.filter((r) => r.status === "Rejected").length,
    priority: pending.filter(
      (r) => r.priority === "High" || r.priority === "Critical",
    ).length,
  };
}

export default function Home({
  role = "user",
  records = [],
  bannerImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80",
  onOpen,
  onCreate,
  onOpenGuide,
  onToggleTasks,
  onToggleAssistant,
}: Props) {
  const summary = dashboardSummary(records);
  const pending = records.filter((row) => row.status === "Pending");

  const metrics = [
    {
      label: role === "admin" ? "Team records" : "My records",
      value: summary.total,
      icon: ClipboardList,
    },
    {
      label: role === "admin" ? "Awaiting approval" : "Pending requests",
      value: summary.pending,
      icon: Clock3,
    },
    {
      label: "Approved & complete",
      value: summary.approved,
      icon: CheckCheck,
    },
    {
      label: "High-priority pending",
      value: summary.priority,
      icon: AlertTriangle,
    },
  ];

  const statusBreakdown = [
    { label: "Pending", value: summary.pending },
    { label: "Approved & completed", value: summary.approved },
    { label: "Rejected", value: summary.rejected },
  ];

  return (
    <main
      className="relative min-h-screen w-full bg-[#f5f6f8] dark:bg-background pb-24"
      aria-label="Operations and Incident Hub"
    >
      {/* Hero Banner */}
      <section className="relative h-72 sm:h-80 md:h-[360px] w-full overflow-hidden">
        <img
          src={bannerImage}
          alt="Operations campus and hub"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/50 to-black/65" />

        <div className="container relative mx-auto flex h-full flex-col items-center justify-center px-4 pb-10 sm:pb-14 text-center text-white">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-white/85">
            CONNECTED OPERATIONS. CONFIDENT DECISIONS.
          </span>

          <h1 className="mt-2 text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight drop-shadow-sm">
            Operations &amp; Incident Hub
          </h1>

          <p className="mt-2.5 max-w-xl text-xs sm:text-sm md:text-base text-white/90 leading-relaxed">
            One connected workspace for safer operations, smarter workflows, and
            everything your team needs to move forward.
          </p>

          <Button
            type="button"
            onClick={() => onOpenGuide?.()}
            className="mt-5 h-9 sm:h-10 rounded-md bg-[#e09f24] hover:bg-[#cf8f17] text-[#1e1b18] font-semibold px-4 sm:px-5 text-xs sm:text-sm shadow-md"
          >
            <BookOpen className="mr-1.5 size-4" />
            Platform Guide
            <ArrowUpRight className="ml-1 size-4" />
          </Button>
        </div>
      </section>

      {/* 8-Module Overlapping Card Grid */}
      <section className="container mx-auto px-4 -mt-12 sm:-mt-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {moduleCards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.id}
                className="flex min-h-48 sm:min-h-52 flex-col items-center justify-between rounded-xl border border-border/70 bg-gradient-to-b from-white via-white to-[#f2f0f7] dark:from-card dark:via-card dark:to-muted/40 p-5 sm:p-6 text-center shadow-md transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span className="inline-flex items-center gap-1.5 rounded-md border border-[#5a3e85]/25 bg-[#583b82]/5 dark:bg-purple-500/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-[#583b82] dark:text-purple-200">
                  <Icon className="size-3.5" aria-hidden="true" />
                  {card.id}
                </span>

                <div className="my-3">
                  <h2 className="text-base sm:text-lg font-bold text-[#1f2430] dark:text-foreground">
                    {card.title}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={() =>
                    card.openDirect ? onOpen?.(card.id) : onCreate?.(card.id)
                  }
                  className="h-9 rounded-full bg-[#583b82] hover:bg-[#472e6b] active:bg-[#3a2459] text-white text-xs font-semibold px-4 shadow-xs"
                >
                  {card.action}
                  <ArrowUpRight className="ml-1 size-3.5" />
                </Button>
              </article>
            );
          })}
        </div>
      </section>

      {/* Dashboard Metrics, Queue & Status */}
      <div className="container mx-auto px-4 mt-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
              Operational Overview
            </h2>
            <p className="text-sm text-muted-foreground">
              {role === "admin"
                ? "Team activity and approvals"
                : "Your requests and operational activity"}
            </p>
          </div>
          <Button
            onClick={() => onCreate?.("WO")}
            className="w-full sm:w-auto bg-[#583b82] hover:bg-[#472e6b] text-white"
          >
            <Plus className="mr-2 size-4" />
            New work order
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <article
                key={metric.label}
                className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-xs"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#583b82]/10 text-[#583b82] dark:bg-purple-500/15 dark:text-purple-300">
                  <Icon className="size-5" />
                </div>
                <div>
                  <strong className="block text-2xl font-bold leading-none">
                    {metric.value}
                  </strong>
                  <span className="mt-1 block text-xs sm:text-sm text-muted-foreground">
                    {metric.label}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Approval Queue & Request Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 rounded-xl border bg-card p-5 sm:p-6 shadow-xs">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold">
                <Clock3 className="size-5 text-[#583b82] dark:text-purple-300" />
                {role === "admin" ? "Approval queue" : "My pending requests"}
              </h2>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-[#583b82] dark:text-purple-300"
                onClick={() => onOpen?.("JCC")}
              >
                All records
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>

            {pending.length ? (
              <div className="divide-y">
                {pending.slice(0, 3).map((row) => (
                  <div
                    key={row.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <FileText className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <strong className="block truncate text-sm font-medium">
                          {row.title}
                        </strong>
                        <small className="block truncate text-xs text-muted-foreground">
                          {row.module} · {row.priority} priority
                        </small>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      aria-label={`View ${row.title}`}
                      onClick={() => onOpen?.(row.module)}
                    >
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-dashed p-5 text-muted-foreground">
                <CheckCheck className="size-6 shrink-0 text-[#583b82] dark:text-purple-300" />
                <div>
                  <strong className="block text-sm font-medium text-foreground">
                    No pending requests
                  </strong>
                  <p className="text-xs sm:text-sm">
                    {role === "admin"
                      ? "No submissions are awaiting review."
                      : "Your pending submissions will appear here."}
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-xl border bg-card p-5 sm:p-6 shadow-xs">
            <div className="mb-4 flex items-center gap-2">
              <ClipboardList className="size-5 text-[#583b82] dark:text-purple-300" />
              <h2 className="text-base sm:text-lg font-semibold">
                Request status
              </h2>
            </div>

            <div className="space-y-3">
              {statusBreakdown.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3 text-sm"
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  <strong className="text-base font-semibold">
                    {item.value}
                  </strong>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Floating Action Buttons: My Tasks (Bottom-Left) & AI Assistant (Bottom-Right) */}
      <Button
        type="button"
        onClick={() => onToggleTasks?.()}
        className="fixed bottom-4 left-4 z-30 h-11 rounded-full bg-[#583b82] hover:bg-[#472e6b] text-white pl-3.5 pr-2.5 text-xs sm:text-sm font-semibold shadow-lg"
      >
        <ListTodo className="mr-2 size-4" aria-hidden="true" />
        <span>My Tasks</span>
        <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#e09f24] px-1.5 text-xs font-bold text-[#1e1b18]">
          {pending.length}
        </span>
      </Button>

      <Button
        type="button"
        onClick={() => onToggleAssistant?.()}
        className="fixed bottom-4 right-4 z-30 h-11 rounded-full bg-[#583b82] hover:bg-[#472e6b] text-white pl-4 pr-3 text-xs sm:text-sm font-semibold shadow-lg"
      >
        <Bot className="mr-2 size-4" aria-hidden="true" />
        <span>AI Assistant</span>
        <span
          className="ml-2.5 inline-block size-2.5 rounded-full bg-emerald-400"
          aria-hidden="true"
        />
      </Button>
    </main>
  );
}
