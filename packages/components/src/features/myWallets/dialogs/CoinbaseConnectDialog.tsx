import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button, Typography, TextField, CircularProgress, Box } from "@mui/material";
import axios from "axios";

interface CoinbaseConnectDialogProps {
  open: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export const CoinbaseConnectDialog: React.FC<CoinbaseConnectDialogProps> = ({ open, onClose, onConnect }) => {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const at = params.get("access_token") || "";
      const rt = params.get("refresh_token") || "";
      setAccessToken(at);
      setRefreshToken(rt);
      setPortfolio(null);
      setError("");
    }
  }, [open]);

  const handleRequestPortfolio = async () => {
    setLoading(true);
    setError("");
    setPortfolio(null);
    try {
      // 1. Exchange refresh_token for new access_token
      const client_id = "YOUR_CLIENT_ID";
      const client_secret = "YOUR_CLIENT_SECRET";
      const tokenUrl = "https://api.coinbase.com/oauth/token";
      const params = new URLSearchParams();
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", refreshToken);
      params.append("client_id", client_id);
      params.append("client_secret", client_secret);
      const tokenResp = await axios.post(tokenUrl, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const newAccessToken = tokenResp.data.access_token;
      setAccessToken(newAccessToken);
      // 2. Call Coinbase portfolio API
      const portfolioResp = await axios.get("https://api.coinbase.com/api/v3/brokerage/accounts", {
        headers: { Authorization: `Bearer ${newAccessToken}` },
      });
      setPortfolio(portfolioResp.data);
    } catch (e: any) {
      setError(e?.response?.data?.error_description || e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Connect Coinbase Exchange</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          To connect your Coinbase account, please use the OAuth 2.0 flow. You will be redirected to Coinbase to authorize access.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, mb: 1 }}
          onClick={() => {
            if (!loading) onConnect();
          }}
          disabled={loading}
        >
          Connect Coinbase
        </Button>
        {accessToken && refreshToken && (
          <form autoComplete="on">
            <TextField
              label="Access Token"
              value={accessToken}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              autoComplete="off"
            />
            <TextField
              label="Refresh Token"
              value={refreshToken}
              fullWidth
              margin="normal"
              type="password"
              autoComplete="new-password"
              InputProps={{ readOnly: true }}
            />
            <Typography variant="caption" color="textSecondary">
              Save your refresh token securely. Your browser may prompt you to save this as a password.
            </Typography>
            <Box sx={{ mt: 2, mb: 1 }}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleRequestPortfolio}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : "Request Account Portfolio"}
              </Button>
            </Box>
          </form>
        )}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
        )}
        {portfolio && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Portfolio Response:</Typography>
            <pre style={{ fontSize: 12, whiteSpace: "pre-wrap" }}>{JSON.stringify(portfolio, null, 2)}</pre>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
