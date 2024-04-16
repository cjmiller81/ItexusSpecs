import PageTitle from "@/components/TextDisplay/PageTitle"
import StatePersistedAccordion, { StatePersistedAccordionProps } from "@/components/common/StatePersistedAccordion"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { AccordionDetails, AccordionSummary, Box, styled } from "@mui/material"
import * as React from "react"

interface Props extends StatePersistedAccordionProps {
  headerChildren?: React.ReactNode
  title?: string
}

export const AppAccordionSection = ({ children, headerChildren, title, ...props }: Props) => {
  return (
    <StatePersistedAccordion defaultExpanded {...props}>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
          <PageTitle sx={{ width: "100%" }}>{title}</PageTitle>
          {headerChildren}
        </Box>
      </StyledAccordionSummary>
      <AccordionDetails sx={{ bgcolor: "background.paper" }}>{children}</AccordionDetails>
    </StatePersistedAccordion>
  )
}

export const StyledAccordionSummary = styled(AccordionSummary)(() => ({
  transition: "none",
}))
