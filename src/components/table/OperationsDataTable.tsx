import { useMemo, useState } from "react";
import {
  Check,
  ClipboardList,
  Columns3,
  Copy,
  FileSpreadsheet,
  FileText,
  Filter,
  Printer,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type OrderEntry = {
  id: string;
  count: number;
  type: "WO" | "PR";
  contract: string;
  title: string;
  requestorName: string;
  srRefNo: string;
  prRefNo?: string;
  isLinked: "Yes" | "No";
  srCategory: string;
  dateCreated: string; // ISO date e.g. "2026-11-19"
  facility: string;
  srStatus:
    | "Pending"
    | "Approved"
    | "Cancelled"
    | "Rejected"
    | "Completed"
    | string;
  assignedBuyer?: string;
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
  { key: "srStatus", label: "SR Status" },
  { key: "assignedBuyer", label: "Assigned Buyer" },
];

const sampleOrders: OrderEntry[] = [
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
    srStatus: "Approved",
    assignedBuyer: "Walid Elsayed",
  },
  {
    id: "743",
    count: 743,
    type: "WO",
    contract: "SAFARI-KFIA",
    title: "EDR-8010-2GSFP-T Router",
    requestorName: "Faisal Alqahtani",
    srRefNo: "WO-SAF-26-100-701",
    prRefNo: "",
    isLinked: "No",
    srCategory: "Long Lead Items",
    dateCreated: "2026-11-15",
    facility: "Main Terminal",
    srStatus: "Pending",
    assignedBuyer: "N/A",
  },
  {
    id: "742",
    count: 742,
    type: "WO",
    contract: "SAFARI-KFIA",
    title: "Glass Beads for All KFIA Road...",
    requestorName: "SHER SHAH",
    srRefNo: "WO-SAF-26-100-700",
    prRefNo: "",
    isLinked: "No",
    srCategory: "Street Buying",
    dateCreated: "2026-11-15",
    facility: "Main Terminal",
    srStatus: "Cancelled",
    assignedBuyer: "N/A",
  },
  {
    id: "741",
    count: 741,
    type: "PR",
    contract: "SAFARI-KFIA",
    title: "(apron#3) Supply Order for hig...",
    requestorName: "Karel Soluta",
    srRefNo: "PR-SAF-26-100-699",
    prRefNo: "PR-26-699",
    isLinked: "Yes",
    srCategory: "Street Buying",
    dateCreated: "2026-11-15",
    facility: "Airside",
    srStatus: "Cancelled",
    assignedBuyer: "N/A",
  },
  {
    id: "740",
    count: 740,
    type: "PR",
    contract: "SAFARI-KFIA",
    title: "Outside Service for A/C Compr...",
    requestorName: "SHER SHAH",
    srRefNo: "PR-SAF-26-100-698",
    prRefNo: "PR-26-698",
    isLinked: "Yes",
    srCategory: "Street Buying",
    dateCreated: "2026-11-15",
    facility: "Workshop",
    srStatus: "Cancelled",
    assignedBuyer: "N/A",
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
      return "bg-[#e3a008] text-white font-semibold";
    case "Approved":
    case "Completed":
      return "bg-[#3182ce] text-white font-semibold";
    case "Cancelled":
    case "Rejected":
      return "bg-[#718096] text-white font-semibold";
    default:
      return "bg-muted text-foreground font-medium";
  }
}

type Props = {
  items?: OrderEntry[];
  initialTab?: "WO" | "PR";
  onSelectRef?: (row: OrderEntry) => void;
};

export default function OperationsDataTable({
  items = sampleOrders,
  initialTab = "WO",
  onSelectRef,
}: Props) {
  const [activeTab, setActiveTab] = useState<"WO" | "PR">(initialTab);
  const [pageSize, setPageSize] = useState<number>(25);
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
    srStatus: true,
    assignedBuyer: true,
  });

  const tabItems = useMemo(
    () => items.filter((row) => row.type === activeTab),
    [items, activeTab],
  );

  const contracts = useMemo(
    () => Array.from(new Set(tabItems.map((r) => r.contract).filter(Boolean))),
    [tabItems],
  );
  const categories = useMemo(
    () =>
      Array.from(new Set(tabItems.map((r) => r.srCategory).filter(Boolean))),
    [tabItems],
  );
  const facilities = useMemo(
    () => Array.from(new Set(tabItems.map((r) => r.facility).filter(Boolean))),
    [tabItems],
  );
  const statuses = useMemo(
    () => Array.from(new Set(tabItems.map((r) => r.srStatus).filter(Boolean))),
    [tabItems],
  );

  const filteredRows = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    return tabItems.filter((row) => {
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
        row.srStatus,
        row.assignedBuyer,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [
    tabItems,
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
    statusFilter,
    buyerFilter,
  ]);

  const displayedRows = filteredRows.slice(0, pageSize);

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
    setStatusFilter("All");
    setBuyerFilter("");
  }

  function buildDelimitedText(delimiter: string) {
    const activeCols = columnDefs.filter((c) => visibleCols[c.key]);
    const header = activeCols.map((c) => `"${c.label}"`).join(delimiter);
    const lines = displayedRows.map((row) =>
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
      `${activeTab.toLowerCase()}-list-v2.csv`,
      "text/csv;charset=utf-8;",
    );
    toast.success(`Exported ${activeTab} CSV`);
  }

  function handleExportExcel() {
    downloadFile(
      `\uFEFF${buildDelimitedText("\t")}`,
      `${activeTab.toLowerCase()}-list-v2.xls`,
      "application/vnd.ms-excel;charset=utf-8;",
    );
    toast.success(`Exported ${activeTab} Excel file`);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildDelimitedText("\t"));
      toast.success("Table copied to clipboard");
    } catch {
      toast.error("Unable to copy table");
    }
  }

  function toggleColumn(key: ColumnKey) {
    setVisibleCols((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <section aria-label={`${activeTab} List`} className="w-full space-y-4 py-4">
      {/* Top Switcher Pills: WO Table / PR Table */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <Button
          type="button"
          onClick={() => setActiveTab("WO")}
          className={`h-9 rounded-full px-4 text-xs sm:text-sm font-semibold shadow-xs ${
            activeTab === "WO"
              ? "bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          <ClipboardList className="mr-1.5 size-4" />
          WO Table
        </Button>

        <Button
          type="button"
          onClick={() => setActiveTab("PR")}
          className={`h-9 rounded-full px-4 text-xs sm:text-sm font-semibold shadow-xs ${
            activeTab === "PR"
              ? "bg-[#6b21a8] hover:bg-[#581c87] text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          <ClipboardList className="mr-1.5 size-4" />
          PR Table
        </Button>
      </div>

      {/* Main Card Container */}
      <div className="rounded-2xl border border-border bg-card p-3 sm:p-5 md:p-6 shadow-sm">
        {/* Centered Title Pill */}
        <div className="mb-5 flex justify-center">
          <div className="rounded-md border border-border/70 bg-muted/60 px-5 py-1.5 text-center shadow-2xs">
            <h2 className="font-serif text-base sm:text-lg font-medium tracking-tight text-foreground">
              {activeTab === "WO"
                ? "Work Order List v2.0"
                : "Purchase Request List v2.0"}
            </h2>
          </div>
        </div>

        {/* Toolbar Actions: Clear filters, Columns, Print, Excel, CSV, Copy */}
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
                {columnDefs.map((col) => {
                  const checked = visibleCols[col.key];
                  return (
                    <button
                      key={col.key}
                      type="button"
                      onClick={() => toggleColumn(col.key)}
                      className="flex w-full items-center justify-between rounded px-2 py-1.5 text-xs hover:bg-muted"
                    >
                      <span>{col.label}</span>
                      {checked && <Check className="size-3.5 text-[#6b21a8]" />}
                    </button>
                  );
                })}
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

        {/* Entries Per Page & Global Search */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm print:hidden">
          <label className="inline-flex items-center gap-2 text-foreground">
            <span>Show</span>
            <select
              aria-label="Entries per page"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-8 rounded border border-input bg-background px-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {[10, 25, 50, 100].map((size) => (
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

        {/* Responsive Scrollable Data Table */}
        <div className="w-full overflow-x-auto rounded-md border border-border/80">
          <table className="w-full min-w-[1180px] border-collapse text-left text-xs">
            <thead>
              {/* Column Headers */}
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
              {displayedRows.length ? (
                displayedRows.map((row) => {
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
                        <td className="border-r px-3 py-2.5 max-w-[240px] truncate text-foreground">
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
                            onClick={() => onSelectRef?.(row)}
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
                    No matching {activeTab} records found. Try clearing or
                    adjusting your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Count */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            Showing {displayedRows.length} of {filteredRows.length} filtered{" "}
            {activeTab} entries ({tabItems.length} total)
          </span>
        </div>
      </div>
    </section>
  );
}
