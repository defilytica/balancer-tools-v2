import { useEffect } from 'react';
import {useContractRead} from 'wagmi'
import veBoost from '../../constants/abis/veBoost.json'

//Adjusted to 0x67F8DF125B796B05895a6dc8Ecf944b9556ecb0B veBoost to include delegations
export function useGetUserVeBAL(address: string): number {
    const { data, isLoading } = useContractRead({
        address: '0x67F8DF125B796B05895a6dc8Ecf944b9556ecb0B',
        abi: veBoost,
        functionName: 'adjusted_balance_of',
        args: [address?.toLowerCase()]
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
