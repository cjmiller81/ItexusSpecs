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
import { dteUsersService } from "@/features/strategies/dte/users/dteUsersService";

type UserDetails = {
  orders: Order[];
  billings: Billing[];
  allocations: CapitalAllocation[];
  bots: Bot;
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
      async ({ userId }: { userId: string }): Promise<UserDetails> => {
        // Fetch bots and other details
        const bots = await ivlUsersService.getUserBots(userId);

        // Fetch other details in parallel
        const [billings, allocations, orders, openPositions, currentDayFills, workingOrders] = await Promise.all([
          ivlUsersService.getUserBillings(userId),
          ivlUsersService.getUserCapitalAllocations(userId),
          ivlUsersService.getUserOrders(userId),
          ivlUsersService.getOpenPositions(userId), // This will be overwritten by custom logic below
          ivlUsersService.getCurrentDayFills(userId),
          ivlUsersService.getUserWorkingOrders(userId),
        ]);

        // Initialize openPositions array to store results for each bot symbol
        let openPositionsForBots: OpenPosition[] = [];

        // Helper function to fetch open positions for both symbols in entryOrderSymbol
        const fetchOpenPositionsForBot = async (
          userId: string,
          bot: Bot, // Ensure you use the correct type for the bot
        ): Promise<OpenPosition[]> => {
          let openPositionsForBot: OpenPosition[] = [];

          if (bot.entryOrderSymbol) {
            // Split the entryOrderSymbol into two symbols
            const symbols = bot.entryOrderSymbol.split("|").map(symbol => symbol.trim());

            // Fetch open positions for both symbols
            const [symbol1Positions, symbol2Positions] = await Promise.all([
              ivlUsersService.getOpenPositions(userId, bot.accountNumber, symbols[0]), // First symbol
              ivlUsersService.getOpenPositions(userId, bot.accountNumber, symbols[1]), // Second symbol
            ]);

            // Combine the positions for both symbols and return them
            openPositionsForBot = openPositionsForBot.concat(symbol1Positions, symbol2Positions);
          }

          return openPositionsForBot;
        };

        // Iterate through each bot and fetch open positions for each symbol using the helper function
        await Promise.all(
          bots.map(async bot => {
            const botPositions = await fetchOpenPositionsForBot(userId, bot);
            openPositionsForBots = openPositionsForBots.concat(botPositions);
          }),
        );

        // Return all the data, including the updated openPositions
        return {
          billings,
          allocations,
          orders,
          bots,
          openPositions: openPositionsForBots, // Replace the original openPositions with the custom one
          currentDayFills,
          workingOrders,
        };
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
