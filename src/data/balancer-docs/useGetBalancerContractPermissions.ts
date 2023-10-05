import { useState, useEffect } from 'react';
import {BalancerPermission, FetchResponse} from "./permissionTypes";

export const useGetBalancerContractPermissions = (activeNetworkId: string): FetchResponse => {
    const [data, setData] = useState<BalancerPermission[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // TODO: lookup table for all network endpoints
                const response = await fetch(`https://raw.githubusercontent.com/balancer/docs/main/data_files/permissions/${activeNetworkId}.json`);

                if (!response.ok) {
                    throw new Error('Could not fetch json data');
                }

                const jsonData: BalancerPermission[] = await response.json();
                setData(jsonData);
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [activeNetworkId]);

    return { data, error, isLoading };
};
