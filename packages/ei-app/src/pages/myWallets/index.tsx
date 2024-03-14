import { AppChart } from "@/components/Charts/AppChart"
import AppDatePicker from "@/components/common/inputs/AppDatePicker"
import AppSelect from "@/components/common/inputs/AppSelect"
import SymbolLookup, { LookUpOption } from "@/components/common/inputs/SymbolsLookup"
import {
  Period,
  StyledTypographyWalletsWorthTitle,
  StyledWalletWorthContainer,
  StyledWalletWorthMenu,
  StyledWalletWorthMenuContainer,
} from "@/containers/MyWallets/HistoricalWalletsWorth"
import { MyWalletsSection, WalletRow } from "@/containers/MyWallets/MyWalletsSection"
import { createWallet, deleteWallet, fetchWallets } from "@/libs/redux/Slices/WalletsSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { toOptions } from "@/utils/tokensTableHelpers"
import { Box, MenuItem, SelectChangeEvent, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function MyWalletsPage() {
  const { wallets, statusFetchingWallets } = useAppSelector(state => state.walletsReducer.wallets)
  const [period, setPeriod] = useState<Period>("daily")
  const [symbolOption, setSymbolOption] = useState<LookUpOption | null>(null)
  const dispatch = useAppDispatch()

  const { t } = useTranslation("MyWalletsPage")
  const walletsRows = wallets.map<WalletRow>(wallet => ({ ...wallet, expanded: false }))

  useEffect(() => {
    dispatch(fetchWallets(null))
  }, [dispatch])

  const options = toOptions(walletsRows)


  const onPeriodChanged = (event: SelectChangeEvent<unknown>) => {
    setPeriod(event.target.value as Period)
  }

  const toXAxesFormat = (period: Period): string => {
    switch (period) {
      case "daily":
        return "HH:mm"
      case "weekly":
        return "ddd"
      case "monthly":
        return "MMM"
      default:
        return "HH:mm"
    }
  }

  const percentageFormatter = (value: number) => `${value}%`
  return (
    <Stack>
      <MyWalletsSection
        loading={statusFetchingWallets === "loading"}
        wallets={walletsRows}
        onAddWallet={wallet => dispatch(createWallet(wallet))}
        onDeleteWallet={wallet => dispatch(deleteWallet(wallet))}
      />

      <StyledWalletWorthContainer sx={{ mt: 8 }}>
        <StyledWalletWorthMenuContainer>
          <StyledTypographyWalletsWorthTitle alignContent={"center"}>
            {t("HistoricalWalletsWorth")}
          </StyledTypographyWalletsWorthTitle>
          <StyledWalletWorthMenu>
            <AppSelect
              sx={{ width: "100%" }}
              label={t("Period")}
              value={period}
              variant="outlined"
              defaultValue={"daily"}
              onChange={onPeriodChanged}>
              <MenuItem value={"daily"}>{t("Daily")}</MenuItem>
              <MenuItem value={"weekly"}>{t("Weekly")}</MenuItem>
              <MenuItem value={"monthly"}>{t("Monthly")}</MenuItem>
            </AppSelect>
            <AppDatePicker
              disableFuture
              label={t("FromDate")}
            />
            <SymbolLookup
              onChange={option => setSymbolOption(option)}
              value={symbolOption}
              options={options}
              label={t("CompareToSymbol")}></SymbolLookup>
          </StyledWalletWorthMenu>
        </StyledWalletWorthMenuContainer>
        <Box sx={{ width: "100%" }}>
          <AppChart
            series={[]}
            height={460}
            optionsOverrides={{
              xaxis: {
                categories: [],
                labels: {
                  format: toXAxesFormat(period),
                },
              },
              yaxis: {
                labels: {
                  formatter: percentageFormatter,
                },
              },
              tooltip: {
                x: {
                  format: "yyyy-MM-dd HH:mm",
                },
                y: {
                  formatter: percentageFormatter,
                },
              },
            }}
          />
        </Box>
      </StyledWalletWorthContainer>
    </Stack>
  )
}
