import CheckOutlined from "@ant-design/icons/CheckOutlined";
import { Button, Card, Stack, Typography, useTheme } from "@mui/material";
import Grid, { GridProps } from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyledSwitch } from "./StyledSwitch";

export type PermissionItem = {
  permission: string;
  permissionValue?: string;
  isEnabled?: boolean;
};

export type PricingPeriod = "year" | "month";
export type BillingPlan = {
  planName: string;
  price?: number;
  isCustomPricing?: boolean;
  plans: PermissionItem[];
};

type Props = GridProps &
  BillingPlan & {
    isSelected?: boolean;
    onSelectPlan?: () => void;
  };

export const BillingPlan: FC<Props> = ({
  planName,
  price,
  plans,
  isCustomPricing,
  isSelected,
  onSelectPlan,
  ...props
}) => {
  const { t } = useTranslation("BillingPlan");
  const theme = useTheme();

  const [pricingPeriod, setPricingPeriod] = useState<PricingPeriod | undefined>(isCustomPricing ? undefined : "month");
  return (
    <Grid
      item
      {...props}>
      <Card
        sx={{
          height: "100%",
          py: 3,
          px: 2,
          borderRadius: theme.shape.borderRadius,
        }}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={2}
            textAlign="center">
            <Typography
              fontWeight={500}
              variant="h4">
              {planName}
            </Typography>
          </Stack>

          <Stack
            minHeight={110}
            justifyContent={"space-between"}>
            {pricingPeriod && (
              <Stack
                direction="row"
                alignItems={"center"}>
                <Typography sx={{ opacity: pricingPeriod === "year" ? 1 : 0.5 }}>{t("BilledYearly")}</Typography>
                <StyledSwitch
                  onChange={() => setPricingPeriod(pricingPeriod === "year" ? "month" : "year")}
                  checked={pricingPeriod === "month"}
                />
                <Typography sx={{ opacity: pricingPeriod === "month" ? 1 : 0.5 }}>{t("BilledMonthly")}</Typography>
              </Stack>
            )}

            {price && (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center">
                <Typography
                  fontWeight={700}
                  variant="h4">
                  {pricingPeriod === "year" ? `$${price * 12}` : `$${price}`}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{ opacity: 0.4 }}
                  color="text.secondary">
                  {pricingPeriod === "month" ? t("PerMonth") : t("PerYear")}
                </Typography>
              </Stack>
            )}
            {isCustomPricing && (
              <Button
                sx={{
                  mb: "auto",
                  height: "50px",
                  fontSize: "11.5px",
                }}
                fullWidth
                variant="contained">
                {t("ContactUs")}
              </Button>
            )}
          </Stack>

          <Button
            onClick={onSelectPlan}
            sx={{
              height: "40px",
            }}
            variant={isSelected ? "contained" : "outlined"}
            fullWidth>
            {isSelected ? t("CurrentPlan") : t("SwitchToPlan")}
          </Button>

          <List
            sx={{
              m: 0,
              p: 0,
              marginTop: "auto",
              "&> li": { px: 0, py: 0.625, "& svg": { fill: theme.palette.success.dark } },
            }}
            component="ul">
            {plans.map((plan, i) => (
              <ListItem
                content="li"
                key={i}
                sx={{ ...(!plan.isEnabled ? priceListDisable : {}), minWidth: 2 }}
                divider={i !== plans.length - 1}>
                <CheckOutlined />

                <ListItemText
                  sx={{ pl: 2 }}
                  primary={plan.permissionValue ? `${plan.permission}: ${plan.permissionValue}` : `${plan.permission}`}
                />
              </ListItem>
            ))}
          </List>
        </Stack>
      </Card>
    </Grid>
  );
};

const priceListDisable = {
  opacity: 0.4,
  "& >div> svg": {
    fill: theme => theme.palette.secondary.light,
  },
};
