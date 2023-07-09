import Box from '@mui/material/Box';
import {Avatar, Button, Card, Grid, Table, TableBody, TableHead, TableRow, Typography} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
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
import {useEffect, useState} from "react";
import {useGetHHVotingIncentives} from "../../data/hidden-hand/useGetHHVotingIncentives";
import {decorateGaugesWithIncentives} from "../../data/hidden-hand/helpers";
import {BalancerStakingGauges} from "../../data/balancer/balancerTypes";
import VotingTable from '../../components/Tables/VotingTable';
import PoolCurrencyLogo from "../../components/PoolCurrencyLogo";
import GaugeComposition from "../../components/GaugeComposition";
import TextField from "@mui/material/TextField";
import {GaugeAllocation} from '../../data/balancer/balancerGaugeTypes'
import {ethers} from "ethers";
import VeBalVoteMany from '../../constants/abis/veBALVoteMany.json'
import {formatDollarAmount} from "../../utils/numbers";
import TableCell from "@mui/material/TableCell";
import HiddenHandCard from "../../components/Cards/HiddenHandCard";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ArbitrumLogo from '../../assets/svg/arbitrum.svg'
import EtherLogo from '../../assets/svg/ethereum.svg'
import PolygonLogo from '../../assets/svg/polygon.svg'
import GnosisLogo from '../../assets/svg/gnosis.svg'
import zkevmLogo from '../../assets/svg/zkevm.svg'
import OpLogo from '../../assets/svg/optimism.svg'
import {match} from "assert";


export default function VeBALVoter() {

    //Load user wallet stats
    const {isConnected, address} = useAccount();
    const userLocks = useUserVeBALLocks();
    const userVeBAL = useGetUserVeBAL(address ? address : '');
    const hhIncentives = useGetHHVotingIncentives();

    const [allocations, setAllocations] = useState<GaugeAllocation[]>([]);
    const [totalPercentage, setTotalPercentage] = useState<number>(0);

    //TODO: outsource
    interface NetworkLogoMap {
        [networkNumber: number]: string;
    }

    const networkLogoMap: NetworkLogoMap = {
        1: EtherLogo,
        10: OpLogo,
        137: PolygonLogo,
        100: GnosisLogo,
        1101: zkevmLogo,
        42161: ArbitrumLogo
    };

    const handleAddAllocation = (address: string) => {
        const newAllocation: GaugeAllocation = {
            gaugeAddress: address,
            percentage: 0,
            rewardInUSD: 0,
            userValuePerVote: 0,
            isNew: true,
        };
        setAllocations((prevAllocations) => [...prevAllocations, {...newAllocation}]);
    };

    const handlePercentageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, allocElement: GaugeAllocation) => {
        const inputPercentage = Number(event.target.value);
        const matchingHiddenHandData = hhIncentives?.incentives?.data?.find(data => data.proposal.toLowerCase() === allocElement.gaugeAddress.toLowerCase());

        if (matchingHiddenHandData) {
            const currentVoteValue = fullyDecoratedGauges.find(gauge => gauge.address === allocElement.gaugeAddress)?.voteCount ?? 0;
            const newVoteValue = currentVoteValue + userVeBAL * inputPercentage / 100;

            const updatedGauge = fullyDecoratedGauges.find(gauge => gauge.address === allocElement.gaugeAddress);
            if (updatedGauge) {
                updatedGauge.voteCount = newVoteValue;
                updatedGauge.valuePerVote = matchingHiddenHandData.totalValue / newVoteValue;
            }

            // Map updated gauge back to fullyDecoratedGauges
            fullyDecoratedGauges = fullyDecoratedGauges.map(gauge => {
                if (gauge.address === allocElement.gaugeAddress && updatedGauge) {
                    return updatedGauge;
                }
                return gauge;
            });
        }
        const incentive = fullyDecoratedGauges.find(gauge => gauge.address === allocElement.gaugeAddress);

        if (isNaN(inputPercentage) || inputPercentage < 0 || inputPercentage > 100) {
            // Invalid input, set percentage to 0
            allocElement.percentage = 0;
        } else {
            // Valid input, update percentage
            allocElement.percentage = inputPercentage;
            allocElement.rewardInUSD = incentive ? userVeBAL * inputPercentage / 100 * incentive.valuePerVote : 0;
            allocElement.userValuePerVote = incentive ? incentive.valuePerVote : 0
        }
        setAllocations([...allocations]);
    };

    const calculateAverageValuePerVote = (gauges: BalancerStakingGauges[]) => {
        const totalRewards = gauges.reduce((sum, gauge) => sum + (gauge.totalRewards || 0), 0);
        const totalVotes = gauges.reduce((sum, gauge) => sum + (gauge.totalRewards ? gauge.voteCount : 0), 0);
        console.log("totalRewards", totalRewards);
        console.log("totalVotes", totalVotes);
        return totalRewards / totalVotes;
    };




    //Load gauge and Staking information
    let fullyDecoratedGauges: BalancerStakingGauges[] = [];
    let averageValuePerVote = 0
    const gaugeData = useGetBalancerStakingGauges();
    const voterAddress = address ? address?.toLowerCase() : ''
    const decoratedVotingGauges = useDecorateGaugesWithVotes(gaugeData, voterAddress)
    // TODO: improve logic, adjust hook?
    if (hhIncentives && hhIncentives.incentives && hhIncentives.incentives.data) {
        fullyDecoratedGauges = decorateGaugesWithIncentives(decoratedVotingGauges, hhIncentives.incentives)
        averageValuePerVote = calculateAverageValuePerVote(fullyDecoratedGauges)
    }


    console.log("averageValuePerVote", averageValuePerVote)

    const date = new Date(userLocks?.unlockTime ? userLocks?.unlockTime * 1000 : 0);
    const unlockDate = date.toLocaleDateString();

    const userVotingGauges = decoratedVotingGauges.filter((el) => el.userVotingPower ? el.userVotingPower > 0 : false);


    // Map out active user votes
    useEffect(() => {
        //For the initial load we can take the currently active valuePerVote as a baseline as the user doesn't dilute its vote
        if (userVotingGauges.length > 0 && allocations.length === 0 && fullyDecoratedGauges.length > 0) {
            const newAllocations = userVotingGauges.map((vote) => {
                const matchingGauge = fullyDecoratedGauges.find((gauge) => gauge.address === vote.address);
                const rewardInUSD = matchingGauge ? userVeBAL  * matchingGauge.valuePerVote : 0;
                console.log("rewardInUsd", rewardInUSD)
                return {
                    gaugeAddress: vote.address,
                    percentage: vote.userVotingPower ? vote.userVotingPower : 0,
                    rewardInUSD: rewardInUSD,
                    userValuePerVote: matchingGauge ? matchingGauge.valuePerVote : 0,
                    isNew: false
                };
            });
            setAllocations([...newAllocations]);
        }
    }, [userVotingGauges, allocations, address]);


    //Total percentage validation hook -> controls vote button disable function
    useEffect(() => {
        const newPercentage = allocations.reduce((sum, allocation) => sum + allocation.percentage, 0)
        setTotalPercentage(newPercentage)
    }, [allocations, address])


    // TODO: replace with wagmi hook!
    async function updateVotes(allocations: GaugeAllocation[]) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const erc20 = new ethers.Contract(address ? address : '', VeBalVoteMany, signer);

        const addresses = Array(8)
            .fill("0x0000000000000000000000000000000000000000")
            .map((_, index) =>
                index < allocations.length
                    ? allocations[index].gaugeAddress.slice(2, 42)
                    : "0x0000000000000000000000000000000000000000"
            );

        const weights = Array(8)
            .fill(0)
            .map((_, index) =>
                index < allocations.length ? allocations[index].percentage * 100 : 0
            );

        await erc20.vote_for_many_gauge_weights(addresses, weights);
    }

    // Reset voting state
    const resetVotes = () => {
        const newAllocations = userVotingGauges.map((vote) => {
            const matchingGauge = fullyDecoratedGauges.find((gauge) => gauge.address === vote.address);
            const rewardInUSD = (matchingGauge && vote.userVotingPower) ? vote.userVotingPower * matchingGauge.valuePerVote : 0;
            return {
                gaugeAddress: vote.address,
                percentage: vote.userVotingPower ? vote.userVotingPower : 0,
                rewardInUSD: rewardInUSD,
                userValuePerVote: vote.valuePerVote ? vote.valuePerVote : 0,
                isNew: false
            };
        });
        setAllocations([...newAllocations]);
    }




    return (
        <Box key={address? address : 'veBAL'} sx={{flexGrow: 2}}>
            <Grid
                container
                spacing={2}
                sx={{justifyContent: 'center'}}
            >
                <Grid item mt={1} xs={11}>
                    <Typography variant={'h5'}>
                        veBAL Multi-Voter Tool
                    </Typography>
                </Grid>
                {isConnected ?
                    <Grid item xs={11}>
                        <Grid
                            container
                            columns={{xs: 4, sm: 8, md: 12}}
                            sx={{justifyContent: {md: 'flex-start', xs: 'center'}, alignContent: 'center'}}
                        >
                            <Box mr={0.5} mt={0.5}>
                                <MetricsCard
                                    mainMetric={userVeBAL ? userVeBAL : 0}
                                    mainMetricInUSD={false}
                                    metricName={'Current veBAL'}
                                    MetricIcon={AccountBalanceWalletIcon}
                                />
                            </Box>
                            <Box mr={0.5} mt={0.5}>
                                <MetricsCard
                                    mainMetric={userLocks?.lockedBalance ? userLocks.lockedBalance : 0}
                                    mainMetricInUSD={false}
                                    metricName={'B-80BAL-20WETH'}
                                    MetricIcon={LockPersonIcon}
                                />
                            </Box>
                            <Box mr={0.5} mt={0.5}>
                                <GenericMetricsCard
                                    mainMetric={unlockDate}
                                    metricName={'Unlock date'}
                                    MetricIcon={LockClockIcon}
                                />
                            </Box>
                        </Grid>
                    </Grid> :
                    <Grid item mt={1} xs={11}>
                        <Box mr={0.5} mt={0.5}>
                            <GenericMetricsCard mainMetric={'-'} metricName={'No wallet connected'}
                                                MetricIcon={AccountBalanceWalletIcon}/>
                        </Box>
                    </Grid>
                }
                <Grid item mt={1} xs={11}>
                    <Typography variant={'h6'}>
                        Voting configuration
                    </Typography>

                </Grid>
                <Grid item xs={11}>
                    <Grid
                        container
                        columns={{xs: 4, sm: 8, md: 12}}
                        sx={{justifyContent: {md: 'flex-start', xs: 'center'}, alignContent: 'center'}}
                    >
                        <Box mr={0.5} mt={0.5}>
                            <MetricsCard
                                mainMetric={allocations.reduce((sum, allocation) => sum + allocation.rewardInUSD, 0)}
                                mainMetricInUSD={true}
                                metricName={'Potential Reward'}
                                MetricIcon={MonetizationOnIcon}
                            />
                        </Box>
                        <Box mr={0.5} mt={0.5}>
                            <MetricsCard
                                mainMetric={averageValuePerVote}
                                mainMetricInUSD={false}
                                mainMetricUnit={' $/veBAL'}
                                metricName={'Average reward'}
                                MetricIcon={MonetizationOnIcon}
                            />
                        </Box>
                    </Grid>

                </Grid>
                <Grid item xs={11}>
                    <Grid
                        container
                        columns={{xs: 4, sm: 8, md: 12}}
                        sx={{justifyContent: {md: 'flex-start', xs: 'center'}, alignContent: 'center'}}
                    >
                        <Box mr={1} mt={1}>
                            <Card
                                sx={{border: '1px solid grey'}}
                            >
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Network</TableCell>
                                            <TableCell>Tokens</TableCell>
                                            <TableCell>Composition</TableCell>
                                            <TableCell>Vote weight</TableCell>
                                            <TableCell>New $/veBAL</TableCell>
                                            <TableCell>Incentives</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allocations.map((alloc) => {
                                            const relevantGauge = fullyDecoratedGauges.find(
                                                (el) => el.address.toLowerCase() === alloc.gaugeAddress.toLowerCase()
                                            );
                                            if (relevantGauge && relevantGauge.pool.tokens) {
                                                return (
                                                    <TableRow key={alloc.gaugeAddress}>
                                                        <TableCell sx={{maxWidth: '10px'}}>
                                                            <Avatar
                                                                sx={{
                                                                    height: 20,
                                                                    width: 20
                                                                }}
                                                                src={networkLogoMap[Number(relevantGauge.network)]}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box style={{display: 'flex', alignItems: 'center'}}>
                                                                <PoolCurrencyLogo
                                                                    tokens={relevantGauge.pool.tokens.map((token) => ({
                                                                        address: token.address ? token.address.toLowerCase() : '',
                                                                    }))}
                                                                    size={'25px'}
                                                                />
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <GaugeComposition poolData={relevantGauge.pool}/>
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                type="number"
                                                                label="Weight"
                                                                size="small"
                                                                sx={{maxWidth: '90px', textAlign: 'right'}}
                                                                value={alloc.percentage}
                                                                onChange={(e) => handlePercentageChange(e, alloc)}
                                                                inputProps={{
                                                                    min: 0,
                                                                    max: 100,
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography>{formatDollarAmount(relevantGauge.valuePerVote, 3)}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography>{formatDollarAmount(alloc.rewardInUSD, 2)}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography>{alloc.isNew? 'New' : 'Current'}</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                            return null;
                                        })}
                                    </TableBody>
                                </Table>
                            </Card>
                        </Box>
                        <Box mr={1} mt={1}>
                            <HiddenHandCard/>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={11}>
                    <Grid
                        container
                        columns={{xs: 4, sm: 8, md: 12}}
                        sx={{justifyContent: {md: 'flex-start', xs: 'center'}, alignContent: 'center'}}
                    >
                    <Box mr={1}>
                        <Button
                            variant="contained"
                            onClick={() => updateVotes(allocations)}
                            disabled={
                            totalPercentage > 100}
                        >
                            Vote for Gauges
                        </Button>
                    </Box>
                    <Box mr={1}>
                        <Button variant="outlined" onClick={() => resetVotes()} disabled={!allocations.length}>
                            Clear Selection
                        </Button>
                    </Box>
                    </Grid>
                </Grid>

                <Grid item mt={1} xs={11}>
                    <Typography variant={'h6'}>
                        Gauge browser
                    </Typography>
                    <Typography variant={'body2'}>Browse and select gauges to earn voting incentives</Typography>
                </Grid>
                <Grid item xs={11}>
                    {fullyDecoratedGauges && fullyDecoratedGauges.length > 0 ?
                        <VotingTable
                            gaugeDatas={fullyDecoratedGauges}
                            userVeBal={userVeBAL}
                            allocations={allocations}
                            onAddAllocation={handleAddAllocation}/>
                        : <CircularProgress/>}
                </Grid>
            </Grid>

        </Box>
    );
}
