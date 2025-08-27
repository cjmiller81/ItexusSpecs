import { Box, Link, Typography } from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
import { FC } from "react";

interface SectionLinkProps {
  href: string;
  text?: string;
}

export const SectionLink: FC<SectionLinkProps> = ({ 
  href, 
  text = "Go to full page" 
}) => {
  return (
    <Link 
      href={href} 
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        textDecoration: 'none',
        color: '#1976d2',
        fontSize: '0.875rem',
        fontWeight: 500,
        padding: '4px 8px',
        borderRadius: '4px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: '#E3F2FD',
          textDecoration: 'underline',
        },
      }}
    >
      <LinkIcon sx={{ fontSize: '1rem' }} />
      <Typography variant="body2" component="span">
        {text}
      </Typography>
    </Link>
  );
};
