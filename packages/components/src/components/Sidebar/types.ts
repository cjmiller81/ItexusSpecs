import { ReactNode } from "react";

export type SidebarItemChild = {
  icon?: ReactNode;
  title: string;
  href: string;
};

export type SidebarItems = {
  title: string;
  sidebarListItems: SidebarListItem[];
  href?: string;
};

export type SidebarListItem = {
  title: string;
  icon?: React.ReactNode;
  children?: SidebarItemChild[];
  href?: string;
  open?: boolean;
};
