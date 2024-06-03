import appAxios from "@/libs/axios/axios"
import { FifoSignal } from "./fifoSignal"

function getFifoSignalId(fifoSignal: FifoSignal): string {
  return encodeURIComponent(`${fifoSignal.masterSymbol}.${fifoSignal.tickAtrMultiple}`)
}

async function crateOrUpdate(fifoSignal: FifoSignal): Promise<void> {
  const id = getFifoSignalId(fifoSignal)
  await appAxios.post(`/api/fifoSignal/${id}`, fifoSignal)
}

export const fifoSignalsService = {
  create: crateOrUpdate,
  update: crateOrUpdate,
  getAll: async (): Promise<FifoSignal[]> => {
    const response = await appAxios.get<FifoSignal[]>(`/api/fifoSignal`)
    return response.data
  },
  delete: async (id: string): Promise<void> => {
    return appAxios.delete(`/api/fifoSignal/${id}`)
  },
}
