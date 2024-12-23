import { IvlUser } from "@/features/strategies/ivl/users/IvlUser"
import { StyledDrawer } from "@/features/strategies/shared/userDetailsDrawer"
import UserDetailsSection from "@/features/strategies/ivl/users/details/userDetailsSections"
import {
  deleteIvlUser,
  fetchIvlUsers,
  fetchUserDetails,
  updateIvlUser,
} from "@/features/strategies/ivl/users/ivlUsersSlice"
import { autoSizeTableSx } from "@/features/strategies/shared/tableSx"
import { getColumns } from "@/features/strategies/ivl/users/usersColumnsDefs"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import { styled, useTheme } from "@mui/material/styles"
import {
  DataGrid,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridToolbar,
} from "@mui/x-data-grid"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useMediaQuery } from "@mui/material"

export default function Reports() {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const { ivlUsers, userDetails } = useAppSelector(state => state.ivlUsers)
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const router = useRouter()
  const userId = router.query.userId ? router.query.userId[0] : undefined
  const [rightBarOpen, setRightBarOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<IvlUser | undefined>()
  const [selectedRow, handleSetSelection] = useState<GridRowId | undefined>()
  const isMobile = useMediaQuery("(max-width: 485px)");

  useEffect(() => {
    dispatch(fetchIvlUsers({}))
  }, [dispatch])

  useEffect(() => {
    if (ivlUsers && !currentUser) {
      const currentUser = ivlUsers.find(user => user.userId === userId)
      setCurrentUser(currentUser)
      setRightBarOpen(Boolean(currentUser))
    }
  }, [ivlUsers, dispatch, userId])

  useEffect(() => {
    if (!currentUser) {
      router.push(`/strategies/ivl/users`, undefined, {
        shallow: true,
      })

      return
    }

    dispatch(fetchUserDetails({ userId: currentUser.userId }))
    router.push(`/strategies/ivl/users/${currentUser.userId}`, undefined, {
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
    dispatch(deleteIvlUser({ id: encodeURIComponent(id) as string }))
  }

  const handleCancelClick = (id: GridRowId) => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })
  }

  const handleViewClick = (id: GridRowId) => {
    const user = ivlUsers.find(user => getRowId(user) === id)
    setRightBarOpen(true)
    setCurrentUser(user)
  }

  const processRowUpdate = (newRow: IvlUser) => {
    dispatch(updateIvlUser(newRow))
    return { ...newRow }
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const getRowId = (strategy: IvlUser) => {
    return strategy.userId + strategy.accountNumber;
  }

  const columns = getColumns(
    handleSaveClick,
    handleEditClick,
    handleDeleteClick,
    handleCancelClick,
    handleViewClick,
    handleSetSelection,
    rowModesModel,
    theme,
    currentUser ? getRowId(currentUser) : undefined,
  )

  const onToggleSideBar = () => {
    setRightBarOpen(prev => !prev)
  }

  return (
    <StyledRoot sx={{
      padding: 0,
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
        backgroundColor: theme.palette.mode === 'dark' ? '#6f7171' : '#d4d4d4'
      }
      }}>
      <DataGrid<IvlUser>
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            sx: {
              "& .MuiButton-root": {
                color: theme.palette.text.primary,
                fontWeight: "bold",
            },
          },
        },
        }}
        autoPageSize
        rowSelection={false}
        checkboxSelection={false}
        sx={{...autoSizeTableSx, 
          "& .MuiDataGrid-footerContainer": {
            height: "auto",
            paddingBottom: 0,
          },
          "& .MuiDataGrid-main": {
            height: `calc(100vh - ${isMobile ? '250px' : '220px'})`,
          },
        }}
        rows={ivlUsers}
        columns={columns}
        editMode="row"
        getRowId={getRowId}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
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
