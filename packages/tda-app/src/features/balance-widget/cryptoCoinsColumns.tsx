import i18n from "@/libs/i18n/i18n";
import { ColumnDefResolved } from "@tanstack/react-table";
import { CustomerBalanceModel } from "./BalanceModel";

export const cryptoCoinsColumns: ColumnDefResolved<CustomerBalanceModel>[] = [
  {
    accessorKey: "currency",
    header: i18n.t("Coin", { ns: "BalanceWidget" }),
    minSize: 40,
    maxSize: 40,
  },
  {
    accessorKey: "amount",
    header: i18n.t("Qty", { ns: "BalanceWidget" }),
    minSize: 40,
    maxSize: 40,
    cell: cell =>
      (cell.getValue() as number).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
  },
];
