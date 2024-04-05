import { DropDownOptions, Lookup } from "devextreme-react/lookup"
import { ValueChangedEvent } from "devextreme/ui/lookup"
import { FC, useCallback, useEffect, useState } from "react"

import { BackendApiService, ICoin } from "@/services/backend-api.service"
import { ISymbolCellIdComponent, ISymbolLookup, ISymbolLookupField, ISymbolLookupListItem } from "./symbol-lookup.types"

import { useMemoizedImage } from "@/hooks/useMemorizedImage"
import { Box, Stack } from "@mui/material"
import { ColumnCellTemplateData } from "devextreme/ui/data_grid"
import styles from "./symbol-lookup.module.scss"

export const SymbolLookupFieldV2: FC<{ iconUrl?: string; symbol: string }> = ({ iconUrl, symbol }) => {
  const imageRef = useMemoizedImage(iconUrl)

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={2}>
      <img
        height={25}
        width={25}
        ref={imageRef}
        alt={symbol}
      />
      <Box>{symbol}</Box>
    </Stack>
  )
}

export const SymbolLookupField: FC<ISymbolLookupField> = ({ Description, IconUrl, Symbol }) => {
  if (Symbol && IconUrl) {
    return (
      <div className={styles.symbolLookupFieldContainer}>
        <picture>
          <img
            src={IconUrl}
            alt={`${Symbol.toUpperCase()} icon`}
          />
        </picture>
        <div>{`${Symbol.toUpperCase()}${Description ? ` - ${Description}` : ""}`}</div>
      </div>
    )
  }

  return <div className={styles.symbolLookupFieldContainer}>{`${Symbol?.toUpperCase() ?? "Select Symbol"}`}</div>
}

export const SymbolLookupListItem: FC<ISymbolLookupListItem> = ({ Category, Description, IconUrl, Symbol }) => {
  if (Symbol && IconUrl) {
    return (
      <div className={styles.symbolLookupListItemContainer}>
        <picture>
          <img
            src={IconUrl}
            alt={`${Symbol.toUpperCase()} icon`}
          />
        </picture>
        <div>{`${Symbol.toUpperCase()}${Description ? ` - ${Description}` : ""}${Category ?? ""}`}</div>
      </div>
    )
  }

  return <div className={styles.symbolLookupListItemContainer}>{`${Symbol?.toUpperCase() ?? "Select Symbol..."}`}</div>
}

export interface SymbolCellIdComponentV2Props {
  iconUrl?: string
  symbol: string
}

export const SymbolCellIdComponentV2: FC<{ data: ColumnCellTemplateData<ICoin> }> = ({ data }) => {
  return (
    <SymbolLookupFieldV2
      key={data.row.data.lURI}
      symbol={data.row.data.sym.toUpperCase()}
      iconUrl={data.row.data.lURI}></SymbolLookupFieldV2>
  )
}

export const SymbolCellIdComponent: FC<ISymbolCellIdComponent> = ({ data }) => {
  const [coin, setCoin] = useState<ICoin>({} as ICoin)

  useEffect(() => {
    async function fetchCoinData(coinId: string): Promise<void> {
      const coinData = (await BackendApiService.SymbolLookupDataSource.byKey(coinId).catch(_err => {
        return {
          id: data.value,
          sym: data.value,
        } as ICoin
      })) as ICoin

      if (coinData && coinData.id) {
        setCoin(coinData)
      }
    }

    if (data?.row?.data?.id) {
      void fetchCoinData(data.row.data.id)
    } else if (data?.value) {
      void fetchCoinData(data.value)
    }
  }, [data?.value, data?.row?.data?.id])

  return (
    <SymbolLookupField
      Description={""}
      IconUrl={coin?.lURI ?? ""}
      Symbol={coin?.sym ?? ""}
    />
  )
}

export const SymbolLookup: FC<ISymbolLookup> = ({
  DataSource,
  DataSourceKey,
  FieldRender,
  ItemRender,
  defaultValue,
  onValueChanged,
}) => {
  const [fieldState, setFieldState] = useState(defaultValue)
  const [symbolListPrimed, setSymbolListPrimed] = useState<boolean>(false)

  const onSymbolLookupValueChange = useCallback(
    (e: ValueChangedEvent) => {
      let symbolId = e.value as string

      if (onValueChanged) {
        setFieldState(symbolId ?? "")
        onValueChanged(e)
      }
    },
    [onValueChanged],
  )

  useEffect(() => {
    // Init
    console.log("init", symbolListPrimed)
    async function loadDataSource(): Promise<void> {
      console.log("init loadDataSource called")
      await DataSource.load()
    }

    if (!symbolListPrimed) {
      console.log("init !symbolListPrimed calling loadDataSource")
      setSymbolListPrimed(true)
      void loadDataSource()
    }
  }, [DataSource, symbolListPrimed])

  return (
    <div className={styles.symbolLookupContainer}>
      <Lookup
        className={styles.symbolLookup}
        valueExpr={DataSourceKey}
        dataSource={DataSource}
        onValueChanged={onSymbolLookupValueChange}
        searchEnabled={true}
        searchExpr={["sym"]}
        value={fieldState}
        showClearButton={true}
        fieldRender={FieldRender ?? SymbolLookupField}
        itemRender={ItemRender ?? SymbolLookupListItem}>
        <DropDownOptions
          title="Select Symbol"
          width="300"
        />
      </Lookup>
    </div>
  )
}
