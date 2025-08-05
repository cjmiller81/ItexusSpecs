import React from "react";
import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const StyledButton = styled(ButtonBase)(() => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 24px",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: 500,
  fontSize: "14px",
  cursor: "pointer",
  position: "relative",
  overflow: "hidden",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
  transition: "all 0.3s ease",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    transition: "left 0.5s ease",
    zIndex: 0,
  },
  "&:hover::before": {
    left: "100%",
  },
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 6px 20px rgba(99, 102, 241, 0.3)",
  },
}));

const DisconnectIcon = styled(Box)(() => ({
  width: 16,
  height: 16,
  background: "rgba(255,255,255,0.3)",
  borderRadius: 3,
  position: "relative",
  "&::after": {
    content: '"⚡"',
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: 10,
  },
}));

interface SchwabConnectButtonProps {
  label?: string;
}

const SchwabConnectButton: React.FC<SchwabConnectButtonProps> = ({
  label = "Please Connect to Schwab Account",
}) => {
  const handleClick = () => {
    window.location.href = "/profile/brokerageConnection";
  };

  return (
    <StyledButton onClick={handleClick}>
      <DisconnectIcon />
      <Typography component="span">{label}</Typography>
    </StyledButton>
  );
};

export default SchwabConnectButton;
