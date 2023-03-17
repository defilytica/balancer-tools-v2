import Box from '@mui/material/Box';
import { Grid, Typography, List, ListItem } from '@mui/material';


export default function Authorizations() {

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
                            <ListItem>Authorizations mapping</ListItem>
                            <ListItem>Zen Dragon Magic</ListItem>
                        </List>
                    </Typography>
                </Grid>
            </Grid>
            
        </Box>
    );
}