import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { TabPanel } from "../Automation";
import { Button } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface AutomationTabsProps {
  capitalAllocation: number;
  tabs: TabPanel[];
  onAddStrategy: () => void;
}

export default function AutomationTabs({ capitalAllocation, onAddStrategy, tabs }: AutomationTabsProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onAddStrategyClick = () => {
    onAddStrategy()
  }

  return (
    <Box
      sx={{ width: "100%", border: "2px solid #4156be", borderRadius: "6px" }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider", padding: "16px" }}>
      <Button
          variant="outlined"
          onClick={onAddStrategyClick}
          sx={{ mr: 1 }}
        >
          {"+ Add Strategy"}
        </Button>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {tabs.map((tab, key) => (
            <Tab label={tab.label} {...a11yProps(key)} key={key} />
          ))}
        </Tabs>
      </Box>
      {tabs.map((tab, key) => (
        <CustomTabPanel value={value} index={key} key={key}>
          <Box
            sx={{
              border: "2px solid #828282",
              borderRadius: "6px",
              background: "#2c3036",
              height: "100%",
              widht: "100%",
              margin: "-10px",
            }}
          >
            {tab.component}
          </Box>
        </CustomTabPanel>
      ))}
    </Box>
  );
}
