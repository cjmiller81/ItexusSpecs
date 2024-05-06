import React, { useEffect, useState } from "react";
import AutomationTabs from "./tabs";
import PositionTable, { IPositionTableRow } from "./position-table";
import { SvtIvlEsStrategySetStatus } from "../../../../services/tradingPlatformService";

import "./Automation.scss";

export interface TabPanel {
  value: string;
  label: string;
  component?: any;
}

interface AutomationComponentProps {
  strategyAccountConnectState: SvtIvlEsStrategySetStatus;
  automationRunning: boolean;
  onAddStrategy: () => void;
  onAutomationRunningChange: (newAutomationRunning: boolean) => void;
  onClosingOnlyChange: (closingOnly: boolean, localOnly: boolean) => void;
  onCapitalAllocationChange: (newCapitalAllocation: number, localOnly: boolean) => void;
  errorMessage: string;
  onDeleteStrategy: (id: string) => void;
  onStopStrategy: (id: string) => void;
  onStartStrategy: (id: string) => void;
  strategiesRows: IPositionTableRow[]
}

const AutomationComponent: React.FC<AutomationComponentProps> = ({
  strategyAccountConnectState,
  onAddStrategy,
  strategiesRows,
  onStopStrategy,
  onStartStrategy,
  onDeleteStrategy
}: AutomationComponentProps) => {

  const tabPanels: TabPanel[] = [
    {
      value: "strategies",
      label: "Strategies",
      component: <PositionTable onStop={onStopStrategy} onDelete={onDeleteStrategy} data={strategiesRows} onStart={onStartStrategy} />,
    },
  ];

  return (
    
    <AutomationTabs
      onAddStrategy={onAddStrategy}
      capitalAllocation={parseFloat(strategyAccountConnectState?.capitalAllocation as any)}
      tabs={tabPanels} />
  );
};

export default AutomationComponent;
