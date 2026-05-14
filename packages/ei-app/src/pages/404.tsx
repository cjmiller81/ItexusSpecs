import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 128px)',
        px: 3,
      }}
    >
      <Stack spacing={2.5} alignItems="center" textAlign="center" sx={{ maxWidth: 520 }}>
        <Typography
          sx={{
            fontSize: { xs: '5rem', sm: '7rem', md: '9rem' },
            fontWeight: 700,
            color: 'primary.main',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            userSelect: 'none',
          }}
        >
          404
        </Typography>

        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Page Not Found
        </Typography>

        <Typography color="text.secondary" variant="body1" sx={{ maxWidth: 380 }}>
          The page you are looking for was moved, removed, or might never have existed.
        </Typography>

        <Link
          component={NextLink}
          href="/"
          underline="hover"
          color="primary"
          variant="body1"
          sx={{ fontWeight: 500 }}
        >
          ← Back to Home
        </Link>

      </Stack>
    </Box>
  );
}
