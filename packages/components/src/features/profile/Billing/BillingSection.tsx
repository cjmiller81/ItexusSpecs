import { Box, Button, Stack, StackProps, styled, Typography, useMediaQuery, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { YesNoDialog } from "../../../components";
import { PageTitle } from "../../../components/TextDisplay/PageTitle";
import { addMessage, useAppDispatch } from "../../../slices";
import { ProfileContainer } from "../ProfileContainer";
import { BillingPlan } from "./components/BillingPlan";
import { PaymentCardTableRow } from "./components/PaymentCardTableRow";
import { PaymentMethodModal } from "./components/PaymentMethodModal";
import { PaymentMethodEditor } from "./components/PaymentMetodEditor";
import { CardModel, PaymentMetodSelector } from "./components/PaymentMetodSelector";
import { billingPlans } from "./mocks/billingPlans";
import { PaymentCardModel } from "./models/PaymentCardModel";

export const BillingContainer = ({ ...props }: StackProps) => {
  const { t } = useTranslation(["BillingContainer"]);
  const [paymetMethodModal, setPaymentMethodModal] = useState(false);
  const [cards, setCards] = useState<PaymentCardModel[]>([]);
  const theme = useTheme();
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const dispatch = useAppDispatch();
  const twoTilesPerRow = useMediaQuery("(max-width: 1280px)");
  const [cardToDeleteIndex, setCardToDeleteIndex] = useState<number | undefined>(undefined);
  const [cardToEditIndex, setCardToEditIndex] = useState<number | undefined>(undefined);

  const onSetDefault = (index: number) => {
    setCards(
      cards.map((card, currentIndex) => ({
        ...card,
        isDefault: index === currentIndex,
      })),
    );
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
        <PaymentMetodSelector
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
        <PlansContainer>
          <Grid
            item
            container
            spacing={3}>
            {billingPlans.map((plan, index) => (
              <BillingPlan
                xs={12}
                sm={6}
                md={twoTilesPerRow ? 6 : 2}
                lg={3}
                onSelectPlan={() => setSelectedPlanIndex(index)}
                isSelected={index === selectedPlanIndex}
                key={index}
                {...plan}
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
              {t("AddNewMethod")}
            </Button>
          }
          title={t("PaymentMethods")}>
          {cards.map((card, index) => (
            <PaymentCardTableRow
              onEdit={() => setCardToEditIndex(index)}
              onDelete={() => setCardToDeleteIndex(index)}
              onSetDefault={() => onSetDefault(index)}
              key={index}
              isDefault={card.isDefault}
              number={card.number}
              sx={{
                borderBottom: cards.length && index !== cards.length - 1 ? "solid" : "none",
                borderWidth: "1px",
                borderColor: theme => theme.palette.divider,
              }}
              {...props}
            />
          ))}

          {!cards.length && (
            <Typography
              sx={{ margin: "auto", paddingY: 10 }}
              variant="h5">
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
