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
import GenericMetricsCard from "../../components/Cards/GenericMetricCard";
import LockClockIcon from "@mui/icons-material/LockClock";
import useDecorateGaugesWithVotes from "../../data/balancer/useDecorateGaugesWithVotes";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {useGetHHVotingIncentives} from "../../data/hidden-hand/useGetHHVotingIncentives";
import {decorateGaugesWithIncentives} from "../../data/hidden-hand/helpers";
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

export default function VeBALVoter() {

    //Load user wallet stats
    const {isConnected, address} = useAccount();
    const userLocks = useUserVeBALLocks();
    const userVeBAL = useGetUserVeBAL(address ? address.toLowerCase() : '');
    const hhIncentives = useGetHHVotingIncentives();

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
            if (isNaN(inputPercentage) || inputPercentage < 0 || inputPercentage > 100) {
                // Invalid input, set percentage to 0
                allocElement.percentage = 0;
            } else {
                // Valid input, update percentage
                allocElement.percentage = inputPercentage;
                allocElement.rewardInUSD = matchingHiddenHandData.totalValue / newVoteValue * userVeBAL * inputPercentage / 100 ;
                allocElement.userValuePerVote = matchingHiddenHandData.totalValue / newVoteValue
            }
            setAllocations([...allocations]);
        }
    };

    const calculateAverageValuePerVote = (gauges: BalancerStakingGauges[]) => {
        const totalRewards = gauges.reduce((sum, gauge) => sum + (gauge.totalRewards || 0), 0);
        const totalVotes = gauges.reduce((sum, gauge) => sum + (gauge.totalRewards ? gauge.voteCount : 0), 0);
        return totalRewards / totalVotes;
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
    }, [address, decoratedVotingGauges]);

    let fullyDecoratedGauges: BalancerStakingGauges[] = [];
    let averageValuePerVote = 0

    // TODO: improve logic, adjust hook?
    if (hhIncentives && hhIncentives.incentives && hhIncentives.incentives.data && decoratedVotingGauges && decoratedVotingGauges.length > 0) {
        fullyDecoratedGauges = decorateGaugesWithIncentives(decoratedVotingGauges, hhIncentives.incentives)
        averageValuePerVote = calculateAverageValuePerVote(fullyDecoratedGauges)
    }

    const prevAddress = useRef<`0x${string}` | undefined>(undefined);

    // Reset allocations array when the address changes
    useEffect(() => {
        if (prevAddress.current !== null && prevAddress.current !== address && allocations.length > 0) {
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
                const rewardInUSD = matchingGauge ? userVeBAL  * matchingGauge.valuePerVote : 0;
                return {
                    gaugeAddress: vote.address,
                    percentage: vote.userVotingPower ? vote.userVotingPower : 0,
                    rewardInUSD: rewardInUSD,
                    userValuePerVote: matchingGauge ? matchingGauge.valuePerVote  : 0,
                    isNew: false
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
                                    metricName={'Unlock Date'}
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
                        Voting Configuration
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
                                mainMetricInUSD={true}
                                mainMetricUnit={' $/veBAL'}
                                metricName={'Average Reward'}
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
                                            <TableCell>Effective $/veBAL</TableCell>
                                            <TableCell>Rewards</TableCell>
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
                            onClick={handleDialogOpen}
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
