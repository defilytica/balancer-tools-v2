import { BalancerStakingGauges } from "./balancerTypes";
import { useState, useEffect } from "react";

const useTrimDataToPortfolio = (allGaugeData: BalancerStakingGauges[]): BalancerStakingGauges[] => {
  const [userPortfolio, setUserPortfolio] = useState<BalancerStakingGauges[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const filterData = (data: BalancerStakingGauges[]) => {
    return data.filter(gauge => gauge.userBalance !== 0);
  };

  useEffect(() => {
    if (isLoading && allGaugeData && allGaugeData.length > 0) {
      const filteredData = filterData(allGaugeData);
      setUserPortfolio(filteredData);
      setIsLoading(false);
    }
  }, [isLoading, allGaugeData]);

  return userPortfolio;
}

export default useTrimDataToPortfolio;

