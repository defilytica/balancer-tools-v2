import * as React from "react";
import Box from '@mui/material/Box';
import {
  FormControl,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Autocomplete,
  Card,
  Table,
  TableBody,
  TableHead,
  TableRow,
    TableCell,
} from '@mui/material';
import {BalancerSDK, balEmissions} from "@balancer-labs/sdk";
import {useActiveNetworkVersion} from "../../state/application/hooks";
import MetricsCard from "../../components/Cards/MetricsCard";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {useGetTotalVeBAL} from "../../data/balancer/useGetTotalVeBAL";
import {useBalancerPools} from "../../data/balancer/usePools";
import HiddenHandCard from "../../components/Cards/HiddenHandCard";
import {useEffect, useState} from "react";
import {useGetHHVotingIncentives} from "../../data/hidden-hand/useGetHHVotingIncentives";
import { useCoinGeckoSimpleTokenPrices } from "../../data/coingecko/useCoinGeckoSimpleTokenPrices";
import CoinCard from "../../components/Cards/CoinCard";
import CircularProgress from "@mui/material/CircularProgress";
import PoolComposition from "../../components/PoolComposition";
import {formatDollarAmount, formatNumber} from "../../utils/numbers";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import {Handshake} from "@mui/icons-material";
import useGetBalancerStakingGauges from "../../data/balancer/useGetBalancerStakingGauges";
import { HiddenHandIncentives } from "../../data/hidden-hand/hiddenHandTypes";
import { calculateAPR, calculateBribeValue } from "./bribeHelpers";
import useGetGaugeRelativeWeights from "../../data/balancer/useGetGaugeEmissions";
import useDecorateL1Gauges from "../../data/balancer/useDecorateL1Gauges";
import useDecorateL2Gauges from "../../data/balancer/useDeocrateL2Gauges";
import PaladinQuestsCard from "../../components/Cards/PaladinQuestsCard";
import PoolCurrencyLogo from "../../components/PoolCurrencyLogo";
import Switch from "@mui/material/Switch";

// TODO: put somewhere else
//  Helper functions to parse data types to Llama model
const extractPoolRewards = (data: HiddenHandIncentives | null): PoolReward[] => {
    const poolRewards: PoolReward[] = [];

    if (data) {
        data.data.forEach((item) => {
            const {title, bribes} = item;

            if (bribes.length > 0) {
                const poolReward: PoolReward = {pool: title};

                bribes.forEach((bribe) => {
                    const {symbol, value} = bribe;
                    const tokenKey = `${symbol.toUpperCase()}`;

                    if (!poolReward[tokenKey]) {
                        poolReward[tokenKey] = value;
                    } else {
                        const existingValue = poolReward[tokenKey];
                        poolReward[tokenKey] = typeof existingValue === 'number' ? existingValue + value : value;
                    }
                });

                poolRewards.push(poolReward);
            }
        });
    }
    return poolRewards;
};

export type PoolReward = {
    pool: string;
    [token: string]: string | number; // this represents any number of token properties with their corresponding `amountDollars` value
};

type Pool = {
    name: string;
    address: string;
    tvlUSD: number; // Add the tvlUSD property to the Pool type
    // Add other properties if there are more
  };
  

export default function BribeSimulator() {
  // Fetch relevant data
  const [activeNetwork] = useActiveNetworkVersion();
  const balAddress = "0xba100000625a3754423978a60c9317c58a424e3d";
  const totalVeBAL = useGetTotalVeBAL();
  const pools = useBalancerPools();
  const hhIncentives = useGetHHVotingIncentives('1690416000');
  const gaugeData = useGetBalancerStakingGauges();
  const l1GaugeData = useDecorateL1Gauges(gaugeData);
  const decoratedGaugeData = useDecorateL2Gauges(l1GaugeData);
  const gaugeRelativeWeights = useGetGaugeRelativeWeights(decoratedGaugeData);
  console.log(gaugeRelativeWeights);

  // New state to hold the checkbox value
  const [useNewPoolValue, setUseNewPoolValue] = useState(false);
  const [customPoolValue, setCustomPoolValue] = useState<number>(0); // New state to hold the custom poolValue
  const [hidePoolSelect, setHidePoolSelect] = useState<boolean>(false); // New state to hide the "Select a Pool" component

  const coinData = useCoinGeckoSimpleTokenPrices([balAddress], true);
  //Load gauge and Staking information


  const now = Math.round(new Date().getTime() / 1000);
  const weeklyEmissions = balEmissions.weekly(now);

  //States
  const [selectedPoolId, setSelectedPoolId] = useState<string>("");
  const [targetAPR, setTargetAPR] = useState<number>(0);
  const [allocatedVotes, setAllocatedVotes] = useState<number>(0);
  const [incentivePerVote, setIncentivePerVote] = useState<number>(0);
  const [emissionPerVote, setEmissionPerVote] = useState<number>(0);
  const [roundIncentives, setRoundIncentives] = useState<number>(0);
  const [bribeValue, setBribeValue] = useState<number>(0);
  const [gaugeRelativeWeight, setGaugeRelativeWeight] = useState<number>(0);
  const [pricePerBPT, setPricePerBPT] = useState<number>(0);

  const getOptionLabel = (pool: Pool) => {
    // Display the pool name and TVL together in the dropdown
    return `${pool.name} - TVL: ${formatDollarAmount(pool.tvlUSD, 2)}`;
  };

  // Handler for selecting a pool from the dropdown menu
  const handlePoolChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: Pool | null
  ) => {
    setSelectedPoolId(newValue ? newValue.address : "");
    
    if (gaugeRelativeWeights && newValue) {
      const val = newValue.address.toLowerCase(); // Use toLowerCase() function here
      const selectedGauge = gaugeRelativeWeights.find(
        (gauge) => gauge.pool.address.toLowerCase() === val // Use toLowerCase() function here
      );
      if (selectedPoolId) {
        // Otherwise, use the TVL of the selected pool from the pools object
        const selectedPool = pools.find(
          (pool) => pool.address === newValue.address
        );
        if (selectedPool) {
          setPricePerBPT(selectedPool.tvlUSD / (selectedPool.totalShares));
        }
      }
      if (selectedGauge) {
        setGaugeRelativeWeight(selectedGauge.gaugeRelativeWeight);
        setAllocatedVotes(parseFloat(selectedGauge.gaugeVotes.toFixed(2)));
        const balPrice =
        setTargetAPR(selectedGauge.gaugeRelativeWeight * weeklyEmissions * 4.29 * 52 / (pricePerBPT * Number(selectedGauge.totalSupply) / 10e17))
      }
    }
  };
  
  

  // Handler for entering the target APR in the input field
  const handleTargetAPRChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTargetAPR(parseFloat(event.target.value));
    let bribeValue = calculateBribeValue(
      Number(event.target.value),
      customPoolValue,
      emissionPerVote,
      incentivePerVote
    );
    setBribeValue(Number(bribeValue));
  };

  // Handler for when a project wants to experiment with the amount of their bribe
  const handleBribeValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBribeValue(parseFloat(event.target.value));
    let newTargetAPR = calculateAPR(
      Number(event.target.value),
      customPoolValue,
      emissionPerVote,
      incentivePerVote
    );
    setTargetAPR(Number(newTargetAPR));
  };

  // Handler for the checkbox change event
  const handleUseNewPoolValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUseNewPoolValue(event.target.checked);
    // Set hidePoolSelect to true when the checkbox is checked
    setHidePoolSelect(event.target.checked);
  };

  // Handler for the new custom pool value input field
  const handlePoolValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newCustomPoolValue = parseFloat(event.target.value);
    setCustomPoolValue(isNaN(newCustomPoolValue) ? 0 : newCustomPoolValue);
    setTargetAPR(0);
    setBribeValue(0)
  };

  useEffect(() => {
    if (gaugeRelativeWeights && selectedPoolId) {
      const val = selectedPoolId.toLowerCase();
      const selectedGauge = gaugeRelativeWeights.find(
        (gauge) => gauge.pool.address.toLowerCase() === val
      );
      if (selectedGauge) {
        setGaugeRelativeWeight(selectedGauge.gaugeRelativeWeight);
        setAllocatedVotes(parseFloat(selectedGauge.gaugeVotes.toFixed(2)));
        const balPrice = coinData ? coinData[balAddress].usd : 0;
        setTargetAPR(parseFloat(((selectedGauge.gaugeRelativeWeight * weeklyEmissions * balPrice * 52) / pricePerBPT / (Number(selectedGauge.workingSupply) / 1e18) * 0.4).toFixed(2)));
        console.log(selectedGauge.gaugeRelativeWeight)
      }
    }
  }, [gaugeRelativeWeights, selectedPoolId, weeklyEmissions, pricePerBPT]);

  // useEffect to handle other calculations and updates
  useEffect(() => {
    if (hhIncentives.incentives && hhIncentives.incentives.data.length > 1) {
      // Calculate incentives and emission per vote Metrics for a given round
      let totalVotes = 0;
      let totalValue = 0;

      if (useNewPoolValue) {
        // Use the custom poolValue if the checkbox is checked
        setCustomPoolValue(customPoolValue);
      } else if (selectedPoolId) {
        // Otherwise, use the TVL of the selected pool from the pools object
        const selectedPool = pools.find((pool) => pool.address === selectedPoolId);
        if (selectedPool) {
          setCustomPoolValue(selectedPool.tvlUSD);
          setPricePerBPT(selectedPool.tvlUSD / selectedPool.totalShares);
        }
      }

      hhIncentives.incentives.data.forEach((item) => {
        totalValue += item.totalValue;
        totalVotes += item.voteCount;
      });

      let emissionVotes = 0;
      let emissionValue = 0;

      hhIncentives.incentives.data.forEach((item) => {
        totalValue += item.totalValue;
        totalVotes += item.voteCount;
        if (item.totalValue > 0) {
          emissionValue += item.totalValue;
          emissionVotes += item.voteCount;
        }
      });

      const incentiveEfficency = totalValue / totalVotes;
      const emissionEff = emissionValue / emissionVotes;

      setIncentivePerVote(incentiveEfficency);
      setEmissionPerVote(emissionEff);
      setRoundIncentives(totalValue);
    }
  }, [gaugeData, hhIncentives.incentives, useNewPoolValue, customPoolValue, selectedPoolId, pools]);

  const selectedPool = pools.find((pool) => pool.address === selectedPoolId);
  const val = selectedPoolId.toLowerCase();
  const selectedGauge = gaugeRelativeWeights.find(
      (gauge) => gauge.pool.address.toLowerCase() === val
  );

  return (
      <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
      >
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          {/* Voting Incentive Placement Simulator Title */}
          <Grid item xs={11} md={9}>
            <Typography variant={"h5"}>
              Voting Incentive Placement Simulator
            </Typography>
          </Grid>

          {/* HiddenHandCard */}
          <Grid item xs={11} md={9}>
            <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                sx={{
                  justifyContent: { md: "space-between", xs: "center" },
                  alignContent: "center",
                }}
            >
            <Box mr={1}>
              <HiddenHandCard />

            </Box>
            <Box>
              <PaladinQuestsCard />
            </Box>
            </Grid>
          </Grid>

          {/* Ecosystem Configuration */}
          <Grid item xs={11} md={9}>
            <Typography variant={"h5"}>veBAL Tokenomics</Typography>
          </Grid>

          <Grid item xs={11} md={9}>
            <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                sx={{
                  justifyContent: { md: "flex-start", xs: "center" },
                  alignContent: "center",
                }}
            >
              {coinData && coinData[balAddress] && coinData[balAddress].usd ? (
                  <Box mr={1}>
                    <CoinCard
                        tokenAddress={balAddress}
                        tokenName="BAL"
                        tokenPrice={coinData[balAddress].usd}
                        tokenPriceChange={coinData[balAddress].usd_24h_change}
                    />
                  </Box>
              ) : (
                  <CircularProgress />
              )}
              <Box mr={1}>
                <MetricsCard
                    mainMetric={weeklyEmissions}
                    mainMetricInUSD={false}
                    mainMetricUnit={" BAL"}
                    metricName={"Weekly BAL"}
                    MetricIcon={AutoAwesomeIcon}
                />
              </Box>
              <Box mr={1}>
                <MetricsCard
                    mainMetric={totalVeBAL}
                    mainMetricInUSD={false}
                    mainMetricUnit={" BAL"}
                    metricName={"Total veBAL"}
                    MetricIcon={AutoAwesomeIcon}
                />
              </Box>
              {/* <Box ml={1}>
                {hhIncentives ? (
                    <MetricsCard
                        mainMetric={
                            1 + (emissionPerVote - incentivePerVote) / emissionPerVote
                        }
                        metricName={"HH Emissions per $1"}
                        mainMetricInUSD={true}
                        metricDecimals={4}
                        MetricIcon={Handshake}
                    />
                ) : (
                    <CircularProgress />
                )}
              </Box> */}
            </Grid>
          </Grid>

          {/* Calculator-like layout */}
          <Grid item xs={11} md={9}>
            <Typography variant={'h5'}>Simulator</Typography>
          </Grid>
          <Grid item xs={11} md={9}>
            <Typography variant={'h6'}>1. TVL Selection</Typography>
          </Grid>
          <Grid item xs={11} md={9}>
            <FormControlLabel
                control={
                  <Switch
                      checked={useNewPoolValue}
                      onChange={handleUseNewPoolValueChange}
                  />
                }
                label="Use Theoretical Pool Value ($)"
            />
          </Grid>
          {!hidePoolSelect && (
              <Grid item xs={11} md={9}>
                {pools && pools.length > 1 ?
                <FormControl sx={{marginBottom: '10px'}}>
                  <Autocomplete
                      options={pools as Pool[]}
                      getOptionLabel={getOptionLabel}
                      value={pools.find((pool) => pool.address === selectedPoolId) || null}
                      onChange={(event, newValue) => {
                        handlePoolChange(event, newValue);
                      }}
                      sx={{
                        minWidth: "500px",
                        maxWidth: "500px"
                      }}
                      renderInput={(params) => <TextField {...params} label="Select a Pool" />}
                  />
                </FormControl> :
                    <Box>
                      <CircularProgress />
                      <Typography>Loading pools...</Typography>
                    </Box>}
                { !hidePoolSelect && allocatedVotes && selectedPool && selectedGauge ?
                    <Card
                        sx={{

                          minWidth: '100px',
                          maxWidth: '900px',
                          border: '1px solid grey',
                        }}
                    >
                      <Box m={1}>
                        <Typography variant={'h6'}>Active Gauge Found</Typography>
                      </Box>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Pool Composition</TableCell>
                            <TableCell>TVL</TableCell>
                            <TableCell>Current Votes</TableCell>
                            <TableCell>Min BAL APR</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            { selectedPool ?
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box mr={1}>
                                      <PoolCurrencyLogo tokens={selectedPool.tokens} />
                                    </Box>
                                    <Box>
                                      <PoolComposition poolData={selectedPool} />
                                    </Box>
                                  </Box>
                                </TableCell>
                                : <TableCell>-</TableCell>
                            }
                            <TableCell>{formatDollarAmount(selectedPool.tvlUSD)}</TableCell>
                            <TableCell>{formatNumber(allocatedVotes)}</TableCell>
                            <TableCell>{formatNumber(parseFloat(((selectedGauge.gaugeRelativeWeight * weeklyEmissions * (coinData ? coinData[balAddress].usd : 0) * 52) / pricePerBPT / (Number(selectedGauge.workingSupply) / 1e18) * 0.4).toFixed(2)))}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Card>

                    : null }
              </Grid>
          )}
          {useNewPoolValue && (
              <Grid item xs={11} md={9}>
                <TextField
                    label="Theoretical Pool Value ($)"
                    type="number"
                    value={customPoolValue}
                    onChange={handlePoolValueChange}
                />
              </Grid>
          )}
          <Grid item xs={11} md={9}>
            <Typography variant={'h6'}>2. APR vs Bribe Value Simulation</Typography>
          </Grid>
          <Grid item xs={11} md={9}>
            <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                sx={{
                  justifyContent: { md: "space-between", xs: "center" },
                  alignContent: "center",
                }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box mr={1}>
                  <TextField
                      label="Target APR (%)"
                      type="number"
                      value={targetAPR}
                      onChange={handleTargetAPRChange}
                  />
                </Box>
                <Box m={1}>
                  <CompareArrowsIcon />
                </Box>
                <Box m={1}>
                  <TextField
                      label="Bribe Value ($)"
                      type="number"
                      value={bribeValue}
                      onChange={handleBribeValueChange}
                  />
                </Box>
              </Box>

            </Grid>
          </Grid>
        </Grid>
      </Box>
  );

}