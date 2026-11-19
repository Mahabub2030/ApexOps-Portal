import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Check,
  ClipboardList,
  Columns3,
  Copy,
  FilePlus2,
  FileSpreadsheet,
  FileText,
  Filter,
  History,
  Printer,
  RotateCcw,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type WoPrRecord = {
  id: string;
  count: number;
  type: "WO" | "PR" | "LEGACY";
  contract: string;
  title: string;
  requestorName: string;
  srRefNo: string;
  prRefNo?: string;
  isLinked: "Yes" | "No";
  srCategory: string;
  dateCreated: string; // ISO date e.g. "2026-11-19"
  facility: string;
  department: string;
  srStatus:
    | "Pending"
    | "Approved"
    | "Cancelled"
    | "Rejected"
    | "Completed"
    | string;
  assignedBuyer?: string;
  description?: string;
};

type ColumnKey =
  | "count"
  | "contract"
  | "title"
  | "requestorName"
  | "srRefNo"
  | "prRefNo"
  | "isLinked"
  | "srCategory"
  | "dateCreated"
  | "facility"
  | "department"
  | "srStatus"
  | "assignedBuyer";

const columnDefs: { key: ColumnKey; label: string }[] = [
  { key: "count", label: "Count" },
  { key: "contract", label: "Contract" },
  { key: "title", label: "Title" },
  { key: "requestorName", label: "Requestor Name" },
  { key: "srRefNo", label: "SR Ref. No." },
  { key: "prRefNo", label: "PR Ref No." },
  { key: "isLinked", label: "Is Linked" },
  { key: "srCategory", label: "SR Category" },
  { key: "dateCreated", label: "Date Created" },
  { key: "facility", label: "Facility" },
  { key: "department", label: "Department" },
  { key: "srStatus", label: "SR Status" },
  { key: "assignedBuyer", label: "Assigned Buyer" },
];

const initialRecords: WoPrRecord[] = [
  {
    id: "749",
    count: 749,
    type: "WO",
    contract: "SAFARI-KFIA",
    title: "Smoke Detectors 24VDC Conv...",
    requestorName: "Salamat Khan",
    srRefNo: "WO-SAF-26-100-707",
    prRefNo: "",
    isLinked: "No",
    srCategory: "Street Buying",
    dateCreated: "2026-11-19",
    facility: "Main Terminal",
    department: "Airport Mechanical System",
    srStatus: "Pending",
    assignedBuyer: "N/A",
  },
  {
    id: "748",
    count: 748,
    type: "WO",
    contract: "SAFARI-KFIA",
    title: "Electrical Material for Providing...",
    requestorName: "MOHAMMAD MONIS ZUBAIR",
    srRefNo: "WO-SAF-26-100-706",
    prRefNo: "",
    isLinked: "No",
    srCategory: "Request for Quotation (RFQ)",
    dateCreated: "2026-11-19",
    facility: "Main Terminal",
    department: "Airport Terminals & Facilities",
    srStatus: "Pending",
    assignedBuyer: "N/A",
  },
  {
    id: "747",
    count: 747,
    type: "WO",
    contract: "SAFARI-KFIA",
    title: "Replacement of defective parts...",
    requestorName: "Mirza Rafiq Baig",
    srRefNo: "WO-SAF-26-100-705",
    prRefNo: "",
    isLinked: "No",
    srCategory: "Street Buying",
    dateCreated: "2026-11-17",
    facility: "Admin Building",
    department: "Airport Mechanical System",
    srStatus: "Pending",
    assignedBuyer: "N/A",
  },
  {
    id: "746",
    count: 746,
    type: "WO",
    contract: "SAFARI-KFIA",
    title: "Supply Order for high mast ligh...",
    requestorName: "Karel Soluta",
    srRefNo: "WO-SAF-26-100-704",
    prRefNo: "",
    isLinked: "No",
    srCategory: "Request for Quotation (RFQ)",
    dateCreated: "2026-11-16",
    facility: "Airside",
    department: "Aerodrome Maintenance",
    srStatus: "Pending",
    assignedBuyer: "N/A",
  },
  {
    id: "745",
    count: 745,
    type: "WO",
    contract: "SAFARI-KFIA",
    title: "Supply Request of Drainage C...",
    requestorName: "Awais Ahmad",
    srRefNo: "WO-SAF-26-100-703",
    prRefNo: "",
    isLinked: "No",
    srCategory: "Request for Quotation (RFQ)",
    dateCreated: "2026-11-16",
    facility: "Airside",
    department: "Aerodrome Maintenance",
    srStatus: "Approved",
    assignedBuyer: "Mazaharuddin Mohammed",
  },
  {
    id: "744",
    count: 744,
    type: "WO",
    contract: "SAFARI-KFIA",
    title: "Service Contract: Repair and r...",
    requestorName: "Dennis Yohanon",
    srRefNo: "WO-SAF-26-100-702",
    prRefNo: "",
    isLinked: "No",
    srCategory: "Request for Quotation (RFQ)",
    dateCreated: "2026-11-15",
    facility: "Storm Drainage System 2 (UKD #2)",
    department: "Aerodrome Maintenance",
    srStatus: "Approved",
    assignedBuyer: "Walid Elsayed",
  },
  {
    id: "743",
    count: 743,
    type: "PR",
    contract: "SAFARI-KFIA",
    title: "EDR-8010-2GSFP-T Router",
    requestorName: "Faisal Alqahtani",
    srRefNo: "PR-SAF-26-100-701",
    prRefNo: "PR-26-701",
    isLinked: "Yes",
    srCategory: "Long Lead Items",
    dateCreated: "2026-11-15",
    facility: "Main Terminal",
    department: "Airport Terminals & Facilities",
    srStatus: "Pending",
    assignedBuyer: "N/A",
  },
  {
    id: "742",
    count: 742,
    type: "PR",
    contract: "SAFARI-KFIA",
    title: "Glass Beads for All KFIA Road...",
    requestorName: "SHER SHAH",
    srRefNo: "PR-SAF-26-100-700",
    prRefNo: "PR-26-700",
    isLinked: "Yes",
    srCategory: "Street Buying",
    dateCreated: "2026-11-15",
    facility: "Main Terminal",
    department: "Grounds & Landscaping",
    srStatus: "Approved",
    assignedBuyer: "Mahmoud Ahmed",
  },
  {
    id: "612",
    count: 612,
    type: "LEGACY",
    contract: "NABATAT-KFIA",
    title: "Legacy Irrigation Pump Overhaul",
    requestorName: "Mahabub Alam",
    srRefNo: "LEG-SR-25-044-612",
    prRefNo: "LEG-PR-25-219",
    isLinked: "Yes",
    srCategory: "Street Buying",
    dateCreated: "2025-10-12",
    facility: "Airside",
    department: "Grounds & Landscaping",
    srStatus: "Completed",
    assignedBuyer: "Archive Buyer",
  },
];

function formatDisplayDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function getStatusClasses(status: string) {
  switch (status) {
    case "Pending":
      return "bg-[#f5b700] text-white font-semibold";
    case "Approved":
    case "Completed":
      return "bg-[#46a46c] text-white font-semibold";
    case "Cancelled":
    case "Rejected":
      return "bg-[#718096] text-white font-semibold";
    default:
      return "bg-muted text-foreground font-medium";
  }
}

type Props = {
  records?: WoPrRecord[];
  onSelectRecord?: (row: WoPrRecord) => void;
};

export default function Wopr({
  records: initialPropRecords = initialRecords,
  onSelectRecord,
}: Props) {
  const [rows, setRows] = useState<WoPrRecord[]>(initialPropRecords);
  const [activeTable, setActiveTable] = useState<"WO" | "PR" | "LEGACY">("WO");
  const [formModalType, setFormModalType] = useState<"WO" | "PR" | null>(null);
  const [selectedRow, setSelectedRow] = useState<WoPrRecord | null>(null);

  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [globalSearch, setGlobalSearch] = useState("");

  // Column filters
  const [contractFilter, setContractFilter] = useState("All");
  const [titleFilter, setTitleFilter] = useState("");
  const [requestorFilter, setRequestorFilter] = useState("");
  const [srRefFilter, setSrRefFilter] = useState("");
  const [prRefFilter, setPrRefFilter] = useState("");
  const [linkedFilter, setLinkedFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [facilityFilter, setFacilityFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [buyerFilter, setBuyerFilter] = useState("");

  const [visibleCols, setVisibleCols] = useState<Record<ColumnKey, boolean>>({
    count: true,
    contract: true,
    title: true,
    requestorName: true,
    srRefNo: true,
    prRefNo: true,
    isLinked: true,
    srCategory: true,
    dateCreated: true,
    facility: true,
    department: true,
    srStatus: true,
    assignedBuyer: true,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeTable,
    pageSize,
    globalSearch,
    contractFilter,
    titleFilter,
    requestorFilter,
    srRefFilter,
    prRefFilter,
    linkedFilter,
    categoryFilter,
    fromDate,
    toDate,
    facilityFilter,
    departmentFilter,
    statusFilter,
    buyerFilter,
  ]);

  const tableRows = useMemo(
    () => rows.filter((r) => r.type === activeTable),
    [rows, activeTable],
  );

  const contracts = useMemo(
    () => Array.from(new Set(tableRows.map((r) => r.contract).filter(Boolean))),
    [tableRows],
  );
  const categories = useMemo(
    () =>
      Array.from(new Set(tableRows.map((r) => r.srCategory).filter(Boolean))),
    [tableRows],
  );
  const facilities = useMemo(
    () => Array.from(new Set(tableRows.map((r) => r.facility).filter(Boolean))),
    [tableRows],
  );
  const departments = useMemo(
    () =>
      Array.from(new Set(tableRows.map((r) => r.department).filter(Boolean))),
    [tableRows],
  );
  const statuses = useMemo(
    () => Array.from(new Set(tableRows.map((r) => r.srStatus).filter(Boolean))),
    [tableRows],
  );

  const filteredRows = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    return tableRows.filter((row) => {
      if (contractFilter !== "All" && row.contract !== contractFilter)
        return false;
      if (
        titleFilter.trim() &&
        !row.title.toLowerCase().includes(titleFilter.trim().toLowerCase())
      )
        return false;
      if (
        requestorFilter.trim() &&
        !row.requestorName
          .toLowerCase()
          .includes(requestorFilter.trim().toLowerCase())
      )
        return false;
      if (
        srRefFilter.trim() &&
        !row.srRefNo.toLowerCase().includes(srRefFilter.trim().toLowerCase())
      )
        return false;
      if (
        prRefFilter.trim() &&
        !(row.prRefNo ?? "")
          .toLowerCase()
          .includes(prRefFilter.trim().toLowerCase())
      )
        return false;
      if (linkedFilter !== "All" && row.isLinked !== linkedFilter) return false;
      if (categoryFilter !== "All" && row.srCategory !== categoryFilter)
        return false;
      if (fromDate && row.dateCreated < fromDate) return false;
      if (toDate && row.dateCreated > toDate) return false;
      if (facilityFilter !== "All" && row.facility !== facilityFilter)
        return false;
      if (departmentFilter !== "All" && row.department !== departmentFilter)
        return false;
      if (statusFilter !== "All" && row.srStatus !== statusFilter) return false;
      if (
        buyerFilter.trim() &&
        !(row.assignedBuyer ?? "")
          .toLowerCase()
          .includes(buyerFilter.trim().toLowerCase())
      )
        return false;

      if (!q) return true;
      return [
        row.count,
        row.contract,
        row.title,
        row.requestorName,
        row.srRefNo,
        row.prRefNo,
        row.isLinked,
        row.srCategory,
        row.dateCreated,
        row.facility,
        row.department,
        row.srStatus,
        row.assignedBuyer,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [
    tableRows,
    globalSearch,
    contractFilter,
    titleFilter,
    requestorFilter,
    srRefFilter,
    prRefFilter,
    linkedFilter,
    categoryFilter,
    fromDate,
    toDate,
    facilityFilter,
    departmentFilter,
    statusFilter,
    buyerFilter,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const paginatedRows = filteredRows.slice(startIdx, startIdx + pageSize);

  const listTitle =
    activeTable === "WO"
      ? "Work Order List v2.0"
      : activeTable === "PR"
        ? "Purchase Request List v2.0"
        : "Legacy SRPR List";

  function clearAllFilters() {
    setGlobalSearch("");
    setContractFilter("All");
    setTitleFilter("");
    setRequestorFilter("");
    setSrRefFilter("");
    setPrRefFilter("");
    setLinkedFilter("All");
    setCategoryFilter("All");
    setFromDate("");
    setToDate("");
    setFacilityFilter("All");
    setDepartmentFilter("All");
    setStatusFilter("All");
    setBuyerFilter("");
  }

  function buildDelimitedText(delimiter: string) {
    const activeCols = columnDefs.filter((c) => visibleCols[c.key]);
    const header = activeCols.map((c) => `"${c.label}"`).join(delimiter);
    const lines = paginatedRows.map((row) =>
      activeCols
        .map((c) => {
          const val =
            c.key === "dateCreated"
              ? formatDisplayDate(row.dateCreated)
              : String(row[c.key] ?? "");
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(delimiter),
    );
    return [header, ...lines].join("\n");
  }

  function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleExportCsv() {
    downloadFile(
      buildDelimitedText(","),
      `${activeTable.toLowerCase()}-list-v2.csv`,
      "text/csv;charset=utf-8;",
    );
    toast.success(`Exported ${activeTable} CSV`);
  }

  function handleExportExcel() {
    downloadFile(
      `\uFEFF${buildDelimitedText("\t")}`,
      `${activeTable.toLowerCase()}-list-v2.xls`,
      "application/vnd.ms-excel;charset=utf-8;",
    );
    toast.success(`Exported ${activeTable} Excel`);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildDelimitedText("\t"));
      toast.success("Copied visible rows to clipboard");
    } catch {
      toast.error("Unable to copy rows");
    }
  }

  function handleCreateSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formModalType) return;
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") || "").trim();
    const requestorName = String(fd.get("requestorName") || "").trim();
    const contract = String(fd.get("contract") || "SAFARI-KFIA").trim();
    const srCategory = String(fd.get("srCategory") || "Street Buying").trim();
    const facility = String(fd.get("facility") || "Main Terminal").trim();
    const department = String(
      fd.get("department") || "Airport Mechanical System",
    ).trim();
    const description = String(fd.get("description") || "").trim();

    const maxCount = rows.reduce((max, r) => Math.max(max, r.count), 749);
    const nextCount = maxCount + 1;
    const refNumber = `${formModalType}-SAF-26-100-${nextCount}`;

    const created: WoPrRecord = {
      id: String(nextCount),
      count: nextCount,
      type: formModalType,
      contract,
      title,
      requestorName,
      srRefNo: refNumber,
      prRefNo: formModalType === "PR" ? `PR-26-${nextCount}` : "",
      isLinked: formModalType === "PR" ? "Yes" : "No",
      srCategory,
      dateCreated: "2026-11-19",
      facility,
      department,
      srStatus: "Pending",
      assignedBuyer: "N/A",
      description,
    };

    setRows((prev) => [created, ...prev]);
    setActiveTable(formModalType);
    setFormModalType(null);
    toast.success(`${formModalType} ${refNumber} submitted`);
  }

  function toggleColumn(key: ColumnKey) {
    setVisibleCols((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <section
      aria-label="Work Order and Purchase Request Workspace"
      className="w-full space-y-6 pb-16 pt-4"
    >
      {/* Top 3 Purple Action Cards */}
      <div className="container mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto">
          <button
            type="button"
            onClick={() => setFormModalType("WO")}
            className="group flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-[#7b42b8] to-[#5e2d91] hover:from-[#6d37a6] hover:to-[#50247d] px-5 py-4 text-center text-white shadow-md transition-all hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-2 text-sm sm:text-base font-bold tracking-tight">
              <span>Work Order Form</span>
              <FilePlus2 className="size-4 shrink-0 opacity-90" />
            </span>
            <span className="mt-1 text-[11px] sm:text-xs text-white/85">
              Create and Submit a WO Form
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFormModalType("PR")}
            className="group flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-[#7b42b8] to-[#5e2d91] hover:from-[#6d37a6] hover:to-[#50247d] px-5 py-4 text-center text-white shadow-md transition-all hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-2 text-sm sm:text-base font-bold tracking-tight">
              <span>Purchase Request Form</span>
              <FilePlus2 className="size-4 shrink-0 opacity-90" />
            </span>
            <span className="mt-1 text-[11px] sm:text-xs text-white/85">
              Create and Submit a PR Form
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTable("LEGACY");
              toast.info("Showing Legacy SR and PR records");
            }}
            className="group flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-[#7b42b8] to-[#5e2d91] hover:from-[#6d37a6] hover:to-[#50247d] px-5 py-4 text-center text-white shadow-md transition-all hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-2 text-sm sm:text-base font-bold tracking-tight">
              <span>Legacy SRPR</span>
              <History className="size-4 shrink-0 opacity-90" />
            </span>
            <span className="mt-1 text-[11px] sm:text-xs text-white/85">
              View SR and PR From Previous Contractors
            </span>
          </button>
        </div>

        {/* Switcher Pills: WO Table / PR Table */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          <Button
            type="button"
            onClick={() => setActiveTable("WO")}
            className={`h-9 rounded-full px-4 text-xs sm:text-sm font-semibold shadow-xs ${
              activeTable === "WO"
                ? "bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            <ClipboardList className="mr-1.5 size-4" />
            WO Table
          </Button>

          <Button
            type="button"
            onClick={() => setActiveTable("PR")}
            className={`h-9 rounded-full px-4 text-xs sm:text-sm font-semibold shadow-xs ${
              activeTable === "PR"
                ? "bg-[#6b21a8] hover:bg-[#581c87] text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            <ClipboardList className="mr-1.5 size-4" />
            PR Table
          </Button>
        </div>
      </div>

      {/* Main Data Table Card */}
      <div className="container mx-auto px-3 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-3 sm:p-5 md:p-6 shadow-sm">
          {/* Centered Title Pill */}
          <div className="mb-5 flex justify-center">
            <div className="rounded-md border border-border/70 bg-muted/60 px-5 py-1.5 text-center shadow-2xs">
              <h2 className="font-serif text-base sm:text-lg font-medium tracking-tight text-foreground">
                {listTitle}
              </h2>
            </div>
          </div>

          {/* Toolbar Actions */}
          <div className="mb-4 flex flex-wrap items-center justify-end gap-2 sm:gap-4 text-xs sm:text-sm text-foreground/80 print:hidden">
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1.5 rounded px-2 py-1 hover:bg-muted hover:text-foreground transition-colors"
            >
              <RotateCcw className="size-3.5 text-muted-foreground" />
              <span>Clear filters</span>
            </button>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded px-2 py-1 hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Columns3 className="size-3.5 text-muted-foreground" />
                  <span>Columns</span>
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-52 p-2">
                <p className="mb-1.5 px-2 text-xs font-semibold text-muted-foreground">
                  Toggle columns
                </p>
                <div className="max-h-64 space-y-0.5 overflow-y-auto">
                  {columnDefs.map((col) => (
                    <button
                      key={col.key}
                      type="button"
                      onClick={() => toggleColumn(col.key)}
                      className="flex w-full items-center justify-between rounded px-2 py-1.5 text-xs hover:bg-muted"
                    >
                      <span>{col.label}</span>
                      {visibleCols[col.key] && (
                        <Check className="size-3.5 text-[#6b21a8]" />
                      )}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded px-2 py-1 hover:bg-muted hover:text-foreground transition-colors"
            >
              <Printer className="size-3.5 text-muted-foreground" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 rounded px-2 py-1 hover:bg-muted hover:text-foreground transition-colors"
            >
              <FileSpreadsheet className="size-3.5 text-muted-foreground" />
              <span>Excel</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 rounded px-2 py-1 hover:bg-muted hover:text-foreground transition-colors"
            >
              <FileText className="size-3.5 text-muted-foreground" />
              <span>CSV</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded px-2 py-1 hover:bg-muted hover:text-foreground transition-colors"
            >
              <Copy className="size-3.5 text-muted-foreground" />
              <span>Copy</span>
            </button>
          </div>

          {/* Entries Per Page & Search */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm print:hidden">
            <label className="inline-flex items-center gap-2 text-foreground">
              <span>Show</span>
              <select
                aria-label="Entries per page"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="h-8 rounded border border-input bg-background px-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {[5, 10, 25, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </label>

            <label className="flex items-center gap-2 text-foreground">
              <span>Search:</span>
              <input
                type="search"
                aria-label="Search table"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="h-8 w-full sm:w-52 md:w-60 border-b border-muted-foreground/50 bg-transparent px-2 text-xs sm:text-sm focus:border-[#6b21a8] focus:outline-none"
              />
            </label>
          </div>

          {/* Scrollable Table */}
          <div className="w-full overflow-x-auto rounded-md border border-border/80">
            <table className="w-full min-w-[1320px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b bg-muted/30 text-[#5b21b6] dark:text-purple-300 font-semibold">
                  {visibleCols.count && (
                    <th className="border-r px-3 py-2.5 whitespace-nowrap">
                      Count <span className="ml-1 text-[10px]">▾</span>
                    </th>
                  )}
                  {visibleCols.contract && (
                    <th className="border-r px-3 py-2.5 whitespace-nowrap">
                      Contract
                    </th>
                  )}
                  {visibleCols.title && (
                    <th className="border-r px-3 py-2.5 whitespace-nowrap">
                      Title
                    </th>
                  )}
                  {visibleCols.requestorName && (
                    <th className="border-r px-3 py-2.5 whitespace-nowrap">
                      Requestor Name
                    </th>
                  )}
                  {visibleCols.srRefNo && (
                    <th className="border-r px-3 py-2.5 whitespace-nowrap">
                      SR Ref. No.
                    </th>
                  )}
                  {visibleCols.prRefNo && (
                    <th className="border-r px-3 py-2.5 whitespace-nowrap">
                      PR Ref No.
                    </th>
                  )}
                  {visibleCols.isLinked && (
                    <th className="border-r px-3 py-2.5 whitespace-nowrap">
                      Is Linked
                    </th>
                  )}
                  {visibleCols.srCategory && (
                    <th className="border-r px-3 py-2.5 whitespace-nowrap">
                      SR Category
                    </th>
                  )}
                  {visibleCols.dateCreated && (
                    <th className="border-r px-3 py-2.5 whitespace-nowrap">
                      Date Created
                    </th>
                  )}
                  {visibleCols.facility && (
                    <th className="border-r px-3 py-2.5 whitespace-nowrap">
                      Facility
                    </th>
                  )}
                  {visibleCols.department && (
                    <th className="border-r px-3 py-2.5 whitespace-nowrap">
                      Department
                    </th>
                  )}
                  {visibleCols.srStatus && (
                    <th className="border-r px-3 py-2.5 whitespace-nowrap">
                      SR Status
                    </th>
                  )}
                  {visibleCols.assignedBuyer && (
                    <th className="px-3 py-2.5 whitespace-nowrap">
                      Assigned Buyer
                    </th>
                  )}
                </tr>

                {/* Column Filter Row */}
                <tr className="border-b bg-background text-muted-foreground print:hidden">
                  {visibleCols.count && (
                    <th className="border-r p-2 align-middle">
                      <div className="h-7 border-b border-border/70" />
                    </th>
                  )}
                  {visibleCols.contract && (
                    <th className="border-r p-2 align-middle">
                      <div className="relative flex items-center">
                        <Filter className="pointer-events-none absolute left-2 size-3 text-muted-foreground" />
                        <select
                          aria-label="Filter Contract"
                          value={contractFilter}
                          onChange={(e) => setContractFilter(e.target.value)}
                          className="h-7 w-full rounded border border-border bg-background pl-6 pr-2 text-xs text-foreground focus:outline-none"
                        >
                          <option value="All">Contract</option>
                          {contracts.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                  )}
                  {visibleCols.title && (
                    <th className="border-r p-2 align-middle">
                      <input
                        type="text"
                        aria-label="Filter Title"
                        placeholder="Title"
                        value={titleFilter}
                        onChange={(e) => setTitleFilter(e.target.value)}
                        className="h-7 w-full border-b border-border/70 bg-transparent px-1 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-[#6b21a8] focus:outline-none"
                      />
                    </th>
                  )}
                  {visibleCols.requestorName && (
                    <th className="border-r p-2 align-middle">
                      <input
                        type="text"
                        aria-label="Filter Requestor Name"
                        placeholder="Requestor Name"
                        value={requestorFilter}
                        onChange={(e) => setRequestorFilter(e.target.value)}
                        className="h-7 w-full border-b border-border/70 bg-transparent px-1 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-[#6b21a8] focus:outline-none"
                      />
                    </th>
                  )}
                  {visibleCols.srRefNo && (
                    <th className="border-r p-2 align-middle">
                      <input
                        type="text"
                        aria-label="Filter SR Ref. No."
                        placeholder="SR Ref. No."
                        value={srRefFilter}
                        onChange={(e) => setSrRefFilter(e.target.value)}
                        className="h-7 w-full border-b border-border/70 bg-transparent px-1 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-[#6b21a8] focus:outline-none"
                      />
                    </th>
                  )}
                  {visibleCols.prRefNo && (
                    <th className="border-r p-2 align-middle">
                      <input
                        type="text"
                        aria-label="Filter PR Ref No."
                        placeholder="PR Ref No."
                        value={prRefFilter}
                        onChange={(e) => setPrRefFilter(e.target.value)}
                        className="h-7 w-full border-b border-border/70 bg-transparent px-1 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-[#6b21a8] focus:outline-none"
                      />
                    </th>
                  )}
                  {visibleCols.isLinked && (
                    <th className="border-r p-2 align-middle">
                      <div className="relative flex items-center">
                        <Filter className="pointer-events-none absolute left-2 size-3 text-muted-foreground" />
                        <select
                          aria-label="Filter Is Linked"
                          value={linkedFilter}
                          onChange={(e) => setLinkedFilter(e.target.value)}
                          className="h-7 w-full rounded border border-border bg-background pl-6 pr-2 text-xs text-foreground focus:outline-none"
                        >
                          <option value="All">Is Linked</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </th>
                  )}
                  {visibleCols.srCategory && (
                    <th className="border-r p-2 align-middle">
                      <div className="relative flex items-center">
                        <Filter className="pointer-events-none absolute left-2 size-3 text-muted-foreground" />
                        <select
                          aria-label="Filter SR Category"
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="h-7 w-full rounded border border-border bg-background pl-6 pr-2 text-xs text-foreground focus:outline-none"
                        >
                          <option value="All">SR Category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                  )}
                  {visibleCols.dateCreated && (
                    <th className="border-r p-1.5 align-middle">
                      <div className="space-y-1">
                        <input
                          type="date"
                          aria-label="From date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          className="h-5 w-full border-b border-border/70 bg-transparent px-1 text-[11px] text-foreground focus:border-[#6b21a8] focus:outline-none"
                        />
                        <input
                          type="date"
                          aria-label="To date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          className="h-5 w-full border-b border-border/70 bg-transparent px-1 text-[11px] text-foreground focus:border-[#6b21a8] focus:outline-none"
                        />
                      </div>
                    </th>
                  )}
                  {visibleCols.facility && (
                    <th className="border-r p-2 align-middle">
                      <div className="relative flex items-center">
                        <Filter className="pointer-events-none absolute left-2 size-3 text-muted-foreground" />
                        <select
                          aria-label="Filter Facility"
                          value={facilityFilter}
                          onChange={(e) => setFacilityFilter(e.target.value)}
                          className="h-7 w-full rounded border border-border bg-background pl-6 pr-2 text-xs text-foreground focus:outline-none"
                        >
                          <option value="All">Facility</option>
                          {facilities.map((fac) => (
                            <option key={fac} value={fac}>
                              {fac}
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                  )}
                  {visibleCols.department && (
                    <th className="border-r p-2 align-middle">
                      <div className="relative flex items-center">
                        <Filter className="pointer-events-none absolute left-2 size-3 text-muted-foreground" />
                        <select
                          aria-label="Filter Department"
                          value={departmentFilter}
                          onChange={(e) => setDepartmentFilter(e.target.value)}
                          className="h-7 w-full rounded border border-border bg-background pl-6 pr-2 text-xs text-foreground focus:outline-none"
                        >
                          <option value="All">Department</option>
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                  )}
                  {visibleCols.srStatus && (
                    <th className="border-r p-2 align-middle">
                      <div className="relative flex items-center">
                        <Filter className="pointer-events-none absolute left-2 size-3 text-muted-foreground" />
                        <select
                          aria-label="Filter SR Status"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="h-7 w-full rounded border border-border bg-background pl-6 pr-2 text-xs text-foreground focus:outline-none"
                        >
                          <option value="All">SR Status</option>
                          {statuses.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                  )}
                  {visibleCols.assignedBuyer && (
                    <th className="p-2 align-middle">
                      <input
                        type="text"
                        aria-label="Filter Assigned Buyer"
                        placeholder="Assigned Buyer"
                        value={buyerFilter}
                        onChange={(e) => setBuyerFilter(e.target.value)}
                        className="h-7 w-full border-b border-border/70 bg-transparent px-1 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-[#6b21a8] focus:outline-none"
                      />
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {paginatedRows.length ? (
                  paginatedRows.map((row) => {
                    const buyerActive =
                      row.assignedBuyer && row.assignedBuyer !== "N/A";
                    return (
                      <tr
                        key={row.id}
                        className="odd:bg-background even:bg-muted/25 hover:bg-muted/50 transition-colors"
                      >
                        {visibleCols.count && (
                          <td className="border-r px-3 py-2.5 text-center font-medium text-foreground">
                            {row.count}
                          </td>
                        )}
                        {visibleCols.contract && (
                          <td className="border-r px-3 py-2.5 whitespace-nowrap text-foreground">
                            {row.contract}
                          </td>
                        )}
                        {visibleCols.title && (
                          <td className="border-r px-3 py-2.5 max-w-[220px] truncate text-foreground">
                            <span title={row.title}>{row.title}</span>
                          </td>
                        )}
                        {visibleCols.requestorName && (
                          <td className="border-r px-3 py-2.5 whitespace-nowrap text-foreground">
                            {row.requestorName}
                          </td>
                        )}
                        {visibleCols.srRefNo && (
                          <td className="border-r px-3 py-2.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRow(row);
                                onSelectRecord?.(row);
                              }}
                              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                            >
                              {row.srRefNo}
                            </button>
                          </td>
                        )}
                        {visibleCols.prRefNo && (
                          <td className="border-r px-3 py-2.5 whitespace-nowrap text-foreground">
                            {row.prRefNo || ""}
                          </td>
                        )}
                        {visibleCols.isLinked && (
                          <td className="border-r bg-[#8c8c8c] text-white px-3 py-2.5 text-center font-medium whitespace-nowrap">
                            {row.isLinked}
                          </td>
                        )}
                        {visibleCols.srCategory && (
                          <td className="border-r px-3 py-2.5 whitespace-nowrap text-foreground">
                            {row.srCategory}
                          </td>
                        )}
                        {visibleCols.dateCreated && (
                          <td className="border-r px-3 py-2.5 whitespace-nowrap text-foreground">
                            {formatDisplayDate(row.dateCreated)}
                          </td>
                        )}
                        {visibleCols.facility && (
                          <td className="border-r px-3 py-2.5 whitespace-nowrap text-foreground">
                            {row.facility}
                          </td>
                        )}
                        {visibleCols.department && (
                          <td className="border-r px-3 py-2.5 whitespace-nowrap text-foreground">
                            {row.department}
                          </td>
                        )}
                        {visibleCols.srStatus && (
                          <td
                            className={`border-r px-3 py-2.5 text-center whitespace-nowrap ${getStatusClasses(
                              row.srStatus,
                            )}`}
                          >
                            {row.srStatus}
                          </td>
                        )}
                        {visibleCols.assignedBuyer && (
                          <td
                            className={`px-3 py-2.5 whitespace-nowrap ${
                              buyerActive
                                ? "bg-[#17a2b8] text-white font-medium"
                                : "text-foreground"
                            }`}
                          >
                            {row.assignedBuyer || "N/A"}
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={
                        columnDefs.filter((c) => visibleCols[c.key]).length || 1
                      }
                      className="px-4 py-8 text-center text-sm text-muted-foreground"
                    >
                      No matching records found. Try clearing or adjusting your
                      filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground print:hidden">
            <span>
              Showing {filteredRows.length ? startIdx + 1 : 0} to{" "}
              {Math.min(startIdx + pageSize, filteredRows.length)} of{" "}
              {filteredRows.length} entries
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage(1)}
                className="rounded px-2 py-1 hover:bg-muted disabled:opacity-40"
              >
                «
              </button>
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded px-2 py-1 hover:bg-muted disabled:opacity-40"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`size-7 rounded text-xs font-medium ${
                      safePage === pageNum
                        ? "bg-[#7c3aed] text-white"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="rounded px-2 py-1 hover:bg-muted disabled:opacity-40"
              >
                ›
              </button>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="rounded px-2 py-1 hover:bg-muted disabled:opacity-40"
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create WO / PR Modal */}
      <Dialog
        open={Boolean(formModalType)}
        onOpenChange={(open) => !open && setFormModalType(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogTitle>
            {formModalType === "WO"
              ? "New Work Order Form"
              : "New Purchase Request Form"}
          </DialogTitle>
          <DialogDescription>
            Submit a new {formModalType} entry to the queue.
          </DialogDescription>

          <form onSubmit={handleCreateSubmit} className="space-y-3 mt-2">
            <div>
              <label className="block text-xs font-medium mb-1">Title *</label>
              <input
                name="title"
                required
                placeholder="e.g. Runway lighting relay replacement"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">
                  Requestor Name *
                </label>
                <input
                  name="requestorName"
                  required
                  placeholder="Requestor full name"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Contract
                </label>
                <input
                  name="contract"
                  defaultValue="SAFARI-KFIA"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">
                  SR Category
                </label>
                <select
                  name="srCategory"
                  defaultValue="Street Buying"
                  className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm"
                >
                  <option value="Street Buying">Street Buying</option>
                  <option value="Request for Quotation (RFQ)">
                    Request for Quotation (RFQ)
                  </option>
                  <option value="Long Lead Items">Long Lead Items</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Facility
                </label>
                <select
                  name="facility"
                  defaultValue="Main Terminal"
                  className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm"
                >
                  <option value="Main Terminal">Main Terminal</option>
                  <option value="Airside">Airside</option>
                  <option value="Admin Building">Admin Building</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Department
                </label>
                <select
                  name="department"
                  defaultValue="Airport Mechanical System"
                  className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm"
                >
                  <option value="Airport Mechanical System">
                    Airport Mechanical System
                  </option>
                  <option value="Airport Terminals & Facilities">
                    Airport Terminals &amp; Facilities
                  </option>
                  <option value="Aerodrome Maintenance">
                    Aerodrome Maintenance
                  </option>
                  <option value="Grounds & Landscaping">
                    Grounds &amp; Landscaping
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">
                Details / Notes
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Scope, quantities, or site notes..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormModalType(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#6b21a8] hover:bg-[#581c87] text-white"
              >
                Submit {formModalType}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Record Detail Dialog */}
      <Dialog
        open={Boolean(selectedRow)}
        onOpenChange={(open) => !open && setSelectedRow(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogTitle>{selectedRow?.srRefNo}</DialogTitle>
          <DialogDescription>{selectedRow?.title}</DialogDescription>
          {selectedRow && (
            <div className="space-y-2 text-xs sm:text-sm pt-2">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground">Contract</span>
                <span className="font-medium">{selectedRow.contract}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground">Requestor</span>
                <span className="font-medium">{selectedRow.requestorName}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground">Facility</span>
                <span className="font-medium">{selectedRow.facility}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium">{selectedRow.department}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{selectedRow.srCategory}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground">Status</span>
                <span className="font-semibold">{selectedRow.srStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned Buyer</span>
                <span className="font-medium">
                  {selectedRow.assignedBuyer || "N/A"}
                </span>
              </div>
              <div className="pt-3 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedRow(null)}
                >
                  <X className="mr-1.5 size-4" />
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
