import Modal, { ModalProps } from '@mui/material/Modal'
import { AppModalBody } from './AppModalBody'
import { TypographyProps } from '@mui/material'

export type AppModalProps = ModalProps & {
  bodyProps?: TypographyProps
}

export const AppModal = ({ children, bodyProps, ...props }: AppModalProps) => {
  return (
    <Modal {...props}>
      <AppModalBody {...bodyProps}>{children}</AppModalBody>
    </Modal>
  )
}
