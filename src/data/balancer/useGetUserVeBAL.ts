import { useEffect } from 'react';
import {useAccount, useContractRead} from 'wagmi'
import veBAL from '../../constants/abis/veBAL.json'


export function useGetUserVeBAL(): number {
    const { address } = useAccount();
    const { data, isLoading } = useContractRead({
        address: '0xc128a9954e6c874ea3d62ce62b468ba073093f25',
        abi: veBAL,
        functionName: 'balanceOf',
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

    console.log("contract data", Number(data) / 1e18)

    return Number(data) / 1e18;
}