import MockAdapter from "axios-mock-adapter";
import { IAdminUserDetails, IExchangeAccountList } from "@/features/strategies/users/types";
import { initExchangeAccounts, initManagedOrderList, initPositionList } from "./initAdminUsers";
/* eslint-disable no-useless-escape */

const mockState: {
    exchangeAccountList: IExchangeAccountList;
    userDetails?: IAdminUserDetails;
} = {
   exchangeAccountList: initExchangeAccounts,
   userDetails: {
    managedOrderList: initManagedOrderList,
    positionList: initPositionList
   }
};

export function configureAdminUsersMock(mock: MockAdapter) {
  const userRegex = new RegExp(`${process.env.API_BASE_URL}\/api\/admin\/users\/([^/]+)\/accounts$`);
  mock.onGet(userRegex).reply(() => {
    return [200, mockState.exchangeAccountList];
  });

  const getAccountPositionRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/admin\/users\/([^/]+)\/accounts\/([^/]+)\/positions$`);
  mock.onGet(getAccountPositionRegExp).reply(() => {
    return [200, mockState.userDetails?.positionList];
  });

  const getManagedOrderRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/admin\/users\/([^/]+)\/accounts\/([^/]+)\/orders$`);
  mock.onGet(getManagedOrderRegExp).reply(() => {
    return [200, mockState.userDetails?.managedOrderList];
  });

  return mock;
}
