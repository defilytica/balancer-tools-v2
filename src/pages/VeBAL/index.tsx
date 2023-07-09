import Box from "@mui/material/Box";
import { Grid, TextField, Typography } from "@mui/material";
import { useUserVeBALLocks } from "../../data/balancer/useUserVeBALLocks";
import MetricsCard from "../../components/Cards/MetricsCard";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import GenericMetricsCard from "../../components/Cards/GenericMetricCard";
import LockClockIcon from "@mui/icons-material/LockClock";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import useGetBalancerStakingGauges from "../../data/balancer/useGetBalancerStakingGauges";
import { useGetUserVeBAL } from "../../data/balancer/useGetUserVeBAL";
import GaugeBoostTable from "../../components/Tables/GaugeBoostTable";
import PortfolioBoostTable from "../../components/Tables/PortfolioBoostTable";
import { useAccount } from "wagmi";
import useDecorateL1Gauges from "../../data/balancer/useDecorateL1Gauges";
import useDecorateL2Gauges from "../../data/balancer/useDeocrateL2Gauges";
import CircularProgress from "@mui/material/CircularProgress";
import { useBalancerPools } from "../../data/balancer/usePools";
import useTrimDataToPortfolio from "../../data/balancer/useTrimDataToPortfolio";
import useCalculateUserBalancesUSD from "../../data/balancer/useCalculateUserValue";
import { useState, useEffect } from "react";
import useTrimGaugeData from "../../data/balancer/useTrimGaugeData";
import { BalancerStakingGauges } from "../../data/balancer/balancerTypes";
// import { calculateBoostFromGauge } from './veBALHelpers';

export default function VeBAL() {
  //Load user wallet stats
  const { isConnected, address } = useAccount();
  const userLocks = useUserVeBALLocks();
  const userVeBAL = useGetUserVeBAL(address ? address : "");
  const pools = useBalancerPools();
  const [additionalVeBAL, setAdditionalVeBAL] = useState<number>(0);
  const [additionalLiquidity, setAdditionalLiquidity] = useState<number>(0);

  //Load gauge and Staking information
  const gaugeData = useGetBalancerStakingGauges();
  const l1GaugeData = useDecorateL1Gauges(gaugeData);
  // const [l1GaugeData, setL1GaugeData] = useState(useDecorateL1Gauges(gaugeData, additionalVeBAL, additionalLiquidity));
  const decoratedGaugeData = useDecorateL2Gauges(l1GaugeData);
  // const [decoratedGaugeData, seDdecoratedGaugeData] = useState(useDecorate21Gauges(gaugeData, additionalVeBAL, additionalLiquidity));
  const balanceGaugeData = useCalculateUserBalancesUSD(decoratedGaugeData, pools, additionalLiquidity, additionalVeBAL);
  // const [balanceGaugeData, setBalanceGaugeData] = useState(useCalculateUserBalancesUSD(decoratedGaugeData, pools, additionalLiquidity, additionalVeBAL));


  const trimmedGaugeData = useTrimGaugeData(balanceGaugeData);
  const portfolioData = useTrimDataToPortfolio(balanceGaugeData);
  console.log(portfolioData);
  console.log(decoratedGaugeData);
  console.log(balanceGaugeData);

  const date = new Date(
    userLocks?.unlockTime ? userLocks?.unlockTime * 1000 : 0
  );
  const unlockDate = date.toLocaleDateString();

  // useEffect(() => {
  //   const updatedL1GaugeData = useDecorateL1Gauges(gaugeData, additionalVeBAL, additionalLiquidity);
  //   setL1GaugeData(updatedL1GaugeData);
  // }, [gaugeData, additionalVeBAL, additionalLiquidity]);

  // useEffect(() => {
  //   setAdditionalLiquidity(0);
  //   setAdditionalVeBAL(0);
  // }, [gaugeData]);

  // const handleAdditionalLiquidityChange = (e) => {
  //   const value = parseInt(e.target.value);
  //   setAdditionalLiquidity(isNaN(value) ? 0 : value);
  // };

  // const handleAdditionalVeBALChange = (e) => {
  //   const value = parseInt(e.target.value);
  //   setAdditionalVeBAL(isNaN(value) ? 0 : value);
  // };

  return (
    <Box sx={{ flexGrow: 2 }}>
      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
        <Grid mt={2} item xs={11}>
          <Box>
            <Typography variant="h5">My veBAL Stats</Typography>
          </Box>
        </Grid>

        {isConnected ? (
          <Grid item mt={1} xs={11}>
            <Grid
              container
              columns={{ xs: 4, sm: 8, md: 12 }}
              sx={{
                justifyContent: { md: "flex-start", xs: "center" },
                alignContent: "center",
              }}
            >
              <Box m={1}>
                <MetricsCard
                  mainMetric={
                    userLocks?.lockedBalance ? userLocks.lockedBalance : 0
                  }
                  mainMetricInUSD={false}
                  metricName={"B-80BAL-20WETH"}
                  MetricIcon={LockPersonIcon}
                />
              </Box>
              <Box m={1}>
                <MetricsCard
                  mainMetric={userVeBAL ? userVeBAL : 0}
                  mainMetricInUSD={false}
                  metricName={"veBAL"}
                  MetricIcon={AccountBalanceWalletIcon}
                />
              </Box>
              <Box m={1}>
                <GenericMetricsCard
                  mainMetric={unlockDate}
                  metricName={"Unlock date"}
                  MetricIcon={LockClockIcon}
                />
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Grid item mt={1} xs={11}>
            <Box m={1}>
              <GenericMetricsCard
                mainMetric={"-"}
                metricName={"No wallet connected"}
                MetricIcon={AccountBalanceWalletIcon}
              />
            </Box>
          </Grid>
        )}
        <Grid item xs={11}>
          <Box>
            <Typography variant="h5">Calculate your boost</Typography>
          </Box>
          {isConnected ? (
            <Grid item mt={1} xs={11}>
              <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                sx={{
                  justifyContent: { md: "flex-start", xs: "center" },
                  alignContent: "center",
                }}
              >
                <Box m={1}>
                  <TextField
                    type="number"
                    label="Additional Liquidity"
                    size="medium"
                    sx={{ maxWidth: "1000px", textAlign: "right" }}
                    value={additionalLiquidity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setAdditionalVeBAL(value);
                    }}
                  />
                </Box>
                <Box m={1}>
                  <TextField
                    type="number"
                    label="Additional veBAL"
                    size="medium"
                    sx={{ maxWidth: "1000px", textAlign: "right" }}
                    value={additionalVeBAL}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setAdditionalVeBAL(value);
                    }}
                  />
                </Box>
                <Box m={1}>
                  <MetricsCard
                    mainMetric={userVeBAL ? userVeBAL + additionalVeBAL : 0}
                    mainMetricInUSD={false}
                    metricName={"New Total veBAL"}
                    MetricIcon={AccountBalanceWalletIcon}
                  />
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Grid item mt={1} xs={11}>
              <Box m={1}>
                <GenericMetricsCard
                  mainMetric={"-"}
                  metricName={"No wallet connected"}
                  MetricIcon={AccountBalanceWalletIcon}
                />
              </Box>
            </Grid>
          )}
        </Grid>
        <Grid item xs={11}>
          <Box mb={1}>
            <Typography variant="h5">Portfolio Gauge Boosts</Typography>
          </Box>
          {portfolioData && portfolioData.length > 1 ? (
            <PortfolioBoostTable
              gaugeDatas={portfolioData}
              userVeBAL={userVeBAL}
            />
          ) : (
            <CircularProgress />
          )}
        </Grid>
        <Grid item xs={11}>
          <Box mb={1}>
            <Typography variant="h5">Theoretical Boost All Gauges</Typography>
          </Box>
          {trimmedGaugeData && trimmedGaugeData.length > 1 ? (
            <GaugeBoostTable
              gaugeDatas={trimmedGaugeData}
              userVeBAL={userVeBAL}
            />
          ) : (
            <CircularProgress />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
