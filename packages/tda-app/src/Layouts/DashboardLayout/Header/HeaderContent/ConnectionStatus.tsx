import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "react-i18next";

interface ConnectionStatusProps {
  isConnected: boolean | null;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  const { t } = useTranslation("NavBar");
  const theme = useTheme();
  const { palette } = theme;

  return (
    <Box
      display="flex"
      alignItems="center"
      bgcolor={`${palette.grey[100]} !important`}
      padding="8px 8px 8px 3px"
      borderRadius="4px">
      <Box
        display="flex"
        alignItems="center"
        padding="1px 5px"
        bgcolor={isConnected ? "#89cb5c" : "#e96e6b"}
        borderRadius="4px">
        {isConnected ? (
          <Box
            sx={{
              width: 13,
              height: 13,
              backgroundColor: `${palette.grey[100]} !important`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "3px",
            }}>
            <CheckIcon sx={{ color: "#89cb5c", fontSize: 10 }} />
          </Box>
        ) : (
          <Box
            sx={{
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderBottom: "15px solid #1a1a1a",
              borderRadius: "2px",
              position: "relative",
            }}>
            <Box
              sx={{
                position: "absolute",
                top: "1.7px",
                left: "50%",
                transform: "translateX(-55%)",
                color: "#e96e6b",
                fontSize: "8px",
                fontWeight: "bold",
              }}>
              !
            </Box>
          </Box>
        )}
        <Typography
          sx={{
            paddingLeft: "6px",
            color: `${palette.grey[100]} !important`,
            fontWeight: 500,
            marginTop: 0.2,
            paddingRight: 0.3,
            fontSize: 11,
          }}
          variant="body2">
          {isConnected ? t("Online") : t("Offline")}
        </Typography>
      </Box>
    </Box>
  );
};

export default ConnectionStatus;
