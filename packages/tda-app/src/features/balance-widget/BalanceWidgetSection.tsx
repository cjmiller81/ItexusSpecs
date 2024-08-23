import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { StackProps } from "@mui/system";
import { FC } from "react";
import { toggleCryptoTable, toggleFiatTable } from "../nav-bar/navBarSlice";
import BalanceWidget from "./widget/BalanceWidget";

const BalanceWidgetSection: FC<StackProps> = props => {
  const dispatch = useAppDispatch();
  const fiatOpen = useAppSelector(store => store.ui.fiatTableOpened);
  const cryptoOpen = useAppSelector(store => store.ui.cryptotableOpened);

  const cryptoCurrencies = useAppSelector(store => store.balancesWidget.cryptoCurrencies);
  const fiatCurrencies = useAppSelector(store => store.balancesWidget.fiatCurrencies);

  const { position, ...restProps } = props;

  return (
    <BalanceWidget
      cryptoCurrencies={cryptoCurrencies}
      fiatCurrencies={fiatCurrencies}
      fiatOpen={fiatOpen}
      cryptoOpen={cryptoOpen}
      onCryptoToggle={() => dispatch(toggleCryptoTable())}
      onFiatToggle={() => dispatch(toggleFiatTable())}
      {...restProps}
    />
  );
};

export default BalanceWidgetSection;
