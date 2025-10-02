import {
  Box,
  Divider,
  Typography,
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  useTheme,
} from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import PrivacyNoticeSection from "@/features/Support/Privacy";
import SupportCenterSection from "@/features/Support/SupportCenterSection";
import CompliancePage from "@/features/Support/CompliancePage";
import FaqSection from "@/features/Support/Faq";

export default function Support() {
  const { t } = useTranslation("Support");
  const [selectedSection, setSelectedSection] = useState<"faq" | "privacy" | "agreement" | "support">("faq");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const sections = [
    { key: "faq", label: "User FAQ", icon: <HelpOutlineOutlinedIcon sx={{ color: "#B2BEB5" }} /> },
    { key: "privacy", label: "Privacy Notice", icon: <ShieldOutlinedIcon sx={{ color: "#B2BEB5" }} /> },
    { key: "agreement", label: "Compliance & User Agreement", icon: <DescriptionOutlinedIcon sx={{ color: "#B2BEB5" }} /> },
    { key: "support", label: "Support", icon: <ChatBubbleOutlineOutlinedIcon sx={{ color: "#B2BEB5" }} /> },
  ];

  return (
    <>
      <Typography variant="h4" component="div" gutterBottom sx={{ fontWeight: "bold", mb: 0 }}>
        {t("SupportLegalCenter")}
      </Typography>

      <Typography gutterBottom sx={{ color: "gray" }}>
        {t("EverythingYouNeedToKnow")}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Card sx={{ mb: 4, borderRadius: "6px" }}>
        <CardContent>
          <List>
            {sections.map((item) => (
              <ListItemButton
                key={item.key}
                onClick={() => setSelectedSection(item.key as typeof selectedSection)}
                sx={{
                  "&:hover": { backgroundColor: "#1e90ff", borderRadius: "6px" },
                  backgroundColor: selectedSection === item.key ? "#1e90ff" : "transparent",
                  borderRadius: "6px",
                }}
              >
                <ListItemIcon sx={{ minWidth: 28 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  sx={{
                    color:
                      selectedSection === item.key
                        ? "white"
                        : isDark
                        ? "#B2BEB5"
                        : "#4a4a4a",
                  }}

                  primary={item.label}
                />
              </ListItemButton>
            ))}
          </List>
          
          <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${isDark ? "#333" : "#e0e0e0"}` }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: "bold", 
                color: isDark ? "#fff" : "#000",
                mb: 1
              }}
            >
              Disclaimer
            </Typography>
            <Typography 
              sx={{ 
                color: isDark ? "#B2BEB5" : "#4a4a4a",
                fontSize: "0.9rem",
                lineHeight: 1.5
              }}
            >
              Elan Insights provides research and analytics only. Nothing on elaninsights.com or elaninsights.io constitutes investment recommendations. Users remain in full control of their own accounts and are solely responsible for their own financial decisions. Please see links to our policies and terms above for further information.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {selectedSection === "faq" && <FaqSection />}
      {selectedSection === "privacy" && (
        <PrivacyNoticeSection />
      )}
      {selectedSection === "agreement" && (
        <CompliancePage />
      )}
      {selectedSection === "support" && <SupportCenterSection/>}
    </>
  );
}
