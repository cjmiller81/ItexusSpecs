import React, { useState } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const subtlePulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const InfoBadgeContainer = styled(Box)({
  position: 'relative',
  display: 'inline-block',
  zIndex: 100,
});

const StyledInfoBadge = styled(Button, {
  shouldForwardProp: (prop) => prop !== '$isHovered',
})<{ $isHovered?: boolean }>(({ $isHovered }) => ({
  background: 'linear-gradient(135deg, #219a83, #1a7a6b)', // Green gradient
  color: 'white',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 500,
  cursor: 'pointer',
  position: 'relative',
  animation: `${subtlePulse} 3s ease-in-out infinite`,
  transition: 'all 0.2s ease',
  border: $isHovered ? 'none' : '2px solid white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
   textTransform: 'none',
  minWidth: 'auto',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(33, 154, 131, 0.3)', // Green shadow
    animation: 'none',
    background: 'linear-gradient(135deg, #219a83, #1a7a6b)', // Green gradient
  },
}));

const BadgeTooltip = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$isHovered',
})<{ $isHovered?: boolean; theme?: any }>(({ theme, $isHovered }) => ({
  position: 'absolute',
  top: '120%',
  left: '50%',
  transform: 'translateX(-50%)',
  background: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#1f2937',
  padding: '16px',
  borderRadius: '8px',
  width: '320px',
  fontSize: '14px',
  fontWeight: 400,
  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  opacity: 0,
  visibility: 'hidden',
  transition: 'all 0.2s ease',
  zIndex: 100,
  border: $isHovered ? 'none' : '2px solid white',
  textAlign: 'center',
}));

interface InfoBadgeProps {
  title: string;
  tooltipContent: React.ReactNode;
}

export const InfoBadge: React.FC<InfoBadgeProps> = ({ title, tooltipContent }) => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();

  return (
    <InfoBadgeContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <StyledInfoBadge $isHovered={isHovered}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <span>ℹ️</span>
          <span>{title}</span>
        </Box>
      </StyledInfoBadge>

      <BadgeTooltip
        $isHovered={isHovered}
        theme={theme}
        sx={{
          opacity: isHovered ? 1 : 0,
          visibility: isHovered ? 'visible' : 'hidden',
        }}
      >
        {tooltipContent}
      </BadgeTooltip>
    </InfoBadgeContainer>
  );
};
