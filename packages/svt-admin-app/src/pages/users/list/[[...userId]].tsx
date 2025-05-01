import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { styled, useTheme } from "@mui/material/styles";
import { StyledDrawer } from "@/features/strategies/shared/userDetailsDrawer";
import UserDetailsSection from "@/features/strategies/users/details/userDetailsSections";
import { fetchUserDetails } from "@/features/strategies/users/fifoUsersSlice";
import { tableSx } from "@/features/strategies/shared/tableSx";
import { getColumns } from "@/features/users/userList/usersColumnsDefs";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import {
  DataGrid,
  GridToolbar,
  GridEventListener,
  GridRowModesModel,
  GridRowId,
  GridRowModes,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import { fetchUserAccountConnectionList } from "@/features/strategies/users/userDetailsSlice";
import { IUserAccountConnection } from "@/features/strategies/users/types";
import { useMediaQuery } from "@mui/system";

export default function Reports() {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const { adminUsers } = useAppSelector(state => state.adminDetails);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const router = useRouter();
  const userId = router.query.userId ? router.query.userId[0] : undefined;
  const [rightBarOpen, setRightBarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUserAccountConnection | undefined>();
  const [selectedRow, handleSetSelection] = useState<GridRowId | undefined>();
  const isMobile = useMediaQuery("(max-width: 485px)");
  const [tableHeight, setTableHeight] = useState("70vh");
  const { sidebarOpened } = useAppSelector(state => state.ui);

  useEffect(() => {
    dispatch(fetchUserAccountConnectionList());
  }, [dispatch]);

  useEffect(() => {
    if (adminUsers?.userAccountConnectionList_ && !currentUser) {
      const currentUser = adminUsers?.userAccountConnectionList_.find(user => user.userId === userId);
      setCurrentUser(currentUser);
      setRightBarOpen(Boolean(currentUser));
    }
  }, [adminUsers, dispatch, userId]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    router.push(`/users/list/${currentUser.userId}`, undefined, {
      shallow: true,
    });

    handleSetSelection(currentUser.userId);
  }, [currentUser, dispatch]);

  useEffect(() => {
    const calculateHeight = () => {
      const availableHeight = window.innerHeight - 100;
      setTableHeight(`${availableHeight}px`);
    };
    document.body.style.overflow = "hidden";
    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => {
      window.removeEventListener("resize", calculateHeight);
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const footerContainer = document.querySelector(".MuiDataGrid-footerContainer");
      if (footerContainer && footerContainer instanceof HTMLDivElement) {
        footerContainer.style.borderTop = "none";
        footerContainer.style.height = "36px";
        footerContainer.style.marginTop = "-6%";
        clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleSaveClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
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
          backgroundColor: theme?.palette?.mode === "dark" ? "#6f7171" : "#d4d4d4",
        },
      }}>
      <Grid
        sx={{ height: tableHeight }}
        container
        spacing={1}>
        <Grid item>
          <DataGrid<IUserAccountConnection>
            slots={{ toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                sx: {
                  ml: isMobile ? "3%" : "10%",
                  display: "flex",
                  justifyContent: "center !important",
                  alignItems: "center !important",
                  width: "100%",
                  gap: "8px",
                  padding: "20px 4px 0px",
                  flexWrap: "wrap",
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
            sx={{
              ...tableSx,
              height: "100%",
              "& .MuiDataGrid-footerContainer": {
                height: "60px !important",
                paddingBottom: 0,
              },
              "& .MuiDataGrid-main": {
                height: "calc(100vh - 185px)",
              },
            }}
            rows={adminUsers?.userAccountConnectionList_ ?? []}
            columns={columns}
            editMode="row"
            getRowId={row => row.userId}
            rowModesModel={rowModesModel}
            rowHeight={45}
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
                    width: rightBarOpen ? (sidebarOpened ? "61vw" : "55vw") : "2.5vw",
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
