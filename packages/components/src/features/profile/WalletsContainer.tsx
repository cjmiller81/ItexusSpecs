import { Box, BoxProps } from "@mui/material"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../slices"
import {
  createWallet,
  deleteExchange,
  deleteWallet,
  fetchExchanges,
  fetchTotalWalletsWorthData,
  fetchWallets,
  fetchWalletsPortfolio,
  selectWallets,
  updateWallet,
} from "../../slices/walletsSlice"
import { MyWalletsSection } from "../myWallets/MyWalletsSection"
import { Wallet } from "../../models"

interface Props extends BoxProps {
  lifiChainMap?: Map<number, any> | null;
}

export const WalletsContainer = ({ lifiChainMap, ...props }: Props) => {
  const { wallets, statusFetchingWallets, totalWalletsWorthData, selectedWallets, exchanges, portfolioWalletData } = useAppSelector(
    state => state.wallets,
  )
  const [totalAmount,setTotalAmount] = useState<number>(0);

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (wallets && wallets.length > 0 && lifiChainMap) {
      const addresses = wallets.map(w => w.address);
      dispatch(fetchWalletsPortfolio({ addresses, lifiChainMap }));
    }
  }, [wallets, dispatch, lifiChainMap]);

  useEffect(() => {
    if (wallets === null) dispatch(fetchWallets(null))
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchExchanges(null))
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchTotalWalletsWorthData({}))
  }, [selectedWallets])

  const calculateTotalUsdAmount = (selectedWallets: Wallet[], portfolioData: any[]): number => {
    let totalUsdAmount = 0;

    selectedWallets.forEach(wallet => {
      const portfolioWallet = portfolioData.find(p => p.walletAddress === wallet.address);
      if (portfolioWallet) {
        totalUsdAmount += portfolioWallet.totalValueUSD;
      }
    });

    return totalUsdAmount;
  };

  useEffect(() => {
    if (selectedWallets.length && portfolioWalletData.length) {
      setTotalAmount(calculateTotalUsdAmount(selectedWallets, portfolioWalletData));
    } else {
      setTotalAmount(0);
    }
  }, [selectedWallets, portfolioWalletData]);

  return (
    <Box {...props}>
      <MyWalletsSection
        onUpdateWallet={wallet => dispatch(updateWallet(wallet))}
        selectedWalletsIds={selectedWallets.map(wallet => wallet.address)}
        totalWalletsWorthData={totalWalletsWorthData}
        loading={statusFetchingWallets === "loading"}
        wallets={wallets}
        exchanges={exchanges}
        onSelectedRowsChanged={rows => dispatch(selectWallets(rows))}
        onAddWallet={wallet => dispatch(createWallet(wallet))}
        onDeleteWallet={wallet => dispatch(deleteWallet(wallet))}
        onDeleteExchange={exchange => dispatch(deleteExchange(exchange))}
        totalAmount={totalAmount}
      />
    </Box>
  )
}
