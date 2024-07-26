import CSVExport from "@/components/third-party/react-table/CSVExport";
import { Box } from "@mui/material";
import { ColumnDefResolved } from "@tanstack/react-table";
import { FC } from "react";
import { LabelKeyObject } from "react-csv/lib/core";

type Props = {
  columns: ColumnDefResolved<any>[];
  fileName: string;
  data: any[];
};

export const TableSecondary: FC<Props> = ({ columns, fileName, data }) => {
  const headers: LabelKeyObject[] = columns.map(column => ({
    label: typeof column.header === "string" ? column.header : "#",
    key: column.accessorKey as string,
  }));
  return (
    <Box style={{ display: "flex", alignItems: "center" }}>
      <CSVExport
        iconStyle={{ fontSize: "14px" }}
        data={data}
        headers={headers}
        filename={fileName}
      />
    </Box>
  );
};
