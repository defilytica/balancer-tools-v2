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
    [ArbitrumNetworkInfo.chainId]: 'https://arb1.arbitrum.io/rpc',
    [PolygonNetworkInfo.chainId]: 'https://polygon-bor.publicnode.com',
    "10": 'https://optimism.publicnode.com',
    "5": 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    "100": 'https://rpc.gnosischain.com',
    "1101": 'https://zkevm-rpc.com',
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
                    ethersProvider: new ethers.providers.JsonRpcProvider('https://eth.llamarpc.com'),
                    tryAggregate: true
                });

                const multicallRoots = new Multicall({
                    ethersProvider: new ethers.providers.JsonRpcProvider('https://eth.llamarpc.com'),
                    tryAggregate: true
                });
 
                const gauges = gaugeData.filter(gauge => gauge.network.toString() === network);
                if (gauges.length > 0) {
                    if (network === EthereumNetworkInfo.chainId || network === "5")  {
                        const contractCallContext = gauges.map((gauge) => ({
                            reference: gauge.address,
                            contractAddress: gauge.address,
                            abi: vyperMainnetGauge,
                            calls: [
                                { reference: "workingSupply", methodName: 'working_supply', methodParameters: [] },
                                { reference: "totalSupply", methodName: 'totalSupply', methodParameters: [] },
                            ],
                        }));

                    multicalls.push(multicall.call(contractCallContext));
                    }
                };

                if (gauges.length > 0) {
                    if (network === ArbitrumNetworkInfo.chainId || network === PolygonNetworkInfo.chainId || network === '100' || network === '10' || network === '1101')  {
                        const contractCallContextRoots = gauges.map((gauge) => ({
                            reference: gauge.address,
                            contractAddress: gauge.address,
                            abi: rootGaugeL2,
                            calls: [
                                { reference: "recipient", methodName: 'getRecipient', methodParameters: [] },
                            ],
                        }));

                    multicalls.push(multicallRoots.call(contractCallContextRoots));
                    }
                } console.log()
            };
            try {
                const resultsArray = await Promise.all(multicalls);
                console.log(resultsArray);
                
                resultsArray.forEach((results, index) => {
                  const network = Object.keys(NETWORK_PROVIDERS)[index];
                  const gauges = gaugeData.filter(gauge => gauge.network.toString() === network);
                
                  gauges.forEach(async (gauge, i) => {
                    const context = results.results[gauges[i].address];
                
                    if (network === EthereumNetworkInfo.chainId || network === "5") {
                      const workingSupplyCall = context.callsReturnContext.find(call => call.reference === "workingSupply");
                      const totalSupplyCall = context.callsReturnContext.find(call => call.reference === "totalSupply");
                
                      const workingSupplyHex = workingSupplyCall && workingSupplyCall.returnValues[0] ? workingSupplyCall.returnValues[0].hex : '0';
                      const totalSupplyHex = totalSupplyCall && totalSupplyCall.returnValues[0] ? totalSupplyCall.returnValues[0].hex : '0';
                
                      const updatedGauge = {
                        ...gauges[i],
                        workingSupply: workingSupplyHex ? BigInt(workingSupplyHex).toString() : '-',
                        totalSupply: totalSupplyHex ? BigInt(totalSupplyHex).toString() : '-',
                        recipient: '-' // Set recipient as '-' for Ethereum network
                      };
                
                      updatedGaugeData.push(updatedGauge);
                    } else {
                      const recipientCall = context.callsReturnContext.find(call => call.reference === "recipient");
                      const recipientAddress = recipientCall && recipientCall.returnValues[0] ? recipientCall.returnValues[0] : '';
                
                      if (recipientAddress) {
                        const l2Multicall = new Multicall({
                          ethersProvider: new ethers.providers.JsonRpcProvider(NETWORK_PROVIDERS[network]),
                          tryAggregate: true
                        });
                
                        const l2ContractCallContext = {
                          reference: gauge.address,
                          contractAddress: recipientAddress,
                          abi: vyperPolygonGauge,
                          calls: [
                            { reference: "workingSupply", methodName: 'working_supply', methodParameters: [] },
                            { reference: "totalSupply", methodName: 'totalSupply', methodParameters: [] },
                          ],
                        };
                
                        try {
                          const l2Results = await l2Multicall.call(l2ContractCallContext);
                
                          const l2WorkingSupplyCall = l2Results.results[gauge.address].callsReturnContext.find(call => call.reference === "workingSupply");
                          const l2TotalSupplyCall = l2Results.results[gauge.address].callsReturnContext.find(call => call.reference === "totalSupply");
                
                          const l2WorkingSupplyHex = l2WorkingSupplyCall && l2WorkingSupplyCall.returnValues[0] ? l2WorkingSupplyCall.returnValues[0].hex : '0';
                          const l2TotalSupplyHex = l2TotalSupplyCall && l2TotalSupplyCall.returnValues[0] ? l2TotalSupplyCall.returnValues[0].hex : '0';
                
                          const updatedGauge = {
                            ...gauges[i],
                            workingSupply: l2WorkingSupplyHex ? BigInt(l2WorkingSupplyHex).toString() : '-',
                            totalSupply: l2TotalSupplyHex ? BigInt(l2TotalSupplyHex).toString() : '-',
                            recipient: recipientAddress
                          };
                          updatedGaugeData.push(updatedGauge);
                        } catch (error) {
                          console.error('Error executing L2 multicall:', error);
                        }
                      }
                    };
                  }); 
                }); 
              } catch (error) {
                console.error('Error executing multicall:', error);
                return [];
              }              
        }
        console.log(updatedGaugeData);
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