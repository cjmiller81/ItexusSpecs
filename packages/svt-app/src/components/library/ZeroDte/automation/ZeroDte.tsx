import React from "react";
import { SvtIvlEsStrategySetStatus } from "../../../../services/tradingPlatformService";
import PositionTable, { IPositionTableRow } from "./position-table";
import AutomationTabs from "./tabs";

import "./ZeroDte.scss";

export interface TabPanel {
  value: string;
  label: string;
  component?: any;
}

interface ZeroDteComponentProps {
  strategyAccountConnectState: SvtIvlEsStrategySetStatus;
  onAddStrategy: () => void;
  errorMessage: string;
  isMutating: boolean;
  onDeleteStrategy: (id: IPositionTableRow) => void;
  onStopStrategy: (id: IPositionTableRow) => void;
  onStartStrategy: (id: IPositionTableRow) => void;
  onEditStrategy: (id: IPositionTableRow) => void;
  onForceExitStrategy: (id: IPositionTableRow) => void;
  strategiesRows: IPositionTableRow[];
}

const ZeroDteComponent: React.FC<ZeroDteComponentProps> = ({
  strategyAccountConnectState,
  onAddStrategy,
  strategiesRows,
  onStopStrategy,
  onStartStrategy,
  onEditStrategy,
  onDeleteStrategy,
  onForceExitStrategy,
  isMutating,
}: ZeroDteComponentProps) => {
  const tabPanels: TabPanel[] = [
    {
      value: "strategies",
      label: "Strategies",
      component: (
        <PositionTable
          onStop={onStopStrategy}
          onDelete={onDeleteStrategy}
          data={strategiesRows}
          onStart={onStartStrategy}
          onEdit={onEditStrategy}
          onForceExit={onForceExitStrategy}
          isMutating={isMutating}
        />
      ),
    },
  ];

  return (
    <AutomationTabs
      onAddStrategy={onAddStrategy}
      capitalAllocation={parseFloat((strategyAccountConnectState?.capitalAllocation?.units ?? 0) as any)}
      tabs={tabPanels}
      isMutating={isMutating}
    />
  );
};

export default ZeroDteComponent;
