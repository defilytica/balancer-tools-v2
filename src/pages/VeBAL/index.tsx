import Box from '@mui/material/Box';
import { Grid, Typography, List, ListItem } from '@mui/material';


export default function VeBAL() {

    return (
        <Box sx={{ flexGrow: 2 }}>
            <Grid
                container
                spacing={2}
                sx={{ justifyContent: 'center' }}
            >
                <Grid item mt={1} xs={11}>
                <Typography>
                    TODOs
                        <List>
                            <ListItem>Rebuild veBAL boost calculator</ListItem>
                            <ListItem>Token estimator</ListItem>
                        </List>
                    </Typography>
                </Grid>
            </Grid>
            
        </Box>
    );
}