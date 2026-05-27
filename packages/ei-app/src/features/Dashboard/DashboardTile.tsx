import { CircularProgress, Paper, Typography } from "@mui/material";
import { Box, Stack, StackProps, useTheme } from "@mui/system";
import { FC, ReactNode, useState } from "react";
import { SectionLink } from "./SectionLink";

export type DashboardTileProps = Omit<StackProps, "title"> & {
  title: string;
  icon: ReactNode;
  loading?: boolean;
  datePicker?: ReactNode;
  afterTitleComponent?: ReactNode;
  rightHeaderContent?: ReactNode;
  sectionLink?: {
    href: string;
    text?: string;
    onClick?: () => void;
    alwaysVisible?: boolean;
    disabled?: boolean;
  };
};

export const DashboardTile: FC<DashboardTileProps> = ({
  title,
  icon,
  children,
  loading,
  afterTitleComponent,
  datePicker,
  rightHeaderContent,
  sectionLink,
  ...props
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Stack
      {...props}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ position: "relative", height: "100%", ...props.sx }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={0.5}
        sx={{ minHeight: "48px" }}>
        <Stack
          direction="row"
          alignItems="center"
          gap={0.5}
          flex="1 1 auto"
          minWidth={0}>
          <Box
            sx={{
              color: sectionLink && isHovered ? "#219a83" : "inherit",
              transition: "color 0.2s ease-in-out",
              display: "flex",
              alignItems: "center",
            }}>
            {icon}
          </Box>
          <Typography
            sx={{
              pt: "2px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "0.9rem",
              letterSpacing: "0.02em",
              color: sectionLink && isHovered ? "#219a83" : "inherit",
              transition: "color 0.2s ease-in-out",
            }}
            variant="h6">
            {title}
          </Typography>
          {afterTitleComponent}
          {loading && (
            <CircularProgress
              sx={{ color: "success.main", ml: "auto", mr: 0 }}
              size="1rem"
            />
          )}
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          gap={1}>
          {sectionLink && (isHovered || sectionLink.alwaysVisible || sectionLink.disabled) && (
            <SectionLink
              href={sectionLink.href}
              text={sectionLink.text}
              onClick={sectionLink.onClick}
              disabled={sectionLink.disabled}
            />
          )}
          {rightHeaderContent}
          {datePicker && <Box>{datePicker}</Box>}
        </Stack>
      </Stack>
      <Paper
        sx={{
          boxShadow: theme.shadows?.[8],
          border: sectionLink && isHovered ? "2px solid #219a83" : "2px solid transparent",
          transition: "border-color 0.2s ease-in-out",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}>
        {children}
      </Paper>
    </Stack>
  );
};
