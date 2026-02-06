import { styled } from "@mui/material/styles";
import DataGridDef from "devextreme-react/data-grid";

export const StyledDataGridDef = styled(DataGridDef)(({ theme }) => ({
  width: "100%",

  "& .dx-header-row > td": {
    border: theme.palette.mode ==="dark" ? "1px solid #484848 !important" : "1px solid #888888 !important",
    borderTop: "none !important"
  },

  "@media (max-width: 900px)": {
    "& .dx-datagrid-header-panel": {
      height: "125px",
    },
  },

  "@media (min-width: 901px)": {
    "& .dx-datagrid-header-panel": {
      height: "100%",
    },
  },
}));
