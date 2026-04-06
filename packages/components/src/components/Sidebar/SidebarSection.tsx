import React from "react";
import { Box, ListItemButton, ListItemIcon, ListItemText, useTheme, Typography } from "@mui/material";
import List from "@mui/material/List";
import { SidebarItem } from "./SidebarItem";
import { SidebarListItem } from "./types";
import { AppLink } from "../common";
import { useRouter } from "next/router";
import {APP_CONSTANTS} from "../../constants/strings";

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
              color: 'rgba(255, 255, 255, 0.65)',
            },
            '& .disclaimer-body': {
              color: 'rgba(255, 255, 255, 0.55)',
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
            color: 'rgba(255, 255, 255, 0.45)',
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
            color: 'rgba(255, 255, 255, 0.35)',
            fontWeight: 400,
            letterSpacing: '0.02em',
            display: 'block',
            transition: 'color 0.2s ease',
            whiteSpace: "normal",
            wordWrap: "break-word"
          }}
        >
          {APP_CONSTANTS.DISCLAIMER_TEXT}
        </Typography>
      </Box>
    );
  }

  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "#363640",
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
                    height: open ? "40px" : "42px",
                    minHeight: open ? "40px" : "42px",
                    paddingTop: open ? "12px" : "0px",
                    paddingBottom: open ? "12px" : "0px",
                    paddingLeft: open ? "17px" : "0px",
                    paddingRight: open ? "20px" : "0px",
                    borderLeft: "3px solid transparent",
                    justifyContent: open ? "flex-start" : "center",
                    borderRadius: "8px",
                    transition: "background-color 0.2s ease, height 0.2s, padding 0.2s",
                    "&.Mui-selected": {
                      borderLeft: `3px solid ${theme.palette.primary.main}`,
                      backgroundColor: "rgba(33, 154, 131, 0.08)",
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      "& .MuiListItemIcon-root": {
                        color: theme.palette.primary.main,
                      },
                      "&:hover": {
                        backgroundColor: "rgba(33, 154, 131, 0.12)",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                    },
                  }}>
                  {item.icon && (
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 1.5 : 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: open ? 17 : 24,
                        height: open ? 17 : 24,
                        color: "#ffffff",
                        transition: 'all 0.2s',
                        '& svg': {
                          fontSize: open ? 17 : 24,
                          transition: 'font-size 0.2s',
                        },
                      }}>
                      {item.icon}
                    </ListItemIcon>
                  )}
                  {open && (
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        variant: "body1",
                        sx: {
                          fontSize: "15px ",
                          fontWeight: 600,
                          color: "#ffffff",
                        }
                      }}
                      sx={{ textAlign: "left" }}
                    />
                  )}
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
