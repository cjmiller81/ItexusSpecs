import { SvgIcon } from "@mui/material";

export function CustomDeleteIcon() {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      sx={{
        width: 24,
        height: 24,
      }}
    >
      <rect width="24" height="24" rx="4" fill="#f44336" />

      <path
        fill="#fff"
        d="M12 10.5858L15.5355 7.0503L16.9497 8.4645L13.4142 12L16.9497 15.5355L15.5355 16.9497L12 13.4142L8.46447 16.9497L7.05025 15.5355L10.5858 12L7.05025 8.4645L8.46447 7.0503L12 10.5858Z"
      />
    </SvgIcon>
  );
}