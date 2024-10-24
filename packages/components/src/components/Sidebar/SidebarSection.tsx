import { Box, Collapse, ListItemButton, ListItemText, ListSubheader } from "@mui/material";
import List from "@mui/material/List";
import { SidebarItem } from "./SidebarItem";
import { SidebarListItem } from "./types";
import { AppLink } from "../common";

interface Props {
  sectionName: string;
  items: (SidebarListItem & { open: boolean })[];
  open: boolean;
  toggleSide: Function;
  //eslint-disable-next-line no-unused-vars
  onSetItemOpen: (title: string, open: boolean) => void;
}

export const SidebarSection = ({ sectionName, items, open, onSetItemOpen, toggleSide }: Props) => {
  return (
    <List
      sx={{ width: "100%", bgcolor: "background.paper", pb: 0 }}
      component="nav"
      onClick={() => toggleSide(true)}
      aria-labelledby="tools-subheader"
      subheader={
        <Collapse
          orientation="vertical"
          in={open}>
          <ListSubheader
            className="test"
            component="div"
            id="tools-subheader">
            {sectionName}
          </ListSubheader>
        </Collapse>
      }>
      {items.map((item, index) => {
        debugger;
        if (!item.children?.length && item.href) {
          return (
            <Box key={index}>
              <AppLink
                key={item.title}
                passHref
                href={item.href}
                shallow>
                <ListItemButton sx={{ pl: 1.5, justifyContent: "flex-start" }}>
                  <ListItemText
                    primary={item.title}
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
              item={item}
              open={item.open}
              setOpen={open => onSetItemOpen(item.title, open)}
              isSidebarOpened={open}
            />
          </Box>
        );
      })}
    </List>
  );
};
