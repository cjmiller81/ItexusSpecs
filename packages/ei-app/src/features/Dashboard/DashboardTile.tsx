import { CircularProgress, Paper, Typography } from "@mui/material";
import { Box, Stack, StackProps, useTheme } from "@mui/system";
import { FC, ReactNode } from "react";

export type DashboardTileProps = StackProps & {
  title: string;
  icon: ReactNode;
  loading?: boolean;
  datePicker?: ReactNode;
  afterTitleComponent?: ReactNode;
};

export const DashboardTile: FC<DashboardTileProps> = ({
  title,
  icon,
  children,
  loading,
  afterTitleComponent,
  datePicker,
  sx,
  ...props
}) => {
  const theme = useTheme();
  return (
    <Stack
      sx={{
        ...sx,
      }}
      {...props}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        sx={{}}>
        <Stack
          direction="row"
          alignItems="center"
          gap={1}>
          {icon}
          <Typography
            sx={{ pt: "0px", textWrap: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            variant="h6">
            {title}
          </Typography>
          {afterTitleComponent}
          {loading && (
            <CircularProgress
              sx={{ color: "success.main", marginLeft: "auto", marginRight: 0 }}
              size="1rem"
            />
          )}
        </Stack>
        {datePicker && <Box sx={{ ml: "auto" }}>{datePicker}</Box>}
      </Stack>
      <Paper sx={{ boxShadow: theme.shadows?.[8] }}>{children}</Paper>
    </Stack>
  );
};
