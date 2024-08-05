import { Box, Button, Stack, StackProps, styled, Typography, useMediaQuery, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppModal } from "../../../components";
import { PageTitle } from "../../../components/TextDisplay/PageTitle";
import { addMessage, useAppDispatch } from "../../../slices";
import { ProfileContainer } from "../ProfileContainer";
import { billingPlans } from "./billingPlans";
import { BillingPlan } from "./components/BillingPlan";
import { PaymentCardTableRow } from "./components/PaymentCardTableRow";
import { CardModel, PaymentMetodSelector } from "./components/PaymentMetodSelector";
import { PaymentCardModel } from "./models/PaymentCardModel";

export const BillingContainer = ({ ...props }: StackProps) => {
  const { t } = useTranslation(["BillingContainer"]);
  const [paymetMethodModal, setPaymentMethodModal] = useState(false);
  const [cards, setCards] = useState<PaymentCardModel[]>([]);
  const theme = useTheme();
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const dispatch = useAppDispatch();

  const onSetDefault = (index: number) => {
    setCards(
      cards.map((card, currentIndex) => ({
        ...card,
        isDefault: index === currentIndex,
      })),
    );
  };

  const onEdit = () => {};

  const onAddCard = (card: CardModel) => {
    setCards(prev => [
      ...prev,
      {
        isDefault: false,
        number: card.number,
      },
    ]);
    setPaymentMethodModal(false);
    dispatch(addMessage(t("CardAddedMessage")));
  };

  const twoTilesPerRow = useMediaQuery("(max-width: 1280px)");
  return (
    <>
      <AppModal
        bodyProps={{
          sx: {
            minWidth: "700px",
            minHeight: "400px",
            [theme.breakpoints.down("md")]: {
              minWidth: "90%",
              paddingX: 1,
            },
          },
        }}
        onClose={() => setPaymentMethodModal(false)}
        open={paymetMethodModal}>
        <PaymentMetodSelector
          onClose={() => setPaymentMethodModal(false)}
          onAttachCard={onAddCard}
        />
      </AppModal>

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
              onEdit={onEdit}
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
