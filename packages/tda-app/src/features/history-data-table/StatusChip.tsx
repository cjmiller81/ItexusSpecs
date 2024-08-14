import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Chip } from "@mui/material";
import { FC } from "react";

export const StatusChip: FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case "Filled":
      return (
        <Chip
          label="Filled"
          color="success"
          variant="outlined"
          icon={<CheckCircleOutlineIcon />}
          sx={{ borderRadius: 30, fontSize: "inherit", padding: 0.1 }}
        />
      );
    case "Open":
      return (
        <Chip
          label="Open"
          color="info"
          variant="outlined"
          icon={<InfoOutlinedIcon />}
          sx={{ borderRadius: 30, fontSize: "inherit" }}
        />
      );
    case "Rejected":
      return (
        <Chip
          label="Rejected"
          color="error"
          variant="outlined"
          icon={<ErrorOutlineIcon />}
          sx={{ borderRadius: 30, fontSize: "inherit" }}
        />
      );
    default:
      return <Chip label={status} sx={{ fontSize: "inherit" }} />;
  }
};
