import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { reactourService, ReactourSettings, TourStatusResponseDto, TourStatusUpdateDto } from "../services/reactourService";
import { AxiosError } from "axios";

export interface ReactourState {
  settings: ReactourSettings | null;
  loading: boolean;
  error: string | null;
  lastUpdatedTour: TourStatusResponseDto | null;
}

const initialState: ReactourState = {
  settings: null,
  loading: false,
  error: null,
  lastUpdatedTour: null,
};

export const fetchReactourSettingsAsync = createAsyncThunk<
  ReactourSettings,
  void,
  { rejectValue: string }
>(
  "reactour/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const settings = await reactourService.getReactourSettings();
      return settings;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch Reactour settings");
      }
      return rejectWithValue("Failed to fetch Reactour settings");
    }
  }
);

export const updateReactourSettingsAsync = createAsyncThunk<
  ReactourSettings,
  ReactourSettings,
  { rejectValue: string }
>(
  "reactour/updateSettings",
  async (settings, { rejectWithValue }) => {
    try {
      const updatedSettings = await reactourService.updateReactourSettings(settings);
      return updatedSettings;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to update Reactour settings");
      }
      return rejectWithValue("Failed to update Reactour settings");
    }
  }
);

export const updateTourStatusAsync = createAsyncThunk<
  TourStatusResponseDto,
  { tourName: string; update: TourStatusUpdateDto },
  { rejectValue: string }
>(
  "reactour/updateTourStatus",
  async ({ tourName, update }, { rejectWithValue }) => {
    try {
      const tourStatus = await reactourService.updateTourStatus(tourName, update);
      return tourStatus;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to update tour status");
      }
      return rejectWithValue("Failed to update tour status");
    }
  }
);

export const reactourSlice = createSlice({
  name: "reactour",
  initialState,
  reducers: {
    clearReactourError(state) {
      state.error = null;
    },
    resetReactourState(state) {
      state.settings = null;
      state.loading = false;
      state.error = null;
      state.lastUpdatedTour = null;
    },
    setReactourSettings(state, action: PayloadAction<ReactourSettings>) {
      state.settings = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReactourSettingsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReactourSettingsAsync.fulfilled, (state, action: PayloadAction<ReactourSettings>) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchReactourSettingsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch Reactour settings";
      })
      
      .addCase(updateReactourSettingsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReactourSettingsAsync.fulfilled, (state, action: PayloadAction<ReactourSettings>) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(updateReactourSettingsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update Reactour settings";
      })
      
      .addCase(updateTourStatusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTourStatusAsync.fulfilled, (state, action: PayloadAction<TourStatusResponseDto>) => {
        state.loading = false;
        state.lastUpdatedTour = action.payload;
        
        if (state.settings) {
          const tourName = action.payload.tour_name;
          const stepKey = `EI_TOUR_${tourName}_STEP`;
          const viewedKey = `EI_TOUR_${tourName}_VIEWED`;
          
          state.settings.tours[stepKey] = action.payload.step;
          state.settings.tours[viewedKey] = action.payload.viewed ? 1 : 0;
        }
      })
      .addCase(updateTourStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update tour status";
      });
  },
});

export const {
  clearReactourError,
  resetReactourState,
  setReactourSettings,
} = reactourSlice.actions;

