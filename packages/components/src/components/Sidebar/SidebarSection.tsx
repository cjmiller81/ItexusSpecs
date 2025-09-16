import { Box, Collapse, ListItemButton, ListItemText, ListSubheader, useTheme } from "@mui/material";
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
  icon?: React.ReactNode;
}

export const SidebarSection = ({ sectionName, items, open, onSetItemOpen, toggleSide }: Props) => {
  const theme = useTheme();
  return (
    <List
      sx={{ width: "100%", bgcolor: "background.paper", pb: 0, overflowX: "hidden" }}
      component="nav"
      onClick={() => toggleSide(true)}
      aria-labelledby="tools-subheader"
      id={sectionName === "Platform" ? "ei-platform-menu" : undefined}
      subheader={
        <Collapse
          orientation="vertical"
          in={open}>
          <ListSubheader
            sx={{
              fontSize: "11px",
              px: 2,
              py: 0.5,
              lineHeight: 1.2,
            }}
            component="div"
            id="tools-subheader"
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <span>{sectionName}</span>

              {sectionName === "Community" && (
                <Box
                  sx={{
                    px: 0.7,
                    py: 0.3,
                    marginLeft:"25%",
                    backgroundColor:
                      theme.palette.mode === "light" ? "#e0e0e0" : "#424242",
                    color:
                      theme.palette.mode === "light" ? "#333" : "lightgray",
                    borderRadius: "4px",
                    fontSize: "9px",
                    fontWeight: 500,
                    lineHeight: 1.2,
                    textTransform: "uppercase",
                  }}
                >
                  Coming Soon
                </Box>
              )}
            </Box>
          </ListSubheader>
        </Collapse>
      }>
      {items.map((item, index) => {
        if (!item.children?.length && item.href) {
          return (
            <Box key={index}>
              <AppLink
                key={item.title}
                passHref
                href={item.href}
                shallow>
                <ListItemButton sx={{ pl: 1.5, justifyContent: "flex-start" }}>
                  {item.icon && <span style={{ marginRight: "12px", marginTop: "2px" }}>{item.icon}</span>}
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      variant: "body1",
                      sx: {
                        fontSize: "15px ",
                        fontWeight: 600,
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
