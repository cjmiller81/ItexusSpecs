import appAxios from "@/libs/axios/axios";
import { Mechanical0DteSpx, Mechanical0DteSpxList } from "./users/types";


export const dteMechanicalUsersService = {
  getAll: async (): Promise<Mechanical0DteSpxList> => {
    const response = await appAxios.get<Mechanical0DteSpxList>("/api/admin/strategies/machanical0DteSpx");
    return response.data;
  },
};
