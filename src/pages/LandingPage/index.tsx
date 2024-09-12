import React from 'react';
import { Typography, Button, Grid, Card, CardContent, CardActions, Container, Box, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import BalanceIcon from '@mui/icons-material/Balance';
import BuildIcon from '@mui/icons-material/Build';

const StyledContainer = styled(Container)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: theme.shadows[10],
    },
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    '& > svg': {
        fontSize: 60,
        color: theme.palette.primary.main,
    },
}));

const LandingPage = () => {
    const theme = useTheme();

    const tools = [
        {
            title: "Balancer",
            description: "Calculate veBAL boost, utilize the veBAL multi-voter or explore Balancer v2 smart contracts",
            link: "/balancer/veBALBoost",
            icon: <BalanceIcon />
        },
        {
            title: "Balancer Operations UI",
            description: "Create DAO payloads, explore reward injectors or Chainlink automation infrastructure deployed for Balancer",
            link: "https://balancer.defilytica.tools",
            icon: <BuildIcon />
        }
    ];

    return (
        <StyledContainer maxWidth="lg">
            <Box sx={{ mb: 6 }}>
                <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Welcome to DeFilytica Tools
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
                    Explore our advanced tooling and simulation applications
                </Typography>
            </Box>
            <Grid container spacing={4}>
                {tools.map((tool, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <StyledCard>
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <IconWrapper>
                                    {tool.icon}
                                </IconWrapper>
                                <Typography gutterBottom variant="h5" component="h2" align="center" sx={{ fontWeight: 'bold' }}>
                                    {tool.title}
                                </Typography>
                                <Typography align="center" variant="body1" sx={{ mb: 2 }}>
                                    {tool.description}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                                <Button
                                    size="large"
                                    variant="contained"
                                    component={tool.link.startsWith('http') ? 'a' : RouterLink}
                                    to={tool.link.startsWith('http') ? undefined : tool.link}
                                    href={tool.link.startsWith('http') ? tool.link : undefined}
                                    target={tool.link.startsWith('http') ? "_blank" : undefined}
                                    rel={tool.link.startsWith('http') ? "noopener noreferrer" : undefined}
                                    sx={{
                                        borderRadius: theme.shape.borderRadius,
                                        padding: '10px 30px',
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        fontSize: '1.1rem',
                                    }}
                                >
                                    Explore
                                </Button>
                            </CardActions>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
        </StyledContainer>
    );
};

export default LandingPage;
