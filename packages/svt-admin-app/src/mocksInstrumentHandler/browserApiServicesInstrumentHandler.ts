"use client"

import { RequestHandler } from "msw"
import { setupWorker } from "msw/browser"
import { RequestHandlerDefaultInfo, RequestHandlerOptions } from "msw/lib/core/handlers/RequestHandler"
import { fifoTradeInstrumentsHandlers } from "./fifoTradeInstrumentsHandler"

let handlers: RequestHandler<RequestHandlerDefaultInfo, any, any, RequestHandlerOptions>[] = []

handlers = handlers.concat(fifoTradeInstrumentsHandlers)

export const worker = setupWorker(...handlers)
