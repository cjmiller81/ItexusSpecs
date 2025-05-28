import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import i18next, { t } from "i18next";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { green, red, blue } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';

i18next.setDefaultNamespace("ColumnsDefs");

export const getCallSetListTableColumns = (): GridColDef[] => {
   const theme = useTheme();
  return [
    {
      field: "account",
      headerName: t("Account", { ns: "ColumnsDefs" }),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.account}
        </Typography>
      ),
    },
    {
      field: "ticker",
      headerName: t("Ticker", { ns: "ColumnsDefs" }),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.ticker}
        </Typography>
      ),
    },
    {
      field: "action",
      headerName: t("Action", { ns: "ColumnsDefs" }),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        const theme = useTheme();
        const isDark = theme.palette.mode === "dark";
        const position = params.row;
        const isWorking = position.entryStatus === 'Working';
        const buttonText = isWorking ? t("CancelOrder", { ns: "ColumnsDefs" }) 
  : t("ClosePosition", { ns: "ColumnsDefs" });

        const handleClick = () => {
          console.log('Clicked:', position.id, position.ticker, buttonText);
        };

        const buttonStyles = isWorking
          ? isDark
            ? {
                backgroundColor: '#7f1d1d',
                borderColor: '#dc2626',
                color: '#f87171',
                '&:hover': {
                  backgroundColor: '#991b1b',
                  borderColor: '#ef4444',
                },
              }
            : {
                backgroundColor: '#fef2f2',
                borderColor: '#fecaca',
                color: '#dc2626',
                '&:hover': {
                  backgroundColor: '#fee2e2',
                  borderColor: '#fca5a5',
                },
              }
          : isDark
            ? {
                backgroundColor: '#7c2d12',
                borderColor: '#ea580c',
                color: '#fdba74', 
                '&:hover': {
                  backgroundColor: '#9a3412',
                  borderColor: '#fb923c',
                },
              }
            : {
                backgroundColor: '#fff7ed',
                borderColor: '#fed7aa',
                color: '#ea580c',
                '&:hover': {
                  backgroundColor: '#ffedd5',
                  borderColor: '#fdba74',
                },
              };

        return (
          <Box
            onClick={handleClick}
            sx={{
              ...buttonStyles,
              px: 1.5,
              py: 0.75,
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              cursor: 'pointer',
              border: '1px solid',
              transition: 'all 0.2s ease',
            }}
            title={buttonText}
          >
            <CloseIcon sx={{ fontSize: 14, mr: 0.5 }} />
            {buttonText}
          </Box>
        );
      },
    },
    {
      field: "optionType",
      headerName: t("Type", { ns: "ColumnsDefs" }),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        const theme = useTheme();
        const isDark = theme.palette.mode === "dark";
        const value = params.row.optionType as 'CALL' | 'PUT' | 'SHARES' | undefined;

        if (!value) {
          return <Typography sx={{ fontSize: "0.75rem", color: isDark ? theme.palette.grey[500] : theme.palette.grey[700] }}>—</Typography>;
        }

       const getChipStyles = () => {
        if (isDark) {
          switch (value) {
            case 'CALL':
              return {
                bgcolor: green[900],
                color: green[400],
                borderColor: green[600],
              };
            case 'PUT':
              return {
                bgcolor: red[900],
                color: red[400],
                borderColor: red[600],
              };
            case 'SHARES':
              return {
                bgcolor: blue[900],
                color: blue[400],
                borderColor: blue[600],
              };
          }
        } else {
          switch (value) {
            case 'CALL':
              return {
                bgcolor: green[100],
                color: green[800],
                borderColor: green[200],
              };
            case 'PUT':
              return {
                bgcolor: red[100],
                color: red[800],
                borderColor: red[200],
              };
            case 'SHARES':
              return {
                bgcolor: blue[100],
                color: blue[800],
                borderColor: blue[200],
              };
          }
        }
        return {
          bgcolor: '#e0e0e0',
          color: '#555555',
          borderColor: '#bdbdbd',
        };
        };

        const styles = getChipStyles();

        return (
          <Box
            sx={{
              backgroundColor: styles.bgcolor,
              color: styles.color,
              px: 1.5,
              py: 0.5,
              borderRadius: "16px",
              display: "inline-block",
              fontSize: "0.75rem",
              fontWeight: 600,
              border: '1px solid',
              borderColor: styles.borderColor,
              textTransform: "uppercase",
              textAlign: "center",
              minWidth: "60px",
            }}
          >
            {value}
          </Box>
        );
      },
    },
    {
      field: "qty",
      headerName: t("Qty", { ns: "ColumnsDefs" }),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.qty}
        </Typography>
      ),
    },
    {
      field: "DTERange",
      headerName: t("DTERange", { ns: "ColumnsDefs" }),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        const min = params.row.dteMin;
        const max = params.row.dteMax;

        if (typeof min !== 'number' || typeof max !== 'number') {
          return <Typography variant="body1">—</Typography>;
        }

        const renderNumberBox = (value: number) => (
          <Box
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? "#3e5260" : "#E5E7EB",
              borderRadius: "4px",
              px: 1,
              py: 0.5,
              fontSize: "0.75rem",
              minWidth: "32px",
              textAlign: "center",
              display: "inline-block",
              mx: 0.5,
            }}
          >
            {value}
          </Box>
        );

        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {renderNumberBox(min)}
            {min !== max && (
              <>
                <Typography variant="body1" sx={{ fontSize: "0.75rem", mx: 0.5 }}>to</Typography>
                {renderNumberBox(max)}
              </>
            )}
            <Typography variant="body1" sx={{ fontSize: "0.75rem", ml: 1 }}>DTE</Typography>
          </Box>
        );
      },
    },
    {
      field: "entryStatus",
      headerName: t("EntryStatus", { ns: "ColumnsDefs" }),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        const status = params.row?.entryStatus;
        const theme = useTheme();
        const isDark = theme.palette.mode === 'dark';

      if (status === "Working") {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isDark ? '#78350f' : '#fef3c7',
                border: `1px solid ${isDark ? '#d97706' : '#fde68a'}`,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                style={{
                  width: 12,
                  height: 12,
                  color: isDark ? '#facc15' : '#ca8a04'
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.85rem',
                fontWeight: 500,
                color: isDark ? '#facc15' : '#ca8a04',
              }}
            >
              {t("Working", { ns: "EntryStatus" }) || "Working"}
            </Typography>
          </Box>
        );
      }

      if (status === "Filled") {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isDark ? '#064e3b' : '#d1fae5',
                border: `1px solid ${isDark ? '#059669' : '#6ee7b7'}`,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                style={{
                  width: 12,
                  height: 12,
                  color: isDark ? '#34d399' : '#047857'
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.85rem',
                fontWeight: 500,
                color: isDark ? '#34d399' : '#047857',
              }}
            >
              {t("Filled", { ns: "EntryStatus" }) || "Filled"}
            </Typography>
          </Box>
        );
      }

      return (
        <Typography variant="body2" sx={{ fontSize: '0.85rem', color: isDark ? '#9ca3af' : '#6b7280' }}>
          {status || "—"}
        </Typography>
      );
    },
  },
    {
      field: "entryType",
      headerName: t("EntryType", { ns: "ColumnsDefs" }),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.entryType}
        </Typography>
      ),
    },
    {
      field: "entryPrice",
      headerName: t("EntryPrice", { ns: "ColumnsDefs" }),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.entryPrice != null ? `$${params.row.entryPrice}` : "—"}
        </Typography>
      ),
    },
    {
      field: "exitType",
      headerName: t("ExitType", { ns: "ColumnsDefs" }),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" sx={{ fontSize: "0.80rem" }}>
          {params.row.exitType ?? "—"}
        </Typography>
      ),
    },
    {
      field: "targetPrice",
      headerName: t("TargetPrice", { ns: "ColumnsDefs" }),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        const percentage = params.row.tierPercentage;
        const price = params.row.targetPrice;
        const isDark = theme.palette.mode === "dark";

        if (!percentage || !price) {
          return (
            <Typography
              variant="body2"
              sx={{ fontSize: "0.75rem", color: isDark ? "gray" : "gray" }}
            >
              —
            </Typography>
          );
        }

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: "0.75rem",
                fontWeight: 500,
                borderStyle: "solid",
                borderWidth: 1,
                minWidth: 45,
                textAlign: "center",
                color: isDark ? "#68D391" : "#276749",
                backgroundColor: isDark ? "#22543D" : "#C6F6D5",
                borderColor: isDark ? "#48BB78" : "#9AE6B4",
              }}
            >
              {percentage}%
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)",
              }}
            >
              ${price}
            </Typography>
          </Box>
        );
      },
    },

   {
      field: "stopPrice",
      headerName: t("StopPrice", { ns: "ColumnsDefs" }),
      sortable: false,
      editable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        const percentage = params.row.tierPercentage;
        const price = params.row.stopPrice;

        const theme = useTheme();
        const isDark = theme.palette.mode === "dark";

        if (!percentage || !price) {
          return (
            <Typography
              variant="body2"
              sx={{ fontSize: "0.75rem", color: isDark ? "gray" : "gray" }}
            >
              —
            </Typography>
          );
        }

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: "0.75rem",
                fontWeight: 500,
                borderStyle: "solid",
                borderWidth: 1,
                minWidth: 45,
                textAlign: "center",
                color: isDark ? "#F87171" : "#9B2C2C",
                backgroundColor: isDark ? "#7F1D1D" : "#FED7D7",
                borderColor: isDark ? "#EF4444" : "#FEB2B2",
              }}
            >
              {percentage}%
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)",
              }}
            >
              ${price}
            </Typography>
          </Box>
        );
      },
    }    
  ];
};
