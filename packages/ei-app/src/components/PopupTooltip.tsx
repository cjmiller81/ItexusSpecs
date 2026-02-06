import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Box, Paper, Typography, alpha, useTheme } from '@mui/material';

interface PopupTooltipProps {
  children: React.ReactNode;
  title: string;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: number;
  onHoverChange?: (isHovered: boolean) => void;
  sx?: any;
}

export const PopupTooltip: React.FC<PopupTooltipProps> = ({
  children,
  title,
  content,
  position = 'top',
  maxWidth = 300,
  onHoverChange,
  sx = {}
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (isHovered && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top,
        left: rect.left + rect.width / 2,
      });
    }
  }, [isHovered]);


  const getTooltipPosition = () => {
    const baseStyles = {
      position: 'absolute' as const,
      zIndex: 1500,
      maxWidth: `${maxWidth}px`,
    };

    switch (position) {
      case 'top':
        return {
          ...baseStyles,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '10px',
        };
      case 'bottom':
        return {
          ...baseStyles,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '6px',
        };
      case 'left':
        return {
          ...baseStyles,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '6px',
        };
      case 'right':
        return {
          ...baseStyles,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '6px',
        };
      default:
        return baseStyles;
    }
  };

  const getArrowStyles = () => {
    const arrowSize = 8;
    const baseArrowStyles = {
      position: 'absolute' as const,
      width: 0,
      height: 0,
    };

    switch (position) {
      case 'top':
        return {
          ...baseArrowStyles,
          bottom: `-${arrowSize}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderTop: `${arrowSize}px solid ${theme.palette.mode === 'light' ? '#ffffff' : '#1f2937'}`,
        };
      case 'bottom':
        return {
          ...baseArrowStyles,
          top: `-${arrowSize}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid ${theme.palette.mode === 'light' ? '#ffffff' : '#1f2937'}`,
        };
      case 'left':
        return {
          ...baseArrowStyles,
          right: `-${arrowSize}px`,
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderLeft: `${arrowSize}px solid ${theme.palette.mode === 'light' ? '#ffffff' : '#1f2937'}`,
        };
      case 'right':
        return {
          ...baseArrowStyles,
          left: `-${arrowSize}px`,
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid ${theme.palette.mode === 'light' ? '#ffffff' : '#1f2937'}`,
        };
      default:
        return baseArrowStyles;
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        display: 'inline-block',
        width: '100%',
        zIndex: 1,
        ...sx,
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        onHoverChange?.(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHoverChange?.(false);
      }}
    >
      {children}
      
      {isHovered && typeof window !== 'undefined' && ReactDOM.createPortal(
        <Box
          sx={{
            position: 'fixed',
            top: `${tooltipPosition.top - 10}px`,
            left: `${tooltipPosition.left}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 999999,
            pointerEvents: 'none',
            maxWidth: `${maxWidth}px`,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
              borderRadius: 2,
              p: 1.5,
              paddingBottom: 0.3,
              paddingTop: 1,
              border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`,
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                fontSize: '0.7rem',
                color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : '#ffffff',
                mb: 0.5,
              }}
            >
              {title}
            </Typography>
            
            <Box sx={{ mb: 0.4 }}>
              {content}
            </Box>
            
            <Box
              sx={{
                height: '1px',
                backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
                mb: 0.2,
              }}
            />
            
            <Typography
              variant="caption"
              sx={{
                fontStyle: 'italic',
                fontSize: '0.58rem',
                lineHeight: 0,
              }}
            >
              For informational purposes only. Not trading advice.
            </Typography>
          </Paper>
          
          {/* Arrow pointing down */}
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: `8px solid ${alpha(theme.palette.background.paper, 0.95)}`,
            }}
          />
        </Box>,
        document.body
      )}
    </Box>
  );
};
