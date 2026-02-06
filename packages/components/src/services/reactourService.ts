import { appAxios } from "../lib/axios/customAxios";
import { AxiosError } from "axios";

export interface ReactourSettings {
  tours: Record<string, number>;
}

export interface TourStatusResponseDto {
  tour_name: string;
  step: number;
  viewed: boolean;
}

export interface TourStatusUpdateDto {
  step?: number;
  viewed?: boolean;
}

export const reactourService = {
  getReactourSettings: async (): Promise<ReactourSettings> => {
    try {
      const response = await appAxios.get("/api/user-preferences/reactour", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch Reactour settings:", error);
      if (error instanceof AxiosError) {
        throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
      }
      throw new Error("Failed to load Reactour settings");
    }
  },

  updateReactourSettings: async (settings: ReactourSettings): Promise<ReactourSettings> => {
    try {
      const response = await appAxios.put("/api/user-preferences/reactour", settings, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to update Reactour settings:", error);
      if (error instanceof AxiosError) {
        throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
      }
      throw new Error("Failed to update Reactour settings");
    }
  },

  updateTourStatus: async (
    tourName: string,
    update: TourStatusUpdateDto
  ): Promise<TourStatusResponseDto> => {
    try {
      const response = await appAxios.patch(
        `/api/user-preferences/reactour/${tourName}`,
        update,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update tour status for ${tourName}:`, error);
      if (error instanceof AxiosError) {
        throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
      }
      throw new Error("Failed to update tour status");
    }
  },
};

