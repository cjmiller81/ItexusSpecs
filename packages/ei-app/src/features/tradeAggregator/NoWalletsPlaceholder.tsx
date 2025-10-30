import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export const NoWalletsPlaceholder: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: 4,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <AccountBalanceWalletIcon 
          sx={{ 
            fontSize: 48, 
            color: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.5)' 
              : 'rgba(0, 0, 0, 0.4)' 
          }} 
        />
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.9)' 
            : 'rgba(0, 0, 0, 0.9)',
          mb: 2,
        }}
      >
        No Wallets Added Yet
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.7)' 
            : 'rgba(0, 0, 0, 0.7)',
          maxWidth: '400px',
          lineHeight: 1.6,
        }}
      >
        To start trading, you need to add a wallet first. Click the "+ADD YOUR FIRST WALLET" button above to get started.
      </Typography>
    </Box>
  );
};

