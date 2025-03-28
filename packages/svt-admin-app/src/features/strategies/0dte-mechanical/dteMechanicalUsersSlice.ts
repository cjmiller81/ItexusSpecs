
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Mechanical0DteSpx, Mechanical0DteSpxList } from './users/types';
import { dteMechanicalUsersService } from './dteMechanicalUsersService';
import { Status } from 'components';


export interface IDteMechanicalUsersSliceState {
  dteMechanicalUsers: Mechanical0DteSpxList;
  statusFetchingDteUsers: Status;
}


const initialState: IDteMechanicalUsersSliceState = {
  dteMechanicalUsers: { strategies: [] },
  statusFetchingDteUsers: "idle",

};

export const fetchAllMechanical0DteSpx = createAsyncThunk(
  'mechanical0DteSpx/fetchAll',
  async () => {
    const response = await dteMechanicalUsersService.getAll();
    return response;
  }
);

const dteMechanicalUsersSlice = createSlice({
  name: "mechanical0DteSpx",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMechanical0DteSpx.pending, (state) => {
        state.statusFetchingDteUsers = "loading";
      })
      .addCase(fetchAllMechanical0DteSpx.fulfilled, (state, action: PayloadAction<Mechanical0DteSpxList>) => {
        state.statusFetchingDteUsers = "idle";
        state.dteMechanicalUsers = action.payload;
      })
      .addCase(fetchAllMechanical0DteSpx.rejected, (state) => {
        state.statusFetchingDteUsers = "failed";
      });
  },
});


export default dteMechanicalUsersSlice.reducer;
