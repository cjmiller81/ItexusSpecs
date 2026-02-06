import { SubProfile } from "@/models/SubProfile";
import axios from "axios";

const API_BASE_URL = "https://api.dpd-dev.emergentcybernetics.net/api/optionsTrader";

export class optionTradeService {
  static async createSubProfile(tradeRequest: SubProfile): Promise<void> {
    try {
      const response = await axios.post(`${API_BASE_URL}/CreateSubProfile`, tradeRequest, { withCredentials: true } );
        return response.data;  
    } catch (error) {
      console.error("Error creating sub-profile:", error);
      throw error;
    }
  }

  static async updateSubProfile(tradeRequest: SubProfile): Promise<void> {
    try {
      const response = await axios.post(`${API_BASE_URL}/updateSubProfile`, tradeRequest, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error updating sub-profile:", error);
      throw error;
    }
  }

  static async getCurrentUserSubProfiles(): Promise<SubProfile[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/GetCurrentUserSubProfiles`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error fetching user sub-profiles:", error);
      throw error;
    }
  }
  static async deleteSubProfile(name: string): Promise<void> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/deleteCurrentUserSubProfile/${encodeURIComponent(name)}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting sub-profile:", error);
      throw error;
    }
  }
}
