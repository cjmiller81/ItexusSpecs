import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, Menu, MenuItem, IconButton, Typography, Grid, ListItemText } from "@mui/material";
import TranslationOutlined from "@ant-design/icons/TranslationOutlined";
import useConfig from "hooks/useConfig";
import { I18n } from "types/config";
import { ThemeMode } from "config";

// ==============================|| HEADER CONTENT - LOCALIZATION ||============================== //

export default function Localization() {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("md"));
  const { mode, i18n, onChangeLocalization } = useConfig();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleToggle = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleListItemClick = (lang: I18n) => {
    onChangeLocalization(lang);
    handleClose();
  };

  const iconBackColorOpen = mode === ThemeMode.DARK ? "background.default" : "grey.100";

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        aria-label="open localization"
        onClick={handleToggle}
        sx={{ color: "text.primary", bgcolor: anchorEl ? iconBackColorOpen : "transparent" }}>
        <TranslationOutlined />
      </IconButton>

      <Menu
        id="localization-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 4,
          sx: {
            width: matchesXs ? 250 : 290,
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}>
        <MenuItem
          selected={i18n === "en"}
          onClick={() => handleListItemClick("en")}>
          <ListItemText
            primary={
              <Grid container>
                <Typography color="text.primary">English</Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: "8px" }}>
                  (UK)
                </Typography>
              </Grid>
            }
          />
        </MenuItem>

        <MenuItem
          selected={i18n === "sp"}
          onClick={() => handleListItemClick("sp")}>
          <ListItemText
            primary={
              <Grid container>
                <Typography color="text.primary">Spanish</Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: "8px" }}>
                  (SP)
                </Typography>
              </Grid>
            }
          />
        </MenuItem>

        <MenuItem
          selected={i18n === "pt"}
          onClick={() => handleListItemClick("pt")}>
          <ListItemText
            primary={
              <Grid container>
                <Typography color="text.primary">Portuguese</Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: "8px" }}>
                  (PT)
                </Typography>
              </Grid>
            }
          />
        </MenuItem>
      </Menu>
    </Box>
  );
}
