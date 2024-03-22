import PageTitle from "@/components/TextDisplay/PageTitle"
import AppNumberInput from "@/components/common/inputs/NumberInput/AppNumberInput"
import { getIndexModelingTableColumns } from "@/constants/ColumnsDefs/IndexModelingTable"
import { InvestingTableAsset } from "@/models/Wallet/InvestingTableAsset"
import DownloadIcon from "@mui/icons-material/Download"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, Box, Button, styled } from "@mui/material"
import { useGridApiRef } from "@mui/x-data-grid"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import * as XLSX from "xlsx"
import { StyledWalletsTable } from "../MyWallets/WalletsTable"

interface Props extends Omit<AccordionProps, "children"> {
  title: string
  tableAssets: InvestingTableAsset[]
}

export const IndexModelingSection = ({ title, tableAssets, ...props }: Props) => {
  const { t } = useTranslation("IndexModelingSection")
  const apiRef = useGridApiRef()
  const [tokens, setTokens] = useState<number>(0)
  const [totalCapital, setTotalCapital] = useState<number>(0)

  const onExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(

      tableAssets.map(asset => ({
        symbol: asset.symbol,
        price: asset.price,
        marketCap: asset.marketCap,
        weight: asset.weight,
        qty: asset.qty,
      })),
    )
    const columnWidth12 = { wch: 12 }
    worksheet["!cols"] = worksheet["!cols"] = [
      columnWidth12,
      columnWidth12,
      columnWidth12,
      columnWidth12,
      columnWidth12,
    ]
    const workbook = XLSX.utils.book_new()
    XLSX.utils.sheet_add_aoa(worksheet, [["Symbol", "Price", "Market Cap", "Weight", "Qty"]], { origin: "A1" })
    XLSX.utils.book_append_sheet(workbook, worksheet, "assets")
    XLSX.writeFile(workbook, "assets.xlsx", { compression: true })
  }

  return (
    <Accordion
      defaultExpanded
      {...props}>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
          <PageTitle sx={{ width: "100%" }}>{title}</PageTitle>
          <Button
            sx={{ mr: 2 }}
            onClick={event => {
              event.stopPropagation()
              onExport()
            }}
            variant="outlined">
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <DownloadIcon></DownloadIcon>
              {t("Export")}
            </Box>
          </Button>
        </Box>
      </StyledAccordionSummary>
      <AccordionDetails sx={{ bgcolor: "background.paper" }}>
        <MainContainer
          sx={{ width: "100%" }}
          gap={2}>
          <LeftContainer>
            <AppNumberInput
              label={t("Tokens")}
              value={tokens}
              onChange={(_, value) => setTokens(value ?? 0)}
            />
            <AppNumberInput
              label={t("TotalCapital")}
              value={totalCapital}
              onChange={(_, value) => setTotalCapital(value ?? 0)}
            />
          </LeftContainer>
          <RightContainer>
            <StyledWalletsTable
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              rowSelection={false}
              checkboxSelection={false}
              pageSizeOptions={[5, 10]}
              apiRef={apiRef}
              getRowId={x => x.id}
              columns={getIndexModelingTableColumns()}
              rows={tableAssets}
            />
          </RightContainer>
        </MainContainer>
      </AccordionDetails>
    </Accordion>
  )
}

const LeftContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "30%",
  gap: theme.spacing(4),
  [theme.breakpoints.between("xs", "sm")]: {
    width: "100%",
  },
}))

const RightContainer = styled(Box)(({ theme }) => ({
  width: "70%",
  [theme.breakpoints.between("xs", "sm")]: {
    width: "100%",
  },
}))

const MainContainer = styled(Box)(({ theme }) => ({
  gap: theme.spacing(2),
  display: "flex",
  width: "100%",
  [theme.breakpoints.between("xs", "sm")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}))

const StyledAccordionSummary = styled(AccordionSummary)(() => ({
  transition: "none",
}))
