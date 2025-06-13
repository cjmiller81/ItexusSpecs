"use client";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AppLink } from "../common/AppLink";
import { SidebarListItem } from "./types";

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
  return (
    <ListItem
      disablePadding
      sx={{ display: "block", padding: 0 }}>
      <StyledListItemButton
        sx={{
          minHeight: 48,
          paddingLeft: 1.5,
          paddingRight: 2.5,
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
        />
        {item.children ? open ? <ExpandLess /> : <ExpandMore /> : null}
      </StyledListItemButton>

      {item.children && (
        <Collapse in={!isSidebarOpened ? false : open}>
          <List component="div">
            {item.children.map(child => {
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
                  <ListItemButton sx={{ pl: 3, justifyContent: "flex-start" }}>
                    <ListItemText
                      primary={child.title}
                      sx={{ textAlign: "left" }}
                    />
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
