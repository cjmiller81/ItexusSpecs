import AppTextField from '@/components/common/inputs/AppTextField'
import { CSSObject } from '@emotion/react'
import { Box, BoxProps, Button } from '@mui/material'
import { ProfileContainer } from './ProfileContainer'

const rowStyle: CSSObject = {
  display: 'flex',
  gap: 2,
}

export const ProfileDetails = ({ ...props }: BoxProps) => {
  return (
    <ProfileContainer title="Profile Details" {...props}>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, pl: 2, pr: 2 }}
      >
        <AppTextField required label={'Name'} />
        <AppTextField required label={'Email'} />
        <Box sx={rowStyle}>
          <AppTextField required label={'Company'} />
          <AppTextField required label={'Country'} />
        </Box>
        <AppTextField required label={'Phone number'} />
        <Button
          sx={{ alignSelf: 'start', width: '30%', minWidth: '150px', mt: 2 }}
          variant={'contained'}
        >
          Change details
        </Button>
      </Box>
    </ProfileContainer>
  )
}
