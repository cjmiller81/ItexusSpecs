import Modal, { ModalProps } from '@mui/material/Modal'
import { AppModalBody } from './AppModalBody'

export const AppModal = ({ children, ...props }: ModalProps) => {
  return (
    <Modal {...props}>
      <AppModalBody>{children}</AppModalBody>
    </Modal>
  )
}
