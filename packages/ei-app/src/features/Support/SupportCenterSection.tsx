import {
  Box,
  Typography,
  Stack,
  Paper,
  useTheme
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LanguageIcon from "@mui/icons-material/Language";

export default function SupportCenterSection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", color: isDark ? "#fff" : "#000", mb: 1 }}>
        Support Center
      </Typography>
      <Typography sx={{ color: "gray", mb: 2 }}>
        Get help when you need it
      </Typography>

      <Stack spacing={2}>
        <Paper sx={{ p: 2, borderRadius: "6px" }}>
            <Box display="flex" alignItems="center" mb={1}>
                <MailOutlineIcon sx={{ color: "#70b3ff", mr: 1 }} />
                <Typography sx={{ fontWeight: "bold", color: "white" }}>Email Support</Typography>
            </Box>
            <Typography sx={{ color: isDark ? "#b0b7c3" : "#4a4a4a", }}>
                <span style={{ fontWeight: "bold" }}>General Support</span><br />
                <a href="mailto:support@elaninsights.io" style={{ color: "#70b3ff", fontWeight: "normal" }}>
                support@elaninsights.io
                </a><br /><br />
                <span style={{ fontWeight: "bold" }}>Privacy Concerns</span><br />
                <a href="mailto:privacy@elaninsights.io" style={{ color: "#70b3ff", fontWeight: "normal" }}>
                privacy@elaninsights.io
                </a><br /><br />
                <span style={{ fontWeight: "bold" }}>Legal</span><br />
                <a href="mailto:legal@elaninsights.com" style={{ color: "#70b3ff", fontWeight: "normal" }}>
                legal@elaninsights.com
                </a>
            </Typography>
        </Paper>


        <Paper sx={{ p: 2, borderRadius: "6px" }}>
          <Box display="flex" alignItems="center" mb={1}>
            <LanguageIcon sx={{ color: "#00ff88", mr: 1 }} />
            <Typography sx={{ fontWeight: "bold", color: "white" }}>Online Resources</Typography>
          </Box>
          <Typography sx={{ color: isDark ? "#b0b7c3" : "#4a4a4a",}}>
            <span style={{ fontWeight: "bold" }}>
                Website
            </span><br />
            <a href="https://www.elaninsights.com" target="_blank" style={{ color: "#70b3ff", fontWeight: "normal" }}>
                www.elaninsights.com
            </a>
           </Typography>

        </Paper>
      </Stack>
    </Box>
  );
}
