import { Box, BoxProps, Button, Stack, StackProps, Typography, styled } from "@mui/material"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import i18next from "i18next"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { PageTitle } from "../../../components/TextDisplay/PageTitle"
import { paymentCards } from "../../../mocks/PaymentCards"
import { PaymentCardModel } from "../../../models/payments/PaymentCardModel"
import { ProfileContainer } from "../ProfileContainer"
import { BillingPlanContainer, PlatinumPlanPlanContainer } from "./PlanContainers"

i18next.setDefaultNamespace("common")

export const BillingContainer = ({ ...props }: StackProps) => {
  const { t } = useTranslation(["BillingContainer"])

  const [cards, setCards] = useState(paymentCards)

  const onSetDefault = (index: number) => {
    setCards(
      cards.map((card, currentIndex) => ({
        ...card,
        isDefault: index === currentIndex,
      })),
    )
  }

  const onEdit = () => {}

  return (
    <Stack {...props}>
      <PageTitle>{t("Plans")}</PageTitle>
      <PlansContainer>
        <PlatinumPlanPlanContainer
          title={t("Platinum")}
          subtitle={t("PlatinumCost")}
          buttonTitle={t("ExplorePlans")}
        />
        <BillingPlanContainer
          title={t("BillingPeriod")}
          subtitle={t("BillingCost")}
          buttonTitle={t("ChangeBillingPeriod")}
        />
      </PlansContainer>
      <ProfileContainer
        mt={3}
        endAdortment={
          <Button
            sx={{ minWidth: "160px", alignSelf: "center" }}
            variant="contained">
            {t("AddNewMethod")}
          </Button>
        }
        title={t("PaymentMethods")}>
        {cards.map((card, index) => (
          <RenderPaymentCard
            key={index}
            onEdit={onEdit}
            onSetDefault={() => onSetDefault(index)}
            {...card}
            withBottomBorder={index !== cards.length - 1}
          />
        ))}
      </ProfileContainer>
    </Stack>
  )
}

function RenderPaymentCard({
  withBottomBorder,
  ...props
}: PaymentCardModel & { withBottomBorder: boolean } & { onSetDefault: () => void; onEdit: () => void }) {
  return (
    <PaymentCard
      sx={{
        borderBottom: withBottomBorder ? "solid" : "none",
        borderWidth: "1px",
        borderColor: theme => theme.palette.divider,
      }}
      {...props}
    />
  )
}
const PaymentCard = ({
  name,
  cardNumber,
  iconBase64,
  isDefault,
  onSetDefault,
  onEdit,
  ...props
}: PaymentCardModel & BoxProps & { onSetDefault: () => void; onEdit: () => void }) => {
  const { t } = useTranslation("BillingContainer")
  return (
    <Stack>
      <PaymentCardContainer {...props}>
        <CardDetailsContainer>
          <img src={iconBase64}></img>
          <Stack sx={{ width: "100%" }}>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="subtitle2">{t("CardEnding", { number: cardNumber })}</Typography>
          </Stack>
        </CardDetailsContainer>
        <CardButtonsContainer>
          {isDefault ? (
            <StyledChip
              label={t("Default")}
              color="default"
              size="small"
              variant="filled"
            />
          ) : (
            <Button
              onClick={onSetDefault}
              sx={{ minWidth: "85px" }}
              variant="link">
              {t("MakeDefault")}
            </Button>
          )}
          <Divider
            orientation="vertical"
            flexItem
          />
          <Button
            onClick={onEdit}
            variant="link">
            {t("Edit", { ns: "Common" })}
          </Button>
        </CardButtonsContainer>
      </PaymentCardContainer>
    </Stack>
  )
}

export const PaymentCardContainer = styled(Box)(({ theme }) => ({
  paddingBlock: "24px",
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(0.5),
  },
}))

export const CardDetailsContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    width: "auto",
  },
}))

const StyledChip = styled(Chip)(({ theme }) => ({
  alignSelf: "center",
  backgroundColor: theme.palette.primary.light,
  borderRadius: theme.spacing(2),
  color: theme.palette.primary.main,
  height: theme.spacing(3),
  fontSize: "0.8125rem",
  paddingRight: 4,
  paddingLeft: 4,
  fontWeight: 400,
  textAlign: "center",
  overflow: "hidden",
  whiteSpace: "nowrap",
  letterSpacing: 0.1,
  transition: "none",
  "&:hover": {
    background: theme.palette.primary.main,
    boxShadow: theme.shadows[3],
    cursor: "pointer",
    color: theme.palette.mode === "dark" ? theme.palette.common.black : theme.palette.common.white,
  },
}))

const CardButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "24px",
  gap: theme.spacing(2),

  [theme.breakpoints.down("sm")]: {
    marginTop: theme.spacing(1),
  },
}))

const PlansContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  paddingBlock: theme.spacing(1),
  justifyContent: "space-around",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: theme.spacing(2),
  },
}))
