import { StackProps } from "@mui/system";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { BalanceModel } from "../BalanceModel";
import { cryptoCoinsColumns } from "../cryptoCoinsColumns";
import DenseTable from "../DenseTable";
import { TableHeader } from "./TableHeader";
import { TableSecondary } from "./TableSecondary";
import { Stack } from "@mui/system";
import { cryptoBalances } from "../mocks/cryptoBalances";
import { fiatCoinsColumns } from "features/balance-widget/fiatCoinsColumns";

export type BalanceWidgetProps = {
  cryptoCurrencies: BalanceModel[];
  fiatCurrencies: BalanceModel[];
  fiatOpen?: boolean;
  cryptoOpen?: boolean;
  onCryptoToggle: () => void;
  onFiatToggle: () => void;
} & StackProps;

const BalanceWidget: FC<BalanceWidgetProps> = ({
  cryptoCurrencies,
  fiatCurrencies,
  fiatOpen,
  cryptoOpen,
  onCryptoToggle,
  onFiatToggle,
  ...props
}) => {
  const { t } = useTranslation("BalanceWidget");
  return (
    <Stack
      spacing={2}
      width={theme => theme.spacing(24)}
      {...props}>
      <DenseTable
        isOpen={cryptoOpen}
        title={
          <TableHeader
            open={cryptoOpen}
            onOpenToggle={onCryptoToggle}
            title={t("CryptoBalances")}
          />
        }
        secondary={
          <TableSecondary
            data={cryptoBalances}
            fileName="crypto.csv"
            columns={cryptoCoinsColumns}
          />
        }
        columns={cryptoCoinsColumns}
        data={cryptoBalances}
      />

      <DenseTable
        isOpen={fiatOpen}
        columns={fiatCoinsColumns}
        data={fiatCurrencies}
        secondary={
          <TableSecondary
            data={fiatCurrencies}
            fileName="fiat.csv"
            columns={fiatCoinsColumns}
          />
        }
        title={
          <TableHeader
            open={fiatOpen}
            onOpenToggle={onFiatToggle}
            title={t("FiatBalances")}
          />
        }
      />
    </Stack>
  );
};

export default BalanceWidget;
