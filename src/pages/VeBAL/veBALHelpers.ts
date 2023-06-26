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

export function calculateBoostFromGauge(workingBalance: number, workingSupply: number, totalSupply: number, userBalance: number) {

     //console.log("vars: ", newVeBAL, lockedVeBAL, totalVeBALStaked, newShare, share, totalShare)
     let boost = 0.0;
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

     if (Number(workingBalance) > 0.0) {
         boost = Number((workingBalance / workingSupply) / ((0.4 * userBalance / workingSupply)))
     }
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
    //   if (boost > 2.5) {
    //       boost = 2.5
    //   } else if (boost < 1) {
    //       boost = 5
    //   }

      //console.log("boost", boost);

      return boost;
  }

// /////////////////////////////////////////////////////////////////////////////////////////
// //Helper function to calculate Max Boost for a certain gauge / veBAL configuration /////
// ////////////////////////////////////////////////////////////////////////////////////////

 export function calculateMaxBoost(workingBalance: number, workingSupply: number, totalSupply: number, userBalance: number) {

     //console.log("vars: ", newVeBAL, lockedVeBAL, totalVeBALStaked, newShare, share, totalShare)
     let max_boost = 0.0;
     //Calculate working supply:
//     const liquidity_provided = Number(newShare) + Number(share);
     // Calculate minveBAL for Max Boost
//     let minveBAL = (totalVeBALStaked) * (liquidity_provided / ( Number(totalShare)));
//     //const working_supply_pool = Number(totalShare);
//     const supply_user_max = 0.4 * liquidity_provided + 0.6 * (Number(totalStakedLiquidity)) * (minveBAL) / (Number(totalVeBALStaked));
//     //Take the minimum of working supply limit and liquidity provided
//     let working_supply_user_max = Number(Math.min(supply_user_max, liquidity_provided));
//     //Non-boosted supply
     if (Number(workingBalance) > 0.0) {
        max_boost = Number(2.5 * workingSupply / (workingSupply - workingBalance + userBalance))
    }
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

export function calculateMinVeBAL(workingBalance: number, workingSupply: number, totalSupply: number, userBalance: number, totalVeBAL: number) {
     //Calculate working supply:
//     const liquidity_provided = Number(newShare) + Number(share);
//     // Calculate minveBAL for Max Boost
     let min_VeBAL = 0;
     if (Number(workingSupply > 0)) {
        min_VeBAL = totalVeBAL * (userBalance / totalSupply);
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

// ////////////////////////////////////////////////////////////////////////////////////////////////////////
// /// Helper function to calculate veBAL out when a user defines their BAL & WETH in with Lock time //////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////

// export function calculateVeBALOut(veBALArray, SwapFee, lockTime) {

//     const copy = [...veBALArray];
//     //Step 1: Define each variable relavent to the token to BPT array
//     //Step 2: Calculate Spot Price, net single deposit, and taxable amount of BPT
//     //Step 3: Calculate Invariant ratio after taxed value of tokens is converted to BPT
//     //Step 4: Calculate BPT Out, ratio to the totalSpotBPT to determine Price impact 

//     let bptArray = [];
//     let bptSpotPrice = 0;
//     let totalPoolTokens = Number(copy[0].totalShares);
//     let tokenSpotBPT = 0;
//     let totalSpotBPT = 0;
//     let swapFee = SwapFee/100;
//     let invariantRatio = 1;

//     for (let i = 0; i <copy.length; i++) {
//       bptSpotPrice = isNaN(copy[i].tokenDeposits) ? 0 : 1/(copy[i].assetBalance * (1 - (1 - 1/totalPoolTokens)**(1/(copy[i].poolWeights/100))));
//       tokenSpotBPT = bptSpotPrice * copy[i].tokenDeposits;
//       totalSpotBPT += tokenSpotBPT
//     }

//       for (let i = 0; i < copy.length; i++) {
//         bptSpotPrice = isNaN(copy[i].tokenDeposits) ? 0 : 1/(copy[i].assetBalance * (1 - (1 - 1/totalPoolTokens)**(1/(copy[i].poolWeights/100))));
//         tokenSpotBPT = bptSpotPrice * copy[i].tokenDeposits;
//         const investEntry = {
//           depositAmount: Number(copy[i].tokenDeposits),
//           bptSpotPrice: isNaN(copy[i].tokenDeposits) ? 0 : 1/(copy[i].assetBalance * (1 - (1 - 1/totalPoolTokens)**(1/(copy[i].poolWeights/100)))),
//           tokenSpotBPT: bptSpotPrice * copy[i].tokenDeposits,
//           proportionalEntry: totalSpotBPT * copy[i].poolWeights/100,
//           netSingleDepost: bptSpotPrice * copy[i].tokenDeposits > totalSpotBPT * copy[i].poolWeights/100 ? tokenSpotBPT - totalSpotBPT * copy[i].poolWeights/100 : 0,
//           depositImpact: isNaN((bptSpotPrice * copy[i].tokenDeposits > totalSpotBPT * copy[i].poolWeights/100 ? tokenSpotBPT - totalSpotBPT * copy[i].poolWeights/100 : 0) / bptSpotPrice * copy[i].tokenDeposits) ? 0 : (bptSpotPrice * copy[i].tokenDeposits > totalSpotBPT * copy[i].poolWeights/100 ? tokenSpotBPT - totalSpotBPT * copy[i].poolWeights/100 : 0) / (bptSpotPrice * copy[i].tokenDeposits === 0 ? 1 : bptSpotPrice * copy[i].tokenDeposits),
//           newTokenBalance: Number(copy[i].assetBalance) + Number(copy[i].tokenDeposits) - (Number(copy[i].tokenDeposits) * swapFee * (isNaN((bptSpotPrice * copy[i].tokenDeposits > totalSpotBPT * copy[i].poolWeights/100 ? tokenSpotBPT - totalSpotBPT * copy[i].poolWeights/100 : 0) / bptSpotPrice * copy[i].tokenDeposits) ? 0 : (bptSpotPrice * copy[i].tokenDeposits > totalSpotBPT * copy[i].poolWeights/100 ? tokenSpotBPT - totalSpotBPT * copy[i].poolWeights/100 : 0) / (bptSpotPrice * copy[i].tokenDeposits === 0 ? 1 : bptSpotPrice * copy[i].tokenDeposits))),
//           tokenInvariantRatio: ((Number(copy[i].assetBalance) + Number(copy[i].tokenDeposits) - (Number(copy[i].tokenDeposits) * swapFee * (isNaN((bptSpotPrice * copy[i].tokenDeposits > totalSpotBPT * copy[i].poolWeights/100 ? tokenSpotBPT - totalSpotBPT * copy[i].poolWeights/100 : 0) / bptSpotPrice * copy[i].tokenDeposits) ? 0 : (bptSpotPrice * copy[i].tokenDeposits > totalSpotBPT * copy[i].poolWeights/100 ? tokenSpotBPT - totalSpotBPT * copy[i].poolWeights/100 : 0) / (bptSpotPrice * copy[i].tokenDeposits === 0 ? 1 : bptSpotPrice * copy[i].tokenDeposits)))) ** (copy[i].poolWeights/100)) / (copy[i].assetBalance ** (copy[i].poolWeights/100))
//         }
        
//         bptArray.push(investEntry)
//       };

//         for (let j=0; j < bptArray.length; j++) {
//           invariantRatio *= bptArray[j].tokenInvariantRatio
//           };

//     let bptOut = (invariantRatio - 1) * totalPoolTokens
//     let veBALPriceImpact = (1 - bptOut / totalSpotBPT) * 100
//     let veBALOut = bptOut * lockTime / 52
//     let investmentOutcomes = [bptOut, veBALPriceImpact, veBALOut]
//   return investmentOutcomes;
// }