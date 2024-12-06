import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice, Status } from "components";
import { dteUsersService } from "./dteUsersService";
import { Bot } from "./details/bot";
import { OpenPosition } from "./details/openPosition";
import { IWorkingOrder } from "./details/workingOrderInterface";
import { ICurrentDayFills } from "./details/currentDayFillsInterface";
import { IDteStrategiesResponse, IDteStrategy } from "./types";

type UserDetails = {
  bots: Bot[]
  openPositions: OpenPosition[]
  workingOrders: IWorkingOrder[]
  currentDayFills: ICurrentDayFills[]
}

export interface IDteUsersSliceState {
  dteUsers: IDteStrategiesResponse;
  userDetails?: UserDetails;
  statusFetchingDteUsers: Status;
  statusCreatingDteUsers: Status;
  statusUpdatingDteUsers: Status;
  statusDeletingDteUsers: Status;
}

const initialState: IDteUsersSliceState = {
  dteUsers: { strategies: [] },
  statusFetchingDteUsers: "idle",
  statusCreatingDteUsers: "idle",
  statusUpdatingDteUsers: "idle",
  statusDeletingDteUsers: "idle",
};

export const dteUsersSlice = createAppSlice({
    name: "dteUsers",
    initialState,
    reducers: create => ({
      updateDteUser: create.asyncThunk(
        async (dteUser: IDteStrategy, thunkApi) => {
          await dteUsersService.update(dteUser)
          thunkApi.dispatch(fetchDteUsers(null))
        },
        {
          pending: state => {
            state.statusUpdatingDteUsers = "loading"
          },
          fulfilled: state => {
            state.statusUpdatingDteUsers = "idle"
          },
          rejected: state => {
            state.statusUpdatingDteUsers = "failed"
          },
        },
      ),
      deleteDteUser: create.asyncThunk(
        async ({ id }: { id: string }, thunkApi) => {
          await dteUsersService.delete(id)
          thunkApi.dispatch(fetchDteUsers(null))
        },
        {
          pending: state => {
            state.statusDeletingDteUsers = "loading"
          },
          fulfilled: state => {
            state.statusDeletingDteUsers = "idle"
          },
          rejected: state => {
            state.statusDeletingDteUsers = "failed"
          },
        },
      ),
      fetchDteUsers: create.asyncThunk(
        async () => {
          return await dteUsersService.getAll()
        },
        {
          pending: state => {
            state.statusFetchingDteUsers = "loading"
          },
          fulfilled: (state, action: PayloadAction<IDteStrategiesResponse>) => {
            state.statusFetchingDteUsers = "idle"
            state.dteUsers = action.payload
          },
          rejected: state => {
            state.statusFetchingDteUsers = "failed"
          },
        },
      ),
      fetchUserDetails: create.asyncThunk(
        async ({ userId }: { userId: string }): Promise<UserDetails> => {
          const [bots, openPositions, currentDayFills, workingOrders] = await Promise.all([
            dteUsersService.getUserBots(userId),
            dteUsersService.getOpenPositions(userId),
            dteUsersService.getCurrentDayFills(userId),
            dteUsersService.getUserWorkingOrders(userId)
          ])
          return {bots, openPositions, currentDayFills, workingOrders} 
        },
        {
          pending: state => {
            state.statusFetchingDteUsers = "loading"
          },
          fulfilled: (state, action: PayloadAction<UserDetails>) => {
            state.statusFetchingDteUsers = "idle"
            state.userDetails = action.payload
          },
          rejected: state => {
            state.statusFetchingDteUsers = "failed"
          },
        },
      ),
    }),
});
  
export const { deleteDteUser, fetchDteUsers, updateDteUser, fetchUserDetails } = dteUsersSlice.actions