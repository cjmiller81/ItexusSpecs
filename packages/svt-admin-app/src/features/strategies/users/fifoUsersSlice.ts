import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "components";
import { IFifoUser } from "./iFifoUser";
import { fifoUsersService } from "./fifoUsersService";
import { Bot } from "./details/bot";
import { Order } from "./details/order";
import { OpenPosition } from "./details/openPosition";
import { WorkingOrder } from "@/features/strategies/users/details/workingOrder";
import { ICurrentDayFills } from "@/features/strategies/users/details/currentDayFillsInterface";

type UserDetails = {
  orders: Order[];
  workingOrders: WorkingOrder[];
  currentDayFills: ICurrentDayFills[];
  bots: Bot[];
  openPositions: OpenPosition[];
};

export interface IFifoUsersSliceState {
  fifoUsers: IFifoUser[];
  userDetails?: UserDetails;
  statusFetchingIFifoUsers: Status;
  statusFetchingUserDetails: Status;
  statusCreatingIFifoUsers: Status;
  statusUpdatingIFifoUsers: Status;
  statusDeletingIFifoUsers: Status;
}

const initialState: IFifoUsersSliceState = {
  fifoUsers: [],
  statusFetchingIFifoUsers: "idle",
  statusFetchingUserDetails: "idle",
  statusCreatingIFifoUsers: "idle",
  statusUpdatingIFifoUsers: "idle",
  statusDeletingIFifoUsers: "idle",
};

export const fetchFifoUsers = createAsyncThunk("fifoUsers/fetchFifoUsers", async () => {
  return await fifoUsersService.getAll();
});

export const fetchUserDetails = createAsyncThunk(
  "fifoUsers/fetchUserDetails",
  async ({ userId }: { userId: string }) => {
    const [bots, orders, currentDayFills, workingOrders, openPositions] = await Promise.all([
      fifoUsersService.getUserBots(userId),
      fifoUsersService.getUserOrders(userId),
      fifoUsersService.getCurrentDayFills(userId),
      fifoUsersService.getUserWorkingOrders(userId),
      fifoUsersService.getOpenPositions(userId),
    ]);
    return { bots, orders, workingOrders, currentDayFills, openPositions };
  },
);

export const updateFifoUser = createAsyncThunk("fifoUsers/updateFifoUser", async (fifoUser: IFifoUser, thunkApi) => {
  await fifoUsersService.update(fifoUser);
  thunkApi.dispatch(fetchFifoUsers());
});

export const deleteFifoUser = createAsyncThunk("fifoUsers/deleteFifoUser", async ({ id }: { id: string }, thunkApi) => {
  await fifoUsersService.delete(id);
  thunkApi.dispatch(fetchFifoUsers());
});

export const fifoUsersSlice = createSlice({
  name: "fifoUsers",
  initialState,
  reducers: {
    deleteFifoBot(state, action: PayloadAction<{ userId: string; botId: string }>) {
      const { botId } = action.payload;
      const userDetails = state.userDetails;
      if (userDetails) {
        userDetails.bots = userDetails.bots.filter(bot => bot.userId !== botId);
      }
    },
  },

  extraReducers: builder => {
    builder
      .addCase(fetchFifoUsers.pending, state => {
        state.statusFetchingIFifoUsers = "loading";
      })
      .addCase(fetchFifoUsers.fulfilled, (state, action: PayloadAction<IFifoUser[]>) => {
        state.statusFetchingIFifoUsers = "idle";
        state.fifoUsers = action.payload;
      })
      .addCase(fetchFifoUsers.rejected, state => {
        state.statusFetchingIFifoUsers = "failed";
      })
      .addCase(fetchUserDetails.pending, state => {
        state.statusFetchingUserDetails = "loading";
      })
      .addCase(fetchUserDetails.fulfilled, (state, action: PayloadAction<UserDetails>) => {
        state.statusFetchingUserDetails = "idle";
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, state => {
        state.statusFetchingUserDetails = "failed";
      })
      .addCase(updateFifoUser.pending, state => {
        state.statusUpdatingIFifoUsers = "loading";
      })
      .addCase(updateFifoUser.fulfilled, state => {
        state.statusUpdatingIFifoUsers = "idle";
      })
      .addCase(updateFifoUser.rejected, state => {
        state.statusUpdatingIFifoUsers = "failed";
      })
      .addCase(deleteFifoUser.pending, state => {
        state.statusDeletingIFifoUsers = "loading";
      })
      .addCase(deleteFifoUser.fulfilled, state => {
        state.statusDeletingIFifoUsers = "idle";
      })
      .addCase(deleteFifoUser.rejected, state => {
        state.statusDeletingIFifoUsers = "failed";
      });
  },
});

export const { deleteFifoBot } = fifoUsersSlice.actions;

export default fifoUsersSlice.reducer;
