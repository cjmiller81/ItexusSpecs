import React from "react";
import { toast, ToastPosition } from "react-toastify";
import { FaExclamationTriangle } from "react-icons/fa";
import { useTheme } from "@mui/material/styles";

interface ErrorToastProps {
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

const ErrorToast: React.FC<ErrorToastProps> = ({
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
      color: "#121212",
    },
    toast: {
      backgroundColor: "orange",
      color: "black",
      width: "max-content",
      display: "flex",
      alignItems: "center",
    },
    progress: {
      backgroundColor: theme.palette.grey[700],
    },
  };

  const combinedStyles = {
    icon: { ...defaultStyles.icon, ...style.icon },
    toast: { ...defaultStyles.toast, ...style.toast },
    progress: { ...defaultStyles.progress, ...style.progress },
  };

  const toastIdRef = React.useRef<string | number | null>(null);

  toastIdRef.current = toast.error(
    <div style={combinedStyles.toast}>
      <FaExclamationTriangle style={combinedStyles.icon} />
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

export default ErrorToast;
