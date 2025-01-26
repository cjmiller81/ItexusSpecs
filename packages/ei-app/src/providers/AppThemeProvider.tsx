"use client";

import { useAppSelector } from "@/libs/redux/Store";
import { getEIAppTheme } from "components";
import { createTheme, ThemeProvider } from "@mui/material";
import { ReactNode, useMemo } from "react";

interface Props {
  readonly children: ReactNode;
}

export const AppThemeProvider = ({ children }: Props) => {
  const { mode } = useAppSelector(store => store.ui);

  const theme = useMemo(() => createTheme(getEIAppTheme(mode)), [mode]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
