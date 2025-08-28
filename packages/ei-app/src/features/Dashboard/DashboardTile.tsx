import { CircularProgress, Paper, Typography } from "@mui/material";
import { Box, Stack, StackProps, useTheme } from "@mui/system";
import { FC, ReactNode, useState } from "react";
import { SectionLink } from "./SectionLink";

export type DashboardTileProps = Omit<StackProps, 'title'> & {
  title: string;
  icon: ReactNode;
  loading?: boolean;
  datePicker?: ReactNode;
  afterTitleComponent?: ReactNode;
  rightHeaderContent?: ReactNode;
  sectionLink?: {
    href: string;
    text?: string;
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
      sx={{ position: 'relative' }}
    >
      <Stack 
        direction="row" 
        alignItems="center" 
        justifyContent="space-between" 
        gap={1}
      >
        <Stack 
          direction="row" 
          alignItems="center" 
          gap={1} 
          flex="1 1 auto" 
          minWidth={0}
        >
          {icon}
          <Typography
            sx={{
              pt: "2px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "1.020rem",
              letterSpacing: "0.04em",
            }}
            variant="h6">
            {title}
          </Typography>
          {sectionLink && isHovered && (
            <SectionLink href={sectionLink.href} text={sectionLink.text} />
        )}
          {afterTitleComponent}
          {loading && (
            <CircularProgress
              sx={{ color: "success.main", ml: "auto", mr: 0 }}
              size="1rem"
            />
          )}
        </Stack>

        <Stack direction="row" alignItems="center" gap={1}>
          {rightHeaderContent}
          {datePicker && <Box>{datePicker}</Box>}
        </Stack>
      </Stack>
      <Paper sx={{ boxShadow: theme.shadows?.[8] }}>{children}</Paper>
    </Stack>
  );
};
