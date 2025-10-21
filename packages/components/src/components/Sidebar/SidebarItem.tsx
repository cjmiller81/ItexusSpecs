"use client";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { AppLink } from "../common/AppLink";
import { SidebarListItem } from "./types";
import { useRouter } from "next/router";

interface Props {
  item: SidebarListItem & { open: boolean };
  isSidebarOpened: boolean;
  open: boolean;
  //eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
}

const StyledListItemButton = styled(ListItemButton)({
  "& > .MuiBox-root": {
    display: "none",
  },
});

export function SidebarItem({ item, isSidebarOpened, open, setOpen }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const isSelected = item.href === router.asPath;

  return (
    <ListItem
      disablePadding
      sx={{ display: "block", padding: 0 }}>
      <StyledListItemButton
      selected={isSelected}
        sx={{
          minHeight: 48,
          paddingLeft: 1.5,
          paddingRight: 2.5,
          borderRadius: theme.palette.mode === "light" ? "0px" : "8px",
          "&.Mui-selected": {
            backgroundColor: "#3e4d4c",
            color: "#ffffff",
            fontWeight: 600,
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "4px",
              backgroundColor: "#219a83",
            },
          },
        }}
        onClick={() => setOpen(!open)}>
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
          sx={{ 
            opacity: 1, 
            textAlign: "left",
            "& .MuiListItemText-primary": {
              color: theme.palette.mode === "light" ? "#ffffff" : theme.palette.text.primary,
            }
          }}
          primaryTypographyProps={{
            variant: "body1",
              sx: {
                fontSize: "15px ",
                fontWeight: 550,
            }
          }}
        />
        {item.children ? open ? <ExpandLess sx={{ color: theme.palette.mode === "light" ? "#ffffff" : undefined }} /> : <ExpandMore sx={{ color: theme.palette.mode === "light" ? "#ffffff" : undefined }} /> : null}
      </StyledListItemButton>

      {item.children && (
        <Collapse in={!isSidebarOpened ? false : open}>
          <List component="div">
            {item.children.map(child => {
              const isChildSelected = child.href === router.asPath;

              if (child.disabled) {
                return (
                  <ListItemButton
                    key={child.title}
                    disabled
                    sx={{ pl: 3, justifyContent: "flex-start", opacity: 0.5, cursor: "not-allowed" }}
                  >
                    <ListItemText
                      primary={child.title}
                      sx={{ textAlign: "left" }}
                    />
                  </ListItemButton>
                );
              }
              return (
                <AppLink
                  key={child.title}
                  passHref
                  href={child.href}
                  shallow
                >
                  <ListItemButton
                    selected={isChildSelected}
                    sx={{
                      pl: 3,
                      justifyContent: "flex-start",
                      borderRadius: theme.palette.mode === "light" ? "0px" : "8px",
                      "&.Mui-selected:hover": {
                        backgroundColor: "#3e4d4c",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#3e4d4c",
                        color: "#ffffff",
                        fontWeight: 600,
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: "4px",
                          backgroundColor: "#219a83",
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary={child.title}
                      sx={{ textAlign: "left" }}
                      primaryTypographyProps={{
                        variant: "body1",
                        sx: {
                          fontSize: "14px",
                          fontWeight: 420,
                          color: isChildSelected ? "#FFFFFF" : theme.palette.mode === "light" ? "#ffffff" : "lightgray",
                        }
                      }}
                    />

                    {child.title == "Derivatives" && (
                      <Box
                        sx={{
                          ml: 2,
                          px: 1,
                          py: 0.2,
                          backgroundColor: "#424242",
                          color: "lightgray",
                          borderRadius: "4px",
                          fontSize: "10px",
                          fontWeight: 500,
                          textTransform: "uppercase",
                        }}
                      >
                        Coming Soon
                      </Box>
                    )}
                  </ListItemButton>
                </AppLink>
              );
            })}
          </List>
        </Collapse>
      )}
    </ListItem>
  );
}
