import React from "react";
import { toast, ToastPosition } from "react-toastify";
import { FaExclamationTriangle } from "react-icons/fa";
import { getErrorStyles } from "./errorToastStylesHelper";

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
  const defaultStyles = getErrorStyles();

  const combinedStyles = {
    icon: { ...defaultStyles.icon, ...style.icon },
    toast: { ...defaultStyles.toast, ...style.toast },
    progress: { ...defaultStyles.progress, ...style.progress },
  };

  toast.error(
    <div style={combinedStyles.toast}>
      <FaExclamationTriangle style={combinedStyles.icon} />
      {message}
    </div>,
    {
      position,
      autoClose,
      style: combinedStyles.toast,
      progressStyle: combinedStyles.progress,
      ...props,
    },
  );

  return null;
};

export default ErrorToast;
