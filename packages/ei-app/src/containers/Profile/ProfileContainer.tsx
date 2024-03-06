import { AppContainer } from "@/components/common/Containers/AppContainer"
import PageTitle from "@/components/TextDisplay/PageTitle"
import { Box, BoxProps } from "@mui/material"
import { TopBordered } from "./TopBordered"

export interface Props extends BoxProps {
  title: string
}

export const ProfileContainer = ({ title, children, ...props }: Props) => {
  return (
    <Box {...props}>
      <AppContainer sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Box>
          <PageTitle sx={{ textAlign: "left", p: 2 }}>{title}</PageTitle>
        </Box>
        <TopBordered sx={{ display: "flex", flexDirection: "column", width: "100%", p: 2 }}>{children}</TopBordered>
      </AppContainer>
    </Box>
  )
}
