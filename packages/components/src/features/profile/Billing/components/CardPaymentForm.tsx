import { FC, useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { useStripe, useElements, CardCvcElement, CardExpiryElement, CardNumberElement } from "@stripe/react-stripe-js";
import { Form, Formik } from "formik";
import { SaveChancelButtons } from "./SaveChancelButtons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createPaymentIntentAsync, getBillingAsync } from "../../../../slices/billingSlice";
import { RootState } from "../../../../slices/store";

type Props = {
  onAttachCard: (cardData: { number: string; expiry: string; cvc: string }) => void;
  onClose: () => void;
  style?: React.CSSProperties;
};

export const CardPaymentForm: FC<Props> = ({ onAttachCard, onClose, style }) => {
  const { t } = useTranslation("CardPaymentForm");
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { billing, paymentIntentClientSecret, loading, error: reduxError } = useSelector(
    (state: RootState) => state.billing
  );

  useEffect(() => {
    dispatch(getBillingAsync());
  }, [dispatch]);

  useEffect(() => {
    if (billing?.id) {
      dispatch(createPaymentIntentAsync(billing.id));
    }
  }, [dispatch, billing]);

  useEffect(() => {
    if (reduxError) {
      setError(reduxError);
    }
  }, [reduxError]);

  const handleSubmit = async () => {
    setIsProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe.js has not loaded yet.");
      setIsProcessing(false);
      return;
    }

    if (!paymentIntentClientSecret) {
      setError("Ошибка: не найдено PaymentIntent.");
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      setError("Card element not found.");
      setIsProcessing(false);
      return;
    }

    const { token, error: stripeError } = await stripe.createToken(cardElement);

    if (stripeError) {
      setError(stripeError.message || "Ошибка при обработке карты.");
      setIsProcessing(false);
      return;
    }

    if (token && token.card) {
      const cardData = {
        number: token.card.last4,
        expiry: `${token.card.exp_month}/${token.card.exp_year}`,
        cvc: "•••",
      };

      onAttachCard(cardData);
    } else {
      setError("Ошибка: данные карты отсутствуют.");
    }

    setIsProcessing(false);
  };

  return (
    <Formik initialValues={{}} onSubmit={handleSubmit}>
      {({ submitForm }) => (
        <Form style={{ marginTop: "20px", display: "flex", flexDirection: "column", ...style }} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div style={{ border: "2px solid #aab7c4", borderRadius: "8px", padding: "10px" }}>
                <CardNumberElement
                  options={{
                    style: {
                      base: {
                        fontSize: "18px",
                        color: "white",
                        letterSpacing: "0.025em",
                        "::placeholder": { color: "#aab7c4" },
                      },
                    },
                  }}
                />
              </div>
            </Grid>

            <Grid container item xs={12} spacing={2}>
              <Grid item xs={6}>
                <div style={{ border: "2px solid #aab7c4", borderRadius: "8px", padding: "10px" }}>
                  <CardExpiryElement
                    options={{
                      style: {
                        base: {
                          fontSize: "18px",
                          color: "white",
                          letterSpacing: "0.025em",
                          "::placeholder": { color: "#aab7c4" },
                        },
                      },
                    }}
                  />
                </div>
              </Grid>
              <Grid item xs={6}>
                <div style={{ border: "2px solid #aab7c4", borderRadius: "8px", padding: "10px" }}>
                  <CardCvcElement
                    options={{
                      style: {
                        base: {
                          fontSize: "18px",
                          color: "white",
                          letterSpacing: "0.025em",
                          "::placeholder": { color: "#aab7c4" },
                        },
                      },
                    }}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <SaveChancelButtons
            sx={{ position: "absolute", bottom: (theme) => theme.spacing(2), right: (theme) => theme.spacing(2) }}
            onSave={submitForm}
            onCancel={onClose}
          />
        </Form>
      )}
    </Formik>
  );
};