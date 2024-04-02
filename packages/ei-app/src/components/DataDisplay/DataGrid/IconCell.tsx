import { useMemoizedImage } from '@/hooks/useMemorizedImage';
import { Box, BoxProps } from '@mui/material';

export const IconCell = ({ symbol, iconUrl }: BoxProps & {symbol: string, iconUrl?: string}) => {
  const imageRef = useMemoizedImage(iconUrl)
  return (
    <Box
      component="div"
      sx={{ "& > img": { mr: 2, flexShrink: 0 }, display: "flex", alignItems: "flex-end" }}>
      <img
        loading="lazy"
        width="20"
        ref={imageRef}
        alt=""
      />
      <Box sx={{ fontSize: "14px" }}>{symbol}</Box>
    </Box>
  )
}
