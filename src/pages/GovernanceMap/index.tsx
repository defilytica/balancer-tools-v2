import {Box} from "@mui/system";
import {Card, Grid, Typography} from "@mui/material";
import {BalancerSmartContractData} from "../../data/static/balancerStaticTypes";
import contractData_MAINNET from "../../data/static/balancer-v2/governanceMap_MAINNET.json";
import contractData_ARBITRUM from "../../data/static/balancer-v2/governanceMap_ARBITRUM.json";
import ContractOverviewTable from "../../components/Tables/ContractOverviewTable";
import BalancerV2ContractMap from "../../components/Echarts/BalancerV2ContractMap";
import {isMobile} from "react-device-detect";
import {useActiveNetworkVersion} from "../../state/application/hooks";
import {ArbitrumNetworkInfo, EthereumNetworkInfo} from "../../constants/networks";

export default function GovernanceMap() {

    const [activeNetwork] = useActiveNetworkVersion()

    const smartContractData: BalancerSmartContractData = activeNetwork === EthereumNetworkInfo ? contractData_MAINNET :
                                                            activeNetwork === ArbitrumNetworkInfo ? contractData_ARBITRUM :
                                                                contractData_MAINNET;


    return (
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid mt={2} container sx={{ justifyContent: "center" }}>
          <Grid item xs={11}>
            <Typography variant={"h5"}>Governance Map</Typography>
          </Grid>
          <Grid item xs={11}>
            <Typography variant={"caption"}>
              Browse Balancer Contracts. Click on a contract to get more
              information.
            </Typography>
          </Grid>
          {/* Legend */}
          <Grid item xs={11} mt={1}>

          </Grid>
          <Grid item xs={11} mt={1}>
            <Card sx={{ overflowX: "auto" }}>
              <BalancerV2ContractMap height={isMobile ? "400px" : "800px"} />
                <Box ml={2} mb={1}>
                    <Typography variant={"body1"}>Legend</Typography>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                width: "30px",
                                height: "2px",
                                backgroundColor: "white", // Use the color you prefer
                                marginRight: "5px",
                            }}
                        />
                        <Typography variant={"body2"}>Fee Flows</Typography>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "5px",
                        }}
                    >
                        <div
                            style={{
                                width: "30px",
                                height: "2px",
                                border: "1px dotted white", // Use the color you prefer
                                marginRight: "5px",
                            }}
                        />
                        <Typography variant={"body2"}>
                            Permissioned Interactions
                        </Typography>
                    </div>
                </Box>
            </Card>
          </Grid>
          <Grid item xs={11} mt={1}>
            <Typography variant={"h5"}>Contract Overview </Typography>
          </Grid>
          <Grid item xs={11} mt={1}>
            <Typography variant={"caption"}>
              A list of all deployed contracts. Click on an item to get more
              information.
            </Typography>
          </Grid>
          <Grid item mt={2} xs={11}>
            <ContractOverviewTable contracts={smartContractData.contracts} />
          </Grid>
        </Grid>
      </Box>
    );
}
