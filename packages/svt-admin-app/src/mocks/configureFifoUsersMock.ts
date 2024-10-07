import { IFifoUser } from "@/features/strategies/users/iFifoUser";
import MockAdapter from "axios-mock-adapter";
import {
  initBots,
  initCurrentDayFills,
  initFifoUsers,
  initOpenPosition,
  initOrders,
  initWorkingOrders,
} from "./initFifoUsers";
import { Order } from "@/features/strategies/users/details/order";
import { Bot } from "@/features/strategies/users/details/bot";
import { OpenPosition } from "@/features/strategies/users/details/openPosition";
import { WorkingOrder } from "@/features/strategies/users/details/workingOrder";
import { ICurrentDayFills } from "@/features/strategies/users/details/currentDayFillsInterface";
/* eslint-disable no-useless-escape */

const mockState: {
  fifoUsers: IFifoUser[];
  bots: Bot[];
  orders: Order[];
  currentDayFills: ICurrentDayFills[];
  workingOrders: WorkingOrder[];
  openPositions: OpenPosition[];
} = {
  fifoUsers: initFifoUsers,
  bots: initBots,
  orders: initOrders,
  currentDayFills: initCurrentDayFills,
  workingOrders: initWorkingOrders,
  openPositions: initOpenPosition,
};

export function configureFifoUsersMock(mock: MockAdapter) {
  mock.onGet(`${process.env.API_BASE_URL}\/api\/fifo\/users`).reply(() => {
    return [200, mockState.fifoUsers];
  });

  const getBotRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/fifo\/users\/([^/]+)\/bots`);
  mock.onGet(getBotRegExp).reply(() => {
    return [200, mockState.bots];
  });
  const getOrdersRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/fifo\/users\/([^/]+)\/orders`);
  mock.onGet(getOrdersRegExp).reply(() => {
    return [200, mockState.orders];
  });
  const currentDayFillsRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/fifo\/users\/([^/]+)\/current-day-fills`);
  mock.onGet(currentDayFillsRegExp).reply(() => {
    return [200, mockState.currentDayFills];
  });
  const getWorkingOrdersRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/fifo\/users\/([^/]+)\/working-orders`);
  mock.onGet(getWorkingOrdersRegExp).reply(() => {
    return [200, mockState.workingOrders];
  });
  const getOpenPositionsRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/fifo\/users\/([^/]+)\/open-positions`);
  mock.onGet(getOpenPositionsRegExp).reply(config => {
    const userId = getOpenPositionsRegExp.exec(`${config.baseURL}${config.url}`)?.[1];
    return [200, mockState.openPositions.filter(position => position.userId === userId)];
  });
  // eslint-disable-next-line
  const putUserRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/fifo\/users\/*`);
  mock.onPut(putUserRegExp).reply(config => {
    const fifoUser = JSON.parse(config.data);
    const url = new URL(config.url!, config.baseURL!);
    const splited = url.pathname.split("/");
    const id = splited[splited.length - 1];

    const existedSignalIndex = mockState.fifoUsers.findIndex(user => id === user.id);

    if (existedSignalIndex !== -1) mockState.fifoUsers.splice(existedSignalIndex, 1, fifoUser);
    return [200];
  });

  mock.onDelete(putUserRegExp).reply(config => {
    const url = new URL(config.url!, config.baseURL!);
    const splited = url.pathname.split("/");
    const id = splited[splited.length - 1];
    const decodedId = decodeURIComponent(id);

    const splitedId: [string, string] = decodedId.split(".") as [string, string];
    mockState.fifoUsers = mockState.fifoUsers.filter(signal => signal.id !== splitedId[0]);

    return [200];
  });

  return mock;
}
