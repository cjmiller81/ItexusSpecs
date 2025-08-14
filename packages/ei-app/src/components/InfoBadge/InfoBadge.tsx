import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const subtlePulse = keyframes`
  0%, 100% { 
    transform: scale(1); 
  }
  50% { 
    transform: scale(1.05); 
  }
`;

const InfoBadgeContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  zIndex: 9999,
}));

const StyledInfoBadge = styled(Button)<{ $isHovered?: boolean }>(({ theme, $isHovered }) => ({
  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
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
  gap: '6px',
  textTransform: 'none',
  minWidth: 'auto',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    animation: 'none',
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  },
}));

const BadgeTooltip = styled(Box)<{ $isHovered?: boolean }>(({ theme, $isHovered }) => ({
  position: 'absolute',
  top: '120%',
  left: '50%',
  transform: 'translateX(-50%)',
  background: '#1f2937',
  color: 'white',
  padding: '16px',
  borderRadius: '8px',
  width: '320px',
  fontSize: '14px',
  fontWeight: 400,
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  opacity: 0,
  visibility: 'hidden',
  transition: 'all 0.2s ease',
  zIndex: 9999,
  border: $isHovered ? 'none' : '2px solid white',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    border: '6px solid transparent',
    borderBottomColor: '#1f2937',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    border: '8px solid transparent',
    borderBottomColor: 'white',
    marginBottom: '-2px',
  },
}));

const TooltipLink = styled('a')(({ theme }) => ({
  color: '#60a5fa',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

interface InfoBadgeProps {
  title: string;
  tooltipContent: React.ReactNode;
}

export const InfoBadge: React.FC<InfoBadgeProps> = ({ title, tooltipContent }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <InfoBadgeContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <StyledInfoBadge $isHovered={isHovered}>
        <span>ℹ️</span>
        <span>{title}</span>
        <BadgeTooltip
          $isHovered={isHovered}
          sx={{
            opacity: isHovered ? 1 : 0,
            visibility: isHovered ? 'visible' : 'hidden',
          }}
        >
          {tooltipContent}
        </BadgeTooltip>
      </StyledInfoBadge>
    </InfoBadgeContainer>
  );
};
