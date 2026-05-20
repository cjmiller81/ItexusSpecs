import { http, HttpResponse } from "msw";
import { walletsContainerHandlers } from "components/src/storybookMocks/walletsContainerHandlers";
import type { ICoin } from "components";

import allTokens from "./data/tokens/all.json";

const storyTopTokens = (allTokens as ICoin[]).slice(0, 20);

const reactourHandlers = [
  http.get(/.*\/api\/user-preferences\/reactour(?:\?.*)?$/, () => HttpResponse.json({ tours: {} })),
  http.put(/.*\/api\/user-preferences\/reactour(?:\?.*)?$/, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(body);
  }),
  http.patch(/.*\/api\/user-preferences\/reactour\/[^/]+(?:\?.*)?$/, () =>
    HttpResponse.json({
      tour_name: "storybook",
      step: 0,
      viewed: true,
    }),
  ),
];

const tokensV2Handler = http.get(/.*\/tokensV2(?:\?.*)?$/, () =>
  HttpResponse.json({
    data: storyTopTokens,
    totalCount: storyTopTokens.length,
  }),
);

/**
 * MSW handlers commonly needed when rendering full Next.js pages in Storybook
 * (wallets, reactour, home top-tokens, etc.). Compose with story-specific handlers.
 */
export function pageStoryHandlers() {
  return [...walletsContainerHandlers(), ...reactourHandlers, tokensV2Handler];
}
