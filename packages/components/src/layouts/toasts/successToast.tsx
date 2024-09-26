import React from "react";
import { toast, ToastPosition } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import { getSuccessStyles } from "./successToastStylesHelper";

interface SuccessToastProps {
  message: string;
  event?: { instruction: string };
  style?: {
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
  const backgroundColor = event?.instruction === "Buy" ? "#89cb5c" : "#ca2d2d";
  const dynamicStyles = getSuccessStyles(backgroundColor);
  const combinedStyles = {
    toast: { ...dynamicStyles.toast, ...style.toast },
    progress: { ...dynamicStyles.progress, ...style.progress },
  };

  const CustomIcon: React.FC = () => {
    return (
      <div style={dynamicStyles.icon}>
        <FaCheckCircle style={{ color: "#89cb5c", fontSize: "24px" }} />
      </div>
    );
  };

  toast.success(
    <div style={combinedStyles.toast}>
      <CustomIcon />
      <span style={{ marginLeft: "10px" }}>{message}</span>
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

export default SuccessToast;
