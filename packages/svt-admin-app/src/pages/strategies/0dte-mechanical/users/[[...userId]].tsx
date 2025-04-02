
import { useRouter } from "next/router";
import { styled, useTheme } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { StyledDrawer } from "@/features/strategies/shared/userDetailsDrawer";
import { useEffect, useState } from "react";
import {
  DataGrid,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridToolbar,
} from "@mui/x-data-grid";

import { autoSizeTableSx } from "@/features/strategies/shared/tableSx";
import { Box, IconButton, useMediaQuery } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Mechanical0DteSpx } from "@/features/strategies/0dte-mechanical/users/types";
import { fetchAllMechanical0DteSpx } from "@/features/strategies/0dte-mechanical/dteMechanicalUsersSlice";
import { getMechanical0DteSpxColumns } from "@/features/strategies/0dte-mechanical/dteMechanicalUsersColumnsDefs";
import UserDetailsSection from "@/features/strategies/0dte-mechanical/users/details/UserDetailsSection";
import { fetchUserDetails } from "@/features/strategies/0dte-iron-flies/users/dteUsersSlice";

export default function Reports() {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const { dteMechanicalUsers } = useAppSelector(state => state.dteMechanicalUsers);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const router = useRouter();
  const userId = router.query.userId ? router.query.userId[0] : undefined;
  const [rightBarOpen, setRightBarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Mechanical0DteSpx | undefined>();
  const [selectedRow, handleSetSelection] = useState<GridRowId | undefined>();
  const { userDetails } = useAppSelector(state => state.dteUsers);

  useEffect(() => {
    dispatch(fetchAllMechanical0DteSpx());
  }, [dispatch]);

  useEffect(() => {
      if (!currentUser) {
        return;
      }
  
      const symbol = "SPX";

      router.push(`/strategies/0dte-mechanical/users/${currentUser.userId}`, undefined, {
        shallow: true,
      });

      handleSetSelection(getRowId(currentUser));
      if (currentUser?.userId) {
        dispatch(fetchUserDetails({ userId: currentUser.userId, symbol }));
      }
      
    }, [currentUser]);

  useEffect(() => {
    if (dteMechanicalUsers && dteMechanicalUsers.strategies && !currentUser) {
      const currentUser = dteMechanicalUsers.strategies.find(user => user.userId === userId);
      setCurrentUser(currentUser);
      setRightBarOpen(Boolean(currentUser));
    }
  }, [dteMechanicalUsers, dispatch, userId]);

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
      //dispatch(deleteDteUser({ id: encodeURIComponent(id) as string }));
    };
  
    const handleCancelClick = (id: GridRowId) => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
    };
  
  const handleViewClick = (id: GridRowId) => {
    const user = dteMechanicalUsers.strategies.find(user => getRowId(user) === id);
    setRightBarOpen(true);
    setCurrentUser(user);
  };
  
  const getRowId = (strategy: Mechanical0DteSpx) => {
    const rowId = strategy.strategyId + strategy.accountNumber;
    return rowId;
  };

  const columns = getMechanical0DteSpxColumns(
    handleViewClick,
    handleSetSelection,
    rowModesModel,
    theme,
    currentUser ? getRowId(currentUser) : undefined
  );
  
  return (
    <StyledRoot>
      <DataGrid
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
        sx={autoSizeTableSx}
        rows={dteMechanicalUsers?.strategies || []}
        columns={columns}
        editMode="row"
        getRowId={getRowId}
        rowModesModel={rowModesModel}
      />

      {currentUser && (
        <StyledDrawer anchor="right" variant="permanent" open={rightBarOpen}>
          <DrawerHeader>
            <IconButton onClick={() => setRightBarOpen(prev => !prev)}>
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
