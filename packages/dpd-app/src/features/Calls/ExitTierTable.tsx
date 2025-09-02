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
import { Column } from '@/models/Column';
import { useTranslation } from 'react-i18next';
import { ExitTier } from '@/models/SubProfile';

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

const defaultInitialRow: ExitTier = {
  exitTierPositionPercent: 100,
  exitType: 'Limit',
  optionStopOffsetPercent: 5,
  optionTargetOffsetPercent: 9,
  stockStopOffsetPercent: 1,
  stockTargetOffsetPercent: 2,
};

export default function ExitTierTable({isSendTriggerChecked: isSendTriggerChecked, onExitTiersChange: handleExitTiersChange, exitTiers}) {
  const theme = useTheme();
  const [rows, setRows] = useState<ExitTier[]>([defaultInitialRow]);
  const { t } = useTranslation("CallsSection");
  const tableContainerBackgroundColor = theme.palette.mode === 'dark' ? '#2b2b2b' : 'transparent';

  const styles = {
    card: {
      backgroundColor: '#333',
      borderRadius: 2,
      border: '1px solid #444',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
    },
    tableContainer: {
      backgroundColor: tableContainerBackgroundColor,
    },
    table: {
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

  useEffect(() => {
    setRows(isSendTriggerChecked ? [defaultInitialRow] : []);
  }, [isSendTriggerChecked]);

  useEffect(() => {
    if (Array.isArray(exitTiers)) {
      const sortedExitTiers = [...exitTiers].sort((a, b) => b.exitTierPositionPercent - a.exitTierPositionPercent);
      setRows(sortedExitTiers);
    } else {
      setRows([]);
    }
  }, [exitTiers]);
  

  const handleExitTypeChange = (index: number, event: SelectChangeEvent<string>) => {
    const exitType = event.target.value;
  
    setRows((prevRows) => {
      const updatedRows = prevRows.map((row, i) =>
        i === index
          ? {
              ...row,
              exitType,
              optionStopOffsetPercent: 5,
              stockStopOffsetPercent: 1,
            }
          : row
      );
  
      handleExitTiersChange(updatedRows);
      return updatedRows;
    });
  };
  

  const handleAddTier = () => {
    const totalAllocated = rows.reduce((sum, row) => {
      return sum + row.exitTierPositionPercent;
    }, 0);
  
    const remainingPercent = Math.max(0, 100 - totalAllocated);
  
    const newRow: ExitTier = {
      exitTierPositionPercent: remainingPercent,
      exitType: 'Limit',
      optionStopOffsetPercent: 5,
      optionTargetOffsetPercent: 9,
      stockStopOffsetPercent: 1,
      stockTargetOffsetPercent: 2,
    };
  
    const updatedRows = [...rows, newRow];
  
    setRows(updatedRows);
  
    handleExitTiersChange(updatedRows);
  }; 

  const handleRemoveTier = (index: number) => {
    const rowToRemove = rows[index];
  
    let remainingRows = rows.filter((_, i) => i !== index);
  
    if (remainingRows.length > 0) {
      remainingRows[0] = {
        ...remainingRows[0],
        exitTierPositionPercent: remainingRows[0].exitTierPositionPercent + rowToRemove.exitTierPositionPercent,
      };
    } else {
      remainingRows = [{ ...defaultInitialRow }];
    }
  
    setRows(remainingRows);
    handleExitTiersChange(remainingRows);
  };
  
  

  const handleNumberChange = (index: number, field: keyof ExitTier, value: string) => {
    if (field === 'exitTierPositionPercent') {
      const numValue = parseFloat(value);
  
      if (isNaN(numValue) || numValue < 0) {
        return; 
      }
  
      const otherRowsSum = rows.reduce((sum, row, i) => 
        i !== index ? sum + row.exitTierPositionPercent : sum, 0);
  
      const maxAllowed = 100 - otherRowsSum;
  
      const validValue = Math.min(numValue, maxAllowed);
  
      const updatedRows = rows.map((row, i) => {
        if (i === index) {
          return { ...row, [field]: validValue };
        }
        return row;
      });
  
      setRows(updatedRows);
  
      handleExitTiersChange(updatedRows);
    } else {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return;
      }
      
      if (!isSendTriggerChecked) {
        const validValue = Math.max(0, Math.min(100, numValue));
        const updatedRows = rows.map((row, i) => {
          if (i === index) {
            return { ...row, [field]: validValue };
          }
          return row;
        });
    
        setRows(updatedRows);
        handleExitTiersChange(updatedRows);
        return;
      }
      
      if (numValue < 0 || numValue > 100) {
        return; 
      }
      
      const updatedRows = rows.map((row, i) => {
        if (i === index) {
          return { ...row, [field]: numValue };
        }
        return row;
      });
  
      setRows(updatedRows);
      handleExitTiersChange(updatedRows); 
    }
  };

  
  const shouldShowAddTierButton = () => {
    const totalAllocated = rows.reduce((sum, row) => {
      return sum + row.exitTierPositionPercent;
    }, 0);
  
    return Math.round(totalAllocated) < 100;
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
              <TableRow hover tabIndex={-1} key={index}> 
                
                <TableCell sx={styles.tableCell} align="center"></TableCell>

                <TableCell sx={styles.tableCell} align="center">
                  <span style={styles.staticText}>{index + 1}</span> 
                </TableCell>

                <TableCell sx={styles.tableCell} align="center">
                  <TextField
                    value={row.exitTierPositionPercent}
                    onChange={(e) => handleNumberChange(index, 'exitTierPositionPercent', e.target.value)}
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 100, step: 1 } }}
                    variant="outlined"
                    size="small"
                    sx={styles.numberInput}
                  />
                </TableCell>

                <TableCell sx={styles.tableCell} align="center">
                  <FormControl size="small" fullWidth>
                    <Select
                      value={row.exitType}
                      onChange={(e) => handleExitTypeChange(index, e)}
                      sx={styles.selectInput}
                    >
                      <MenuItem value="Limit">{t("Limit")}</MenuItem>
                      <MenuItem value="OCO">{t("OCO")}</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>

                <TableCell sx={styles.tableCell} align="center">
                  <TextField
                    value={row.optionTargetOffsetPercent}
                    onChange={(e) => handleNumberChange(index, 'optionTargetOffsetPercent', e.target.value)}
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                    variant="outlined"
                    size="small"
                    sx={styles.numberInput}
                  />
                </TableCell>

                <TableCell sx={styles.tableCell} align="center">
                  {row.exitType.toLowerCase() === 'limit' ? (
                    <span style={styles.staticText}>--</span>
                  ) : (
                    <TextField
                      value={row.optionStopOffsetPercent}
                      onChange={(e) => handleNumberChange(index, 'optionStopOffsetPercent', e.target.value)}
                      type="number"
                      InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                      variant="outlined"
                      size="small"
                      sx={styles.numberInput}
                    />
                  )}
                </TableCell>

                <TableCell sx={styles.tableCell} align="center">
                  <TextField
                    value={row.stockTargetOffsetPercent}
                    onChange={(e) => handleNumberChange(index, 'stockTargetOffsetPercent', e.target.value)}
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                    variant="outlined"
                    size="small"
                    sx={styles.numberInput}
                  />
                </TableCell>

                <TableCell sx={styles.tableCell} align="center">
                  {row.exitType.toLowerCase() === 'limit' ? (
                    <span style={styles.staticText}>--</span>
                  ) : (
                    <TextField
                      value={row.stockStopOffsetPercent}
                      onChange={(e) => handleNumberChange(index, 'stockStopOffsetPercent', e.target.value)}
                      type="number"
                      InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
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
                      onClick={() => handleRemoveTier(index)}
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