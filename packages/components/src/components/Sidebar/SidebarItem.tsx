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

export function SidebarItem({ item, isSidebarOpened, open, setOpen }: Props) {
  return (
    <ListItem
      disablePadding
      sx={{ display: "block", padding: 0 }}>
      <ListItemButton
        sx={{
          minHeight: 48,
          px: 2.5,
          pl: 1.5,
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
        {!item.icon && !open && (
          <Box minWidth={"30px"}></Box>
        )}
        <>
          {item.children ? (
            <>
              <StyledTitleListItemText
                primary={item.title}
                sx={{ opacity: 1 }}
              />
              {open ? <ExpandLess /> : <ExpandMore />}
            </>
          ) : (
            <>
              {item.href ? (
                <AppLink
                  key={item.title}
                  passHref
                  href={item.href}
                  shallow>
                  <StyledTitleListItemText
                    primary={item.title}
                    sx={{ opacity: 1 }}
                  />
                </AppLink>
              ) : (
                <StyledTitleListItemText
                  primary={item.title}
                  sx={{ opacity: 1}}
                />
              )}
            </>
          )}
        </>
      </ListItemButton>
      {item.children && (
        <Collapse in={!isSidebarOpened ? false : open}>
          <List component="div">
            {item.children.map(child => {
              return (
                <AppLink
                  key={child.title}
                  passHref
                  href={child.href}
                  shallow>
                  <ListItemButton sx={{ pl: 3 }}>
                    <Box sx={{ stroke: "green" }}>{child.icon}</Box>
                    <ListItemText
                      primary={child.title}
                      sx={{ ml: 2 }}
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

const StyledTitleListItemText = styled(ListItemText)(() => ({
  span: {
    fontWeight: 500,
  },
}));
