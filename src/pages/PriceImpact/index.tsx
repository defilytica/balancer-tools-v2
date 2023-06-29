import Box from '@mui/material/Box';
import {Grid, Typography, Card, CardContent} from '@mui/material';
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";


export default function PriceImpact() {

    return (
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid
                container
                spacing={2}
                sx={{ justifyContent: 'center' }}
            >
                <Grid item mt={1} xs={11} >
                    <Card sx={{
                        maxWidth: '250px',
                        minHeight: '100px'
                    }}><CardContent>
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            height="100%"
                        >
                            <SelfImprovementIcon sx={{ fontSize: 48 }} />
                            <Typography variant="h5" align="center">
                                Coming soon
                            </Typography>
                        </Box>
                    </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </Box>
    );
}