import {BalancerStakingGauges} from "./balancerTypes";
import vyperMainnetGauge from "../../constants/abis/vyperMainnetGauge.json";
import {ethers} from "ethers";
import rootGaugeL2 from "../../constants/abis/rootGaugeL2.json";
import vyperPolygonGauge from "../../constants/abis/vyperPolygonGauge.json";
import {useEffect, useState} from "react";
import {ArbitrumNetworkInfo, EthereumNetworkInfo, PolygonNetworkInfo} from "../../constants/networks";
import {Multicall} from 'ethereum-multicall';

//TODO: refactor/ add to consts if we will use something like this in the future
const NETWORK_PROVIDERS = {
    [EthereumNetworkInfo.chainId]: 'https://eth.llamarpc.com',
    [PolygonNetworkInfo.chainId]: 'https://rpc-mainnet.matic.quiknode.pro',
    [ArbitrumNetworkInfo.chainId]: 'https://endpoints.omniatech.io/v1/arbitrum/one/public',
    "10": 'https://rpc.ankr.com/optimism',
    "5": 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    "100": 'https://rpc.gnosischain.com',
};

const useDecorateGaugesWithStakingSupplies = (stakingGaugeData: BalancerStakingGauges[]): BalancerStakingGauges[] => {

    const [decoratedGauges, setDecoratedGauges] = useState<BalancerStakingGauges[]>()
    const [isLoading, setIsLoading] = useState(true)
    const fetchVotingGaugesWorkingSupply = async (gaugeData: BalancerStakingGauges[] | undefined): Promise<BalancerStakingGauges[]> => {
        const updatedGaugeData: BalancerStakingGauges[] = [];
        if (gaugeData && gaugeData.length > 0) {
            const multicalls = [];
            for (let network in NETWORK_PROVIDERS) {
                const providerUrl = NETWORK_PROVIDERS[network];
                const multicall = new Multicall({
                    ethersProvider: new ethers.providers.JsonRpcProvider(providerUrl),
                    tryAggregate: true
                });

                const gauges = gaugeData.filter(gauge => gauge.network.toString() === network);
                if (gauges.length > 0) {
                    const contractCallContext = gauges.map((gauge) => ({
                        reference: gauge.address,
                        contractAddress: gauge.address,
                        abi: vyperMainnetGauge,
                        calls: [
                            {reference: "workingSupply", methodName: 'working_supply', methodParameters: []},
                            {reference: "totalSupply", methodName: 'totalSupply', methodParameters: []}
                        ],
                    }));
                    multicalls.push(multicall.call(contractCallContext));
                }
            }

            try {

                const resultsArray = await Promise.all(multicalls);

                resultsArray.forEach((results, index) => {
                    const gauges = gaugeData.filter(gauge => gauge.network.toString() === Object.keys(NETWORK_PROVIDERS)[index]);

                    gauges.forEach((gauge, i) => {
                        const context = results.results[gauges[i].address];
                        const workingSupplyCall = context.callsReturnContext.find(call => call.reference === "workingSupply");
                        const totalSupplyCall = context.callsReturnContext.find(call => call.reference === "totalSupply");

                        const workingSupplyHex = workingSupplyCall && workingSupplyCall.returnValues[0] ? workingSupplyCall.returnValues[0].hex : '0';
                        const totalSupplyHex = totalSupplyCall && totalSupplyCall.returnValues[0] ? totalSupplyCall.returnValues[0].hex : '0';

                        const updatedGauge = {
                            ...gauges[i],
                            workingSupply: workingSupplyHex ? BigInt(workingSupplyHex).toString() : '-',
                            totalSupply: totalSupplyHex ? BigInt(totalSupplyHex).toString(): '-'
                        };

                        updatedGaugeData.push(updatedGauge);
                    });
                });
            } catch (error) {
                console.error('Error executing multicall:', error);
                return [];
            }
        }
        return updatedGaugeData;
    }


    //Fetch and populate gauge supply numbers
    useEffect(() => {
        if (isLoading && stakingGaugeData && stakingGaugeData.length > 0) {
            setIsLoading(false);
            fetchVotingGaugesWorkingSupply(stakingGaugeData)
                .then((decoratedData) => {
                    setDecoratedGauges(decoratedData);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching working supply:', error);
                    setIsLoading(false);
                });
            setIsLoading(false);
        }
    }, [isLoading, stakingGaugeData]);

    if (decoratedGauges !== undefined) {
        return decoratedGauges;
    } else {
        return [];
    }
}

export default useDecorateGaugesWithStakingSupplies;