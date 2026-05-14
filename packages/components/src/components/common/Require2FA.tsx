"use client";

import React, { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import { use2FAVerification } from '../../hooks/use2FA'

interface Require2FAProps {
  children: ReactNode
  message?: string
}

export const Require2FA = ({ children, message }: Require2FAProps) => {
  const theme = useTheme()
  const { is2FAVerified, goTo2FA } = use2FAVerification()

  if (is2FAVerified()) return <>{children}</>

  const defaultMessage = "Elan Insights requires adding an Authenticator App when any wallet or exchange connections are saved"
  const buttonText = "Add Authenticator App"
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: { xs: '50vh', md: '60vh' },
        p: 2,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          maxWidth: 560,
          width: '100%',
          borderRadius: 2,
          boxShadow: theme.shadows[4],
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: 'center' }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            {message || defaultMessage}
          </Typography>

          <Button variant="contained" color="primary" fullWidth onClick={goTo2FA}>
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Require2FA