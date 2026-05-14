import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import { AxiosError } from "axios"
import type { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import { ory } from "../lib/sdk"
import { ActionCard, CenterLink } from "../styled/index"
import { Flow, Methods } from "./Flow"
import { Messages } from "./Messages"
import { authLogger } from "../../../utils/authLogger"

interface Props {
  flow?: SettingsFlow
  only?: Methods
}

function SettingsCard({ flow, only, children }: Props & { children: ReactNode }) {
  if (!flow) {
    return null
  }

  const nodes = only ? flow.ui.nodes.filter(({ group }) => group === only) : flow.ui.nodes

  if (nodes.length === 0) {
    return null
  }

  return <ActionCard>{children}</ActionCard>
}

const Settings: NextPage = () => {
  const [flow, setFlow] = useState<SettingsFlow>()

  // Get ?flow=... from the URL
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it.
    if (flowId) {
      ory
        .getSettingsFlow({ id: String(flowId) })
        .then(({ data }) => setFlow(data))
        .catch((err: AxiosError) => {
          authLogger.error("getSettingsFlow failed", err)
        })
      return
    }

    // Otherwise we initialize a new flow.
    ory
      .createBrowserSettingsFlow({
        returnTo: String(returnTo || ""),
      })
      .then(({ data }) => setFlow(data))
      .catch((err: AxiosError) => {
        authLogger.error("createBrowserSettingsFlow failed", err)
      })
  }, [flowId, router, router.isReady, returnTo, flow])

  const onSubmit = async (values: UpdateSettingsFlowBody) => {
    try {
      // On submission, add the flow ID to the URL but do not navigate. This
      // prevents the user losing data if they reload the page.
      await router.push(`/ui/settings?flow=${flow?.id}`, undefined, {
        shallow: true,
      })

      const { data } = await ory.updateSettingsFlow({
        flow: String(flow?.id),
        updateSettingsFlowBody: values,
      })

      // The settings have been saved and the flow was updated. Let's show it
      // to the user.
      setFlow(data)

      // `continue_with` is a list of actions the user might need to take
      // before the settings update is complete (e.g. email verification).
      if (data.continue_with) {
        for (const item of data.continue_with) {
          if (item.action === "show_verification_ui") {
            router.push(`/ui/verification?flow=${item.flow.id}`)
            return
          }
        }
      }

      if (data.return_to) {
        window.location.href = data.return_to
        return
      }
    } catch (err) {
      const axiosErr = err as AxiosError<SettingsFlow>
      // 400 usually means form validation error — Ory returns the updated
      // flow in the body so we just re-render it.
      if (axiosErr.response?.status === 400 && axiosErr.response.data) {
        setFlow(axiosErr.response.data)
        return
      }
      authLogger.error("updateSettingsFlow failed", err)
    }
  }

  return (
    <>
      <SettingsCard
        only="profile"
        flow={flow}>
        <h4>Profile Settings</h4>
        <Messages messages={flow?.ui.messages} />
        <Flow
          hideGlobalMessages
          onSubmit={onSubmit}
          only="profile"
          flow={flow}
        />
      </SettingsCard>
      <SettingsCard
        only="password"
        flow={flow}>
        <h4>Change Password</h4>

        <Messages messages={flow?.ui.messages} />
        <Flow
          hideGlobalMessages
          onSubmit={onSubmit}
          only="password"
          flow={flow}
        />
      </SettingsCard>
      <SettingsCard
        only="oidc"
        flow={flow}>
        <h4>Manage Social Sign In</h4>

        <Messages messages={flow?.ui.messages} />
        <Flow
          hideGlobalMessages
          onSubmit={onSubmit}
          only="oidc"
          flow={flow}
        />
      </SettingsCard>
      <SettingsCard
        only="lookup_secret"
        flow={flow}>
        <h4>Manage 2FA Backup Recovery Codes</h4>
        <Messages messages={flow?.ui.messages} />
        <p>Recovery codes can be used in panic situations where you have lost access to your 2FA device.</p>

        <Flow
          hideGlobalMessages
          onSubmit={onSubmit}
          only="lookup_secret"
          flow={flow}
        />
      </SettingsCard>
      <SettingsCard
        only="totp"
        flow={flow}>
        <h3>Manage Two Factor Authentication - Use Authenticator App</h3>
        <p>
          Add a TOTP Authenticator App to your account to improve your account security. Popular Authenticator Apps are{" "}
          <a
            href="https://www.lastpass.com"
            rel="noreferrer"
            target="_blank">
            LastPass
          </a>{" "}
          and Google Authenticator (
          <a
            href="https://apps.apple.com/us/app/google-authenticator/id388497605"
            target="_blank"
            rel="noreferrer">
            iOS
          </a>
          ,{" "}
          <a
            href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
            target="_blank"
            rel="noreferrer">
            Android
          </a>
          ).
        </p>
        <Messages messages={flow?.ui.messages} />
        <Flow
          hideGlobalMessages
          onSubmit={onSubmit}
          only="totp"
          flow={flow}
        />
      </SettingsCard>
      <SettingsCard
        only="webauthn"
        flow={flow}>
        <h3>Manage Hardware Tokens and Biometrics</h3>
        <Messages messages={flow?.ui.messages} />
        <p>Use Hardware Tokens (e.g. YubiKey) or Biometrics (e.g. FaceID, TouchID) to enhance your account security.</p>
        <Flow
          hideGlobalMessages
          onSubmit={onSubmit}
          only="webauthn"
          flow={flow}
        />
      </SettingsCard>
      <SettingsCard
        only="passkey"
        flow={flow}>
        <h4>Manage Passkeys</h4>
        <Messages messages={flow?.ui.messages} />
        <Flow
          hideGlobalMessages
          onSubmit={onSubmit}
          only="passkey"
          flow={flow}
        />
      </SettingsCard>
      <ActionCard>
        <Link
          href="/"
          passHref>
          <CenterLink>Go back</CenterLink>
        </Link>
      </ActionCard>
    </>
  )
}

export default Settings
