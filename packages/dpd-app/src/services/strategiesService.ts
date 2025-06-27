import axios from "@/libs/axios/axios"
import { DpdOptionsScanList } from "@/models/DpdOptionScan";

export const strategiesService = {
    getSchwab: async (accountNumber: string | null = null): Promise<DpdOptionsScanList> => {
        const response = await axios.get<DpdOptionsScanList>(`/api/dpdOptionsScan/schwab`);
        return response.data;
    }
}