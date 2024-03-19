import PageTitle from "@/components/TextDisplay/PageTitle"
import AppUpDown from "@/components/common/inputs/AppUpDown"
import { indexModelingTableColumns } from "@/constants/ColumnsDefs/IndexModelingTable"
import { InvestingTableAsset } from "@/models/Wallet/InvestingTableAsset"
import { toCsvFile } from "@/utils/indexModelingHelpers"
import DownloadIcon from "@mui/icons-material/Download"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, Box, Button, styled } from "@mui/material"
import { useGridApiRef } from "@mui/x-data-grid"
import { useState } from "react"
import { useTranslation } from "react-i18next"
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
    const csvFile = toCsvFile(tableAssets)

    const link = document.createElement("a")
    const url = URL.createObjectURL(csvFile)

    link.href = url
    link.download = csvFile.name
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <Accordion
      sx={{ bgcolor: "background.paper" }}
      {...props}>
      <AccordionSummary
        sx={{ bgcolor: "background.paper" }}
        expandIcon={<ExpandMoreIcon />}>
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
      </AccordionSummary>
      <AccordionDetails sx={{ bgcolor: "background.paper" }}>
        <MainContainer
          sx={{ width: "100%" }}
          gap={2}>
          <LeftContainer>
            <AppUpDown
              label={t("Tokens")}
              value={tokens}
              onChange={(event, value) => setTokens(value ?? 0)}
            />
            <AppUpDown
              label={t("TotalCapital")}
              value={totalCapital}
              onChange={(event, value) => setTotalCapital(value ?? 0)}></AppUpDown>
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
              columns={indexModelingTableColumns}
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
