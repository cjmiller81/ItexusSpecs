import { OrderStatus } from "@/features/shared/models/orderStatus";
import DoneIcon from "@mui/icons-material/Done";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Chip, ChipPropsColorOverrides } from "@mui/material";
import { OverridableStringUnion } from "@mui/types";
import React, { FC } from "react";

export const getStatusLabelText = (status: OrderStatus) => {
  if (!status) return "Error";
  if (status === "Error") return "Rejected";
  if (status === "PendingCancel") return "Pending cancel";
  if (status === "FilledPartiallyAndCancelled") return "Filled partially and cancelled";
  return status;
};

export const StatusChip: FC<{ status: OrderStatus }> = ({ status }) => {
  let color: OverridableStringUnion<
    "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning",
    ChipPropsColorOverrides
  >;
  const label = getStatusLabelText(status);
  let icon: React.ReactElement = <></>;
  switch (status) {
    case "Submitted": {
      color = "primary";
      icon = <InfoOutlinedIcon />;
      break;
    }
    case "Filled": {
      color = "success";
      icon = <DoneIcon />;
      break;
    }
    case "Working": {
      color = "primary";
      icon = <InfoOutlinedIcon />;
      break;
    }
    case "Partial": {
      color = "primary";
      icon = <InfoOutlinedIcon />;
      break;
    }
    case "PendingCancel": {
      color = "primary";
      icon = <InfoOutlinedIcon />;
      break;
    }
    case "FilledPartiallyAndCancelled": {
      color = "warning";
      icon = <WarningAmberIcon />;
      break;
    }
    case "Error": {
      color = "error";
      icon = <WarningAmberIcon />;
      break;
    }
    case "Canceled": {
      color = "error";
      icon = <WarningAmberIcon />;
      break;
    }
    case undefined: {
      color = "error";
      icon = <WarningAmberIcon />;
      break;
    }
  }

  return (
    <Chip
      label={label}
      color={color}
      variant="outlined"
      icon={icon}
      sx={{
        borderRadius: "30px",
        fontSize: "inherit",
        height: "auto",
        padding: "5px 10px",
        width: "max-content !important",
        minWidth: "auto !important",
      }}
    />
  );
};
