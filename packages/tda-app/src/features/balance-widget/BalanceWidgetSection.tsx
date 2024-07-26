import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { StackProps } from "@mui/system";
import { FC } from "react";
import { toggleCryptoTable, toggleFiatTable } from "../nav-bar/navBarSlice";
import { cryptoBalances, fiatBalances } from "./mocks/cryptoBalances";
import BalanceWidget from "./widget/BalanceWidget";

const BalanceWidgetSection: FC<StackProps> = (props) => {
  const dispatch = useAppDispatch();
  const fiatOpen = useAppSelector(store => store.ui.fiatTableOpened);
  const cryptoOpen = useAppSelector(store => store.ui.cryptotableOpened);

  return (
    <BalanceWidget
    cryptoCurrencies={cryptoBalances}
    fiatCurrencies={fiatBalances}
    fiatOpen={fiatOpen}
    cryptoOpen={cryptoOpen}
    onCryptoToggle={() => dispatch(toggleCryptoTable())}
    onFiatToggle={() => dispatch(toggleFiatTable())}
    {...props}
    ></BalanceWidget>
  );
};

export default BalanceWidgetSection;
