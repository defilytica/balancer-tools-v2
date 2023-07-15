import Box from "@mui/material/Box";
import {Backdrop, Button, Card, CardContent, Grid, Paper, TextField, Tooltip, Typography} from "@mui/material";
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
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import * as React from "react";


export default function VeBAL() {

  // Data fetching
  const { isConnected, address } = useAccount();
  const [activeNetworkVersion] = useActiveNetworkVersion()
  const userLocks = useUserVeBALLocks();
  const userVeBAL = useGetUserVeBAL(address ? address : '');
  const totalVeBAL = useGetTotalVeBAL();
  const pools = useBalancerPools();
  console.log("pools", pools)
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
  const [calculationTriggered, setCalculationTriggered] = useState<boolean>(false);
  const poolsRef = useRef<PoolData[]>([]);
  const additionalLiquidityRef = useRef<number>(0)
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  // gauge list ref
  useEffect(() => {
    if (JSON.stringify(poolsRef.current) !== JSON.stringify(pools)) {
      poolsRef.current = pools;
      setLoading(true)
    }
    setLoading(false)
  }, [pools]);

  // Liquidity ref
  useEffect(() => {
    if (additionalLiquidityRef.current !== additionalLiquidity) {
      additionalLiquidityRef.current = additionalLiquidity;
    }
  }, [additionalLiquidity]);

  // Reset calculationTriggered when network changes
  useEffect(() => {
    setCalculationTriggered(false);
    setLoading(true)
  }, [activeNetworkVersion.chainId, additionalLiquidity, additionalVeBAL] );

  // State handling
  const calculateGauges = () => {
    setLoading(true)
    const updatedGauges = calculateUserBalancesInUSD(
        decoratedGaugeData,
        poolsRef.current,
        additionalLiquidityRef.current,
        additionalVeBAL,
        userVeBAL,
        totalVeBAL
    );
    console.log("updatedGauges", updatedGauges)
    const trimmedData = updatedGauges.filter((gauge) => gauge.userBalance === 0 && Number(gauge.network) === Number(activeNetworkVersion.chainId));
    const portfolioData = updatedGauges.filter((gauge) => gauge.userBalance !== 0 && Number(gauge.network) === Number(activeNetworkVersion.chainId));
    setTrimmedGaugeData(trimmedData);
    setPortfolioData(portfolioData);
    if (trimmedData.length > 1) {
      setLoading(false)
    }
  };

  const handleCalculate = () => {
    calculateGauges();
    setCalculationTriggered(true);
  };

  const handleBackDropClose = () => {
    //Option to reset backdrop
    setLoading(false);
  };


  return (
      !isConnected ?
          <Box
              sx={{
                flexGrow: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
              }}
          >
            <Card sx={{
              maxWidth: '250px',
              minHeight: '100px'
            }}><CardContent>
              <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
              >
                <SelfImprovementIcon sx={{ fontSize: 48 }} />
                <Typography variant="h5" align="center">
                  Pleaes connect your Wallet
                </Typography>
              </Box>
            </CardContent>
            </Card>
          </Box> :
    <Box sx={{ flexGrow: 2 }}>
      <Grid mt={2} container sx={{ justifyContent: "center" }}>
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
          <Box>

          </Box>
          <Box m={1}>
          <Button
              variant="contained"
              onClick={handleCalculate}>
            Calculate
          </Button>
          </Box>
        </Grid>
        { calculationTriggered ?
        <Grid item xs={11}>
          <Box mb={1}>
            <Typography variant="h5">Boost Across Wallet Portfolio</Typography>
          </Box>
          {portfolioData && portfolioData.length > 0 ? (
            <PortfolioBoostTable
                key={'portfolio'}
              gaugeDatas={portfolioData}
              userVeBALAdjusted={userVeBAL+ additionalVeBAL}
            />
          ) : (
              <Typography>No position(s) found </Typography>
          )}
        </Grid> : null }
        {calculationTriggered && !loading ?
        <Grid item xs={11}>
          <Box mb={1}>
            <Typography variant="h5">Theoretical Boost Across {activeNetworkVersion.name} Gauges</Typography>
          </Box>
          <Box mb={1}>
            <Typography variant="caption">Switch Networks in the Menu Header the top right to see the corresponding gauges</Typography>
          </Box>
          {(JSON.stringify(poolsRef.current) === JSON.stringify(pools)) && pools && pools.length >= 1 && trimmedGaugeData && trimmedGaugeData.length >= 1 ? (
            <GaugeBoostTable
                key={'boost' + activeNetworkVersion.name}
                gaugeDatas={trimmedGaugeData}
                userVeBALAdjusted={userVeBAL + additionalVeBAL}

            />
          ) : (
            <CircularProgress />
          )}
        </Grid> : null }
      </Grid>
      <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
          onClick={handleBackDropClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
