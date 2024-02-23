import { AppContainer } from '@/components/common/Containers/AppContainer'
import { Box, BoxProps, Typography } from '@mui/material'
import { TopBordered } from './TopBordered'

export interface Props extends BoxProps {
  title: string
}

export const ProfileContainer = ({ title, children, ...props }: Props) => {
  return (
    <Box {...props}>
      <AppContainer
        sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
      >
        <Box>
          <Typography sx={{ textAlign: 'left', p: 2 }} variant="h5">
            {title}
          </Typography>
        </Box>
        <TopBordered
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 2 }}
        >
          {children}
        </TopBordered>
      </AppContainer>
    </Box>
  )
}
