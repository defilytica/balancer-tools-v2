import {Box} from "@mui/system";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar, CircularProgress,
    Divider,
    Grid,
    Link,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useGetBalancerContractPermissions} from "../../data/balancer-docs/useGetBalancerContractPermissions";
import {getEtherscanLink} from "../../utils";
import {useActiveNetworkVersion} from "../../state/application/hooks";
import * as React from "react";
import {deepPurple} from "@mui/material/colors";
import {generateIdenticon} from "../../utils/generateIdenticon";

export default function SmartContractPermissions() {


    const [activeNetwork] = useActiveNetworkVersion()
    const {data, isLoading, error} = useGetBalancerContractPermissions(activeNetwork.v3NetworkID.toLowerCase());


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
            {data.length > 1 ?
            <Grid mt={2} container sx={{justifyContent: "center"}}>
                <Grid item xs={11}>
                    <Typography variant={'h5'}>Smart Contract Permissions</Typography>
                </Grid>
                <Grid item xs={11}>
                    <Typography variant={'caption'}>Browse the Balancer V2 Smart Contract Permission state</Typography>
                </Grid>
                <Grid item mt={2} xs={11}>
                    <div>
                        {data.map(permission => (
                            <Accordion key={`${permission.Contract}-${permission.Fx}-${Math.random()}`}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon/>}
                                    aria-controls="panel-content"
                                    id="panel-header"
                                >
                                    <Box>
                                        <Typography>{permission.Contract} - {permission.Fx.split('(')[0]}</Typography>
                                        <Typography variant={'caption'}>({permission.Deployment})</Typography>
                                    </Box>

                                </AccordionSummary>
                                <AccordionDetails>
                                    <List>
                                        <ListItem>
                                            <ListItemText primary="Function" secondary={permission.Fx}/>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Deployment" secondary={permission.Deployment}/>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Authorized Caller Addresses"
                                                secondary={
                                                    <Box mt={1}>
                                                        {permission.Authorized_Caller_Addresses.map((address, index) => (
                                                            <React.Fragment key={address}>
                                                                <Box display="flex" alignItems="center"
                                                                     alignContent="center">
                                                                    <Box mr={1}>
                                                                        <Avatar
                                                                            sx={{
                                                                                bgcolor: deepPurple[500],
                                                                                height: 25,
                                                                                width: 25,
                                                                                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)'
                                                                            }}
                                                                            src={generateIdenticon(address)}
                                                                        />
                                                                    </Box>
                                                                    <Link
                                                                        href={getEtherscanLink(address, 'address', activeNetwork)}
                                                                        target='_blank'>
                                                                        {address}
                                                                    </Link>
                                                                    <Box ml={1}>
                                                                    {permission.Authorized_Caller_Names[index] && (
                                                                        <span> ({permission.Authorized_Caller_Names[index]})</span>
                                                                    )}
                                                                    </Box>
                                                                </Box>
                                                                {index !== permission.Authorized_Caller_Addresses.length - 1 &&
                                                                    <Divider/>
                                                                }
                                                            </React.Fragment>
                                                        ))}
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </div>
                </Grid>
            </Grid>
                :
                <CircularProgress />
            }
        </Box>
    );
}
