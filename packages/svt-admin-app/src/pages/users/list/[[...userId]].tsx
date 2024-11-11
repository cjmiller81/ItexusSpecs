import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { styled, useTheme } from "@mui/material/styles";
import { IUserList } from "@/features/users/userList/iUserList";
import { StyledDrawer } from "@/features/strategies/shared/userDetailsDrawer";
import UserDetailsSection from "@/features/strategies/users/details/userDetailsSections";
import {
  deleteFifoUser,
  fetchFifoUsers,
  fetchUserDetails,
  updateFifoUser,
} from "@/features/strategies/users/fifoUsersSlice";
import { tableSx } from "@/features/strategies/shared/tableSx";
import { getColumns } from "@/features/users/userList/usersColumnsDefs";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import {
  DataGrid,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
} from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";

export default function Reports() {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const { fifoUsers, userDetails } = useAppSelector(state => state.fifoUsers);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const router = useRouter();
  const userId = router.query.userId ? router.query.userId[0] : undefined;
  const [rightBarOpen, setRightBarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUserList | undefined>();
  const [selectedRow, handleSetSelection] = useState<GridRowId | undefined>();

  useEffect(() => {
    dispatch(fetchFifoUsers());
  }, [dispatch]);

  useEffect(() => {
    if (fifoUsers.length > 0) {
      const id = fifoUsers[0].id;
      router.push(`/users/list/${id}`, undefined, {
        shallow: true,
      });
      handleSetSelection(id);
      handleViewClick(id);
    }
  }, [fifoUsers]);

  useEffect(() => {
    if (fifoUsers && !currentUser) {
      const currentUser = fifoUsers.find(user => user.id === userId);
      setCurrentUser(currentUser);
      setRightBarOpen(Boolean(currentUser));
    }
  }, [fifoUsers, dispatch, userId]);

  useEffect(() => {
    if (!currentUser) {
      router.push(`/users/list`, undefined, {
        shallow: true,
      });
      return;
    }

    dispatch(fetchUserDetails({ userId: currentUser.id }));
    router.push(`/users/list/${currentUser.id}`, undefined, {
      shallow: true,
    });
  }, [currentUser]);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => {
    dispatch(deleteFifoUser({ id: encodeURIComponent(id) as string }));
  };

  const handleCancelClick = (id: GridRowId) => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleViewClick = (id: GridRowId) => {
    const user = fifoUsers.find(user => user.id === id);
    setRightBarOpen(true);
    setCurrentUser(user);
  };

  const processRowUpdate = (newRow: IUserList) => {
    dispatch(updateFifoUser(newRow));
    return { ...newRow };
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = getColumns(
    handleSaveClick,
    handleCancelClick,
    handleViewClick,
    handleSetSelection,
    rowModesModel,
    theme,
    currentUser?.id,
  );

  const onToggleSideBar = () => {
    setRightBarOpen(prev => !prev);
  };
  const { sidebarOpened } = useAppSelector(state => state.ui);

  return (
    <StyledRoot
      sx={{
        padding: 0,
        "& .red": {
          backgroundColor: "red",
          color: "white",
          fontWeight: 600,
        },
        "& .dark-yellow": {
          backgroundColor: "#FDDA0D",
          color: "black",
          fontWeight: 600,
        },
        "& .selected-row": {
          backgroundColor: theme.palette.mode === "dark" ? "#6f7171" : "#d4d4d4",
        },
      }}>
      <Grid
        container
        spacing={1}>
        <Grid
          item
          xs={12}
          md="auto">
          <DataGrid<IUserList>
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
            processRowUpdate={processRowUpdate}
            getRowClassName={params => (params.id === selectedRow ? "selected-row" : "")}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md="auto">
          {currentUser && (
            <StyledDrawer
              anchor="right"
              variant="permanent"
              PaperProps={{
                sx: {
                  "&.MuiDrawer-paper": {
                    width: rightBarOpen ? (sidebarOpened ? "51vw" : "55vw") : "3vw",
                  },
                },
              }}
              sx={{
                backgroundColor: "orange",
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
                  sx={{
                    padding: 2,
                    paddingLeft: () => (rightBarOpen ? "auto" : "50px"),
                  }}
                  {...userDetails}
                  user={currentUser}
                />
              )}
            </StyledDrawer>
          )}
        </Grid>
      </Grid>
    </StyledRoot>
  );
}

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

const StyledRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("md")]: {
    display: "inherit",
  },
}));
