import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles'
import { styled } from '@mui/material/styles';
import {Drawer, Box, Link, ListItem, Button} from "@mui/material"
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LinkIcon from '@mui/icons-material/Link';
import WavesIcon from '@mui/icons-material/Waves';
import TokenIcon from '@mui/icons-material/Token';
import SecurityIcon from '@mui/icons-material/Security';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DiscordIconLight from '../../assets/svg/discord-light.svg'
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CoingeckoColor from '../../assets/svg/coingecko-color.svg'
import DebankColor from '../../assets/svg/debank-symbol.svg'
import AlchemyBlue from '../../assets/svg/alchemy-mark-blue-gradient.svg'
import Polling from '../Header/Polling';
import { NavLink } from "react-router-dom";
import { EthereumNetworkInfo, NetworkInfo } from '../../constants/networks';
import { networkPrefix } from '../../utils/networkPrefix';

export type MenuDrawerProps = {
    drawerWidth: number,
    open: boolean,
    handleDrawerClose: any,
    activeNetwork: NetworkInfo,
}

const MenuDrawer = ({
    drawerWidth,
    open,
    handleDrawerClose,
    activeNetwork }: MenuDrawerProps) => {

    const theme = useTheme();


    //Styled Drawer settings
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }));

    const route = activeNetwork === EthereumNetworkInfo ? '' : activeNetwork.route + '/';

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
                //backgroundColor: {
                //    opacity: 0.5,
                // }
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                <ListItem>
                    <Typography sx={{ fontWeight: 'bold' }}>Balancer</Typography>
                </ListItem>
                <ListItemButton key={'veBAL'} component={NavLink} to={'/veBAL'}>
                    <ListItemIcon>
                        <AccountBalanceIcon />
                    </ListItemIcon>
                    <ListItemText primary={'veBAL'} />
                </ListItemButton>

                <ListItemButton key={'veBAL Voter'} component={NavLink} to={networkPrefix(activeNetwork) + 'veBalVoter'}>
                    <ListItemIcon>
                        <LinkIcon />
                    </ListItemIcon>
                    <ListItemText primary={'veBAL Voter'} />
                </ListItemButton>
            </List>
            <List>
                <Divider />
                <ListItemButton key={'Authorizations'} component={NavLink} to={networkPrefix(activeNetwork) + 'authorizations'}>
                    <ListItemIcon>
                        <SecurityIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Authorizations'} />
                </ListItemButton>
            </List>
            <List>
                <Divider />
                <ListItem>
                    <Box ml={3} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <Button
                        onClick={() => {window.open('https://balancer.defilytica.com', '_blank')}}
                        sx={{
                            background: 'linear-gradient(45deg, #0066cc 30%, #003399 90%)',
                            borderRadius: 3,
                            border: 0,
                            color: 'white',
                            height: 35,
                            padding: '0 30px',
                            boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.3)',
                            transition: 'background-color 0.3s ease, transform 0.2s ease-out',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #003399 30%, #0066cc 90%)',
                                transform: 'scale(1.05)',
                            },
                        }}
                    >
                        Analytics
                    </Button>
                    </Box>
                </ListItem>
            </List>
            <Divider />
            <Box display="flex" justifyContent="space-between" paddingX={drawerWidth / 6 + 'px'}>
                <Polling />
            </Box>
            <Divider />
            <Box  maxWidth={drawerWidth + drawerWidth / 6}>
                <Box mt={1} display="flex" justifyContent="space-between" paddingX={drawerWidth / 6 + 'px'} paddingY="5px">

                    <Link href="https://github.com/Xeonus" target="_blank" rel="noopener noreferrer">
                        <GitHubIcon />
                    </Link>
                    <Link href="https://twitter.com/Xeonusify" target="_blank" rel="noopener noreferrer">
                        <TwitterIcon />
                    </Link>
                    <Link href="https://discord.balancer.fi" target="_blank" rel="noopener noreferrer">
                        <img src={DiscordIconLight} alt="Discord Icon" width="25" />
                    </Link>
                </Box>
                <Divider />
                <Box mt={1} display="flex" justifyContent="center" paddingX={drawerWidth / 6 + 'px'}>
                    <Typography variant="body2" fontWeight={"bold"} >Powered by</Typography>
                </Box>
                <Box display="flex" justifyContent="space-evenly" paddingX={drawerWidth / 6 + 'px'} paddingY="20px">
                    <IconButton
                        sx={{
                            ml: 1,
                            animationDuration: 2,
                            height: 30,
                            borderRadius: 1,
                        }}>
                        <Link
                            color={theme.palette.mode === 'dark' ? 'white' : 'black'}
                            target="_blank" rel="noopener noreferrer"
                            variant="caption" display="block"
                            underline="none"
                            href="https://coingecko.com">
                            <Box display="flex" alignItems="center" alignContent="center">
                                <Box
                                    //sx={{ display: { xs: 'none', md: 'flex' } }}
                                    >
                                    <img src={CoingeckoColor} alt="Coingecko Logo" width="25" />
                                </Box>
                            </Box>
                        </Link>
                    </ IconButton>
                    <IconButton
                        sx={{
                            ml: 1,
                            animationDuration: 2,
                            height: 30,
                            borderRadius: 1,
                        }}>
                        <Link
                            color={theme.palette.mode === 'dark' ? 'white' : 'black'}
                            target="_blank" rel="noopener noreferrer"
                            variant="caption" display="block"
                            underline="none"
                            href="https://cloud.debank.com/">
                            <Box display="flex" alignItems="center" alignContent="center">

                                <Box
                                    >
                                    <img src={DebankColor} alt="Debank Logo" width="25" />
                                </Box>
                            </Box>
                        </Link>
                    </ IconButton>
                    <IconButton
                        sx={{
                            ml: 1,
                            animationDuration: 2,
                            height: 30,
                            borderRadius: 1,
                        }}>
                        <Link
                            color={theme.palette.mode === 'dark' ? 'white' : 'black'}
                            target="_blank" rel="noopener noreferrer"
                            variant="caption" display="block"
                            underline="none"
                            href="https://www.alchemy.com/">
                            <Box display="flex" alignItems="center" alignContent="center">

                                <Box
                                    >
                                    <img src={AlchemyBlue} alt="Alchemy Logo" width="25" />
                                </Box>
                            </Box>
                        </Link>
                    </ IconButton>

                </Box>
            </Box>
        </Drawer>
    );
}
export default MenuDrawer;
