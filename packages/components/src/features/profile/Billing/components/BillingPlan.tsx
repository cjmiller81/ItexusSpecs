import { FC, useState } from "react";
import { Grid, Card, Stack, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckOutlined from "@ant-design/icons/CheckOutlined";
import { StyledSwitch } from "./StyledSwitch";
import { PlanModel } from "../models/PlanModel";
import { Product } from "../models/Product";
import { useTranslation } from "react-i18next";



export type PermissionItem = {
  permissionValue?: string;
  isEnabled?: boolean;
  selectedPlanId?: string;
};

export type BillingPlanProps = {
  plan: PlanModel;
  isSelected?: boolean;
  onSelectPlan?: () => void;
  products: Product[] | null;
  selectedPlanId?: string | null;
};

export const BillingPlan: FC<BillingPlanProps> = ({ plan, isSelected, onSelectPlan,selectedPlanId,products }) => {
  const theme = useTheme();
    const { t } = useTranslation(["BillingPlan"]);
  const [pricingPeriod, setPricingPeriod] = useState<"year" | "month" | undefined>(plan.unitAmount ? "month" : undefined);
  
  const { nickname, unitAmount, recurring, active } = plan;

  const price = unitAmount ? unitAmount / 100 : undefined;

  const plans: PermissionItem[] = products
    ? products
        .filter((product) => product.id === plan.productId)
        .flatMap((product) => [
          {
            permissionValue: product.marketingFeatures[0]?.name || "N/A",
            isEnabled: active,
          },
          {
            permissionValue: product.marketingFeatures[1]?.name || "N/A",
            isEnabled: active,
          },
          {
            permissionValue: product.marketingFeatures[2]?.name || "N/A",
            isEnabled: active,
          },
        ])
    : [];

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ height: "100%", py: 3, px: 2, borderRadius: theme.shape.borderRadius }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} textAlign="center">
            <Typography fontWeight={500} variant="h4">
              {nickname}
            </Typography>
          </Stack>

          <Stack minHeight={110} justifyContent={"space-between"}>
            {pricingPeriod && (
              <Stack direction="row" alignItems={"center"}>
                <Typography sx={{ opacity: pricingPeriod === "year" ? 1 : 0.5 }}>
                  {t("BilledYearly")}
                </Typography>
                <StyledSwitch
                  onChange={() => setPricingPeriod(pricingPeriod === "year" ? "month" : "year")}
                  checked={pricingPeriod === "month"}
                />
                <Typography sx={{ opacity: pricingPeriod === "month" ? 1 : 0.5 }}> 
                  {t("BilledMonthly")}
                </Typography>
              </Stack>
            )}

            {price && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography fontWeight={700} variant="h4">
                  {pricingPeriod === "year" ? `$${price * 12}` : `$${price}`}
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
            <Button onClick={onSelectPlan} sx={{ height: "40px" }} variant={isSelected ? "contained" : "outlined"} fullWidth>
             {selectedPlanId !== null ? (isSelected ? t("CurrentPlan")  : t("SwitchToPlan") ) : t("SelectThisPlan")}
            </Button>
          )}

          <List sx={{ m: 0, p: 0, marginTop: "auto", "&> li": { px: 0, py: 0.625, "& svg": { fill: theme.palette.success.dark } } }} component="ul">
            {plans.map((planItem, i) => (
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
