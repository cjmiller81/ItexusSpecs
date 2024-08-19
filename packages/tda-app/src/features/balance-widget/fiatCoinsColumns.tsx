import i18n from "@/libs/i18n/i18n";
import { ColumnDefResolved } from "@tanstack/react-table";
import { BalanceModel } from "./BalanceModel";

export const fiatCoinsColumns: ColumnDefResolved<BalanceModel, any>[] = [
  {
    accessorKey: "name",
    header: i18n.t("Currency", { ns: "BalanceWidget" }),
    minSize: 40,
    maxSize: 40,
  },
  {
    accessorKey: "qty",
    header: i18n.t("Qty", { ns: "BalanceWidget" }),
    minSize: 40,
    cell: cell =>
      cell.getValue().toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
  },
];
