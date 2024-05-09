import { FC } from "react"
import { useMemoizedImage } from "components"
import { Box, Stack } from "@mui/material"

export const SymbolLookupField: FC<{ iconUrl?: string; symbol: string }> = ({ iconUrl, symbol }) => {
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
