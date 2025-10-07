import { Box, Link, Typography } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
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
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        gap: 0.5,
        textDecoration: 'none',
        color: '#219a83',
        fontSize: '0.875rem',
        fontWeight: 500,
        padding: '4px 8px',
        border: '2px solid #219a83', 
        borderRadius: '4px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: '#219a83',
          color: "white",
          textDecoration: 'underline',
        },
      }}
    >
      <OpenInNewIcon sx={{ fontSize: '1rem' }} />
      <Typography variant="body2" component="span">
        {text}
      </Typography>
    </Link>
  );
};
