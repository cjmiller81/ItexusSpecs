import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { styled, useTheme } from "@mui/material/styles";
import { StyledDrawer } from "@/features/strategies/shared/userDetailsDrawer";
import UserDetailsSection from "@/features/strategies/users/details/userDetailsSections";
import { deleteFifoUser, fetchUserDetails } from "@/features/strategies/users/fifoUsersSlice";
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
import { fetchUserAccountConnectionList } from "@/features/strategies/users/userDetailsSlice";
import { IUserAccountConnection } from "@/features/strategies/users/types";
import { useMediaQuery } from "@mui/system";

export default function Reports() {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const { adminUsers } = useAppSelector(state => state.adminDetails);
  const dispatch = useAppDispatch();
  const theme = useTheme(); // Get theme with useTheme
  const router = useRouter();
  const userId = router.query.userId ? router.query.userId[0] : undefined;
  const [rightBarOpen, setRightBarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUserAccountConnection | undefined>();
  const [selectedRow, handleSetSelection] = useState<GridRowId | undefined>();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(fetchUserAccountConnectionList());
  }, [dispatch]);

  useEffect(() => {
    if (adminUsers?.userAccountConnectionList_ && adminUsers?.userAccountConnectionList_.length > 0) {
      const id = adminUsers.userAccountConnectionList_[0].userId;
      router.push(`/users/list/${id}`, undefined, {
        shallow: true,
      });
      handleSetSelection(id);
      handleViewClick(id);
    }
  }, [adminUsers]);

  useEffect(() => {
    if (adminUsers?.userAccountConnectionList_ && !currentUser) {
      const currentUser = adminUsers?.userAccountConnectionList_.find(user => user.userId === userId);
      setCurrentUser(currentUser);
      setRightBarOpen(Boolean(currentUser));
    }
  }, [adminUsers, dispatch, userId]);

  useEffect(() => {
    if (!currentUser) {
      router.push(`/users/list`, undefined, {
        shallow: true,
      });
      return;
    }

    dispatch(fetchUserDetails({ userId: currentUser.userId }));
    router.push(`/users/list/${currentUser.userId}`, undefined, {
      shallow: true,
    });
  }, [currentUser, dispatch]);

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
    const user = adminUsers?.userAccountConnectionList_.find(user => user.userId === id);
    setRightBarOpen(true);
    setCurrentUser(user);
  };

  const processRowUpdate = (newRow: IUserAccountConnection) => {
    //dispatch(updateFifoUser(newRow)); not implemented yet
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
    currentUser?.userId,
    isMobile,
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
          backgroundColor: theme?.palette?.mode === "dark" ? "#6f7171" : "#d4d4d4", // Safe access
        },
      }}>
      <Grid
        container
        spacing={1}>
        <Grid
          item
          sx={{ height: "80vh" }}>
          <DataGrid<IUserAccountConnection>
            slots={{
              footer: () => <></>,
            }}
            rowSelection={false}
            checkboxSelection={false}
            sx={{
              ...tableSx,
              height: "100%",
              "& .MuiDataGrid-main": {
                height: "auto !important",
              },
            }}
            rows={adminUsers?.userAccountConnectionList_ ?? []}
            columns={columns}
            editMode="row"
            getRowId={row => row.userId}
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            getRowClassName={params => (params.id === selectedRow ? "selected-row" : "")}
          />
        </Grid>

        <Grid>
          {currentUser && (
            <StyledDrawer
              anchor="right"
              variant="permanent"
              PaperProps={{
                sx: {
                  "&.MuiDrawer-paper": {
                    width: rightBarOpen ? (sidebarOpened ? "57vw" : "55vw") : "2.5vw",
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
              {adminUsers?.userAccountConnectionList_ && currentUser && (
                <UserDetailsSection
                  theme={theme}
                  opened={rightBarOpen}
                  sx={{
                    padding: 2,
                    paddingLeft: () => (rightBarOpen ? "auto" : "50px"),
                  }}
                  user={currentUser}
                  id={currentUser.userId}
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
  padding: theme?.spacing(0, 1) || "8px",
  ...(theme?.mixins?.toolbar || {}),
  justifyContent: "flex-start",
}));

const StyledRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  [theme?.breakpoints?.down("md")]: {
    display: "inherit",
  },
}));
