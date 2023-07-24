import useGetBalancerStakingGauges from "../../data/balancer/useGetBalancerStakingGauges";
import useDecorateL1Gauges from "../../data/balancer/useDecorateL1Gauges";
import useDecorateL2Gauges from "../../data/balancer/useDeocrateL2Gauges";
import GovGaugeTable from "../../components/Tables/GovGaugeTable";
import {Box} from "@mui/system";
import {CircularProgress, Grid, Typography} from "@mui/material";

export default function GaugeMapper(){
    const gaugeData = useGetBalancerStakingGauges();
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
                        <Typography variant={'caption'}>Browse a list of Gauges across all Balancer Deployments</Typography>
                    </Grid>
                    <Grid item mt={2} xs={11}>
                        <GovGaugeTable gaugeDatas={decoratedGaugeData} />
                    </Grid>
                </Grid>
            :
                <CircularProgress />
            }
        </Box>
    )
}
