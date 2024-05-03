import { HelpOutline } from "@mui/icons-material"
import { Fade, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { ReactNode } from "react"
import { AppToolTip } from "../AppTooltip"

export interface Props {
  required?: boolean
  fieldLabel?: ReactNode
  alignLabel?: "center" | "left"
  tooltip?: string
}

export function AppInputLabel({ required, tooltip, fieldLabel }: Props) {
  return (
    <AppInputLabelText>
      {fieldLabel}
      {required && <span style={{ paddingLeft: "2px", fontSize: "13px" }}>*</span>}
      {tooltip && (
        <AppToolTip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 200 }}
          title={tooltip}
          placement="top">
          <TooltipIcon
            sx={{
              stroke: themes => themes.palette.text.secondary,
              strokeWidth: 0,
            }}
          />
        </AppToolTip>
      )}
    </AppInputLabelText>
  )
}

const AppInputLabelText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  paddingBottom: 4,
  textWrap: "nowrap",
  display: "flex",
  alignItems: "center",
}))

const TooltipIcon = styled(HelpOutline)(({ theme }) => ({
  width: theme.spacing(2),
  height: theme.spacing(2),
  marginLeft: theme.spacing(0.5),
}))
