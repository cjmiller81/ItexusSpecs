export type SidebarItemChild = {
  title: string
  href: string
}

export type SidebarItems = {
  title: string
  sidebarListItems: SidebarListItem[]
}

export type SidebarListItem = {
  title: string
  icon: React.ReactNode
  children?: SidebarItemChild[]
  href?: string
  open: boolean
}
