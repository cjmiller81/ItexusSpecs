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
          borderRadius: "8px",
        }}
        onClick={() => setOpen(!open)}>
        {item.icon && (
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: 1.5,
              justifyContent: "center",
            }}>
            {item.icon}
          </ListItemIcon>
        )}
        <ListItemText
          primary={item.title}
          sx={{ opacity: 1, textAlign: "left" }}
          primaryTypographyProps={{
            variant: "body1",
              sx: {
                fontSize: "15px ",
                fontWeight: 550,
            }
          }}
        />
        {item.children ? open ? <ExpandLess /> : <ExpandMore /> : null}
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
                      borderRadius: "8px",
                      "&.Mui-selected:hover": {
                        backgroundColor: "#219a83",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#219a83",
                        color: theme.palette.primary.main,
                        fontWeight: 600,
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
                          color: isChildSelected ? "#FFFFFF" : theme.palette.mode === "light" ? "#707070" : "lightgray",
                        }
                      }}
                    />

                    {child.title == "Derivatives" && (
                      <Box
                        sx={{
                          ml: 2,
                          px: 1,
                          py: 0.2,
                          backgroundColor: theme.palette.mode === "light" ? "#e0e0e0" : "#424242",
                          color: theme.palette.mode === "light" ? "#333" : "lightgray",
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
