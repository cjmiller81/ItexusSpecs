import DoneIcon from "@mui/icons-material/Done";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Chip, ChipPropsColorOverrides } from "@mui/material";
import { OverridableStringUnion } from "@mui/types";
import { FC } from "react";
import { OrderStatus } from "../shared/models/orderStatus";

export const StatusChip: FC<{ status: OrderStatus }> = ({ status }) => {
  let color: OverridableStringUnion<
    "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning",
    ChipPropsColorOverrides
  >;
  let label = "";
  let icon: React.ReactElement = <></>;
  switch (status) {
    case "Submitted": {
      label = "Submitted";
      color = "primary";
      icon = <InfoOutlinedIcon />;
      break;
    }
    case "Filled": {
      label = "Filled";
      color = "success";
      icon = <DoneIcon />;
      break;
    }
    case "Working": {
      label = "Working";
      color = "primary";
      icon = <InfoOutlinedIcon />;
      break;
    }
    case "Partial": {
      label = "Partial";
      color = "primary";
      icon = <InfoOutlinedIcon />;
      break;
    }
    case "PendingCancel": {
      label = "Pending cancel";
      color = "primary";
      icon = <InfoOutlinedIcon />;
      break;
    }
    case "FilledPartiallyAndCancelled": {
      label = "Filled partially and cancelled";
      color = "warning";
      icon = <WarningAmberIcon />;
      break;
    }
    case "Error": {
      label = "Rejected";
      color = "error";
      icon = <WarningAmberIcon />;
      break;
    }
    case "Canceled": {
      label = "Canceled";
      color = "error";
      icon = <WarningAmberIcon />;
      break;
    }
    case undefined: {
      label = "Error";
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
      sx={{ borderRadius: "30px", fontSize: "inherit", height: "auto", padding: "5px 10px" }}
    />
  );
};
