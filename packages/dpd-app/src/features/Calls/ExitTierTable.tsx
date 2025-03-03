import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  IconButton,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { TierData } from '@/models/TierData';
import { Column } from '@/models/Column';
import { useTranslation } from 'react-i18next';

const columns: Column[] = [
  { id: 'addTier', label: 'Add Tier', minWidth: 80, align: 'center' },
  { id: 'exitTier', label: 'Exit Tier', minWidth: 80, align: 'center' },
  { id: 'percentPosition', label: '% Position', minWidth: 100, align: 'center' },
  { id: 'exitType', label: 'Exit Type', minWidth: 100, align: 'center' },
  { id: 'optionPftOffset', label: 'Option Pft Offset', minWidth: 120, align: 'center' },
  { id: 'optionStopOffset', label: 'Option Stop Offset', minWidth: 140, align: 'center' },
  { id: 'stockPftOffset', label: 'Stock Pft Offset', minWidth: 120, align: 'center' },
  { id: 'stockStopOffset', label: 'Stock Stop Offset', minWidth: 140, align: 'center' },
  { id: 'removeTier', label: 'Remove Tier', minWidth: 100, align: 'center' },
];

const defaultInitialRow: TierData = {
  id: 'row-0',
  exitTier: '1',
  percentPosition: '100',
  exitType: 'Limit',
  optionPftOffset: '9',
  optionStopOffset: '--',
  stockPftOffset: '2',
  stockStopOffset: '--',
};

export default function ExitTierTable({isSendTriggerChecked: isSendTriggerChecked}) {
  const theme = useTheme();
  const [rows, setRows] = useState<TierData[]>([defaultInitialRow]);
  const { t } = useTranslation("CallsSection");

  useEffect(() => {
    setRows(isSendTriggerChecked ? [defaultInitialRow] : []);
  }, [isSendTriggerChecked]);

  const updateExitTiers = (updatedRows: TierData[]) => {
    return updatedRows.map((row, index) => ({
      ...row,
      exitTier: (index + 1).toString()
    }));
  };

  const handleAddTier = () => {
    const totalAllocated = rows.reduce((sum, row) => {
      const value = parseFloat(row.percentPosition);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);

    const remainingPercent = Math.max(0, 100 - totalAllocated);
    
    const newRow: TierData = {
      id: `row-${rows.length}`,
      exitTier: (rows.length + 1).toString(), 
      percentPosition: remainingPercent.toString(),
      exitType: 'Limit',
      optionPftOffset: '9',
      optionStopOffset: '--',
      stockPftOffset: '2',
      stockStopOffset: '--',
    };
    
    setRows([...rows, newRow]);
  };

  const handleRemoveTier = (id: string) => {
    const rowToRemove = rows.find(row => row.id === id);
    if (!rowToRemove) return;
    
    const removedPercentage = parseFloat(rowToRemove.percentPosition);
    let remainingRows = rows.filter(row => row.id !== id);
    
    if (remainingRows.length === 1) {
      remainingRows = [{
        ...remainingRows[0],
        percentPosition: '100'
      }];
    } else {
      const firstRow = remainingRows[0];
      const currentFirstRowPercentage = parseFloat(firstRow.percentPosition);
      const newFirstRowPercentage = currentFirstRowPercentage + removedPercentage;
      
      remainingRows = remainingRows.map((row, index) => 
        index === 0 
          ? { ...row, percentPosition: newFirstRowPercentage.toString() } 
          : row
      );
    }
    
    setRows(updateExitTiers(remainingRows));
  };

  const handleNumberChange = (id: string, field: keyof TierData, value: string) => {
    if (field === 'percentPosition') {
      const otherRowsSum = rows.reduce((sum, row) => 
        row.id !== id ? sum + parseFloat(row.percentPosition) : sum, 0);
      
      const numValue = parseFloat(value);
      const maxAllowed = 100 - otherRowsSum;
      const validValue = isNaN(numValue) ? '0' : Math.min(numValue, maxAllowed).toString();
      
      setRows(rows.map(row => {
        if (row.id === id) {
          return { ...row, [field]: validValue };
        }
        return row;
      }));
    } else {
      setRows(
        rows.map(row => {
          if (row.id === id) {
            return { ...row, [field]: value };
          }
          return row;
        })
      );
    }
  };

  const handleExitTypeChange = (id: string, event: SelectChangeEvent<string>) => {
    const exitType = event.target.value;
    setRows(
      rows.map(row => {
        if (row.id === id) {
          if (exitType === 'Limit') {
            return { 
              ...row, 
              exitType, 
              optionStopOffset: '--', 
              stockStopOffset: '--' 
            };
          } else {
            return { 
              ...row, 
              exitType, 
              optionStopOffset: '5', 
              stockStopOffset: '1' 
            };
          }
        }
        return row;
      })
    );
  };

  const shouldShowAddTierButton = () => {
    const totalAllocated = rows.reduce((sum, row) => {
      const value = parseFloat(row.percentPosition);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
    
    return Math.round(totalAllocated) < 100;
  };

  const styles = {
    card: {
      backgroundColor: '#333',
      borderRadius: 2,
      border: '1px solid #444',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
    },
    tableContainer: {
      backgroundColor: 'transparent',
    },
    table: {
      minWidth: 650,
    },
    headerCell: {
      backgroundColor: '#222',
      color: '#fff',
      fontWeight: 'bold',
      border: '1px solid #444',
      padding: '12px 8px',
    },
    tableCell: {
      color: '#ddd',
      border: '1px solid #444',
      padding: '8px',
    },
    numberInput: {
      '& .MuiInputBase-input': {
        color: '#fff',
        textAlign: 'center',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#555',
        },
        '&:hover fieldset': {
          borderColor: '#777',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#4caf50',
        },
      },
    },
    selectInput: {
      '& .MuiInputBase-input': {
        color: '#fff',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#555',
        },
        '&:hover fieldset': {
          borderColor: '#777',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#4caf50',
        },
      },
      '& .MuiSelect-icon': {
        color: '#aaa',
      },
    },
    disabledInput: {
      '& .MuiInputBase-input': {
        color: '#777',
        '-webkit-text-fill-color': '#777',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#444',
        },
      },
    },
    addButton: {
      color: '#4caf50',
      '&:hover': {
        backgroundColor: 'rgba(76, 175, 80, 0.08)',
      },
    },
    removeButton: {
      color: '#f44336',
      '&:hover': {
        backgroundColor: 'rgba(244, 67, 54, 0.08)',
      },
    },
    staticText: {
      color: '#ddd',
      fontSize: '1rem',
    },
  };

  return (
    <Card sx={styles.card}>
      <TableContainer sx={styles.tableContainer} component={Paper}>
        <Table sx={styles.table} stickyHeader aria-label="dynamic tier table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={styles.headerCell}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell sx={styles.tableCell} align="center">
                </TableCell>
                
                <TableCell sx={styles.tableCell} align="center">
                  <span style={styles.staticText}>{row.exitTier}</span>
                </TableCell>
                
                <TableCell sx={styles.tableCell} align="center">
                  <TextField
                    value={row.percentPosition}
                    onChange={(e) => handleNumberChange(row.id, 'percentPosition', e.target.value)}
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 100, step: 1 } }}
                    variant="outlined"
                    size="small"
                    sx={styles.numberInput}
                  />
                </TableCell>
                
                <TableCell sx={styles.tableCell} align="center">
                  <FormControl size="small" fullWidth sx={styles.selectInput}>
                    <Select
                      value={row.exitType}
                      onChange={(e) => handleExitTypeChange(row.id, e)}
                      displayEmpty
                    >
                      <MenuItem value="Limit">{t("Limit")}</MenuItem>
                      <MenuItem value="OCO">{t("OCO")}</MenuItem>
                      <MenuItem value="Limit">{t("Limit")}</MenuItem>
                      <MenuItem value="OCO">{t("OCO")}</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                
                <TableCell sx={styles.tableCell} align="center">
                  <TextField
                    value={row.optionPftOffset}
                    onChange={(e) => handleNumberChange(row.id, 'optionPftOffset', e.target.value)}
                    type="number"
                    InputProps={{ inputProps: { step: 0.1 } }}
                    variant="outlined"
                    size="small"
                    sx={styles.numberInput}
                  />
                </TableCell>
                
                <TableCell sx={styles.tableCell} align="center">
                  {row.exitType === 'Limit' ? (
                    <span style={styles.staticText}>--</span>
                  ) : (
                    <TextField
                      value={row.optionStopOffset === '--' ? '5' : row.optionStopOffset}
                      onChange={(e) => handleNumberChange(row.id, 'optionStopOffset', e.target.value)}
                      type="number"
                      InputProps={{ inputProps: { step: 0.1 } }}
                      variant="outlined"
                      size="small"
                      sx={styles.numberInput}
                    />
                  )}
                </TableCell>
                
                <TableCell sx={styles.tableCell} align="center">
                  <TextField
                    value={row.stockPftOffset}
                    onChange={(e) => handleNumberChange(row.id, 'stockPftOffset', e.target.value)}
                    type="number"
                    InputProps={{ inputProps: { step: 0.1 } }}
                    variant="outlined"
                    size="small"
                    sx={styles.numberInput}
                  />
                </TableCell>
                
                <TableCell sx={styles.tableCell} align="center">
                  {row.exitType === 'Limit' ? (
                    <span style={styles.staticText}>--</span>
                  ) : (
                    <TextField
                      value={row.stockStopOffset === '--' ? '1' : row.stockStopOffset}
                      onChange={(e) => handleNumberChange(row.id, 'stockStopOffset', e.target.value)}
                      type="number"
                      InputProps={{ inputProps: { step: 0.1 } }}
                      variant="outlined"
                      size="small"
                      sx={styles.numberInput}
                    />
                  )}
                </TableCell>
                
                <TableCell sx={styles.tableCell} align="center">
                  {index > 0 && (
                    <IconButton 
                      size="small" 
                      sx={styles.removeButton}
                      onClick={() => handleRemoveTier(row.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          
          {isSendTriggerChecked && shouldShowAddTierButton() && (
            <TableBody>
              <TableRow hover tabIndex={-1} key="add-tier-row">
                <TableCell sx={{...styles.tableCell, backgroundColor: '#1976d2', padding: '0'}} align="center">
                  <div 
                    style={{
                      color: 'white', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={handleAddTier}
                  >
                    <AddIcon fontSize="small" style={{ marginRight: '4px' }} />
                    {t("AddTier")}
                  </div>
                </TableCell>
                <TableCell sx={styles.tableCell} align="center"></TableCell>
                <TableCell sx={styles.tableCell} align="center"></TableCell>
                <TableCell sx={styles.tableCell} align="center"></TableCell>
                <TableCell sx={styles.tableCell} align="center"></TableCell>
                <TableCell sx={styles.tableCell} align="center"></TableCell>
                <TableCell sx={styles.tableCell} align="center"></TableCell>
                <TableCell sx={styles.tableCell} align="center"></TableCell>
                <TableCell sx={styles.tableCell} align="center"></TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Card>
  );
}