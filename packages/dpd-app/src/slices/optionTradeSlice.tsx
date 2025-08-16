import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { optionTradeService } from "@/services/optionTradeService";
import { SubProfile } from "@/models/SubProfile";

interface OptionTradeState {
  subProfiles: SubProfile[];
  loading: boolean;
  error: string | null;
}

const initialState: OptionTradeState = {
  subProfiles: [],
  loading: false,
  error: null,
};

export const createSubProfile = createAsyncThunk(
  "optionTrade/createSubProfile",
  async (tradeRequest: SubProfile, { rejectWithValue }) => {
    try {
      await optionTradeService.createSubProfile(tradeRequest);
      return tradeRequest;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create sub-profile");
    }
  }
);

export const updateSubProfile = createAsyncThunk(
  "optionTrade/updateSubProfile",
  async (tradeRequest: SubProfile, { rejectWithValue }) => {
    try {
      await optionTradeService.updateSubProfile(tradeRequest);
      return tradeRequest;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update sub-profile");
    }
  }
);

export const fetchSubProfiles = createAsyncThunk(
  "optionTrade/fetchSubProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const data = await optionTradeService.getCurrentUserSubProfiles();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch sub-profiles");
    }
  }
);

export const deleteSubProfile = createAsyncThunk(
  "optionTrade/deleteSubProfile",
  async (subProfileName: string, { rejectWithValue }) => {
    try {
      await optionTradeService.deleteSubProfile(subProfileName);
      return subProfileName;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete sub-profile");
    }
  }
);

const optionTradeSlice = createSlice({
  name: "optionTrade",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSubProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubProfile.fulfilled, (state, action: PayloadAction<SubProfile>) => {
        state.loading = false;
        state.subProfiles.push(action.payload);
      })
      .addCase(createSubProfile.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSubProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubProfiles.fulfilled, (state, action: PayloadAction<SubProfile[]>) => {
        state.loading = false;
        state.subProfiles = action.payload.map(profile => ({
          ...profile,
          exitTiers: profile.exitTiers?.map((tier: any) => {
            return {
              ...tier,
            };
          }) || []
        }));
      })
      .addCase(fetchSubProfiles.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSubProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubProfile.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.subProfiles = state.subProfiles.filter(
          (profile) => profile.name !== action.payload
        );
      })
      .addCase(deleteSubProfile.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSubProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubProfile.fulfilled, (state, action: PayloadAction<SubProfile>) => {
        state.loading = false;
        const index = state.subProfiles.findIndex(profile => profile.name === action.payload.name);
        if (index !== -1) {
          state.subProfiles[index] = action.payload;
        }
      })
      .addCase(updateSubProfile.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default optionTradeSlice.reducer;
