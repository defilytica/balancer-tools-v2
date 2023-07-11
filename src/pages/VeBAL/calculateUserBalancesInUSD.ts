import { BalancerStakingGauges, PoolData } from "../../data/balancer/balancerTypes";
import { calculateBoostFromGauge, calculateMaxBoost } from "./veBALHelpers";

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
        const updatedGauge = {
          ...gauge,
          userValue: userValue,
          boost: boost,
          max_boost: max_boost,
        };
        updatedGaugeData.push(updatedGauge);
      }
    };
  }

  return updatedGaugeData;
};

export default calculateUserBalancesInUSD;
