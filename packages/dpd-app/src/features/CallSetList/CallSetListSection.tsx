import React, { useEffect, useMemo } from 'react';
import { Box, darken, lighten, styled, Typography, useTheme } from '@mui/material';
import { DataGrid, GridRow } from '@mui/x-data-grid';
import { getCallSetListTableColumns, getPositionOrdersTableColumns } from './CallSetListTable';
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { fetchStrategies, toggleRowExpansion } from './CallSetListSlice';
import { StrategyTableRow, PositionOrderRow } from '@/models/StrategyTableRow';
import { Strategy, Position } from '@/models/Strategy';
import { useTranslation } from 'react-i18next';

const CallSetListSection = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { t } = useTranslation();
  const { strategies, expandedRows } = useAppSelector(state => state.callSetList);

  useEffect(() => {
    dispatch(fetchStrategies({}));
  }, [dispatch]);

  const handleToggleExpansion = (strategyId: string) => {
    dispatch(toggleRowExpansion(strategyId));
  };

  const handleCancelOrder = (orderId: string) => {
    console.log('Cancel order:', orderId);
  };

  const nanoToPrice = (nanos: number): number => {
    return nanos / 1000000000;
  };

  const processPositionOrders = (position: Position | null, positionType: string, originalQty: number): PositionOrderRow[] => {
    if (!position) return [];
    
    const orders: PositionOrderRow[] = [];
    let orderIdCounter = 1;

    Object.entries(position.filledEntryOrders || {}).forEach(([orderId, orderValue]) => {
      orders.push({
        id: `${positionType}_filled_entry_${orderIdCounter++}`,
        type: positionType,
        ticker: position.symbol || "",
        originalQty: originalQty || 0,
        orderType: "Filled Entry",
        orderId: orderId,
        orderQty: orderValue?.units || 0,
        avgFillPrice: nanoToPrice(orderValue?.nanos || 0),
        errorMsg: ""
      });
    });

    Object.entries(position.filledExitOrders || {}).forEach(([orderId, orderValue]) => {
      orders.push({
        id: `${positionType}_filled_exit_${orderIdCounter++}`,
        type: positionType,
        ticker: position.symbol || "",
        originalQty: originalQty || 0,
        orderType: "Filled Exit",
        orderId: orderId,
        orderQty: orderValue?.units || 0,
        avgFillPrice: nanoToPrice(orderValue?.nanos || 0),
        errorMsg: ""
      });
    });

    Object.entries(position.filledLongOrders || {}).forEach(([orderId, orderValue]) => {
      if ('item1' in orderValue && 'item2' in orderValue) {
        orders.push({
          id: `${positionType}_filled_long_${orderIdCounter++}`,
          type: positionType,
          ticker: position.symbol || "",
          originalQty: originalQty || 0,
          orderType: "Filled Long",
          orderId: `${orderId}_item1`,
          orderQty: orderValue.item1?.units || 0,
          avgFillPrice: nanoToPrice(orderValue.item1?.nanos || 0),
          errorMsg: ""
        });
        orders.push({
          id: `${positionType}_filled_long_${orderIdCounter++}`,
          type: positionType,
          ticker: position.symbol || "",
          originalQty: originalQty || 0,
          orderType: "Filled Long",
          orderId: `${orderId}_item2`,
          orderQty: orderValue.item2?.units || 0,
          avgFillPrice: nanoToPrice(orderValue.item2?.nanos || 0),
          errorMsg: ""
        });
      } else {
        orders.push({
          id: `${positionType}_filled_long_${orderIdCounter++}`,
          type: positionType,
          ticker: position.symbol || "",
          originalQty: originalQty || 0,
          orderType: "Filled Long",
          orderId: orderId,
          orderQty: 0,
          avgFillPrice: 0,
          errorMsg: ""
        });
      }
    });

    Object.entries(position.filledShortOrders || {}).forEach(([orderId, orderValue]) => {
      orders.push({
        id: `${positionType}_filled_short_${orderIdCounter++}`,
        type: positionType,
        ticker: position.symbol || "",
        originalQty: originalQty || 0,
        orderType: "Filled Short",
        orderId: orderId,
        orderQty: orderValue?.units || 0,
        avgFillPrice: nanoToPrice(orderValue?.nanos || 0),
        errorMsg: ""
      });
    });

    Object.entries(position.workingEntryOrders || {}).forEach(([orderId, orderValue]) => {
      orders.push({
        id: `${positionType}_working_entry_${orderIdCounter++}`,
        type: positionType,
        ticker: position.symbol || "",
        originalQty: originalQty || 0,
        orderType: "Working Entry",
        orderId: orderId,
        orderQty: orderValue?.units || 0,
        avgFillPrice: 0,
        errorMsg: ""
      });
    });

    Object.entries(position.workingTargetOrders || {}).forEach(([orderId, orderValue]) => {
      orders.push({
        id: `${positionType}_working_target_${orderIdCounter++}`,
        type: positionType,
        ticker: position.symbol || "",
        originalQty: originalQty || 0,
        orderType: "Working Target",
        orderId: orderId,
        orderQty: orderValue?.units || 0,
        avgFillPrice: 0,
        errorMsg: ""
      });
    });

    Object.entries(position.workingStopOrders || {}).forEach(([orderId, orderValue]) => {
      orders.push({
        id: `${positionType}_working_stop_${orderIdCounter++}`,
        type: positionType,
        ticker: position.symbol || "",
        originalQty: originalQty || 0,
        orderType: "Working Stop",
        orderId: orderId,
        orderQty: orderValue?.units || 0,
        avgFillPrice: 0,
        errorMsg: ""
      });
    });

    Object.entries(position.errorOrders || {}).forEach(([orderId, errorMsg]) => {
      orders.push({
        id: `${positionType}_error_${orderIdCounter++}`,
        type: positionType,
        ticker: position.symbol || "",
        originalQty: originalQty || 0,
        orderType: "Error",
        orderId: orderId,
        orderQty: 0,
        avgFillPrice: 0,
        errorMsg: errorMsg || ""
      });
    });

    return orders;
  };

  const sumFilledUnits = (orders: Record<string, { units: number, nanos: number }>) =>
    Object.values(orders).reduce((sum, order) => sum + (order.units || 0), 0);
  
  const sumWorkingUnits = (orders: Record<string, { units: number, nanos: number }>) => 
    Object.values(orders).reduce((sum, units) => sum + (units.units || 0), 0);

  const strategiesData = useMemo(() => {
    const strategiesList = strategies;
    
    return strategiesList.map((strategy: any) => {
      const { strategyId, accountNumber, strategySettings, errorMsg } = strategy;

      let type = "Underlying";
      if (strategySettings && !strategySettings.onlyTradeUnderlying) {
        if (strategySettings.optionType === "CALL") {
          type = "Call";
        } else if (strategySettings.optionType === "PUT") {
          type = "Put";
        } else if (strategySettings.optionType === "STRANGLE") {
          type = "Strangle";
        }
      }

      let entryType = "Use Ask";
      if (strategySettings) {
        switch (strategySettings.entryType) {
          case "entryBuyBid":
            entryType = "Use Bid";
            break;
          case "entryBuyMid":
            entryType = "Use Mid";
            break;
          default:
            entryType = "Use Ask";
        }
      }

      return {
        id: strategyId,
        accountNumber: accountNumber || "",
        ticker: strategySettings?.instrument?.symbol || "",
        type: type,
        dteRange: `${strategySettings?.dteMin || 0}-${strategySettings?.dteMax || 0}`,
        entryOffsetPercent: strategySettings?.entryOffsetPercent || 0,
        entryType: entryType,
        amount: strategySettings?.totalDollarAmount || 0,
        errorMsg: errorMsg || "",
        isExpanded: expandedRows.includes(strategyId)
      } as StrategyTableRow & { isExpanded: boolean };
    });
  }, [expandedRows, strategies]);

  const positionOrdersData = useMemo(() => {
    const strategiesList = strategies;
    const orders: Record<string, PositionOrderRow[]> = {};

    strategiesList.forEach((strategy: any) => {
      const strategyId = strategy.strategyId;
      const allOrders: PositionOrderRow[] = [];
      
      if (strategy.underlyingPosition) {
        allOrders.push(...processPositionOrders(strategy.underlyingPosition, "Underlying", strategy.underlyingOriginalQty));
      }
      if (strategy.callLegPosition) {
        allOrders.push(...processPositionOrders(strategy.callLegPosition, "Call", strategy.callLegOriginalQty));
      }
      if (strategy.callNextLegPosition) {
        allOrders.push(...processPositionOrders(strategy.callNextLegPosition, "Call Next", strategy.callNextLegOriginalQty));
      }
      if (strategy.putLegPosition) {
        allOrders.push(...processPositionOrders(strategy.putLegPosition, "Put", strategy.putLegOriginalQty));
      }
      if (strategy.putNextLegPosition) {
        allOrders.push(...processPositionOrders(strategy.putNextLegPosition, "Put Next", strategy.putNextLegOriginalQty));
      }

      orders[strategyId] = allOrders;
    });

    return orders;
  }, [strategies]);

  const CallListTable = styled(DataGrid)(({ theme }) => ({
    borderRadius: "8px",
    width: "100%",
    mt: 2,
    display: "grid",
    "& .MuiDataGrid-virtualScroller": {
      overflowY: "auto !important",
    },
    "& .MuiDataGrid-main": {
      height: "auto",
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
      backgroundColor: theme.palette.mode === "dark" ? "#353F4B" : "#FFFFFF",
      borderBottom: "1px solid",
      borderBottomColor: theme.palette.divider,
    },
    "& .MuiDataGrid-cell": {
      backgroundColor: theme.palette.mode === "dark" ? "#111827" : "#FFFFFF",
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

  const PositionOrdersTable = styled(DataGrid)(({ theme }) => ({
    borderRadius: "8px",
    width: "100% !important",
    maxWidth: "100% !important",
    minWidth: "100% !important",
    "& .MuiDataGrid-virtualScroller": {
      overflowY: "auto !important",
      overflowX: "hidden !important",
    },
    "& .MuiDataGrid-main": {
      height: "auto",
      width: "100% !important",
      maxWidth: "100% !important",
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: theme.palette.mode === "dark" ? "#353F4B" : "#F3F4F6",
      fontWeight: 600,
      fontSize: "14px",
      borderBottom: "1px solid",
      borderBottomColor: theme.palette.divider,
      width: "100% !important",
    },
    "& .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeaderTitle": {
      textTransform: "uppercase",
    },
    "& .MuiDataGrid-row": {
      backgroundColor: theme.palette.mode === "dark" ? "#111827" : "#FFFFFF",
      borderBottom: "1px solid",
      borderBottomColor: theme.palette.divider,
      width: "100% !important",
    },
    "& .MuiDataGrid-cell": {
      backgroundColor: theme.palette.mode === "dark" ? "#111827" : "#FFFFFF",
    },
    "& .MuiDataGrid-root": {
      border: "none",
      width: "100% !important",
      maxWidth: "100% !important",
    },
    "& .MuiDataGrid-virtualScrollerContent": {
      width: "100% !important",
      maxWidth: "100% !important",
    },
    "& .MuiDataGrid-virtualScrollerRenderZone": {
      width: "100% !important",
      maxWidth: "100% !important",
    },
  }));

  const CustomRow = (props: { row: StrategyTableRow }) => {
    const strategy = strategiesData.find(s => s.id === props.row.id);
    const orders = positionOrdersData[props.row.id] || [];
    
    return (
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <GridRow {...props} />
        {strategy?.isExpanded && orders.length > 0 && (
          <Box sx={{ 
            p: 2, 
            backgroundColor: theme.palette.mode === "dark" ? "#1f2937" : "#f9fafb",
            borderTop: "1px solid",
            borderTopColor: theme.palette.divider,
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
            boxSizing: "border-box"
          }}>
            <Box sx={{ 
              width: "100%", 
              maxWidth: "100%", 
              overflow: "hidden",
              boxSizing: "border-box",
              paddingLeft: "5px",
              paddingRight: "5px"
            }}>
              <PositionOrdersTable
                rows={orders}
                columns={getPositionOrdersTableColumns(theme, t, handleCancelOrder)}
                hideFooter
                disableColumnMenu
                disableRowSelectionOnClick
                autoHeight
                getRowId={(row) => row.id}
                sx={{
                  width: "calc(100% - 10px) !important",
                  minWidth: "calc(100% - 10px) !important",
                  maxWidth: "calc(100% - 10px) !important",
                  overflow: "hidden !important",
                  boxSizing: "border-box !important"
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%', height: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Set List
      </Typography>

      <Box
        sx={{
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
          height: expandedRows.length > 0 ? 'calc(100vh - 120px)' : 'auto',
        }}
      >
        <CallListTable
          sx={{
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
            height: expandedRows.length > 0 ? '100%' : 'auto',
          }}
          hideFooter
          rowSelection={false}
          getRowId={(row) => row.id}
          columns={getCallSetListTableColumns(theme, handleToggleExpansion, t)}
          rows={strategiesData}
          slots={{ row: CustomRow }}
          autoHeight={expandedRows.length === 0}
        />
      </Box>
    </Box>
  );
}

export default CallSetListSection;
