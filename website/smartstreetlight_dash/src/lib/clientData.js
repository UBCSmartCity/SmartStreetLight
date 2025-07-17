'use client'

import useSWR from "swr";

// for prisma fetching 
export function FetchData(id, refreshInterval = 1000) {
    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data, error, isLoading } = useSWR(
        `api/readings/${id}`,
        fetcher,
        {
            refreshInterval,
        }
    );

    return { data, error, isLoading };
}