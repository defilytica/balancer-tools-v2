import {Avatar, Divider, FormControl, MenuItem, Select, SelectChangeEvent} from "@mui/material"
import {Box} from "@mui/system"
import {
    ArbitrumNetworkInfo,
    AvalancheNetworkInfo,
    BaseNetworkInfo,
    EthereumNetworkInfo,
    GnosisNetworkInfo,
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
import {useNavigate} from "react-router-dom";
import {useSwitchNetwork} from 'wagmi'

export default function NetworkSelector() {

    const [activeNetwork, update] = useActiveNetworkVersion();
    const navigate = useNavigate();
    const {switchNetwork} =
        useSwitchNetwork()

    const handleNetworkChange = (evt: SelectChangeEvent) => {
        const chainId = evt.target.value as string;
        switchNetwork?.(Number(chainId))
        if (chainId === EthereumNetworkInfo.chainId) {
            update(EthereumNetworkInfo)
        } else if (chainId === PolygonNetworkInfo.chainId) {
            update(PolygonNetworkInfo)
        } else if (chainId === ArbitrumNetworkInfo.chainId) {
            update(ArbitrumNetworkInfo)
        } else if (chainId === GnosisNetworkInfo.chainId) {
            update(GnosisNetworkInfo)
        } else if (chainId === PolygonZkEVMNetworkInfo.chainId) {
            update(PolygonZkEVMNetworkInfo)
        } else if (chainId === OptimismNetworkInfo.chainId) {
            update(OptimismNetworkInfo)
        } else if (chainId === AvalancheNetworkInfo.chainId) {
            update(AvalancheNetworkInfo)
        } else if (chainId === BaseNetworkInfo.chainId) {
            update(BaseNetworkInfo)
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
            </Select>
        </FormControl>
    );
}
