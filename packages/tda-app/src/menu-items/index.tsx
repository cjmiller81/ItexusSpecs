import tradingExecution from "./tradeExecution"
import { NavItemType } from "types/menu"
import accountFunding from "./account-funding"
import admin from "./admin"

const menuItems: { items: NavItemType[] } = {
  items: [tradingExecution, accountFunding, admin],
}

export default menuItems
