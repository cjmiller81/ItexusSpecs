import { FC, useState } from "react";
import { Grid, Card, Stack, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckOutlined from "@ant-design/icons/CheckOutlined";
import { StyledSwitch } from "./StyledSwitch";
import { PlanModel } from "../models/PlanModel";
import { Product } from "../models/Product";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../../slices";

export type PermissionItem = {
  permissionValue?: string;
  isEnabled?: boolean;
  selectedPlanId?: string;
};

export type BillingPlanProps = {
  plan: PlanModel;
  isSelected?: boolean;
  onSelectPlan?: (plan: PlanModel) => void;
  products: Product[] | null;
  selectedPlanId?: string | null;
  duplicatePlans?: PlanModel[] | null;
};

export const BillingPlan: FC<BillingPlanProps> = ({ plan, isSelected, onSelectPlan,selectedPlanId,products,duplicatePlans }) => {
  const theme = useTheme();
  const { t } = useTranslation(["BillingPlan"]);
  const [pricingPeriod, setPricingPeriod] = useState<"year" | "month" | undefined>(plan.recurring?.interval === "month" ? "month" : "year");
  const { nickname, active } = plan;
  const { plans } = useSelector((state: RootState) => state.billing);
  const isToggleDisabled = plans.filter(p => p.product === plan.product).length === 1;
  const hasMatchingDuplicates = duplicatePlans?.some(p => p.product === plan.product) ?? false;

  const monthlyPlan = hasMatchingDuplicates
    ? duplicatePlans?.find(p => p.recurring?.interval === "month" && p.product === plan.product) || plan
    : plan;

  const yearlyPlan = hasMatchingDuplicates
    ? duplicatePlans?.find(p => p.recurring?.interval === "year" &&  p.product === plan.product) || plan
    : plan;

     const price = pricingPeriod === "month"
     ? Math.floor((monthlyPlan.unit_amount ?? 0)) / 100
     : Math.floor((yearlyPlan.unit_amount ?? 0)) / 100;

     const plansInfo: PermissionItem[] = products
     ? products
         .filter((product) => product.id === plan.product && product.active === true)
         .flatMap((product) =>
           product.marketing_features.map((feature) => ({
             permissionValue: `${feature?.name || "N/A"}`,
             isEnabled: active,
           }))
         )
     : [];

    const productName = products?.find((product) => product.id === plan.product && product.active === true)?.name || "Unknown Plan";
    const firstWord = productName.split(" ")[0];

    const selectedPlan = plans.find(p => p.id === selectedPlanId);
    
    const selectedPrice =
    pricingPeriod === "month"
      ? Math.floor(
          duplicatePlans?.find(p =>
            p.product === selectedPlan?.product && p.recurring?.interval === "month"
          )?.unit_amount ?? selectedPlan?.unit_amount ?? 0
        ) / 100
      : Math.floor(
          duplicatePlans?.find(p =>
            p.product === selectedPlan?.product && p.recurring?.interval === "year"
          )?.unit_amount ?? selectedPlan?.unit_amount ?? 0
        ) / 100;
          
    let buttonLabel = t("SelectThisPlan");

    if (selectedPlanId) {
      if (isSelected) {
        buttonLabel = t("CurrentPlan");
      } else {
        if (price > selectedPrice) {
          buttonLabel = t("Upgrade");
        } else if (price < selectedPrice) {
          buttonLabel = t("SwitchToPlan");
        } else {
          buttonLabel = t("SwitchToPlan");
        }
      }
    }

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ height: "100%", py: 3, px: 2, borderRadius: theme.shape.borderRadius }}>
        <Stack spacing={2}>

        <Stack direction="row" justifyContent="space-between">
          <Typography fontWeight={500} variant="h6">
          {firstWord}
          </Typography>
        </Stack>

          <Stack direction="row" spacing={2} textAlign="center">
            <Typography fontWeight={500} variant="h4">
              {nickname}
            </Typography>
          </Stack>

          <Stack minHeight={110} justifyContent={"space-between"}>
          {duplicatePlans && duplicatePlans.length > 1 && (
              <Stack direction="row" alignItems={"center"}>
                <Typography sx={{ opacity: pricingPeriod === "year" ? 1 : 0.5 }}>
                  {t("BilledYearly")}
                </Typography>
                <StyledSwitch
                  onChange={() => setPricingPeriod(pricingPeriod === "year" ? "month" : "year")}
                  checked={pricingPeriod === "month"}
                  disabled={isToggleDisabled}
                />
                <Typography sx={{ opacity: pricingPeriod === "month" ? 1 : 0.5 }}> 
                  {t("BilledMonthly")}
                </Typography>
              </Stack>
            )}

            {price && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography fontWeight={700} variant="h4">
                  ${price}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.4 }} color="text.secondary">
                  {pricingPeriod === "month" ? "Per Month" : "Per Year"}
                </Typography>
              </Stack>
            )}
          </Stack>

          { nickname === "Enterprise" && (
            <Button sx={{ height: "40px", fontSize: "11.5px" }} fullWidth variant="contained">
              {t("ContactUs")}
            </Button>
          )}

          {nickname !== "Enterprise" && (
            <Button
            onClick={() => onSelectPlan?.(pricingPeriod === "year" ? yearlyPlan : monthlyPlan)}
            sx={{
              height: "40px",
              "&.Mui-disabled": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              },
            }}
            variant={isSelected ? "contained" : "outlined"}
            fullWidth
            disabled={isSelected}
          >
            {buttonLabel}
          </Button>         
          )}

          <List sx={{ m: 0, p: 0, marginTop: "auto", "&> li": { px: 0, py: 0.625, "& svg": { fill: theme.palette.success.dark } } }} component="ul">
            {plansInfo.map((planItem, i) => (
              <ListItem key={i} sx={{ opacity: planItem.isEnabled ? 1 : 0.4 }} divider={i !== plans.length - 1}>
                <CheckOutlined />
                <ListItemText sx={{ pl: 2 }} primary={ `${planItem.permissionValue}`}/>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Card>
    </Grid>
  );
};
