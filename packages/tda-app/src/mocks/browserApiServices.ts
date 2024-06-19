'use client'

import { setupWorker } from 'msw/browser'
import { RequestHandler } from 'msw'
import { RequestHandlerDefaultInfo, RequestHandlerOptions } from 'msw/lib/core/handlers/RequestHandler'

let handlers: RequestHandler<RequestHandlerDefaultInfo, any, any, RequestHandlerOptions>[] = []

handlers = handlers.concat();

export const worker = setupWorker(...handlers)
