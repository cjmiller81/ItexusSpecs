/* eslint-disable @typescript-eslint/no-explicit-any */
import YesNoDialog from "@/components/Modals/YesNoDialog"
import { CreateFilterModel } from "@/libs/redux/Slices/AllTokensTableSlice"
import { IPrefilterTokensFilterValues } from "@/services/backend-api.service"
import { isDeepEqual } from "@/utils/utils"
import CloseIcon from "@mui/icons-material/Close"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material"
import FilterBuilderDef from "devextreme-react/filter-builder"
import SelectBoxDef from "devextreme-react/select-box"
import { NativeEventInfo } from "devextreme/events"
import { ValueChangedInfo } from "devextreme/ui/editor/editor"
import { ValueChangedEvent } from "devextreme/ui/filter_builder"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import ReactPlayer from "react-player"
import { filterBuilderFields } from "../../constants/PrefilterTokensTable"

interface ICustomFilterBuilderProps {
  predefinedFilters: IPrefilterTokensFilterValues[]
  onCreateFilter: (filter: CreateFilterModel) => void
  onUpdateFilter: (filter: IPrefilterTokensFilterValues) => void
  onDeleteFilter: (filterId: string) => void
  filterToAppply?: object[] | null
  onApply: (filterValue: object[]) => void
  onClose: () => void
  open?: boolean
  filterLoading?: boolean
  filterDeletingLoading?: boolean
}

export const CustomFilterBuilder: React.FC<ICustomFilterBuilderProps> = ({
  predefinedFilters,
  onCreateFilter,
  onUpdateFilter,
  onDeleteFilter,
  filterToAppply,
  onApply,
  onClose,
  filterLoading,
  filterDeletingLoading,
  open,
}) => {
  const [selectedSavedFilter, setSelectedSavedFilter] = useState<IPrefilterTokensFilterValues | null>(null)
  const [filterName, setFilterName] = useState<string | undefined>("")
  const [filterValue, setFilterValue] = useState<object[] | undefined | null>()
  const [deleteFilterDialog, setDeleteFilterDialog] = useState(false)
  const { t } = useTranslation("CustomFilterBuilder")

  const handleFilterValueChanged = (event: ValueChangedEvent) => {
    if (isDeepEqual(event.value, filterValue)) {
      return
    }

    setFilterValue(event.value)
  }

  const handleApplyFilter = () => {
    if (filterValue) onApply(filterValue)
    else onClose()
  }

  useEffect(() => {
    setFilterValue(filterToAppply)
    const isPredefinedFilter = predefinedFilters.find(filter => isDeepEqual(filter.filter, filterToAppply))

    if (isPredefinedFilter) {
      setSelectedSavedFilter(isPredefinedFilter)
      setFilterName(isPredefinedFilter.text)
    } else {
      setSelectedSavedFilter(null)
      setFilterName("")
    }
  }, [filterToAppply, open])

  const handleSavedFilterChange = (
    event: NativeEventInfo<any, KeyboardEvent | MouseEvent | PointerEvent | Event> & ValueChangedInfo,
  ) => {
    const predefinedFilter = predefinedFilters.find(filter => filter.id === event?.value)
    if (predefinedFilter) {
      setSelectedSavedFilter(predefinedFilter)
      setFilterValue(predefinedFilter.filter)
      setFilterName(predefinedFilter.text)
    }
  }

  const handleClearFilters = () => {
    setSelectedSavedFilter(null)
    setFilterValue(undefined)
    setFilterName("")
  }

  const handleSaveFilter = () => {
    if (!filterName) return
    if (selectedSavedFilter) {
      onUpdateFilter({
        id: selectedSavedFilter.id,
        text: filterName,
        description: filterName,
        icon: "filter",
        isPublic: true,
        OwnerUserId: "",
        isPublished: false,
        accessPlanName: "",
        filter: filterValue || [],
      })
    } else {
      onCreateFilter({
        text: filterName,
        description: filterName,
        icon: "filter",
        isPublic: true,
        OwnerUserId: "",
        isPublished: false,
        accessPlanName: "",
        filter: filterValue || [],
      })
    }
  }

  const handleDeleteFilter = () => {
    if (!selectedSavedFilter) return
    setDeleteFilterDialog(true)
  }

  const onAgree = () => {
    if (!selectedSavedFilter) return
    onDeleteFilter(selectedSavedFilter.id)
    setDeleteFilterDialog(false)
    setSelectedSavedFilter(null)
    setFilterName("")
    setFilterValue(null)
  }

  return (
    <>
      <YesNoDialog
        content={t("DeleteDialogContent")}
        title={t("DeleteDialogTitle")}
        onAgree={onAgree}
        open={deleteFilterDialog}
        onClose={() => setDeleteFilterDialog(false)}
      />
      <Dialog
        fullWidth
        open={open!}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              minHeight: "80%",
              minWidth: "90%",
            },
          },
        }}
        onClose={onClose}>
        <IconButton
          sx={{ position: "absolute", right: "10px", top: "10px" }}
          onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <DialogTitle sx={{ bgcolor: "background.paper" }}>
          <Typography variant="h6">{t("FilterTokens")}</Typography>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "background.paper" }}>
          <Box sx={{ width: "100%" }}>
            <ContentContainer>
              <Stack>
                <FilterBuilderComponentContainer>
                  <FilterBuilderDef
                    value={filterValue as any[]}
                    fields={filterBuilderFields}
                    onValueChanged={handleFilterValueChanged}
                  />
                </FilterBuilderComponentContainer>

                <ClearButton
                  disabled={!filterValue || !filterValue.length}
                  onClick={handleClearFilters}
                  variant="contained"
                  color="warning">
                  {t("Clear", { ns: "Common" })}
                </ClearButton>

                <StyledDivider />
                <FilterControlsContainer>
                  <Stack
                    gap={2}
                    alignItems={"center"}
                    direction={"row"}>
                    <Typography
                      noWrap
                      fontWeight={500}
                      variant="body1"
                      minWidth={90}>
                      {t("SaveFilterAs")}
                    </Typography>
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={event => setFilterName(event.target.value)}
                      value={filterName}
                      size="small"
                    />
                  </Stack>
                  <Stack
                    minWidth={300}
                    direction={"row"}
                    gap={2}
                    justifyContent="space-between"
                    height={24}>
                    <LoadingButton
                      loading={filterLoading}
                      sx={{ minWidth: 90 }}
                      color="primary"
                      disabled={!filterName}
                      onClick={handleSaveFilter}
                      variant="contained">
                      {t("Save", { ns: "Common" })}
                    </LoadingButton>
                    <Button
                      sx={{ width: "100%" }}
                      disabled={!filterValue}
                      onClick={handleApplyFilter}
                      variant="contained"
                      color={"success"}>
                      {t("ApplyFilter")}
                    </Button>
                  </Stack>
                </FilterControlsContainer>
              </Stack>
              <Stack>
                <FilterSelectorContainer>
                  <Typography
                    noWrap
                    fontWeight={500}
                    variant="body1"
                    minWidth={150}>
                    {t("SelectFilter")}
                  </Typography>
                  <SelectBoxDef
                    width={"100%"}
                    displayExpr="text"
                    dataSource={predefinedFilters}
                    value={selectedSavedFilter?.id}
                    valueExpr={"id"}
                    onValueChanged={handleSavedFilterChange}
                  />
                  <LoadingButton
                    loading={filterDeletingLoading}
                    disabled={!selectedSavedFilter}
                    onClick={handleDeleteFilter}
                    variant="contained"
                    color="error">
                    {t("Delete", { ns: "Common" })}
                  </LoadingButton>
                </FilterSelectorContainer>
                <MockContent />
              </Stack>
            </ContentContainer>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

const MockContent = () => {
  return (
    <Grid
      mt={2}
      spacing={3}
      container>
      <Grid
        xs={6}
        item>
        <Typography
          variant="h2"
          sx={{ marginBottom: "20px", dixplay: "flex", justifyContent: "center" }}>
          How to make a custom filter
        </Typography>
        <ReactPlayer
          width={"100%"}
          url="https://www.youtube.com/watch?v=h0bABvxh67c"
        />
      </Grid>
      <Grid
        xs={6}
        item>
        <Typography
          sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}
          variant="h4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab animi optio similique quidem enim vero veritatis
          sequi dolores obcaecati commodi quae laudantium amet corrupti nobis, cum, laboriosam mollitia ratione?
          Provident!
        </Typography>
      </Grid>
    </Grid>
  )
}

const FilterBuilderComponentContainer = styled(Box)(({ theme }) => ({
  minHeight: theme.spacing(16),
}))

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(2),
  alignSelf: "center",
  width: "80%",
}))

const ClearButton = styled(Button)(({ theme }) => ({
  alignSelf: "center",
  width: "50%",
  marginTop: theme.spacing(2),
}))

const ContentContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}))

const FilterControlsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}))

const FilterSelectorContainer = styled(Box)(({ theme }) => ({
  alignItems: "center",
  display: "flex",
  gap: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    marginTop: theme.spacing(2),
  },
}))
