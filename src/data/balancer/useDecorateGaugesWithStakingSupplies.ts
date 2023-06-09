import {BalancerStakingGauges} from "./balancerTypes";
import vyperMainnetGauge from "../../constants/abis/vyperMainnetGauge.json";
import veBAL from '../../constants/abis/veBAL.json'
import {ethers} from "ethers";
import rootGaugeL2 from "../../constants/abis/rootGaugeL2.json";
import vyperPolygonGauge from "../../constants/abis/vyperPolygonGauge.json";
import {useEffect, useState} from "react";
import {ArbitrumNetworkInfo, EthereumNetworkInfo, PolygonNetworkInfo} from "../../constants/networks";
import { multicall } from '@wagmi/core'

const useDecorateGaugesWithStakingSupplies = (stakingGaugeData: BalancerStakingGauges[]): BalancerStakingGauges[] => {

    const [decoratedGauges, setDecoratedGauges] = useState<BalancerStakingGauges[]>()
    const [isLoading, setIsLoading] = useState(true)
    const fetchVotingGaugesWorkingSupply = async (gaugeData: BalancerStakingGauges[] | undefined): Promise<BalancerStakingGauges[]> => {
        let updatedGaugeData: BalancerStakingGauges[] = [];
        if (gaugeData && gaugeData.length > 1) {
            try {
                for (let i = 0; i < 10; i++) {
                    const gauge = gaugeData[i];
                    let networkAbi, networkProvider;

                    //TODO: Refactor with multi-call
                    if (Number(gauge.network) === Number(EthereumNetworkInfo.chainId)) {
                        networkAbi = vyperMainnetGauge;
                        networkProvider = new ethers.providers.JsonRpcProvider('https://eth.llamarpc.com');
                    } else if (Number(gauge.network) === Number(PolygonNetworkInfo.chainId)) {
                        networkAbi = rootGaugeL2;
                        networkProvider = new ethers.providers.JsonRpcProvider('https://rpc-mainnet.matic.quiknode.pro	');
                    } else if (Number(gauge.network) === Number(ArbitrumNetworkInfo.chainId)) {
                        networkAbi = rootGaugeL2;
                        networkProvider = new ethers.providers.JsonRpcProvider('https://endpoints.omniatech.io/v1/arbitrum/one/public');
                    } else if (gauge.network === "10") {
                        networkAbi = rootGaugeL2;
                        networkProvider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/optimism');
                    } else if (gauge.network === "5") {
                        networkAbi = vyperMainnetGauge;
                        networkProvider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161	');
                    } else if (gauge.network === "100") {
                        networkAbi = rootGaugeL2;
                        networkProvider = new ethers.providers.JsonRpcProvider('https://rpc.gnosischain.com');
                    } else {
                        // Use default ABI and provider if network is not recognized
                        networkAbi = vyperMainnetGauge;
                        networkProvider = new ethers.providers.JsonRpcProvider('https://eth.llamarpc.com');
                    }

                    let workingSupply = ethers.BigNumber.from(0);
                    let totalSupply = ethers.BigNumber.from(0);
                    let supplyFetchError = false;

                    try {
                        if (Number(gauge.network) === Number(EthereumNetworkInfo.chainId) || gauge.network === "5") {
                            const contract = new ethers.Contract(gauge.address, networkAbi, networkProvider);
                            workingSupply = await contract.working_supply();
                            totalSupply = await contract.totalSupply();
                        } else {
                            try {
                                const mainnetContract = new ethers.Contract(gauge.address, networkAbi, new ethers.providers.JsonRpcProvider('https://eth.llamarpc.com'));
                                const getRecipient = await mainnetContract.getRecipient();
                                // Decode the getRecipient value from hex to address
                                const decodedRecipient: string = ethers.utils.hexlify(getRecipient);
                                const l2Contract = new ethers.Contract(decodedRecipient, vyperPolygonGauge, networkProvider);
                                workingSupply = await l2Contract.working_supply();
                                totalSupply = await l2Contract.totalSupply();
                            } catch (error) {
                                console.error('Error retrieving working supply and total supply:', error);
                                // Handle the error and set workingSupply and totalSupply to 0
                                workingSupply = ethers.BigNumber.from(0);
                                totalSupply = ethers.BigNumber.from(0);
                                supplyFetchError = true;
                            }
                        }
                    } catch (error) {
                        console.error('Error retrieving working supply and total supply:', error);
                        supplyFetchError = true;
                    }
                    let updatedGauge = {...gauge};
                    const convertedSupply = ethers.BigNumber.from(workingSupply).toString();
                    const convertedTotalSupply = ethers.BigNumber.from(totalSupply).toString();
                    if (!supplyFetchError) {
                        updatedGauge.workingSupply = convertedSupply;
                        updatedGauge.totalSupply = convertedTotalSupply;
                    } else {
                        updatedGauge.workingSupply = "0";
                        updatedGauge.totalSupply = "0";
                    }

                    updatedGaugeData.push(updatedGauge);
                }
            } catch (error) {
                console.error('Error fetching working supply:', error);
            }
            setIsLoading(false)
            return updatedGaugeData;
        }
        return [];
    };



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