import * as React from 'react';
import Cookies from 'universal-cookie';
import {Route, Routes, useLocation} from 'react-router-dom';
import DefilyticaIcon from '../../assets/png/defilytica.png'
import MoonIcon from '../../assets/svg/MoonIcon.svg';
import SunIcon from '../../assets/svg/SunIcon.svg';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import {createTheme, styled, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import {getThemeDesignTokens} from '../../assets/theme';
import {useActiveNetworkVersion} from '../../state/application/hooks';
import {EthereumNetworkInfo, SUPPORTED_NETWORK_VERSIONS} from '../../constants/networks';
import NetworkSelector from '../NetworkSelector';
import MenuDrawer from '../MenuDrawer'
import {networkPrefix} from '../../utils/networkPrefix'
import {isMobile} from 'react-device-detect';
import PriceImpact from '../../pages/PriceImpact';
import VeBAL from '../../pages/VeBAL';
import VeBALVoter from '../../pages/VeBALVoter';
import ImpermanentLoss from '../../pages/ImpermanentLoss';
import Authorizations from '../../pages/Authorizations';
import {ConnectButton, darkTheme, lightTheme, RainbowKitProvider} from "@rainbow-me/rainbowkit";
import {WagmiConfig} from "wagmi";
import {chains, wagmiConfig} from "../../wagmi/wagmiConfig";
import {alpha} from "@mui/material";
import GaugeMapper from "../../pages/GaugeMapper";
import BribeSimulator from "../../pages/BribeSimulator";
import GovernanceMap from '../../pages/GovernanceMap';

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const drawerWidth = 240;

//Color mode
const ColorModeContext = React.createContext({
    toggleColorMode: () => {
    }
});

const MainContent = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})<{
    open?: boolean;

}>(({theme, open}) => ({
    flexGrow: 1,
    marginTop: theme.spacing(1),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: '0px',
        marginRight: '0px',
    }),
}));

//Custom Appbar settings
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

//Styled Drawer settings
const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));


function Dashboard() {

    //Drawer logic
    const [open, setOpen] = React.useState(isMobile ? false : true);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    //Color mode cookie
    const cookies = React.useMemo(() => new Cookies(), []);
    let storedTheme = 'dark';
    if (cookies.get('storedTheme') !== null && cookies.get('storedTheme') !== undefined) {
        storedTheme = cookies.get('storedTheme');
    } else {
        storedTheme = 'dark';
    }

    //Color mode handler
    const [mode, setMode] = React.useState<'light' | 'dark'>(storedTheme === 'light' ? 'light' : 'dark');
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
                //Set cookie
                cookies.set('storedTheme', (mode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    //Theme
    const theme = React.useMemo(() => createTheme(getThemeDesignTokens(mode)), [mode]);

    //Network hook
    const location = useLocation();
    const [activeNetwork, setActiveNetwork] = useActiveNetworkVersion();



    React.useEffect(() => {
        if (location.pathname === '/') {
            setActiveNetwork(EthereumNetworkInfo);
        } else {
            SUPPORTED_NETWORK_VERSIONS.forEach((n) => {
                if (location.pathname.includes(n.route.toLocaleLowerCase())) {
                    setActiveNetwork(n);
                }
            });
        }
    }, [location.pathname, setActiveNetwork]);


    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider
                chains={chains}
                theme={
                    mode === 'dark' ? darkTheme(
                            {
                                borderRadius: 'small',
                                accentColor: alpha('#0F172A', 0.8),
                                overlayBlur: "large"

                            }) :
                        lightTheme(
                            {
                                borderRadius: 'small',
                                accentColor: '#9C4ED6'

                            }
                        )}>
                <ColorModeContext.Provider value={colorMode}>
                    <ThemeProvider theme={theme}>
                        <Box sx={{display: 'flex'}}>
                            <CssBaseline/>
                            <AppBar
                                position="fixed"
                                open={open}
                                enableColorOnDark
                                sx={{
                                    background: mode === 'dark' ? "rgba(14, 23, 33, 0.2)" : "rgba(255, 255, 255, 0.2)",
                                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                                    backdropFilter: "blur(5px)"
                                }}>
                                <Toolbar>
                                    <IconButton
                                        aria-label="open drawer"
                                        onClick={handleDrawerOpen}
                                        edge="start"
                                        sx={{mr: 2, ...(open && {display: 'none'})}}
                                    >
                                        <MenuIcon/>
                                    </IconButton>
                                    <Box display="flex" alignItems="center" alignContent="center"
                                         justifyContent='flex-end'>
                                        <Box
                                            sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}>
                                            <img src={DefilyticaIcon} alt="Defilytica Logo" width="30"/>
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            noWrap
                                            component="a"
                                            href="/"
                                            sx={{
                                                mr: 0.5,
                                                display: {xs: 'none', md: 'flex'},
                                                fontWeight: 700,
                                                textDecoration: 'none',
                                                color: (mode === 'dark') ? 'white' : 'black',
                                            }}
                                        >
                                            Tools
                                        </Typography>
                                        <Typography variant="caption"
                                                    sx={{color: (mode === 'dark') ? 'white' : 'black',}}>Prototype</Typography>
                                        <Box position="absolute" right="10px">
                                            <Box display="flex" alignItems="center" alignContent="center"
                                                 justifyContent='flex-end'>

                                                <IconButton
                                                    sx={{
                                                        mr: 1,
                                                        animationDuration: 2,
                                                        width: 40,
                                                        height: 35,
                                                        borderRadius: 2,
                                                        backgroundColor: "background.paper",
                                                        boxShadow: 2,
                                                    }}
                                                    onClick={colorMode.toggleColorMode}>
                                                    <img src={(mode === 'dark') ? MoonIcon : SunIcon} alt="Theme Icon"
                                                         width="25"/>
                                                </IconButton>
                                                <NetworkSelector/>
                                                <Box ml={1}>
                                                    <ConnectButton chainStatus={"none"} showBalance={false}/>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Toolbar>
                            </AppBar>
                            <MenuDrawer
                                open={open}
                                drawerWidth={drawerWidth}
                                handleDrawerClose={handleDrawerClose}
                                activeNetwork={activeNetwork}
                            />
                            <MainContent open={open}>
                                <DrawerHeader/>
                                <Routes>
                                    <Route path="/" element={<VeBAL/>}/>
                                    <Route path={networkPrefix(activeNetwork) + 'priceImpact'}
                                           element={<PriceImpact/>}/>
                                    <Route path={'balancer/veBALBoost'} element={<VeBAL/>}/>
                                    <Route path={'balancer/veBALMultiVoter'} element={<VeBALVoter/>}/>
                                    <Route path={networkPrefix(activeNetwork) + 'impermanentLoss'}
                                           element={<ImpermanentLoss/>}/>
                                    <Route path={networkPrefix(activeNetwork) + 'authorizations'}
                                           element={<Authorizations/>}/>
                                    <Route path={'balancer/gaugeMap'}
                                           element={<GaugeMapper/>}/>
                                    <Route path={'balancer/governanceMap'}
                                           element={<GovernanceMap/>}/>       
                                    <Route path={networkPrefix(activeNetwork) + 'incentiveSimulator'}
                                           element={<BribeSimulator/>}/>
                                    <Route path={'balancer/incentiveSimulator'} element={<BribeSimulator/>}/>

                                    {/* Router v6: no query searches possible anymore. Provide all possible paths */}
                                </Routes>
                            </MainContent>
                        </Box>
                    </ThemeProvider>
                </ColorModeContext.Provider>
            </RainbowKitProvider>
        </WagmiConfig>
    );
}

export default Dashboard;
