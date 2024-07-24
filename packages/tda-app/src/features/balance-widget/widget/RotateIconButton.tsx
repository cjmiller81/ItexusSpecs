import DownOutlined from "@ant-design/icons/DownOutlined";
import { Box, BoxProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FC } from "react";

export const RotateIconButton: FC<BoxProps & { rotate?: boolean }> = ({ rotate, ...props }) => {
  const theme = useTheme();
  return (
    <Box
      {...props}
      sx={{
        transition: "transform 0.3s ease",
        transform: rotate ? "rotate(0deg)" : "rotate(180deg)",
        maxHeight: "12px",
        blockSize: "fit-content",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
      <DownOutlined
        style={{
          color: theme.palette.primary.light,
          fill: theme.palette.primary.light,
          stroke: theme.palette.primary.light,
        }}
      />
    </Box>
  );
};

export default RotateIconButton;
