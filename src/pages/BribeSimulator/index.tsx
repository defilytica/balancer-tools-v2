import * as React from "react";
import Box from '@mui/material/Box';
import {FormControl, Grid, InputLabel, MenuItem, TextField, Typography, FormControlLabel, Checkbox, Autocomplete} from '@mui/material';
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
import {formatDollarAmount} from "../../utils/numbers";
import {Handshake} from "@mui/icons-material";
import useGetBalancerStakingGauges from "../../data/balancer/useGetBalancerStakingGauges";
import { HiddenHandIncentives } from "../../data/hidden-hand/hiddenHandTypes";
import { calculateAPR, calculateBribeValue } from "./bribeHelpers";
import useGetGaugeRelativeWeights from "../../data/balancer/useGetGaugeEmissions";
import useDecorateL1Gauges from "../../data/balancer/useDecorateL1Gauges";
import useDecorateL2Gauges from "../../data/balancer/useDeocrateL2Gauges";

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
  const hhIncentives = useGetHHVotingIncentives();
  const gaugeData = useGetBalancerStakingGauges();
  const l1GaugeData = useDecorateL1Gauges(gaugeData);
  const decoratedGaugeData = useDecorateL2Gauges(l1GaugeData);
  const gaugeRelativeWeights = useGetGaugeRelativeWeights(decoratedGaugeData);
  console.log(gaugeRelativeWeights);

  // New state to hold the checkbox value
  const [useNewPoolValue, setUseNewPoolValue] = useState(false);
  const [customPoolValue, setCustomPoolValue] = useState<number>(0); // New state to hold the custom poolValue
  const [hidePoolSelect, setHidePoolSelect] = useState<boolean>(false); // New state to hide the "Select a Pool" component

  const coinData = useCoinGeckoSimpleTokenPrices([balAddress]);
  //Load gauge and Staking information

  //Fetch Weekly Emissions
  const sdk = new BalancerSDK({
    network: Number(activeNetwork.chainId),
    rpcUrl: activeNetwork.alchemyRPCUrl,
  });

  //Obtain weekly and yearly BAL emissions
  const { data } = sdk;
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

  // Helper function to format dollar amount with commas
  const formatDollarAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getOptionLabel = (pool: Pool) => {
    // Display the pool name and TVL together in the dropdown
    return `${pool.name} - TVL: ${formatDollarAmount(pool.tvlUSD)}`;
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
        setTargetAPR(parseFloat(((selectedGauge.gaugeRelativeWeight * weeklyEmissions * 4.29 * 52) / pricePerBPT / (Number(selectedGauge.workingSupply) / 1e18) * 0.4).toFixed(2)));
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
        <Grid item xs={11}>
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
            <Box ml={1}>
              {hhIncentives ? (
                <MetricsCard
                  mainMetric={
                    1 + (emissionPerVote - incentivePerVote) / emissionPerVote
                  }
                  metricName={"Emissions per $1"}
                  mainMetricInUSD={true}
                  metricDecimals={4}
                  MetricIcon={Handshake}
                />
              ) : (
                <CircularProgress />
              )}
            </Box>

            <Box mr={1}>
              <HiddenHandCard />
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={11}>
          <Typography variant={"h5"}>
            Voting Incentive Placement Simulator
          </Typography>
        </Grid>
        <Grid item xs={11}>
          <FormControlLabel
            control={
              <Checkbox
                checked={useNewPoolValue}
                onChange={handleUseNewPoolValueChange}
              />
            }
            label="Use Theoretical Pool Value ($)"
          />
        </Grid>
        {useNewPoolValue && (
          <Grid item xs={11}>
            <TextField
              label="Theoretical Pool Value ($)"
              type="number"
              value={customPoolValue}
              onChange={handlePoolValueChange}
            />
          </Grid>
        )}
        {!hidePoolSelect && (
          <Grid item xs={11}>
            <FormControl>
              <Autocomplete
                options={pools as Pool[]}
                getOptionLabel={getOptionLabel} // Use the updated getOptionLabel function
                value={
                  pools.find((pool) => pool.address === selectedPoolId) || null
                }
                onChange={(event, newValue) => {
                  handlePoolChange(event, newValue); // Pass the event and newValue to handlePoolChange
                }}
                sx={{ minWidth: "400px" }}
                renderInput={(params) => (
                  <TextField {...params} label="Select a Pool" />
                )}
              />
            </FormControl>
          </Grid>
        )}
        <Grid item xs={11}>
          <TextField
            label="Target APR (%)"
            type="number"
            value={targetAPR}
            onChange={handleTargetAPRChange}
          />
        </Grid>
        <Grid item xs={11}>
          <Typography>Found gauge with votes {allocatedVotes}</Typography>
        </Grid>
        <Grid item xs={11}>
          <Typography>TODO: target votes</Typography>
        </Grid>
        <Grid item xs={11}>
          <Grid item xs={11}>
            <TextField
              label="Bribe Value ($)"
              type="number"
              value={bribeValue}
              onChange={handleBribeValueChange}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}