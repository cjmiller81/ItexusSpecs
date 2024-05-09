import { Tooltip, TooltipProps, tooltipClasses } from "@mui/material"
import { styled } from "@mui/material/styles"

export const AppToolTip:any = styled(({ className, ...props }: TooltipProps) => (
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
