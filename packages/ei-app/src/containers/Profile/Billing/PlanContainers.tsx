import { Box, Button, Typography, styled } from "@mui/material"

interface PlanContainerProps {
  title: string
  subtitle: string
  buttonTitle: string
}

export function PlatinumPlanPlanContainer({ title, subtitle, buttonTitle, ...props }: PlanContainerProps) {
  return (
    <PlanStyledContainer
      sx={{ borderColor: "warning.light" }}
      {...props}>
      <PlanContentContainer>
        <Typography
          component="p"
          variant="h6">
          {title}
        </Typography>
        <Typography
          color="text.disabled"
          variant="subtitle2">
          {subtitle}
        </Typography>
        <Button
          sx={{ mt: 2 }}
          size="small"
          variant="contained">
          {buttonTitle}
        </Button>
      </PlanContentContainer>
    </PlanStyledContainer>
  )
}

export function BillingPlanContainer({ title, subtitle, buttonTitle, ...props }: PlanContainerProps) {
  return (
    <PlanStyledContainer
      sx={{ borderColor: "success.main" }}
      {...props}>
      <PlanContentContainer>
        <Typography
          component="p"
          variant="h6">
          {title}
        </Typography>
        <Typography
          color="text.disabled"
          variant="subtitle2">
          {subtitle}
        </Typography>
        <Button
          sx={{ mt: 2 }}
          size="small"
          variant="outlined">
          {buttonTitle}
        </Button>
      </PlanContentContainer>
    </PlanStyledContainer>
  )
}

const PlanStyledContainer = styled(Box)(({ theme }) => ({
  borderColor: theme.palette.success.main,
  padding: theme.spacing(1.5),
  paddingLeft: theme.spacing(2),
  flexDirection: "column",
  borderLeftWidth: theme.spacing(5),
  borderLeft: "solid",
  borderRadius: theme.spacing(1),
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "flex-start",
}))

const PlanContentContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  flexDirection: "column",
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "flex-start",
}))
