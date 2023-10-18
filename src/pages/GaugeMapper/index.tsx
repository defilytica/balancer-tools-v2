import useGetBalancerStakingGauges from "../../data/balancer/useGetBalancerStakingGauges";
import useDecorateL1Gauges from "../../data/balancer/useDecorateL1Gauges";
import useDecorateL2Gauges from "../../data/balancer/useDeocrateL2Gauges";
import GovGaugeTable from "../../components/Tables/GovGaugeTable";
import {Box} from "@mui/system";
import {CircularProgress, Grid, Typography} from "@mui/material";
import useGetBalancerV3StakingGauges from "../../data/balancer-api-v3/useGetBalancerV3StakingGauges";

export default function GaugeMapper(){
    const gaugeData = useGetBalancerV3StakingGauges();
    const l1GaugeData = useDecorateL1Gauges(gaugeData);
    const decoratedGaugeData = useDecorateL2Gauges(l1GaugeData);

    return(
        <Box
            sx={{
                flexGrow: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}
        >
            {decoratedGaugeData && decoratedGaugeData.length > 1 ?
                <Grid mt={2} container sx={{ justifyContent: "center" }}>
                    <Grid item xs={11}>
                        <Typography variant={'h5'}>Gauge Map</Typography>
                    </Grid>
                    <Grid item xs={11}>
                        <Typography variant={'caption'}>Browse a list of Gauges across all Balancer deployments. Note: this list only contains gauges enabled for BAL rewards.</Typography>
                    </Grid>
                    <Grid item mt={2} xs={11}>
                        <Box sx={{ maxWidth: '90%' }}>
                        <GovGaugeTable gaugeDatas={decoratedGaugeData} />
                        </Box>
                    </Grid>
                </Grid>
            :
                <CircularProgress />
            }
        </Box>
    )
}
