import PaymentIcon from "@mui/icons-material/Payment";
import { Box, BoxProps, Button, Chip, Stack, Typography, darken, styled } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useTranslation } from "react-i18next";

type PaymentCardProps = BoxProps & {
  number: string;
  isDefault: boolean;
  onSetDefault: () => void;
  onEdit: () => void;
};

export const PaymentCard = ({ number, isDefault, onSetDefault, onEdit, ...props }: PaymentCardProps) => {
  const { t } = useTranslation("BillingContainer");
  return (
    <Stack>
      <PaymentCardContainer {...props}>
        <CardDetailsContainer>
          <PaymentIcon style={{ width: "30px", height: "auto" }} />
          <Typography
            ml={1}
            fontSize={"16px"}>
            {t("CardEnding", { number: number.slice(-4) })}
          </Typography>
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
              sx={{ padding: "2px 2px", minWidth: "100px" }}
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
            sx={{ padding: "2px 10px" }}
            variant="link">
            {t("Edit", { ns: "Common" })}
          </Button>
        </CardButtonsContainer>
      </PaymentCardContainer>
    </Stack>
  );
};

export const PaymentCardContainer = styled(Box)(({ theme }) => ({
  paddingBlock: "24px",
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(0.5),
  },
}));

export const CardDetailsContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    width: "auto",
  },
}));

const CardButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "24px",
  gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    marginTop: theme.spacing(1),
  },
}));

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
    background: darken(theme.palette.primary.main, 0.2),
    boxShadow: theme.shadows[3],
    cursor: "pointer",
    color: theme.palette.mode === "dark" ? theme.palette.common.black : theme.palette.common.white,
  },
}));
