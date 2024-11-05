"use client"

import { RequestHandler } from "msw"
import { setupWorker } from "msw/browser"
import { RequestHandlerDefaultInfo, RequestHandlerOptions } from "msw/lib/core/handlers/RequestHandler"

let handlers: RequestHandler<RequestHandlerDefaultInfo, any, any, RequestHandlerOptions>[] = []

export const worker = setupWorker(...handlers)
