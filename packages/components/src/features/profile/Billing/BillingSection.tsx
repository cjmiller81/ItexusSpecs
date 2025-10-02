import { Box, Button, Stack, StackProps, styled, Typography, useMediaQuery, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { YesNoDialog } from "../../../components";
import { PageTitle } from "../../../components/TextDisplay/PageTitle";
import { addMessage, cancelSubscriptionAsync, createBillingAsync, createPaymentIntentAsync, createSubscriptionAsync, detachPaymentMethodAsync, fetchPaymentMethodsAsync, fetchPlansAsync, fetchProductAsync, fetchProductsAsync, fetchSubscriptionsAsync, getBillingAsync, setDefaultPaymentMethodAsync, setProduct, updateSubscriptionAsync, useAppDispatch } from "../../../slices";
import { RootState } from "../../../slices/store";
import { ProfileContainer } from "../ProfileContainer";
import { BillingPlan } from "./components/BillingPlan";
import { PaymentCardTableRow } from "./components/PaymentCardTableRow";
import { PaymentMethodModal } from "./components/PaymentMethodModal";
import { PaymentMethodEditor } from "./components/PaymentMethodEditor";
import { CardModel, PaymentMethodSelector } from "./components/PaymentMethodSelector";
import { PaymentCardModel } from "./models/PaymentCardModel";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { Product } from "./models/Product";
import { PlanModel } from "./models/PlanModel";

export const BillingContainer = ({ ...props }: StackProps) => {
  const { t } = useTranslation(["BillingContainer"]);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const stripe = useStripe();
  const elements = useElements();
  const [paymetMethodModal, setPaymentMethodModal] = useState(false);
  const [cards, setCards] = useState<PaymentCardModel[]>([]);
  const [cardToDeleteIndex, setCardToDeleteIndex] = useState<number | undefined>(undefined);
  const [cardToEditIndex, setCardToEditIndex] = useState<number | undefined>(undefined);
  const { plans, error, subscriptions,billing  } = useSelector((state: RootState) => state.billing);
  const paymentMethods = useSelector((state: RootState) => state.billing.paymentMethods);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    const initializeBilling = async () => {
      try {
        let billingData = await dispatch(getBillingAsync()).unwrap();
  
        if (!billingData) {
          await dispatch(createBillingAsync());
          billingData = await dispatch(getBillingAsync()).unwrap();
        }
  
        if (billingData?.id) {
          dispatch(fetchPaymentMethodsAsync(billingData.id));
          dispatch(fetchProductsAsync()).then((action) => {
            if (fetchProductsAsync.fulfilled.match(action)) {
              setProducts(action.payload);
            } else {
              console.error("Error loading products:", action.payload);
            }
          });
          
          const subscriptionsData = await dispatch(fetchSubscriptionsAsync(billingData.id)).unwrap();
          
          const activeSubscription = subscriptionsData
            ?.filter((sub) => sub.status === "active")
            ?.sort((a, b) => b.created - a.created)[0];

          if (activeSubscription?.items.data[0]?.price?.id) {
            setSelectedPlanId(activeSubscription.items.data[0].price.id);
          }
          if (activeSubscription.items.data[0]?.price?.product) {
            const productData = await dispatch(fetchProductAsync(activeSubscription.items.data[0].price.product)).unwrap();
            dispatch(setProduct(productData));
          }
        }
      } catch (error) {
        console.error("Billing initialization error:", error);
      }
    };
  
    dispatch(fetchPlansAsync());
    initializeBilling();
  }, [dispatch]);

  useEffect(() => {
    if (paymentMethods?.length) {
      const allCards = paymentMethods
        .filter((method) => method.card)
        .map((method) => ({
          id: method.id,
          number: `**** **** **** ${method.card.last4}`,
          expiry:
            method.card.exp_month && method.card.exp_year
              ? `${method.card.exp_month}/${method.card.exp_year}`
              : "00/00",
          cvc: "•••",
          isDefault: method.id === billing?.invoice_settings?.default_payment_method,
        }));
  
      setCards(allCards);
    }
  }, [paymentMethods, billing?.invoice_settings?.default_payment_method]);
  
  
  const handleCreatePaymentIntent = async (plan: any) => {
    if (!stripe || !elements) return;
  
    if (!billing?.invoice_settings?.default_payment_method) {
      dispatch(addMessage({ message: t("NoDefaultCardError") }));
      return;
    }
 
    setSelectedPlanId(plan.id); 

    try {
      const paymentIntent: any = await dispatch(
        createPaymentIntentAsync({
          amount: plan.unit_amount / 100,
          currency: "usd",
          customerId: billing?.id || "",
          description: `Subscription for plan ${plan.id}`,
        })
      ).unwrap();
  
      if (!paymentIntent?.id) {
        dispatch(addMessage({ message: t("PaymentError") }));
        return;
      }
  
      if (paymentIntent.status === "succeeded") {
        dispatch(addMessage({ message: t("PaymentSuccess") }));
  
      } else if (paymentIntent.status === "requires_action") {
        dispatch(addMessage({ message: t("PaymentRequiresAction") }));
      } else {
        dispatch(addMessage({ message: t("PaymentPending") }));
      }
    } catch (err) {
      dispatch(addMessage({ message: t("PaymentError") }));
    }
  };
  
  const handlePlanChange = async (newPlan: any) => {
    if (!billing?.id) return;

    try {
      const subscriptionsData = await dispatch(fetchSubscriptionsAsync(billing?.id)).unwrap();

      if (!selectedPlanId) {
        await handleCreatePaymentIntent(newPlan);

        await dispatch(
          createSubscriptionAsync({
            CustomerId: billing?.id || "",
            PriceId: newPlan.id,
          })
        ).unwrap();
      } else {
        const currentPlan = plans.find((plan) => plan.id === selectedPlanId);

        if (!currentPlan) return;

        if (newPlan.unit_amount < currentPlan.unit_amount) {
          const activeSubscription = subscriptionsData?.[0];

          if (activeSubscription) {
            const existingItem = activeSubscription.items.data.find(
              item => item.price.id === newPlan.id
            );

            await dispatch(
              updateSubscriptionAsync({
                SubscriptionId: activeSubscription.id,
                SubscriptionItemId: existingItem?.id || activeSubscription.items.data[0]?.id,
                NewPriceId: newPlan.id,
              })
            ).unwrap();

            dispatch(addMessage({ message: t("PlanDowngraded") }));
            setSelectedPlanId(newPlan.id);
          }
        }
        else {
          const activeSubscription = subscriptionsData?.[0];

          if (activeSubscription) {
            await handleCreatePaymentIntentWithProrations(newPlan, activeSubscription);

            const existingItem = activeSubscription.items.data.find(
            item => item.price.id === newPlan.id
          );

          if (existingItem) {
            dispatch(addMessage({ message: t("PlanAlreadyActive") }));
          } else {
            await dispatch(
              updateSubscriptionAsync({
                SubscriptionId: activeSubscription.id,
                SubscriptionItemId: activeSubscription.items.data[0]?.id,
                NewPriceId: newPlan.id,
              })
            ).unwrap();

              dispatch(addMessage({ message: t("PlanUpgraded") }));
              setSelectedPlanId(newPlan.id);
            }
          }
        }
      }
      if (newPlan.product) {
        const productData = await dispatch(fetchProductAsync(newPlan.product)).unwrap();
        dispatch(setProduct(productData));
      }
    } catch (err) {
      console.error("Plan change failed:", err);
      dispatch(addMessage({ message: t("PlanChangeError") }));
    }
  };

  const handleCreatePaymentIntentWithProrations = async (newPlan: any, activeSubscription: any) => {
    try {
      const prorationAmount = await calculateProrationAmount(activeSubscription, newPlan);

      if (!prorationAmount) {
        throw new Error("Failed to calculate proration amount");
      }

      const paymentIntent: any = await dispatch(
        createPaymentIntentAsync({
          amount: prorationAmount,
          currency: "usd",
          customerId: billing?.id || "",
          description: `Proration for plan change to ${newPlan.id}`,
        })
      ).unwrap();
  
      if (!paymentIntent?.id) {
        dispatch(addMessage({ message: t("PaymentError") }));
        return;
      }
  
      if (paymentIntent.status === "succeeded") {
        dispatch(addMessage({ message: t("PaymentSuccess") }));
  
      } else if (paymentIntent.status === "requires_action") {
        dispatch(addMessage({ message: t("PaymentRequiresAction") }));
      } else {
        dispatch(addMessage({ message: t("PaymentPending") }));
      }
    } catch (err) {
      console.error("Failed to create payment intent with proration", err);
      dispatch(addMessage({ message: t("PaymentError") }));
    }
  };
  
  const calculateProrationAmount = (activeSubscription: any, newPlan: any) => {
    try {
  
      const currentPlanAmount = activeSubscription.items.data?.[0]?.price?.unit_amount || 0;
      const newPlanAmount = newPlan?.unit_amount;

      if (currentPlanAmount === 0) {
        return newPlanAmount;
      }

      if (!newPlanAmount) {
        throw new Error('Invalid current plan or new plan amount');
      }
  
      const currentPeriodEnd = new Date(activeSubscription.items.data?.[0].current_period_end).getTime();

      const currentDate = Date.now();
      const currentPeriodEndMs = currentPeriodEnd * 1000;

      const daysLeft = Math.max((currentPeriodEndMs - currentDate) / (1000 * 60 * 60 * 24), 0);

      const currentPeriodStart = new Date(activeSubscription.items.data?.[0].current_period_start).getTime(); ;
      const countOfDayInMonth = Math.max((currentPeriodEndMs - currentPeriodStart) / (1000 * 60 * 60 * 24), 0);
      const dailyRate = newPlanAmount / countOfDayInMonth;

      const oldSubscriptionRate = currentPlanAmount / countOfDayInMonth;

      const prorationAmount = Math.floor(dailyRate * daysLeft - oldSubscriptionRate * daysLeft);

      return prorationAmount;
  
    } catch (error) {
      console.error('Failed to calculate proration amount:', error);
      return null;
    }
  };
  
  const handleSetDefaultCard = async (cardId: string) => {
    if (!billing?.id) return;

    try {
      await dispatch(setDefaultPaymentMethodAsync({ customerId: billing.id, paymentMethodId: cardId })).unwrap();
  
      const updatedBilling = await dispatch(getBillingAsync()).unwrap();
                        
      const newDefaultId = updatedBilling?.invoice_settings?.default_payment_method;

      if (!newDefaultId) {
        throw new Error("Failed to update default payment method");
      }
  
      setCards(prevCards =>
        prevCards.map(card => ({
          ...card,
          isDefault: paymentMethods.some(pm => pm.id === newDefaultId && pm.card?.last4 === card.number.slice(-4)),
        }))
      );
  
      dispatch(addMessage({ message: t("DefaultCardUpdated") }));
    } catch (err) {
      dispatch(addMessage({ message: t("DefaultCardUpdateError") }));
    }
  };

  const onAddCard = (card: CardModel) => {
    if (!cards.some(c => c.number === card.number)) {
        setCards(prev => {
            const updatedCards = [...prev, { isDefault: false, ...card }];
            if (billing?.id) {
               dispatch(fetchPaymentMethodsAsync(billing.id));
          }          
            return updatedCards;
        });
        dispatch(addMessage({ message: t("CardAddedMessage") }));
    }
    setPaymentMethodModal(false);
};

  const onDeleteCard = async () => {    
    if (cardToDeleteIndex === undefined) return;
  
    const paymentMethodId = paymentMethods[cardToDeleteIndex]?.id;
  
    if (!paymentMethodId) return;
  
    try {
      await dispatch(detachPaymentMethodAsync({
        customerId: billing?.id || "", 
        paymentMethodId,
      })).unwrap();
  
      setCards(prev => {
        const updatedCards = prev.filter((_, index) => index !== cardToDeleteIndex);
        if (billing?.id) {
          dispatch(fetchPaymentMethodsAsync(billing.id));
        }
        return updatedCards;
      });
      dispatch(addMessage({ message: t("CardDeletedMessage") }));
    } catch (error) {
      dispatch(addMessage({ message: t("CardDeleteErrorMessage") }));
    }
  
    setCardToDeleteIndex(undefined);
  };

  const onEditCard = (cardData: CardModel) => {
    if (cardToEditIndex === undefined) return;
    setCards(prev => [
      ...prev.slice(0, cardToEditIndex),
      { isDefault: false, ...cardData },
      ...prev.slice(cardToEditIndex + 1),
    ]);
    setCardToEditIndex(undefined);
    dispatch(addMessage({ message: t("CardEditedMessage") }));
  };

  const plansToDisplay = plans.reduce<PlanModel[]>((acc, plan) => {

    const product = products?.find(product => product.id === plan.product);
    if (!product || !product.active) return acc;
  
    const matchingPlans = plans
      .filter(p => p.product === plan.product && p.active === true)
      .sort((a, b) => a.unit_amount - b.unit_amount);
  
    if (matchingPlans.length > 1) {
      const selectedPlan = matchingPlans.find(p => p.id === selectedPlanId);
  
      if (selectedPlan) {
        if (!acc.some(p => p.id === selectedPlan.id)) {
          acc.push(selectedPlan);
        }
      } else {
        if (!acc.some(p => p.id === matchingPlans[0].id)) {
          acc.push(matchingPlans[0]);
        }
      }
    } else {
      if (!acc.some(p => p.id === plan.id)) {
        acc.push(plan);
      }
    }
  
    return acc;
  }, []);  

  const planCounts = plans.reduce((acc, plan) => {
    acc[plan.product] = (acc[plan.product] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const duplicatePlans = plans.filter(plan => planCounts[plan.product] > 1 && plan.active === true);

  return (
    <>
      <YesNoDialog
        sx={{ minWidth: "400px" }}
        content={t("DeleteCardDialogContent")}
        title={t("DeleteCardDialogTitle")}
        onAgree={onDeleteCard}
        open={cardToDeleteIndex !== undefined}
        onClose={() => setCardToDeleteIndex(undefined)}
      />

      <PaymentMethodModal onClose={() => setPaymentMethodModal(false)} open={paymetMethodModal}>
        <PaymentMethodSelector onClose={() => setPaymentMethodModal(false)} onAttachCard={onAddCard} paymentMethods ={paymentMethods} />
      </PaymentMethodModal>

      <PaymentMethodModal onClose={() => setCardToEditIndex(undefined)} open={cardToEditIndex !== undefined}>
        {cardToEditIndex !== undefined ? (
          <PaymentMethodEditor
            number={cards[cardToEditIndex].number}
            cvc={cards[cardToEditIndex].cvc}
            expiry={cards[cardToEditIndex].expiry}
            onClose={() => setCardToEditIndex(undefined)}
            onAttachCard={onEditCard}
            paymentMethods ={paymentMethods}
          />
        ) : <></>}
      </PaymentMethodModal>

      <Stack {...props}>
        <PageTitle>{t("Plans")}</PageTitle>

        <PlansContainer>
          <Grid item container spacing={3}>
            {plansToDisplay
              .slice()
              .sort((a, b) => a.unit_amount - b.unit_amount)
              .map((plan, index) => (
                <BillingPlan
                  onSelectPlan={(selectedPlan) => handlePlanChange(selectedPlan)} 
                  isSelected={selectedPlanId === plan.id}
                  selectedPlanId={selectedPlanId}
                  key={plan.id || index}
                  plan={plan}
                  products={products}
                  duplicatePlans={duplicatePlans}
                />
              ))}
          </Grid>
        </PlansContainer>

        <ProfileContainer
          mt={3}
          endAdortment={
            <Button
              onClick={() => setPaymentMethodModal(true)}
              sx={{ minWidth: "160px", alignSelf: "center" }}
              variant="contained">
              {t("AddPayment")}
            </Button>
          }
          title={t("PaymentMethods")}>
          {cards.map((card, index) => (
          <PaymentCardTableRow
            key={index}
            isDefault={card.isDefault}
            number={card.number}
            onDelete={() => setCardToDeleteIndex(index)}
            onSetDefault={() => handleSetDefaultCard(paymentMethods[index].id)}
            sx={{
              borderBottom: cards.length && index !== cards.length - 1 ? "solid" : "none",
              borderWidth: "1px",
              borderColor: theme.palette.divider,
            }}
            {...props}
          />
        ))}

          {!cards.length && (
            <Typography sx={{ margin: "auto", paddingY: 10 }} variant="h5">
              {t("NoPaymentMethods")}
            </Typography>
          )}
        </ProfileContainer>
      </Stack>
    </>
  );
};

const PlansContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "nowrap",
  paddingBlock: theme.spacing(1),
  justifyContent: "space-around",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: theme.spacing(2),
  },
}));
