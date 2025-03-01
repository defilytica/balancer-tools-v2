import Box from '@mui/material/Box';
import {
    alpha,
    Avatar,
    Backdrop,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid, IconButton,
    Table,
    TableBody,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import {useAccount} from "wagmi";
import {useUserVeBALLocks} from "../../data/balancer/useUserVeBALLocks";
import {useGetUserVeBAL} from "../../data/balancer/useGetUserVeBAL";
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
import {BalancerStakingGauges} from "../../data/balancer/balancerTypes";
import VotingTable from '../../components/Tables/VotingTable';
import PoolCurrencyLogo from "../../components/PoolCurrencyLogo";
import GaugeComposition from "../../components/GaugeComposition";
import TextField from "@mui/material/TextField";
import {GaugeAllocation} from '../../data/balancer/balancerGaugeTypes'
import {ethers} from "ethers";
import VeBalVoteMany from '../../constants/abis/veBALVoteMany.json'
import {formatDollarAmount, formatPercentageAmount} from "../../utils/numbers";
import TableCell from "@mui/material/TableCell";
import HiddenHandCard from "../../components/Cards/HiddenHandCard";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ArbitrumLogo from '../../assets/svg/arbitrum.svg'
import EtherLogo from '../../assets/svg/ethereum.svg'
import PolygonLogo from '../../assets/svg/polygon.svg'
import GnosisLogo from '../../assets/svg/gnosis.svg'
import zkevmLogo from '../../assets/svg/zkevm.svg'
import OpLogo from '../../assets/svg/optimism.svg'
import AvaxLogo from '../../assets/svg/avalancheLogo.svg'
import BaseLogo from '../../assets/svg/base.svg'
import {veBALVoteAddress} from "../../constants";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import {useGetPaladinQuests} from "../../data/paladin/useGetPaladinQuests";
import PaladinQuestsCard from "../../components/Cards/PaladinQuestsCard";
import VeBALVoterTipsCard from "../../components/Cards/VeBALVoterTipsCard";
import Confetti from 'react-dom-confetti';
import useGetBalancerV3StakingGauges from "../../data/balancer-api-v3/useGetBalancerV3StakingGauges";
import CloseIcon from '@mui/icons-material/Close';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import VoteMarketCard from "../../components/Cards/VoteMarketCard";

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

interface OptimizationParams {
    maxGauges: number;
    maxAllocations: number;
    stepSize: number;
    minAllocation: number;
}

const DEFAULT_PARAMS: OptimizationParams = {
    maxGauges: 10,      // Maximum number of gauges to consider
    maxAllocations: 8,  // Maximum number of active allocations
    stepSize: 5,        // Step size for percentage allocations
    minAllocation: 5    // Minimum allocation percentage
};

function generateDistributions(
    totalVotes: number,
    numGauges: number,
    stepSize: number = 10,
    minAllocation: number = 0
): number[][] {
    if (numGauges <= 0) return [];
    if (numGauges === 1) return [[totalVotes]];

    const distributions: number[][] = [];

    // Calculate the maximum value for the first gauge
    const maxForFirst = totalVotes - (minAllocation * (numGauges - 1));

    // Iterate through possible values for the first gauge
    for (let i = minAllocation; i <= maxForFirst; i += stepSize) {
        const remaining = totalVotes - i;

        // Only continue if there's enough remaining for minimum allocations
        if (remaining >= minAllocation * (numGauges - 1)) {
            const subDistributions = generateDistributions(
                remaining,
                numGauges - 1,
                stepSize,
                minAllocation
            );

            for (const dist of subDistributions) {
                distributions.push([i, ...dist]);
            }
        }
    }

    // Filter out invalid distributions
    return distributions.filter(dist =>
        dist.length === numGauges &&
        dist.every(v => v >= minAllocation) &&
        Math.abs(dist.reduce((a, b) => a + b, 0) - totalVotes) < 0.01
    );
}

export default function VeBALVoter() {

    const config = {
        angle: 70,
        spread: 202,
        startVelocity: 40,
        elementCount: 70,
        dragFriction: 0.12,
        duration: 3000,
        stagger: 3,
        width: "12px",
        height: "18px",
        perspective: "500px",
        colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
    };

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
    const [showConfetti, setShowConfetti] = useState(false);
    const [loadOptimize, setLoadOptimize] = useState(false);
    const [paladinAlert, setPaladinAlert] = useState(true);


    useEffect(() => {
        // reset state
        setAllocations([]);
        setTotalPercentage(0);
        setOpen(false);
        setAlertOpen(false);
        setError(null);
        setUserVotingGauges([])
    }, [address]);

    interface NetworkLogoMap {
        [networkNumber: string]: string;
    }

    const networkLogoMap: NetworkLogoMap = {
        MAINNET: EtherLogo,
        OPTIMISM: OpLogo,
        POLYGON: PolygonLogo,
        GNOSIS: GnosisLogo,
        ARBITRUM: ArbitrumLogo,
        ZKEVM: zkevmLogo,
        BASE: BaseLogo,
        AVALANCHE: AvaxLogo,
    };

    const networkStringMap: NetworkLogoMap = {
        MAINNET: "Ethereum",
        OPTIMISM: "Optimism",
        POLYGON: "Polygon",
        GNOSIS: "Gnosis",
        ARBITRUM: "Arbitrum",
        ZKEVM: "zkEVM",
        BASE: "Base",
        AVALANCHE: "Avalanche",
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

    const handlePaladinAlertClose = () => {
        setPaladinAlert(false);
    };

    const handleDialogOpen = () => {
        setOpen(true);

    };

    const handleBackDropClose = () => {
        //Option to reset backdrop
        setLoadOptimize(false)
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
        setLoadOptimize(true)
        setTimeout(() => calculateOptimalAllocations(), 500);


    }

    const handleConfetti = () => {
        setShowConfetti(true);
        // Optionally, you can turn off the confetti after a few seconds
        setTimeout(() => setShowConfetti(false), 500);
    };


    const handlePercentageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, allocElement: GaugeAllocation) => {
        const inputPercentage = Number(event.target.value);
        const matchingHiddenHandData = hhIncentives?.incentives?.data?.find(data => data.proposal.toLowerCase() === allocElement.gaugeAddress.toLowerCase());
        const paladinQuest = paladinIncentives?.quests?.find(el => el.gauge.toLowerCase() === allocElement.gaugeAddress.toLowerCase());

        if (matchingHiddenHandData) {
            const currentVoteValue = fullyDecoratedGauges.find(gauge => gauge.address === allocElement.gaugeAddress)?.voteCount ?? 0;
            const currentUserVoteAllocation = userVeBAL * (allocElement.previousUserPercentage ?? 0) / 100;
            const newUserVoteAllocation = userVeBAL * inputPercentage / 100;
            const newVoteValue = currentVoteValue - currentUserVoteAllocation + newUserVoteAllocation;

            const updatedGauge = fullyDecoratedGauges.find(gauge => gauge.address === allocElement.gaugeAddress);
            if (updatedGauge) {
                updatedGauge.voteCount = newVoteValue;
                updatedGauge.valuePerVote = matchingHiddenHandData.totalValue / newVoteValue;
            }

            fullyDecoratedGauges = fullyDecoratedGauges.map(gauge => {
                if (gauge.address === allocElement.gaugeAddress && updatedGauge) return updatedGauge;
                return gauge;
            });

            allocElement.percentage = isNaN(inputPercentage) || inputPercentage < 0 || inputPercentage > 100 ? 0 : inputPercentage;
            allocElement.rewardInUSD = matchingHiddenHandData.totalValue / newVoteValue * userVeBAL * inputPercentage / 100;
            allocElement.userValuePerVote = matchingHiddenHandData.totalValue / newVoteValue;

            if (paladinQuest) {
                allocElement.percentage = inputPercentage;
                const leftVotes = Number(paladinQuest.objectiveVotes) / 1e18 - matchingHiddenHandData.voteCount - userVeBAL * inputPercentage / 100;
                if (leftVotes > 0) {
                    allocElement.paladinRewardInUSD = Number(paladinQuest.rewardPerVote) * userVeBAL * inputPercentage / 100;
                }
                allocElement.paladinLeftVotes = leftVotes;
            }

            setAllocations([...allocations]);
        } else {
            allocElement.percentage = inputPercentage;
            allocElement.rewardInUSD = 0;
            allocElement.userValuePerVote = 0;
            allocElement.paladinRewardInUSD = 0;
            setAllocations([...allocations]);
        }
    };

    const calculateAverageValuePerVote = (gauges: BalancerStakingGauges[]) => {
        const totalHiddenHandRewards = gauges.reduce((sum, gauge) => sum + (gauge.totalRewards || 0), 0);
        //const totalVotes = gauges.reduce((sum, gauge) => sum + (gauge.paladinRewards ? gauge.voteCount : 0), 0);
        const totalVotes = gauges.reduce((sum, gauge) => sum + gauge.voteCount, 0)
        return totalHiddenHandRewards / totalVotes;
    };

    const gaugeData = useGetBalancerV3StakingGauges();
    const decoratedVotingGauges = useDecorateGaugesWithVotes(gaugeData);
    const date = new Date(userLocks?.unlockTime ? userLocks?.unlockTime * 1000 : 0);
    const unlockDate = date.toLocaleDateString();

    useEffect(() => {
        const updatedUserVotingGauges = decoratedVotingGauges.filter(
            (el) => el.userVotingPower ? el.userVotingPower > 0 : false
        );
        setUserVotingGauges(updatedUserVotingGauges);
    }, [address, JSON.stringify(decoratedVotingGauges)]);

    let fullyDecoratedGauges: BalancerStakingGauges[] = [];
    let averageValuePerVote = 0;

    if (hhIncentives && hhIncentives.incentives && hhIncentives.incentives.data && decoratedVotingGauges && decoratedVotingGauges.length > 0) {
        fullyDecoratedGauges = decorateGaugesWithIncentives(decoratedVotingGauges, hhIncentives.incentives);
    }

    if (decoratedVotingGauges && decoratedVotingGauges.length > 0) {
        //fullyDecoratedGauges = decorateGaugesWithPaladinQuests(fullyDecoratedGauges, paladinIncentives.quests);
        averageValuePerVote = calculateAverageValuePerVote(fullyDecoratedGauges);
    }

    function calculateOptimalAllocations() {
        const params = {
            maxGauges: 10,      // Maximum number of gauges to consider
            maxAllocations: 8,  // Maximum number of active allocations
            stepSize: 10,       // Step size for percentage allocations
            minAllocation: 5    // Minimum allocation percentage
        };

        // Get existing allocations and their positions
        const existingAllocations = allocations.filter(a => !a.isNew);
        const existingAddresses = new Set(existingAllocations.map(a => a.gaugeAddress.toLowerCase()));

        // Filter and sort gauges by potential value, excluding existing allocations
        let candidateGauges = fullyDecoratedGauges
            .filter(g => !g.isKilled &&
                g.valuePerVote !== null &&
                g.valuePerVote !== undefined &&
                !existingAddresses.has(g.address.toLowerCase()))
            .sort((a, b) => (b.valuePerVote + (b.paladinRewards?.valuePerVote || 0)) -
                (a.valuePerVote + (a.paladinRewards?.valuePerVote || 0)));

        // Take top N candidate gauges for optimization
        candidateGauges = candidateGauges.slice(0, params.maxGauges - existingAllocations.length);

        let bestTotalReward = 0;
        let bestAllocations: GaugeAllocation[] = existingAllocations.map(ea => ({
            ...ea,
            percentage: 0,
            rewardInUSD: 0,
            userValuePerVote: 0,
            paladinRewardInUSD: 0,
            paladinValuePerVote: 0,
            paladinLeftVotes: 0
        }));

        // Helper function to calculate rewards
        function calculateRewards(gauge: BalancerStakingGauges, percentage: number): {
            hhReward: number;
            paladinReward: number;
            valuePerVote: number;
            paladinValuePerVote: number;
        } {
            const newVotes = gauge.voteCount + (userVeBAL * percentage / 100);
            const hhValuePerVote = gauge.totalRewards / newVotes;
            let paladinValuePerVote = 0;
            let paladinReward = 0;

            if (gauge.paladinRewards) {
                const leftVotes = Number(gauge.paladinRewards.leftVotes) / 1e18;
                if (newVotes < leftVotes) {
                    paladinValuePerVote = gauge.paladinRewards.valuePerVote;
                    paladinReward = paladinValuePerVote * userVeBAL * percentage / 100;
                }
            }

            const hhReward = hhValuePerVote * userVeBAL * percentage / 100;

            return {
                hhReward,
                paladinReward,
                valuePerVote: hhValuePerVote,
                paladinValuePerVote
            };
        }

        // Generate all valid combinations of new gauges
        const maxNewGauges = params.maxAllocations - existingAllocations.length;
        for (let numNewGauges = 0; numNewGauges <= maxNewGauges; numNewGauges++) {
            const combinations = getCombinations(candidateGauges, numNewGauges);

            for (const newGaugeCombination of combinations) {
                // Combine existing and new gauges while preserving order
                const combinedGauges = [...existingAllocations.map(a =>
                    fullyDecoratedGauges.find(g => g.address.toLowerCase() === a.gaugeAddress.toLowerCase())
                ).filter(Boolean), ...newGaugeCombination];

                // Generate percentage distributions
                const distributions = generateDistributions(
                    100,
                    combinedGauges.length,
                    params.stepSize,
                    params.minAllocation
                );

                for (const distribution of distributions) {
                    let totalReward = 0;
                    let tempAllocations: GaugeAllocation[] = [];
                    let isValidDistribution = true;

                    for (let j = 0; j < combinedGauges.length; j++) {
                        const gauge = combinedGauges[j];
                        const percentage = distribution[j];

                        if (!gauge || !gauge.address) {
                            isValidDistribution = false;
                            break;
                        }

                        const {
                            hhReward,
                            paladinReward,
                            valuePerVote,
                            paladinValuePerVote
                        } = calculateRewards(gauge, percentage);

                        totalReward += hhReward + paladinReward;

                        const isExisting = j < existingAllocations.length;

                        tempAllocations.push({
                            gaugeAddress: gauge.address,
                            percentage,
                            rewardInUSD: hhReward,
                            userValuePerVote: valuePerVote,
                            isNew: !isExisting,
                            initialPercentage: isExisting ? existingAllocations[j].percentage : 0,
                            paladinValuePerVote,
                            paladinRewardInUSD: paladinReward,
                            paladinLeftVotes: gauge.paladinRewards?.leftVotes ?? 0
                        });
                    }

                    if (!isValidDistribution) continue;

                    // Update best allocations if we found a better total reward
                    if (totalReward > bestTotalReward) {
                        bestTotalReward = totalReward;

                        // Preserve existing allocation positions
                        bestAllocations = existingAllocations.map((existing, index) => {
                            const matchingTemp = tempAllocations[index];
                            return {
                                ...existing,
                                percentage: matchingTemp.percentage,
                                rewardInUSD: matchingTemp.rewardInUSD,
                                userValuePerVote: matchingTemp.userValuePerVote,
                                paladinRewardInUSD: matchingTemp.paladinRewardInUSD,
                                paladinValuePerVote: matchingTemp.paladinValuePerVote,
                                paladinLeftVotes: matchingTemp.paladinLeftVotes
                            };
                        });

                        // Add new allocations after existing ones
                        const newAllocations = tempAllocations.slice(existingAllocations.length);
                        bestAllocations.push(...newAllocations);
                    }
                }
            }
        }

        // Ensure we don't exceed maxAllocations while preserving order
        bestAllocations = bestAllocations.slice(0, params.maxAllocations);

        setAllocations(bestAllocations);
        setLoadOptimize(false);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 500);
    }

    const prevAddress = useRef<string | undefined>(undefined);

    useEffect(() => {
        if ((prevAddress.current !== address || prevAddress.current === undefined) && allocations.length > 0) {
            setAllocations([]);
            window.location.reload();
        }
        prevAddress.current = address;
    }, [address, allocations]);

    useEffect(() => {
        if (userVotingGauges.length > 0 && allocations.length === 0 && fullyDecoratedGauges.length > 0) {
            const newAllocations = userVotingGauges.map((vote) => {
                const matchingGauge = fullyDecoratedGauges.find((gauge) => gauge.address === vote.address);
                const leftVotes = matchingGauge ? (matchingGauge.paladinRewards ? matchingGauge.paladinRewards.leftVotes : 0) : 0;
                const votePower = vote.userVotingPower ? vote.userVotingPower / 100 : 0;
                const rewardInUSD = matchingGauge ? userVeBAL * votePower * matchingGauge.valuePerVote : 0;
                return {
                    gaugeAddress: vote.address,
                    percentage: vote.userVotingPower ? vote.userVotingPower : 0,
                    rewardInUSD: rewardInUSD,
                    userValuePerVote: matchingGauge ? (matchingGauge.valuePerVote ? matchingGauge.valuePerVote : 0) : 0,
                    isNew: false,
                    initialPercentage: 0,
                    paladinValuePerVote: 0,
                    paladinRewardInUSD: 0,
                    paladinLeftVotes: leftVotes,
                    previousUserPercentage: vote.userVotingPower ? vote.userVotingPower : 0,
                };
            });
            setAllocations([...newAllocations]);
        }
    }, [JSON.stringify(userVotingGauges), allocations, userVeBAL, address, fullyDecoratedGauges]);

    useEffect(() => {
        const newPercentage = allocations.reduce((sum, allocation) => sum + allocation.percentage, 0);
        setTotalPercentage(newPercentage);
    }, [allocations, address]);

    async function updateVotes(allocations: GaugeAllocation[]) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const erc20 = new ethers.Contract(veBALVoteAddress, VeBalVoteMany, signer);

        const sortedAllocations = [...allocations].sort((a, b) => {
            if (a.percentage === 0 && b.percentage !== 0) return -1;
            if (a.percentage !== 0 && b.percentage === 0) return 1;
            return 0;
        });

        const addresses = Array(8)
            .fill("0x0000000000000000000000000000000000000000")
            .map((_, index) =>
                index < sortedAllocations.length
                    ? sortedAllocations[index].gaugeAddress.slice(2, 42)
                    : "0x0000000000000000000000000000000000000000"
            );

        // Fix: Round the weights to integers to avoid floating point precision issues
        const weights = Array(8)
            .fill(0)
            .map((_, index) =>
                index < sortedAllocations.length
                    ? Math.round(sortedAllocations[index].percentage * 100)
                    : 0
            );

        try {
            const tx = await erc20.vote_for_many_gauge_weights(addresses, weights);
            console.log("Transaction sent: ", tx.hash);
        } catch (error: any) {
            setError(error.reason);
            setAlertOpen(true);
        }
    }

    const resetVotes = () => {
        const newAllocations = userVotingGauges.map((vote) => {
            const matchingGauge = fullyDecoratedGauges.find((gauge) => gauge.address === vote.address);
            const rewardInUSD = (matchingGauge && vote.userVotingPower)
                ? ((vote.userVotingPower / 100) * matchingGauge.valuePerVote * userVeBAL)
                : 0;
            const paladinRewardInUSD = (matchingGauge && vote.userVotingPower && matchingGauge.paladinRewards)
                ? ((vote.userVotingPower / 100) * matchingGauge.paladinRewards.valuePerVote * userVeBAL)
                : 0;

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
                previousUserPercentage: vote.userVotingPower ? vote.userVotingPower : 0,
            };
        });
        setAllocations([...newAllocations]);
    };

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
                        <SelfImprovementIcon sx={{fontSize: 48}}/>
                        <Typography variant="h5" align="center">
                            Please connect your Wallet
                        </Typography>
                    </Box>
                </CardContent>
                </Card>
            </Box> :
            fullyDecoratedGauges && fullyDecoratedGauges.length > 0 ?
                <Box key={address ? address.toLowerCase() : 'veBAL'} sx={{flexGrow: 2}}>
                    {paladinAlert && (
                        <Alert
                            severity="info"
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={handlePaladinAlertClose}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            Paladin Quests are still disabled. Make sure to check open quests and dynamic APRs on their UI for optimized rewards.
                        </Alert>
                    )}
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
                            <Typography variant={'h6'}>
                                Voting Markets
                            </Typography>
                        </Grid>
                        <Grid item mt={1} xs={11} md={9}>
                            <Grid
                                container
                                columns={{xs: 4, sm: 8, md: 12}}
                                sx={{justifyContent: {md: 'space-between', xs: 'center'}, alignContent: 'center'}}
                            >
                                <Box   maxWidth="350px">
                                    <HiddenHandCard/>
                                </Box>
                                <Box   maxWidth="350px">
                                    <PaladinQuestsCard/>
                                </Box>
                                <Box   maxWidth="350px">
                                    <VoteMarketCard/>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid item mt={1} xs={11} md={9}>
                            <Typography variant={'h6'}>
                                Connected Wallet Stats
                            </Typography>
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
                                <Box sx={{ width: '100%', mt: 1, mr: 1  }}>
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
                                                    { /* <TableCell>Paladin Rewards</TableCell> */}
                                                    { /*  <TableCell>Open Paladin Quest Votes</TableCell> */}
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
                                                                        src={networkLogoMap[relevantGauge.network]}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box
                                                                        style={{display: 'flex', alignItems: 'center'}}>
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
                                                                        sx={{
                                                                            minWidth: '70px',
                                                                            maxWidth: '90px',
                                                                            textAlign: 'right'
                                                                        }}
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
                                                                { /*
                                                        <TableCell>
                                                            <Typography>{formatDollarAmount(alloc.paladinRewardInUSD, 2)}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography>{formatNumber(alloc.paladinLeftVotes, 0)}</Typography>
                                                        </TableCell>
                                                        */}
                                                                <TableCell>
                                                                    {relevantGauge.isKilled ?
                                                                        <Typography variant={"caption"}
                                                                                    color={'red'}>Killed</Typography> : null
                                                                    }

                                                                    <Typography>{alloc.isNew ? 'New' : 'Current'}</Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {alloc.isNew && (
                                                                        <Button
                                                                            variant="contained"
                                                                            onClick={() => {
                                                                                const updatedAllocations = allocations.filter((item) => item.gaugeAddress !== alloc.gaugeAddress);
                                                                                setAllocations(updatedAllocations);
                                                                            }}
                                                                            endIcon={<RemoveCircleOutlineIcon />}
                                                                        >
                                                                            Remove
                                                                        </Button>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                                <TableRow>
                                                    <TableCell> </TableCell>
                                                    <TableCell> </TableCell>
                                                    <TableCell>
                                                        <Typography fontWeight={'bold'}>
                                                            Totals
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography fontWeight={'bold'}>
                                                            {formatPercentageAmount(totalPercentage)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell> </TableCell>
                                                    { /*
                                            <TableCell>
                                                <Typography fontWeight={'bold'}>
                                                    {formatDollarAmount(allocations.reduce((sum, allocation) => sum + allocation.rewardInUSD, 0), 2)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography fontWeight={'bold'}>
                                                    {formatDollarAmount(allocations.reduce((sum, allocation) => sum + allocation.paladinRewardInUSD, 0), 2)}
                                                </Typography>
                                                </TableCell>
                                                */}
                                                    <TableCell> </TableCell>
                                                    <TableCell> </TableCell>
                                                </TableRow>

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
                                        endIcon={<HowToVoteIcon/>}
                                        disabled={
                                            totalPercentage > 100}
                                    >
                                        Vote for Gauges
                                    </Button>
                                </Box>
                                <Box mr={1}>
                                    <Button variant="contained" endIcon={<ScienceIcon/>}
                                            onClick={() => handleOptimizoor()} disabled={!allocations.length}>
                                        Incentive Optimizoor
                                        <Confetti active={showConfetti} config={config}/>
                                    </Button>
                                </Box>

                                <Box mr={1}>
                                    <Button variant="outlined" onClick={() => resetVotes()}
                                            disabled={!allocations.length}>
                                        Clear Selection
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid item xs={11} md={9}>
                            <Box>
                                <VeBALVoterTipsCard/>
                            </Box>
                        </Grid>

                        <Grid item mt={1} xs={11} md={9}>
                            <Typography variant={'h6'}>
                                Gauge browser
                            </Typography>
                            <Typography variant={'body2'}>Browse and select gauges to earn voting
                                incentives</Typography>
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
                    <Grid><Box mt={6}></Box></Grid>
                    <Dialog open={open} onClose={handleDialogClose}>
                        <DialogTitle>Confirm Transaction</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                By executing this transaction, you acknowledge that you are acting at your own
                                discretion.
                                All decisions made using this tool are your sole responsibility,
                                and you assume all risks associated with such actions.
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
                                Transaction error: {error}
                            </Alert>
                        </Snackbar>
                    }
                    <Backdrop
                        sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                        open={loadOptimize}
                        onClick={handleBackDropClose}
                    >
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <CircularProgress color="inherit"/>
                            <Typography>Computing best allocation set...</Typography>
                        </Box>
                    </Backdrop>
                </Box> : <Box
                    sx={{
                        flexGrow: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh'
                    }}
                ><CircularProgress/> </Box>
    );
}
