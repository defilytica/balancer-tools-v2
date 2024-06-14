import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import ABI from '../../constants/abis/maxis-vester.json'
import AuraCompounderABI from '../../constants/abis/auraCompounder.json'
import {formatAmount, formatDollarAmount} from "../../utils/numbers";
import useGetSimpleTokenPrices from "../../data/balancer-api-v3/useGetSimpleTokenPrices";
import CoinCard from "../../components/Cards/CoinCard";
import CircularProgress from "@mui/material/CircularProgress";
import {ContractCallContext, ContractCallResults, Multicall} from "ethereum-multicall";

const CONTRACTS_URL = 'https://raw.githubusercontent.com/BalancerMaxis/bal_addresses/main/extras/arbitrum.json';

interface ContractData {
    [key: string]: string;
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
    const auraBalPriceData = useGetSimpleTokenPrices([auraBAL], '1');

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
            const providerUrl = 'https://1rpc.io/arb';
            const ethersProvider = new ethers.providers.JsonRpcProvider(providerUrl);
            const contract = new ethers.Contract(contractAddress, ABI, ethersProvider);
            const nonce = await contract.getVestingNonce();
            setNonce(nonce.toNumber());
        } catch (err) {
            console.error(err);
            setError('Failed to fetch nonce. Ensure the contract address and ABI are correct.');
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
            const providerUrl = 'https://1rpc.io/arb';
            const ethersProvider = new ethers.providers.JsonRpcProvider(providerUrl);
            const multicall = new Multicall({ ethersProvider, tryAggregate: true });

            const auraContractAddress = '0x4ea9317d90b61fc28c418c247ad0ca8939bbb0e9';
            const auraContract = new ethers.Contract(auraContractAddress, AuraCompounderABI, ethersProvider);

            const vestingCalls: ContractCallContext[] = [];
            for (let i = 0; i < nonceNumber; i++) {
                vestingCalls.push({
                    reference: `vestingPosition-${i}`,
                    contractAddress: contractAddress,
                    abi: ABI,
                    calls: [{ reference: `getVestingPosition`, methodName: 'getVestingPosition', methodParameters: [i] }],
                });
            }

            const vestingResults: ContractCallResults = await multicall.call(vestingCalls);

            const positions = [];
            const assetCalls: ContractCallContext[] = [];
            for (let i = 0; i < nonceNumber; i++) {
                const positionResult = vestingResults.results[`vestingPosition-${i}`].callsReturnContext[0].returnValues;
                console.log(`Position ${i} result:`, positionResult); // Log raw data
                positions.push({
                    amount: positionResult[0],
                    vestingEnds: ethers.BigNumber.from(positionResult[1]).toNumber(),
                    claimed: positionResult[2],
                });

                assetCalls.push({
                    reference: `convertToAssets-${i}`,
                    contractAddress: auraContractAddress,
                    abi: AuraCompounderABI,
                    calls: [{ reference: `convertToAssets`, methodName: 'convertToAssets', methodParameters: [positionResult[0]] }],
                });
            }

            const assetResults: ContractCallResults = await multicall.call(assetCalls);
            const assets = [];

            for (let i = 0; i < nonceNumber; i++) {
                const assetResult = assetResults.results[`convertToAssets-${i}`].callsReturnContext[0].returnValues;
                assets.push(assetResult[0]);
            }

            setVestingPositions(positions);
            setAssetPositions(assets);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch vesting positions and assets.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Vesting Contract Viewer
            </Typography>
            {error && (
                <Box mt={2} mb={2}>
                    <Typography color="error">{error}</Typography>
                </Box>
            )}
            <Box m={{ xs: 0, sm: 1 }}>
                {auraBalPriceData && auraBalPriceData.data[auraBAL] && auraBalPriceData.data[auraBAL].price ?
                    <CoinCard
                        tokenAddress={auraBAL}
                        tokenName='auraBAL'
                        tokenPrice={auraBalPriceData.data[auraBAL].price}
                        tokenPriceChange={auraBalPriceData.data[auraBAL].priceChangePercentage24h}
                    />
                    : <CircularProgress />}
            </Box>
            <FormControl fullWidth>
                <InputLabel id="contract-select-label">Select Contract</InputLabel>
                <Select
                    labelId="contract-select-label"
                    value={selectedContract}
                    label="Select Contract"
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
            <Box mt={4}>
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    vestingPositions.length > 0 && (
                        <>
                            <Typography variant="h6">Vesting Positions</Typography>
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
                                                <TableCell>{formatDollarAmount(Number(ethers.utils.formatUnits(assetPositions[index], 18)) * auraBalPriceData.data[auraBAL].price, 2)}</TableCell>
                                                <TableCell>{new Date(position.vestingEnds * 1000).toLocaleString()}</TableCell>
                                                <TableCell>{position.claimed ? 'Yes' : 'No'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )
                )}
            </Box>
        </Container>
    );
}
