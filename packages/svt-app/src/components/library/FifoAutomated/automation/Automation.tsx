import React from "react";
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
  onAddStrategy: () => void;
  errorMessage: string;
  isMutating: boolean;
  onDeleteStrategy: (id: IPositionTableRow) => void;
  onStopStrategy: (id: IPositionTableRow) => void;
  onStartStrategy: (id: IPositionTableRow) => void;
  strategiesRows: IPositionTableRow[]
}

const AutomationComponent: React.FC<AutomationComponentProps> = ({
  strategyAccountConnectState,
  onAddStrategy,
  strategiesRows,
  onStopStrategy,
  onStartStrategy,
  onDeleteStrategy,
  isMutating
}: AutomationComponentProps) => {

  const tabPanels: TabPanel[] = [
    {
      value: "strategies",
      label: "Strategies",
      component: <PositionTable onStop={onStopStrategy} onDelete={onDeleteStrategy} data={strategiesRows} onStart={onStartStrategy} isMutating={isMutating} />,
    },
  ];

  return (

    <AutomationTabs
      onAddStrategy={onAddStrategy}
      capitalAllocation={parseFloat((strategyAccountConnectState?.capitalAllocation?.units ?? 0) as any)}
      tabs={tabPanels}
      isMutating={isMutating} />
  );
};

export default AutomationComponent;
