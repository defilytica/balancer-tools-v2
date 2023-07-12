import * as React from 'react';
import { useState } from "react";
import Box from '@mui/material/Box';
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



interface Data {
    poolComposition: string;
    network: string;
    isKilled: boolean;
    poolData: SimplePoolData,
    userValue: number,
    boost: string;
    max_boost: string,
    min_VeBAL: string,
}

function createData(
    poolComposition: string,
    network: string,
    isKilled: boolean,
    poolData: SimplePoolData,
    userValue: number,
    boost: string,
    max_boost: string,
    min_VeBAL: string,
): Data {
    return {
        poolComposition,
        network,
        isKilled,
        poolData,
        userValue,
        boost,
        max_boost,
        min_VeBAL,
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
        id: 'poolComposition',
        numeric: false,
        disablePadding: false,
        label: 'Composition',
        isMobileVisible: false,
    },
    {
        id: 'userValue',
        numeric: false,
        disablePadding: false,
        label: 'Balance ($)',
        isMobileVisible: false,
    },
    {
        id: 'boost',
        numeric: false,
        disablePadding: false,
        label: 'Boost',
        isMobileVisible: false,
    },
    {
        id: 'max_boost',
        numeric: false,
        disablePadding: false,
        label: 'Max Boost',
        isMobileVisible: false,
    },
    {
        id: 'min_VeBAL',
        numeric: false,
        disablePadding: false,
        label: 'VeBAL for Max Boost',
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

export default function PortfolioBoostTable({gaugeDatas, userVeBALAdjusted}: {
    gaugeDatas: BalancerStakingGauges[], userVeBALAdjusted: number
}) {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('boost');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);


    const seen = new Set();

    const filteredPoolDatas = gaugeDatas.filter((x) => {
        return !!x && !x.isKilled && !seen.has(x.address) && seen.add(x.pool.address);
    });

    const originalRows = filteredPoolDatas.map(el =>
        createData(el.address, el.network, el.isKilled, el.pool, el.userValue, el.boost, el.max_boost, el.min_VeBAL)
    )
    const [rows, setRows] = useState<Data[]>(originalRows);



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


    interface NetworkLogoMap {
        [networkNumber: number]: string;
    }

    const networkLogoMap: NetworkLogoMap = {
        1: EtherLogo,
        137: PolygonLogo,
        100: GnosisLogo,
        42161: ArbitrumLogo
        // Add as many mappings as needed
    };


    //Table generation

    return (
        <Box sx={{width: '100%'}}>
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
                            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.sort(getComparator(order, orderBy)).slice() */}
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            //onClick={() => window.open(`https://balancer.defilytica.com/${getLink(row.network, row.address)}/`, '_blank') }
                                            role="number"
                                            tabIndex={-1}
                                            key={row.poolComposition + Math.random() * 10}
                                            sx={{cursor: 'pointer'}}
                                        >
                                            <TableCell>
                                                <Avatar
                                                    sx={{
                                                        height: 20,
                                                        width: 20
                                                    }}
                                                    src={networkLogoMap[Number(row.network)]}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {/* TODO: fix for token list elements*/}
                                                <PoolCurrencyLogo
                                                    tokens={row.poolData.tokens.map(token => ({address: token.address ? token.address.toLowerCase() : ''}))}
                                                    size={'25px'}/>
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                sx={{display: {xs: 'none', md: 'table-cell'}}}
                                            >
                                                <GaugeComposition poolData={row.poolData} />
                                            </TableCell>
                                            <TableCell>
                                                {formatNumber(Number(row.userValue) / (10**18),  3)}
                                            </TableCell>
                                            <TableCell>
                                                {formatNumber(Number(row.boost),  3)}
                                            </TableCell>
                                            <TableCell>
                                                {formatNumber(Number(row.max_boost),  3)}
                                            </TableCell>
                                            <TableCell>
                                            <span
                                            style={{
                                              textShadow:
                                                Number(row.min_VeBAL) > userVeBALAdjusted
                                                  ? "0 0 2px #DC143C"
                                                  : Number(row.min_VeBAL) < userVeBALAdjusted
                                                  ? "0 0 2px green"
                                                  : "white",
                                            }}
                                          >
                                            {formatNumber(
                                              Number(row.min_VeBAL),
                                              3
                                            )}
                                         <div>
                                           {formatNumber(Math.abs(userVeBALAdjusted - Number(row.min_VeBAL)), 3)}
                                         </div>
                                          </span>{" "}
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

