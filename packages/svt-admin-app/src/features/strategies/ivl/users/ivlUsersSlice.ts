import { PayloadAction } from "@reduxjs/toolkit"
import { Status, createAppSlice } from "components"
import { IvlUser } from "./IvlUser"
import { ivlUsersService } from "./ivlUsersService"
import { Billing } from "./details/billing"
import { CapitalAllocation } from "./details/capitalAllocation"
import { Order } from "./details/order"
import { Bot } from "./details/bot"
import { OpenPosition } from "./details/openPosition"
import { IWorkingOrder } from "./details/workingOrderInterface"
import { ICurrentDayFills } from "./details/currentDayFillsInterface"

type UserDetails = {
  orders: Order[],
  billings: Billing[],
  allocations: CapitalAllocation[],
  bots: Bot[],
  openPositions: OpenPosition[],
  workingOrders: IWorkingOrder[],
  currentDayFills: ICurrentDayFills[]
}

export interface IvlUsersSliceState {
  ivlUsers: IvlUser[]
  userDetails?: UserDetails
  statusFetchingIvlUsers: Status
  statusFetchingUserDetails: Status
  statusCreatingIvlUsers: Status
  statusUpdatingIvlUsers: Status
  statusDeletingIvlUsers: Status
}

const initialState: IvlUsersSliceState = {
  ivlUsers: [],
  statusFetchingIvlUsers: "idle",
  statusFetchingUserDetails: "idle",
  statusCreatingIvlUsers: "idle",
  statusUpdatingIvlUsers: "idle",
  statusDeletingIvlUsers: "idle",
}

export const ivlUsersSlice = createAppSlice({
  name: "ivlUsers",
  initialState,
  reducers: create => ({
    updateIvlUser: create.asyncThunk(
      async (ivlUser: IvlUser, thunkApi) => {
        await ivlUsersService.update(ivlUser)
        thunkApi.dispatch(fetchIvlUsers(null))
      },
      {
        pending: state => {
          state.statusUpdatingIvlUsers = "loading"
        },
        fulfilled: state => {
          state.statusUpdatingIvlUsers = "idle"
        },
        rejected: state => {
          state.statusUpdatingIvlUsers = "failed"
        },
      },
    ),
    deleteIvlUser: create.asyncThunk(
      async ({ id }: { id: string }, thunkApi) => {
        await ivlUsersService.delete(id)
        thunkApi.dispatch(fetchIvlUsers(null))
      },
      {
        pending: state => {
          state.statusDeletingIvlUsers = "loading"
        },
        fulfilled: state => {
          state.statusDeletingIvlUsers = "idle"
        },
        rejected: state => {
          state.statusDeletingIvlUsers = "failed"
        },
      },
    ),
    fetchIvlUsers: create.asyncThunk(
      async () => {
        return await ivlUsersService.getAll()
      },
      {
        pending: state => {
          state.statusFetchingIvlUsers = "loading"
        },
        fulfilled: (state, action: PayloadAction<IvlUser[]>) => {
          state.statusFetchingIvlUsers = "idle"
          state.ivlUsers = action.payload
        },
        rejected: state => {
          state.statusFetchingIvlUsers = "failed"
        },
      },
    ),
    fetchUserDetails: create.asyncThunk(
      async ({ userId }: { userId: string }): Promise<UserDetails> => {
        const [billings, allocations, orders, bots, openPositions, currentDayFills, workingOrders] = await Promise.all([
          ivlUsersService.getUserBillings(userId),
          ivlUsersService.getUserCapitalAllocations(userId),
          ivlUsersService.getUserOrders(userId),
          ivlUsersService.getUserBots(userId),
          ivlUsersService.getOpenPositions(userId),
          ivlUsersService.getCurrentDayFills(userId),
          ivlUsersService.getUserWorkingOrders(userId)
        ])
        return {billings, allocations, orders, bots, openPositions, currentDayFills, workingOrders} 
      },
      {
        pending: state => {
          state.statusFetchingIvlUsers = "loading"
        },
        fulfilled: (state, action: PayloadAction<UserDetails>) => {
          state.statusFetchingIvlUsers = "idle"
          state.userDetails = action.payload
        },
        rejected: state => {
          state.statusFetchingIvlUsers = "failed"
        },
      },
    ),
  }),
})

export const { deleteIvlUser, fetchIvlUsers, updateIvlUser, fetchUserDetails } = ivlUsersSlice.actions
