import React from 'react';
import { Button } from '@mui/material';
import { keyframes } from '@mui/system';
import { useTour } from '@reactour/tour';

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(33, 154, 131, 0.3);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(33, 154, 131, 0.1);
  }
`;

const shimmer = keyframes`
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
  }
`;

interface AnimatedStartTourButtonProps {
  tourId: string;
  sx?: any;
  size?: 'small' | 'medium' | 'large';
  variant?: 'contained' | 'outlined' | 'text';
  children?: React.ReactNode;
  onClick?: () => void;
}

export const AnimatedStartTourButton: React.FC<AnimatedStartTourButtonProps> = ({
  tourId,
  sx = {},
  size = 'small',
  variant = 'contained',
  children = 'Start Tour',
  onClick
}) => {
  const { setIsOpen, setCurrentStep } = useTour();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const savedStep = Number(localStorage.getItem(`EI_TOUR_${tourId}_STEP`) || 0);
      setCurrentStep(isNaN(savedStep) ? 0 : savedStep);
      setIsOpen(true);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      sx={{
        textTransform: "none",
        backgroundColor: "#219a83",
        color: "white",
        position: 'relative',
        overflow: 'hidden',
        animation: `${pulseGlow} 3s ease-in-out infinite`,
        backdropFilter: 'blur(8px)',
        '&:hover': {
          backgroundColor: "#1a7a6b"
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
          animation: `${shimmer} 2s infinite`,
          zIndex: 0,
        },
        '& .MuiButton-label': {
          position: 'relative',
          zIndex: 1,
        },
        ...sx
      }}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};
