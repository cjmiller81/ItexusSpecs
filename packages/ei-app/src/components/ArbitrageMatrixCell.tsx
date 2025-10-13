import React from 'react';
import { Box, Typography } from '@mui/material';
import { calculateArbitrage, getColorForPercentage, formatPriceDiff } from '../utils/arbitrageCalculations';
import { ArbitrageMatrixPrice } from '@/features/tradeAggregator/TradeTableApi';

interface ArbitrageMatrixCellProps {
  buyExchangeId: string;
  sellExchangeId: string;
  arbitragePrices: ArbitrageMatrixPrice[];
  isDiagonal?: boolean;
}

export const ArbitrageMatrixCell: React.FC<ArbitrageMatrixCellProps> = ({
  buyExchangeId,
  sellExchangeId,
  arbitragePrices,
  isDiagonal = false
}) => {
  if (isDiagonal) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60px',
          width: '100%',
          backgroundColor: 'transparent'
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            fontWeight: 'bold'
          }}
        >
          -
        </Typography>
      </Box>
    );
  }

  const arbitrageResult = calculateArbitrage(buyExchangeId, sellExchangeId, arbitragePrices);
  
  const colors = getColorForPercentage(arbitrageResult.percentage);
  
  const priceDiffFormatted = formatPriceDiff(arbitrageResult.priceDiff, arbitrageResult.isProfit);

  return (
    <Box
      sx={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        padding: '8px',
        borderRadius: '4px',
        height: '60px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: `0 2px 8px ${colors.border}40`
        }
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 'bold',
          fontSize: '12px',
          lineHeight: 1.2,
          marginBottom: '2px'
        }}
      >
        {priceDiffFormatted}
      </Typography>
      
      <Typography
        variant="caption"
        sx={{
          fontSize: '10px',
          opacity: 0.9,
          lineHeight: 1
        }}
      >
        {arbitrageResult.percentage}
      </Typography>
    </Box>
  );
};
