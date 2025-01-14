import { styled } from "@mui/material/styles";
import DataGridDef from "devextreme-react/data-grid";

export const StyledDataGridDef = styled(DataGridDef)(() => ({
  width: "100%",
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
