import {Box} from "@mui/system";
import {Avatar, Card, Divider, Grid, Typography} from "@mui/material";
import * as React from "react";
import contractData from '../../data/static/balancer-v2/governanceMap_MAINNET.json'
import {BalancerSmartContractData} from "../../data/static/balancerStaticTypes";
import {deepPurple} from "@mui/material/colors";
import {generateIdenticon} from "../../utils/generateIdenticon";
import {useActiveNetworkVersion} from "../../state/application/hooks";
import {useParams} from "react-router-dom";
import NavCrumbs, {NavElement} from "../../components/NavCrumbs";
import StyledExternalLink from "../../components/StyledExternalLink";
import {
    ArbitrumNetworkInfo, AvalancheNetworkInfo, BaseNetworkInfo,
    EthereumNetworkInfo,
    GnosisNetworkInfo, OptimismNetworkInfo,
    PolygonNetworkInfo, PolygonZkEVMNetworkInfo
} from "../../constants/networks";
import contractData_MAINNET from "../../data/static/balancer-v2/governanceMap_MAINNET.json";
import contractData_ARBITRUM from "../../data/static/balancer-v2/governanceMap_ARBITRUM.json";
import contractData_POLYGON from "../../data/static/balancer-v2/governanceMap_POLYGON.json";
import contractData_GNOSIS from "../../data/static/balancer-v2/governanceMap_GNOSIS.json";
import contractData_ZKEVM from "../../data/static/balancer-v2/governanceMap_ZKEVM.json";
import contractData_AVAX from "../../data/static/balancer-v2/governanceMap_AVAX.json";
import contractData_BASE from "../../data/static/balancer-v2/governanceMap_BASE.json";
import contractData_OPTIMISM from "../../data/static/balancer-v2/governanceMap_OPTIMISM.json";

export default function ContractDetailedView() {
    const params = useParams();
    const [activeNetwork] = useActiveNetworkVersion()
    const id = params.id ? params.id : '';
    const smartContractData: BalancerSmartContractData = activeNetwork === EthereumNetworkInfo ? contractData_MAINNET :
        activeNetwork === ArbitrumNetworkInfo ? contractData_ARBITRUM :
            activeNetwork === PolygonNetworkInfo ? contractData_POLYGON :
                activeNetwork === GnosisNetworkInfo ? contractData_GNOSIS :
                    activeNetwork === PolygonZkEVMNetworkInfo ? contractData_ZKEVM :
                        activeNetwork === AvalancheNetworkInfo ? contractData_AVAX:
                            activeNetwork === BaseNetworkInfo ? contractData_BASE:
                                activeNetwork === OptimismNetworkInfo ? contractData_OPTIMISM :
                                    contractData_MAINNET;

    const contract = smartContractData.contracts.find(contract => contract.id === id) ?
        smartContractData.contracts.find(contract => contract.id === id) : smartContractData.contracts[0]

    //Navigation
    const homeNav: NavElement = {
        name: 'Governance Map',
        link: 'balancer/governanceMap'
    }
    const networkNav: NavElement = {
        name: activeNetwork.name,
        link: 'balancer/governanceMap'
    }
    const navCrumbs: NavElement[] = []
    navCrumbs.push(homeNav)
    navCrumbs.push(networkNav)


    return (
        contract ?
            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Grid
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Grid container spacing={1} sx={{justifyContent: "center"}}>
                        <Grid item xs={11} md={9}>
                            <Box
                                display="flex"
                                alignItems="center"
                                sx={{justifyContent: {xs: 'flex-start', md: 'space-between'}}}
                            >
                                <NavCrumbs crumbSet={navCrumbs} destination={id}/>

                            </Box>
                        </Grid>
                        <Grid item xs={11} md={9} mt={1}>
                            <Box
                                display="flex"
                                alignItems="center"
                                sx={{justifyContent: {xs: 'flex-start', md: 'space-between'}}}
                            >
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
                                    <Typography variant="h5">{contract.title}</Typography>
                                </Box>
                                <StyledExternalLink address={id} type={'address'} activeNetwork={activeNetwork}/>
                            </Box>
                        </Grid>
                        <Grid item xs={11} md={9}>
                            <Divider/>
                            <Box mt={1} maxWidth={900}>
                                <Typography variant="body1">{contract.description}</Typography>
                            </Box>
                        </Grid>
                        <Grid
                            mt={3}
                            container
                            sx={{
                                direction: {xs: 'column', sm: 'row'}
                            }}
                            justifyContent="center"
                            alignItems="left"
                            alignContent="left"

                        >
                            <Grid
                                item
                                xs={11}
                                md={4.5}
                            >
                                <Typography variant="h6">Read Methods</Typography>
                                {contract.readMethods.map((method, index) => (
                                    <Card
                                        key={index + method.methodName}
                                        sx={{
                                            m: 1,
                                            maxWidth: '550px'
                                        }}

                                    >
                                        <Box key={index} m={1}>
                                            <Typography fontWeight={"bold"}
                                                        variant="subtitle1">{method.methodName}</Typography>
                                            <Divider/>
                                            <Typography variant="body2">{method.methodDescription}</Typography>
                                            <Box sx={{mt: 1}}>

                                                {method.methodVariables.map((variable, varIndex) => (
                                                    <Box
                                                        key={varIndex}
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            color: '#0677E8FF',
                                                        }}
                                                    >
                                                        <Divider orientation="vertical" flexItem/>
                                                        <Divider orientation="horizontal" flexItem/>
                                                        <Box
                                                            key={variable.name + variable.type}
                                                            sx={{
                                                                width: '10px',
                                                                height: '100%',
                                                                backgroundColor: '#0677E8FF',
                                                                marginRight: '8px',
                                                            }}
                                                        />
                                                        <Divider orientation="horizontal" flexItem/>

                                                        <Typography variant="body2">
                                                            {variable.name}: <span
                                                            style={{color: '#818080'}}>{variable.type}</span>
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>
                                    </Card>
                                ))}
                            </Grid>
                            <Grid
                                item
                                xs={11}
                                md={4.5}
                            >
                                <Typography variant="h6">Write Methods</Typography>
                                {contract.writeMethods.map((method, index) => (
                                    <Card
                                        key={index + method.methodName}
                                        sx={{
                                            m: 1,
                                            maxWidth: '550px'
                                        }}

                                    >
                                        <Box key={index} m={1}>
                                            <Typography fontWeight={"bold"}
                                                        variant="subtitle1">{method.methodName}</Typography>
                                            <Divider/>
                                            <Typography variant="body2">{method.methodDescription}</Typography>
                                            <Box sx={{mt: 1}}>

                                                {method.methodVariables.map((variable, varIndex) => (
                                                    <Box
                                                        key={varIndex}
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            color: '#0677E8FF',
                                                        }}
                                                    >
                                                        <Divider orientation="vertical" flexItem/>
                                                        <Divider orientation="horizontal" flexItem/>
                                                        <Box
                                                            key={variable.name + variable.type}
                                                            sx={{
                                                                width: '10px',
                                                                height: '100%',
                                                                backgroundColor: '#0677E8FF',
                                                                marginRight: '8px',
                                                            }}
                                                        />
                                                        <Divider orientation="horizontal" flexItem/>

                                                        <Typography variant="body2">
                                                            {variable.name}: <span
                                                            style={{color: '#818080'}}>{variable.type}</span>
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>
                                    </Card>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box> : null
    );
}
