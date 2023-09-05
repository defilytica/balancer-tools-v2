import {Box} from "@mui/system";
import {Grid, Typography} from "@mui/material";
import * as React from "react";
import contractData from '../../data/static/balancer-v2/governanceMap.json'
import {BalancerSmartContractData} from "../../data/static/balancerStaticTypes";

export default function ContractDetailedView() {

    const smartContractData: BalancerSmartContractData = contractData;
    const contract = smartContractData.contracts[0]

    return (
        <Box
            sx={{
                flexGrow: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}
        >
            <Box sx={{ flexGrow: 2 }}>
                <Grid mt={2} container sx={{ justifyContent: 'center' }}>
                    <Grid mt={2} item xs={11}>
                        <Box>
                            <Typography variant="h5">{contract.title}</Typography>
                            <Typography variant="body1">{contract.description}</Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Grid mt={2} container>
                    <Grid item xs={12}>
                        <Typography variant="h6">Read Methods</Typography>
                        {contract.readMethods.map((method, index) => (
                            <Box key={index} mt={2}>
                                <Typography variant="subtitle1">{method.methodName}</Typography>
                                <Typography variant="body2">{method.methodDescription}</Typography>
                                {method.methodVariables.map((variable, varIndex) => (
                                    <Typography key={varIndex} variant="body2">
                                        {variable.name}: {variable.type}
                                    </Typography>
                                ))}
                            </Box>
                        ))}
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Write Methods</Typography>
                        {contract.writeMethods.map((method, index) => (
                            <Box key={index} mt={2}>
                                <Typography variant="subtitle1">{method.methodName}</Typography>
                                <Typography variant="body2">{method.methodDescription}</Typography>
                                {method.methodVariables.map((variable, varIndex) => (
                                    <Typography key={varIndex} variant="body2">
                                        {variable.name}: {variable.type}
                                    </Typography>
                                ))}
                            </Box>
                        ))}
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
