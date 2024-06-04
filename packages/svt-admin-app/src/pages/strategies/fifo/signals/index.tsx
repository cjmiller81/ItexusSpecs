import { getColumns } from "@/features/strategies/signals/columnsDefs"
import { EditToolbar } from "@/features/strategies/signals/editToolbar"
import {
  createFifoSignal,
  deleteFifoSignal,
  fetchFifoSignals,
  updateFifoSignal,
} from "@/features/strategies/signals/fifiSignalSlice"
import { FifoSignalRow } from "@/features/strategies/signals/fifoSignalRow"
import { getNewFifoSignal } from "@/features/strategies/signals/utils"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import Box from "@mui/material/Box"
import { darken, lighten } from "@mui/system"
import {
  DataGrid,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
} from "@mui/x-data-grid"
import { useEffect, useMemo, useState } from "react"

export default function FullFeaturedCrudGrid() {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [newRows, setNewRows] = useState<FifoSignalRow[]>([])
  const { fifoSignals } = useAppSelector(state => state.fifoSignals)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchFifoSignals({}))
  }, [dispatch])

  const fifoSignalsRows = useMemo(
    () =>
      fifoSignals.map<FifoSignalRow>(signal => ({
        ...signal,
        id: `${signal.masterSymbol}.${signal.targetMultiple}`,
      })),
    [fifoSignals],
  )


  const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id: GridRowId) => {
    dispatch(deleteFifoSignal({ id: encodeURIComponent(id) as string }))
  }

  const handleCancelClick = (id: GridRowId) => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    if (newRows.some(newItem => newItem.id === id)) {
      setNewRows(prevNewRows => prevNewRows.filter(newRow => newRow.id !== id))
    }
  }

  const processRowUpdate = (newRow: FifoSignalRow) => {
    if (newRows.some(newItem => newItem.id === newRow.id)) {
      dispatch(createFifoSignal(newRow))
      setNewRows(prevNewRows => prevNewRows.filter(newRow => newRow.id !== newRow.id))
    } else {
      dispatch(updateFifoSignal(newRow))
    }

    return { ...newRow }
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const onAddClick = () => {
    if (newRows.length) return
    const newItem = getNewFifoSignal()
    setNewRows(prevNewRows => [...prevNewRows, newItem])
    setRowModesModel(oldModel => ({
      ...oldModel,
      [newItem.id]: { mode: GridRowModes.Edit, fieldToFocus: "masterSymbol" },
    }))
  }

  const columns = getColumns(handleSaveClick, handleEditClick, handleDeleteClick, handleCancelClick, rowModesModel);
  return (
    <Box
      sx={{
        height: 530,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}>
      <DataGrid<FifoSignalRow>
        sx={{
          width: "100%",
          height: 530,
          mt: 2,
          display: "grid",
          "& .MuiDataGrid-virtualScroller": {},
          "& .MuiDataGrid-main": {
            height: "444px",
          },
          "& .MuiDataGrid-footerContainer": {
            height: "60px",
            paddingBottom: "15px",
          },
          "& .MuiDataGrid-virtualScrollerContent": {},
          "& .MuiDataGrid-row": {
            maxHeight: "1000px !important",
          },
          ".MuiDataGrid-cell--withRenderer ": {
            maxHeight: "1000px !important",
          },
          "& .MuiDataGrid-row--editing": {
            border: "solid",
            borderWidth: "1px",
            borderColor: theme => theme.palette.primary.main,
          },
          "& .MuiDataGrid-cell--editing": {
            border: "solid",
            borderWidth: "1px",
            borderColor: theme => theme.palette.primary.main,
            backgroundColor: theme =>
              theme.palette.mode === "dark"
                ? darken(theme.palette.primary.main, 0.6)
                : lighten(theme.palette.primary.main, 0.7),
          },
          ".MuiDataGrid-withBorderColor": {
            bgColor: "transparent",
          },
        }}
        rows={fifoSignalsRows.concat(newRows)}
        columns={columns}
        editMode="row"
        getRowId={row => row.id}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { onAddClick },
        }}
      />
    </Box>
  )
}
