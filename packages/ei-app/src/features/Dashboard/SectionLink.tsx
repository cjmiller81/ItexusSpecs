import { Box, Typography } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { FC } from "react";
import Link from "next/link";

interface SectionLinkProps {
  href: string;
  text?: string;
  onClick?: () => void;
}

export const SectionLink: FC<SectionLinkProps> = ({ 
  href, 
  text = "Go to full page",
  onClick
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Link href={href} passHref legacyBehavior>
      <Box
        component="a"
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(25, 118, 210, 0.2)',
          gap: 0.3,
          textDecoration: 'none',
          color: '#219a83',
          fontSize: '0.75rem',
          fontWeight: 500,
          padding: '2px 6px',
          border: '1px solid #219a83', 
          borderRadius: '4px',
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#219a83',
            color: "white",
            textDecoration: 'underline',
          },
        }}
      >
        <OpenInNewIcon sx={{ fontSize: '0.85rem', flexShrink: 0 }} />
        <Typography 
          variant="body2" 
          component="span" 
          sx={{ 
            fontSize: '0.75rem',
            lineHeight: 1.2,
          }}
        >
          {text.includes('View Full') ? (
            <>
              View Full
              <br />
              Calendar
            </>
          ) : (
            text
          )}
        </Typography>
      </Box>
    </Link>
  );
};
