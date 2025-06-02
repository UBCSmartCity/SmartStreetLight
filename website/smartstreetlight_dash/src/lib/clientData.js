'use client'

import useSWR from "swr";



export function FetchData(location) {
    const fetcher = (...args) => fetch(...args).then((res) => res.json());


    const { data, error, isLoading } = useSWR(
        `/${location}`,
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
//     const { data, error, isLoading } = useSWR(
//         `http://10.17.168.46:${port}/api/${endpoint}_readings`,
//         fetcher,
//         {
//             refreshInterval: 100,
//         }
//     );

//     return { data, error, isLoading };
// }
