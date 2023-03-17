import Box from '@mui/material/Box';
import { Grid, Typography, List, ListItem } from '@mui/material';

export default function VeBALVoter() {

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
                            <ListItem>Port Zekrakens VeBAL Voter</ListItem>
                            <ListItem>Use Analytics Pool components</ListItem>
                        </List>
                    </Typography>
                </Grid>
            </Grid>
            
        </Box>
    );
}