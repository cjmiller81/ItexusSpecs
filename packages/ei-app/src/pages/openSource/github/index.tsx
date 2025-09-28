import { Box, Chip, keyframes, Typography, useTheme } from "@mui/material"
import React from "react"
import { useTranslation } from "react-i18next";

export default function Telegram() {

    const theme = useTheme();
    const { t } = useTranslation("Social");

    const pulseGlow = keyframes`
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.3);
      }
      50% {
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
      }
    `;
    
    const shimmer = keyframes`
      0% {
        left: -100%;
      }
      100% {
        left: 100%;
      }
    `;
    
    const rotate = keyframes`
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    `;
    
  return  (
    <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
        <Typography
            variant="h4"
            component="div"
            sx={{ fontWeight: "bold", mb: 0, paddingRight: "20px" }}
            id="trading_header"
        >
            {t("GitHub")}
        </Typography>
        <Chip
            icon={
                <Box
                    component="svg"
                    viewBox="0 0 16 16"
                    sx={{ 
                        animation: `${rotate} 4s linear infinite`,
                        width: '12px',
                        height: '12px',
                        fill: '#60a5fa'
                    }}
                    >
                    <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0z"/>
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>
                </Box>
            }
            label="Coming Soon"
            sx={{
                background: theme.palette.mode === 'light'
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.2) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                borderRadius: '20px',
                color: theme.palette.mode === 'light' ? theme.palette.primary.dark : '#60a5fa',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '13px',
                animation: `${pulseGlow} 3s ease-in-out infinite`,
                backdropFilter: 'blur(8px)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                animation: `${shimmer} 2s infinite`,
                zIndex: 0,
                },
                '& .MuiChip-label': {
                position: 'relative',
                zIndex: 1,
                },
                '& .MuiChip-icon': {
                position: 'relative',
                zIndex: 1,
                }
            }}
            />
        </Box>
    )
}
