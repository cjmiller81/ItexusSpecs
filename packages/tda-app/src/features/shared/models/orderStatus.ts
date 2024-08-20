export type OrderStatus =
  | "Submitted"
  | "Working"
  | "Filled"
  | "Error"
  | "Canceled"
  | "Partial"
  | "PendingCancel"
  | "FilledPartiallyAndCancelled";
