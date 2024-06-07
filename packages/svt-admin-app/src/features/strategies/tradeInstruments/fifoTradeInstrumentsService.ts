import appAxios from "@/libs/axios/axios"
import { IFifoTradeInstruments } from "./iFifoTradeInstruments"

function getFifoTradeInstrumentsId(fifoTradeInstruments: IFifoTradeInstruments): string {
  return encodeURIComponent(`${fifoTradeInstruments.masterSymbol}.${fifoTradeInstruments.tradeSymbol}.${fifoTradeInstruments.atrPeriod}`)
}

async function crateOrUpdate(fifoTradeInstruments: IFifoTradeInstruments): Promise<void> {
  const id = getFifoTradeInstrumentsId(fifoTradeInstruments)
  await appAxios.post(`/api/fifoExecution/${id}`, fifoTradeInstruments)
}

export const fifoTradeInstrumentsService = {
  create: crateOrUpdate,
  update: crateOrUpdate,
  getAll: async (): Promise<IFifoTradeInstruments[]> => {
    const response = await appAxios.get<IFifoTradeInstruments[]>(`/api/fifoExecution`)
    return response.data
  },
  delete: async (id: string): Promise<void> => {
    return appAxios.delete(`/api/fifoExecution/${id}`)
  },
}
