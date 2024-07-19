import tradingExecution from "./tradeExecution";
import { NavItemType } from "types/menu";
import settlements from "./settlements";
import admin from "./admin";
import accountHistory from "./accountHistory";

const menuItems: { items: NavItemType[] } = {
  items: [tradingExecution, settlements, accountHistory, admin],
};

export default menuItems;
