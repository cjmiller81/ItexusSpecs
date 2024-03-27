import PageTitle from "@/components/TextDisplay/PageTitle"
import { AppContainer } from "@/components/common/Containers/AppContainer"
import { Box, BoxProps, styled } from "@mui/material"
import { TopBordered } from "./TopBordered"
import React from "react"

export interface Props extends BoxProps {
  title: string
  endAdortment?: React.ReactNode
}

export const ProfileContainer = ({ title, endAdortment, children, ...props }: Props) => {
  return (
    <Box {...props}>
      <AppContainer sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <HeaderContainer>
          <HeaderPageTitle>{title}</HeaderPageTitle>
          {endAdortment}
        </HeaderContainer>
        <TopBordered sx={{ display: "flex", flexDirection: "column", width: "100%", p: 2 }}>{children}</TopBordered>
      </AppContainer>
    </Box>
  )
}

export const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}))

export const HeaderPageTitle = styled(PageTitle)(({ theme }) => ({
  textAlign: "left",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    width: "auto",
    textAlign: "center",
  },
}))
