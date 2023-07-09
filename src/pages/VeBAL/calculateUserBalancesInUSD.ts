import { BalancerStakingGauges, PoolData } from "../../data/balancer/balancerTypes";

const calculateUserBalancesInUSD = (
  stakingGaugeData: BalancerStakingGauges[],
  pools: PoolData[],
  additionalLiquidity: number,
  additionalVeBAL: number,
): BalancerStakingGauges[] => {
  const updatedGaugeData: BalancerStakingGauges[] = [];

  if (stakingGaugeData.length > 0 && pools.length > 0) {
    for(const gauge of stakingGaugeData) {
      const pool = pools.find((p) => p.address === gauge.pool.address.toLocaleLowerCase());
      if (pool) {
        const inferredTVL = pool.tokens.reduce((sum, el) => sum + el.tvl, 0)
        const tvl = inferredTVL ? inferredTVL : pool.liquidity
        const userValue = gauge.userBalance * tvl / pool.totalShares + additionalLiquidity;
        const updatedGauge = {
          ...gauge,
          userValue: userValue,
        };
        updatedGaugeData.push(updatedGauge);
      }
    };
  }

  return updatedGaugeData;
};

export default calculateUserBalancesInUSD;
