import { LoginFlow, RecoveryFlow } from "@ory/client";
import { useEffect, useState } from "react";

const ONE_MINUTE_GAP_BEFORE_EXPIRATION_IN_MS = 60000;

export const useFlowIdExpirationTimer = (flow: LoginFlow | RecoveryFlow | null | undefined) => {
  const [isRefreshFlowIdNeeded, setIsRefreshFlowIdNeeded] = useState(false);

  useEffect(() => {
    if (!flow) return;
    const expirationAt = Date.parse(flow.expires_at);
    const currentTime = Date.now();
    const aliveIdInMilliseconds = expirationAt - currentTime;
    const timeBeforeNextActionInMs = aliveIdInMilliseconds - ONE_MINUTE_GAP_BEFORE_EXPIRATION_IN_MS;

    const timerId = setTimeout(() => {
      setIsRefreshFlowIdNeeded(true);
    }, Math.max(timeBeforeNextActionInMs, 0));

    return () => {
      clearTimeout(timerId);
      setIsRefreshFlowIdNeeded(false);
    }
  }, [flow]);

  return isRefreshFlowIdNeeded;
};
