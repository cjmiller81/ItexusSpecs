import MockAdapter from "axios-mock-adapter";
import { initDteMechanicalUsers } from "./initDteUsersMechanical";
import { Mechanical0DteSpxList } from "@/features/strategies/0dte-mechanical/users/types";

const mockState: {
  dteUsers: Mechanical0DteSpxList;
} = {
  dteUsers: initDteMechanicalUsers,
};

export function configureMachanical0DteSpxMock(mock: MockAdapter) {
  mock.onGet(new RegExp(`${process.env.API_BASE_URL}/api/admin/strategies/machanical0DteSpx$`)).reply(() => {
    return [200, mockState.dteUsers];
  });

  return mock;
}
