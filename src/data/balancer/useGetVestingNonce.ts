import { useEffect } from 'react';
import {useContractRead} from 'wagmi'
import veBoost from '../../constants/abis/veBoost.json'

export function useGetVestingNonce(address: string): number {
    const addrId = address.substring(2, address.length)
    const { data, isLoading } = useContractRead({
        address: `0x${addrId}`,
        abi: veBoost,
        functionName: 'delegable_balance',
        args: [],
        chainId: 42161
    })

    useEffect(() => {
        if (!data && !isLoading) {
            console.log('Fetching data...');
        }
    }, [data, isLoading]);

    if (!data && isLoading) {
        return 0;
    }

    return Number(data) / 1e18;
}
