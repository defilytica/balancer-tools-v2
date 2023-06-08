import Box from '@mui/material/Box';
import { Grid, Typography } from '@mui/material';
import { useUserVeBALLocks } from "../../data/balancer/useUserVeBALLocks";
import MetricsCard from "../../components/Cards/MetricsCard";
import LockPersonIcon from '@mui/icons-material/LockPerson';
import GenericMetricsCard from "../../components/Cards/GenericMetricCard";
import LockClockIcon from '@mui/icons-material/LockClock';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import useGetGaugeData from "../../data/balancer/useGetGaugeData"
import {useGetUserVeBAL} from "../../data/balancer/useGetUserVeBAL";
import useGetSimpleGaugeData from "../../data/balancer/useGetSimpleGaugeData";
import GaugeBoostTable from "../../components/Tables/GaugeBoostTable";

export default function VeBAL() {
  const userLocks = useUserVeBALLocks();
  const userVeBAL = useGetUserVeBAL();
  const gaugeData = useGetGaugeData();
  const simpleGaugeData = useGetSimpleGaugeData();
  console.log("simpleGaugeData", simpleGaugeData);
  console.log(gaugeData);

  const date = new Date(userLocks?.unlockTime ? userLocks?.unlockTime * 1000 : 0);
  const unlockDate = date.toLocaleDateString();

  return (
    <Box sx={{ flexGrow: 2 }}>
      <Grid
        container
        spacing={2}
        sx={{ justifyContent: 'center' }}
      >
        <Grid mt={2} item xs={11}>
          <Box>
            <Typography variant="h5">My veBAL Stats</Typography>
          </Box>
        </Grid>
        <Grid item mt={1} xs={11}>
          <Grid
            container
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{ justifyContent: { md: 'flex-start', xs: 'center' }, alignContent: 'center' }}
          >
            <Box m={1}>
              <MetricsCard
                mainMetric={userLocks?.lockedBalance ? userLocks.lockedBalance : 0}
                mainMetricInUSD={false}
                metricName={'B-80BAL-20WETH'}
                MetricIcon={LockPersonIcon}
              />
            </Box>
            <Box m={1}>
              <MetricsCard
                mainMetric={userVeBAL ? userVeBAL : 0}
                mainMetricInUSD={false}
                metricName={'Current veBAL'}
                MetricIcon={AccountBalanceWalletIcon}
              />
            </Box>
            <Box m={1}>
              <GenericMetricsCard
                mainMetric={unlockDate}
                metricName={'Unlock date'}
                MetricIcon={LockClockIcon}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={11}>
          <Box>
            <Typography variant="h5">Calculate your boost</Typography>
          </Box>
          <Typography>TODO: add investment value</Typography>
        </Grid>
        <Grid item xs={11}>
          <Box>
            <Typography variant="h5">Theoretical Boost across gauges</Typography>
          </Box>
          <Typography>Show a table of the boost and APRs for all pools</Typography>
          <GaugeBoostTable gaugeDatas={simpleGaugeData} />
        </Grid>
      </Grid>
    </Box>
  );
}
