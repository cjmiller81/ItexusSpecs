import React from "react";
import { Alert } from "@mantis/core"; // Import the Alert component from Mantis
import { CheckSquareFilled } from "@ant-design/icons"; // Import icon from Ant Design (used in Mantis)

interface ConnectionStatusProps {
  isConnected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  return (
    <>
      {isConnected ? (
        <Alert
          color="success"
          icon={<CheckSquareFilled style={{ color: "black" }} />}>
          Connected
        </Alert>
      ) : (
        <Alert
          color="error"
          icon={<CheckSquareFilled style={{ color: "black" }} />}>
          Disconnected
        </Alert>
      )}
    </>
  );
};

export default ConnectionStatus;
