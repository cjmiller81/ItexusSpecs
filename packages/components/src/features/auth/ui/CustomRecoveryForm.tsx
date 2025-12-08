import { TextField, Button, Link, Box, Alert } from "@mui/material"
import { RecoveryFlow, UiNodeInputAttributes, UiNodeAnchorAttributes, UpdateRecoveryFlowBody } from "@ory/client"
import { 
  isUiNodeInputAttributes, 
  isUiNodeAnchorAttributes,
  getNodeId,
} from "@ory/integrations/ui"
import { FC, useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/router"

interface CustomRecoveryFormProps {
  flow: RecoveryFlow
  onSubmit: (values: UpdateRecoveryFlowBody) => void
}

export const CustomRecoveryForm: FC<CustomRecoveryFormProps> = ({ flow, onSubmit }) => {
  const router = useRouter()
  const [values, setValues] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Initialize values from flow
  useEffect(() => {
    const initialValues: Record<string, string> = {}
    flow.ui.nodes.forEach((node) => {
      if (isUiNodeInputAttributes(node.attributes)) {
        if (node.attributes.type !== "button" && node.attributes.type !== "submit" && node.attributes.type !== "hidden") {
          initialValues[node.attributes.name] = node.attributes.value || ""
        }
      }
    })
    setValues(prev => {
      // Only update if values changed to avoid unnecessary re-renders
      const hasChanges = Object.keys(initialValues).some(
        key => prev[key] !== initialValues[key]
      )
      return hasChanges ? initialValues : prev
    })
    setIsLoading(false)
  }, [flow])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return

    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    
    // Convert FormDataEntryValue to string
    const formValues: Record<string, string> = {}
    formData.forEach((value, key) => {
      formValues[key] = typeof value === 'string' ? value : value.toString()
    })

    let method = formValues.method
    if (!method) {
      if (flow.state === "sent_email") {
        method = "code"
      } else {
        method = "code"
      }
    }

    const body: Record<string, string> = {
      ...formValues,
      method: method,
    }

    // Type assertion needed because UpdateRecoveryFlowBody is a union type
    const recoveryBody = body as unknown as UpdateRecoveryFlowBody

    try {
      onSubmit(recoveryBody)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  // Get hidden nodes (CSRF token, etc.)
  const getHiddenNodes = () => {
    return flow.ui.nodes.filter(node => {
      if (isUiNodeInputAttributes(node.attributes)) {
        return node.attributes.type === "hidden"
      }
      return false
    })
  }

  // Get email input node
  const emailNode = flow.ui.nodes.find(node => {
    if (isUiNodeInputAttributes(node.attributes)) {
      return node.attributes.name === "email" || node.attributes.name === "identifier"
    }
    return false
  })

  const codeNode = flow.ui.nodes.find(node => {
    if (isUiNodeInputAttributes(node.attributes)) {
      return node.attributes.name === "code"
    }
    return false
  })

  // Get submit button node
  const submitNode = flow.ui.nodes.find(node => {
    if (isUiNodeInputAttributes(node.attributes)) {
      return node.attributes.type === "submit"
    }
    return false
  })

  // Get login link
  const loginLink = flow.ui.nodes.find(node => {
    if (isUiNodeAnchorAttributes(node.attributes)) {
      return node.attributes.href?.includes("/ui/login")
    }
    return false
  })

  const emailAttributes = emailNode && isUiNodeInputAttributes(emailNode.attributes) 
    ? emailNode.attributes 
    : null
  const codeAttributes = codeNode && isUiNodeInputAttributes(codeNode.attributes)
    ? codeNode.attributes
    : null
  const submitAttributes = submitNode && isUiNodeInputAttributes(submitNode.attributes)
    ? submitNode.attributes
    : null
  const loginAttributes = loginLink && isUiNodeAnchorAttributes(loginLink.attributes)
    ? loginLink.attributes
    : null

  const isCodeStage = flow.state === "sent_email" || codeAttributes !== null
  const showEmailField = !isCodeStage && emailAttributes !== null
  const showCodeField = isCodeStage && codeAttributes !== null

  const logoUrl = process.env.NEXT_PUBLIC_ORY_CARD_IMAGE_URL || "/ElanInsightsLight.png"

  return (
    <Box
      sx={{
        backgroundColor: '#2B2B2B',
        borderRadius: '1rem',
        padding: '48px',
        minWidth: '400px',
        maxWidth: '400px',
        width: '100%',
        borderWidth: '2px',
        borderColor: 'white',
        borderStyle: 'solid',
        color: '#ffffff',
      }}
    >
      <form action={flow.ui.action} method={flow.ui.method} onSubmit={handleSubmit}>
        {/* Hidden fields (CSRF token, etc.) */}
        {getHiddenNodes().map((node) => {
          if (isUiNodeInputAttributes(node.attributes)) {
            return (
              <input
                key={getNodeId(node)}
                type="hidden"
                name={node.attributes.name}
                value={node.attributes.value || ""}
              />
            )
          }
          return null
        })}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <img
            src={logoUrl}
            alt="ECHO"
            style={{
              maxWidth: '175px',
              height: 'auto',
            }}
          />
        </Box>

        <Box
          sx={{
            textAlign: 'center',
            marginBottom: '25px',
          }}
        >
          <h1 style={{ 
            color: '#ffffff', 
            margin: 0,
            fontSize: '1.2rem',
            fontWeight: 400,
          }}>
            Recover your account
          </h1>
        </Box>

        <Box
          sx={{
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          <p style={{ 
            color: '#ffffff', 
            margin: 0,
            fontWeight: 900,
            fontSize: '0.875rem',
          }}>
            __________
          </p>
        </Box>

        {flow.ui.messages && flow.ui.messages.length > 0 && (
          <Box sx={{ marginBottom: '1.5rem' }}>
            {flow.ui.messages.map((message) => (
              <Alert 
                key={message.id} 
                severity={message.type === "error" ? "error" : "info"}
                icon={false}
                sx={{
                  marginBottom: '0.5rem',
                  backgroundColor: 'transparent',
                  '& .MuiAlert-message': {
                    color: message.type === "error" ? '#ff6b6b' : '#ffffff',
                  },
                }}
              >
                {message.text}
              </Alert>
            ))}
          </Box>
        )}

        {showEmailField && emailAttributes && (
          <Box sx={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor={emailAttributes.name}
              style={{
                display: 'block',
                color: '#ffffff',
                marginBottom: '0.5rem',
                fontSize: '0.975rem',
                fontWeight: 500,
              }}
            >
              Email *
            </label>
            <TextField
              id={emailAttributes.name}
              name={emailAttributes.name}
              type={emailAttributes.type || "email"}
              value={values[emailAttributes.name] || ""}
              onChange={(e) => handleChange(emailAttributes.name, e.target.value)}
              disabled={emailAttributes.disabled || isLoading}
              required={emailAttributes.required}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: values[emailAttributes.name] ? '#E3F2FD' : '#ffffff',
                  borderRadius: '4px',
                  '& fieldset': {
                    borderColor: values[emailAttributes.name] ? '#4CAF50' : '#d0d0d0',
                    borderWidth: values[emailAttributes.name] ? '2px' : '1px',
                  },
                  '&:hover fieldset': {
                    borderColor: values[emailAttributes.name] ? '#4CAF50' : '#d0d0d0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: values[emailAttributes.name] ? '#4CAF50' : '#0D73C7',
                    borderWidth: values[emailAttributes.name] ? '2px' : '2px',
                  },
                  '& input': {
                    color: '#000000',
                    padding: '0.75rem',
                  },
                },
              }}
            />
          </Box>
        )}

        {showCodeField && codeAttributes && (
          <Box sx={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor={codeAttributes.name}
              style={{
                display: 'block',
                color: '#ffffff',
                marginBottom: '0.5rem',
                fontSize: '0.975rem',
                fontWeight: 500,
              }}
            >
              Recovery Code *
            </label>
            <TextField
              id={codeAttributes.name}
              name={codeAttributes.name}
              type={codeAttributes.type || "text"}
              value={values[codeAttributes.name] || ""}
              onChange={(e) => handleChange(codeAttributes.name, e.target.value)}
              disabled={codeAttributes.disabled || isLoading}
              required={codeAttributes.required}
              fullWidth
              autoFocus
              placeholder="Enter the code from your email"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: values[codeAttributes.name] ? '#E3F2FD' : '#ffffff',
                  borderRadius: '4px',
                  '& fieldset': {
                    borderColor: values[codeAttributes.name] ? '#4CAF50' : '#d0d0d0',
                    borderWidth: values[codeAttributes.name] ? '2px' : '1px',
                  },
                  '&:hover fieldset': {
                    borderColor: values[codeAttributes.name] ? '#4CAF50' : '#d0d0d0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: values[codeAttributes.name] ? '#4CAF50' : '#0D73C7',
                    borderWidth: values[codeAttributes.name] ? '2px' : '2px',
                  },
                  '& input': {
                    color: '#000000',
                    padding: '0.75rem',
                  },
                },
              }}
            />
          </Box>
        )}

        <input type="hidden" name="method" value="code" />

        <Button
          type="submit"
          disabled={isLoading}
          fullWidth
          sx={{
            backgroundColor: '#0D73C7',
            color: '#ffffff',
            fontWeight: 600,
            borderRadius: '4px',
            height: '50px',
            fontSize: '1rem',
            textTransform: 'none',
            marginBottom: '1.5rem',
            '&:hover': {
              backgroundColor: '#0a5a9e',
            },
            '&:disabled': {
              opacity: 0.6,
            },
          }}
        >
          {isCodeStage ? "Verify Code" : "Continue"}
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <span style={{ color: '#ffffff', fontSize: '0.875rem' }}>
            Remember your credentials?{' '}
            <Link
              href="/ui/login"
              onClick={(e) => {
                e.preventDefault()
                router.push("/ui/login")
              }}
              sx={{
                color: '#0D73C7',
                textDecoration: 'underline',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Sign in
            </Link>
          </span>
        </Box>
      </form>
    </Box>
  )
}

