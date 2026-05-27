import { UpdateVerificationFlowBody, VerificationFlow } from "@ory/client";
import { AxiosError } from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ory } from "../lib/sdk";
import { ActionCard, CenterLink, MarginCard } from "../styled";
import { Flow } from "./Flow";
import { authLogger } from "../../../utils/authLogger";

const Verification: NextPage = () => {
  const [flow, setFlow] = useState<VerificationFlow>();

  // Get ?flow=... from the URL
  const router = useRouter();
  const { flow: flowId, return_to: returnTo } = router.query;

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return;
    }

    // If ?flow=.. was in the URL, we fetch it.
    if (flowId) {
      ory
        .getVerificationFlow({ id: String(flowId) })
        .then(({ data }) => setFlow(data))
        .catch((err: AxiosError) => {
          switch (err.response?.status) {
            case 410: // flow expired — falls through to reload
            // falls through
            case 403:
              // 403 — typically a CSRF issue. Reload.
              router.push("/ui/verification");
              return;
          }
          authLogger.error("getVerificationFlow failed", err);
        });
      return;
    }

    // Otherwise initialize a new flow.
    ory
      .createBrowserVerificationFlow({
        returnTo: returnTo ? String(returnTo) : undefined,
      })
      .then(({ data }) => setFlow(data))
      .catch((err: AxiosError) => {
        if (err.response?.status === 400) {
          // Already signed in — send them home.
          router.push("/");
          return;
        }
        authLogger.error("createBrowserVerificationFlow failed", err);
      });
  }, [flowId, router, router.isReady, returnTo, flow]);

  const onSubmit = async (values: UpdateVerificationFlowBody) => {
    try {
      // Add the flow ID to the URL (shallow) so reloading doesn't lose data.
      await router.push(`/ui/verification?flow=${flow?.id}`, undefined, {
        shallow: true,
      });

      const { data } = await ory.updateVerificationFlow({
        flow: String(flow?.id),
        updateVerificationFlowBody: values,
      });
      setFlow(data);
    } catch (err) {
      const axiosErr = err as AxiosError<VerificationFlow & { use_flow_id?: string }>;
      const status = axiosErr.response?.status;

      if (status === 400 && axiosErr.response?.data) {
        // Form validation error — Ory returns the updated flow in the body.
        setFlow(axiosErr.response.data);
        return;
      }

      if (status === 410 && axiosErr.response?.data?.use_flow_id) {
        const newFlowID = axiosErr.response.data.use_flow_id;
        await router.push(`/ui/verification?flow=${newFlowID}`, undefined, {
          shallow: true,
        });
        try {
          const { data } = await ory.getVerificationFlow({ id: newFlowID });
          setFlow(data);
        } catch (refreshErr) {
          authLogger.error("getVerificationFlow (refresh) failed", refreshErr);
        }
        return;
      }

      authLogger.error("updateVerificationFlow failed", err);
    }
  };

  return (
    <>
      <Head>
        <title>Verify your account - Ory NextJS Integration Example</title>
        <meta
          name="description"
          content="NextJS + React + Vercel + Ory"
        />
      </Head>
      <MarginCard>
        <h6>Verify your account</h6>
        <Flow
          onSubmit={onSubmit}
          flow={flow}
        />
      </MarginCard>
      <ActionCard>
        <Link
          href="/"
          passHref
          legacyBehavior>
          <CenterLink>Go back</CenterLink>
        </Link>
      </ActionCard>
    </>
  );
};

export default Verification;
