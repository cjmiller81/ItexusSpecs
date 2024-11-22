import MockAdapter from "axios-mock-adapter";
import { IAdminUserConnectionList, IAdminUserDetails, IExchangeAccountList } from "@/features/strategies/users/types";
import { initAdminUsers, initExchangeAccounts, initManagedOrderList, initPositionList } from "./initAdminUsers";
/* eslint-disable no-useless-escape */

const mockState: {
    users: IAdminUserConnectionList,
    exchangeAccountList: IExchangeAccountList;
    userDetails?: IAdminUserDetails;
} = {
   users: initAdminUsers,
   exchangeAccountList: initExchangeAccounts,
   userDetails: {
    managedOrderList: initManagedOrderList,
    positionList: initPositionList
   }
};

export function configureAdminUsersMock(mock: MockAdapter) {
  const userRegex = new RegExp(`${process.env.API_BASE_URL}\/api\/admin\/users$`);
  mock.onGet(userRegex).reply(() => {
    return [200, mockState.users];
  });
  
  const userAccountRegex = new RegExp(`${process.env.API_BASE_URL}\/api\/admin\/users\/([^/]+)\/accounts$`);
  mock.onGet(userAccountRegex).reply(() => {
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
