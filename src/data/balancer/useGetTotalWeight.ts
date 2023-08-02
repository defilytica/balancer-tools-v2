import { useEffect } from 'react';
import { useContractRead} from 'wagmi'
import gaugeController from '../../constants/abis/gaugeController.json'


export function useGetTotalWeight(): number {
    const { data, isLoading } = useContractRead({
        address: '0xC128468b7Ce63eA702C1f104D55A2566b13D3ABD',
        abi: gaugeController,
        functionName: 'get_total_weight',
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
    //console.log(Number(data) / 1e18);
    return Number(data) / 1e18;
}
