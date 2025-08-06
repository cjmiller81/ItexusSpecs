import { Box } from "@mui/system";
import { GridRow } from "@mui/x-data-grid";
import { nativeBarSx } from "../../components/common/SimpleBarStyled";
import { BasicTable } from "../../components/DataDisplay";
import { toTableTokensModels } from "../../utils";
import { getTokenNamesColumns } from "./TokensTableColumnsDefs";
import { useTranslation } from "react-i18next";
import WalletTokensOverview from "./DEX/WalletTokensOverview";
import MovingIcon from "@mui/icons-material/Moving";
import { Typography } from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";

export const ExpandableRowDex = (props: any) => {
  const rows = toTableTokensModels(props.row.chainAssets);
  const { t } = useTranslation("MyWalletsPage");
  return (
    <Box sx={{ overflowX: "auto" }}>
      <GridRow {...props} />
      {props.isExpanded(props.rowId) && (
        <Box
          px={3}
          py={1}>
            <Box
             display="flex"
             flexDirection="row"
             alignItems="center" // ← ключевая строка
            >
                <MovingIcon sx={{ color: "#72dd5fff", paddingRight:"10px", fontSize:"44px" }} />
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 450, mb: 0, paddingTop:"" }}>
                    {t("WalletTokens")}
                </Typography>
                
            </Box>

            <Box
             display="flex"
             flexDirection="row"
             alignItems="center"
            >
                <LayersIcon sx={{ color: "#e49a41ff", paddingRight:"10px", fontSize:"44px" }} />
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 450, mb: 0, paddingTop:"" }}>
                    {t("DeFiPositions")}
                </Typography>
                
            </Box>
        </Box>
      )}
    </Box>
  );
};

const tableScrollSx = {
  "& .MuiDataGrid-virtualScroller": {
    ...nativeBarSx,
  },
}
