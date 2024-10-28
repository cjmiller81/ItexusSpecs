import React from "react";
import { AccordionProps, AccordionSummary, Box, Button, styled, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AppAccordionSection } from "components";
import { useTranslation } from "react-i18next";

interface Props extends Omit<AccordionProps, "children"> {
  title: string;
}

const IndexResultsSection = ({ title, ...props }: Props) => {
  return (
    <AppAccordionSection
      persistKey="IndexResultsSection"
      defaultExpanded={false}
      title={title}
      {...props}>
      <Box sx={{ padding: 2 }}>
        <Typography>{}</Typography>
      </Box>
    </AppAccordionSection>
  );
};

export default IndexResultsSection;

const StyledAccordionSummary = styled(AccordionSummary)(() => ({
  transition: "none",
}));
