import { CircularProgress, Paper, Typography } from "@mui/material";
import { Box, Stack, StackProps, useTheme } from "@mui/system";
import { FC, ReactNode } from "react";

export type DashboardTileProps = Omit<StackProps, 'title'> & {
  title: string;
  icon: ReactNode;
  loading?: boolean;
  datePicker?: ReactNode;
  afterTitleComponent?: ReactNode;
  rightHeaderContent?: ReactNode;
};

export const DashboardTile: FC<DashboardTileProps> = ({
  title,
  icon,
  children,
  loading,
  afterTitleComponent,
  datePicker,
  rightHeaderContent,
  ...props
}) => {
  const theme = useTheme();
  return (
    <Stack {...props}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
        <Stack direction="row" alignItems="center" gap={1} flex="1 1 auto" minWidth={0}>
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
