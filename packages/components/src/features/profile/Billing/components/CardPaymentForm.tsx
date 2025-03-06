import { FC, useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { useStripe, useElements, CardCvcElement, CardExpiryElement, CardNumberElement } from "@stripe/react-stripe-js";
import { Form, Formik } from "formik";
import { SaveChancelButtons } from "./SaveChancelButtons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getBillingAsync, attachPaymentMethodAsync } from "../../../../slices/billingSlice";
import { RootState } from "../../../../slices/store";

type Props = {
  onAttachCard: (cardData: { number: string; expiry: string; cvc: string }) => void;
  onClose: () => void;
  style?: React.CSSProperties;
  paymentMethods: any[]
};

export const CardPaymentForm: FC<Props> = ({ onAttachCard, onClose, style, paymentMethods }) => {
  const { t } = useTranslation("CardPaymentForm");
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { billing, error: reduxError } = useSelector(
    (state: RootState) => state.billing
  );

    useEffect(() => {
      dispatch(getBillingAsync());
    }, [dispatch]);


    useEffect(() => {
      if (reduxError) {
        setError(reduxError);
      }
    }, [reduxError]);

    const handleSubmit = async () => {
      if (isProcessing) return;
    
      setIsProcessing(true);
      setError(null);
    
      if (!stripe || !elements) {
        setIsProcessing(false);
        return;
      }
    
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        setError("Card element not found.");
        setIsProcessing(false);
        return;
      }
    
      const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });
    
      if (stripeError) {
        setError(stripeError.message || "Error processing card");
        setIsProcessing(false);
        return;
      }
    
      if (paymentMethod && paymentMethod.id && billing?.id) {
        try {
          const existingPaymentMethod = paymentMethods?.find(pm => pm.id === paymentMethod.id);
          if (existingPaymentMethod) {
            setError("This card is already linked.");
            setIsProcessing(false);
            return;
          }
    
          const actionResult = await dispatch(
            attachPaymentMethodAsync({
              customerId: billing.id,
              paymentMethodId: paymentMethod.id,
            })
          );
    
          if (attachPaymentMethodAsync.fulfilled.match(actionResult)) {
            console.log(actionResult)
            if (actionResult.payload.success == false && actionResult.payload.message) {
              setError(actionResult.payload.message);
            } else {
              onAttachCard({
                number: paymentMethod.card?.last4 || "****",
                expiry: `${paymentMethod.card?.exp_month}/${paymentMethod.card?.exp_year}`,
                cvc: "•••",
              });
              onClose();
            }
          }
    
          if (attachPaymentMethodAsync.rejected.match(actionResult)) {
            setError(actionResult.payload || "Error while linking the card.");
          }
    
        } catch (error) {
          setError("An unknown error occurred.");
        }
      } else {
        setError("Error: card data is missing.");
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
