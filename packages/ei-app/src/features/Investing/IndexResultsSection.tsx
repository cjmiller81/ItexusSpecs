import React from "react";
import {
  AccordionProps,
  Box,
  styled,
  Typography,
  Select,
  Grid,
  MenuItem,
  SelectChangeEvent,
  Button,
} from "@mui/material";
import { AppAccordionSection, InvestingTableAsset, nativeBarSx, StyledWalletsTable } from "components";
import { useTranslation } from "react-i18next";
import { useGridApiRef } from "@mui/x-data-grid";
import { getIndexResultTableColumns } from "@/constants/ColumnsDefs/IndexResultTable";

interface Props extends Omit<AccordionProps, "children"> {
  title: string;
  tableAssets: InvestingTableAsset[];
}

export const IndexResultsSection = ({ title, tableAssets, ...props }: Props) => {
  const { t } = useTranslation("IndexModelingSection");
  const apiRef = useGridApiRef();

  return (
    <AppAccordionSection
      persistKey="IndexResultsSection"
      defaultExpanded={false}
      title={title}
      {...props}>
      <MainContainer
        display="flex"
        justifyContent="space-between">
        <LeftContainer sx={{ justifyContent: "space-between" }}>
          <LeftColumn>
            <Typography
              variant="h6"
              component="div"
              sx={{ alignSelf: "flex-start" }}>
              Current Position
            </Typography>
            <Select
              displayEmpty
              value=""
              onChange={(event: SelectChangeEvent) => {}}
              renderValue={(selected: string | null) => {
                return selected === "" ? "+ADD SAVED POSITION" : selected;
              }}
              sx={{
                backgroundColor: "success.main",
                color: "white",
                width: "98%",
                "& .MuiSelect-icon": { color: "white" },
              }}></Select>
            <Select
              displayEmpty
              value=""
              onChange={(event: SelectChangeEvent) => {}}
              renderValue={(select: string | null) => {
                return (
                  <Typography sx={{ fontSize: "0.75rem", color: "white" }}>
                    {" "}
                    {/* Установите нужный размер шрифта */}
                    +ADD SAVED WALLET
                  </Typography>
                );
              }}
              sx={{
                backgroundColor: "#109EEF",
                color: "white",
                width: "98%",
                "& .MuiSelect-icon": { color: "white" },
              }}></Select>
            <Button
              sx={{ mr: 2, width: "90px", height: "40px" }}
              variant="outlined"
              disabled>
              Save
            </Button>
            <Button
              sx={{ mr: 2, width: "90px", height: "40px" }}
              variant="outlined">
              Clear
            </Button>
          </LeftColumn>

          <RightColumn sx={{ paddingLeft: 1 }}>
            <StyledWalletsTable
              sx={{
                ...tableScrollSx,
                maxWidth: 180,
                "& .MuiDataGrid-cell": {
                  padding: "4px 7px",
                  alignSelf: "flex-end",
                },
              }}
              hideFooter
              rowSelection={false}
              checkboxSelection={false}
              apiRef={apiRef}
              getRowId={x => x.id}
              columns={getIndexResultTableColumns()}
              rows={tableAssets}
            />
          </RightColumn>
        </LeftContainer>

        <MiddleContainer>
          <Typography
            variant="h5"
            component="div">
            Rebalanced Index Quantities
          </Typography>
          <Typography
            sx={{ mb: 1.5 }}
            color="text.secondary"></Typography>
          <Typography variant="body2"></Typography>
        </MiddleContainer>

        <RightContainer>
          <Typography
            variant="h5"
            component="div">
            Position Allocation Updates
          </Typography>
          <Typography
            sx={{ mb: 1.5 }}
            color="text.secondary"></Typography>
          <Typography variant="body2"></Typography>
        </RightContainer>
      </MainContainer>
    </AppAccordionSection>
  );
};

const tableScrollSx = {
  "& .MuiDataGrid-virtualScroller": {
    ...nativeBarSx,
  },
};

const LeftContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
  width: "33%",
  borderRadius: "10px",
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    width: "100%",
  },
}));

const LeftColumn = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  width: "40%", // Определите ширину для левого столбца с выпадающими списками
}));

const RightColumn = styled(Box)(({ theme }) => ({
  width: "60%", // Определите ширину для правого столбца с таблицей
}));

const MainContainer = styled(Box)(({ theme }) => ({
  gap: theme.spacing(2),
  display: "flex",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}));

const MiddleContainer = styled(Box)(({ theme }) => ({
  width: "20%",
  boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
  borderRadius: "10px",
}));

const RightContainer = styled(Box)(({ theme }) => ({
  width: "42%",
  boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
  borderRadius: "10px",
}));
