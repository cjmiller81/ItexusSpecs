import { http, HttpResponse } from "msw";

/** Mock Kraken balance map (asset code → quantity). */
export function krakenStoryHandlers() {
  return [
    http.get(/.*\/api\/kraken\/account-balance(?:\?.*)?$/, () =>
      HttpResponse.json({
        XXBT: 0.042,
        ZUSD: 1250.55,
        ZEUR: 100.0,
      }),
    ),
  ];
}
