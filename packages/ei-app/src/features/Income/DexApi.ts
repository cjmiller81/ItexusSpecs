import { axiosBaseQuery } from "@/libs/axios/axios";
import { createApi } from "@reduxjs/toolkit/query/react";

export const dexsApi = createApi({
    reducerPath: "dexs",
    baseQuery: axiosBaseQuery(),
    endpoints(build) {
        return {
            getDexs: build.query<string[], void>({ query: () => ({ url: "/api/defi/dexs", method: "get" }) }),
        };
    },
});

export const { useGetDexsQuery } = dexsApi;
