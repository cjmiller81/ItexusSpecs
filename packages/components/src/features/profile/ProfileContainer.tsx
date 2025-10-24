import { Box, BoxProps, styled } from "@mui/material"
import { TopBordered } from "./TopBordered"
import React from "react"
import { AppContainer } from "../../components"
import { PageTitle } from "../../components/TextDisplay/PageTitle"

interface Props extends BoxProps {
  title: string
  endAdortment?: React.ReactNode
  contentBgColor?: string
}

export const ProfileContainer = ({ title, endAdortment, contentBgColor, children, ...props }: Props) => {
  return (
    <Box {...props}>
      <AppContainer sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <HeaderContainer>
          <HeaderPageTitle>{title}</HeaderPageTitle>
          {endAdortment}
        </HeaderContainer>
        <TopBordered sx={(theme) => ({ 
          display: "flex", 
          flexDirection: "column", 
          width: "100%", 
          p: 2,
          backgroundColor: contentBgColor && theme.palette.mode === "light" ? contentBgColor : "transparent"
        })}>{children}</TopBordered>
      </AppContainer>
    </Box>
  )
}

export const HeaderContainer:any = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === "light" ? "#f7f5f2" : "transparent",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}))

export const HeaderPageTitle:any = styled(PageTitle)(({ theme }) => ({
  textAlign: "left",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    width: "auto",
    textAlign: "center",
  },
}))
