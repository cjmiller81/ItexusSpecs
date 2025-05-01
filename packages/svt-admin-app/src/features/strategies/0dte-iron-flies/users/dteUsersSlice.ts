import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice, Status } from "components";
import { dteUsersService } from "./dteUsersService";
import {
  ICurrentDayFills,
  IDteStrategiesResponse,
  IDteStrategy,
  IWorkingOrder,
  OpenPosition,
  StrategyBot,
  StrategyBotList,
} from "./types";

type UserDetails = {
  bots: StrategyBotList;
  openPositions: OpenPosition[];
  workingOrders: IWorkingOrder[];
  currentDayFills: ICurrentDayFills[];
};

export interface IDteUsersSliceState {
  dteUsers: IDteStrategiesResponse;
  userDetails?: UserDetails;
  statusFetchingDteUsers: Status;
  statusCreatingDteUsers: Status;
  statusUpdatingDteUsers: Status;
  statusDeletingDteUsers: Status;
  statusUpdatingBot: Status;
}

const initialState: IDteUsersSliceState = {
  dteUsers: { strategies: [] },
  statusFetchingDteUsers: "idle",
  statusCreatingDteUsers: "idle",
  statusUpdatingDteUsers: "idle",
  statusDeletingDteUsers: "idle",
  statusUpdatingBot: "idle",
};

export const dteUsersSlice = createAppSlice({
  name: "dteUsers",
  initialState,
  reducers: create => ({
    updateDteUser: create.asyncThunk(
      async (dteUser: IDteStrategy, thunkApi) => {
        await dteUsersService.update(dteUser);
        thunkApi.dispatch(fetchDteUsers(null));
      },
      {
        pending: state => {
          state.statusUpdatingDteUsers = "loading";
        },
        fulfilled: state => {
          state.statusUpdatingDteUsers = "idle";
        },
        rejected: state => {
          state.statusUpdatingDteUsers = "failed";
        },
      },
    ),
    deleteDteUser: create.asyncThunk(
      async ({ id }: { id: string }, thunkApi) => {
        await dteUsersService.delete(id);
        thunkApi.dispatch(fetchDteUsers(null));
      },
      {
        pending: state => {
          state.statusDeletingDteUsers = "loading";
        },
        fulfilled: state => {
          state.statusDeletingDteUsers = "idle";
        },
        rejected: state => {
          state.statusDeletingDteUsers = "failed";
        },
      },
    ),
    fetchDteUsers: create.asyncThunk(
      async () => {
        return await dteUsersService.getAll();
      },
      {
        pending: state => {
          state.statusFetchingDteUsers = "loading";
        },
        fulfilled: (state, action: PayloadAction<IDteStrategiesResponse>) => {
          state.statusFetchingDteUsers = "idle";
          state.dteUsers = action.payload;
        },
        rejected: state => {
          state.statusFetchingDteUsers = "failed";
        },
      },
    ),
    fetchUserDetails: create.asyncThunk(
      async ({ userId, symbol }: { userId: string; symbol: string }): Promise<UserDetails> => {
        const bots = await dteUsersService.getBots(userId);
        let currentDayFills: ICurrentDayFills[] = [];
        let workingOrders: IWorkingOrder[] = [];
        let openPositions: OpenPosition[] = [];
        await Promise.all(
          bots.zeroDteFlyStrategyList.map(async element => {
            if (element.entryExchangeOrderId) {
              if (element.entryOrderStatus.length > 0) {
                if (["Filled"].indexOf(element.entryOrderStatus) > -1) {
                  const currentDayFill = await dteUsersService.getCurrentDayFills(
                    userId,
                    element.exchangeAccountNumber,
                    element.entryExchangeOrderId,
                  );
                  if (currentDayFill) {
                    currentDayFills = currentDayFills.concat(currentDayFill);
                  }
                } else if (["PartialFill", "Working", "Submitted"].indexOf(element.entryOrderStatus) > -1) {
                  const workingOrder = await dteUsersService.getUserWorkingOrders(
                    userId,
                    element.exchangeAccountNumber,
                    element.entryExchangeOrderId,
                  );
                  if (workingOrder) {
                    workingOrders = workingOrders.concat(workingOrder);
                  }
                }
              }
            }

            if (element.targetExchangeOrderId) {
              if (element.targetOrderStatus.length > 0) {
                if (["Filled"].indexOf(element.targetOrderStatus) > -1) {
                  const currentDayFill = await dteUsersService.getCurrentDayFills(
                    userId,
                    element.exchangeAccountNumber,
                    element.targetExchangeOrderId,
                  );
                  if (currentDayFill) {
                    currentDayFills = currentDayFills.concat(currentDayFill);
                  }
                } else if (["PartialFill", "Working", "Submitted"].indexOf(element.targetOrderStatus) > -1) {
                  const workingOrder = await dteUsersService.getUserWorkingOrders(
                    userId,
                    element.exchangeAccountNumber,
                    element.targetExchangeOrderId,
                  );
                  if (workingOrder) {
                    workingOrders = workingOrders.concat(workingOrder);
                  }
                }
              }
            }

            if (element.stopExchangeOrderId) {
              if (element.stopOrderStatus.length > 0) {
                if (["Filled"].indexOf(element.stopOrderStatus) > -1) {
                  const currentDayFill = await dteUsersService.getCurrentDayFills(
                    userId,
                    element.exchangeAccountNumber,
                    element.stopExchangeOrderId,
                  );
                  if (currentDayFill) {
                    currentDayFills = currentDayFills.concat(currentDayFill);
                  }
                } else if (["PartialFill", "Working", "Submitted"].indexOf(element.stopOrderStatus) > -1) {
                  const workingOrder = await dteUsersService.getUserWorkingOrders(
                    userId,
                    element.exchangeAccountNumber,
                    element.stopExchangeOrderId,
                  );
                  if (workingOrder) {
                    workingOrders = workingOrders.concat(workingOrder);
                  }
                }
              }
            }
          }),
        );

        const accountNumbers = bots.zeroDteFlyStrategyList.map(x => x.exchangeAccountNumber);
        const distinctAccountNumbers = accountNumbers.filter((value, index, self) => self.indexOf(value) === index);

        await Promise.all(
          distinctAccountNumbers.map(async element => {
            const distinctbot = bots.zeroDteFlyStrategyList.find(value => value.exchangeAccountNumber === element);
            const distinctPositionSymbols: string[] = [];
            if (distinctbot?.callLeg1Symbol) {
              distinctPositionSymbols.push(distinctbot?.callLeg1Symbol);
            }
            if (distinctbot?.callLeg2Symbol) {
              distinctPositionSymbols.push(distinctbot?.callLeg2Symbol);
            }
            if (distinctbot?.putLeg1Symbol) {
              distinctPositionSymbols.push(distinctbot?.putLeg1Symbol);
            }
            if (distinctbot?.putLeg2Symbol) {
              distinctPositionSymbols.push(distinctbot?.putLeg2Symbol);
            }

            await Promise.all(
              distinctPositionSymbols.map(async legSymbol => {
                const openPosition = await dteUsersService.getOpenPositions(userId, element, legSymbol);
                if (openPosition && openPosition?.marketSymbol?.length > 0) {
                  openPositions = openPositions.concat(openPosition);
                }
              }),
            );
          }),
        );

        return { bots, openPositions, currentDayFills, workingOrders };
      },
      {
        pending: state => {
          state.statusFetchingDteUsers = "loading";
        },
        fulfilled: (state, action: PayloadAction<UserDetails>) => {
          state.statusFetchingDteUsers = "idle";
          state.userDetails = action.payload;
        },
        rejected: state => {
          state.statusFetchingDteUsers = "failed";
        },
      },
    ),
    startBot: create.asyncThunk(
      async (
        {
          userId,
          accountNumber,
          masterSymbol,
        }: {
          userId: string;
          accountNumber: string;
          masterSymbol;
        },
        thunkApi,
      ) => {
        return await dteUsersService.startBot(userId, accountNumber, masterSymbol);
      },
      {
        pending: state => {
          state.statusUpdatingBot = "loading";
        },
        fulfilled: (state, action: PayloadAction<StrategyBot>) => {
          state.statusUpdatingBot = "idle";
          updateBotStrategyInfo(state, action);
        },
        rejected: state => {
          state.statusUpdatingBot = "failed";
        },
      },
    ),
    stopBot: create.asyncThunk(
      async (
        {
          userId,
          accountNumber,
          masterSymbol,
        }: {
          userId: string;
          accountNumber: string;
          masterSymbol: string;
        },
        thunkApi,
      ) => {
        return await dteUsersService.stopBot(userId, accountNumber, masterSymbol);
      },
      {
        pending: state => {
          state.statusUpdatingBot = "loading";
        },
        fulfilled: (state, action: PayloadAction<StrategyBot>) => {
          state.statusUpdatingBot = "idle";
          updateBotStrategyInfo(state, action);
        },
        rejected: state => {
          state.statusUpdatingBot = "failed";
        },
      },
    ),
    forceStopExitBot: create.asyncThunk(
      async (
        {
          userId,
          accountNumber,
          masterSymbol,
        }: {
          userId: string;
          accountNumber: string;
          masterSymbol;
        },
        thunkApi,
      ) => {
        return await dteUsersService.forceStopExitBot(userId, accountNumber, masterSymbol);
      },
      {
        pending: state => {
          state.statusUpdatingBot = "loading";
        },
        fulfilled: (state, action: PayloadAction<StrategyBot>) => {
          state.statusUpdatingBot = "idle";
          updateBotStrategyInfo(state, action);
        },
        rejected: state => {
          state.statusUpdatingBot = "failed";
        },
      },
    ),
    resetBot: create.asyncThunk(
      async (
        {
          userId,
          accountNumber,
          masterSymbol,
        }: {
          userId: string;
          accountNumber: string;
          masterSymbol;
        },
        thunkApi,
      ) => {
        return await dteUsersService.resetBot(userId, accountNumber, masterSymbol);
      },
      {
        pending: state => {
          state.statusUpdatingBot = "loading";
        },
        fulfilled: (state, action: PayloadAction<StrategyBot>) => {
          state.statusUpdatingBot = "idle";
          updateBotStrategyInfo(state, action);
        },
        rejected: state => {
          state.statusUpdatingBot = "failed";
        },
      },
    ),
  }),
});

const updateBotStrategyInfo = (state: IDteUsersSliceState, action: PayloadAction<StrategyBot>) => {
  const existedBotIndex = state.userDetails?.bots.zeroDteFlyStrategyList.findIndex(
    x =>
      x.userId === action.payload.userId &&
      x.exchangeAccountNumber === action.payload.exchangeAccountNumber &&
      x.masterSymbol === action.payload.masterSymbol,
  );

  if (existedBotIndex != undefined && existedBotIndex > -1) {
    state.userDetails!.bots.zeroDteFlyStrategyList = [
      ...state.userDetails!.bots.zeroDteFlyStrategyList.slice(0, existedBotIndex),
      action.payload,
      ...state.userDetails!.bots.zeroDteFlyStrategyList.slice(existedBotIndex + 1),
    ];
  }
};

export const {
  deleteDteUser,
  fetchDteUsers,
  updateDteUser,
  fetchUserDetails,
  startBot,
  stopBot,
  forceStopExitBot,
  resetBot,
} = dteUsersSlice.actions;
