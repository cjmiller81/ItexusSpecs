"use client";

import { setupWorker } from "msw/browser";
import type { RequestHandler } from "msw";

import { backendApiServiceHandlers } from "./backendApiServiceHandlers";
import { yieldsHandlers } from "./yieldsHandlers";

const handlers: RequestHandler[] = [...backendApiServiceHandlers, ...yieldsHandlers];

export const worker = setupWorker(...handlers);
