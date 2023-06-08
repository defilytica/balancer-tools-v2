import { useState, useEffect } from "react";
import { ethers } from "ethers";
import vyperMainnetGauge from '../../constants/abis/vyperMainnetGauge.json';
import vyperPolygonGauge from '../../constants/abis/vyperPolygonGauge.json';
import rootGaugeL2 from '../../constants/abis/rootGaugeL2.json';
import { GaugeWithSupplies } from "./balancerTypes";

const useGetGaugeData = (): GaugeWithSupplies[] => {
  const [gaugeData, setGaugeData] = useState<GaugeWithSupplies[]>([]);
  const [fetchingSupply, setFetchingSupply] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState<{ lastFetchTime: number }>({
    lastFetchTime: 0,
  });

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/balancer-labs/frontend-v2/master/src/data/voting-gauges.json"
      );
      const jsonData = await response.json();

      const networkName = jsonData.map((e: any) => {
        const symbols = e.pool.tokens.map((f: any) => f.symbol);
        e.pool.tokens = symbols;

        if (e.network === 1) {
          e.network = "Mainnet";
        } else if (e.network === 137) {
          e.network = "Polygon";
        } else if (e.network === 42161) {
          e.network = "Arbitrum";
        } else if (e.network === 10) {
          e.network = "Optimism";
        } else if (e.network === 5) {
          e.network = "Goerli";
        } else if (e.network === 100) {
          e.network = "Gnosis";
        }

        return e;
      });

      const poolIds = new Map();
      const noDupes = networkName.filter((e: any) => {
        if (e.isKilled === false) {
          const id = e.pool.id;
          poolIds.set(id, (poolIds.get(id) || 0) + 1);
          return true;
        }
        return false;
      });

      const maxTimestamp = new Map();
      noDupes.forEach((e: any) => {
        const id = e.pool.id;
        if (poolIds.get(id) > 1) {
          if (!maxTimestamp.has(id) || e.addedTimestamp > maxTimestamp.get(id)) {
            maxTimestamp.set(id, e.addedTimestamp);
          }
        }
      });

      const result: GaugeWithSupplies[] = noDupes.map((e: any) => {
        const id = e.pool.id;
        if (poolIds.get(id) > 1 && e.addedTimestamp === maxTimestamp.get(id)) {
          e.newTag = "NEW";
        } else {
          e.newTag = "";
        }
        return e;
      });

      setGaugeData(result);
      setFetchTrigger({ lastFetchTime: Date.now() });
    } catch (error) {
      console.error("Error fetching gauge data:", error);
    }
  };

  useEffect(() => {
    const fetchDataAndSupply = async () => {
      await fetchData();
      setFetchingSupply(true);
    };

    fetchDataAndSupply();
  }, []);

  useEffect(() => {
    const fetchWorkingSupply = async () => {
      try {
        const updatedGaugeData: GaugeWithSupplies[] = [];
        for (let i = 0; i < gaugeData.length; i++) {
          const gauge = gaugeData[i];
          let networkAbi, networkProvider;

          if (gauge.network === "Mainnet") {
            networkAbi = vyperMainnetGauge;
            networkProvider = new ethers.providers.JsonRpcProvider('https://eth.llamarpc.com');
          } else if (gauge.network === "Polygon") {
            networkAbi = rootGaugeL2;
            networkProvider = new ethers.providers.JsonRpcProvider('https://rpc-mainnet.matic.quiknode.pro	');
          } else if (gauge.network === "Arbitrum") {
            networkAbi = rootGaugeL2;
            networkProvider = new ethers.providers.JsonRpcProvider('https://endpoints.omniatech.io/v1/arbitrum/one/public');
          } else if (gauge.network === "Optimism") {
            networkAbi = rootGaugeL2;
            networkProvider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/optimism');
          } else if (gauge.network === "Goerli") {
            networkAbi = vyperMainnetGauge;
            networkProvider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161	');
          } else if (gauge.network === "Gnosis") {
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
            if (gauge.network === "Mainnet" || gauge.network === "Goerli") {
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

          const convertedSupply = ethers.BigNumber.from(workingSupply).toString();
          const convertedTotalSupply = ethers.BigNumber.from(totalSupply).toString();

          if (!supplyFetchError) {
              gauge.workingSupply = convertedSupply;
              gauge.totalSupply = convertedTotalSupply;
            } 
            else {
            gauge.workingSupply = "0";
            gauge.totalSupply = "0";
          }
        }

        setGaugeData(prevGaugeData => [...prevGaugeData, ...updatedGaugeData]);
        setFetchingSupply(false);
        setFetchTrigger({ lastFetchTime: Date.now() });
      } catch (error) {
        console.error('Error fetching working supply:', error);
      }
    };

    if (fetchTrigger.lastFetchTime !==0) {
      fetchWorkingSupply();
    }
  }, [fetchTrigger]);

  return gaugeData;
};

export default useGetGaugeData;
