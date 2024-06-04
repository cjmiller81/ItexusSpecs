import i18next from "@/libs/i18n/i18n"
import { GridColDef } from "@mui/x-data-grid"
import { dateTimeFormat } from "components"
import moment from "moment"
import { Billing } from "./billing"

export function getBillingColumnsDefs() {
  const columns: GridColDef<Billing>[] = [
    {
      field: "paymentGateway",
      headerName: i18next.t("PaymentGateway", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "stripeCustomerId",
      headerName: i18next.t("StripeCustomerId", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "periodStart",
      headerName: i18next.t("PeriodStart", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      valueFormatter: params => moment(params?.value).format(dateTimeFormat),
      flex: 1,
    },
    {
      field: "periodEnd",
      headerName: i18next.t("PeriodEnd", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      valueFormatter: params => moment(params?.value).format(dateTimeFormat),
      flex: 1,
    },
    {
      field: "description",
      headerName: i18next.t("Description", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "amount",
      headerName: i18next.t("Amount", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "status",
      headerName: i18next.t("Status", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "transactionTime",
      headerName: i18next.t("TransactionTime", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      valueFormatter: params => moment(params?.value).format(dateTimeFormat),
      flex: 1,
    },
  ]

  return columns
}
