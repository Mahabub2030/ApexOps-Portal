export type Role = "admin" | "user";

export const modules = [
  {
    id: "IR",
    title: "Incident Reports",
    description: "Log safety and operational incidents.",
    action: "New Incident",
  },
  {
    id: "NCR",
    title: "Non-Conformance",
    description: "Track quality and compliance issues.",
    action: "Start Inspection",
  },
  {
    id: "WO",
    title: "Work Orders",
    description: "Manage maintenance and field jobs.",
    action: "Open Job",
  },
  {
    id: "PR",
    title: "Purchase Requests",
    description: "Raise material and service orders.",
    action: "Raise Order",
  },
  {
    id: "INV",
    title: "Invoices",
    description: "Review billing and vendor invoices.",
    action: "View Invoices",
  },
  {
    id: "RPT",
    title: "Reports",
    description: "Operational metrics and summaries.",
    action: "View Reports",
  },
  {
    id: "FMS",
    title: "Fleet Management",
    description: "Track vehicles and site equipment.",
    action: "Open Fleet",
  },
  {
    id: "IMS",
    title: "Inventory",
    description: "Monitor stock levels and supplies.",
    action: "Open Stock",
  },
] as const;

export function canApprove(role: Role) {
  return role === "admin";
}

export function visibleRecords<T extends { owner_id?: string | null }>(
  records: T[],
  role: Role,
  userId: string,
) {
  return role === "admin"
    ? records
    : records.filter((r) => r.owner_id === userId);
}

export function dashboardSummary(
  records: { status: string; priority: string }[],
) {
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
