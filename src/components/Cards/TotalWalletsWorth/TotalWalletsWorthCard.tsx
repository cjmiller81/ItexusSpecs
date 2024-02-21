import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Box, BoxProps, Typography } from '@mui/material'

export interface Props extends BoxProps {
  totalWorth: number
  growPercentage: number
}

export const TotalWalletsWorthCard = ({
  totalWorth,
  growPercentage,
  ...props
}: Props) => {
  const growMain = growPercentage >= 0 ? 'success.main' : 'error.main'
  const growLight = growPercentage >= 0 ? 'success.light' : 'error.light'
  return (
    <Box
      {...props}
      sx={{
        display: 'flex',
        gap: 2,
        boxShadow: 5,
        padding: 2,
        width: 'fit-content',
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          padding: 1,
          backgroundColor: 'success.light',
          position: 'relative',
          borderRadius: '50%',
        }}
      >
        <TrendingUpIcon
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'success.main',
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle1">Total Wallet Worth</Typography>
        <Typography
          sx={{ fontWeight: 'bold' }}
          variant="subtitle1"
        >{`$${totalWorth}`}</Typography>
      </Box>

      <Box>
        <Box
          sx={{
            backgroundColor: growLight,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            padding: 0.7,
          }}
        >
          {growPercentage >= 0 ? (
            <ArrowDropUpIcon sx={{ color: growMain }} />
          ) : (
            <ArrowDropDownIcon sx={{ color: growMain }} />
          )}
          <Typography
            variant="body2"
            sx={{ backgroundColor: growLight, color: growMain }}
          >{`${growPercentage}%`}</Typography>
        </Box>
      </Box>
    </Box>
  )
}
