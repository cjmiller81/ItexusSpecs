import { Avatar, Typography } from "@mui/material"
import { Stack, StackProps } from "@mui/system"
import { formatDistanceToNow } from "date-fns"
import { FC } from "react"

type NewsHeaderProps = StackProps & {
  ago: number
  source: string
  tokensIconsUrls: (string | undefined)[]
}

export const NewsHeader: FC<NewsHeaderProps> = ({ ago, source, tokensIconsUrls, ...props }) => {
  const toTimeAgoString = (timestamp: number): string => {
    return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true })
  }

  return (
    <Stack
      {...props}
      direction={"row"}
      alignItems={"center"}
      gap={1}>
      {tokensIconsUrls.length > 0 && (
        <Stack
          direction={"row"}
          alignItems={"center"}>
          {tokensIconsUrls.map((url, index) => (
            <Avatar
              key={index}
              sx={{ width: 16, height: 16, ml: index === 0 ? 0 : -0.8 }}
              src={url}></Avatar>
          ))}
        </Stack>
      )}
      <Typography
        variant="body3"
        color={theme =>
          theme.palette.mode === "dark" ? theme.palette.grey[600] : theme.palette.grey[400]
        }>{`${toTimeAgoString(ago)} · ${source}`}</Typography>
    </Stack>
  )
}
