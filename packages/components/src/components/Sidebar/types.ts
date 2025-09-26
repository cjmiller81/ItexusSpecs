import { ReactNode } from "react";

export type SidebarItemChild = {
  icon?: ReactNode;
  title: string;
  href: string;
  disabled?: boolean;
};

export type SidebarItems = {
  title: string;
  sidebarListItems: SidebarListItem[];
  href?: string;
  isDisclaimer?: boolean;
};

export type SidebarListItem = {
  title: string;
  icon?: React.ReactNode;
  children?: SidebarItemChild[];
  href?: string;
  open?: boolean;
};
