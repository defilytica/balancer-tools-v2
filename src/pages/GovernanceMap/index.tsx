import useGetBalAddresses from "../../data/balancer/useGetBalAddresses";
import { Box } from "@mui/system";
import { CircularProgress, Grid, Typography } from "@mui/material";

export default function GovernanceMap() {
    const balAddresses = useGetBalAddresses();
    console.log(balAddresses);

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
            {1 > 0 ? (
                <Grid mt={2} container sx={{ justifyContent: "center" }}>
                    <Grid item xs={11}>
                        <Typography variant={'h5'}>Governance Map</Typography>
                    </Grid>
                    <Grid item mt={2} xs={11}>
                        <ul>
                            {Object.entries(balAddresses).map(([key, value]) => (
                                <li key={key}>
                                    <Typography>
                                        {key}: {value}
                                    </Typography>
                                </li>
                            ))}
                        </ul>
                    </Grid>
                </Grid>
            ) : (
                <CircularProgress />
            )}
        </Box>
    );
}
