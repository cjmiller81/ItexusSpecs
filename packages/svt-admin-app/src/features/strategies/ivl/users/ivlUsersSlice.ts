import { PayloadAction } from "@reduxjs/toolkit";
import { Status, createAppSlice } from "components";
import { IvlUser, IIvlStrategiesResponse } from "./IvlUser";
import { ivlUsersService } from "./ivlUsersService";
import { Billing } from "./details/billing";
import { CapitalAllocation } from "./details/capitalAllocation";
import { Order } from "./details/order";
import { Bot } from "./details/bot";
import { OpenPosition } from "./details/openPosition";
import { IWorkingOrder } from "./details/workingOrderInterface";
import { ICurrentDayFills } from "./details/currentDayFillsInterface";

type UserDetails = {
  orders: Order[];
  billings: Billing[];
  allocations: CapitalAllocation[];
  bot: Bot;
  openPositions: OpenPosition[];
  workingOrders: IWorkingOrder[];
  currentDayFills: ICurrentDayFills[];
};

export interface IvlUsersSliceState {
  ivlUsers: IvlUser[];
  userDetails?: UserDetails;
  statusFetchingIvlUsers: Status;
  statusFetchingUserDetails: Status;
  statusCreatingIvlUsers: Status;
  statusUpdatingIvlUsers: Status;
  statusDeletingIvlUsers: Status;
}

const initialState: IvlUsersSliceState = {
  ivlUsers: [],
  statusFetchingIvlUsers: "idle",
  statusFetchingUserDetails: "idle",
  statusCreatingIvlUsers: "idle",
  statusUpdatingIvlUsers: "idle",
  statusDeletingIvlUsers: "idle",
};

export const ivlUsersSlice = createAppSlice({
  name: "ivlUsers",
  initialState,
  reducers: create => ({
    updateIvlUser: create.asyncThunk(
      async (ivlUser: IvlUser, thunkApi) => {
        await ivlUsersService.update(ivlUser);
        thunkApi.dispatch(fetchIvlUsers(null));
      },
      {
        pending: state => {
          state.statusUpdatingIvlUsers = "loading";
        },
        fulfilled: state => {
          state.statusUpdatingIvlUsers = "idle";
        },
        rejected: state => {
          state.statusUpdatingIvlUsers = "failed";
        },
      },
    ),
    deleteIvlUser: create.asyncThunk(
      async ({ id }: { id: string }, thunkApi) => {
        await ivlUsersService.delete(id);
        thunkApi.dispatch(fetchIvlUsers(null));
      },
      {
        pending: state => {
          state.statusDeletingIvlUsers = "loading";
        },
        fulfilled: state => {
          state.statusDeletingIvlUsers = "idle";
        },
        rejected: state => {
          state.statusDeletingIvlUsers = "failed";
        },
      },
    ),
    fetchIvlUsers: create.asyncThunk(
      async () => {
        return await ivlUsersService.getAll();
      },
      {
        pending: state => {
          state.statusFetchingIvlUsers = "loading";
        },
        fulfilled: (state, action: PayloadAction<IIvlStrategiesResponse>) => {
          state.statusFetchingIvlUsers = "idle";
          state.ivlUsers = action.payload.strategies;
        },
        rejected: state => {
          state.statusFetchingIvlUsers = "failed";
        },
      },
    ),
    fetchUserDetails: create.asyncThunk(
      async ({ userId, accountNumber }: { userId: string, accountNumber: string }): Promise<UserDetails> => {
        let currentDayFills: ICurrentDayFills[] = [];
        let workingOrders: IWorkingOrder[] = [];
        let openPositions: any[];
        const [billings, allocations, orders, bot] = await Promise.all([
          ivlUsersService.getUserBillings(userId),
          ivlUsersService.getUserCapitalAllocations(userId),
          ivlUsersService.getUserOrders(userId, accountNumber),
          ivlUsersService.getUserBots(userId),
        ]);

        const openPosition = async (userId: string, accountNumber: string, entryOrderSymbol: string | null) => {
          if (!entryOrderSymbol) {
            return [];
          }

          const symbols = entryOrderSymbol.split("|").map(symbol => {
            symbol = symbol.trim();
            symbol = symbol.replace("/", "%2F");
            return symbol;
          });

          const positionPromises = symbols.map(symbol => {
            return ivlUsersService.getOpenPositions(userId, accountNumber, symbol);
          });
          return await Promise.all(positionPromises);
        };

        const fetchCurrentDayFillsAndWorkingOrders = async (userId, element) => {
          if (element.entryExchangeOrderId && element.exitExchangeOrderId) {
            const currentDayFills = await ivlUsersService.getCurrentDayFills(userId);
            const workingOrders = await ivlUsersService.getUserWorkingOrders(userId);
            return { currentDayFills, workingOrders };
          }
          return { currentDayFills: [], workingOrders: [] };
        };

        const result = await fetchCurrentDayFillsAndWorkingOrders(userId, bot);
        currentDayFills = result.currentDayFills;
        workingOrders = result.workingOrders;
        openPositions = await openPosition(userId, bot.accountNumber, bot.entryOrderSymbol);

        return { billings, allocations, orders, bot, openPositions, currentDayFills, workingOrders };
      },
      {
        pending: state => {
          state.statusFetchingIvlUsers = "loading";
        },
        fulfilled: (state, action: PayloadAction<UserDetails>) => {
          state.statusFetchingIvlUsers = "idle";
          state.userDetails = action.payload;
        },
        rejected: state => {
          state.statusFetchingIvlUsers = "failed";
        },
      },
    ),
  }),
});

export const { deleteIvlUser, fetchIvlUsers, updateIvlUser, fetchUserDetails } = ivlUsersSlice.actions;
