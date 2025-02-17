import { Box, Button, Stack, StackProps, styled, Typography, useMediaQuery, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { YesNoDialog } from "../../../components";
import { PageTitle } from "../../../components/TextDisplay/PageTitle";
import { addMessage, createBillingAsync, createSubscriptionAsync, fetchPlansAsync, getBillingAsync, useAppDispatch } from "../../../slices";
import { RootState } from "../../../slices/store";

import { ProfileContainer } from "../ProfileContainer";
import { BillingPlan } from "./components/BillingPlan";
import { PaymentCardTableRow } from "./components/PaymentCardTableRow";
import { PaymentMethodModal } from "./components/PaymentMethodModal";
import { PaymentMethodEditor } from "./components/PaymentMethodEditor";
import { CardModel, PaymentMethodSelector } from "./components/PaymentMethodSelector";
import { PaymentCardModel } from "./models/PaymentCardModel";

export const BillingContainer = ({ ...props }: StackProps) => {
  const { t } = useTranslation(["BillingContainer"]);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const twoTilesPerRow = useMediaQuery("(max-width: 1280px)");
  const [paymetMethodModal, setPaymentMethodModal] = useState(false);
  const [cards, setCards] = useState<PaymentCardModel[]>([]);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [cardToDeleteIndex, setCardToDeleteIndex] = useState<number | undefined>(undefined);
  const [cardToEditIndex, setCardToEditIndex] = useState<number | undefined>(undefined);

  const { plans, loading, error } = useSelector((state: RootState) => state.billing);

  useEffect(() => {
    dispatch(fetchPlansAsync());
    dispatch(getBillingAsync()); 
  }, [dispatch]);

  const { billing, defaultSourceId, loading: billingLoading, error: billingError } = useSelector((state: RootState) => state.billing);

  useEffect(() => {
    if (defaultSourceId) {
      setCards(prevCards => {
        if (prevCards.some(card => card.number.endsWith(defaultSourceId.slice(-4)))) {
          return prevCards;
        }
        return [
          ...prevCards,
          {
            number: `**** **** **** ${defaultSourceId.slice(-4)}`,
            expiry: "N/A",
            cvc: "•••",
            isDefault: true,
          },
        ];
      });
    }
  }, [defaultSourceId]);
  
  
  const handleCreateBilling = async (index:number) => {
    setSelectedPlanIndex(index);
    try {
      await dispatch(createBillingAsync()).unwrap();
    } catch (err) {
      console.error("Billing creation failed:", err);
    }
  };

  const onSetDefault = (index: number) => {
    setCards(
      cards.map((card, currentIndex) => ({
        ...card,
        isDefault: index === currentIndex,
      })),
    );
  };

  const handleCreateSubscription = async (PriceId: string,index:number) => {
    if (cards.length === 0) {
      dispatch(addMessage(t("SubscriptionError")));
      return;
    }
  
    setSelectedPlanIndex(index);
    // try {
    //   await dispatch(createSubscriptionAsync(PriceId)).unwrap();
    // } catch (err) {
    //   console.error(("SubscriptionCreationFailed"), err);
    // }
  };
  

  const onAddCard = (card: CardModel) => {
    setCards(prev => [
      ...prev,
      {
        isDefault: false,
        ...card,
      },
    ]);
    setPaymentMethodModal(false);
    dispatch(addMessage(t("CardAddedMessage")));
  };

  const onDeleteCard = () => {
    if (cardToDeleteIndex === undefined) return;
    setCards(cards => [...cards.slice(0, cardToDeleteIndex), ...cards.slice(cardToDeleteIndex + 1)]);
    setCardToDeleteIndex(undefined);
    dispatch(addMessage(t("CardDeletedMessage")));
  };

  const onEditCard = (cardData: CardModel) => {
    if (cardToEditIndex === undefined) return;
    setCards(prev => [
      ...prev.slice(0, cardToEditIndex),
      {
        isDefault: false,
        ...cardData,
      },
      ...prev.slice(cardToEditIndex + 1),
    ]);
    setCardToEditIndex(undefined);
    dispatch(addMessage(t("CardEditedMessage")));
  };

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

      <PaymentMethodModal
        onClose={() => setPaymentMethodModal(false)}
        open={paymetMethodModal}>
        <PaymentMethodSelector
          onClose={() => setPaymentMethodModal(false)}
          onAttachCard={onAddCard}
        />
      </PaymentMethodModal>

      <PaymentMethodModal
        onClose={() => setCardToEditIndex(undefined)}
        open={cardToEditIndex !== undefined}>
        <>
          {cardToEditIndex !== undefined && (
            <PaymentMethodEditor
              number={cards[cardToEditIndex].number}
              cvc={cards[cardToEditIndex].cvc}
              expiry={cards[cardToEditIndex].expiry}
              onClose={() => setCardToEditIndex(undefined)}
              onAttachCard={onEditCard}></PaymentMethodEditor>
          )}
        </>
      </PaymentMethodModal>

      <Stack {...props}>
        <PageTitle>{t("Plans")}</PageTitle>

        {loading && <Typography>{t("Loading")}</Typography>}
        {error && <Typography color="error">{t("ErrorLoadingPlans")}</Typography>}

        <PlansContainer>
        <Grid item container spacing={3}>
        <Grid item container spacing={3}>
        {plans
          .slice()
          .sort((a, b) => a.unitAmountDecimal - b.unitAmountDecimal)
          .map((plan, index) => (
            <BillingPlan
              onSelectPlan={() => handleCreateSubscription(plan.id,index)}
              isSelected={index === selectedPlanIndex}
              key={plan.id || index}
              plan={plan}
            />
          ))}
        </Grid>
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
            onEdit={() => setCardToEditIndex(index)}
            onDelete={() => setCardToDeleteIndex(index)}
            onSetDefault={() => onSetDefault(index)}
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
