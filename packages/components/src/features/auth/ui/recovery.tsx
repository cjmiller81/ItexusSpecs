import { RecoveryFlow, UiNodeInputAttributes, UpdateRecoveryFlowBody } from "@ory/client";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Loader } from "../components/loader";
import { ory } from "../lib/sdk";
import { HandleError } from "../utils/hooks";
import { StyledAuthContainer } from "./StyledAuthContainer";
import { Stack } from "@mui/material";
import { CustomRecoveryForm } from "./CustomRecoveryForm";
import ProtectedByOryLabel from "./protectedByOryLabel";
import { useFlowIdExpirationTimer } from "../../../hooks/useFlowIdExpirationTimer";
import { authLogger } from "../../../utils/authLogger";

export interface RecoveryProps {
  changePasswordRoute: string;
  env: {
    termsUrl: string;
    appTermsUrl: string;
  };
}

interface OryErrorWithRedirectDetails {
  error?: {
    details?: {
      redirect_to?: string;
    };
  };
}
const extractCsrfToken = (flow: RecoveryFlow): string | undefined => {
  const csrfNode = flow.ui.nodes.find(node => {
    if (node.attributes && typeof node.attributes === "object" && "name" in node.attributes) {
      return node.attributes.name === "csrf_token";
    }
    return false;
  });
  if (csrfNode && typeof csrfNode.attributes === "object" && "value" in csrfNode.attributes) {
    return (csrfNode.attributes as UiNodeInputAttributes).value as string | undefined;
  }
  return undefined;
};

export const Recovery: FC<RecoveryProps> = ({ changePasswordRoute, env }) => {
  const [flow, setFlow] = useState<RecoveryFlow | null>();

  const router = useRouter();
  const flowId = String(router.query.flow || "");

  const isRefreshFlowIdNeeded = useFlowIdExpirationTimer(flow);

  useEffect(() => {
    if (isRefreshFlowIdNeeded) {
      router.push("/ui/login/");
    }
  }, [isRefreshFlowIdNeeded, router]);

  // Ref pattern breaks the handleError ↔ getFlow cycle and keeps
  // handleError's identity stable.
  const getFlowRef = useRef<(id: string) => Promise<void>>();

  const handleError = useCallback((error: AxiosError) => {
    // 410 with a `redirect_to` typically points to an Ory-hosted URL (e.g.
    // the recovery completion endpoint). Keep it, but send the user through
    // our own origin by attaching `return_to`.
    if (error.response?.status === 410) {
      const data = error.response.data as OryErrorWithRedirectDetails;
      const redirectTo = data?.error?.details?.redirect_to;
      if (redirectTo) {
        try {
          const redirectUrl = new URL(redirectTo);
          redirectUrl.searchParams.set("return_to", window.location.origin);
          window.location.replace(redirectUrl.toString());
          return;
        } catch (urlErr) {
          authLogger.error("recovery: invalid redirect_to", urlErr);
        }
      }
    }

    const forward = HandleError(
      id => (getFlowRef.current ? getFlowRef.current(id) : Promise.resolve()),
      setFlow,
      "/ui/registration",
      true,
    );
    return forward(error);
  }, []);

  const getFlow = useCallback(
    (id: string) =>
      ory
        .getRecoveryFlow({ id })
        .then(({ data }) => setFlow(data))
        .catch(err => {
          void handleError(err as AxiosError);
        }),
    [handleError],
  );

  useEffect(() => {
    getFlowRef.current = getFlow;
  }, [getFlow]);

  const createFlow = useCallback(
    () =>
      ory
        .createBrowserRecoveryFlow()
        .then(({ data }) => {
          setFlow(data);
          router.replace(`/ui/recovery?flow=${data.id}`);
        })
        .catch(err => {
          authLogger.error("createBrowserRecoveryFlow failed", err);
          void handleError(err as AxiosError);
        }),
    [handleError, router],
  );

  const handleResend = async (email: string) => {
    try {
      const { data: newFlow } = await ory.createBrowserRecoveryFlow();
      setFlow(newFlow);
      router.replace(`/ui/recovery?flow=${newFlow.id}`);

      const csrfToken = extractCsrfToken(newFlow);
      const submitValues: UpdateRecoveryFlowBody = {
        email,
        method: "code",
        ...(csrfToken && { csrf_token: csrfToken }),
      } as UpdateRecoveryFlowBody;

      const { data } = await ory.updateRecoveryFlow({
        flow: String(newFlow.id),
        updateRecoveryFlowBody: submitValues,
      });
      if (data.state === "sent_email") {
        setFlow(data);
        router.replace(`/ui/recovery?flow=${data.id}`);
      }
    } catch (err) {
      authLogger.error("recovery resend failed", err);
      void handleError(err as AxiosError);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // init
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!router.isReady) return;
    if (flowId) {
      getFlow(flowId).catch(() => createFlow());
      return;
    }
    createFlow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  // ──────────────────────────────────────────────────────────────────────────
  // submit handler — Kratos ≥ 0.11 (the minimum supported by @ory/client ^1.x)
  // returns 200 OK with a `state` field on the flow. Older servers that
  // returned 422 + `redirect_browser_to` are no longer supported.
  // ──────────────────────────────────────────────────────────────────────────
  const submitFlow = async (values: UpdateRecoveryFlowBody) => {
    try {
      const { data } = await ory.updateRecoveryFlow({
        flow: String(flow?.id),
        updateRecoveryFlowBody: values,
      });

      if (data.state === "sent_email") {
        // Stay on the page, ask for the recovery code.
        setFlow(data);
        return;
      }

      if (data.state === "passed_challenge") {
        document.cookie = `postRecoveryRedirect=${encodeURIComponent(changePasswordRoute)}; path=/;`;
        window.location.replace(changePasswordRoute);
        return;
      }

      // Fallback: update the local flow so we can show error messages etc.
      setFlow(data);
      document.cookie = `postRecoveryRedirect=${encodeURIComponent(changePasswordRoute)}; path=/;`;
    } catch (err) {
      void handleError(err as AxiosError);
    }
  };

  if (!flow) return <Loader />;

  return (
    <StyledAuthContainer>
      <Stack
        alignItems="center"
        gap={1}
        className="log">
        {flow && (
          <CustomRecoveryForm
            flow={flow}
            onSubmit={submitFlow}
            onResend={handleResend}
          />
        )}
        <ProtectedByOryLabel env={env} />
      </Stack>
    </StyledAuthContainer>
  );
};

export default Recovery;
