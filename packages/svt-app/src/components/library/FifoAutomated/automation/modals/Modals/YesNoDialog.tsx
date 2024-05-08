import { Typography } from "@mui/material"
import Button from "@mui/material/Button"
import Dialog, { DialogProps } from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"

interface CustomDialogProps {
  title: string
  content: string
  agreeButtonText?: string
  disagreeButtonText?: string
  open?: boolean
  onAgree: () => void
  onClose: () => void
}
export default function YesNoDialog({
  title,
  open,
  onAgree,
  onClose,
  content,
  agreeButtonText,
  disagreeButtonText,
  ...props
}: DialogProps & CustomDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      {...props}>
      <Typography
        padding={3}
        variant="h6">
        {title}
      </Typography>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}>
          {disagreeButtonText || "No"}
        </Button>
        <Button
          variant="contained"
          onClick={onAgree}
          autoFocus>
          {agreeButtonText || "Yes"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
