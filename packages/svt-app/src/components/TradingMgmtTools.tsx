import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import TradingMgmtToolESStrangles from "./TradingMgmtToolESStrangles"
import TradingMgmtToolEquityOptions from "./TradingMgmtToolEquityOptions"

export default function TradeingMgmtTools() {
  return (
    <Tabs>
      <TabList>
        <Tab _selected={{ color: "white", borderBottomColor: "#116DFD" }}>/ES Strangles</Tab>
        <Tab _selected={{ color: "white", borderBottomColor: "#116DFD" }}>Equity Options</Tab>
      </TabList>

      <TabPanels>
        <TabPanel p="0">
          <TradingMgmtToolESStrangles />
        </TabPanel>
        <TabPanel p="0">
          <TradingMgmtToolEquityOptions />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
