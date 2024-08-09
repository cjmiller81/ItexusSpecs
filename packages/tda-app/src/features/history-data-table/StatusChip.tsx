import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { amber } from "@mui/material/colors";
import { Chip } from "@mui/material";
import { FC } from "react";

export const StatusChip: FC<{ status: string }> = ({ status }) => {
  const yellow = amber.A400;
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
          variant="outlined"
          icon={<InfoOutlinedIcon style={{ color: yellow }} />}
          sx={{ borderRadius: 30, color: yellow, borderColor: yellow }}
        />
      );
    default:
      return <Chip label={status} sx={{ fontSize: "inherit" }} />;
  }
};
