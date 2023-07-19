import * as React from 'react';
import { useState } from "react";
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
import {Avatar, IconButton, InputBase} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {visuallyHidden} from '@mui/utils';
import PoolCurrencyLogo from '../../PoolCurrencyLogo';
import TokensWhite from '../../../assets/svg/tokens_white.svg';
import TokensBlack from '../../../assets/svg/tokens_black.svg';
import {useTheme} from '@mui/material/styles'
import {networkPrefix} from '../../../utils/networkPrefix';
import {NetworkInfo} from '../../../constants/networks';
import ArbitrumLogo from '../../../assets/svg/arbitrum.svg'
import EtherLogo from '../../../assets/svg/ethereum.svg'
import PolygonLogo from '../../../assets/svg/polygon.svg'
import GnosisLogo from '../../../assets/svg/gnosis.svg'
import {BalancerStakingGauges, SimplePoolData} from "../../../data/balancer/balancerTypes";
import {formatNumber} from "../../../utils/numbers";
import GaugeComposition from "../../GaugeComposition";
import ClearIcon from '@mui/icons-material/Clear';
import OpLogo from "../../../assets/svg/optimism.svg";
import zkevmLogo from "../../../assets/svg/zkevm.svg";



interface Data {
    poolComposition: string;
    network: string;
    isKilled: boolean;
    poolData: SimplePoolData,
    address: string;
    rootGauge: string,
    min_VeBAL: string,
    poolId: string,
    poolType: string,
    symbol: string,
}

function createData(
    poolComposition: string,
    network: string,
    isKilled: boolean,
    poolData: SimplePoolData,
    address: string,
    rootGauge: string,
    min_VeBAL: string,
    poolId: string,
    poolType: string,
    symbol: string,
): Data {
    return {
        poolComposition,
        network,
        isKilled,
        poolData,
        address,
        rootGauge,
        min_VeBAL,
        poolId,
        poolType,
        symbol,
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
    return order === 'asc'
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
        label: 'Network',
        isMobileVisible: true,
    },
    {
        id: 'poolData',
        numeric: false,
        disablePadding: false,
        label: 'Composition',
        isMobileVisible: false,
    },
    {
        id: 'poolType',
        numeric: false,
        disablePadding: false,
        label: 'Pool Type',
        isMobileVisible: false,
    },
    {
        id: 'symbol',
        numeric: false,
        disablePadding: false,
        label: 'Symbol',
        isMobileVisible: false,
    },
    {
        id: 'rootGauge',
        numeric: false,
        disablePadding: false,
        label: 'Root Gauge',
        isMobileVisible: false,
    },
    {
        id: 'poolId',
        numeric: false,
        disablePadding: false,
        label: 'Pool ID',
        isMobileVisible: false,
    },
    {
        id: 'isKilled',
        numeric: false,
        disablePadding: false,
        label: 'Killed?',
        isMobileVisible: false,
    },

];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    order: Order;
    orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const {order, orderBy, onRequestSort} =
        props;
    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    const theme = useTheme()

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
                            //sx={{ display: {xs: headCell.isMobileVisible ? 'table-cell' : 'none', md: 'table-cell' }}}
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

export default function GovGaugeTable({gaugeDatas}: {
    gaugeDatas: BalancerStakingGauges[]
}) {
    const [order, setOrder] = React.useState<Order>('desc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('network');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);


    const seen = new Set();

    const filteredPoolDatas = gaugeDatas.filter((x) => {
        return !!x && !seen.has(x.address) && seen.add(x.pool.address);
    });

    const originalRows = filteredPoolDatas.map(el =>
        createData(el.address, el.network, el.isKilled, el.pool, el.pool.address, el.address, el.min_VeBAL, el.pool.id, el.pool.poolType, el.pool.symbol)
    )
    const [rows, setRows] = useState<Data[]>(originalRows);
    const [searched, setSearched] = useState<string>("");



    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
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


    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const getLink = (activeNetwork: NetworkInfo, id: string) => {
        return networkPrefix(activeNetwork) + 'pools/' + id;
    }



    const requestSearch = (searchedVal: string) => {
        const filteredRows = originalRows.filter((row) => {
            const lowerCaseSearchedVal = searchedVal.toLowerCase();
            const hasPartialMatchInAddress = row.poolData.address.toLowerCase().includes(lowerCaseSearchedVal);
            const hasPartialMatchInSymbol = row.poolData.symbol.toLowerCase().includes(lowerCaseSearchedVal);
            const hasPartialMatchInTokens = row.poolData.tokens.some((token) => token.symbol.toLowerCase().includes(lowerCaseSearchedVal));
            const hasPartialPoolTypeMatch = row.poolData.poolType.toLowerCase().includes(lowerCaseSearchedVal);
            const hasPartialGaugeMatch = row.rootGauge.toLowerCase().includes(lowerCaseSearchedVal)
            return hasPartialMatchInAddress || hasPartialMatchInSymbol || hasPartialMatchInTokens || hasPartialPoolTypeMatch || hasPartialGaugeMatch;
        });
        setRows(filteredRows);
        setSearched(searchedVal)
    };

    const clearSearch = (): void => {
        setSearched("");
        setRows(originalRows)
    };

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


    //Table generation

    return (
        <Box sx={{width: '100%'}}>
            <Paper
                component="form"
                sx={{ mb: '5px', p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
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
            <Paper sx={{mb: 2, boxShadow: 3}}>

                <TableContainer>
                    <Table
                        //sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            role="number"
                                            tabIndex={-1}
                                            key={row.poolComposition + Math.random() * 10}
                                            sx={{cursor: 'pointer'}}
                                        >
                                            <TableCell sx={{maxWidth: '10px'}}>
                                                <Avatar
                                                    sx={{
                                                        height: 20,
                                                        width: 20
                                                    }}
                                                    src={networkLogoMap[Number(row.network)]}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box mr={1}>
                                                    <PoolCurrencyLogo
                                                        tokens={row.poolData.tokens.map(token => ({address: token.address ? token.address.toLowerCase() : ''}))}
                                                        size={'25px'}/>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {row.poolType}
                                            </TableCell>
                                            <TableCell>
                                                {row.symbol}
                                            </TableCell>
                                            <TableCell>
                                                {row.rootGauge}
                                            </TableCell>
                                            <TableCell>
                                                {row.poolId}
                                            </TableCell>
                                            <TableCell>
                                                {row.isKilled ? 'yes' : 'no'}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box display="flex" alignItems="center" justifyContent={"space-between"}>
                    <Box m={1} display="flex" justifyContent={"flex-start"}>
                        <FormControlLabel
                            control={<Switch checked={dense} onChange={handleChangeDense}/>}
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

