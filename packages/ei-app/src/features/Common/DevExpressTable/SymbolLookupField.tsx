import { Box, Stack, StackProps } from "@mui/material";
import { useMemoizedImage } from "components";
import { FC } from "react";

type Props = StackProps & {
  imgHeight?: number;
  imgWidth?: number;
  iconUrl?: string;
  text: string;
};
export const SymbolLookupField: FC<Props> = ({ iconUrl, text, imgHeight, imgWidth, ...props }) => {
  const imageRef = useMemoizedImage(iconUrl);

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      {...props}
      gap={2}>
      <img
        style={{ borderRadius: "50%" }}
        height={imgHeight || 25}
        width={imgWidth || 25}
        ref={imageRef}
        alt={text}
      />
      <Box>{text}</Box>
    </Stack>
  );
};
