import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

interface ConnectionStatusProps {
  isConnected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  const theme = useTheme();
  const { palette } = theme;

  return (
    <Box
      display="flex"
      alignItems="center"
      bgcolor={`${palette.grey[100]} !important`}
      padding="8px"
      borderRadius="4px">
      <Typography
        variant="body1"
        style={{ marginRight: "8px", width: "max-content" }}>
        Connection Status
      </Typography>

      <Typography
        variant="body1"
        style={{
          marginRight: "8px",
          fontWeight: "bold",
          width: "max-content",
        }}>
        |
      </Typography>

      <Box
        display="flex"
        alignItems="center"
        padding="1px 5px"
        bgcolor={isConnected ? "#89cb5c" : "#e96e6b"}
        borderRadius="4px">
        {isConnected ? (
          <Box
            sx={{
              width: 15,
              height: 15,
              backgroundColor: `${palette.grey[100]} !important`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "3px",
            }}>
            <CheckIcon sx={{ color: "#89cb5c", fontSize: 12 }} />
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
                top: "1.3px",
                left: "50%",
                transform: "translateX(-50%)",
                color: "#e96e6b",
                fontSize: "9px",
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
          }}
          variant="body2">
          {isConnected ? "Connected" : "Disconnected"}
        </Typography>
      </Box>
    </Box>
  );
};

export default ConnectionStatus;
