import { BottomNavigation, BottomNavigationAction, Typography } from "@mui/material";
import { useState } from "react";
import { Box } from "@mui/system";

export default function UserDetailsSection({
  opened,
  user,
  orders,
  currentDayFills,
  workingOrders,
  bots,
  openPositions,
  theme,
  ...props
}) {
  const [navValue, setNavValue] = useState(0);
  const pageLinks = ["5WX30651", "5WX30652", "5WX30653"];

  return (
    <Box
      {...props}
      sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          align="left"
          sx={{ mt: 2, ml: 2 }}>
          Accounts
        </Typography>

        <BottomNavigation
          value={navValue}
          onChange={(event, newValue) => setNavValue(newValue)}
          showLabels
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            mt: 1,
          }}>
          {pageLinks.map((link, index) => (
            <BottomNavigationAction
              key={index}
              label={link}
              sx={{
                width: "80px",
                maxWidth: "80px",
                mr: 2,
                "&.Mui-selected": {
                  color: theme.palette.mode === "light" ? theme.palette.grey[600] : theme.palette.grey[50],
                  borderBottom: `2px solid ${theme.palette.grey[700]}`,
                },
                "& .MuiBottomNavigationAction-label": {
                  fontSize: "0.8rem",
                  fontWeight: "normal",
                  padding: "4px 0",
                },
              }}
            />
          ))}
        </BottomNavigation>
        <Box
          sx={{
            borderTop: `0.5px solid grey`,
            width: "1000px !important",
          }}
        />
      </Box>
    </Box>
  );
}
