import i18n from "@/libs/i18n/i18n";
import { Typography } from "@mui/material";
import { ColumnDefResolved } from "@tanstack/react-table";
import { BalanceModel } from "./BalanceModel";

export const cryptoCoinsColumns: ColumnDefResolved<BalanceModel>[] = [
  {
    accessorKey: "name",
    header: i18n.t("Coin", { ns: "BalanceWidget" }),
    minSize: 40,
    maxSize: 40,
    cell: cell => (
      <Typography
        variant="subtitle1"
        sx={{ fontSize: "12px" }}>
        {cell.getValue() as string}
      </Typography>
    ),
  },
  { accessorKey: "qty", header: i18n.t("Qty", { ns: "BalanceWidget" }), minSize: 40 },
];
