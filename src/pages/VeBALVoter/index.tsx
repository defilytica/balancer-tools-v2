import Box from '@mui/material/Box';
import {
    Avatar,
    Button,
    Card,
    Grid,
    Table,
    TableBody,
    TableHead,
    TableRow,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions, alpha, CardContent,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import {useAccount} from "wagmi";
import {useUserVeBALLocks} from "../../data/balancer/useUserVeBALLocks";
import {useGetUserVeBAL} from "../../data/balancer/useGetUserVeBAL";
import useGetBalancerStakingGauges from "../../data/balancer/useGetBalancerStakingGauges"
import MetricsCard from "../../components/Cards/MetricsCard";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ScienceIcon from '@mui/icons-material/Science';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import GenericMetricsCard from "../../components/Cards/GenericMetricCard";
import LockClockIcon from "@mui/icons-material/LockClock";
import useDecorateGaugesWithVotes from "../../data/balancer/useDecorateGaugesWithVotes";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {useGetHHVotingIncentives} from "../../data/hidden-hand/useGetHHVotingIncentives";
import {decorateGaugesWithIncentives, decorateGaugesWithPaladinQuests} from "../../data/hidden-hand/helpers";
import {BalancerStakingGauges, PoolData} from "../../data/balancer/balancerTypes";
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
import {veBALVoteAddress} from "../../constants";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import {useGetPaladinQuests} from "../../data/paladin/useGetPaladinQuests";
import PaladinQuestsCard from "../../components/Cards/PaladinQuestsCard";
import VeBALVoterTipsCard from "../../components/Cards/VeBALVoterTipsCard";



const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert
        elevation={6}
        ref={ref}
        variant="filled"
        {...props} />;
});

function getCombinations<T>(array: T[], size: number): T[][] {
    // base cases
    if (size > array.length) return [];
    if (size === array.length) return [array];
    if (size === 1) return array.map(value => [value]);

    const result: T[][] = [];

    for (let i = 0; i < array.length; i++) {
        const current = array[i];
        const rest = array.slice(i + 1);
        const restCombinations = getCombinations(rest, size - 1);
        const joined = restCombinations.map(combination => [current, ...combination]);
        result.push(...joined);
    }

    return result;
}

function generateDistributions(totalVotes: number, numGauges: number): number[][] {
    if (numGauges === 1) {
        return [[totalVotes]];
    }
    const distributions = [];
    for (let i = 0; i <= totalVotes; i += 10) {
        const rest = totalVotes - i;
        const restDistributions = generateDistributions(rest, numGauges - 1);
        for (let distribution of restDistributions) {
            distributions.push([i, ...distribution]);
        }
    }
    return distributions;
}


export default function VeBALVoter() {

    //Load user wallet stats
    const {isConnected, address} = useAccount();
    const userLocks = useUserVeBALLocks();
    const userVeBAL = useGetUserVeBAL(address ? address.toLowerCase() : '');
    const hhIncentives = useGetHHVotingIncentives();
    const paladinIncentives = useGetPaladinQuests();
    //console.log("paladinIncentives", paladinIncentives)

    //States
    const [allocations, setAllocations] = useState<GaugeAllocation[]>([]);
    const [totalPercentage, setTotalPercentage] = useState<number>(0);
    const [open, setOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userVotingGauges, setUserVotingGauges] = useState<BalancerStakingGauges[]>([]);


    useEffect(() => {
        // reset state
        setAllocations([]);
        setTotalPercentage(0);
        setOpen(false);
        setAlertOpen(false);
        setError(null);
        setUserVotingGauges([])
    }, [address]);

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
            initialPercentage: 0,
            paladinValuePerVote: 0,
            paladinRewardInUSD: 0,
            paladinLeftVotes: 0,
        };
        setAllocations((prevAllocations) => [...prevAllocations, {...newAllocation}]);
    };

    const handleDialogOpen = () => {
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleAlertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
    };

    const handleOptimizoor = () => {
        //First reset all allocations to zero, also the currently active ones
        resetVotes();
        calculateOptimalAllocations()
    }


    const handlePercentageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, allocElement: GaugeAllocation) => {
        const inputPercentage = Number(event.target.value);
        const matchingHiddenHandData = hhIncentives?.incentives?.data?.find(data => data.proposal.toLowerCase() === allocElement.gaugeAddress.toLowerCase());
        const paladinQuest = paladinIncentives?.quests?.find(el => el.gauge.toLowerCase() === allocElement.gaugeAddress.toLowerCase());
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
            if (isNaN(inputPercentage) || inputPercentage < 0 || inputPercentage > 100) {
                // Invalid input, set percentage to 0
                allocElement.percentage = 0;
            } else {
                // Valid input, update percentage
                allocElement.percentage = inputPercentage;
                allocElement.rewardInUSD = matchingHiddenHandData.totalValue / newVoteValue * userVeBAL * inputPercentage / 100 ;
                allocElement.userValuePerVote = matchingHiddenHandData.totalValue / newVoteValue
            }
            // Paladin quest logic:
            if (paladinQuest && matchingHiddenHandData) {
                allocElement.percentage = inputPercentage
                //Calculate if the current percentage does fill the quest and use only that set for potential rewards
                const leftVotes =  Number(paladinQuest.objectiveVotes) - matchingHiddenHandData.voteCount
                const allocVotes = userVeBAL * inputPercentage

                if (leftVotes > 0 && (leftVotes - allocVotes) > 0) {
                    allocElement.paladinRewardInUSD = Number(paladinQuest.rewardPerVote)  * userVeBAL * inputPercentage / 100 ;
                }



            }

            setAllocations([...allocations]);
        } else {
            // handle deprecated gauges
            allocElement.percentage = inputPercentage;
            allocElement.rewardInUSD = 0;
            allocElement.userValuePerVote = 0;
            allocElement.paladinRewardInUSD = 0;
            setAllocations([...allocations]);
        }
    };

    const calculateAverageValuePerVote = (gauges: BalancerStakingGauges[]) => {
        const totalHiddenHandRewards = gauges.reduce((sum, gauge) => sum + (gauge.totalRewards || 0), 0);
        const totalPaladinRewards = gauges.reduce((sum, gauge) => sum + (gauge.paladinRewards?.valuePerVote || 0), 0);
        const totalVotes = gauges.reduce((sum, gauge) => sum + (gauge.paladinRewards ? gauge.voteCount : 0), 0);
        return (totalHiddenHandRewards + totalPaladinRewards) / totalVotes;
    };


    //Load gauge and Staking information
    const gaugeData = useGetBalancerStakingGauges();
    const decoratedVotingGauges = useDecorateGaugesWithVotes(gaugeData)
    const date = new Date(userLocks?.unlockTime ? userLocks?.unlockTime * 1000 : 0);
    const unlockDate = date.toLocaleDateString();

    // Update userVotingGauges when the address changes
    useEffect(() => {
        const updatedUserVotingGauges = decoratedVotingGauges.filter(
            (el) => el.userVotingPower ? el.userVotingPower > 0 : false
        );
        setUserVotingGauges(updatedUserVotingGauges);
    }, [address, JSON.stringify(decoratedVotingGauges)]);

    let fullyDecoratedGauges: BalancerStakingGauges[] = [];
    let averageValuePerVote = 0

    // TODO: improve logic, adjust hook?
    if (hhIncentives && hhIncentives.incentives
        && hhIncentives.incentives.data && decoratedVotingGauges
        && decoratedVotingGauges.length > 0) {
        fullyDecoratedGauges = decorateGaugesWithIncentives(decoratedVotingGauges, hhIncentives.incentives)

    }

    //Decorate Paladin quests
    if (paladinIncentives && paladinIncentives.quests && decoratedVotingGauges && decoratedVotingGauges.length > 0) {
        fullyDecoratedGauges = decorateGaugesWithPaladinQuests(fullyDecoratedGauges, paladinIncentives.quests)
        averageValuePerVote = calculateAverageValuePerVote(fullyDecoratedGauges)
    }


    const calculateOptimalAllocations = () => {
        const maxGauges = 10;
        //The max amount of allocations is 8 - length of existing gauges
        const maxAllocations = 6;

        let gauges = fullyDecoratedGauges.filter(g => g.valuePerVote !== null && g.valuePerVote !== undefined);
        gauges.sort((a, b) => b.valuePerVote - a.valuePerVote);
        gauges = gauges.slice(0, maxGauges);
        let existingAllocations = allocations.filter(a => !a.isNew);

        let bestTotalReward = 0;
        let bestAllocations: GaugeAllocation[] = [];

        for (let i = 1; i <= maxAllocations; i++) {
            let combinations = getCombinations(gauges, i);
            for (let combination of combinations) {
                let distributions = generateDistributions(100, combination.length);
                for (let distribution of distributions) {
                    let totalReward = 0;
                    let allocations: GaugeAllocation[] = [];
                    for (let j = 0; j < distribution.length; j++) {
                        if (combination[j] && ( combination[j]?.valuePerVote || combination[j]?.paladinRewards?.valuePerVote) && combination[j]?.address) {
                            //calculate user dilution:
                            let newVotes = userVeBAL * distribution[j] / 100;
                            let effectiveReward = combination[j].totalRewards / newVotes
                            let paladinReward = 0
                            let leftVotes = 0;
                            if (combination[j].paladinRewards && !combination[j].paladinRewards?.isQuestComplete) {
                                leftVotes = combination[j].paladinRewards?.leftVotes ?? 0;
                                if (newVotes < leftVotes) {
                                    paladinReward = combination[j].paladinRewards?.valuePerVote ?? 0;

                                }
                            }

                            let reward = distribution[j] * userVeBAL * effectiveReward/ 100;
                            let paladinQuestReward = distribution[j] * paladinReward * userVeBAL
                            totalReward += reward;
                            totalReward += paladinQuestReward;

                            // Check against existingAllocations instead of allocations
                            let isNew = !existingAllocations.some(a => a.gaugeAddress === combination[j].address);
                            let initialPercentage = isNew ? 0 : existingAllocations.find(a => a.gaugeAddress === combination[j].address)!.percentage;

                            allocations.push({
                                gaugeAddress: combination[j].address,
                                percentage: distribution[j],
                                rewardInUSD: reward,
                                userValuePerVote: effectiveReward,
                                isNew,
                                initialPercentage,
                                paladinValuePerVote: paladinReward,
                                paladinRewardInUSD: paladinQuestReward,
                                paladinLeftVotes: leftVotes,
                            });
                        }
                    }
                    if (totalReward > bestTotalReward) {
                        bestTotalReward = totalReward;
                        bestAllocations = allocations;
                    }
                }
            }
        }

        // Append existing allocations to the best allocations if not present already
        existingAllocations.forEach(existingAllocation => {
            if (!bestAllocations.some(a => a.gaugeAddress === existingAllocation.gaugeAddress)) {
                bestAllocations.push({
                    ...existingAllocation,
                    percentage: 0,
                    rewardInUSD: 0,
                    userValuePerVote: 0,
                    paladinRewardInUSD: 0,
                    paladinValuePerVote: 0,
                });
            }
        });

        setAllocations(bestAllocations);
    };




    const prevAddress = useRef<`0x${string}` | undefined>(undefined);

    // Reset allocations array when the address changes
    useEffect(() => {
        if ((prevAddress.current !== address || prevAddress.current === undefined) && allocations.length > 0) {
            setAllocations([]);
            window.location.reload();
            console.log("new address found, reloading component!")
        }
        prevAddress.current = address;
    }, [address, allocations]);

    // Map out active user votes
    useEffect(() => {
        //For the initial load we can take the currently active valuePerVote as a baseline as the user doesn't dilute its vote
        if (userVotingGauges.length > 0 && allocations.length === 0 && fullyDecoratedGauges.length > 0) {
            const newAllocations = userVotingGauges.map((vote) => {
                const matchingGauge = fullyDecoratedGauges.find((gauge) => gauge.address === vote.address);
                const votePower = vote.userVotingPower ? vote.userVotingPower / 100 : 0;
                const rewardInUSD = matchingGauge ? userVeBAL  * votePower * matchingGauge.valuePerVote : 0;
                return {
                    gaugeAddress: vote.address,
                    percentage: vote.userVotingPower ? vote.userVotingPower : 0,
                    rewardInUSD: rewardInUSD,
                    userValuePerVote: matchingGauge ? (matchingGauge.valuePerVote ? matchingGauge.valuePerVote : 0)  : 0,
                    isNew: false,
                    initialPercentage: 0,
                    paladinValuePerVote: 0,
                    paladinRewardInUSD: 0,
                    paladinLeftVotes: 0,
                };
            });
            setAllocations([...newAllocations]);
        }
    }, [userVotingGauges, allocations, userVeBAL, address, fullyDecoratedGauges]);


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
        const erc20 = new ethers.Contract(veBALVoteAddress, VeBalVoteMany, signer);

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

        try {
            const tx = await erc20.vote_for_many_gauge_weights(addresses, weights);
            console.log("Transaction sent: ", tx.hash);
        } catch(error: any) {
            console.log(error.reason)
            setError(error.reason)
            setAlertOpen(true)
        }
    }

    // Reset voting state
    const resetVotes = () => {
        const newAllocations = userVotingGauges.map((vote) => {
            const matchingGauge = fullyDecoratedGauges.find((gauge) => gauge.address === vote.address);
            const rewardInUSD = (matchingGauge && vote.userVotingPower) ? ((vote.userVotingPower / 100) * matchingGauge.valuePerVote * userVeBAL) : 0;
            const paladinRewardInUSD = (matchingGauge && vote.userVotingPower && matchingGauge.paladinRewards) ? ((vote.userVotingPower / 100) * matchingGauge.paladinRewards.valuePerVote * userVeBAL) : 0;

            return {
                gaugeAddress: vote.address,
                percentage: vote.userVotingPower ? vote.userVotingPower : 0,
                rewardInUSD: rewardInUSD,
                userValuePerVote: matchingGauge ? matchingGauge.valuePerVote : 0,
                isNew: false,
                initialPercentage: 0,
                paladinValuePerVote: (matchingGauge && matchingGauge.paladinRewards) ? matchingGauge.paladinRewards.valuePerVote : 0,
                paladinRewardInUSD: paladinRewardInUSD,
                paladinLeftVotes: 0,
            };
        });
        setAllocations([...newAllocations]);
    }

    return (
         !isConnected ?
             <Box
                 sx={{
                     flexGrow: 2,
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
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
                        Please connect your Wallet
                    </Typography>
                </Box>
            </CardContent>
            </Card>
        </Box> :
        <Box key={address? address.toLowerCase() : 'veBAL'} sx={{flexGrow: 2}}>
            <Grid
                container
                spacing={2}
                sx={{justifyContent: 'center'}}
            >

                <Grid item mt={1} xs={11} md={9}>
                    <Typography variant={'h5'}>
                        veBAL Multi-Voter Tool
                    </Typography>
                </Grid>
                <Grid item mt={1} xs={11} md={9}>
                    <Grid
                        container
                        columns={{xs: 4, sm: 8, md: 12}}
                        sx={{justifyContent: {md: 'space-between', xs: 'center'}, alignContent: 'center'}}
                    >
                        <Box mr={1} mt={1}>
                            <HiddenHandCard/>
                        </Box>
                        <Box mr={1} mt={1}>
                            <PaladinQuestsCard />
                        </Box>
                    </Grid>
                </Grid>
                {isConnected ?
                    <Grid item xs={11} md={9}>
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
                                    metricName={'Unlock Date'}
                                    MetricIcon={LockClockIcon}
                                />
                            </Box>
                        </Grid>
                    </Grid> :
                    <Grid item mt={1} xs={11} md={9}>
                        <Box mr={0.5} mt={0.5}>
                            <GenericMetricsCard mainMetric={'-'} metricName={'No wallet connected'}
                                                MetricIcon={AccountBalanceWalletIcon}/>
                        </Box>
                    </Grid>
                }

                <Grid item mt={1} xs={11} md={9}>
                    <Typography variant={'h6'}>
                        Voting Configuration
                    </Typography>

                </Grid>
                <Grid item xs={11} md={9}>
                    <Grid
                        container
                        columns={{xs: 4, sm: 8, md: 12}}
                        sx={{justifyContent: {md: 'flex-start', xs: 'center'}, alignContent: 'center'}}
                    >
                        <Box mr={0.5} mt={0.5}>
                            <MetricsCard
                                mainMetric={allocations.reduce((sum, allocation) => sum + allocation.rewardInUSD + allocation.paladinRewardInUSD, 0)}
                                mainMetricInUSD={true}
                                metricName={'Potential Reward'}
                                MetricIcon={MonetizationOnIcon}
                            />
                        </Box>
                        <Box mr={0.5} mt={0.5}>
                            <MetricsCard
                                mainMetric={averageValuePerVote}
                                mainMetricInUSD={true}
                                mainMetricUnit={' $/veBAL'}
                                metricName={'Average Reward'}
                                MetricIcon={MonetizationOnIcon}
                            />
                        </Box>
                    </Grid>

                </Grid>
                <Grid item xs={11} md={9}>
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
                                            <TableCell>HH Effective $/veBAL</TableCell>
                                            <TableCell>HH Rewards</TableCell>
                                            <TableCell>Paladin Rewards</TableCell>
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
                                                                    step: 0.01,
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography>{formatDollarAmount(alloc.userValuePerVote, 3)}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography>{formatDollarAmount(alloc.rewardInUSD, 2)}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography>{formatDollarAmount(alloc.paladinRewardInUSD, 2)}</Typography>
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

                    </Grid>
                </Grid>
                <Grid item xs={11} md={9}>
                    <Grid
                        container
                        columns={{xs: 4, sm: 8, md: 12}}
                        sx={{justifyContent: {md: 'flex-start', xs: 'center'}, alignContent: 'center'}}
                    >
                    <Box mr={1}>
                        <Button
                            variant="contained"
                            onClick={handleDialogOpen}
                            endIcon={<HowToVoteIcon />}
                            disabled={
                            totalPercentage > 100}
                        >
                            Vote for Gauges
                        </Button>

                    </Box>
                            <Box mr={1}>
                                <Button variant="contained" endIcon={<ScienceIcon />} onClick={() => handleOptimizoor()} disabled={!allocations.length}>
                                    Incentive Optimizoor
                                </Button>
                            </Box>
                    <Box mr={1}>
                        <Button variant="outlined" onClick={() => resetVotes()} disabled={!allocations.length}>
                            Clear Selection
                        </Button>
                    </Box>
                    </Grid>
                </Grid>
                <Grid item xs={11} md={9}>
                    <Box>
                        <VeBALVoterTipsCard />
                    </Box>
                </Grid>

                <Grid item mt={1} xs={11} md={9}>
                    <Typography variant={'h6'}>
                        Gauge browser
                    </Typography>
                    <Typography variant={'body2'}>Browse and select gauges to earn voting incentives</Typography>
                </Grid>
                <Grid item xs={11} md={9}>
                    {fullyDecoratedGauges && fullyDecoratedGauges.length > 0 ?
                        <VotingTable
                            gaugeDatas={fullyDecoratedGauges}
                            userVeBal={userVeBAL}
                            allocations={allocations}
                            onAddAllocation={handleAddAllocation}/>
                        : <CircularProgress/>}
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleDialogClose}>
                <DialogTitle>Experimental Transaction</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Executing this transaction is experimental and at your discretion. Proceed with caution.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={() => {
                        updateVotes(allocations)
                        handleDialogClose()
                    }} color="primary" variant="contained">
                        Proceed
                    </Button>
                </DialogActions>
            </Dialog>
            {error &&
                <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
                    <Alert
                        onClose={handleAlertClose}
                        severity="error"
                        sx={{
                            width: '100%',
                            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.8),
                    }}>
                        {error}
                    </Alert>
                </Snackbar>
            }
        </Box>
    );
}
