import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "components";
import { IAdminUser } from "./iAdminUser";
import { adminUsersService } from "./adminUsersService";

export interface IAdminUsersSliceState {
  adminUsers: IAdminUser[];
  selectedUserId: string | null;
  statusFetchingIAdminUsers: Status;
  statusCreatingIAdminUsers: Status;
  statusUpdatingIAdminUsers: Status;
  statusDeletingIAdminUsers: Status;
}

const initialState: IAdminUsersSliceState = {
  adminUsers: [],
  selectedUserId: null,
  statusFetchingIAdminUsers: "idle",
  statusCreatingIAdminUsers: "idle",
  statusUpdatingIAdminUsers: "idle",
  statusDeletingIAdminUsers: "idle",
};

export const fetchAdminUsers = createAsyncThunk(
  "adminUsers/fetchAdminUsers",
  async () => {
    return await adminUsersService.getAll();
  }
);

export const updateAdminUser = createAsyncThunk(
  "adminUsers/updateAdminUser",
  async (adminUser: IAdminUser, thunkApi) => {
    await adminUsersService.update(adminUser);
    thunkApi.dispatch(fetchAdminUsers());
  }
);

export const deleteAdminUser = createAsyncThunk(
  "adminUsers/deleteAdminUser",
  async ({ id }: { id: string }, thunkApi) => {
    await adminUsersService.delete(id);
    thunkApi.dispatch(fetchAdminUsers());
  }
);

export const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    setSelectedUserId: (state, action: PayloadAction<string | null>) => {
      state.selectedUserId = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.statusFetchingIAdminUsers = "loading";
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action: PayloadAction<IAdminUser[]>) => {
        state.statusFetchingIAdminUsers = "idle";
        state.adminUsers = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state) => {
        state.statusFetchingIAdminUsers = "failed";
      })
      .addCase(updateAdminUser.pending, (state) => {
        state.statusUpdatingIAdminUsers = "loading";
      })
      .addCase(updateAdminUser.fulfilled, (state) => {
        state.statusUpdatingIAdminUsers = "idle";
      })
      .addCase(updateAdminUser.rejected, (state) => {
        state.statusUpdatingIAdminUsers = "failed";
      })
      .addCase(deleteAdminUser.pending, (state) => {
        state.statusDeletingIAdminUsers = "loading";
      })
      .addCase(deleteAdminUser.fulfilled, (state) => {
        state.statusDeletingIAdminUsers = "idle";
      })
      .addCase(deleteAdminUser.rejected, (state) => {
        state.statusDeletingIAdminUsers = "failed";
      });
  },
});

export const { setSelectedUserId } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
