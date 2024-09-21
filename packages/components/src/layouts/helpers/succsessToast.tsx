import React from "react";
import { toast, ToastPosition } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import { useTheme } from "@mui/material/styles";

interface SuccessToastProps {
  message: string;
  event?: { instruction: string };
  style?: {
    icon?: React.CSSProperties;
    toast?: React.CSSProperties;
    progress?: React.CSSProperties;
  };
  autoClose?: number;
  position?: ToastPosition;

  [key: string]: any;
}

const SuccessToast: React.FC<SuccessToastProps> = ({
  message,
  event,
  style = {},
  autoClose = 5000,
  position = "bottom-left",
  ...props
}) => {
  const theme = useTheme();

  const defaultStyles = {
    icon: {
      width: "24px",
      height: "24px",
      margin: "0 10px 0 10px",
      color: theme.palette.grey[700],
      backgroundColor: "green",
      borderRadius: "20px",
    },
    toast: {
      backgroundColor: event?.instruction === "Buy" ? "#89cb5c" : "#ca2d2d",
      color: theme.palette.grey[700],
      width: "max-content",
      display: "flex",
      alignItems: "center",
    },
    progress: {
      backgroundColor: "white",
    },
  };

  const combinedStyles = {
    icon: { ...defaultStyles.icon, ...style.icon },
    toast: { ...defaultStyles.toast, ...style.toast },
    progress: { ...defaultStyles.progress, ...style.progress },
  };

  const toastIdRef = React.useRef<string | number | null>(null);

  toastIdRef.current = toast.success(
    <div style={{ display: "flex", alignItems: "center" }}>
      <FaCheckCircle style={combinedStyles.icon} />
      {message}
    </div>,
    {
      position,
      autoClose,
      style: combinedStyles.toast,
      progressStyle: combinedStyles.progress,
      onClose: () => {
        toastIdRef.current = null;
      },
      ...props,
    },
  );

  return null;
};

export default SuccessToast;
