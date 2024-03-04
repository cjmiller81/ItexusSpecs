import { Collapse, ListSubheader } from "@mui/material"
import List from "@mui/material/List"
import { SidebarListItem } from "./consts"
import SidebarItem from "./SidebarItem"

interface Props {
  sectionName: string
  items: SidebarListItem[]
  open: boolean
  toggleSide: Function
  //eslint-disable-next-line no-unused-vars
  onSetItemOpen: (title: string, open: boolean) => void
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
      {items.map(item => (
        <SidebarItem
          key={item.title}
          item={item}
          open={item.open}
          setOpen={open => onSetItemOpen(item.title, open)}
          isSidebarOpened={open}
        />
      ))}
    </List>
  )
}
