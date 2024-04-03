import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import { Fade, Tooltip, TooltipProps, Typography, tooltipClasses } from "@mui/material"
import { styled } from "@mui/material/styles"
import { ReactNode } from "react"

export interface Props {
  required?: boolean
  fieldLabel?: ReactNode
  tooltip?: string
}

export default function AppInputLabel({ required, tooltip, fieldLabel }: Props) {
  return (
    <AppInputLabelText>
      {fieldLabel}
      {required && <span style={{ paddingLeft: "2px", fontSize: "13px" }}>*</span>}
      {tooltip && (
        <StyledToolTip
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
        </StyledToolTip>
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

const TooltipIcon = styled(HelpOutlineIcon)(({ theme }) => ({
  width: theme.spacing(2),
  height: theme.spacing(2),
  marginLeft: theme.spacing(0.5),
}))

const StyledToolTip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: "11px",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    boxShadow: theme.shadows[4],
    borderRadius: "4px",
    marginBottom: -20,
    border: "solid",
    borderColor: theme.palette.divider,
    borderWidth: 1,
  },
}))
