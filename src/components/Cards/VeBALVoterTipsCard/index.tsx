import React, {useState} from 'react';
import { Card, CardContent, Typography, List, Modal,  Button, ListItem, Divider, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const VeBALVoterTipsCard: React.FC = () => {

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    return (
        <>
            <Button
                variant="outlined"
                onClick={handleOpen}
                endIcon={<InfoIcon />}>Hints</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Card
                    sx={{
                        boxShadow: 3,
                        border: '1px solid grey',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxWidth: 500,
                    }}
                >
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Tips for Using the veBAL Multi-Voter Tool
                </Typography>
                <List>
                    <ListItem>
                        <Typography>
                            The veBAL Multi-Voter tool combines Hidden Hand and Paladin Quest incentive market places.
                            This tool does not guarantee the accuracy of the displayed data. Always do your own research in the associated voting incentive markets.
                        </Typography>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <Typography>
                            You can vote on up to 8 gauges, including resetting weights on gauges you have previously voted on.
                            e.g. set a previous vote to 0% and set 7 other votes to a percentage that should add up in total to 100%.
                            The tool only allows for correct configurations and greyes out the "Vote for Gauges" Button if the configuration is incorrect.
                        </Typography>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <Typography>
                            The "Incentive Optimizoor" is an experimental feature designed to find an optimal reward configuration for the user.
                            It comes with certain constraints and currently only sets votes in steps of 10 percentage points.
                        </Typography>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <Typography>
                            Use this tool at your own risk.
                        </Typography>
                    </ListItem>
                </List>
                <Button variant="contained" onClick={handleClose}>Close</Button>
            </CardContent>
        </Card>

            </Modal>
        </>
    );
};

export default VeBALVoterTipsCard;
