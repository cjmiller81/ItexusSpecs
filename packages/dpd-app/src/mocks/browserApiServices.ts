'use client'

import { setupWorker } from 'msw/browser'
import { RequestHandler } from 'msw'
import { RequestHandlerDefaultInfo, RequestHandlerOptions } from 'msw/lib/core/handlers/RequestHandler'

import { backendApiServiceHandlers } from './backendApiServiceHandlers'
//import { someOtherServiceHandlers } from './someOtherServiceHandlers'

let handlers: RequestHandler<RequestHandlerDefaultInfo, any, any, RequestHandlerOptions>[] = []

handlers = handlers.concat(backendApiServiceHandlers);
//handlers = handlers.concat(someOtherServiceHandlers);

export const worker = setupWorker(...handlers)