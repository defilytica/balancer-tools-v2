import Box from "@mui/material/Box";
import { Grid, Paper, TextField, Typography } from "@mui/material";
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
import calculateUserBalancesInUSD from "./veBALHelpers";
import {useState, useEffect, useRef} from "react";
import {BalancerStakingGauges, PoolData} from "../../data/balancer/balancerTypes";
import { useGetTotalVeBAL } from "../../data/balancer/useGetTotalVeBAL";
import {useActiveNetworkVersion} from "../../state/application/hooks";


export default function VeBAL() {

  // Data fetching
  const { isConnected, address } = useAccount();
  const [activeNetworkVersion] = useActiveNetworkVersion()
  const userLocks = useUserVeBALLocks();
  const userVeBAL = useGetUserVeBAL(address ? address : '');
  const totalVeBAL = useGetTotalVeBAL();
  const pools = useBalancerPools();
  const gaugeData = useGetBalancerStakingGauges();
  const l1GaugeData = useDecorateL1Gauges(gaugeData);
  const decoratedGaugeData = useDecorateL2Gauges(l1GaugeData);
  const date = new Date(userLocks?.unlockTime ? userLocks?.unlockTime * 1000 : 0);
  const unlockDate = date.toLocaleDateString();

  // State variables
  const [trimmedGaugeData, setTrimmedGaugeData] = useState<BalancerStakingGauges[]>([]);
  const [portfolioData, setPortfolioData] = useState<BalancerStakingGauges[]>([]);
  const [additionalVeBAL, setAdditionalVeBAL] = useState<number>(0);
  const [additionalLiquidity, setAdditionalLiquidity] = useState<number>(0);
  const poolsRef = useRef<PoolData[]>([]);

  // gauge list ref
  useEffect(() => {
    if (JSON.stringify(poolsRef.current) !== JSON.stringify(pools)) {
      poolsRef.current = pools;
    }
  }, [pools]);

  // State handling
  useEffect(() => {
    const calculateGauges = () => {
      const updatedGauges = calculateUserBalancesInUSD(
          decoratedGaugeData,
          poolsRef.current,
          additionalLiquidity,
          additionalVeBAL,
          userVeBAL,
          totalVeBAL
      );
      const trimmedData = updatedGauges.filter(gauge => gauge.userBalance === 0 && Number(gauge.network) === Number(activeNetworkVersion.chainId));
      const portfolioData = updatedGauges.filter(gauge => gauge.userBalance !== 0);
      setTrimmedGaugeData(trimmedData);
      setPortfolioData(portfolioData);
    };

    const timeoutId = setTimeout(calculateGauges, 1000);

    return () => clearTimeout(timeoutId);
  }, [decoratedGaugeData, additionalVeBAL, additionalLiquidity, userVeBAL, totalVeBAL, activeNetworkVersion.chainId]);



  return (
    <Box sx={{ flexGrow: 2 }}>
      <Grid mt={2} container sx={{ justifyContent: "center" }}>
        <Paper
            sx={{
              backgroundColor: 'rgba(255, 0, 0, 0.2)', // Slight red background color
              padding: '10px',
              marginBottom: '10px',
            }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Warning: This is an experimental preview build and may contain bugs.
          </Typography>
        </Paper>
        <Grid mt={2} item xs={11}>
          <Box>
            <Typography variant="h5">My veBAL Stats</Typography>
          </Box>
        </Grid>

        {isConnected ? (
          <Grid item xs={11}>
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
                  <MetricsCard
                      mainMetric={userVeBAL ? userVeBAL + additionalVeBAL : 0}
                      mainMetricInUSD={false}
                      metricName={"New Total veBAL"}
                      MetricIcon={AccountBalanceWalletIcon}
                  />
                </Box>
                <Box m={1}>
                  <TextField
                      type="number"
                      key={'userAddveBAL'}
                      label="Additional veBAL"
                      size="medium"
                      sx={{ maxWidth: "1000px", textAlign: "right" }}
                      value={additionalVeBAL}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setAdditionalVeBAL(value);
                      }}
                  />
                </Box>
                <Box m={1}>
                  <TextField
                    label="Additional Liquidity ($)"
                    key={'userAddvLiq'}
                    size="medium"
                    sx={{ maxWidth: "1000px", textAlign: "right" }}
                    value={additionalLiquidity}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setAdditionalLiquidity(value);
                    }}
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
            <Typography variant="h5">Boost Across Wallet Portfolio</Typography>
          </Box>
          {portfolioData && portfolioData.length > 0 ? (
            <PortfolioBoostTable
                key={'portfolio' + additionalVeBAL + additionalLiquidity}
              gaugeDatas={portfolioData}
              userVeBALAdjusted={userVeBAL+ additionalVeBAL}
            />
          ) : (
              <Typography>No position(s) found </Typography>
          )}
        </Grid>
        <Grid item xs={11}>
          <Box mb={1}>
            <Typography variant="h5">Theoretical Boost Across {activeNetworkVersion.name} Gauges</Typography>
          </Box>
          <Box mb={1}>
            <Typography variant="caption">Switch Networks in the Menu Header the top right to see the corresponding gauges</Typography>
          </Box>
          {(JSON.stringify(poolsRef.current) == JSON.stringify(pools)) && pools && pools.length > 1 && trimmedGaugeData && trimmedGaugeData.length > 1 ? (
            <GaugeBoostTable
                key={'boost' + additionalVeBAL + additionalLiquidity + activeNetworkVersion.name}
                gaugeDatas={trimmedGaugeData}
                userVeBALAdjusted={userVeBAL + additionalVeBAL}

            />
          ) : (
            <CircularProgress />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
