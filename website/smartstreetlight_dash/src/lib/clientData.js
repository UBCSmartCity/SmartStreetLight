'use client'

import useSWR from "swr";


// for prisma fetching 
export function FetchData(id) {
    const fetcher = (...args) => fetch(...args).then((res) => res.json());


    const { data, error, isLoading } = useSWR(
        `/readings/${id}`,
        fetcher,
        {
            refreshInterval: 100,
        }
    );

    return { data, error, isLoading };
}


// export function FetchData(location) {
//     const fetcher = (...args) => fetch(...args).then((res) => res.json());

//     const endpoint = location === "bigway" ? "bigway" : "sensor";
//     const port = location === "bigway" ? "5001" : "5000";

//     console.log(endpoint);
//     // const { data, error, isLoading } = useSWR(
//     //     `http://10:43:8:176:${port}/api/${endpoint}_readings`,
//     //     fetcher,
//     //     {
//     //         refreshInterval: 100,
//     //     }
//     // );
//     const { data, error, isLoading } = useSWR(
//         'http://10.43.8.176:5001/api/bigway_readings',
//         fetcher,
//         {
//             refreshInterval: 1000,
//         }
//     );

//     return { data, error, isLoading };
// }
