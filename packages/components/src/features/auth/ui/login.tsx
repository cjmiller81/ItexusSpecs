import { Stack } from "@mui/material";
import { LoginFlow, UpdateLoginFlowBody } from "@ory/client";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { Loader } from "../components/loader";
import { HandleError } from "../utils/hooks";
import { ory } from "../lib/sdk";
import { StyledAuthContainer } from "./StyledAuthContainer";
import ProtectedByOryLabel from "./protectedByOryLabel";
import { CustomLoginForm } from "./CustomLoginForm";
import { useFlowIdExpirationTimer } from "../../../hooks/useFlowIdExpirationTimer";

interface LoginProps { env: { termsUrl: string, appTermsUrl: string } }

export const Login: FC<LoginProps> = ({ env }) => {
  const [flow, setFlow] = useState<LoginFlow | null>(null);
  const router = useRouter();
  const returnTo = String(router.query.return_to || window.location.origin);
  const flowId = String(router.query.flow || "");

  // Refresh means we want to refresh the session. This is needed, for example, when we want to update the password
  // of a user.
  const refresh = Boolean(router.query.refresh);

  // AAL = Authorization Assurance Level. This implies that we want to upgrade the AAL, meaning that we want
  // to perform two-factor authentication/verification.
  const aal = String(router.query.aal || "");
  const isAal2 = router.query.aal2 === "true";  // front-end trigger for MFA step-up
  const aalParam = isAal2 ? "aal2" : aal;  // if front-end asks for aal2, override the param

  const isRefreshFlowIdNeeded = useFlowIdExpirationTimer(flow);


  const handleError = useCallback(
    (error: AxiosError) => {
      const handle = HandleError(getFlow, setFlow, "/ui/login", true);
      return handle(error);
    },
    []
  );

  // Create a new login flow, preserving aal2 if requested.
  const createFlow = useCallback(() => {
    return ory
      .createBrowserLoginFlow({
        refresh,
        aal: aalParam,
        returnTo,
      })
      .then(({ data }) => {
        // keep aal2 flag and return_to in URL so UI shows MFA prompt and preserves return URL
        const qs = [`flow=${data.id}`];
        if (isAal2) qs.push("aal2=true");
        if (refresh) qs.push("refresh=true");
        if (returnTo && returnTo !== window.location.origin) {
          qs.push(`return_to=${encodeURIComponent(returnTo)}`);
        }
        router.replace(`/ui/login?${qs.join("&")}`, undefined, { shallow: true });
      })
      .catch(err => {
        // fallback for older Kratos versions that don't support aal
        if (isAal2) {
          return ory
            .createBrowserLoginFlow({ refresh, returnTo })
            .then(({ data }) => {
              const qs = [`flow=${data.id}`];
              if (refresh) qs.push("refresh=true");
              if (returnTo && returnTo !== window.location.origin) {
                qs.push(`return_to=${encodeURIComponent(returnTo)}`);
              }
              router.replace(`/ui/login?${qs.join("&")}`, undefined, { shallow: true });
            });
        }
        throw err;
      });
  }, [refresh, aalParam, returnTo, isAal2, router]);

  const getFlow = useCallback(
    (id: string) =>
      ory
        .getLoginFlow({ id })
        .then(({ data }) => {
          setFlow(data);
        })
        .catch((error: AxiosError) => {
          if (error.response?.status === 410 || error.response?.status === 404) {
            createFlow();
          } else {
            handleError(error);
          }
        }),
    [createFlow, handleError],
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const queryString = typeof window !== "undefined" ? window.location.search : "";
    const searchParams = new URLSearchParams(queryString);
    const hasFlowId = searchParams.has("flow");

    ory.toSession().then(
      () => {
        if (returnTo && returnTo !== window.location.origin) {
          router.replace(returnTo);
        } else {
          router.replace("/");
        }
      },
      () => {
        if (hasFlowId && flowId) {
          getFlow(flowId).catch(_err => {
            createFlow();
          });
        }
      }
    );
  }, [router.isReady, flowId, returnTo]);

  useEffect(() => {
    const queryString = typeof window !== "undefined" ? window.location.search : "";
    const searchParams = new URLSearchParams(queryString);
    const hasFlowId = searchParams.has("flow");

    if (!router.isReady || hasFlowId) {
      return;
    }

    // Otherwise we initialize it
    ory.toSession().then(
      () => {
        // User is already authenticated, redirect to return_to or home
        if (returnTo && returnTo !== window.location.origin) {
          router.replace(returnTo);
        } else {
          router.replace("/");
        }
      },
      () => {
        if (!hasFlowId) {
          createFlow();
        }
      }
    )
  }, [router.isReady, returnTo]);

  const submitFlow = (values: UpdateLoginFlowBody) => {
    return ory
      .updateLoginFlow({
        flow: String(flow?.id),
        updateLoginFlowBody: values,
      })
      // We logged in successfully! Let's bring the user home.
      .then(() => {
        // Check for postRecoveryRedirect cookie first
        const match = document.cookie.split("; ")
         .find(row => row.startsWith("postRecoveryRedirect="));
 
        let redirect = match
         ? decodeURIComponent(match.split("=")[1])
         : "/";

        // If no recovery redirect, check for return_to parameter
        if (!match && returnTo && returnTo !== window.location.origin) {
          redirect = returnTo;
        }

        document.cookie = `postRecoveryRedirect=; path=/; max-age=0`;
        router.push(redirect);
      })
      .catch(c => {
        void handleError(c);
      })
  };

  if (!flow) return <Loader />;

  return (
    <StyledAuthContainer>
      <Stack alignItems="center" gap={1} className="log">
        {flow && (
          <CustomLoginForm
            flow={flow}
            isRefreshFlowIdNeeded={isRefreshFlowIdNeeded}
            onRefreshFlowId={createFlow}
            onSubmit={submitFlow}
          />
        )}
        <ProtectedByOryLabel env={env} />
      </Stack>
    </StyledAuthContainer>
  )
}

export default Login
