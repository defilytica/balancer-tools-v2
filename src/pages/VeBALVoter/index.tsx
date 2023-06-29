import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Grid, Typography, List, ListItem } from '@mui/material';
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
import PoolCurrencyLogo from "../../components/PoolCurrencyLogo";
import * as React from "react";
import GaugeBoostTable from "../../components/Tables/GaugeBoostTable";





export default function VeBALVoter() {

    //Load user wallet stats
    const { isConnected, address } = useAccount();
    const userLocks = useUserVeBALLocks();
    const userVeBAL = useGetUserVeBAL();

    //Load gauge and Staking information
    const gaugeData = useGetBalancerStakingGauges();
    const voterAddress = address ? address?.toLowerCase() : ''
    const decoratedVotingGauges = useDecorateGaugesWithVotes(gaugeData, voterAddress)
    const userVotingGauges = decoratedVotingGauges.filter((el) => el.userVotingPower? el.userVotingPower > 0 : false)
    console.log("userVotingGauges", userVotingGauges)


    const date = new Date(userLocks?.unlockTime ? userLocks?.unlockTime * 1000 : 0);
    const unlockDate = date.toLocaleDateString();

    return (
        <Box sx={{ flexGrow: 2 }}>
            <Grid
                container
                spacing={2}
                sx={{ justifyContent: 'center' }}
            >
                { isConnected ?
                    <Grid item mt={1} xs={11}>
                        <Grid
                            container
                            columns={{ xs: 4, sm: 8, md: 12 }}
                            sx={{ justifyContent: { md: 'flex-start', xs: 'center' }, alignContent: 'center' }}
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
                            <GenericMetricsCard mainMetric={'-'} metricName={'No wallet connected'} MetricIcon={AccountBalanceWalletIcon} />
                        </Box>
                    </Grid>
                }
                <Grid item mt={1} xs={11}>
                <Typography>
                    User votes mock:
                    </Typography>
                    <GaugeBoostTable gaugeDatas={userVotingGauges} />
                </Grid>
            </Grid>
            
        </Box>
    );
}