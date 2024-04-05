/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateFilterModel } from "@/libs/redux/Slices/AllTokensTableSlice"
import { IPrefilterTokensFilterValues } from "@/services/backend-api.service"
import { isDeepEqual } from "@/utils/utils"
import { Box, Button, Grid, Typography } from "@mui/material"
import FilterBuilderDef from "devextreme-react/filter-builder"
import SelectBoxDef from "devextreme-react/select-box"
import { TextBox } from "devextreme-react/text-box"
import { NativeEventInfo } from "devextreme/events"
import { ValueChangedInfo } from "devextreme/ui/editor/editor"
import { ValueChangedEvent } from "devextreme/ui/filter_builder"
import React, { useEffect, useState } from "react"
import ReactPlayer from "react-player"
import { filterBuilderFields } from "../prefilter-tokens-table/prefilter-tokens-table.constants"

interface ICustomFilterBuilderProps {
  predefinedFilters: IPrefilterTokensFilterValues[]
  onCreateFilter: (filter: CreateFilterModel) => void
  onUpdateFilter: (filter: IPrefilterTokensFilterValues) => void
  onDeleteFilter: (filterId: string) => void
  filterToAppply?: object[] | null
  onApply: (filterValue: object[]) => void
  onClose: () => void
}

const CustomFilterBuilder: React.FC<ICustomFilterBuilderProps> = ({
  predefinedFilters,
  onCreateFilter,
  onUpdateFilter,
  onDeleteFilter,
  filterToAppply,
  onApply,
  onClose,
}) => {
  const [selectedSavedFilter, setSelectedSavedFilter] = useState<IPrefilterTokensFilterValues | null>(null)
  const [filterName, setFilterName] = useState<string | undefined>("")
  const [filterValue, setFilterValue] = useState<object[] | undefined | null>()

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
    }
  }, [])

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
    onDeleteFilter(selectedSavedFilter.id)
    setSelectedSavedFilter(null)
  }

  return (
    <Box>
      <Grid
        container
        spacing={1}>
        <Grid
          xs={3}
          item>
          <FilterBuilderDef
            value={filterValue as any[]}
            fields={filterBuilderFields}
            onValueChanged={handleFilterValueChanged}
          />
          <Button
            sx={{ marginTop: "20px" }}
            disabled={!filterValue || !filterValue.length}
            onClick={handleClearFilters}
            variant="outlined"
            color="warning">
            Clear
          </Button>
        </Grid>
        <Grid
          xs={9}
          item>
          <div className="dx-field">
            <div className="dx-field-label">Select pre-built filter:</div>
            <div className="dx-field-value">
              <SelectBoxDef
                displayExpr="text"
                dataSource={predefinedFilters}
                value={selectedSavedFilter?.id}
                valueExpr={"id"}
                onValueChanged={handleSavedFilterChange}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Selected filter name:</div>
            <div className="dx-field-value">
              <Box sx={{ display: "flex" }}>
                <TextBox
                  width={"75%"}
                  defaultValue={filterName}
                  value={filterName}
                  showClearButton={true}
                  onValueChanged={e => setFilterName(e.value)}></TextBox>
                <Box sx={{ marginLeft: "20px", display: "flex", justifyContent: "space-between", width: "25%" }}>
                  <Button
                    disabled={!filterValue && !filterName}
                    onClick={handleSaveFilter}
                    variant="contained"
                    color="primary">
                    Save
                  </Button>
                  <Button
                    disabled={!selectedSavedFilter}
                    onClick={handleDeleteFilter}
                    variant="contained"
                    color="error">
                    Delete
                  </Button>
                </Box>
              </Box>
            </div>
          </div>
          <Grid
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab animi optio similique quidem enim vero
                veritatis sequi dolores obcaecati commodi quae laudantium amet corrupti nobis, cum, laboriosam mollitia
                ratione? Provident!
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "right" }}>
        <Button
          disabled={!filterValue}
          onClick={handleApplyFilter}
          variant="contained"
          color="primary">
          Apply Filter
        </Button>
      </Box>
    </Box>
  )
}

export default CustomFilterBuilder
