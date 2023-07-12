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

     //console.log("vars: ", newVeBAL, lockedVeBAL, totalVeBALStaked, newShare, share, totalShare)
     let max_boost = 0;
     let boost = 0.0;
     let workingBalanceAdjusted = Math.min(0.4 * (userBalance / 10e17 + additionalBalance) + 0.6 * (totalSupply / 10e17 + additionalBalance) * (userVeBAL + additionalVeBAL) / (totalVeBAL), (userBalance / 10e17 + additionalBalance));
     let workingSupplyAdjusted = 0.4 * (totalSupply / 10e17 - userBalance / 10e17) * 2.5 * (workingSupply - workingBalance) / (totalSupply - userBalance) * (totalVeBAL) / (totalVeBAL + additionalVeBAL) + Math.min(0.4 * (userBalance / 10e17 + additionalBalance) + 0.6 * (totalSupply / 10e17 + additionalBalance) * (userVeBAL + additionalVeBAL) / (totalVeBAL + additionalVeBAL), (userBalance / 10e17 + additionalBalance)); 
//     //Calculate working supply:
//     const liquidity_provided = Number(newShare) + Number(share);
//     //const working_supply_pool = Number(totalShare);
//     const supply_user = 0.4 * liquidity_provided + 0.6 * (Number(totalStakedLiquidity)) * ((Number(lockedVeBAL) + Number(newVeBAL)) / (Number(totalVeBALStaked) + Number(newVeBAL)));
//     //Take the minimum of working supply limit and liquidity provided
//     let working_supply_user = Number(Math.min(supply_user, liquidity_provided));
//     //Non-boosted supply
//     let non_boosted_working_supply_user = 0.4 * liquidity_provided;
//     //Max working supply for 2.5x
//     //const max_working_supply_user = 0.40 * liquidity_provided + 0.60 * (Number(totalStakedLiquidity)) * (Number(newShare) / (Number(totalShare)));
//     //Boost calculation depending 2 scenarios: new liquidity or already providing liquidity and adding more
     if (Number(workingBalanceAdjusted)) {
       max_boost = Math.max(
         Number(
           workingBalanceAdjusted /
             (workingBalanceAdjusted +
               workingSupply / 10e17 -
               workingBalance / 10e17) /
             ((0.4 * (userBalance / 10e17 + additionalBalance)) /
               (0.4 * (userBalance / 10e17 + additionalBalance) +
                 (workingSupply / 10e17 + additionalBalance * 0.4) -
                 workingBalanceAdjusted))
         ),
         Number(
           (1 -
             (1 -
               (userBalance / 10e17 + additionalBalance) /
                 (totalSupply / 10e17 + additionalBalance)) *
               0.4) /
             (((0.4 * userBalance) / 10e17 + additionalBalance) /
               (0.4 * (userBalance / 10e17 + additionalBalance) +
                 workingSupplyAdjusted -
                 workingBalanceAdjusted))
         )
       );
     }

     if (Number(workingBalanceAdjusted) > 0) {
       if (
         Number(
           workingBalanceAdjusted /
             (workingBalanceAdjusted +
               workingSupply / 10e17 -
               workingBalance / 10e17) /
             ((0.4 * (userBalance / 10e17 + additionalBalance)) /
               (0.4 * (userBalance / 10e17 + additionalBalance) +
                 (workingSupply / 10e17 + additionalBalance * 0.4) -
                 workingBalanceAdjusted))
         ) <
         workingBalanceAdjusted /
           (workingBalanceAdjusted +
             workingSupplyAdjusted -
             workingBalance / 10e17) /
           ((0.4 * (userBalance / 10e17 + additionalBalance)) /
             (0.4 * (userBalance / 10e17 + additionalBalance) +
               workingSupplyAdjusted -
               workingBalance / 10e17))
       ) {
         boost =
           workingBalanceAdjusted /
           (workingBalanceAdjusted +
             workingSupplyAdjusted -
             workingBalance / 10e17) /
           ((0.4 * (userBalance / 10e17 + additionalBalance)) /
             (0.4 * (userBalance / 10e17 + additionalBalance) +
               workingSupplyAdjusted -
               workingBalance / 10e17));
       } else {
         boost = Number(
           workingBalanceAdjusted /
             (workingBalanceAdjusted +
               workingSupply / 10e17 -
               workingBalance / 10e17) /
             ((0.4 * (userBalance / 10e17 + additionalBalance)) /
               (0.4 * (userBalance / 10e17 + additionalBalance) +
                 (workingSupply / 10e17 + additionalBalance * 0.4) -
                 workingBalanceAdjusted))
         );
       }
       console.log(additionalBalance);
     }

    //  if (Number(workingBalanceAdjusted) > 0.0) {
    //      if(((workingBalanceAdjusted / (workingBalanceAdjusted + workingSupplyAdjusted - workingBalance / 10e17)) / ((0.4 * (userBalance / 10e17 + additionalBalance) / (0.4 * (userBalance / 10e17 + additionalBalance) + (workingSupplyAdjusted + additionalBalance * 0.4) - workingBalanceAdjusted)))) 
    //      < Number((1 - (1 - ((userBalance / 10e17 + additionalBalance) / (totalSupply / 10e17 + additionalBalance))) * 0.4) / ((0.4 * userBalance / 10e17 + additionalBalance) / (0.4 * (userBalance / 10e17 + additionalBalance) + workingSupplyAdjusted - workingBalanceAdjusted)))) {
    //          boost = Number((workingBalanceAdjusted / (workingBalanceAdjusted + workingSupplyAdjusted - workingBalance / 10e17)) / ((0.4 * (userBalance / 10e17 + additionalBalance) / (0.4 * (userBalance / 10e17 + additionalBalance) + (workingSupplyAdjusted + additionalBalance * 0.4) - workingBalanceAdjusted))))
    //     } else {
    //         boost = 1;
    //     }
    //  }
         //Case 1: current boost
        // boost = (workingBalance / Number(totalSupply)) / ((0.4 * Number(userBalance)) / (Number(totalSupply) - workingBalance + 0.4 * Number(userBalance)))
//         //console.log("case1 triggered")
//     } else if (Number(share) !== 0.0 || Number(lockedVeBAL) !== 0.0) {
//         //Case 2: user boost when adjusting current position (share !== 0)
//         boost = (working_supply_user / (working_supply_user + Number(totalShare) - Number(share))) / ((non_boosted_working_supply_user) / (non_boosted_working_supply_user + Number(totalShare) - Number(share)));
//         //console.log("case2 triggered")
//     } else {
//         //Case 3: user boost when entering (share = 0)
//         boost = (working_supply_user / (working_supply_user + Number(totalShare))) / (non_boosted_working_supply_user / (non_boosted_working_supply_user + Number(totalShare)))
//         //console.log("case3 triggered")
//     }
     if (max_boost > 2.5) {
       max_boost = 2.5;
     } else if (max_boost < 1) {
       max_boost = 1.0;
     }
     if (boost > max_boost) {
       boost = max_boost;
     } 

      //console.log("boost", boost);

      return boost;
  }

// /////////////////////////////////////////////////////////////////////////////////////////
// //Helper function to calculate Max Boost for a certain gauge / veBAL configuration /////
// ////////////////////////////////////////////////////////////////////////////////////////

 export function calculateMaxBoost(workingBalance: number, workingSupply: number, totalSupply: number, userBalance: number, additionalBalance: number, additionalVeBAL: number, userVeBAL: number, totalVeBAL: number) {

     let max_boost = 0.0;
     let workingBalanceAdjusted = Math.min(0.4 * (userBalance / 10e17 + additionalBalance) + 0.6 * (totalSupply / 10e17 + additionalBalance) * (userVeBAL + additionalVeBAL) / (totalVeBAL + additionalVeBAL), (userBalance / 10e17 + additionalBalance));
     let workingSupplyAdjusted = 0.4 * (totalSupply / 10e17 - userBalance / 10e17) * 2.5 * (workingSupply - workingBalance) / (totalSupply - userBalance) * (totalVeBAL) / (totalVeBAL + additionalVeBAL) + Math.min(0.4 * (userBalance / 10e17 + additionalBalance) + 0.6 * (totalSupply / 10e17 + additionalBalance) * (userVeBAL + additionalVeBAL) / (totalVeBAL + additionalVeBAL), (userBalance / 10e17 + additionalBalance)); 
     if (Number(workingBalanceAdjusted)) {
        max_boost = Math.max(Number((workingBalanceAdjusted / (workingBalanceAdjusted + workingSupply / 10e17 - workingBalance / 10e17)) / ((0.4 * (userBalance / 10e17 + additionalBalance) / (0.4 * (userBalance / 10e17 + additionalBalance) + (workingSupply / 10e17 + additionalBalance * 0.4) - workingBalanceAdjusted)))),
        Number((1 - (1 - ((userBalance / 10e17 + additionalBalance) / (totalSupply / 10e17 + additionalBalance))) * 0.4) / ((0.4 * userBalance / 10e17 + additionalBalance) / (0.4 * (userBalance / 10e17 + additionalBalance) + workingSupplyAdjusted - workingBalanceAdjusted))))
    }
     // Includes dilutive considerations 
     // max_boost = Number((1 - (1 - ((userBalance / 10e17 + additionalBalance) / (totalSupply / 10e17 + additionalBalance))) * 0.4) / ((0.4 * userBalance / 10e17 + additionalBalance) / (0.4 * (userBalance / 10e17 + additionalBalance) + workingSupplyAdjusted / 10e17 - workingBalanceAdjusted)))
     // Need to clean up this logic to consider all impacts of additional liquidity or veBAL in a gauge on max boost
     // max_boost = Number(2.5 * (0.4 * (userBalance + additionalBalance) + workingSupply - workingBalance) / (userBalance + additionalBalance + workingSupply - workingBalance));


     //Max working supply for 2.5x
     //const max_working_supply_user = 0.40 * liquidity_provided + 0.60 * (Number(totalStakedLiquidity)) * (Number(newShare) / (Number(totalShare)));
     //Boost calculation depending 2 scenarios: new liquidity or already providing liquidity and adding more

//     if (Number(newShare) === 0.0 && Number(newVeBAL) === 0.0) {
//         //Case 1: current boost
//         max_boost = (working_supply_user_max / Number(totalShare)) / ((0.4 * Number(share)) / (Number(totalShare) - working_supply_user_max + 0.4 * Number(share)))
//         //console.log("case1 triggered")
//     } else if (Number(share) !== 0.0 || Number(lockedVeBAL) !== 0.0) {
//         //Case 2: user boost when adjusting current position (share !== 0)
//         max_boost = (working_supply_user_max / (working_supply_user_max + Number(totalShare) - Number(share))) / ((non_boosted_working_supply_user) / (non_boosted_working_supply_user + Number(totalShare) - Number(share)));
//         //console.log("case2 triggered")
//     } else {
//         //Case 3: user boost when entering (share = 0)
//         max_boost = (working_supply_user_max / (working_supply_user_max + Number(totalShare))) / (non_boosted_working_supply_user / (non_boosted_working_supply_user + Number(totalShare)))
//         //console.log("case3 triggered")
//     }
    
     if (max_boost > 2.5) {
         max_boost = 2.5
     } else if (max_boost < 1) {
         max_boost = 1.0
     }

     // console.log("max_boost", max_boost);

     return max_boost;

 }

// //////////////////////////////////////////////////////////////////////////////////////////////////////////
// //Helper function to calculate minimum veBAL for Max Boost for a certain gauge / veBAL configuration /////
// //////////////////////////////////////////////////////////////////////////////////////////////////////////

export function calculateMinVeBAL(workingBalance: number, workingSupply: number, totalSupply: number, userBalance: number, additionalBalance: number, additionalVeBAL: number, userVeBAL: number, totalVeBAL: number) {

     // Calculate minveBAL for Max Boost
     let min_VeBAL = 0;
     if (Number(workingSupply > 0)) {
        min_VeBAL = (totalVeBAL) * ((userBalance / 10e17 + additionalBalance) / (totalSupply / 10e17 + additionalBalance));
        // Equation below corrects for dilution upon new locking. Equation above assumes totalVeBAL is fixed and is incorrect teechnically. 
    //  min_VeBAL = (totalVeBAL + addedVeBAL) * (userBalance / totalSupply);
     }
     if (min_VeBAL > 50000000) {
        min_VeBAL = 0;
     }
     return min_VeBAL;
 }

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ////// Helper function to calculate the amount of additional veBAL a user needs to lock to reach max boost. /////
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// export function calculateRemainingVeBAL(newVeBAL, lockedVeBAL, totalVeBALStaked, newShare, share, totalShare, totalStakedLiquidity) {

//     let remainingVeBAL = 0;
//     const liquidity_provided = Number(newShare) + Number(share);
//     // Calculate minveBAL for Max Boost
//     let minveBAL = (totalVeBALStaked) * (liquidity_provided / ( Number(totalStakedLiquidity) + Number(newShare)));
//     if (minveBAL > 50000000) {
//         minveBAL = 0;
//     }

//     remainingVeBAL = minveBAL - newVeBAL - lockedVeBAL;

//     if (remainingVeBAL < 0) {
//          remainingVeBAL = 0;
//     }

//     return remainingVeBAL;
// }