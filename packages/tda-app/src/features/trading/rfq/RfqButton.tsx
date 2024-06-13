import { LoadingButton, LoadingButtonProps } from "@mui/lab"
import { FC } from "react"

export type RfqStage = "cancelable" | "requiring" | "requote" | "inProgress"
type RfqButtonProps = {
  onInitiateRFQ: () => void
  stage: RfqStage
  onCancel: () => void
  onRequote: () => void
}

export const RfqButton: FC<Omit<RfqButtonProps, "children"> & LoadingButtonProps> = ({
  onInitiateRFQ,
  onCancel,
  onRequote,
  stage,
  sx,
  ...props
}) => {
  const onHandleClick = () => {
    switch (stage) {
      case "cancelable":
        onCancel()
        break
      case "requiring":
        onInitiateRFQ()
        break
      case "requote":
        onRequote()
        break
      default:
        throw "Invalid stage value"
    }
  }
  return (
    <LoadingButton
      {...props}
      onClick={onHandleClick}
      variant="contained"
      sx={{
        height: theme => theme.spacing(5),
        width: "10rem",
        textTransform: "capitalize",
        lineHeight: 1.4,
        ...sx
      }}>
      {stage === "requiring" && "Initiate RFQ"}
      {stage === "cancelable" && "Cancel RFQ"}
      {stage === "requote" && "Requote"}
    </LoadingButton>
  )
}
