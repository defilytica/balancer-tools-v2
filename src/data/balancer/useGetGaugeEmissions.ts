import { useEffect, useState } from "react";
import gaugeController from "../../constants/abis/gaugeController.json";
import { BalancerStakingGauges } from "./balancerTypes";
import { Multicall } from "ethereum-multicall";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { EthereumNetworkInfo } from "../../constants/networks";
import { useGetTotalWeight } from "./useGetTotalWeight";

const useGetGaugeRelativeWeights = (stakingGaugeData: BalancerStakingGauges[]): BalancerStakingGauges[] => {

  const [gaugesWithRelativeWeights, setGaugesWithRelativeWeights] = useState<BalancerStakingGauges[]>();
  const [isLoading, setIsLoading] = useState(true);
  const {isConnected, address} = useAccount();
  const totalWeight = useGetTotalWeight();

  // Fetch gauge relative weights
  const fetchGaugeRelativeWeights = async (gaugeData: BalancerStakingGauges[] | undefined): Promise<BalancerStakingGauges[]> => {
    const updatedGaugeData: BalancerStakingGauges[] = [];
    if (gaugeData && gaugeData.length > 0) {
      const multicalls = [];

      const providerUrl = "https://eth.llamarpc.com";
      const multicall = new Multicall({
        ethersProvider: new ethers.providers.JsonRpcProvider(providerUrl),
        tryAggregate: true,
      });

      // Obtain all gauge relative weights
      const allGauges = gaugeData.filter(gauge => (gauge.network.toString() === EthereumNetworkInfo.chainId) || (gauge.network.toString() !== EthereumNetworkInfo.chainId));
      if (allGauges.length > 0) {
        const contractCallContext = allGauges.map((gauge) => ({
        reference: gauge.address,
        contractAddress: "0xC128468b7Ce63eA702C1f104D55A2566b13D3ABD",
        abi: gaugeController,
        calls: [
          {
            reference: "gaugeRelativeWeight",
            methodName: "get_gauge_weight",
            methodParameters: [gauge.address],
          },
        ],
      }));
      multicalls.push(multicall.call(contractCallContext));
    };

    try {
      const resultsArray = await Promise.all(multicalls);
      const gauges = gaugeData.filter(gauge => (gauge.network.toString() === EthereumNetworkInfo.chainId) || (gauge.network.toString() !== EthereumNetworkInfo.chainId));
      gaugeData.forEach((gauge, i) => {
        const context = resultsArray[0].results[gauges[i].address];
        const gaugeRelativeWeightCall = context.callsReturnContext.find(call => call.reference === "gaugeRelativeWeight");
        const gaugeRelativeWeightHex = gaugeRelativeWeightCall && gaugeRelativeWeightCall.returnValues[0] ? gaugeRelativeWeightCall.returnValues[0].hex : '0';

        const updatedGauge = {
          ...gaugeData[i],
          gaugeRelativeWeight: gaugeRelativeWeightHex ? (Number(BigInt(gaugeRelativeWeightHex)) / 1e18 / totalWeight * 100) : 0,
          gaugeVotes: gaugeRelativeWeightHex ? (Number(BigInt(gaugeRelativeWeightHex)) / 1e18) : 0,
        };
        updatedGaugeData.push(updatedGauge);
      });
    } catch (error) {
      console.error('Error executing multicall:', error);
      return [];
  }
}
return updatedGaugeData;
}
  // Fetch and populate gauge supply numbers
  useEffect(() => {
    if (stakingGaugeData && stakingGaugeData.length > 0) {
      setIsLoading(false); // You probably meant to set it to true here, not false
      fetchGaugeRelativeWeights(stakingGaugeData)
        .then((decoratedData) => {
          setGaugesWithRelativeWeights(decoratedData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching gauge relative weights:", error);
          setIsLoading(false);
        });
    }
  }, [isLoading, stakingGaugeData, address, isConnected]);

  if (gaugesWithRelativeWeights !== undefined) {
    return gaugesWithRelativeWeights;
  } else {
    return [];
  }
}

export default useGetGaugeRelativeWeights;