import React from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import { Lock, ArrowBack } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSubscription } from 'components';

interface PageAccessGuardProps {
  children: React.ReactNode;
  requiredPage: string;
  fallbackComponent?: React.ReactNode;
}

export function PageAccessGuard({ 
  children, 
  requiredPage, 
  fallbackComponent 
}: PageAccessGuardProps) {
  const { hasPageAccess, subscription, isLoading } = useSubscription();
  const router = useRouter();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress 
          size={60} 
          sx={{ color: '#219a83' }}
        />
      </Box>
    );
  }

  if (!hasPageAccess(requiredPage)) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          p: 3
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            maxWidth: 500,
            borderRadius: 2
          }}
        >
          <Lock 
            sx={{ 
              fontSize: 64, 
              color: 'primary.main', 
              mb: 2 
            }} 
          />
          
          <Typography variant="h5" gutterBottom>
            {t('Access Restricted')}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t('This page is not available in your current subscription plan.')}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('Current Plan')}: <strong>{subscription.plan.name}</strong>
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => router.back()}
            >
              {t('Go Back')}
            </Button>
            
            <Button
              variant="contained"
              onClick={() => router.push('/profile/billing')}
            >
              {t('Upgrade Plan')}
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return <>{children}</>;
}

// HOC for easier page-level protection
export function withPageAccess<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  requiredPage: string,
  fallbackComponent?: React.ReactNode
) {
  const ComponentWithAccess = (props: T) => (
    <PageAccessGuard 
      requiredPage={requiredPage} 
      fallbackComponent={fallbackComponent}
    >
      <WrappedComponent {...props} />
    </PageAccessGuard>
  );

  ComponentWithAccess.displayName = `withPageAccess(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return ComponentWithAccess;
}
