import React from 'react';
import Box from '@mui/material/Box';
import TableSortLabel from '@mui/material/TableSortLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Avatar, FormControlLabel, Typography} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useNavigate } from 'react-router-dom';
import {NetworkInfo} from "../../../constants/networks";
import { networkPrefix } from '../../../utils/networkPrefix';
import {useActiveNetworkVersion} from "../../../state/application/hooks";
import {deepPurple} from "@mui/material/colors";
import {generateIdenticon} from "../../../utils/generateIdenticon";
import TablePagination from "@mui/material/TablePagination";


interface Contract {
    id: string;
    title: string;
}

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Contract) => void;
    order: 'asc' | 'desc';
    orderBy: string;
}

const headCells: readonly { id: keyof Contract; label: string }[] = [
    { id: 'title', label: 'Contract Name' },
    { id: 'id', label: 'Contract Address' },
];

const getLink = (activeNetwork: NetworkInfo, id: string) => {
    return networkPrefix(activeNetwork) + 'balancer/balancerContracts/' + id;
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
    a: { [key in Key]: string },
    b: { [key in Key]: string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property: keyof Contract) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align="left"
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
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

interface ContractTableProps {
    contracts: Contract[];
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

export default function ContractOverviewTable({ contracts }: ContractTableProps) {
    const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Contract>('title');
    let navigate = useNavigate();
    const [activeNetwork] = useActiveNetworkVersion();
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [page, setPage] = React.useState(0);

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Contract) => {
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

    return (
        <Box sx={{ width: '100%' }}>
            <Paper elevation={1} sx={{ boxShadow: 3 }}>
                <TableContainer>
                    <Table aria-labelledby="tableTitle" size="medium">
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {stableSort(contracts, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((contract, index) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                <TableRow
                                    hover
                                    role="number"
                                    tabIndex={-1}
                                    key={contract.id}
                                    onClick={() => { navigate(`${getLink(activeNetwork, contract.id)}/`); }}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell align="left">
                                        <Box display="flex" alignItems="center" alignContent="center">
                                            <Box mr={1}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: deepPurple[500],
                                                        height: 25,
                                                        width: 25,
                                                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)'
                                                    }}
                                                    src={generateIdenticon(contract.id)}
                                                />
                                            </Box>
                                            <Typography>{contract.title}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Typography>{contract.id}</Typography>
                                    </TableCell>

                                </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box display="flex" alignItems="center" justifyContent={"space-between"}>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 100]}
                        component="div"
                        count={contracts.length}
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
