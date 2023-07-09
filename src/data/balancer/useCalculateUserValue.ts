import { BalancerStakingGauges, PoolData } from "./balancerTypes";

const useCalculateUserBalancesUSD = (
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
        const userValue = gauge.userBalance * pool.liquidity / pool.totalShares + additionalLiquidity;
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

export default useCalculateUserBalancesUSD;
