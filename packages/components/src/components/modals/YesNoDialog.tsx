import Button from "@mui/material/Button"
import Dialog, { DialogProps } from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { useTranslation } from "react-i18next"

interface CustomDialogProps {
  title: string
  content: string
  agreeButtonText?: string
  disagreeButtonText?: string
  open?: boolean
  onAgree: () => void
  onClose: () => void
}
export function YesNoDialog({
  title,
  open,
  onAgree,
  onClose,
  content,
  agreeButtonText,
  disagreeButtonText,
  ...props
}: DialogProps & CustomDialogProps) {
  const { t } = useTranslation("YesNoDialog")
  return (
    <Dialog
      open={open}
      onClose={onClose}
      {...props}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}>
          {disagreeButtonText || t("No", { ns: "Common" })}
        </Button>
        <Button
          variant="contained"
          onClick={onAgree}
          autoFocus>
          {agreeButtonText || t("Yes", { ns: "Common" })}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
