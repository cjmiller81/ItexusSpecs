import { useEffect, useState } from 'react';
import Menu from "@mui/icons-material/Menu";
import MenuOpen from "@mui/icons-material/MenuOpen";
import { Box, IconButton, PaletteMode, Toolbar, Typography, Button } from "@mui/material";
import { StyledAppBar } from "./StyledAppBar";
import { ThemeToggler } from "./ThemeToggler";
import { UserMenu } from "./UserMenu";
import { useOry } from '../../features/auth/layouts/OryAuthGateway';
import { useRouter } from 'next/router';


interface Props {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  toggleSide: (open: boolean) => void;
  toggleTheme: () => void;
  mode: PaletteMode;
  title: string;
  defaultAvatar: string;
  avatarUrl?: string;
  logOut?: Function;
}

export function Header({
  open,
  toggleSide,
  toggleTheme,
  mode,
  title,
  defaultAvatar,
  avatarUrl,
  logOut,
}: Props) {
  const handleLogOut = logOut || (() => {});
  const router = useRouter();
  if (typeof window !== "undefined") {
    const storedReturnTo = localStorage.getItem("return_to");
    if (storedReturnTo) {
      localStorage.removeItem("return_to");
      router.push(storedReturnTo);
    }
  }

  const { renewSession, session } = useOry();
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [remainingMinutes, setRemainingMinutes] = useState<number | null>(null);
  const renewMinutes = 30;

  useEffect(() => {
    if (session && session.expires_at) {
      const expirationTime = new Date(session.expires_at).getTime();
      const now = Date.now();
      const warningTime = expirationTime - renewMinutes * 60 * 1000;
      const delay = warningTime - now;

      if (delay <= 0) {
        setShowCountdown(true);
      } else {
        const timerId = setTimeout(() => setShowCountdown(true), delay);
        return () => clearTimeout(timerId);
      }
    }
  }, [session]);

  // Update countdown every minute
  useEffect(() => {
    if (showCountdown && session && session.expires_at) {
      const expirationTime = new Date(session.expires_at).getTime();

      const updateCountdown = () => {
        const msLeft = expirationTime - Date.now();
        const minutesLeft = Math.ceil(msLeft / (60 * 1000));
        setRemainingMinutes(minutesLeft);

        if (minutesLeft <= 0) {
          handleLogOut();
        }
      };

      updateCountdown();
      const intervalId = setInterval(updateCountdown, 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [showCountdown, session]);

  // Handler for renewing the session
  const handleRenew = () => {
    renewSession();
  };

  return (
    <StyledAppBar position="fixed" sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Toolbar sx={{ paddingLeft: "17px", width: "100%" }}>
        <IconButton
          aria-label="open drawer"
          onClick={() => toggleSide(!open)}
          edge="start"
          sx={{ marginRight: 5 }}
        >
          {open ? <MenuOpen /> : <Menu />}
        </IconButton>
        <Box display="flex" alignItems="center" flex={1} justifyContent="space-between">
          {/* Left section – header title */}
          <Typography color="textPrimary" variant="h6" noWrap component="div">
            {title}
          </Typography>
          {/* Right section – countdown block, theme toggler, and user menu */}
          <Box display="flex" alignItems="center" gap={3}>
            {showCountdown && remainingMinutes !== null && (
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  boxShadow: 2,
                  p: 1,
                }}
              >
                <Typography variant="body2" color="error">
                  Your session will expire in {remainingMinutes} {remainingMinutes === 1 ? 'minute' : 'minutes'}
                </Typography>
                <Button variant="outlined" size="small" onClick={handleRenew}>
                  Renew
                </Button>
              </Box>
            )}
            <ThemeToggler onToggleMode={toggleTheme} mode={mode} />
            <Box sx={{ mr: 1 }}>
              <UserMenu logOut={handleLogOut} defaultAvatar={defaultAvatar} avatarUrl={avatarUrl} />
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}
