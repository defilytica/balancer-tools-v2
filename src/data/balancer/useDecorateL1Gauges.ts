import {BalancerStakingGauges} from "./balancerTypes";
import vyperMainnetGauge from "../../constants/abis/vyperMainnetGauge.json";
import gaugeController from "../../constants/abis/gaugeController.json";
import {ethers} from "ethers";
import rootGaugeL2 from "../../constants/abis/rootGaugeL2.json";
import {useEffect, useState} from "react";
import {Multicall} from 'ethereum-multicall';
import {EthereumNetworkInfo} from "../../constants/networks";
import {useAccount} from 'wagmi';

const useDecorateL1Gauges = (stakingGaugeData: BalancerStakingGauges[] | undefined): BalancerStakingGauges[] => {

    const [decoratedGauges, setDecoratedGauges] = useState<BalancerStakingGauges[]>()
    const [isLoading, setIsLoading] = useState(true)
    const {isConnected, address} = useAccount();

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
            const mainnetGauges = gaugeData.filter(gauge => gauge.network.toString() === EthereumNetworkInfo.v3NetworkID);
            if (mainnetGauges.length > 0) {
                const contractCallContext = mainnetGauges.map((gauge) => ({
                    reference: gauge.address,
                    contractAddress: gauge.address,
                    abi: vyperMainnetGauge,
                    calls: [
                        {reference: "workingSupply", methodName: 'working_supply', methodParameters: []},
                        {reference: "totalSupply", methodName: 'totalSupply', methodParameters: []},
                        {reference: "workingBalance", methodName: 'working_balances', methodParameters: [address ? address : '0x3B8910F378034FD6E103Df958863e5c684072693']},
                        {reference: "userBalance", methodName: 'balanceOf', methodParameters: [address ? address : '0x3B8910F378034FD6E103Df958863e5c684072693']},
                    ],
                }));
                multicalls.push(multicall.call(contractCallContext));
            }

            const gaugeWeights = gaugeData;
            if (gaugeWeights.length > 0) {
                const contractCallContextWeights = gaugeWeights.map((gauge) => ({
                    reference: gauge.address,
                    contractAddress: "0xC128468b7Ce63eA702C1f104D55A2566b13D3ABD",
                    abi: gaugeController,
                    calls: [
                        {reference: "gaugeWeight", methodName: 'get_gauge_weight', methodParameters: [gauge.address]},
                        {reference: "totalWeight", methodName: 'get_total_weight', methodParameters: []},
                    ],
                }));
                multicalls.push(multicall.call(contractCallContextWeights));
            }

            //Obtain the l2 recipient addresses for all other chains
            const l2Gauges = gaugeData.filter(gauge => gauge.network.toString() !== EthereumNetworkInfo.v3NetworkID);
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
                    const gauges = gaugeData.filter(gauge => gauge.network.toString() === EthereumNetworkInfo.v3NetworkID);

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
                                userBalance: userBalanceHex ? Number(BigInt(userBalanceHex)) : 0,
                            };
                            updatedGaugeData.push(updatedGauge);
                        }
                    });

                    const gaugeWeights = gaugeData.filter(gauge => (gauge.network.toString() === EthereumNetworkInfo.v3NetworkID || gauge.network.toString() !== EthereumNetworkInfo.v3NetworkID))
                    console.log(gaugeWeights);

                    gaugeWeights.forEach((gauge, i) => {
                        if (resultsArray[1].results[gaugeWeights[i].address]) {
                            const context = resultsArray[1].results[gaugeWeights[i].address];
                            const gaugeWeightCall = context.callsReturnContext.find(call => call.reference === "gaugeWeight");
                            const gaugeTotalWeightCall = context.callsReturnContext.find(call => call.reference === "totalWeight");

                            const gaugeWeightHex = gaugeWeightCall && gaugeWeightCall.returnValues[0] ? gaugeWeightCall.returnValues[0].hex : '0';
                            const gaugeTotalWeightHex = gaugeTotalWeightCall && gaugeTotalWeightCall.returnValues[0] ? gaugeTotalWeightCall.returnValues[0].hex : '0';


                            const updatedGauge = {
                                ...gaugeWeights[i],
                                gaugeRelativeWeight: gaugeWeightHex ? Number(BigInt(gaugeWeightHex)) / Number(BigInt(gaugeTotalWeightHex)) * 100 : 0,
                            };
                            updatedGaugeData.push(updatedGauge);
                        }
                    });

                    //map l2 gauge recipients
                    const l2Gauges = gaugeData.filter(gauge => gauge.network.toString() !== EthereumNetworkInfo.v3NetworkID);
                    console.log(l2Gauges);
                    l2Gauges.forEach((gauge, i) => {
                        if (resultsArray[2].results[l2Gauges[i].address]) {
                            const context = resultsArray[2].results[l2Gauges[i].address];
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
        if (stakingGaugeData && stakingGaugeData.length > 1) {
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
    }, [isLoading, JSON.stringify(stakingGaugeData), address, isConnected]);

    if (decoratedGauges !== undefined) {
        return decoratedGauges;
    } else {
        return [];
    }
}

export default useDecorateL1Gauges;
