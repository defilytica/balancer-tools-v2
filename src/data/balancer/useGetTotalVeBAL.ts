import { useEffect } from 'react';
import { useContractRead} from 'wagmi'
import veBAL from '../../constants/abis/veBAL.json'


export function useGetTotalVeBAL(): number {
    const { data, isLoading } = useContractRead({
        address: '0xc128a9954e6c874ea3d62ce62b468ba073093f25',
        abi: veBAL,
        functionName: 'totalSupply',
        args: [],
        chainId: 1
    })

    useEffect(() => {
        if (!data && !isLoading) {
            console.log('Fetching data...');
        }
    }, [data, isLoading]);

    if (!data && isLoading) {
        return 0;
    }
    console.log(Number(data) / 1e18);
    return Number(data) / 1e18;
}
