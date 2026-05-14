import { TextField, Button, Link, Box, Typography } from "@mui/material";
import { LoginFlow, UiText, UpdateLoginFlowBody } from "@ory/client";
import { isUiNodeInputAttributes, isUiNodeAnchorAttributes, getNodeId } from "@ory/integrations/ui";
import { FC, useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Turnstile from "react-turnstile";
import { useTranslation } from "react-i18next";

export interface CustomLoginFormProps {
  flow: LoginFlow;
  isRefreshFlowIdNeeded: boolean;
  onSubmit: (values: UpdateLoginFlowBody) => Promise<unknown> | void;
  onRefreshFlowId: () => void;
  /**
   * Optional subtitle shown under the "Sign In" heading.
   * Falls back to an empty string when omitted so we don't render a
   * placeholder like "_______________".
   */
  subtitle?: string;
}

export const CustomLoginForm: FC<CustomLoginFormProps> = ({
  flow,
  isRefreshFlowIdNeeded,
  onRefreshFlowId,
  onSubmit,
  subtitle = "",
}) => {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const [isBrowser, setIsBrowser] = useState(false);

  const { t } = useTranslation("ory");

  // Defensive: if upstream accidentally hands us a non-flow object (e.g. a
  // raw error body from a failed createBrowserLoginFlow call) we don't want
  // the whole app to unmount with a "Cannot read properties of undefined
  // (reading 'nodes')" crash. Render nothing and let the parent handle it.
  const nodes = flow?.ui?.nodes;
  const hasValidFlow = Array.isArray(nodes);

  useEffect(() => {
    // Ensure Turnstile is only rendered client-side
    setIsBrowser(typeof window !== "undefined");
  }, []);

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || process.env.TURNSTILE_SITE_KEY || "";
  const isTurnstileEnabled = Boolean(turnstileSiteKey);

  // Initialize values from flow
  useEffect(() => {
    if (!Array.isArray(flow?.ui?.nodes)) return;
    const initialValues: Record<string, string> = {};
    flow.ui.nodes.forEach(node => {
      if (isUiNodeInputAttributes(node.attributes)) {
        if (
          node.attributes.type !== "button" &&
          node.attributes.type !== "submit" &&
          node.attributes.type !== "hidden"
        ) {
          initialValues[node.attributes.name] = node.attributes.value || "";
        }
      }
    });
    setValues(prev => {
      // Only update if values changed to avoid unnecessary re-renders
      const hasChanges = Object.keys(initialValues).some(key => prev[key] !== initialValues[key]);
      return hasChanges ? initialValues : prev;
    });
  }, [flow]);

  // Every subsequent statement expects `flow.ui.nodes` to be a real array of
  // Ory UI nodes. If we got handed a malformed flow (e.g. an error body from
  // a failed `createBrowser*Flow`) bail out before dereferencing anything.
  // This must come after all hook calls above to comply with rules of hooks.
  if (!hasValidFlow) {
    return null;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    // Require Turnstile to pass before allowing submission, if enabled
    if (isTurnstileEnabled && !turnstileToken) {
      setTurnstileError("Please confirm you are not a bot to continue.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    // Convert FormDataEntryValue to string
    const formValues: Record<string, string> = {};
    formData.forEach((value, key) => {
      formValues[key] = typeof value === "string" ? value : value.toString();
    });

    const method = totpAttributes ? "totp" : "password";
    const body: Record<string, string> = {
      ...formValues,
      method: method,
    };

    // Type assertion needed because UpdateLoginFlowBody is a union type
    const loginBody = body as unknown as UpdateLoginFlowBody;

    const promise = onSubmit(loginBody);

    if (
      promise !== undefined &&
      typeof promise === "object" &&
      "then" in promise &&
      typeof promise.then === "function"
    ) {
      void (promise as Promise<unknown>).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  // Get nodes by type
  const _getNodesByType = (type: string) => {
    return flow.ui.nodes.filter(node => {
      if (isUiNodeInputAttributes(node.attributes)) {
        return node.attributes.type === type;
      }
      return false;
    });
  };

  // Get anchor nodes (links)
  const getAnchorNodes = () => {
    return flow.ui.nodes.filter(node => isUiNodeAnchorAttributes(node.attributes));
  };

  // Get hidden nodes (CSRF token, etc.)
  const getHiddenNodes = () => {
    return flow.ui.nodes.filter(node => {
      if (isUiNodeInputAttributes(node.attributes)) {
        return node.attributes.type === "hidden";
      }
      return false;
    });
  };

  // Get email input node (identifier is the field name in Ory)
  const emailNode = flow.ui.nodes.find(node => {
    if (isUiNodeInputAttributes(node.attributes)) {
      return node.attributes.name === "identifier";
    }
    return false;
  });

  // Get password input node
  const passwordNode = flow.ui.nodes.find(node => {
    if (isUiNodeInputAttributes(node.attributes)) {
      return node.attributes.name === "password";
    }
    return false;
  });

  const totpNode = flow.ui.nodes.find(node => {
    if (isUiNodeInputAttributes(node.attributes)) {
      return node.attributes.name === "totp_code";
    }
    return false;
  });

  // Get submit button node
  const submitNode = flow.ui.nodes.find(node => {
    if (isUiNodeInputAttributes(node.attributes)) {
      return node.attributes.type === "submit";
    }
    return false;
  });

  // Get recovery link
  const recoveryLink = getAnchorNodes().find(node => {
    if (isUiNodeAnchorAttributes(node.attributes)) {
      return node.attributes.href?.includes("/ui/recovery");
    }
    return false;
  });

  // Get signup link
  const signupLink = getAnchorNodes().find(node => {
    if (isUiNodeAnchorAttributes(node.attributes)) {
      return node.attributes.href?.includes("/ui/registration");
    }
    return false;
  });

  const emailAttributes = emailNode && isUiNodeInputAttributes(emailNode.attributes) ? emailNode.attributes : null;
  const passwordAttributes =
    passwordNode && isUiNodeInputAttributes(passwordNode.attributes) ? passwordNode.attributes : null;
  const totpAttributes = totpNode && isUiNodeInputAttributes(totpNode.attributes) ? totpNode.attributes : null;
  const _submitAttributes = submitNode && isUiNodeInputAttributes(submitNode.attributes) ? submitNode.attributes : null;
  const recoveryAttributes =
    recoveryLink && isUiNodeAnchorAttributes(recoveryLink.attributes) ? recoveryLink.attributes : null;
  const _signupAttributes =
    signupLink && isUiNodeAnchorAttributes(signupLink.attributes) ? signupLink.attributes : null;

  const logoUrl = process.env.NEXT_PUBLIC_ORY_CARD_IMAGE_URL || "/ElanInsightsLight.png";

  const globalMessages = (flow.ui.messages ?? [])
    .map(m => ("text" in m && typeof m.text === "string" ? m.text : undefined))
    .filter((m): m is string => Boolean(m));

  return (
    <Box
      sx={{
        backgroundColor: "#2B2B2B",
        borderRadius: "1rem",
        padding: "48px",
        minWidth: "400px",
        borderWidth: "2px",
        borderColor: "white",
        borderStyle: "solid",
        color: "#ffffff",
      }}>
      <form
        action={flow.ui.action}
        method={flow.ui.method}
        onSubmit={handleSubmit}>
        {getHiddenNodes().map(node => {
          if (isUiNodeInputAttributes(node.attributes)) {
            return (
              <input
                key={getNodeId(node)}
                type="hidden"
                name={node.attributes.name}
                value={node.attributes.value || ""}
              />
            );
          }
          return null;
        })}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}>
          <img
            src={logoUrl}
            alt="ECHO"
            style={{
              maxWidth: "175px",
              height: "auto",
            }}
          />
        </Box>

        <Box
          sx={{
            textAlign: "center",
            marginBottom: "0.5rem",
          }}>
          <h1
            style={{
              color: "#ffffff",
              margin: 0,
              fontSize: "1.2rem",
              fontWeight: 400,
            }}>
            Sign In
          </h1>
        </Box>

        {subtitle ? (
          <Box
            sx={{
              textAlign: "center",
              marginBottom: "2rem",
            }}>
            <p
              style={{
                color: "#ffffff",
                margin: 0,
                fontWeight: 800,
                fontSize: "0.875rem",
              }}>
              {subtitle}
            </p>
          </Box>
        ) : (
          <Box sx={{ marginBottom: "1.5rem" }} />
        )}

        {!isRefreshFlowIdNeeded && (
          <>
            {globalMessages.length > 0 && (
              <Box sx={{ mb: 2 }}>
                {globalMessages.map((msg, idx) => (
                  <Typography
                    key={idx}
                    sx={{
                      color: "#f97373",
                      fontSize: "0.8rem",
                      lineHeight: 1.4,
                      maxWidth: 300,
                      margin: "0 auto",
                      wordBreak: "break-word",
                    }}>
                    {msg}
                  </Typography>
                ))}
              </Box>
            )}

            {emailAttributes && (
              <Box sx={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor={emailAttributes.name}
                  style={{
                    display: "block",
                    color: "#ffffff",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}>
                  E-Mail *
                </label>
                <TextField
                  id={emailAttributes.name}
                  name={emailAttributes.name}
                  type={emailAttributes.type || "email"}
                  value={values[emailAttributes.name] || ""}
                  onChange={e => handleChange(emailAttributes.name, e.target.value)}
                  disabled={emailAttributes.disabled || isLoading}
                  required={emailAttributes.required}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: values[emailAttributes.name] ? "#E3F2FD" : "#ffffff",
                      borderRadius: "4px",
                      "& fieldset": {
                        borderColor: values[emailAttributes.name] ? "#4CAF50" : "#d0d0d0",
                        borderWidth: values[emailAttributes.name] ? "2px" : "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: values[emailAttributes.name] ? "#4CAF50" : "#d0d0d0",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: values[emailAttributes.name] ? "#4CAF50" : "#0D73C7",
                        borderWidth: values[emailAttributes.name] ? "2px" : "2px",
                      },
                      "& input": {
                        color: "#000000",
                        padding: "0.75rem",
                      },
                    },
                  }}
                />
              </Box>
            )}

            {passwordAttributes && (
              <Box sx={{ marginBottom: "1rem" }}>
                <label
                  htmlFor={passwordAttributes.name}
                  style={{
                    display: "block",
                    color: "#ffffff",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}>
                  Password *
                </label>
                <Box sx={{ position: "relative" }}>
                  <TextField
                    id={passwordAttributes.name}
                    name={passwordAttributes.name}
                    type={showPassword ? "text" : "password"}
                    value={values[passwordAttributes.name] || ""}
                    onChange={e => handleChange(passwordAttributes.name, e.target.value)}
                    disabled={passwordAttributes.disabled || isLoading}
                    required={passwordAttributes.required}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: values[passwordAttributes.name] ? "#E3F2FD" : "#ffffff",
                        borderRadius: "4px",
                        paddingRight: "3rem",
                        "& fieldset": {
                          borderColor: values[passwordAttributes.name] ? "#4CAF50" : "#d0d0d0",
                          borderWidth: values[passwordAttributes.name] ? "2px" : "1px",
                        },
                        "&:hover fieldset": {
                          borderColor: values[passwordAttributes.name] ? "#4CAF50" : "#d0d0d0",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: values[passwordAttributes.name] ? "#4CAF50" : "#0D73C7",
                          borderWidth: values[passwordAttributes.name] ? "2px" : "2px",
                        },
                        "& input": {
                          color: "#000000",
                          padding: "0.75rem",
                        },
                      },
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      minWidth: "auto",
                      padding: "0.25rem",
                      color: "#000000",
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    }}>
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </Button>
                </Box>
              </Box>
            )}

            {!totpAttributes && (
              <Box sx={{ marginBottom: "1.5rem" }}>
                <Link
                  href={recoveryAttributes?.href || "/ui/recovery"}
                  onClick={e => {
                    e.preventDefault();
                    const recoveryUrl = recoveryAttributes?.href || "/ui/recovery";
                    router.push(recoveryUrl);
                  }}
                  sx={{
                    color: "#0D73C7",
                    textDecoration: "underline",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                  }}>
                  Forgot password?
                </Link>
              </Box>
            )}

            {totpAttributes && (
              <Box sx={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor={totpAttributes.name}
                  style={{
                    display: "block",
                    color: "#ffffff",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}>
                  Authenticator Code *
                </label>
                <TextField
                  id={totpAttributes.name}
                  name={totpAttributes.name}
                  type={totpAttributes.type || "text"}
                  value={values[totpAttributes.name] || ""}
                  onChange={e => handleChange(totpAttributes.name, e.target.value)}
                  disabled={totpAttributes.disabled || isLoading}
                  required={totpAttributes.required}
                  fullWidth
                  autoComplete="one-time-code"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    maxLength: 6,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: values[totpAttributes.name] ? "#E3F2FD" : "#ffffff",
                      borderRadius: "4px",
                      "& fieldset": {
                        borderColor: values[totpAttributes.name] ? "#4CAF50" : "#d0d0d0",
                        borderWidth: values[totpAttributes.name] ? "2px" : "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: values[totpAttributes.name] ? "#4CAF50" : "#d0d0d0",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: values[totpAttributes.name] ? "#4CAF50" : "#0D73C7",
                        borderWidth: values[totpAttributes.name] ? "2px" : "2px",
                      },
                      "& input": {
                        color: "#000000",
                        padding: "0.75rem",
                        textAlign: "center",
                        fontSize: "1.5rem",
                        letterSpacing: "0.5rem",
                      },
                    },
                  }}
                />
              </Box>
            )}

            <input
              type="hidden"
              name="method"
              value={totpAttributes ? "totp" : "password"}
            />

            {isTurnstileEnabled && isBrowser && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                }}>
                <Turnstile
                  sitekey={turnstileSiteKey}
                  onVerify={token => {
                    setTurnstileToken(token);
                    setTurnstileError(null);
                  }}
                  onExpire={() => {
                    setTurnstileToken(null);
                  }}
                  onError={() => {
                    setTurnstileToken(null);
                    setTurnstileError("Verification failed. Please try again.");
                  }}
                />
              </Box>
            )}

            {isTurnstileEnabled && turnstileError && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#f97373",
                    fontSize: "0.8rem",
                    lineHeight: 1.4,
                    maxWidth: 300,
                    margin: "0 auto",
                    wordBreak: "break-word",
                  }}>
                  {turnstileError}
                </Typography>
              </Box>
            )}

            <Button
              type="submit"
              disabled={isLoading || (isTurnstileEnabled && !turnstileToken)}
              fullWidth
              sx={{
                backgroundColor: "#0D73C7",
                color: "#ffffff",
                fontWeight: 600,
                borderRadius: "4px",
                height: "50px",
                fontSize: "1rem",
                textTransform: "none",
                marginBottom: "1rem",
                "&:hover": {
                  backgroundColor: "#0a5a9e",
                },
                "&:disabled": {
                  opacity: 0.6,
                },
              }}>
              {"Sign in with password"}
            </Button>
          </>
        )}

        {isRefreshFlowIdNeeded && (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  color: "#f97373",
                  fontSize: "0.8rem",
                  lineHeight: 1.4,
                  maxWidth: 300,
                  margin: "0 auto",
                  wordBreak: "break-word",
                }}>
                {t("expiredForm.text.loginFormExpired")}
              </Typography>
            </Box>

            <Button
              fullWidth
              sx={{
                backgroundColor: "#0D73C7",
                color: "#ffffff",
                fontWeight: 600,
                borderRadius: "4px",
                height: "50px",
                fontSize: "1rem",
                textTransform: "none",
                marginBottom: "1rem",
                "&:hover": {
                  backgroundColor: "#0a5a9e",
                },
                "&:disabled": {
                  opacity: 0.6,
                },
              }}
              onClick={onRefreshFlowId}>
              {t("expiredForm.button.refresh")}
            </Button>
          </>
        )}

        <Box sx={{ textAlign: "center" }}>
          <span style={{ color: "#ffffff", fontSize: "0.875rem" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/ui/registration"
              onClick={e => {
                e.preventDefault();
                router.push("/ui/registration");
              }}
              sx={{
                color: "#0D73C7",
                textDecoration: "underline",
                fontSize: "0.875rem",
                cursor: "pointer",
              }}>
              Sign up
            </Link>
          </span>
        </Box>
      </form>
    </Box>
  );
};
