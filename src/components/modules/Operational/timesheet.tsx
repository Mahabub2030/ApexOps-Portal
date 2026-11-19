import { useMemo, useState } from "react";
import { Check, FileSpreadsheet, Pencil, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export type AttendanceCode =
  | "P"
  | "Abs"
  | "AL"
  | "UL"
  | "SL"
  | "Hol"
  | "Off"
  | "Res";

export type DayEntry = {
  day: number;
  hrs: number;
  status: AttendanceCode;
};

export type TimesheetRecord = {
  id: string;
  name: string;
  position: string;
  department: string;
  iqama: string;
  empId: string;
  dammamId: string;
  approvalState: "Pending" | "Approved" | "Rejected";
  days: DayEntry[];
};

const DAYS_IN_MONTH = 31;

const attendanceCodes: { code: AttendanceCode; label: string }[] = [
  { code: "P", label: "Pending" },
  { code: "Abs", label: "Absent" },
  { code: "AL", label: "Annual Leave" },
  { code: "UL", label: "Unpaid Leave" },
  { code: "SL", label: "Sick Leave" },
  { code: "Hol", label: "Holiday" },
  { code: "Off", label: "Off duty" },
  { code: "Res", label: "Resigned" },
];

function buildDays(pattern: "regular" | "leave" | "mixed" | "ot"): DayEntry[] {
  return Array.from({ length: DAYS_IN_MONTH }, (_, idx) => {
    const day = idx + 1;
    const isFriday = day % 7 === 5;

    if (pattern === "leave" && day >= 10 && day <= 14) {
      return { day, hrs: 0, status: "AL" };
    }
    if (pattern === "mixed" && day === 8) {
      return { day, hrs: 0, status: "SL" };
    }
    if (pattern === "mixed" && day === 12) {
      return { day, hrs: 0, status: "Abs" };
    }
    if (isFriday) {
      return { day, hrs: 0, status: "Off" };
    }
    if (pattern === "ot" && (day === 3 || day === 9 || day === 16)) {
      return { day, hrs: 10, status: "P" };
    }
    if (day === 1) {
      return { day, hrs: 0, status: "Hol" };
    }
    return { day, hrs: 8, status: "P" };
  });
}

// Realistic dummy JSON dataset
// eslint-disable-next-line react-refresh/only-export-components
export const dummyTimesheets: TimesheetRecord[] = [
  {
    id: "TS-101",
    name: "Firoz Alam Mofiz",
    position: "Landscape Supervisor",
    department: "Grounds & Landscaping",
    iqama: "2458910234",
    empId: "EMP-4012",
    dammamId: "DM-8821",
    approvalState: "Pending",
    days: buildDays("ot"),
  },
  {
    id: "TS-102",
    name: "Mohammad Javeed",
    position: "Irrigation Technician",
    department: "Grounds & Landscaping",
    iqama: "2491038472",
    empId: "EMP-4019",
    dammamId: "DM-8829",
    approvalState: "Pending",
    days: buildDays("regular"),
  },
  {
    id: "TS-103",
    name: "Sojal Akkash",
    position: "Site Coordinator",
    department: "Grounds & Landscaping",
    iqama: "2510293847",
    empId: "EMP-4025",
    dammamId: "DM-8834",
    approvalState: "Pending",
    days: buildDays("mixed"),
  },
  {
    id: "TS-104",
    name: "Krishna Bomi",
    position: "Horticulture Specialist",
    department: "Grounds & Landscaping",
    iqama: "2439817263",
    empId: "EMP-4031",
    dammamId: "DM-8840",
    approvalState: "Pending",
    days: buildDays("leave"),
  },
  {
    id: "TS-105",
    name: "Abdullah Aldarweesh",
    position: "Operations Inspector",
    department: "Airside Facilities",
    iqama: "1087654321",
    empId: "EMP-3104",
    dammamId: "DM-7410",
    approvalState: "Approved",
    days: buildDays("regular"),
  },
  {
    id: "TS-106",
    name: "Reda Abdelmaged",
    position: "Senior Technician",
    department: "Maintenance Control",
    iqama: "2389104756",
    empId: "EMP-3188",
    dammamId: "DM-7492",
    approvalState: "Approved",
    days: buildDays("ot"),
  },
  {
    id: "TS-107",
    name: "Mohamed Elsayed",
    position: "Equipment Operator",
    department: "Fleet & Grounds",
    iqama: "2412098345",
    empId: "EMP-3210",
    dammamId: "DM-7520",
    approvalState: "Rejected",
    days: buildDays("mixed"),
  },
];

function getCodeBadgeStyle(code: AttendanceCode) {
  switch (code) {
    case "P":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
    case "Abs":
    case "UL":
      return "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300";
    case "AL":
    case "SL":
      return "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300";
    case "Hol":
      return "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300";
    case "Off":
      return "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    case "Res":
      return "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
  }
}

export default function Timesheet() {
  const [records, setRecords] = useState<TimesheetRecord[]>(dummyTimesheets);
  const [activeTab, setActiveTab] = useState<
    "Pending" | "Approved" | "Rejected"
  >("Pending");
  const [editMode, setEditMode] = useState(false);
  const [pageSize, setPageSize] = useState(15);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortAsc, setSortAsc] = useState(true);

  // Summary counts matching the screenshot sidebar
  const waitingForHrCount =
    records.filter((r) => r.approvalState === "Pending").length + 27;
  const approvedCount =
    records.filter((r) => r.approvalState === "Approved").length + 194;
  const totalFilteredPool = 1011;

  const filteredRecords = useMemo(() => {
    const list = records.filter((r) => r.approvalState === activeTab);
    return [...list].sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
    );
  }, [records, activeTab, sortAsc]);

  const visibleRows = filteredRecords.slice(0, pageSize);

  function getTotals(days: DayEntry[]) {
    const totalHol = days.filter((d) => d.status === "Hol").length;
    const totalHrs = days.reduce((acc, d) => acc + (Number(d.hrs) || 0), 0);
    const totalDays = days.filter((d) =>
      ["P", "Hol"].includes(d.status),
    ).length;
    return { totalHol, totalHrs, totalDays };
  }

  function handleApproveAllPending() {
    setRecords((prev) =>
      prev.map((row) =>
        row.approvalState === "Pending"
          ? { ...row, approvalState: "Approved" }
          : row,
      ),
    );
    toast.success("All pending timesheets approved by Senior Manager");
  }

  function handleBulkDecision(decision: "Approved" | "Rejected") {
    const targetIds = selectedIds.length
      ? selectedIds
      : visibleRows.map((r) => r.id);

    if (!targetIds.length) {
      toast.info("No rows available to update");
      return;
    }

    setRecords((prev) =>
      prev.map((row) =>
        targetIds.includes(row.id) ? { ...row, approvalState: decision } : row,
      ),
    );
    setSelectedIds([]);
    toast.success(`${targetIds.length} timesheet(s) marked as ${decision}`);
  }

  function handleDayEdit(
    recordId: string,
    dayNum: number,
    field: "hrs" | "status",
    value: string,
  ) {
    setRecords((prev) =>
      prev.map((row) => {
        if (row.id !== recordId) return row;
        return {
          ...row,
          days: row.days.map((d) => {
            if (d.day !== dayNum) return d;
            if (field === "hrs") {
              const parsed = Math.max(0, Math.min(24, Number(value) || 0));
              return { ...d, hrs: parsed };
            }
            return { ...d, status: value as AttendanceCode };
          }),
        };
      }),
    );
  }

  function toggleSelectRow(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  function toggleSelectAll() {
    if (selectedIds.length === visibleRows.length && visibleRows.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(visibleRows.map((r) => r.id));
    }
  }

  function handleExportCsv() {
    const dayHeaders = Array.from({ length: DAYS_IN_MONTH }, (_, i) => [
      `"Day ${i + 1} Hrs"`,
      `"Day ${i + 1} Status"`,
    ]).flat();

    const headers = [
      '"#"',
      '"Name"',
      '"Position"',
      '"Department"',
      '"Iqama"',
      '"ID#"',
      '"DammamID"',
      ...dayHeaders,
      '"TotalHol"',
      '"TotalHrs"',
      '"TotalDays"',
    ].join(",");

    const lines = visibleRows.map((r, index) => {
      const totals = getTotals(r.days);
      const dayCells = r.days
        .map((d) => [`"${d.hrs}"`, `"${d.status}"`])
        .flat();
      return [
        `"${index + 1}"`,
        `"${r.name}"`,
        `"${r.position}"`,
        `"${r.department}"`,
        `"${r.iqama}"`,
        `"${r.empId}"`,
        `"${r.dammamId}"`,
        ...dayCells,
        `"${totals.totalHol}"`,
        `"${totals.totalHrs}"`,
        `"${totals.totalDays}"`,
      ].join(",");
    });

    const blob = new Blob([[headers, ...lines].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `senior-manager-timesheet-${activeTab.toLowerCase()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Timesheet CSV downloaded");
  }

  return (
    <section
      aria-label="Senior Manager Timesheet Approval"
      className="min-h-screen w-full bg-[#f8f9fb] dark:bg-background pb-16"
    >
      {/* Top Gradient Title Bar */}
      <div className="w-full bg-gradient-to-r from-[#a8c7fa] via-[#c7b8ea] to-[#d8b4fe] dark:from-indigo-950 dark:via-purple-950 dark:to-purple-900 px-4 py-3 text-center shadow-2xs">
        <h1 className="text-base sm:text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Senior Manager Timesheet Approval
        </h1>
      </div>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-[1600px] px-3 sm:px-6 pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-5 items-start">
          {/* Left Sidebar */}
          <aside className="space-y-5">
            <div className="flex flex-row lg:flex-col gap-2.5">
              <Button
                type="button"
                onClick={handleApproveAllPending}
                className="h-auto flex-1 lg:flex-none rounded-md bg-[#d4a243] hover:bg-[#c18f31] text-white font-semibold px-4 py-2.5 text-xs sm:text-sm leading-snug shadow-xs"
              >
                Senior Manager approve all
              </Button>

              <Button
                type="button"
                onClick={() => {
                  setEditMode((prev) => !prev);
                  toast.info(
                    !editMode
                      ? "Inline timesheet editing enabled"
                      : "Inline timesheet editing saved",
                  );
                }}
                className={`h-9 flex-1 lg:flex-none rounded-md font-semibold px-4 text-xs sm:text-sm shadow-xs ${
                  editMode
                    ? "bg-[#58377a] hover:bg-[#462a63] text-white"
                    : "bg-[#d4a243] hover:bg-[#c18f31] text-white"
                }`}
              >
                <Pencil className="mr-1.5 size-3.5" />
                {editMode ? "Done Editing" : "Edit Timesheet"}
              </Button>
            </div>

            {/* Approval Count Summary Table */}
            <div className="rounded-md border border-border bg-card shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b bg-muted/40 text-[#4c1d95] dark:text-purple-300 font-semibold">
                    <th className="px-3 py-2">Approval</th>
                    <th className="px-3 py-2 text-right">Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="bg-muted/60">
                    <td className="px-3 py-2 font-medium text-foreground">
                      waiting for HR...
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-foreground">
                      {waitingForHrCount}
                    </td>
                  </tr>
                  <tr className="bg-card">
                    <td className="px-3 py-2 font-semibold text-emerald-700 dark:text-emerald-400">
                      Approve
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-foreground">
                      {approvedCount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Attendance Codes Legend */}
            <div className="space-y-1.5 px-1 text-xs">
              <div className="flex items-center justify-between font-bold text-foreground">
                <span>• Attendance codes:</span>
                {editMode && (
                  <button
                    type="button"
                    onClick={() => setRecords(dummyTimesheets)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[#58377a] dark:text-purple-300 hover:underline"
                  >
                    <RotateCcw className="size-3" />
                    Reset
                  </button>
                )}
              </div>
              <ul className="space-y-1 pl-3 text-muted-foreground">
                {attendanceCodes.map((item) => (
                  <li key={item.code} className="leading-snug">
                    <strong className="font-semibold text-foreground">
                      {item.code}
                    </strong>{" "}
                    – {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Right Main Workspace */}
          <div className="min-w-0 space-y-4">
            {/* Top Status Filter Tabs: Pending / Approve / Reject */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("Pending")}
                className={`h-8 rounded border px-4 text-xs sm:text-sm font-semibold transition-colors ${
                  activeTab === "Pending"
                    ? "border-[#58377a] bg-[#58377a] text-white"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                Pending
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("Approved")}
                className={`h-8 rounded border px-4 text-xs sm:text-sm font-semibold transition-colors ${
                  activeTab === "Approved"
                    ? "border-[#58377a] bg-[#58377a] text-white"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                Approve
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("Rejected")}
                className={`h-8 rounded border px-4 text-xs sm:text-sm font-semibold transition-colors ${
                  activeTab === "Rejected"
                    ? "border-[#58377a] bg-[#58377a] text-white"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                Reject
              </button>

              {selectedIds.length > 0 && (
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleBulkDecision("Approved")}
                    className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                  >
                    <Check className="mr-1 size-3.5" />
                    Approve ({selectedIds.length})
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkDecision("Rejected")}
                    className="h-8 text-xs"
                  >
                    <X className="mr-1 size-3.5" />
                    Reject ({selectedIds.length})
                  </Button>
                </div>
              )}
            </div>

            {/* Table Card */}
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs">
              {/* Top Right Actions: CSV & Edit */}
              <div className="mb-3 flex items-center justify-end gap-4 text-xs text-muted-foreground">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <FileSpreadsheet className="size-3.5" />
                  <span>CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode((prev) => !prev)}
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <Pencil className="size-3.5" />
                  <span>{editMode ? "Save" : "Edit"}</span>
                </button>
              </div>

              {/* Show Entries Selector */}
              <div className="mb-4 flex items-center gap-2 text-xs text-foreground">
                <span>Show</span>
                <select
                  aria-label="Show entries"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="h-7 rounded border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {[10, 15, 25, 50].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <span>entries</span>
              </div>

              {/* Horizontally Scrollable Matrix Table */}
              <div className="w-full overflow-x-auto rounded border border-border">
                <table className="w-full min-w-[2600px] border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b bg-muted/40 text-[#4c1d95] dark:text-purple-300 font-semibold">
                      <th className="sticky left-0 z-20 w-9 border-r bg-muted/95 px-2 py-2.5 text-center backdrop-blur-xs">
                        <input
                          type="checkbox"
                          aria-label="Select all rows"
                          checked={
                            visibleRows.length > 0 &&
                            selectedIds.length === visibleRows.length
                          }
                          onChange={toggleSelectAll}
                          className="size-3.5 rounded border-input"
                        />
                      </th>
                      <th className="border-r px-2.5 py-2.5 text-center whitespace-nowrap">
                        #
                      </th>
                      <th className="border-r px-3 py-2.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSortAsc((prev) => !prev)}
                          className="inline-flex items-center gap-1 hover:opacity-80"
                        >
                          <span>Name</span>
                          <span className="text-[10px]">
                            {sortAsc ? "▴" : "▾"}
                          </span>
                        </button>
                      </th>
                      <th className="border-r px-3 py-2.5 whitespace-nowrap">
                        Position
                      </th>
                      <th className="border-r px-3 py-2.5 whitespace-nowrap">
                        Department
                      </th>
                      <th className="border-r px-3 py-2.5 whitespace-nowrap">
                        Iqama
                      </th>
                      <th className="border-r px-3 py-2.5 whitespace-nowrap">
                        ID#
                      </th>
                      <th className="border-r px-3 py-2.5 whitespace-nowrap">
                        DammamID
                      </th>

                      {Array.from({ length: DAYS_IN_MONTH }, (_, i) => {
                        const dayNum = i + 1;
                        return (
                          <th
                            key={dayNum}
                            colSpan={2}
                            className="border-r px-2 py-2 text-center whitespace-nowrap"
                          >
                            {dayNum}
                          </th>
                        );
                      })}

                      <th className="border-r px-3 py-2.5 text-center whitespace-nowrap">
                        TotalHol
                      </th>
                      <th className="border-r px-3 py-2.5 text-center whitespace-nowrap">
                        TotalHrs
                      </th>
                      <th className="px-3 py-2.5 text-center whitespace-nowrap">
                        TotalDays
                      </th>
                    </tr>

                    {/* Sub-header for Hrs. and Status per day */}
                    <tr className="border-b bg-muted/20 text-[11px] font-medium text-muted-foreground">
                      <th className="sticky left-0 z-20 border-r bg-muted/95" />
                      <th className="border-r" />
                      <th className="border-r" />
                      <th className="border-r" />
                      <th className="border-r" />
                      <th className="border-r" />
                      <th className="border-r" />
                      <th className="border-r" />
                      {Array.from({ length: DAYS_IN_MONTH }, (_, i) => (
                        <th
                          key={i}
                          colSpan={2}
                          className="border-r px-1 py-1 text-center"
                        >
                          <div className="grid grid-cols-2 divide-x divide-border/70">
                            <span>Hrs.</span>
                            <span>Status</span>
                          </div>
                        </th>
                      ))}
                      <th className="border-r px-2 py-1 text-center">Hol</th>
                      <th className="border-r px-2 py-1 text-center">Hrs</th>
                      <th className="px-2 py-1 text-center">Days</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {visibleRows.length ? (
                      visibleRows.map((row, idx) => {
                        const totals = getTotals(row.days);
                        const isChecked = selectedIds.includes(row.id);

                        return (
                          <tr
                            key={row.id}
                            className="odd:bg-background even:bg-muted/20 hover:bg-muted/40 transition-colors"
                          >
                            <td className="sticky left-0 z-10 border-r bg-card px-2 py-2 text-center">
                              <input
                                type="checkbox"
                                aria-label={`Select ${row.name}`}
                                checked={isChecked}
                                onChange={() => toggleSelectRow(row.id)}
                                className="size-3.5 rounded border-input"
                              />
                            </td>
                            <td className="border-r px-2.5 py-2 text-center font-medium">
                              {idx + 1}
                            </td>
                            <td className="border-r px-3 py-2 font-medium whitespace-nowrap">
                              {row.name}
                            </td>
                            <td className="border-r px-3 py-2 whitespace-nowrap text-muted-foreground">
                              {row.position}
                            </td>
                            <td className="border-r px-3 py-2 whitespace-nowrap text-muted-foreground">
                              {row.department}
                            </td>
                            <td className="border-r px-3 py-2 whitespace-nowrap font-mono text-[11px]">
                              {row.iqama}
                            </td>
                            <td className="border-r px-3 py-2 whitespace-nowrap">
                              {row.empId}
                            </td>
                            <td className="border-r px-3 py-2 whitespace-nowrap">
                              {row.dammamId}
                            </td>

                            {row.days.map((d) => (
                              <td
                                key={d.day}
                                colSpan={2}
                                className="border-r px-1 py-1.5 text-center whitespace-nowrap"
                              >
                                <div className="grid grid-cols-2 items-center gap-1">
                                  {editMode ? (
                                    <input
                                      type="number"
                                      min={0}
                                      max={24}
                                      aria-label={`${row.name} day ${d.day} hours`}
                                      value={d.hrs}
                                      onChange={(e) =>
                                        handleDayEdit(
                                          row.id,
                                          d.day,
                                          "hrs",
                                          e.target.value,
                                        )
                                      }
                                      className="h-6 w-11 rounded border border-input bg-background px-1 text-center text-[11px]"
                                    />
                                  ) : (
                                    <span className="text-[11px] font-medium">
                                      {d.hrs}
                                    </span>
                                  )}

                                  {editMode ? (
                                    <select
                                      aria-label={`${row.name} day ${d.day} status`}
                                      value={d.status}
                                      onChange={(e) =>
                                        handleDayEdit(
                                          row.id,
                                          d.day,
                                          "status",
                                          e.target.value,
                                        )
                                      }
                                      className="h-6 rounded border border-input bg-background px-0.5 text-[10px]"
                                    >
                                      {attendanceCodes.map((c) => (
                                        <option key={c.code} value={c.code}>
                                          {c.code}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <span
                                      className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${getCodeBadgeStyle(
                                        d.status,
                                      )}`}
                                    >
                                      {d.status}
                                    </span>
                                  )}
                                </div>
                              </td>
                            ))}

                            <td className="border-r px-3 py-2 text-center font-semibold">
                              {totals.totalHol}
                            </td>
                            <td className="border-r px-3 py-2 text-center font-semibold">
                              {totals.totalHrs}
                            </td>
                            <td className="px-3 py-2 text-center font-semibold">
                              {totals.totalDays}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={11 + DAYS_IN_MONTH * 2}
                          className="px-4 py-8 text-center text-sm text-muted-foreground"
                        >
                          No {activeTab.toLowerCase()} timesheet entries in this
                          view.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer Summary Line */}
              <div className="mt-3 text-xs text-muted-foreground">
                Showing {visibleRows.length} of {filteredRecords.length} entries
                (Filtered from {totalFilteredPool.toLocaleString()} total
                entries)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
