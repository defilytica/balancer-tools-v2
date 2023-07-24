import * as React from "react";
import Box from '@mui/material/Box';
import {FormControl, Grid, InputLabel, MenuItem, TextField, Typography, FormControlLabel, Checkbox} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
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

export default function BribeSimulator() {

    // Fetch relevant data
    const [activeNetwork] = useActiveNetworkVersion();
    const balAddress = '0xba100000625a3754423978a60c9317c58a424e3d';
    const totalVeBAL = useGetTotalVeBAL();
    const pools = useBalancerPools()
    const hhIncentives = useGetHHVotingIncentives();
    
    // New state to hold the checkbox value
    const [useNewTotalValue, setUseNewTotalValue] = useState(false);
    const [customTotalValue, setCustomTotalValue] = useState<number>(0); // New state to hold the custom totalValue
    const [hidePoolSelect, setHidePoolSelect] = useState<boolean>(false); // New state to hide the "Select a Pool" component

    const coinData = useCoinGeckoSimpleTokenPrices([balAddress]);
    //Load gauge and Staking information
    const gaugeData = useGetBalancerStakingGauges();

    //Fetch Weekly Emissions
    const sdk = new BalancerSDK({
        network: Number(activeNetwork.chainId),
        rpcUrl: activeNetwork.alchemyRPCUrl,
    });

    //Obtain weekly and yearly BAL emissions
    const {data} = sdk;
    const now = Math.round(new Date().getTime() / 1000)
    const weeklyEmissions = balEmissions.weekly(now)


    //States
    const [selectedPoolId, setSelectedPoolId] = useState<string>('')
    const [targetAPR, setTargetAPR] = useState<number>(0)
    const [allocatedVotes, setAllocatedVotes] = useState<number>(0)
    const [incentivePerVote, setIncentivePerVote] = useState<number>(0);
    const [emissionPerVote, setEmissionPerVote] = useState<number>(0);
    const [roundIncentives, setRoundIncentives] = useState<number>(0);
    const [bribeValue, setBribeValue] = useState<number>(0);

    // Handler for selecting a pool from the dropdown menu
    const handlePoolChange = (event: SelectChangeEvent) => {
        setSelectedPoolId(event.target.value as string);
        //map vote count
        const val = event.target.value as string
        console.log("val", val)
        if (hhIncentives && hhIncentives.incentives) {
            const matchGauge = hhIncentives.incentives.data.find((el) => el.proposal.toLowerCase() === val.toLowerCase())
            console.log("matchGauge", matchGauge)
            if (matchGauge) {
                setAllocatedVotes(matchGauge.voteCount)
            }
        }
    };

    // Handler for entering the target APR in the input field
    const handleTargetAPRChange = (event: React.ChangeEvent<HTMLInputElement>) =>  {
        const newBribeValue = parseFloat(event.target.value);
        setTargetAPR(isNaN(newBribeValue) ? 0 : newBribeValue);
    };

    // Handler for when a project wants to experiment with the amount of their bribe
    const handleBribeValueChange = (event: React.ChangeEvent<HTMLInputElement>) =>  {
        const newTargetAPR = parseFloat(event.target.value);
        setTargetAPR(isNaN(newTargetAPR) ? 0 : newTargetAPR);
    };

    // Handler for the checkbox change event
    const handleUseNewTotalValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUseNewTotalValue(event.target.checked);
        // Set hidePoolSelect to true when the checkbox is checked
        setHidePoolSelect(event.target.checked);        
    };

    // Handler for the new custom totalValue input field
    const handleCustomTotalValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newCustomTotalValue = parseFloat(event.target.value);
        setCustomTotalValue(isNaN(newCustomTotalValue) ? 0 : newCustomTotalValue);
    };

    useEffect(() => {
        const data = extractPoolRewards(hhIncentives.incentives);
        if (hhIncentives.incentives && hhIncentives.incentives.data.length > 1) {
            //calculate inventives and emission per vote Metrics for a given round
            let totalVotes = 0;
            let totalValue = 0;
            if (useNewTotalValue) {
                // Use the new custom totalValue if the checkbox is checked
                totalValue = customTotalValue;
            } else {
                // Otherwise, use the totalValue from the pools object
                hhIncentives.incentives.data.forEach((item) => {
                    totalValue += item.totalValue;
                    totalVotes += item.voteCount;
                });
            }
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
            const emissionEff = emissionValue / emissionVotes
            setIncentivePerVote(incentiveEfficency)
            setEmissionPerVote(emissionEff)
            setRoundIncentives(totalValue)
        }
    }, [gaugeData, hhIncentives.incentives, useNewTotalValue, customTotalValue]);

    return (
        <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Grid
                container
                spacing={2}
                sx={{justifyContent: 'center'}}
            >
                <Grid item xs={11}>
                    <Grid
                        container
                        columns={{xs: 4, sm: 8, md: 12}}
                        sx={{justifyContent: {md: 'flex-start', xs: 'center'}, alignContent: 'center'}}
                    >
                        {coinData && coinData[balAddress] && coinData[balAddress].usd ?
                            <Box mr={1}>
                            <CoinCard
                                tokenAddress={balAddress}
                                tokenName='BAL'
                                tokenPrice={coinData[balAddress].usd}
                                tokenPriceChange={coinData[balAddress].usd_24h_change}
                            />
                            </Box>
                            : <CircularProgress />}
                        <Box mr={1}>
                            <MetricsCard
                                mainMetric={weeklyEmissions}
                                mainMetricInUSD={false}
                                mainMetricUnit={' BAL'}
                                metricName={'Weekly BAL'}
                                MetricIcon={AutoAwesomeIcon}
                            />
                        </Box>
                        <Box mr={1}>
                            <MetricsCard
                                mainMetric={totalVeBAL}
                                mainMetricInUSD={false}
                                mainMetricUnit={' BAL'}
                                metricName={'Total veBAL'}
                                MetricIcon={AutoAwesomeIcon}
                            />
                        </Box>
                        <Box ml={1}>
                            {hhIncentives ?
                                <MetricsCard
                                    mainMetric={1 + (emissionPerVote - incentivePerVote) / emissionPerVote}
                                    metricName={"Emissions per $1"} mainMetricInUSD={true}
                                    metricDecimals={4}
                                    MetricIcon={Handshake}/>
                                : <CircularProgress/>}
                        </Box>

                        <Box mr={1}>
                            <HiddenHandCard/>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={11} >
                    <Typography variant={'h5'}>Voting Incentive Placement Simulator</Typography>
                </Grid>
                <Grid item xs={11}>
                    <TextField
                        label="Target APR"
                        type="number"
                        value={targetAPR}
                        onChange={handleTargetAPRChange}
                    />
                </Grid>
                <Grid item xs={11}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={useNewTotalValue}
                                onChange={handleUseNewTotalValueChange}
                            />
                        }
                        label="Use Theoretical Pool Value ($)"
                    />
                </Grid>
                {useNewTotalValue && (
                    <Grid item xs={11}>
                        <TextField
                            label="Theoretical Pool Value ($)"
                            type="number"
                            value={customTotalValue}
                            onChange={handleCustomTotalValueChange}
                        />
                    </Grid> 
                )}               
                {!hidePoolSelect && (
                    <Grid item xs={11}>
                        <FormControl>
                            <InputLabel>Select a Pool</InputLabel>
                            <Select
                                value={selectedPoolId}
                                onChange={handlePoolChange}
                            >
                                {pools.map((pool) => (
                                    <MenuItem key={pool.address} value={pool.address}>
                                        <Box display="flex" alignItems="center">
                                            <Box mr={1}>
                                                {pool.name}
                                            </Box>
                                            <PoolComposition poolData={pool} />
                                            <Box ml={1}>{formatDollarAmount(pool.tvlUSD)}</Box>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                )}
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
                    <Typography> Calculation of target APR is probably ratio of tvl vs weekly emission fraction to receive bal with that price.
                        Bribe value is then probably inferred from target bal emission and emission / $ spent
                    </Typography>
                </Grid>

            </Grid>
        </Box>
    );
}