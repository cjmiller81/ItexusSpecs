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
  selectWallets,
  updateWallet,
} from "../../slices/walletsSlice"
import { MyWalletsSection } from "../myWallets/MyWalletsSection"
import { Wallet } from "../../models"
import { toTableTokensModel } from "../../utils/tokensTableHelpers"

interface Props extends BoxProps {}

export const WalletsContainer = ({ ...props }: Props) => {
  const { wallets, statusFetchingWallets, totalWalletsWorthData, selectedWallets, exchanges } = useAppSelector(
    state => state.wallets,
  )
  const [totalAmount,setTotalAmount] = useState<number>(0);

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (wallets === null) dispatch(fetchWallets(null))
  }, [dispatch])

  useEffect(() => {
    if (exchanges === null) dispatch(fetchExchanges(null))
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchTotalWalletsWorthData({}))
  }, [selectedWallets])

  const calculateTotalUsdAmount = (selectedWallets: Wallet[]): number => {
    let totalUsdAmount = 0;

    selectedWallets.forEach(wallet => {
      wallet.chainAssets.forEach(chainAsset => {
        const tableAssets = toTableTokensModel(chainAsset);

        tableAssets.forEach(asset => {
          if (asset.usdAmount) {
            totalUsdAmount += asset.usdAmount;
          }
        });
      });
    });

    return totalUsdAmount;
  };

  useEffect(() => {
    if (selectedWallets.length) {
      setTotalAmount(calculateTotalUsdAmount(selectedWallets));
    } else {
      setTotalAmount(0);
    }
  }, [selectedWallets]);

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
