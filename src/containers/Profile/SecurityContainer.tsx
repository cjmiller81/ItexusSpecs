import AppTextField from '@/components/common/inputs/AppTextField'
import {
  getIncorectPassword,
  getMandatoryField,
  getPasswordDoNotMatch,
} from '@/constants/Errormessages'
import { Box, BoxProps, Button, CSSObject } from '@mui/material'
import { useFormik } from 'formik'
import { InferType, object, string, ref } from 'yup'
import { ProfileContainer } from './ProfileContainer'

const rowStyle: CSSObject = {
  display: 'flex',
  gap: 2,
}

const NewPasswordModelSchema = object({
  newPassword: string()
    .required(getMandatoryField())
    .min(1, getMandatoryField())
    .min(6, getIncorectPassword()),
  newPasswordConfirm: string()
    .required(getMandatoryField())
    .min(1, getMandatoryField())
    .min(6, getIncorectPassword())
    .oneOf([ref('newPassword')], getPasswordDoNotMatch()),
  currentPassword: string()
    .required(getMandatoryField())
    .min(1, getMandatoryField())
    .min(6, getIncorectPassword()),
})

type NewPasswordModel = InferType<typeof NewPasswordModelSchema>

export const SecurityContainer = ({ ...props }: BoxProps) => {
  const handleOnSubmit = async (data: NewPasswordModel) => {
    console.log(data)
  }

  const formik = useFormik<NewPasswordModel>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    validationSchema: NewPasswordModelSchema,
    onSubmit: handleOnSubmit,
  })

  return (
    <Box {...props}>
      <ProfileContainer
        title="Change Password"
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <AppTextField
            name="currentPassword"
            required
            label="Current password"
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            error={
              formik.submitCount > 0 && Boolean(formik.errors.currentPassword)
            }
            fieldError={formik.submitCount > 0 && formik.errors.currentPassword}
            helperText={formik.submitCount > 0 && formik.errors.currentPassword}
          />
          <Box sx={rowStyle}>
            <AppTextField
              name="newPassword"
              required
              label="New password"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              error={
                formik.submitCount > 0 && Boolean(formik.errors.newPassword)
              }
              fieldError={formik.submitCount > 0 && formik.errors.newPassword}
              helperText={formik.submitCount > 0 && formik.errors.newPassword}
            />
            <AppTextField
              name="newPasswordConfirm"
              required
              label="Re-enter password"
              value={formik.values.newPasswordConfirm}
              onChange={formik.handleChange}
              error={
                formik.submitCount > 0 &&
                Boolean(formik.errors.newPasswordConfirm)
              }
              fieldError={
                formik.submitCount > 0 && formik.errors.newPasswordConfirm
              }
              helperText={
                formik.submitCount > 0 && formik.errors.newPasswordConfirm
              }
            />
          </Box>

          <Button
            onClick={formik.submitForm}
            sx={{ alignSelf: 'start', width: '20%', minWidth: '170px', mt: 2 }}
            variant={'contained'}
          >
            Change Password
          </Button>
        </Box>
      </ProfileContainer>
    </Box>
  )
}
