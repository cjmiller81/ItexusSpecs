"use client"

import { RequestHandler } from "msw"
import { setupWorker } from "msw/browser"
import { RequestHandlerDefaultInfo, RequestHandlerOptions } from "msw/lib/core/handlers/RequestHandler"
import { fifoSignalsHandlers } from "./fifoSignalsHandlers"

let handlers: RequestHandler<RequestHandlerDefaultInfo, any, any, RequestHandlerOptions>[] = []

handlers = handlers.concat(fifoSignalsHandlers)

export const worker = setupWorker(...handlers)
