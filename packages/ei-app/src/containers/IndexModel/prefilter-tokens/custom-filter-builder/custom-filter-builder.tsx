/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react'
import FilterBuilderDef from 'devextreme-react/filter-builder'
import SelectBoxDef from 'devextreme-react/select-box'
import { TextBox } from 'devextreme-react/text-box'
import { Box, Button, Grid, Typography } from '@mui/material'
import ReactPlayer from 'react-player'
import { v4 as uuid } from 'uuid'

import backendApiService, { IPrefilterTokensFilterValues } from '@/services/backend-api.service'
import { isDeepEqual } from '@/utils/utils'
import { useNotification } from '../../notification-hook'

interface ICustomFilterBuilderProps {
  onApplyFilter: (filterValue: any) => void
  predefinedFilters: IPrefilterTokensFilterValues[]
  fields: any[]
  loadFilterValues: () => void
  appliedFilterValue: string | Function | any[] | undefined
  filterToAppply: string | Function | any[] | undefined
}

const CustomFilterBuilder: React.FC<ICustomFilterBuilderProps> = ({
  onApplyFilter,
  predefinedFilters,
  fields,
  loadFilterValues,
  appliedFilterValue,
  filterToAppply
}) => {
  const [selectedSavedFilter, setSelectedSavedFilter] = useState<IPrefilterTokensFilterValues | undefined>(undefined)
  const [filterName, setFilterName] = useState('')
  const [filterValue, setFilterValue] = useState<string | Function | any[] | undefined>(filterToAppply ?? appliedFilterValue)
  const { showNotification } = useNotification()

  const handleFilterValueChanged = useCallback(
    (e: any) => {
      setFilterValue(e.value)
    },
    [setFilterValue]
  )

  const handleApplyFilter = useCallback(
    () => {
      // Call the callback function to apply the filter in your parent component
      onApplyFilter(filterValue)
    },
    [filterValue, onApplyFilter]
  )

  useEffect(
    () => {
      setFilterValue(filterToAppply ?? appliedFilterValue)

      const isPredefinedFilter = predefinedFilters.find(filter => {
        const isEqual = isDeepEqual(filter.filter, filterToAppply ?? appliedFilterValue)
        return isEqual
      })

      if (isPredefinedFilter) {
        setSelectedSavedFilter(isPredefinedFilter)
        setFilterName(isPredefinedFilter.text)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const handleSavedFilterChange = useCallback(
    (e: any): void => {
      if (e?.value !== selectedSavedFilter?.id) {
        const predefinedFilter = predefinedFilters.find(filter => (filter.id === e?.value))
        if (predefinedFilter) {
          setSelectedSavedFilter(predefinedFilter)
          setFilterValue(predefinedFilter.filter)
          setFilterName(predefinedFilter.text)
        }
      }
    },
    [predefinedFilters, selectedSavedFilter?.id]
  )
  const handleClearFilters = useCallback(
    (): void => {
      setSelectedSavedFilter(undefined)
      setFilterValue('')
      setFilterName('')
    },
    [setFilterValue, setSelectedSavedFilter]
  )

  const handleSaveFilter = useCallback(
    async () => {
      try {
        if (selectedSavedFilter) {
          const result = await backendApiService.createTokensFilters({
            id: selectedSavedFilter.id,
            text: filterName,
            description: filterName,
            icon: 'filter',
            isPublic: true,
            OwnerUserId: '',
            isPublished: false,
            accessPlanName: '',
            filter: JSON.stringify(filterValue),
          })

          if (result) {
            showNotification('Filter updated', 'success')
            loadFilterValues()
            console.log('Filter updated successfully')
          } else {
            console.log('Filter update failed')
          }
        } else {
          // Create a new filter
          const result = await backendApiService.createTokensFilters(
            {
              id: uuid(),
              text: filterName,
              description: filterName,
              icon: 'filter',
              isPublic: true,
              OwnerUserId: '',
              isPublished: false,
              accessPlanName: '',
              filter: JSON.stringify(filterValue),
            },
            1
          )

          if (result) {
            // Filter created successfully
            console.log('Filter created successfully')
            loadFilterValues()
            showNotification('Filter created', 'success')
          } else {
            // Filter creation failed
            console.log('Filter creation failed')
          }
        }
      } catch (error) {
        // Handle any errors that might occur during the API call
        console.error('Error:', error)
      }
    },
    [filterName, filterValue, loadFilterValues, selectedSavedFilter, showNotification]
  )

  const handleDeleteFilter = useCallback(
    async () => {
      // Implement the logic to delete the saved filter using an API or other method
      // You can use the selectedSavedFilter state variable for this
      console.log('Deleting filter:', selectedSavedFilter)

      try {
        if (selectedSavedFilter) {
          const success = await backendApiService.deleteTokensFilters(selectedSavedFilter.id)

          if (success) {
            showNotification('Filter deleted', 'success')
          }
          loadFilterValues()
        }
      } catch (error) {
        console.error(error)
      }
    },
    [loadFilterValues, selectedSavedFilter, showNotification]
  )

  return (
    <div id="custom-filter-builder">
      <Grid container spacing={1}>
        <Grid xs={3} item>
          <FilterBuilderDef value={filterValue} fields={fields} onValueChanged={handleFilterValueChanged} />
          <Button sx={{ marginTop: '20px' }} disabled={!filterValue} onClick={handleClearFilters} variant="outlined" color="warning">
            Clear
          </Button>
        </Grid>
        <Grid xs={9} item>
          <div className="dx-fieldset">
            <div className="dx-field">
              <div className="dx-field-label">Select pre-built filter:</div>
              <div className="dx-field-value">
                <SelectBoxDef displayExpr="text" dataSource={predefinedFilters} value={selectedSavedFilter?.id} valueExpr={'id'} onValueChanged={handleSavedFilterChange} />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Selected filter name:</div>
              <div className="dx-field-value">
                <Box sx={{ display: 'flex' }}>
                  <TextBox
                    width={'75%'}
                    defaultValue={filterName}
                    value={filterName}
                    showClearButton={true}
                    onValueChanged={(e) => setFilterName(e.value)}
                  ></TextBox>
                  <Box sx={{ marginLeft: '20px', display: 'flex', justifyContent: 'space-between', width: '25%' }}>
                    <Button disabled={!filterValue && !filterName} onClick={handleSaveFilter} variant="contained" color="primary">
                      Save
                    </Button>
                    <Button disabled={!selectedSavedFilter} onClick={handleDeleteFilter} variant="contained" color="error">
                      Delete
                    </Button>
                  </Box>
                </Box>
              </div>
            </div>
            <Grid spacing={3} container>
              <Grid xs={6} item>
                <Typography variant="h2" sx={{ marginBottom: '20px', dixplay: 'flex', justifyContent: 'center' }}>
                  How to make a custom filter
                </Typography>
                <ReactPlayer width={'100%'} url="https://www.youtube.com/watch?v=h0bABvxh67c" />
              </Grid>
              <Grid xs={6} item>
                <Typography sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }} variant="h4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab animi optio similique quidem enim vero veritatis sequi dolores
                  obcaecati commodi quae laudantium amet corrupti nobis, cum, laboriosam mollitia ratione? Provident!
                </Typography>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'right' }}>
        <Button disabled={!filterValue} onClick={handleApplyFilter} variant="contained" color="primary">
          Apply Filter
        </Button>
      </Box>
    </div>
  )
}
export default CustomFilterBuilder
