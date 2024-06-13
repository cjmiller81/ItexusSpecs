export interface orderStatus {
  orderStatus:
     "Submitted"
    | "Working"
    | "Filled"
    | "Error"
    | "Canceled"
    | "Partial"
    | "PendingCancel"
    | "FilledPartiallyAndCancelled",   
}

