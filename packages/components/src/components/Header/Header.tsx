import { ReactNode, useEffect, useState } from 'react';
import Menu from "@mui/icons-material/Menu";
import MenuOpen from "@mui/icons-material/MenuOpen";
import { Box, IconButton, PaletteMode, Toolbar, Typography, Button } from "@mui/material";
import { StyledAppBar } from "./StyledAppBar";
import { ThemeToggler } from "./ThemeToggler";
import { UserMenu } from "./UserMenu";
import { ApiUsageStatus } from "./ApiUsageStatus";
import { useOry } from '../../features/auth/layouts/OryAuthGateway';
import { useRouter } from 'next/router';
import { authLogger } from '../../utils/authLogger';
import { safeReturnTo } from '../../features/auth/utils/safeReturnTo';


interface Props {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  toggleSide: (open: boolean) => void;
  toggleTheme: () => void;
  mode: PaletteMode;
  title: ReactNode;
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
      // Validate against same-origin before redirecting. localStorage can be
      // written from anywhere we execute JS, so we treat the value as
      // untrusted.
      router.push(safeReturnTo(storedReturnTo, "/"));
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

  const [remaining, setRemaining] = useState<number | null>(null);
  const [modes, setModes] = useState<"minutes" | "seconds">("minutes");

useEffect(() => {
  if (!showCountdown || !session?.expires_at) return;

  let timerId: ReturnType<typeof setTimeout>;
  const tick = () => {
    if (!session?.expires_at) return;
    const expirationTime = new Date(session.expires_at).getTime();
    const msLeft = expirationTime - Date.now();

    if (msLeft <= 0) {
      setRemaining(0);
      setModes("seconds");
      router.push("/ui/login");
      return;
    }

    if (msLeft > 60_000) {
      setRemaining(Math.ceil(msLeft / 60_000));
      setModes("minutes");
      const next = (msLeft % 60_000) || 60_000;
      timerId = setTimeout(tick, next);
    } else {
      setRemaining(Math.ceil(msLeft / 1000));
      setModes("seconds");
      timerId = setTimeout(tick, 1000);
    }
  };

  tick();
  return () => clearTimeout(timerId);
}, [showCountdown, session, router]);


 const handleRenew = async () => {
    try {
      await renewSession()
      setRemaining(null)
      setShowCountdown(false)
      setTimeout(() => setShowCountdown(true), 0)
    } catch (err) {
      authLogger.error("Header: renewSession failed", err)
      router.push("/ui/login")
    }
  }

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

          <Typography color="textPrimary" variant="h6" noWrap component="div">
            {title}
          </Typography>

          <Box display="flex" alignItems="center" gap={3}>
            {showCountdown && remaining !== null && remaining >= 0 && (
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
                  Your session will expire in {remaining}{" "}
                  {modes}
                </Typography>
                <Button variant="outlined" size="small" onClick={handleRenew}>
                  Renew
                </Button>
              </Box>
            )}
            <ApiUsageStatus />
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
