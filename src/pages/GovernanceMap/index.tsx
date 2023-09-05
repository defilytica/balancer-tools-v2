import useGetBalAddresses from "../../data/balancer/useGetBalAddresses";
import { Box } from "@mui/system";
import { Grid, Typography } from "@mui/material";
import {BalancerSmartContractData} from "../../data/static/balancerStaticTypes";
import contractData from "../../data/static/balancer-v2/governanceMap.json";
import ContractOverviewTable from "../../components/Tables/ContractOverviewTable";

export default function GovernanceMap() {
    const smartContractData: BalancerSmartContractData = contractData;

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
                <Grid mt={2} container sx={{ justifyContent: "center" }}>
                    <Grid item xs={11}>
                        <Typography variant={'h5'}>Governance Map</Typography>
                    </Grid>
                    <Grid item mt={2} xs={11}>
                           <ContractOverviewTable contracts={smartContractData.contracts} />
                    </Grid>
                </Grid>

        </Box>
    );
}
