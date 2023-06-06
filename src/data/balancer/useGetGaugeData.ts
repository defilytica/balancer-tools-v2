import { useState, useEffect } from "react";
import { ethers } from "ethers";
import vyperMainnetGauge from '../../constants/abis/vyperMainnetGauge.json';
import rootGaugeL2 from '../../constants/abis/vyperMainnetGauge.json';
// rootGaugeL2 will be used for reading getRecipient to direct from mainnet gauge to L2
// vyperMainnet Gauge is the vyper contract abi, this actually works for all networks
// We do not need to import or map abis for each different network, only to read the contract 
// itself using the correct RPC provider(s).
// This proves out the ability to use ethers to read, it was also tested on Polygon contracts
// getReceipient was tested as well. Function to read then pass the address to be developed with
// the network mapping. 

  interface Gauge {
     address: string;
     network: number;
     isKilled: boolean;
     addedTimestamp: number;
     relativeWeightCap: string | null;
     pool: {
       id: string;
       address: string;
       poolType: string;
       symbol: string;
       tokens: {
         address: string;
         weight: string | null;
         symbol: string;
       }[];
     };
     tokenLogoURIs: {
       [address: string]: string;
     };
   }

const useGetGaugeData = (): any => {
  const [gaugeData, setGaugeData] = useState<Gauge[]>([]);
  const [workingSupply, setWorkingSupply] = useState<string>("0");
  const [totalSupply, setTotalSupply] = useState<string>("0");
  const lastFetchTime = 0;

  useEffect(() => {
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

        const result = noDupes.map((e: any) => {
          const id = e.pool.id;
          if (poolIds.get(id) > 1 && e.addedTimestamp === maxTimestamp.get(id)) {
            e.newTag = "NEW";
          } else {
            e.newTag = "";
          }
          return e;
        });

        setGaugeData(result);
      } catch (error) {
        console.error("Error fetching gauge data:", error);
      }
    };

  const timeDifference = Date.now() - lastFetchTime;
  const fetchInterval = 3600000; // 1 hour in milliseconds

  if (timeDifference >= fetchInterval) {
    fetchData();
  }
}, [lastFetchTime]);

  useEffect(() => {
    const fetchWorkingSupply = async () => {
      if (gaugeData.length > 0) {
        const addy = gaugeData[10]?.address;
        if (addy) {
          const provider = new ethers.providers.JsonRpcProvider('https://eth.llamarpc.com');
          const contract = new ethers.Contract(addy, vyperMainnetGauge, provider);
          const supply = await contract.working_supply();
          const convertedSupply = ethers.BigNumber.from(supply).toString();
          setWorkingSupply(convertedSupply);
          const totalSupply = await contract.totalSupply();
          const convertedTotalSupply = ethers.BigNumber.from(totalSupply).toString();
          setTotalSupply(convertedTotalSupply)
        }
      }
    };
  
    fetchWorkingSupply();
  }, [gaugeData]);

  console.log(gaugeData);
  console.log(Number(workingSupply));
  console.log(Number(totalSupply));
  return Number(workingSupply);
};

export default useGetGaugeData;

// TODO 
// Create loop which iterates through all gauges to first pull in their netowork
// Once network is pulled in, contract abi and proper provider can be passed and read
// Mainnet gauges => read values working_supply and totalSupply
// L2 gauges => getRecipient => read correct abi from the rootGaugeL2
// Append answers to create final array which has each gauges respective ws and ts for boost calcs
// Xeonus what do you think of this structure? Should it be broken up further, or done all in this single component? 
