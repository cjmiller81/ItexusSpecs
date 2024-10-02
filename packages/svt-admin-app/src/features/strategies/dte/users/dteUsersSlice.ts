import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice, Status } from "components";
import { IDteUser } from "./iDteUser";
import { dteUsersService } from "./dteUsersService";
import { Bot } from "./details/bot";

type UserDetails = {
  bots: Bot[]
}

export interface IDteUsersSliceState {
  dteUsers: IDteUser[];
  userDetails?: UserDetails;
  statusFetchingDteUsers: Status;
  statusCreatingDteUsers: Status;
  statusUpdatingDteUsers: Status;
  statusDeletingDteUsers: Status;
}

const initialState: IDteUsersSliceState = {
  dteUsers: [],
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
        async (dteUser: IDteUser, thunkApi) => {
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
          fulfilled: (state, action: PayloadAction<IDteUser[]>) => {
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
          const [bots] = await Promise.all([
            dteUsersService.getUserBots(userId)
          ])
          return {bots} 
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