import * as React from 'react';
import {useEffect, useState} from "react";
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Avatar, Button, IconButton, InputBase, Typography} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {visuallyHidden} from '@mui/utils';
import PoolCurrencyLogo from '../../PoolCurrencyLogo';
import TokensWhite from '../../../assets/svg/tokens_white.svg';
import TokensBlack from '../../../assets/svg/tokens_black.svg';
import {useTheme} from '@mui/material/styles';
import ArbitrumLogo from '../../../assets/svg/arbitrum.svg';
import EtherLogo from '../../../assets/svg/ethereum.svg';
import PolygonLogo from '../../../assets/svg/polygon.svg';
import GnosisLogo from '../../../assets/svg/gnosis.svg';
import zkevmLogo from '../../../assets/svg/zkevm.svg';
import OpLogo from '../../../assets/svg/optimism.svg';
import AvaxLogo from '../../../assets/svg/avalancheLogo.svg';
import BaseLogo from '../../../assets/svg/base.svg';
import {BalancerStakingGauges, SimplePoolData} from "../../../data/balancer/balancerTypes";
import {formatDollarAmount, formatNumber} from "../../../utils/numbers";
import GaugeComposition from "../../GaugeComposition";
import ClearIcon from '@mui/icons-material/Clear';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {GaugeAllocation} from "../../../data/balancer/balancerGaugeTypes";
import {isMobile} from "react-device-detect";

interface Data {
    gaugeAddress: string;
    network: string;
    isKilled: boolean;
    poolData: SimplePoolData,
    totalVotes: number,
    userVotes: number,
    votingIncentives: number,
    paladinRewards: number,
    paladinLeftVotes: number,
    totalRewards: number,
    userRewards: number,
}

function createData(
    gaugeAddress: string,
    network: string,
    isKilled: boolean,
    poolData: SimplePoolData,
    totalVotes: number,
    userVotes: number,
    votingIncentives: number,
    paladinRewards: number,
    paladinLeftVotes: number,
    totalRewards: number,
    userRewards: number,
): Data {
    return {
        gaugeAddress,
        network,
        isKilled,
        poolData,
        totalVotes,
        userVotes,
        votingIncentives,
        paladinRewards,
        paladinLeftVotes,
        totalRewards,
        userRewards,
    };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string | SimplePoolData | boolean },
    b: { [key in Key]: number | string | SimplePoolData | boolean },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
    isMobileVisible: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'network',
        numeric: false,
        disablePadding: false,
        label: ' ',
        isMobileVisible: true,
    },
    {
        id: 'poolData',
        numeric: false,
        disablePadding: false,
        label: 'Composition',
        isMobileVisible: true,
    },
    {
        id: 'totalVotes',
        numeric: true,
        disablePadding: false,
        label: 'Total Votes',
        isMobileVisible: false,
    },
    {
        id: 'totalRewards',
        numeric: true,
        disablePadding: false,
        label: 'HH: Rewards',
        isMobileVisible: true,
    },
    {
        id: 'votingIncentives',
        numeric: true,
        disablePadding: false,
        label: 'HH: $/veBAL',
        isMobileVisible: true,
    },
    /*{
        id: 'paladinRewards',
        numeric: true,
        disablePadding: false,
        label: 'Paladin: $/veBAL',
        isMobileVisible: true,
    },
    {
        id: 'paladinLeftVotes',
        numeric: true,
        disablePadding: false,
        label: 'Paladin: Open Votes',
        isMobileVisible: true,
    },*/
    {
        id: 'userVotes',
        numeric: true,
        disablePadding: false,
        label: 'Action',
        isMobileVisible: true,
    },
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    order: Order;
    orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const {order, orderBy, onRequestSort} = props;
    const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    const theme = useTheme();

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{display: {xs: headCell.isMobileVisible ? 'table-cell' : 'none', md: 'table-cell'}}}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label === '' ?
                                <img src={(theme.palette.mode === 'dark') ? TokensWhite : TokensBlack} alt="Theme Icon"
                                     width="25"/> : headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function VotingTable({gaugeDatas, userVeBal, allocations, onAddAllocation}: {
    gaugeDatas: BalancerStakingGauges[],
    userVeBal: number,
    allocations: GaugeAllocation[],
    onAddAllocation: (address: string) => void;
}) {
    const [order, setOrder] = React.useState<Order>('desc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('votingIncentives');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);

    const seen = new Set();

    const filteredPoolDatas = gaugeDatas.filter((x) => {
        return !!x && !seen.has(x.address) && seen.add(x.pool.address);
    });

    const originalRows = filteredPoolDatas
        .filter(el => !allocations.some(allocation => allocation.gaugeAddress === el.address))
        .map(el =>
            createData(
                el.address,
                el.network,
                el.isKilled,
                el.pool,
                el.voteCount ? el.voteCount : 0,
                el.userVotingPower ? el.userVotingPower / 100 * userVeBal : 0,
                el.valuePerVote ? el.valuePerVote : 0,
                el.paladinRewards ? el.paladinRewards.valuePerVote : 0,
                el.paladinRewards ? el.paladinRewards.leftVotes : 0,
                el.totalRewards ? el.totalRewards : 0,
                (el.userVotingPower && el.valuePerVote) ? el.userVotingPower / 100 * el.valuePerVote * userVeBal : 0
            )
        )
        .sort((a, b) => b.totalRewards - a.totalRewards);

    const [rows, setRows] = useState<Data[]>(originalRows);
    const [searched, setSearched] = useState<string>("");

    useEffect(() => {
        setRows(originalRows);
    }, [allocations]);

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const requestSearch = (searchedVal: string) => {
        const filteredRows = originalRows.filter((row) => {
            const lowerCaseSearchedVal = searchedVal.toLowerCase();
            const hasPartialMatchInAddress = row.poolData.address.toLowerCase().includes(lowerCaseSearchedVal);
            const hasPartialMatchInSymbol = row.poolData.symbol.toLowerCase().includes(lowerCaseSearchedVal);
            const hasPartialMatchInTokens = row.poolData.tokens.some((token) => token.symbol.toLowerCase().includes(lowerCaseSearchedVal));
            return hasPartialMatchInAddress || hasPartialMatchInSymbol || hasPartialMatchInTokens;
        });
        setRows(filteredRows);
        setSearched(searchedVal);
    };

    const clearSearch = (): void => {
        setSearched("");
        setRows(originalRows);
    };

    const networkLogoMap: { [networkNumber: string]: string } = {
        MAINNET: EtherLogo,
        OPTIMISM: OpLogo,
        POLYGON: PolygonLogo,
        GNOSIS: GnosisLogo,
        ARBITRUM: ArbitrumLogo,
        ZKEVM: zkevmLogo,
        BASE: BaseLogo,
        AVALANCHE: AvaxLogo,
    };

    return (
        <Box sx={{width: '100%'}}>
            <Paper
                component="form"
                sx={{ mb: '10px', p: '2px 4px', display: 'flex', alignItems: 'center', maxWidth: 500, border: '1px solid grey' }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search for Gauge"
                    inputProps={{ 'aria-label': 'search Balancer gauges' }}
                    value={searched}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => requestSearch(event.target.value)}
                />
                <IconButton onClick={clearSearch} type="button" sx={{ p: '10px' }} aria-label="search">
                    {searched !== "" ? <ClearIcon /> : <SearchIcon />}
                </IconButton>
            </Paper>
            <Paper sx={{mb: 2, boxShadow: 3, border: '1px solid grey'}}>
                <TableContainer>
                    <Table aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                        <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow hover role="number" tabIndex={-1} key={row.gaugeAddress + Math.random() * 10} sx={{cursor: 'pointer'}}>
                                            {headCells.map((headCell) => (
                                                <TableCell
                                                    key={headCell.id}
                                                    align={headCell.numeric ? 'right' : 'left'}
                                                    sx={{display: {xs: headCell.isMobileVisible ? 'table-cell' : 'none', md: 'table-cell'}}}
                                                >
                                                    {headCell.id === 'network' ? (
                                                        <Avatar
                                                            sx={{height: 20, width: 20}}
                                                            src={networkLogoMap[row.network]}
                                                        />
                                                    ) : headCell.id === 'poolData' ? (
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Box mr={1}>
                                                                <PoolCurrencyLogo
                                                                    tokens={row.poolData.tokens.map(token => ({address: token.address ? token.address.toLowerCase() : ''}))}
                                                                    size={'25px'}
                                                                />
                                                            </Box>
                                                            {!isMobile ?
                                                            <Box>
                                                                <GaugeComposition poolData={row.poolData} />
                                                            </Box> : null
                                                            }
                                                            {row.isKilled ? (
                                                                <Box ml={1}>
                                                                    <Typography variant={'caption'} color={"red"}>KILLED</Typography>
                                                                </Box>
                                                            ) : null}
                                                        </Box>
                                                    ) : headCell.id === 'userVotes' ? (
                                                        row.userVotes || allocations.find(alloc => alloc.gaugeAddress === row.gaugeAddress) ? (
                                                            formatNumber(Number(row.userVotes), 3)
                                                        ) : (
                                                            <Button
                                                                variant="contained"
                                                                disabled={allocations.length > 7}
                                                                onClick={() => {
                                                                    onAddAllocation(row.gaugeAddress);
                                                                    const updatedRows = rows.filter((rowItem) => rowItem.gaugeAddress !== row.gaugeAddress);
                                                                    setRows(updatedRows);
                                                                }}
                                                                endIcon={<AddCircleIcon />}
                                                            >
                                                                Add
                                                            </Button>
                                                        )
                                                    ) : (
                                                        <Typography>
                                                            {headCell.id === 'totalVotes'
                                                                ? formatNumber(Number(row[headCell.id]), 3)
                                                                : formatDollarAmount(Number(row[headCell.id]), 3)
                                                            }
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box display="flex" alignItems="center" justifyContent={"space-between"}>
                    <Box m={1} display="flex" justifyContent={"flex-start"}>
                        <FormControlLabel
                            control={<Switch checked={dense} onChange={handleChangeDense} />}
                            label="Compact view"
                        />
                    </Box>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            </Paper>
        </Box>
    );
}
