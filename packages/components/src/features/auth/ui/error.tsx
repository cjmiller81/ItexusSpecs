import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import { ory } from "../lib/sdk";
import { HandleError } from "../utils/hooks";
import { StyledAuthContainer } from "./StyledAuthContainer";
import ProtectedByOryLabel from "./protectedByOryLabel";
import { Box, Button, Typography, Collapse, Stack } from "@mui/material";
import { GenericError, Session } from "@ory/client";

interface OryFlowErrorData {
  error?: GenericError;
}
import { styled } from "@mui/material/styles";

const ErrorCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#2B2B2B",
  borderRadius: "1rem",
  padding: "48px",
  width: "400px",
  maxWidth: "90vw",
  borderWidth: "2px",
  borderColor: "white",
  borderStyle: "solid",
  textAlign: "center",
  [theme.breakpoints.down(640)]: {
    borderColor: "#2B2B2B",
  },
}));

export interface ErrorUiProps {
  env: {
    termsUrl: string;
    appTermsUrl: string;
  };
}

export const ErrorUi = ({ env }: ErrorUiProps): React.JSX.Element => {
  const [error, setError] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string | null>();
  const [session, setSession] = useState<Session | null>(null);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const router = useRouter();

  const id = router.query.id;
  const err = router.query.error;

  const handleError = useCallback((callbackError: AxiosError) => {
    const handle = HandleError();
    return handle(callbackError);
  }, []);

  useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {
        setSession(data);
      })
      .catch(() => {
        setSession(null);
      });
  }, []);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (err) {
      try {
        const parsed = JSON.parse(decodeURIComponent(String(err)));
        setError(JSON.stringify(parsed, null, 2));
        const message = parsed?.error?.message || parsed?.data?.error?.message;
        setErrorMessage(message || null);
      } catch (_catchError) {
        setError(String(err));
        setErrorMessage(null);
      }
    }

    if (id) {
      // Fetch the error information from the Ory API
      ory
        .getFlowError({ id: String(id) })
        .then(({ data }) => {
          setError(JSON.stringify(data, null, 2));
          setErrorMessage((data as OryFlowErrorData)?.error?.message || null);
        })
        .catch(err => {
          setError(JSON.stringify(err, null, 2));
          setErrorMessage(null);
        });
    }
  }, [err, id, router.isReady, handleError]);

  return (
    <StyledAuthContainer>
      <Stack
        alignItems="center"
        gap={1}>
        <ErrorCard>
          <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
            <img
              src={process.env.NEXT_PUBLIC_ORY_CARD_IMAGE_URL || "/oryIcon.svg"}
              alt="Logo"
              style={{ maxHeight: "60px", objectFit: "contain" }}
            />
          </Box>

          <Typography
            variant="h6"
            sx={{ mb: 3, color: "#fff" }}>
            {errorMessage ? `An error occurred: ${errorMessage}` : "An unknown error occurred!"}
          </Typography>

          <Box sx={{ mb: 3 }}>
            {session ? (
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push("/")}
                sx={{
                  textTransform: "none",
                  px: 4,
                  backgroundColor: "#0D73C7",
                  color: "white",
                  width: "100%",
                  "&:hover": {
                    backgroundColor: "#0a5a9e",
                  },
                }}>
                Return to App
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push("/ui/login")}
                sx={{
                  textTransform: "none",
                  px: 4,
                  backgroundColor: "#0D73C7",
                  color: "white",
                  width: "100%",
                  "&:hover": {
                    backgroundColor: "#0a5a9e",
                  },
                }}>
                Try Login Again
              </Button>
            )}
          </Box>

          <Button
            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
            sx={{
              textTransform: "none",
              color: "#0D73C7",
              mb: 2,
              textDecoration: "underline",
              "&:hover": {
                backgroundColor: "transparent",
                textDecoration: "underline",
              },
            }}>
            View more details...
          </Button>

          <Collapse in={isDetailsExpanded}>
            <Box
              component="pre"
              sx={{
                overflow: "auto",
                maxWidth: "100%",
                textAlign: "left",
                marginTop: 2,
                backgroundColor: "#f5f5f5",
                color: "#000",
                padding: 2,
                borderRadius: 1,
                fontSize: "0.875rem",
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}>
              {error}
            </Box>
          </Collapse>
        </ErrorCard>
        <ProtectedByOryLabel env={env} />
      </Stack>
    </StyledAuthContainer>
  );
};

export default ErrorUi;
