import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

/**
 * This page handles the OAuth 2.0 callback from Coinbase.
 * It exchanges the code for access_token and refresh_token, then redirects to the wallets page with tokens in state.
 */

export default function CoinbaseOAuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    async function exchangeCode() {
      try {
        // Replace with your real client_id, client_secret, and redirect_uri
        const client_id = "YOUR_CLIENT_ID";
        const client_secret = "YOUR_CLIENT_SECRET";
        const redirect_uri = "YOUR_REDIRECT_URI";
        const tokenUrl = "https://api.coinbase.com/oauth/token";
        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("code", code ?? "");
        params.append("client_id", client_id);
        params.append("client_secret", client_secret);
        params.append("redirect_uri", redirect_uri);
        const response = await axios.post(tokenUrl, params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        const { access_token, refresh_token } = response.data;
        // Redirect to wallets page with tokens in state (or use a global store)
        router.push("/myWallets/centralized?access_token=" + encodeURIComponent(access_token) + "&refresh_token=" + encodeURIComponent(refresh_token));
      } catch (e) {
        // Handle error (show error UI or redirect)
        router.push("/myWallets/centralized?oauth_error=1");
      }
    }
    exchangeCode();
  }, [searchParams, router]);

  return <div>Finishing Coinbase authentication...</div>;
}
