import React from 'react';
import { Box, darken, lighten, styled } from '@mui/material';
import { getCallSetListTableColumns } from './CallSetListTable';
import { BasicTable } from 'components';

const CallSetListSection = () => {
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);

  const handleSelectionChange = (newSelection: string[]) => {
    setSelectedRows(newSelection);
  };

  const tableScrollSx = {
    overflowY: 'auto',
    maxHeight: '400px',
  };

  const CallListTable = styled(BasicTable)(({ theme }) => ({
    width: "100%",
    minHeight: 300,
    mt: 2,
    display: "grid",
    "& .MuiDataGrid-virtualScroller": {
      overflowY: "auto !important",
    },
    "& .MuiDataGrid-main": {
      height: "auto",
      maxHeight: "300px",
    },
    "& .MuiDataGrid-footerContainer": {
      height: "40px",
    },
    "& .MuiDataGrid-row": {
      maxHeight: "1000px !important",
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
    <Box sx={{ width: '100%' }}>
      <CallListTable
        sx={{
          ...tableScrollSx,
          width: "100%",
        }}
        hideFooter
        rowSelection
        getRowId={(row) => row.ticker} 
        columns={getCallSetListTableColumns()}
        rows={[]} 
        rowSelectionModel={selectedRows}
      />
    </Box>
  );
};

export default CallSetListSection;
