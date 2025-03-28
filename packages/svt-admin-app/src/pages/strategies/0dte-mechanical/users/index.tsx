
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
import UserDetailsSection from "@/features/strategies/users/details/userDetailsSections";

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
  const isMobile = useMediaQuery("(max-width: 485px)");

  useEffect(() => {
    dispatch(fetchAllMechanical0DteSpx());
  }, [dispatch]);

  useEffect(() => {
    if (dteMechanicalUsers && dteMechanicalUsers.strategies && !currentUser) {
      const currentUser = dteMechanicalUsers.strategies.find(user => user.userId === userId);
      setCurrentUser(currentUser);
      setRightBarOpen(Boolean(currentUser));
    }
  }, [dteMechanicalUsers, dispatch, userId]);

  const handleSaveClick = (id: GridRowId) => {
    console.log("Save clicked for:", id);
  };
  
  const handleEditClick = (id: GridRowId) => {
    console.log("Edit clicked for:", id);
  };
  
  const handleDeleteClick = (id: GridRowId) => {
    console.log("Delete clicked for:", id);
  };
  
  const handleCancelClick = (id: GridRowId) => {
    console.log("Cancel clicked for:", id);
  };
  
  const handleViewClick = (id: GridRowId) => {
    console.log("View clicked for:", id);
    handleSetSelection(id);
  };
  

  const getRowId = (strategy: Mechanical0DteSpx) => {
    return strategy.userId + strategy.accountNumber;
  };

  const columns = getMechanical0DteSpxColumns(
    handleViewClick,
    handleSetSelection,
    rowModesModel,
    theme,
    currentUser ? getRowId(currentUser) : undefined
  );
  
console.log(dteMechanicalUsers?.strategies)
  return (
    <StyledRoot>
      <DataGrid
        slots={{ toolbar: GridToolbar }}
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
