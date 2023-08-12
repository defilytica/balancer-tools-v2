import {BalancerStakingGauges, PoolData} from "../../data/balancer/balancerTypes";

//Provide all necessary helper functions for the veBAL boost calculator here

// ///////////////////////////////////////////////////////////////////////////////////////
// ///// Helper function to calculate the Gauge APR for a given Balancer pool gauge. /////
// // Note the emmissions rate (balEmission) needs to be updated. ////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////

// export function calculateGaugeAPR (poolId, gaugeArray, boost, gauge_relative_weight, gauge_working_supply, bal_price) {

//     let gauge_bpt_price = 0;
//     gaugeArray.forEach( el => {
//         if (el.poolId === poolId) {
//             gauge_bpt_price = Number(el.pricePerBPT);
//         }
//     });

//     const balEmission = 145000 * 0.84 ;
//     const shareOneBPT = 0.4 / (Number(gauge_working_supply) + 0.4);
//     const weeklyReward = shareOneBPT * Number(gauge_relative_weight) * balEmission;
//     const yearlyReward = weeklyReward * boost * 52 * bal_price;
//     const apr = yearlyReward / gauge_bpt_price * 100;

//     console.log("gauge_bpt_price", gauge_bpt_price);
//     console.log("gauge_working_supply", Number(gauge_working_supply));
//     console.log("shareOneBPT", shareOneBPT);
//     console.log("weeklyReward", weeklyReward);
//     //console.log("standardAPR", gauge_relative_weight * balEmission * bal_price * 52 * 100 / (Number(gauge_working_supply) * gauge_bpt_price))
//     console.log("minAPR (1x boost)", apr);
//     return apr;
// }

// ////////////////////////////////////////////////////////////////////////////////////
// //Helper function to calculate Boost for a certain gauge / veBAL configuration /////
// ////////////////////////////////////////////////////////////////////////////////////

export function calculateBoostFromGauge(workingBalance: number, workingSupply: number, totalSupply: number, userBalance: number, additionalBalance: number, additionalVeBAL: number, userVeBAL: number, totalVeBAL: number) {

     // initializes variables for max boost and boost
     let boost = 0.0;
     // considers new veBAL share and total in circulation when a new user simulates locking veBAL
     let newVeBALShareAdjusted = (userVeBAL + additionalVeBAL) / (totalVeBAL + additionalVeBAL);
     let newVeBALRatio = totalVeBAL / (totalVeBAL + additionalVeBAL);
     // considers new user balance after additional liquidity is provided, based on BPT price
     let userBalanceAdjusted = userBalance / 10e17 + additionalBalance;
     // Takes into account the above changes on the working balance and working supply due to additional veBAL or liquidity
     // This can only be an approximation without pulling in the actual veBAL balance of all users to determine
     // if those with max boost would be moved below the max boost threshhold. 
     let workingBalanceAdjusted = Math.min(0.4 * userBalanceAdjusted + 0.6 * (totalSupply / 10e17 + additionalBalance) * newVeBALShareAdjusted, (userBalance / 10e17 + additionalBalance));
     // Consideration below was meant for the fact that boost will go up for a user if veBAL is increased, however the minimum APR
     // will go down. Therefore the "boost" is misinformative as it applies to the new minimum, the difference will be less than anticipated.
     // let workingSupplyAdjusted = (workingSupply - workingBalance - (totalSupply - userBalance) * 0.4 * newVeBALRatio + (totalSupply - userBalance) * 0.4) / 10e17 + workingBalanceAdjusted; 

     if (Number(workingBalanceAdjusted)) {
         boost = Number((workingBalanceAdjusted / (userBalanceAdjusted * 0.4)))
     }

      return boost;
  }

// /////////////////////////////////////////////////////////////////////////////////////////
// //Helper function to calculate Max Boost for a certain gauge / veBAL configuration /////
// ////////////////////////////////////////////////////////////////////////////////////////

 export function calculateMaxBoost(workingBalance: number, workingSupply: number, totalSupply: number, userBalance: number, additionalBalance: number, additionalVeBAL: number, userVeBAL: number, totalVeBAL: number) {

  let max_boost = 0;
  // considers new veBAL share and total in circulation when a new user simulates locking veBAL
  let newVeBALRatio = totalVeBAL / (totalVeBAL + additionalVeBAL);
  // considers new user balance after additional liquidity is provided, based on BPT price
  let userBalanceAdjusted = userBalance / 10e17 + additionalBalance;
  // Takes into account the above changes on the working balance and working supply due to additional veBAL or liquidity
  // This can only be an approximation without pulling in the actual veBAL balance of all users to determine
  // if those with max boost would be moved below the max boost threshhold.
  // key change of workingBalance adjusted not using newVeBALShareAdjusted, just 1 for max condition 
  // This considers a user owning a proportional amount of veBAL to their pool share as the most
  // economic and realistic circumstance. If the user mints a substantial amount of veBAL they can
  // increase their "max" by diluting others boost in the pool.
  let workingBalanceAdjusted = Math.min(0.4 * userBalanceAdjusted + 0.6 * (totalSupply / 10e17 + additionalBalance) * 1, (userBalance / 10e17 + additionalBalance));
  let workingSupplyAdjusted = (workingSupply - workingBalance - (totalSupply - userBalance) * 0.4 * newVeBALRatio + (totalSupply - userBalance) * 0.4) / 10e17 + workingBalanceAdjusted; 
     if (Number(workingBalanceAdjusted)) {
        max_boost = Number(2.5 * (0.4 * userBalanceAdjusted + workingSupplyAdjusted - workingBalance) / (userBalanceAdjusted + workingSupplyAdjusted - workingBalance))

    }

     if (max_boost > 2.5) {
         max_boost = 2.5
     } else if (max_boost < 1) {
         max_boost = 1.0
     }

     return max_boost;

 }

// //////////////////////////////////////////////////////////////////////////////////////////////////////////
// //Helper function to calculate minimum veBAL for Max Boost for a certain gauge / veBAL configuration /////
// //////////////////////////////////////////////////////////////////////////////////////////////////////////

export function calculateMinVeBAL(workingBalance: number, workingSupply: number, totalSupply: number, userBalance: number, additionalBalance: number, additionalVeBAL: number, userVeBAL: number, totalVeBAL: number) {

     // Calculate minveBAL for Max Boost
     // minveBAL in this considers a user owning a proportional amount of veBAL to their pool share as the most
     // economic and realistic circumstance. If the user mints a substantial amount of veBAL they can
     // increase their "max" by diluting others boost in the pool. 
     let min_VeBAL = 0;
     let min_VeBAL_Additional = 0;
     let userBalanceAdjusted = userBalance / 10e17 + additionalBalance;
     let totalSupplyAdjusted = totalSupply / 10e17 + additionalBalance;
     let userPoolRatio = userBalanceAdjusted / totalSupplyAdjusted;

     if (Number(userBalanceAdjusted > 0)) {
        min_VeBAL_Additional = (userPoolRatio * totalVeBAL - userVeBAL) / (1 - userPoolRatio);
        min_VeBAL = userVeBAL + min_VeBAL_Additional;

     }
     if (min_VeBAL > 50000000) {
        min_VeBAL = 0;
     }
     return min_VeBAL;
 }

// //////////////////////////////////////////////////////////////
// ////// Helper function to calculate user Balances in USD /////
// //////////////////////////////////////////////////////////////
const calculateUserBalancesInUSD = (
    stakingGaugeData: BalancerStakingGauges[],
    pools: PoolData[],
    additionalLiquidity: number,
    additionalVeBAL: number,
    userVeBAL: number,
    totalVeBAL: number,
): BalancerStakingGauges[] => {
    const updatedGaugeData: BalancerStakingGauges[] = [];

    if (stakingGaugeData.length > 0 && pools.length > 0) {
        for(const gauge of stakingGaugeData) {
            const pool = pools.find((p) => p.address === gauge.pool.address.toLocaleLowerCase());
            if (pool) {
                const inferredTVL = pool.tokens.reduce((sum, el) => sum + el.tvl, 0)
                const tvl = inferredTVL ? inferredTVL : pool.liquidity
                const userValue = gauge.userBalance * tvl / pool.totalShares + additionalLiquidity * 10e17;
                const additionalBalance =  additionalLiquidity / (tvl / pool.totalShares);
                const boost = calculateBoostFromGauge(Number(gauge.workingBalance), Number(gauge.workingSupply), Number(gauge.totalSupply), gauge.userBalance, additionalBalance, additionalVeBAL, userVeBAL, totalVeBAL).toString();
                const max_boost = calculateMaxBoost(Number(gauge.workingBalance), Number(gauge.workingSupply), Number(gauge.totalSupply), gauge.userBalance, additionalBalance, additionalVeBAL, userVeBAL, totalVeBAL).toString();
                const min_VeBAL = calculateMinVeBAL(Number(gauge.workingBalance), Number(gauge.workingSupply), Number(gauge.totalSupply), gauge.userBalance, additionalBalance, additionalVeBAL, userVeBAL, totalVeBAL).toString();
                const updatedGauge = {
                    ...gauge,
                    userValue: userValue,
                    boost: boost,
                    max_boost: max_boost,
                    min_VeBAL: min_VeBAL,
                };
                updatedGaugeData.push(updatedGauge);
            }
        }
    }

    return updatedGaugeData;
};

export default calculateUserBalancesInUSD;
