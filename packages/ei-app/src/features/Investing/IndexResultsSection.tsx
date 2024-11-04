import React from "react";
import { AccordionProps, AccordionSummary, Box, Button, styled, Typography, Card, CardContent } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AppAccordionSection } from "components";
import { useTranslation } from "react-i18next";

interface Props extends Omit<AccordionProps, "children"> {
  title: string;
}

const LeftContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
  justifyContent: "flex-start",
  width: "30%",
  borderRadius: "10px",
  gap: theme.spacing(4),
  [theme.breakpoints.between("xs", "sm")]: {
    width: "100%",
  },
}));

const MainContainer = styled(Box)(({ theme }) => ({
  gap: theme.spacing(2),
  display: "flex",
  width: "100%",
  [theme.breakpoints.between("xs", "sm")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}));
const MiddleContainer = styled(Box)(({ theme }) => ({
  width: "20%",
  boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
  borderRadius: "10px",
}));

const RightContainer = styled(Box)(({ theme }) => ({
  width: "42%",
  boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
  borderRadius: "10px",
}));

const IndexResultsSection = ({ title, ...props }: Props) => {
  return (
    <AppAccordionSection
      persistKey="IndexResultsSection"
      defaultExpanded={false}
      title={title}
      {...props}>
      <MainContainer
        display="flex"
        justifyContent="space-between">
        <LeftContainer>
          <Typography
            variant="h5"
            component="div">
            Current Position
          </Typography>
          <Typography
            sx={{ mb: 1.5 }}
            color="text.secondary"></Typography>
          <Typography variant="body2"></Typography>
        </LeftContainer>

        <MiddleContainer>
          <Typography
            variant="h5"
            component="div">
            Rebalanced Index Quantities
          </Typography>
          <Typography
            sx={{ mb: 1.5 }}
            color="text.secondary"></Typography>
          <Typography variant="body2"></Typography>
        </MiddleContainer>

        <RightContainer>
          <Typography
            variant="h5"
            component="div">
            Position Allocation Updates
          </Typography>
          <Typography
            sx={{ mb: 1.5 }}
            color="text.secondary"></Typography>
          <Typography variant="body2"></Typography>
        </RightContainer>
      </MainContainer>
    </AppAccordionSection>
  );
};

export default IndexResultsSection;
