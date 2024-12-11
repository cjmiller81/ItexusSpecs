import { Box, Typography } from "@mui/material";
import { FC } from "react";
import RotateIconButton from "./RotateIconButton";

export const TableHeader: FC<{ title: string; open?: boolean; onOpenToggle: () => void }> = ({
  title,
  open,
  onOpenToggle,
}) => {
  return (
    <Box style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <RotateIconButton
        onClick={onOpenToggle}
        rotate={!open}></RotateIconButton>
      <Typography
        sx={{ userSelect: "none" }}
        variant="h6">
        {title}
      </Typography>
    </Box>
  );
};
