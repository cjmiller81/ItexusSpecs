import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Mechanical0DteSpx, Mechanical0DteSpxList, StrategyBotList } from './users/types';
import { dteMechanicalUsersService } from './dteMechanicalUsersService';
import { Status } from 'components';
import { ICurrentDayFills, IWorkingOrder, OpenPosition } from '../0dte-iron-flies/users/types';

export interface IDteMechanicalUsersSliceState {
  dteMechanicalUsers: Mechanical0DteSpxList;
  statusFetchingDteUsers: Status;
  userDetails?: UserDetails;
} 

type UserDetails = {
  bots: StrategyBotList;
  openPositions: OpenPosition[];
  workingOrders: IWorkingOrder[];
  currentDayFills: ICurrentDayFills[];
};

const initialState: IDteMechanicalUsersSliceState = {
  dteMechanicalUsers: { strategies: [] },
  statusFetchingDteUsers: "idle",
  
};

export const fetchAllMechanical0DteSpx = createAsyncThunk(
  'mechanical0DteSpx/fetchAll',
  async () => {
    return await dteMechanicalUsersService.getAll();
  }
);

export const fetchMechanical0DteSpxByAccount = createAsyncThunk(
  'mechanical0DteSpx/fetchByAccount',
  async (accountNumber: string) => {
    return await dteMechanicalUsersService.getByAccountNumber(accountNumber);
  }
);

export const fetchMechanical0DteSpxById = createAsyncThunk(
  'mechanical0DteSpx/fetchById',
  async ({ accountNumber, strategyId }: { accountNumber: string; strategyId: string }) => {
    return await dteMechanicalUsersService.getById(accountNumber, strategyId);
  }
);

export const deleteMechanical0DteSpx = createAsyncThunk(
  'mechanical0DteSpx/delete',
  async ({ accountNumber, strategyId }: { accountNumber: string; strategyId: string }) => {
    await dteMechanicalUsersService.deleteStrategy(accountNumber, strategyId);
    return strategyId;
  }
);

export const startMechanical0DteSpx = createAsyncThunk(
  'mechanical0DteSpx/start',
  async ({ accountNumber, strategyId }: { accountNumber: string; strategyId: string }) => {
    await dteMechanicalUsersService.startStrategy(accountNumber, strategyId);
  }
);

export const stopMechanical0DteSpx = createAsyncThunk(
  'mechanical0DteSpx/stop',
  async ({ accountNumber, strategyId }: { accountNumber: string; strategyId: string }) => {
    await dteMechanicalUsersService.stopStrategy(accountNumber, strategyId);
  }
);

export const editMechanical0DteSpx = createAsyncThunk(
  'mechanical0DteSpx/edit',
  async ({ accountNumber, strategyId, data }: { accountNumber: string; strategyId: string; data: Partial<Mechanical0DteSpx> }) => {
    const response = await dteMechanicalUsersService.editStrategy(accountNumber, strategyId, data);
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
      })
      .addCase(deleteMechanical0DteSpx.fulfilled, (state, action) => {
        state.dteMechanicalUsers.strategies = state.dteMechanicalUsers.strategies.filter(strategy => strategy.strategyId !== action.payload);
      });
  },
});

export default dteMechanicalUsersSlice.reducer;
