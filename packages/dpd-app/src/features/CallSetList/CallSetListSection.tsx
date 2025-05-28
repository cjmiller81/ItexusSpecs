import React from 'react';
import { Box, darken, lighten, styled, Typography, useTheme } from '@mui/material';
import { getCallSetListTableColumns } from './CallSetListTable';
import { BasicTable } from 'components';
import { mockTrdaePositions } from '@/mocks/mockTradePositions';

const CallSetListSection = () => {
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
  const theme = useTheme();
  const handleSelectionChange = (newSelection: string[]) => {
    setSelectedRows(newSelection);
  };
  

  const tableScrollSx = {
    overflowY: 'auto',
    maxHeight: '500px',
  };

  const CallListTable = styled(BasicTable)(({ theme }) => ({
    borderRadius:"8px",
    width: "100%",
    minHeight: 590,
    mt: 2,
    display: "grid",
    "& .MuiDataGrid-virtualScroller": {
      overflowY: "auto !important",
    },
    "& .MuiDataGrid-main": {
      height: "auto",
      maxHeight: "1900px",
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: theme.palette.mode === "dark" ? "#353F4B" : "#F3F4F6",
      fontWeight: 600,
      fontSize: "14px",
    },
    "& .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeaderTitle": {
      textTransform: "uppercase",
    },
    "& .MuiDataGrid-footerContainer": {
      height: "40px",
    },
     "& .MuiDataGrid-row": {
      backgroundColor: theme.palette.mode === "dark" ? "#111827" : "#FFFFFF",
      borderBottom: "1px solid",
      borderBottomColor: theme.palette.divider,
      maxHeight: "1000px !important",
    },
    "& .MuiDataGrid-cell": {
      backgroundColor: theme.palette.mode === "dark" ? "#111827" : "#FFFFFF",
    },
    ".MuiDataGrid-cell--withRenderer ": {
      maxHeight: "1000px !important",
    },
    "& .MuiDataGrid-row--editing": {
      border: "solid",
      borderWidth: "1px",
      borderColor: theme.palette.primary.main,
    },
    "& .MuiDataGrid-cell--editing[data-field=walletName]": {
      border: "solid",
      borderWidth: "1px",
      borderColor: theme.palette.primary.main,
      backgroundColor:
        theme.palette.mode === "dark"
          ? darken(theme.palette.primary.main, 0.6)
          : lighten(theme.palette.primary.main, 0.7),
    },
    ".MuiDataGrid-withBorderColor": {
      bgColor: "transparent",
    },
  }));

  return (
    <Box sx={{ width: '100%', height: "100%" }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 600 }}
      >
        Set List
      </Typography>
      <CallListTable
        sx={{
          ...tableScrollSx,
          width: "100%",
          height: "100%"
        }}
        hideFooter
        rowSelection
        getRowId={(row) => row.id}
        columns={getCallSetListTableColumns(theme)}
        rows={mockTrdaePositions} 
        rowSelectionModel={selectedRows}
      />
    </Box>
  );
};

export default CallSetListSection;
