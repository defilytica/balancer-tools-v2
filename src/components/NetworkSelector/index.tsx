import {Avatar, Divider, FormControl, MenuItem, Select, SelectChangeEvent} from "@mui/material"
import {Box} from "@mui/system"
import {
    ArbitrumNetworkInfo,
    AvalancheNetworkInfo,
    BaseNetworkInfo,
    EthereumNetworkInfo,
    FraxtalNetworkInfo,
    GnosisNetworkInfo,
    NetworkInfo,
    OptimismNetworkInfo,
    PolygonNetworkInfo,
    PolygonZkEVMNetworkInfo
} from "../../constants/networks"
import {useActiveNetworkVersion} from "../../state/application/hooks"
import ArbitrumLogo from '../../assets/svg/arbitrum.svg'
import EtherLogo from '../../assets/svg/ethereum.svg'
import PolygonLogo from '../../assets/svg/polygon.svg'
import GnosisLogo from '../../assets/svg/gnosis.svg'
import PolygonZkevmLogo from '../../assets/svg/zkevm.svg'
import OpLogo from '../../assets/svg/optimism.svg'
import AvalancheLogo from '../../assets/svg/avalancheLogo.svg'
import BaseLogo from '../../assets/svg/base.svg'
import {useLocation, useNavigate} from "react-router-dom";
import {useSwitchNetwork} from 'wagmi'

// Utility function to remove the base network segment from a path
const removeBaseNetworkFromPath = (path: string, networks: NetworkInfo[]): string => {
    // Generate an array of possible network routes to match in the path
    const networkRoutes = networks.map(network => network.route.toLowerCase());

    // Split the path into segments
    const pathSegments = path.split('/').filter(segment => segment !== '');

    // Remove the first segment if it matches any network route
    if (networkRoutes.includes(pathSegments[0].toLowerCase())) {
        // Remove the network segment
        pathSegments.shift();
    }

    // Reconstruct the path and return
    return '/' + pathSegments.join('/');
};


const updatePathForNetwork = (network: NetworkInfo, currentPath: string, allNetworks: NetworkInfo[]) => {
    //console.log("currentPath", currentPath);

    // Remove the base network segment from the current path, if present.
    const basePathWithoutNetwork = removeBaseNetworkFromPath(currentPath, allNetworks);

    // Check if the selected network is Ethereum.
    const isEthereumNetwork = network === EthereumNetworkInfo;

    // If it's Ethereum, we return the base path without the network.
    // Otherwise, we add the new network route to the path.
    return isEthereumNetwork
        ? basePathWithoutNetwork
        : `/${network.route.toLowerCase()}${basePathWithoutNetwork}`;
};


export default function NetworkSelector() {

    const [activeNetwork, update] = useActiveNetworkVersion();
    const navigate = useNavigate();
    const location = useLocation();
    const {switchNetwork} =
        useSwitchNetwork()

    const allNetworks = [
        EthereumNetworkInfo,
        PolygonNetworkInfo,
        ArbitrumNetworkInfo,
        PolygonZkEVMNetworkInfo,
        GnosisNetworkInfo,
        OptimismNetworkInfo,
        AvalancheNetworkInfo,
        BaseNetworkInfo,
        FraxtalNetworkInfo
    ];

    const handleNetworkChange = (evt: SelectChangeEvent) => {
        const chainId = evt.target.value as string;
        switchNetwork?.(Number(chainId))
        if (chainId === EthereumNetworkInfo.chainId) {
            update(EthereumNetworkInfo)
            const newPath = updatePathForNetwork(EthereumNetworkInfo, location.pathname, allNetworks)
            navigate(newPath)
        } else if (chainId === PolygonNetworkInfo.chainId) {
            update(PolygonNetworkInfo)
            const newPath = updatePathForNetwork(PolygonNetworkInfo, location.pathname, allNetworks)
            navigate(newPath)
        } else if (chainId === ArbitrumNetworkInfo.chainId) {
            update(ArbitrumNetworkInfo)
            const newPath = updatePathForNetwork(ArbitrumNetworkInfo, location.pathname, allNetworks)
            navigate(newPath)
        } else if (chainId === GnosisNetworkInfo.chainId) {
            update(GnosisNetworkInfo)
            const newPath = updatePathForNetwork(GnosisNetworkInfo, location.pathname, allNetworks)
            navigate(newPath)
        } else if (chainId === PolygonZkEVMNetworkInfo.chainId) {
            update(PolygonZkEVMNetworkInfo)
            const newPath = updatePathForNetwork(PolygonZkEVMNetworkInfo, location.pathname, allNetworks)
            navigate(newPath)
        } else if (chainId === OptimismNetworkInfo.chainId) {
            const newPath = updatePathForNetwork(OptimismNetworkInfo, location.pathname, allNetworks)
            navigate(newPath)
        } else if (chainId === AvalancheNetworkInfo.chainId) {
            update(AvalancheNetworkInfo)
            const newPath = updatePathForNetwork(AvalancheNetworkInfo, location.pathname, allNetworks)
            navigate(newPath)
        } else if (chainId === BaseNetworkInfo.chainId) {
            update(BaseNetworkInfo)
            const newPath = updatePathForNetwork(BaseNetworkInfo, location.pathname, allNetworks)
            navigate(newPath)
        } else if (chainId === FraxtalNetworkInfo.chainId) {
            update(FraxtalNetworkInfo)
            const newPath = updatePathForNetwork(FraxtalNetworkInfo, location.pathname, allNetworks)
            navigate(newPath)
        }
        
    };

    return (
        <FormControl size="small">
            <Select
                sx={{
                    backgroundColor: "background.paper",
                    boxShadow: 2,
                    borderRadius: 2,
                    borderColor: 0,
                }}
                color="primary"
                labelId="networkSelectLabel"
                id="chainSelect"
                onChange={handleNetworkChange}
                value={activeNetwork.chainId ? activeNetwork.chainId : ' '}
                inputProps={{
                    name: 'chainId',
                    id: 'chainId-native-simple',
                }}
            >
                <MenuItem disabled={true} dense={true}>Network selection:</MenuItem>
                <Divider/>
                <MenuItem value={EthereumNetworkInfo.chainId} key="eth">
                    <Box display="flex" alignItems="center">
                        <Box mr={0.5}>
                            <Avatar
                                sx={{
                                    height: 20,
                                    width: 20
                                }}
                                src={EtherLogo}
                            />
                        </Box>
                        <Box>
                            Ethereum
                        </Box>
                    </Box>
                </MenuItem>
                <MenuItem value={PolygonNetworkInfo.chainId} key="poly">
                    <Box display="flex" alignItems="center">
                        <Box mr={0.5}>
                            <Avatar
                                sx={{
                                    height: 20,
                                    width: 20
                                }}
                                src={PolygonLogo}
                            />
                        </Box>
                        <Box>
                            Polygon
                        </Box>
                    </Box>
                </MenuItem>
                <MenuItem value={PolygonZkEVMNetworkInfo.chainId} key="zkevm">
                    <Box display="flex" alignItems="center">
                        <Box mr={0.5}>
                            <Avatar
                                sx={{
                                    height: 20,
                                    width: 20
                                }}
                                src={PolygonZkevmLogo}
                            />
                        </Box>
                        <Box>
                            Polygon zkEVM
                        </Box>
                    </Box>
                </MenuItem>
                <MenuItem value={ArbitrumNetworkInfo.chainId} key="arb">
                    <Box display="flex" alignItems="center">
                        <Box mr={0.5}>
                            <Avatar
                                sx={{
                                    height: 20,
                                    width: 20
                                }}
                                src={ArbitrumLogo}
                            />
                        </Box>
                        <Box>
                            Arbitrum
                        </Box>
                    </Box>
                </MenuItem>
                <MenuItem value={GnosisNetworkInfo.chainId} key="gnosis">
                    <Box display="flex" alignItems="center">
                        <Box mr={0.5}>
                            <Avatar
                                sx={{
                                    height: 20,
                                    width: 20
                                }}
                                src={GnosisLogo}
                            />
                        </Box>
                        <Box>
                            Gnosis
                        </Box>
                    </Box>
                </MenuItem>
                <MenuItem value={OptimismNetworkInfo.chainId} key="optimism">
                    <Box display="flex" alignItems="center">
                        <Box mr={0.5}>
                            <Avatar
                                sx={{
                                    height: 20,
                                    width: 20
                                }}
                                src={OpLogo}
                            />
                        </Box>
                        <Box>
                            Optimism
                        </Box>
                    </Box>
                </MenuItem>
                <MenuItem value={AvalancheNetworkInfo.chainId} key="avalanche">
                    <Box display="flex" alignItems="center">
                        <Box mr={0.5}>
                            <Avatar
                                sx={{
                                    height: 20,
                                    width: 20
                                }}
                                src={AvalancheLogo}
                            />
                        </Box>
                        <Box>
                            Avalanche
                        </Box>
                    </Box>
                </MenuItem>
                <MenuItem value={BaseNetworkInfo.chainId} key="base">
                    <Box display="flex" alignItems="center">
                        <Box mr={0.5}>
                            <Avatar
                                sx={{
                                    height: 20,
                                    width: 20
                                }}
                                src={BaseLogo}
                            />
                        </Box>
                        <Box>
                            Base
                        </Box>
                    </Box>
                </MenuItem>
                <MenuItem value={FraxtalNetworkInfo.chainId} key="fraxtal">
                    <Box display="flex" alignItems="center">
                        <Box mr={0.5}>
                            <Avatar
                                sx={{
                                    height: 20,
                                    width: 20
                                }}
                                src={BaseLogo}
                            />
                        </Box>
                        <Box>
                            Fraxtal
                        </Box>
                    </Box>
                </MenuItem>
            </Select>
        </FormControl>
    );
}
