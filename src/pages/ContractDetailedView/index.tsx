import {Box} from "@mui/system";
import {Avatar, Card, Divider, Grid, Link, Typography} from "@mui/material";
import * as React from "react";
import contractData from '../../data/static/balancer-v2/governanceMap_MAINNET.json'
import {BalancerSmartContractData} from "../../data/static/balancerStaticTypes";
import {deepPurple} from "@mui/material/colors";
import {generateIdenticon} from "../../utils/generateIdenticon";
import {getEtherscanLink} from "../../utils";
import {useActiveNetworkVersion} from "../../state/application/hooks";
import { useParams } from "react-router-dom";

export default function ContractDetailedView() {
    const params = useParams();
    const id = params.id ? params.id : '';
    const smartContractData: BalancerSmartContractData = contractData;
    const contract = smartContractData.contracts.find(contract => contract.id === id) ?
        smartContractData.contracts.find(contract => contract.id === id) : smartContractData.contracts[0]
    const [activeNetwork] = useActiveNetworkVersion()


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
                <Grid container spacing={2} sx={{justifyContent: "center"}}>
                    <Grid item xs={11} md={9}>
                        <Box>
                            <Typography variant="h5">{contract.title}</Typography>
                            <Typography variant="body1">{contract.description}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={11} md={9}>
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
                            <Box>
                                <Link href={getEtherscanLink(contract.id, 'address', activeNetwork)}
                                      target='_blank'>
                                    {contract.id}
                                </Link>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={11} md={9}>
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
                                    <Typography fontWeight={"bold"} variant="subtitle1">{method.methodName}</Typography>
                                    <Divider/>
                                    <Typography variant="body2">{method.methodDescription}</Typography>
                                    {method.methodVariables.map((variable, varIndex) => (
                                        <Box sx={{ mt: 1 }}>

                                            {method.methodVariables.map((variable, varIndex) => (
                                                <Box
                                                    key={varIndex}
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        color: '#0066cc', // You can adjust the color as needed
                                                    }}
                                                >
                                                    <Divider orientation="vertical" flexItem />
                                                    <Divider orientation="horizontal" flexItem />
                                                    <Box
                                                        key={variable.name + variable.type}
                                                        sx={{
                                                            width: '10px',
                                                            height: '100%',
                                                            backgroundColor: '#0066cc', // You can adjust the color as needed
                                                            marginRight: '8px',
                                                        }}
                                                    />
                                                    <Divider orientation="horizontal" flexItem />

                                                    <Typography variant="body2">
                                                        {variable.name}: <span style={{ color: '#818080' }}>{variable.type}</span>
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    ))}
                                </Box>
                            </Card>
                        ))}
                    </Grid>
                    <Grid item xs={11} md={9}>
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
                                    <Typography fontWeight={"bold"} variant="subtitle1">{method.methodName}</Typography>
                                    <Divider/>
                                    <Typography variant="body2">{method.methodDescription}</Typography>
                                    {method.methodVariables.map((variable, varIndex) => (
                                        <Box sx={{ mt: 1 }}>

                                            {method.methodVariables.map((variable, varIndex) => (
                                                <Box
                                                    key={varIndex}
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        color: '#0066cc', // You can adjust the color as needed
                                                    }}
                                                >
                                                    <Divider orientation="vertical" flexItem />
                                                    <Divider orientation="horizontal" flexItem />
                                                    <Box
                                                        key={variable.name + variable.type}
                                                        sx={{
                                                            width: '10px',
                                                            height: '100%',
                                                            backgroundColor: '#0066cc', // You can adjust the color as needed
                                                            marginRight: '8px',
                                                        }}
                                                    />
                                                    <Divider orientation="horizontal" flexItem />

                                                    <Typography variant="body2">
                                                        {variable.name}: <span style={{ color: '#818080' }}>{variable.type}</span>
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    ))}
                                </Box>
                            </Card>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Box> : null
    );
}
