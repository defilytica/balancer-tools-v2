import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import {Grid, Typography} from '@mui/material';
import {useAccount} from "wagmi";
import {useUserVeBALLocks} from "../../data/balancer/useUserVeBALLocks";
import {useGetUserVeBAL} from "../../data/balancer/useGetUserVeBAL";
import useGetBalancerStakingGauges from "../../data/balancer/useGetBalancerStakingGauges"
import MetricsCard from "../../components/Cards/MetricsCard";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import GenericMetricsCard from "../../components/Cards/GenericMetricCard";
import LockClockIcon from "@mui/icons-material/LockClock";
import useDecorateGaugesWithVotes from "../../data/balancer/useDecorateGaugesWithVotes";
import * as React from "react";
import {useGetHHVotingIncentives} from "../../data/hidden-hand/useGetHHVotingIncentives";
import {decorateGaugesWithIncentives} from "../../data/hidden-hand/helpers";
import {BalancerStakingGauges, SimplePoolData} from "../../data/balancer/balancerTypes";
import VotingTable from '../../components/Tables/VotingTable';
import {useEffect, useState} from "react";
import PoolCurrencyLogo from "../../components/PoolCurrencyLogo";
import GaugeComposition from "../../components/GaugeComposition";
import TextField from "@mui/material/TextField";
import {SimpleGauge} from "../../data/balancer/useGetSimpleGaugeData";


export interface GaugeAllocation {
    gaugeAddress: string,
    percentage: number,
}

export default function VeBALVoter() {

    //Load user wallet stats
    const {isConnected, address} = useAccount();
    const userLocks = useUserVeBALLocks();
    const userVeBAL = useGetUserVeBAL(address ? address : '');
    const hhIncentives = useGetHHVotingIncentives();

    const [allocations, setAllocations] = useState<GaugeAllocation[]>([]);

    const handleAddAllocation = (address: string) => {
        const newAllocation: GaugeAllocation = {
            gaugeAddress: address,
            percentage: 0,
        };
        setAllocations((prevAllocations) => [...prevAllocations, { ...newAllocation }]);
    };

    const handlePercentageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, allocElement: GaugeAllocation) => {
        const inputPercentage = Number(event.target.value);
        if (isNaN(inputPercentage) || inputPercentage < 0 || inputPercentage > 100) {
            // Invalid input, set percentage to 0
            allocElement.percentage = 0
        } else {
            // Valid input, update percentage
            allocElement.percentage = inputPercentage
        }
        setAllocations([...allocations])
    };

    //Load gauge and Staking information
    let fullyDecoratedGauges: BalancerStakingGauges[] = [];
    const gaugeData = useGetBalancerStakingGauges();
    const voterAddress = address ? address?.toLowerCase() : ''
    const decoratedVotingGauges = useDecorateGaugesWithVotes(gaugeData, voterAddress)
    // TODO: improve logic, adjust hook?
    if (hhIncentives && hhIncentives.incentives && hhIncentives.incentives.data) {
        fullyDecoratedGauges = decorateGaugesWithIncentives(decoratedVotingGauges, hhIncentives.incentives)
    }
    const date = new Date(userLocks?.unlockTime ? userLocks?.unlockTime * 1000 : 0);
    const unlockDate = date.toLocaleDateString();

    const userVotingGauges = decoratedVotingGauges.filter((el) => el.userVotingPower ? el.userVotingPower > 0 : false);
    //Map out active user votes
    useEffect(() => {
        // Map out active user votes
        if (userVotingGauges.length > 0 && allocations.length === 0) {
            const newAllocations = userVotingGauges.map((vote) => ({
                gaugeAddress: vote.address,
                percentage: vote.userVotingPower ? vote.userVotingPower : 0,
            }));
            setAllocations([...newAllocations]);
        }
    }, [userVotingGauges, allocations]);

    console.log("allocations", allocations)

    return (
        <Box sx={{flexGrow: 2}}>
            <Grid
                container
                spacing={2}
                sx={{justifyContent: 'center'}}
            >
                {isConnected ?
                    <Grid item mt={1} xs={11}>
                        <Grid
                            container
                            columns={{xs: 4, sm: 8, md: 12}}
                            sx={{justifyContent: {md: 'flex-start', xs: 'center'}, alignContent: 'center'}}
                        >
                            <Box m={1}>
                                <MetricsCard
                                    mainMetric={userLocks?.lockedBalance ? userLocks.lockedBalance : 0}
                                    mainMetricInUSD={false}
                                    metricName={'B-80BAL-20WETH'}
                                    MetricIcon={LockPersonIcon}
                                />
                            </Box>
                            <Box m={1}>
                                <MetricsCard
                                    mainMetric={userVeBAL ? userVeBAL : 0}
                                    mainMetricInUSD={false}
                                    metricName={'Current veBAL'}
                                    MetricIcon={AccountBalanceWalletIcon}
                                />
                            </Box>
                            <Box m={1}>
                                <GenericMetricsCard
                                    mainMetric={unlockDate}
                                    metricName={'Unlock date'}
                                    MetricIcon={LockClockIcon}
                                />
                            </Box>
                        </Grid>
                    </Grid> :
                    <Grid item mt={1} xs={11}>
                        <Box m={1}>
                            <GenericMetricsCard mainMetric={'-'} metricName={'No wallet connected'}
                                                MetricIcon={AccountBalanceWalletIcon}/>
                        </Box>
                    </Grid>
                }
                <Grid item mt={1} xs={11}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column'}}> {/* Apply flexbox display */}
                        {allocations.map((alloc) => {
                            const relevantGauge = fullyDecoratedGauges.find((el) => el.address.toLowerCase() === alloc.gaugeAddress.toLowerCase());
                            console.log("relevantGauge", relevantGauge)
                            if (relevantGauge && relevantGauge.pool.tokens) {
                                return (
                                    <Box p={1} key={alloc.gaugeAddress}>
                                        <Box style={{ display: 'flex', alignItems: 'center', flexDirection: 'row'}}> {/* Apply flexbox display and align items */}

                                            <PoolCurrencyLogo
                                                tokens={relevantGauge.pool.tokens.map((token) => ({
                                                    address: token.address ? token.address.toLowerCase() : '',
                                                }))}
                                                size={'25px'}
                                            />

                                            <GaugeComposition poolData={relevantGauge.pool} />
                                            <Box ml={2}>
                                            <TextField
                                                type="number"
                                                label="Weight"
                                                size="small"
                                                value={alloc.percentage}
                                                onChange={(e) => handlePercentageChange(e, alloc)}
                                                inputProps={{ min: 0, max: 100 }} // Set the minimum and maximum values
                                            />
                                            </Box>
                                        </Box>
                                    </Box>
                                );
                            }
                            return null;
                        })}
                    </Box>
                </Grid>
                <Grid item mt={1} xs={11}>
                    <Typography>
                        User votes mock:
                    </Typography>
                    {fullyDecoratedGauges && fullyDecoratedGauges.length > 0 ?
                       <VotingTable gaugeDatas={fullyDecoratedGauges} userVeBal={950} onAddAllocation={handleAddAllocation}/> : <CircularProgress/>}
                </Grid>
            </Grid>

        </Box>
    );
}
