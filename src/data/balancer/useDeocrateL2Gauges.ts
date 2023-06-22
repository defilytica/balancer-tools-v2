import { BalancerStakingGauges } from "./balancerTypes";
import { ethers } from "ethers";
import vyperPolygonGauge from "../../constants/abis/vyperPolygonGauge.json";
import { useEffect, useState } from "react";
import { ArbitrumNetworkInfo, EthereumNetworkInfo, PolygonNetworkInfo } from "../../constants/networks";
import {ContractCallResults, ContractCallReturnContext, Multicall} from 'ethereum-multicall';

const NETWORK_PROVIDERS = {
    "10": 'https://optimism.publicnode.com',
    "100": 'https://rpc.gnosischain.com',
    [PolygonNetworkInfo.chainId]: 'https://polygon-bor.publicnode.com',
    [ArbitrumNetworkInfo.chainId]: 'https://rpc.ankr.com/arbitrum',
};

interface MulticallItem {
    chainId: string;
    promise: Promise<  ContractCallResults>; // replace "any" with the specific type you're expecting
}

const useDecorateL2Gauges = (stakingGaugeData: BalancerStakingGauges[]): BalancerStakingGauges[] => {

    const [decoratedGauges, setDecoratedGauges] = useState<BalancerStakingGauges[]>()
    const [isLoading, setIsLoading] = useState(true)

    const fetchL2Supplies = async (gaugeData: BalancerStakingGauges[] | undefined): Promise<BalancerStakingGauges[]> => {
        const updatedGaugeData: BalancerStakingGauges[] = [];
        const multicalls: MulticallItem[] = [];

        if (gaugeData && gaugeData.length > 0) {
            for (let chainId in NETWORK_PROVIDERS) {
                if (chainId !== EthereumNetworkInfo.chainId) {
                    const multicall = new Multicall({
                        ethersProvider: new ethers.providers.JsonRpcProvider(NETWORK_PROVIDERS[chainId]),
                        tryAggregate: true
                    });

                    const networkGauges = gaugeData.filter(gauge => gauge.network.toString() === chainId && gauge.recipient !== '');
                    if (networkGauges.length > 0) {
                        const contractCallContext = networkGauges.map((gauge) => ({
                            reference: gauge.address,
                            contractAddress: gauge.recipient,
                            abi: vyperPolygonGauge,
                            calls: [
                                { reference: "workingSupply", methodName: 'working_supply', methodParameters: [] },
                                { reference: "totalSupply", methodName: 'totalSupply', methodParameters: [] },
                            ],
                        }));
                        multicalls.push({ chainId, promise: multicall.call(contractCallContext) });
                    }
                }
            }

            try {
                const resultsArray = await Promise.all(multicalls.map(({ promise }) => promise));

                const mainnetGauges = gaugeData.filter(gauge => gauge.network.toString() === EthereumNetworkInfo.chainId);
                mainnetGauges.forEach((gauge) => {
                    updatedGaugeData.push(gauge)
                })

                resultsArray.forEach((result, index) => {
                    const chainId = multicalls[index].chainId;

                    const networkGauges = gaugeData.filter(gauge => gauge.network.toString() === chainId);
                    networkGauges.forEach((gauge, i) => {
                        if (result.results[networkGauges[i].address]) {
                            const context = result.results[networkGauges[i].address];
                            const workingSupplyCall = context.callsReturnContext.find(call => call.reference === "workingSupply");
                            const totalSupplyCall = context.callsReturnContext.find(call => call.reference === "totalSupply");

                            const workingSupplyHex = workingSupplyCall && workingSupplyCall.returnValues[0] ? workingSupplyCall.returnValues[0].hex : '0';
                            const totalSupplyHex = totalSupplyCall && totalSupplyCall.returnValues[0] ? totalSupplyCall.returnValues[0].hex : '0';

                            const updatedGauge = {
                                ...networkGauges[i],
                                workingSupply: workingSupplyHex ? BigInt(workingSupplyHex).toString() : '-',
                                totalSupply: totalSupplyHex ? BigInt(totalSupplyHex).toString() : '-'
                            };

                            updatedGaugeData.push(updatedGauge);
                        }
                    });
                });

            } catch (error) {
                console.error('Error executing multicall:', error);
                return [];
            }
        }
        return updatedGaugeData;
    }

    useEffect(() => {
        if (isLoading && stakingGaugeData && stakingGaugeData.length > 0) {
            setIsLoading(false);
            fetchL2Supplies(stakingGaugeData)
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

export default useDecorateL2Gauges;
