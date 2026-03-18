// Format date to Indian locale
export function formatDate(dateString?: string | null): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return "In Progress";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Course status color mapping
export function getStatusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case "In Progress":
      return { bg: "#3B82F6", text: "#1D4ED8" };
    case "Completed":
      return { bg: "#10B981", text: "#065F46" };
    case "Start Soon":
      return { bg: "#F59E0B", text: "#92400E" };
    case "Partially Complete":
      return { bg: "#8B5CF6", text: "#4C1D95" };
    default:
      return { bg: "#6B7280", text: "#374151" };
  }
}

export function getProgressWidth(status?: string): string {
  switch (status) {
    case "Completed":       return "w-full";
    case "In Progress":     return "w-3/5";
    case "Partially Complete": return "w-4/5";
    default:                return "w-0";
  }
}

export function getExpiryText(
  order: { reason?: string; accessValidityDays?: number; batch?: { endDate?: string }; createdAt: string },
  expiryDate: Date | null,
  expired: boolean
): string {
  if (expired && expiryDate) return `Expired on ${formatDate(expiryDate.toISOString())}`;
  if (order.reason === "BATCH_INCLUDED") return "Validity follows batch schedule";
  if (order.accessValidityDays && order.accessValidityDays > 0 && expiryDate) {
    return `Assigned validity: Expires on ${formatDate(expiryDate.toISOString())}`;
  }
  if (order.batch?.endDate) return `Valid until ${formatDate(order.batch.endDate)}`;
  return "Validity: Unlimited / Follows batch";
}