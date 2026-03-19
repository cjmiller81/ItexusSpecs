import React from "react";
import { Box, ListItemButton, ListItemIcon, ListItemText, useTheme, Typography } from "@mui/material";
import List from "@mui/material/List";
import { SidebarItem } from "./SidebarItem";
import { SidebarListItem } from "./types";
import { AppLink } from "../common";
import { useRouter } from "next/router";

interface Props {
  sectionName: string;
  items: (SidebarListItem & { open?: boolean })[];
  open: boolean;
  toggleSide: Function;
  //eslint-disable-next-line no-unused-vars
  onSetItemOpen: (title: string, open: boolean) => void;
  icon?: React.ReactNode;
  isDisclaimer?: boolean;
  isLastInGroup?: boolean;
}

export const SidebarSection = ({ sectionName, items, open, onSetItemOpen, toggleSide, isDisclaimer, isLastInGroup }: Props) => {
  const theme = useTheme();
  const router = useRouter();

  // Special handling for disclaimer section
  if (isDisclaimer) {
    return (
      <Box
        sx={{
          padding: '20px 16px',
          marginTop: '24px',
          transition: 'all 0.2s ease',
          '&:hover': {
            '& .disclaimer-title': {
              color: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.65)'
                : 'rgba(0, 0, 0, 0.70)',
            },
            '& .disclaimer-body': {
              color: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.55)'
                : 'rgba(0, 0, 0, 0.60)',
            }
          }
        }}
      >
        <Typography
          variant="overline"
          className="disclaimer-title"
          sx={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.45)'
              : 'rgba(0, 0, 0, 0.50)',
            display: 'block',
            marginBottom: '8px',
            textTransform: 'uppercase',
            transition: 'color 0.2s ease',
          }}
        >
          Disclaimer
        </Typography>

        <Typography
          variant="caption"
          className="disclaimer-body"
          sx={{
            fontSize: '11px',
            lineHeight: 1.5,
            color: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.35)'
              : 'rgba(0, 0, 0, 0.40)',
            fontWeight: 400,
            letterSpacing: '0.02em',
            display: 'block',
            transition: 'color 0.2s ease',
            whiteSpace: "normal",
            wordWrap: "break-word"
          }}
        >
          Elan Insights provides research and analytics only. Nothing on elaninsights.com or elaninsights.io constitutes investment recommendations. Users remain in full control of their own accounts and are solely responsible for their own financial decisions. Please see links to our policies and terms above for further information.
        </Typography>
      </Box>
    );
  }

  return (
    <List
      sx={{
        width: "100%",
        bgcolor: theme.palette.mode === "light" ? "#363640" : "background.paper",
        pb: 0,
        pt: 0,
        overflowX: "hidden",
        // Add spacing after last item in each visual group
        mb: isLastInGroup ? '24px' : '4px',
      }}
      component="nav"
      onClick={() => toggleSide(true)}
      id={sectionName === "Platform" ? "ei-platform-menu" : undefined}
    >
      {items.map((item, index) => {
        if (!item.children?.length && item.href) {
          // Check if this item is selected
          const isSelected = router.asPath === item.href || router.asPath + '/' === item.href || router.asPath === item.href + '/';

          return (
            <Box key={index}>
              <AppLink
                key={item.title}
                passHref
                href={item.href}
                shallow>
                <ListItemButton
                  selected={isSelected}
                  sx={{
                  height: "40px",
                  minHeight: "40px",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  paddingLeft: "17px",
                  paddingRight: "20px",
                  borderLeft: "3px solid transparent",
                  justifyContent: "flex-start",
                  borderRadius: theme.palette.mode === "light" ? "0px" : "8px",
                  transition: "background-color 0.2s ease",
                  "&.Mui-selected": {
                    borderLeft: `3px solid ${theme.palette.primary.main}`,
                    backgroundColor: theme.palette.mode === "dark"
                      ? "rgba(33, 154, 131, 0.08)"
                      : "rgba(33, 154, 131, 0.06)",
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    "& .MuiListItemIcon-root": {
                      color: theme.palette.primary.main,
                    },
                    "&:hover": {
                      backgroundColor: theme.palette.mode === "dark"
                        ? "rgba(33, 154, 131, 0.12)"
                        : "rgba(33, 154, 131, 0.10)",
                    },
                  },
                  "&:hover": {
                    backgroundColor: theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.03)",
                  },
                }}>
                  {item.icon && (
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 1.5,
                        justifyContent: "center",
                        color: theme.palette.mode === "light" ? "#ffffff" : theme.palette.text.primary,
                      }}>
                      {item.icon}
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      variant: "body1",
                      sx: {
                        fontSize: "15px ",
                        fontWeight: 600,
                        color: theme.palette.mode === "light" ? "#ffffff" : theme.palette.text.primary,
                      }
                    }}
                    sx={{ textAlign: "left" }}
                  />
                </ListItemButton>
              </AppLink>
            </Box>
          );
        }
        return (
          <Box key={index}>
            <SidebarItem
              key={index}
              item={{...item, open: item.open || false}}
              open={item.open || false}
              setOpen={open => onSetItemOpen(item.title, open)}
              isSidebarOpened={open}
            />
          </Box>
        );
      })}
    </List>
  );
};
