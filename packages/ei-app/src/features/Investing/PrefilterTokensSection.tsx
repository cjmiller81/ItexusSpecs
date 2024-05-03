import { createFilter, deleteFilter, updateFilter } from "@/libs/redux/Slices/AllTokensTableSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { ICoin } from "@/services/backend-api.service"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { AccordionDetails, AccordionProps, Box } from "@mui/material"
import { PageTitle, StatePersistedAccordion } from "components"
import DataSource from "devextreme/data/data_source"
import { exportDataGrid } from "devextreme/excel_exporter"
import { Workbook } from "exceljs"
import { saveAs } from "file-saver-es"
import React, { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { CustomFilterBuilder } from "./CustomFilterBuilder"
import { StyledAccordionSummary } from "./IndexModelingSection"
import { PrefilterTokensTable } from "./PrefilterTokensTable"

type Props = Omit<AccordionProps, "children"> & {
  persisKey: string
  onFilteredTokensChanged: (filteredTokenData: ICoin[]) => void
}

export default function PrefilterTokensSection({ onFilteredTokensChanged, persisKey, ...props }: Props) {
  const {
    allTokens,
    allCategories,
    allChains,
    filters,
    fetchingTokensStatus,
    updatingFilterStatus,
    deletingFilterStatus,
    creatingFilterStatus,
  } = useAppSelector(state => state.allTokensTable)
  const [currentFilter, setCurrentFilter] = useState<object[] | null | undefined>()
  const [filterBuildeOpen, setFilterBuilderOpen] = useState(false)
  const dispatch = useAppDispatch()
  const { t } = useTranslation("PrefilterTokensSection")

  const allTokensSource = useMemo(
    () =>
      new DataSource<ICoin, string>({
        store: {
          type: "array",
          key: "id",
          data: allTokens,
        },
      }),
    [allTokens],
  )

  const onExporting = useCallback(async (e: any): Promise<void> => {
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet("Main sheet")

    const currentDate = new Date()

    await exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    })

    await workbook.xlsx.writeBuffer().then(buffer => {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `TokenSets-Model-Prefilter-Tokens-${currentDate.toISOString().split("T")[0]}.xlsx`,
      )
    })
    e.cancel = true
  }, [])

  return (
    <StatePersistedAccordion
      persistKey={persisKey}
      defaultExpanded
      {...props}>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
          <PageTitle sx={{ width: "100%" }}>{t("PrefilterTokens")}</PageTitle>
        </Box>
      </StyledAccordionSummary>
      <AccordionDetails sx={{ bgcolor: "background.paper" }}>
        <CustomFilterBuilder
          filterLoading={updatingFilterStatus === "loading" || creatingFilterStatus === "loading"}
          filterDeletingLoading={deletingFilterStatus === "loading"}
          open={filterBuildeOpen}
          onCreateFilter={filter => dispatch(createFilter(filter))}
          onClose={() => setFilterBuilderOpen(false)}
          predefinedFilters={filters}
          onUpdateFilter={filter => dispatch(updateFilter(filter))}
          onApply={filter => {
            setCurrentFilter(filter)
            setFilterBuilderOpen(false)
          }}
          filterToAppply={currentFilter}
          onDeleteFilter={filterId => dispatch(deleteFilter({ id: filterId }))}
        />

        <MemoizedPrefilterTokensTable
          onFilterBuilderOpen={() => setFilterBuilderOpen(true)}
          loading={fetchingTokensStatus === "loading"}
          onUpdate={onFilteredTokensChanged}
          onExport={onExporting}
          categories={allCategories}
          chains={allChains}
          currentFilter={currentFilter}
          onCurrentFilterChange={filter => setCurrentFilter(filter)}
          dataSource={allTokensSource}
        />
      </AccordionDetails>
    </StatePersistedAccordion>
  )
}

const MemoizedPrefilterTokensTable = React.memo(PrefilterTokensTable, (prevProps, nextProps) => {
  return (
    prevProps.dataSource === nextProps.dataSource &&
    prevProps.categories === nextProps.categories &&
    prevProps.chains === nextProps.chains &&
    prevProps.currentFilter === nextProps.currentFilter
  )
})
