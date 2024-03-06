import { setupWorker } from 'msw/browser'
import { RequestHandler } from 'msw'
import { RequestHandlerDefaultInfo, RequestHandlerOptions } from 'msw/lib/core/handlers/RequestHandler'

import { tradingPlatformServiceHandlers } from './tradingPlatformServiceHandlers'
import { useACFWordPressServiceHandlers } from './useACFWordPressServiceHandlers'

let handlers: RequestHandler<RequestHandlerDefaultInfo, any, any, RequestHandlerOptions>[] = []

handlers = handlers.concat(tradingPlatformServiceHandlers);
handlers = handlers.concat(useACFWordPressServiceHandlers);

export const worker = setupWorker(...handlers)
