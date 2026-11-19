import { ArrowLeft, FilePlus2 } from "lucide-react";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";

export type OrderLineItem = {
  id: string;
  itemDescription: string;
  partNo?: string;
  unit?: string;
  quantity?: number;
  estimatedCost?: string;
  remarks?: string;
};

export type OrderDetailRecord = {
  id: string;
  type: "WO" | "PR";
  title: string;
  contract: string;
  category: string;
  facility: string;
  department: string;
  section: string;
  referenceNo: string;
  contractNo: string;
  dateCreated: string;
  status?: string;
  requestorName?: string;
  assignedBuyer?: string;
  lineItems?: OrderLineItem[];
};

const defaultLineItems: OrderLineItem[] = [
  {
    id: "LI-1",
    itemDescription: "Conventional 24VDC Optical Smoke Detector with Base",
    partNo: "SD-24VDC-CONV",
    unit: "EA",
    quantity: 12,
    estimatedCost: "SAR 2,400.00",
    remarks: "Passenger Terminal Concourse A fire alarm loop",
  },
  {
    id: "LI-2",
    itemDescription: "Fire Rated 2x1.5mm² Red Alarm Cable & Conduit Fittings",
    partNo: "FRC-2X15-RED",
    unit: "M",
    quantity: 85,
    estimatedCost: "SAR 1,275.00",
    remarks: "Includes junction boxes and mounting clips",
  },
];

export const sampleOrderDetail: OrderDetailRecord = {
  id: "749",
  type: "WO",
  title: "Smoke Detectors 24VDC Conventional – At Passenger Terminal Building",
  contract: "SAFARI-KFIA",
  category: "Street Buying",
  facility: "Main Terminal",
  department: "Airport Mechanical System",
  section: "Fire Fighting System (Main Terminal)",
  referenceNo: "WO-SAF-26-100-707",
  contractNo: "DA-CT-2025-100",
  dateCreated: "November 19, 2026",
  status: "Pending",
  requestorName: "Salamat Khan",
  assignedBuyer: "N/A",
  lineItems: defaultLineItems,
};

type Props = {
  record?: OrderDetailRecord | null;
  onBackToList?: () => void;
  onOpenPrForm?: () => void;
};

export default function OrderDetailsView({
  record = sampleOrderDetail,
  onBackToList,
  onOpenPrForm,
}: Props) {
  if (!record) return null;

  const isPr = record.type === "PR";
  const pageHeading = isPr ? "Purchase Request Details" : "Work Order Details";
  const categoryLabel = isPr ? "PR Category" : "WO Category";
  const refLabel = isPr ? "PR Reference No." : "WO Reference No.";
  const items = record.lineItems?.length ? record.lineItems : defaultLineItems;

  return (
    <section
      aria-label={pageHeading}
      className="min-h-screen w-full bg-[#eef0f3] dark:bg-background pb-16 pt-5"
    >
      <div className="container mx-auto max-w-6xl px-3 sm:px-6 space-y-6">
        {/* Top Purple Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          <button
            type="button"
            onClick={() => onBackToList?.()}
            className="flex min-w-56 sm:min-w-72 flex-col items-center justify-center rounded-xl bg-gradient-to-b from-[#7a3eb1] to-[#5d2c8d] hover:from-[#6b339e] hover:to-[#4e2378] px-6 py-3 text-center text-white shadow-md transition-all hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-2 text-xs sm:text-sm font-bold">
              <span>WO and PR Home</span>
              <ArrowLeft className="size-3.5 shrink-0" />
            </span>
            <span className="mt-0.5 text-[11px] text-white/85">
              Back to WO and PR table page
            </span>
          </button>

          <button
            type="button"
            onClick={() => onOpenPrForm?.()}
            className="flex min-w-56 sm:min-w-72 flex-col items-center justify-center rounded-xl bg-gradient-to-b from-[#7a3eb1] to-[#5d2c8d] hover:from-[#6b339e] hover:to-[#4e2378] px-6 py-3 text-center text-white shadow-md transition-all hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-2 text-xs sm:text-sm font-bold">
              <span>Purchase Request Form</span>
              <FilePlus2 className="size-3.5 shrink-0" />
            </span>
            <span className="mt-0.5 text-[11px] text-white/85">
              Create and Submit a PR Form
            </span>
          </button>
        </div>

        {/* Main Details Sheet Card */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-8 shadow-md space-y-6">
          {/* Brand Logo + Title */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12 border-b border-border/60 pb-5">
            <div className="flex items-center gap-2.5 text-[#5d2c8d] dark:text-purple-300 shrink-0">
              <Logo />
              <span className="text-lg sm:text-xl font-bold tracking-tight">
                Dammam Airports
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-normal tracking-tight text-foreground">
              {pageHeading}
            </h1>
          </div>

          {/* Section 1: Request Information */}
          <div className="space-y-4">
            <div className="w-full rounded-md bg-[#6f35a5] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-2xs">
              Request Information
            </div>

            {/* Title Field */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Title
              </label>
              <div className="w-full rounded-md border border-border bg-muted/20 px-3.5 py-2 text-xs sm:text-sm text-foreground">
                {record.title}
              </div>
            </div>

            {/* Row 2: Contract & WO/PR Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Contract
                </label>
                <div className="w-full rounded-md border border-border bg-muted/20 px-3.5 py-2 text-xs sm:text-sm text-foreground">
                  {record.contract}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  {categoryLabel}
                </label>
                <div className="w-full rounded-md border border-border bg-muted/20 px-3.5 py-2 text-xs sm:text-sm text-foreground">
                  {record.category}
                </div>
              </div>
            </div>

            {/* Row 3: Facility, Department & Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Facility
                </label>
                <div className="w-full rounded-md border border-border bg-muted/20 px-3.5 py-2 text-xs sm:text-sm text-foreground">
                  {record.facility}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Department
                </label>
                <div className="w-full rounded-md border border-border bg-muted/20 px-3.5 py-2 text-xs sm:text-sm text-foreground">
                  {record.department}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Section
                </label>
                <div className="w-full rounded-md border border-border bg-muted/20 px-3.5 py-2 text-xs sm:text-sm text-foreground">
                  {record.section}
                </div>
              </div>
            </div>

            {/* Row 4: WO/PR Reference No., Contract No. & Date Created */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  {refLabel}
                </label>
                <div className="w-full rounded-md border border-border bg-muted/20 px-3.5 py-2 text-xs sm:text-sm text-foreground font-medium">
                  {record.referenceNo}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Contract No.
                </label>
                <div className="w-full rounded-md border border-border bg-muted/20 px-3.5 py-2 text-xs sm:text-sm text-foreground">
                  {record.contractNo}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Date Created
                </label>
                <div className="w-full rounded-md border border-border bg-muted/20 px-3.5 py-2 text-xs sm:text-sm text-foreground">
                  {record.dateCreated}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Line Items Detail */}
          <div className="space-y-3 pt-2">
            <div className="w-full rounded-md bg-[#6f35a5] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-2xs">
              Line Items Detail
            </div>

            <div className="w-full overflow-x-auto rounded-md border border-border">
              <table className="w-full min-w-[680px] border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-foreground font-semibold">
                    <th className="w-12 px-3 py-2.5 text-center">#</th>
                    <th className="px-3 py-2.5">Item Description</th>
                    <th className="px-3 py-2.5">Part / Spec</th>
                    <th className="px-3 py-2.5 text-center">Qty</th>
                    <th className="px-3 py-2.5 text-right">Est. Cost</th>
                    <th className="px-3 py-2.5">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-muted/25">
                      <td className="px-3 py-2.5 text-center font-medium text-muted-foreground">
                        {idx + 1}.
                      </td>
                      <td className="px-3 py-2.5 font-medium text-foreground">
                        {item.itemDescription}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {item.partNo || "—"}
                      </td>
                      <td className="px-3 py-2.5 text-center text-foreground">
                        {item.quantity ?? 1} {item.unit || ""}
                      </td>
                      <td className="px-3 py-2.5 text-right font-medium text-foreground">
                        {item.estimatedCost || "—"}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {item.remarks || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {onBackToList && (
              <div className="pt-2 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBackToList}
                  className="text-xs sm:text-sm"
                >
                  <ArrowLeft className="mr-1.5 size-4" />
                  Back to Table
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
