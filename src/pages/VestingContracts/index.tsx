import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import {
    Box, Card,
    FormControl,
    Grid,
    InputLabel, Link,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import ABI from '../../constants/abis/maxis-vester.json'
import AuraCompounderABI from '../../constants/abis/auraCompounder.json'
import {formatAmount, formatDollarAmount} from "../../utils/numbers";
import useGetSimpleTokenPrices from "../../data/balancer-api-v3/useGetSimpleTokenPrices";
import CoinCard from "../../components/Cards/CoinCard";
import CircularProgress from "@mui/material/CircularProgress";
import {ContractCallContext, ContractCallResults, Multicall} from "ethereum-multicall";
import {getEtherscanLink} from "../../utils";
import {ArbitrumNetworkInfo} from "../../constants/networks";
import LaunchIcon from "@mui/icons-material/Launch";
import VestingChart from "../../components/Echarts/VestingPositions/VestingPosition";

const CONTRACTS_URL = 'https://raw.githubusercontent.com/BalancerMaxis/bal_addresses/main/extras/arbitrum.json';

interface ContractData {
    [key: string]: string;
}

interface VestingPositionData {
    amount: ethers.BigNumber;
    vestingEnds: number;
    claimed: boolean;
}

export default function VestingContracts() {
    const [contracts, setContracts] = useState<ContractData>({});
    const [selectedContract, setSelectedContract] = useState<string>('');
    const [vestingPositions, setVestingPositions] = useState<any[]>([]);
    const [assetPositions, setAssetPositions] = useState<any[]>([]);
    const [nonce, setNonce] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const auraBAL = '0x616e8bfa43f920657b3497dbf40d6b1a02d4608d'.toLowerCase();
    const AURA = '0xc0c293ce456ff0ed870add98a0828dd4d2903dbf'.toLowerCase()
    const priceData = useGetSimpleTokenPrices([auraBAL, AURA], '1');

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const response = await fetch(CONTRACTS_URL);
                const data = await response.json();
                setContracts(data.maxiVestingContracts);
            } catch (err) {
                setError('Failed to fetch contracts.');
            }
        };

        fetchContracts();
    }, []);

    const handleChange = async (event: SelectChangeEvent<string>) => {
        const contractAddress = event.target.value;
        setSelectedContract(contractAddress);
        setIsLoading(true);
        setError(null);
        await fetchNonce(contractAddress);
    };

    const fetchNonce = async (contractAddress: string) => {
        try {
            const providerUrl = 'https://arbitrum.rpc.subquery.network/public';
            const ethersProvider = new ethers.providers.JsonRpcProvider(providerUrl);
            const contract = new ethers.Contract(contractAddress, ABI, ethersProvider);
            const nonce = await contract.getVestingNonce();
            setNonce(nonce.toNumber());
        } catch (err) {
            console.error(err);
            setError('Failed to fetch nonces. You have been rate-limited. Retry later.');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (nonce !== null && selectedContract) {
            fetchVestingPositionsAndAssets(selectedContract, nonce);
        }
    }, [nonce, selectedContract]);

    const fetchVestingPositionsAndAssets = async (contractAddress: string, nonceNumber: number) => {
        try {
            const providerUrl = 'https://arbitrum-one.publicnode.com';
            const ethersProvider = new ethers.providers.JsonRpcProvider(providerUrl);
            const multicall = new Multicall({ethersProvider, tryAggregate: true});

            const auraContractAddress = '0x4ea9317d90b61fc28c418c247ad0ca8939bbb0e9';
            const auraContract = new ethers.Contract(auraContractAddress, AuraCompounderABI, ethersProvider);

            const vestingCalls: ContractCallContext[] = [];
            for (let i = 0; i < nonceNumber; i++) {
                vestingCalls.push({
                    reference: `vestingPosition-${i}`,
                    contractAddress: contractAddress,
                    abi: ABI,
                    calls: [{reference: `getVestingPosition`, methodName: 'getVestingPosition', methodParameters: [i]}],
                });
            }

            const vestingResults: ContractCallResults = await multicall.call(vestingCalls);

            // Create arrays to store positions and their corresponding indices
            const positionsWithIndices: Array<{position: VestingPositionData, index: number}> = [];

            for (let i = 0; i < nonceNumber; i++) {
                const positionResult = vestingResults.results[`vestingPosition-${i}`].callsReturnContext[0].returnValues;
                positionsWithIndices.push({
                    position: {
                        amount: positionResult[0],
                        vestingEnds: ethers.BigNumber.from(positionResult[1]).toNumber(),
                        claimed: positionResult[2]
                    },
                    index: i
                });
            }

            // Sort positions by vesting end time
            positionsWithIndices.sort((a, b) => a.position.vestingEnds - b.position.vestingEnds);

            // Create asset calls in the sorted order
            const assetCalls: ContractCallContext[] = positionsWithIndices.map(({position}, index) => ({
                reference: `convertToAssets-${index}`,
                contractAddress: auraContractAddress,
                abi: AuraCompounderABI,
                calls: [{
                    reference: `convertToAssets`,
                    methodName: 'convertToAssets',
                    methodParameters: [position.amount]
                }],
            }));

            const assetResults: ContractCallResults = await multicall.call(assetCalls);

            // Extract sorted positions and assets
            const sortedPositions = positionsWithIndices.map(({position}) => position);
            const sortedAssets = positionsWithIndices.map((_, index) =>
                assetResults.results[`convertToAssets-${index}`].callsReturnContext[0].returnValues[0]
            );

            setVestingPositions(sortedPositions);
            setAssetPositions(sortedAssets);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch vesting positions and assets.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{flexGrow: 2}}>
            <Grid mt={2} container sx={{justifyContent: "center"}}>
                <Grid mt={2} item xs={10}>
                    <Box>
                        <Typography variant="h5">Vesting Contract Viewer</Typography>
                    </Box>
                    {error && (
                        <Box mt={2} mb={2}>
                            <Typography color="error">{error}</Typography>
                        </Box>
                    )}
                </Grid>
                <Grid item mb={2} xs={10}>
                    <Grid
                        container
                        columns={{xs: 4, sm: 8, md: 12}}
                        sx={{justifyContent: {md: 'flex-start', xs: 'center'}, alignContent: 'center'}}
                    >
                    <Box m={{xs: 0, sm: 1}}>
                        {priceData && priceData.data[auraBAL] && priceData.data[auraBAL].price ?
                            <CoinCard
                                tokenAddress={auraBAL}
                                tokenName='auraBAL'
                                tokenPrice={priceData.data[auraBAL].price}
                                tokenPriceChange={priceData.data[auraBAL].priceChangePercentage24h}
                            />
                            : <CircularProgress/>}
                    </Box>
                    <Box m={{xs: 0, sm: 1}}>
                        {priceData && priceData.data[AURA] && priceData.data[AURA].price ?
                            <CoinCard
                                tokenAddress={AURA}
                                tokenName='AURA'
                                tokenPrice={priceData.data[AURA].price}
                                tokenPriceChange={priceData.data[AURA].priceChangePercentage24h}
                            />
                            : <CircularProgress/>}
                    </Box>
                    </Grid>
                </Grid>
                <Grid item xs={10}>
                    <Box m={{xs: 0, sm: 1}}>
                    <FormControl style={{minWidth: 200}}>
                        <InputLabel id="contract-select-label">Select Vestor</InputLabel>
                        <Select
                            labelId="contract-select-label"
                            value={selectedContract}
                            label="Select Vester"
                            onChange={handleChange}
                        >
                            {Object.entries(contracts)
                                .filter(([name]) => name !== 'factory')
                                .map(([name, address]) => (
                                    <MenuItem key={address} value={address}>
                                        {name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    </Box>
                </Grid>
                <Grid item mt={1} xs={10}>
                    <Box mt={2} mb={6}>
                        {isLoading ? (
                            <CircularProgress/>
                        ) : (
                            vestingPositions.length > 0 && (
                                <>
                                    <Typography variant="h6">Vesting Positions Overview <Link target="_blank" href={getEtherscanLink(selectedContract, 'address', ArbitrumNetworkInfo)}><LaunchIcon sx={{height: '20px'}}/></Link>
                                    </Typography>
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Amount (stkAuraBAL)</TableCell>
                                                    <TableCell>Amount (auraBAL)</TableCell>
                                                    <TableCell>Worth ($)</TableCell>
                                                    <TableCell>Unlock Timestamp</TableCell>
                                                    <TableCell>Claimed?</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {vestingPositions.map((position, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{ethers.utils.formatUnits(position.amount, 18)}</TableCell>
                                                        <TableCell>{formatAmount(Number(ethers.utils.formatUnits(assetPositions[index], 18)), 2)}</TableCell>
                                                        <TableCell>{formatDollarAmount(Number(ethers.utils.formatUnits(assetPositions[index], 18)) * priceData.data[auraBAL].price, 2)}</TableCell>
                                                        <TableCell>{new Date(position.vestingEnds * 1000).toLocaleString()}</TableCell>
                                                        <TableCell>{position.claimed ? 'Yes' : 'No'}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Box mt={1}>
                                        <Typography variant="h6">Vesting Positions Over Time </Typography>
                                        <Card>
                                            <VestingChart vestingPositions={vestingPositions} />
                                        </Card>
                                    </Box>
                                </>
                            )
                        )}
                    </Box>
                </Grid>

            </Grid>
            <Grid item mb={2}></Grid>
        </Box>
    );
}
