import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { DATA_GRID_STYLES } from '../constants/tableSizes';

export const useDataGridStyles = () => {
  const theme = useTheme();

  return useMemo(() => ({
    borderRadius: DATA_GRID_STYLES.BORDER_RADIUS,
    "& .MuiDataGrid-cell": { py: DATA_GRID_STYLES.CELL_PADDING_Y },
    "& .MuiDataGrid-main": {
      bgcolor: theme.palette.mode === "dark" ? "#363f4cff" : "white",
      borderRadius: DATA_GRID_STYLES.BORDER_RADIUS,
    },
  }), [theme.palette.mode]);
};
