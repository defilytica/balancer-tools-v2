import {BalancerStakingGauges} from "./balancerTypes";
import vyperMainnetGauge from "../../constants/abis/vyperMainnetGauge.json";
import {ethers} from "ethers";
import rootGaugeL2 from "../../constants/abis/rootGaugeL2.json";
import {useEffect, useState} from "react";
import {Multicall} from 'ethereum-multicall';
import {EthereumNetworkInfo} from "../../constants/networks";
import {useAccount} from 'wagmi';
import { calculateBoostFromGauge, calculateMaxBoost, calculateMinVeBAL } from "../../pages/VeBAL/veBALHelpers";
import { useGetTotalVeBAL } from "./useGetTotalVeBAL";


const useDecorateL1Gauges = (stakingGaugeData: BalancerStakingGauges[]): BalancerStakingGauges[] => {

    const [decoratedGauges, setDecoratedGauges] = useState<BalancerStakingGauges[]>()
    const [isLoading, setIsLoading] = useState(true)
    const {address} = useAccount();
    const totalVeBAL = useGetTotalVeBAL();
    const fetchVotingGaugesWorkingSupply = async (gaugeData: BalancerStakingGauges[] | undefined): Promise<BalancerStakingGauges[]> => {
        const updatedGaugeData: BalancerStakingGauges[] = [];
        if (gaugeData && gaugeData.length > 0) {
            const multicalls = [];

            const providerUrl = 'https://eth.llamarpc.com';
            const multicall = new Multicall({
                ethersProvider: new ethers.providers.JsonRpcProvider(providerUrl),
                tryAggregate: true
            });

            const multicallRoots = new Multicall({
                ethersProvider: new ethers.providers.JsonRpcProvider('https://eth.llamarpc.com'),
                tryAggregate: true
            });
            //Obtain mainnet gauge working and total supplies
            const mainnetGauges = gaugeData.filter(gauge => gauge.network.toString() === EthereumNetworkInfo.chainId);
            if (mainnetGauges.length > 0) {
                const contractCallContext = mainnetGauges.map((gauge) => ({
                    reference: gauge.address,
                    contractAddress: gauge.address,
                    abi: vyperMainnetGauge,
                    calls: [
                        {reference: "workingSupply", methodName: 'working_supply', methodParameters: []},
                        {reference: "totalSupply", methodName: 'totalSupply', methodParameters: []},
                        {reference: "workingBalance", methodName: 'working_balances', methodParameters: [address]},
                        {reference: "userBalance", methodName: 'balanceOf', methodParameters: [address]},
                    ],
                }));
                multicalls.push(multicall.call(contractCallContext));
            }

            //Obtain the l2 recipient addresses for all other chains
            const l2Gauges = gaugeData.filter(gauge => gauge.network.toString() !== EthereumNetworkInfo.chainId);
            if (l2Gauges.length > 2) {
                const contractCallContextRoots = l2Gauges.map((gauge) => ({
                    reference: gauge.address,
                    contractAddress: gauge.address,
                    abi: rootGaugeL2,
                    calls: [
                        {reference: "recipient", methodName: 'getRecipient', methodParameters: []},
                    ],
                }));
                multicalls.push(multicallRoots.call(contractCallContextRoots));
            }

            try {
                const resultsArray = await Promise.all(multicalls);

                    //map mainnet gauge working and total supplies
                    const gauges = gaugeData.filter(gauge => gauge.network.toString() === EthereumNetworkInfo.chainId);

                    gauges.forEach((gauge, i) => {
                        if (resultsArray[0].results[gauges[i].address]) {
                            const context = resultsArray[0].results[gauges[i].address];
                            const workingSupplyCall = context.callsReturnContext.find(call => call.reference === "workingSupply");
                            const totalSupplyCall = context.callsReturnContext.find(call => call.reference === "totalSupply");
                            const workingBalanceCall = context.callsReturnContext.find(call => call.reference === "workingBalance");
                            const userBalanceCall = context.callsReturnContext.find(call => call.reference === "userBalance");

                            const workingSupplyHex = workingSupplyCall && workingSupplyCall.returnValues[0] ? workingSupplyCall.returnValues[0].hex : '0';
                            const totalSupplyHex = totalSupplyCall && totalSupplyCall.returnValues[0] ? totalSupplyCall.returnValues[0].hex : '0';
                            const workingBalanceHex = workingBalanceCall && workingBalanceCall.returnValues[0] ? workingBalanceCall.returnValues[0].hex : '0';
                            const userBalanceHex = userBalanceCall && userBalanceCall.returnValues[0] ? userBalanceCall.returnValues[0].hex : '0';

                            const updatedGauge = {
                                ...gauges[i],
                                workingSupply: workingSupplyHex ? BigInt(workingSupplyHex).toString() : '-',
                                totalSupply: totalSupplyHex ? BigInt(totalSupplyHex).toString() : '-',
                                workingBalance: workingBalanceHex ? BigInt(workingBalanceHex).toString() : '-',
                                userBalance: userBalanceHex ? BigInt(userBalanceHex).toString() : '-',
                                boost: workingSupplyHex ? String(calculateBoostFromGauge( Number(BigInt(workingBalanceHex).toString()), Number(BigInt(workingSupplyHex).toString()), Number(BigInt(totalSupplyHex).toString()), Number(BigInt(userBalanceHex).toString()))) : "1",
                                max_boost: workingSupplyHex ? String(calculateMaxBoost( Number(BigInt(workingBalanceHex).toString()), Number(BigInt(workingSupplyHex).toString()), Number(BigInt(totalSupplyHex).toString()), Number(BigInt(userBalanceHex).toString()))) : "1",
                                min_VeBAL: workingSupplyHex ? String(calculateMinVeBAL( Number(BigInt(workingBalanceHex).toString()), Number(BigInt(workingSupplyHex).toString()), Number(BigInt(totalSupplyHex).toString()), Number(BigInt(userBalanceHex).toString()), Number(totalVeBAL))) : "1",
                            };
                            updatedGaugeData.push(updatedGauge);
                        }
                    });

                    //map l2 gauge recipients
                    const l2Gauges = gaugeData.filter(gauge => gauge.network.toString() !== EthereumNetworkInfo.chainId);
                    l2Gauges.forEach((gauge, i) => {
                        if (resultsArray[1].results[l2Gauges[i].address]) {
                            const context = resultsArray[1].results[l2Gauges[i].address];
                            const recipientCall = context.callsReturnContext.find(call => call.reference === "recipient");
                            const recipientAddress = recipientCall && recipientCall.returnValues[0] ? recipientCall.returnValues[0] : '';

                            const updatedGauge = {
                                ...l2Gauges[i],
                                recipient: recipientAddress,
                            };

                            updatedGaugeData.push(updatedGauge);
                        }
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

export default useDecorateL1Gauges;