import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { styled, useTheme } from "@mui/material/styles"
import { IFifoUser } from "@/features/strategies/users/iFifoUser"
import { StyledDrawer } from "@/features/strategies/shared/userDetailsDrawer"
import UserDetailsSection from "@/features/strategies/users/details/userDetailsSections"
import {
  deleteFifoUser,
  fetchFifoUsers,
  fetchUserDetails,
  updateFifoUser,
} from "@/features/strategies/users/fifoUsersSlice"
import { tableSx } from "@/features/strategies/shared/tableSx"
import { getColumns } from "@/features/strategies/users/usersColumnsDefs"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import {
  DataGrid,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
} from "@mui/x-data-grid"

export default function Reports() {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const { fifoUsers, userDetails } = useAppSelector(state => state.fifoUsers)
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const router = useRouter()
  const userId = router.query.userId ? router.query.userId[0] : undefined
  const [rightBarOpen, setRightBarOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<IFifoUser | undefined>()
  const [selectedRow, handleSetSelection] = useState<GridRowId | undefined>()

  useEffect(() => {
    dispatch(fetchFifoUsers())
  }, [dispatch])

  useEffect(() => {
    if (fifoUsers && !currentUser) {
      const currentUser = fifoUsers.find(user => user.id === userId)
      setCurrentUser(currentUser)
      setRightBarOpen(Boolean(currentUser))
    }
  }, [fifoUsers, dispatch, userId])

  useEffect(() => {
    if (!currentUser) {
      router.push(`/strategies/fifo/users`, undefined, {
        shallow: true,
      })
      return
    }

    dispatch(fetchUserDetails({ userId: currentUser.id }))
    router.push(`/strategies/fifo/users/${currentUser.id}`, undefined, {
      shallow: true,
    })
  }, [currentUser])

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
    dispatch(deleteFifoUser({ id: encodeURIComponent(id) as string }))
  }

  const handleCancelClick = (id: GridRowId) => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })
  }

  const handleViewClick = (id: GridRowId) => {
    const user = fifoUsers.find(user => user.id === id)
    setRightBarOpen(true)
    setCurrentUser(user)
  }

  const processRowUpdate = (newRow: IFifoUser) => {
    dispatch(updateFifoUser(newRow))
    return { ...newRow }
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const handleRowClick: GridEventListener<'rowClick'> = (params: GridRowParams) => {
    if (ivlUsers.indexOf(params.row) === 0) {
      handleViewClick(params.id);
      handleSetSelection(params.id);
    }
  };

  const columns = getColumns(
    handleSaveClick,
    handleEditClick,
    handleDeleteClick,
    handleCancelClick,
    handleViewClick,
    handleSetSelection,
    rowModesModel,
    theme,
    currentUser?.id,
  )

  const onToggleSideBar = () => {
    setRightBarOpen(prev => !prev)
  }

  return (
    <StyledRoot sx={{ 
      padding: 0 ,
      '& .red': {
        backgroundColor: 'red',
        color: 'white',
        fontWeight: 600
      },
      '& .dark-yellow': {
        backgroundColor: '#FDDA0D',
        color: 'black',
        fontWeight: 600
      },
      '& .selected-row': {
        backgroundColor: '#f2f2f2'
      }
      }}>
      <DataGrid<IFifoUser>
        slots={{
          footer: () => <></>,
        }}
        rowSelection={false}
        checkboxSelection={false}
        sx={tableSx}
        rows={fifoUsers}
        columns={columns}
        editMode="row"
        getRowId={row => row.id}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        onRowClick={handleRowClick}
        processRowUpdate={processRowUpdate}
        getRowClassName={(params) => params.id === selectedRow ? 'selected-row': ''}
      />

      {currentUser && (
        <StyledDrawer
          anchor="right"
          variant="permanent"
          sx={{
            "& .MuiDrawer-paper": {
              overflowY: rightBarOpen ? "auto" : "hidden",
            },
          }}
          open={rightBarOpen}>
          <DrawerHeader sx={{ marginTop: 2 }}>
            <IconButton
              sx={{ mt: "60px", ml: "-10px" }}
              onClick={onToggleSideBar}>
              {rightBarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          {userDetails && currentUser && (
            <UserDetailsSection
              theme={theme}
              opened={rightBarOpen}
              sx={{ padding: 2, paddingLeft: () => (rightBarOpen ? "auto" : "50px") }}
              {...userDetails}
              user={currentUser}
            />
          )}
        </StyledDrawer>
      )}
    </StyledRoot>
  )
}

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}))

const StyledRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("md")]: {
    display: "inherit",
  },
}))
