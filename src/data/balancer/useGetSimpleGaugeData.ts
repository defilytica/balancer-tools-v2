import { useState, useEffect } from "react";

export interface SimpleGauge {
    address: string;
    network: number;
    isKilled: boolean;
    addedTimestamp: number;
    relativeWeightCap: string | null;
    pool: {
        id: string;
        address: string;
        poolType: string;
        symbol: string;
        tokens: {
            address: string;
            weight: string | null;
            symbol: string;
        }[];
    };
    tokenLogoURIs: {
        [address: string]: string;
    };
}

const useGetSimpleGaugeData = (): SimpleGauge[] => {
    const [gaugeData, setGaugeData] = useState<SimpleGauge[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "https://raw.githubusercontent.com/balancer-labs/frontend-v2/master/src/data/voting-gauges.json"
                );
                const data = await response.json();
                setGaugeData(data);
            } catch (error) {
                console.error("Error fetching gauge data:", error);
            }
        };

        fetchData();
    }, []);

    return gaugeData;
};

export default useGetSimpleGaugeData;
