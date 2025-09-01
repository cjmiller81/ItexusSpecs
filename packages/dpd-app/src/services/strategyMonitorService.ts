import axios from "@/libs/axios/axios";

export interface StrategyStatusResponse {
  strategyId: string;
  state: string;
  errorMsg?: string;
}

export class StrategyMonitorService {
  static async getStrategyStatus(accountNumber: string, strategyId: string): Promise<StrategyStatusResponse> {
    try {
      const response = await axios.get<StrategyStatusResponse>(`/api/dpdOptionsScan/schwab/${accountNumber}/${strategyId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching strategy status:", error);
      throw error;
    }
  }

  static async monitorStrategyStatus(
    accountNumber: string,
    strategyId: string,
    onStatusChange: (status: StrategyStatusResponse) => void,
    onError: (error: string) => void
  ): Promise<void> {
    const endStates = ['OrdersFilled', 'SkipTrade', 'OrdersCancelled'];
    let lastState = '';
    let lastErrorMsg = '';
    let attempts = 0;
    const maxAttempts = 10;

    const pollStatus = async () => {
      try {
        const status = await this.getStrategyStatus(accountNumber, strategyId);

        // Check for error message and show toast if it's new
        if (status.errorMsg && status.errorMsg !== lastErrorMsg) {
          onError(status.errorMsg);
          lastErrorMsg = status.errorMsg;
        }

        // Show state change toast if state changed
        if (status.state !== lastState) {
          onStatusChange(status);
          lastState = status.state;
        }

        // Stop polling if we reached an end state
        if (endStates.includes(status.state)) {
          return;
        }

        // Continue polling if we haven't reached max attempts
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(pollStatus, 1000);
        }
      } catch (error) {
        console.error("Error in strategy status polling:", error);
        onError("Failed to fetch strategy status");
      }
    };

    await pollStatus();
  }
}
