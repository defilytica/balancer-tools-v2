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
import {BalancerStakingGauges} from "../../data/balancer/balancerTypes";
import VotingTable from '../../components/Tables/VotingTable';


export default function VeBALVoter() {

    //Load user wallet stats
    const {isConnected, address} = useAccount();
    const userLocks = useUserVeBALLocks();
    const userVeBAL = useGetUserVeBAL(address ? address : '');
    const hhIncentives = useGetHHVotingIncentives();

    console.log("hhIncentives", hhIncentives)
    console.log("userVeBAL", userVeBAL)

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
                    <Typography>
                        User votes mock:
                    </Typography>
                    {fullyDecoratedGauges && fullyDecoratedGauges.length > 0 ?
                       <VotingTable gaugeDatas={fullyDecoratedGauges} userVeBal={950} /> : <CircularProgress/>}
                </Grid>
            </Grid>

        </Box>
    );
}
