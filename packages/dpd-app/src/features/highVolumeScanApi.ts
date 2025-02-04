import { Market } from "@/models/Market";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const highvolumescanApi = createApi({
    reducerPath: "highvolumescanApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.API_BASE_URL,
        credentials: "include",
    }),
    endpoints: (builder) => ({
        getHighVolumeScanData: builder.query<
            Market[],
            { date: string; volumeThreshold?: number; topRecords?: number }
        >({
            query: ({ date, volumeThreshold, topRecords }) => {
                const params = new URLSearchParams();

                if (volumeThreshold !== undefined) params.append("volumeThreshold", volumeThreshold.toString());
                if (topRecords !== undefined) params.append("topRecords", topRecords.toString());

                return {
                    url: `/api/dpd/highvolumescan/${date}?${params.toString()}`,
                    method: "GET",
                };
            },
        }),
    }),
});

export const { useGetHighVolumeScanDataQuery } = highvolumescanApi;
