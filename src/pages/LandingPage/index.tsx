import React from 'react';
import {
    Typography,
    Button,
    Grid,
    Container,
    Box,
    useTheme,
    Chip,
    alpha,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LinkIcon from '@mui/icons-material/Link';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import HandymanIcon from '@mui/icons-material/Handyman';
import MapIcon from '@mui/icons-material/Map';
import KeyIcon from '@mui/icons-material/Key';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PostAddIcon from '@mui/icons-material/PostAdd';

const fadeInUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const subtleFloat = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
`;

const HeroSection = styled(Box)(({ theme }) => ({
    minHeight: '50vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: theme.spacing(8, 2, 4),
    position: 'relative',
    animation: `${fadeInUp} 0.8s ease-out`,
}));

const GlassCard = styled(Box)(({ theme }) => ({
    position: 'relative',
    borderRadius: 20,
    padding: theme.spacing(4),
    background:
        theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.4)
            : alpha('#ffffff', 0.7),
    backdropFilter: 'blur(20px)',
    border: `1px solid ${
        theme.palette.mode === 'dark'
            ? alpha('#ffffff', 0.08)
            : alpha('#000000', 0.06)
    }`,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
        transform: 'translateY(-8px)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
        boxShadow: `0 20px 60px ${alpha(theme.palette.primary.main, 0.15)}`,
        '& .card-icon': {
            animation: `${subtleFloat} 2s ease-in-out infinite`,
        },
        '& .card-arrow': {
            transform: 'translateX(4px)',
            opacity: 1,
        },
    },
}));

const ToolChip = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    padding: theme.spacing(0.75, 1.5),
    borderRadius: 10,
    fontSize: '0.8rem',
    fontWeight: 500,
    background:
        theme.palette.mode === 'dark'
            ? alpha('#ffffff', 0.05)
            : alpha('#000000', 0.04),
    color: theme.palette.text.secondary,
    transition: 'all 0.2s ease',
    '& svg': {
        fontSize: '1rem',
        color: theme.palette.primary.main,
    },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 800,
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
    background:
        theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)'
            : 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
}));

interface Tool {
    title: string;
    description: string;
    link: string;
    icon: React.ReactNode;
    tag: string;
    external?: boolean;
}

const tools: Tool[] = [
    {
        title: 'veBAL Boost',
        description: 'Calculate your veBAL boost multiplier for liquidity mining rewards across Balancer pools.',
        link: '/balancer/veBALBoost',
        icon: <AccountBalanceIcon />,
        tag: 'Calculator',
    },
    {
        title: 'veBAL',
        description: 'Lock BAL tokens for veBAL, vote on gauges and manage your veBAL position on Balancer.',
        link: 'https://balancer.fi/vebal',
        icon: <LinkIcon />,
        tag: 'Governance',
        external: true,
    },
    {
        title: 'Incentive Simulator',
        description: 'Simulate voting incentive returns and model optimal bribe allocation strategies.',
        link: 'https://balancer.defilytica.com/#/incentiveSimulator',
        icon: <HowToVoteIcon />,
        tag: 'Simulator',
        external: true,
    },
    {
        title: 'Gauge Map',
        description: 'Explore the full veBAL gauge ecosystem with an interactive mapping of all active gauges.',
        link: '/balancer/gaugeMap',
        icon: <MapIcon />,
        tag: 'Explorer',
    },
    {
        title: 'Smart Contract Permissions',
        description: 'Inspect and audit Balancer v2 smart contract permissions and authorization structures.',
        link: '/balancer/permissions',
        icon: <KeyIcon />,
        tag: 'Security',
    },
    {
        title: 'Payload Builder',
        description: 'Construct and validate DAO governance payloads for on-chain proposal execution.',
        link: 'https://balancer.defilytica.tools/payload-builder',
        icon: <PostAddIcon />,
        tag: 'Governance',
        external: true,
    },
];

const LandingPage = () => {
    const theme = useTheme();

    return (
        <Container maxWidth="lg" sx={{ pb: 10 }}>
            <HeroSection>
                <Chip
                    label="Balancer Protocol Tooling"
                    size="small"
                    sx={{
                        mb: 3,
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                        background: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}
                />
                <SectionTitle variant="h2" gutterBottom>
                    DeFilytica Tools
                </SectionTitle>
                <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{
                        maxWidth: 560,
                        fontWeight: 400,
                        lineHeight: 1.6,
                        mt: 1,
                    }}
                >
                    Advanced simulation, analytics, and governance tooling
                    for the Balancer ecosystem.
                </Typography>
            </HeroSection>

            {/* Tools Grid */}
            <Box sx={{ animation: `${fadeInUp} 0.8s ease-out 0.2s both` }}>
                <Grid container spacing={3}>
                    {tools.map((tool, index) => {
                        const cardContent = (
                            <GlassCard>
                                <Box
                                    className="card-icon"
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: alpha(theme.palette.primary.main, 0.1),
                                        mb: 2.5,
                                        '& svg': {
                                            fontSize: 24,
                                            color: theme.palette.primary.main,
                                        },
                                    }}
                                >
                                    {tool.icon}
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            mb: 1,
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '1.05rem',
                                                color: 'text.primary',
                                            }}
                                        >
                                            {tool.title}
                                        </Typography>
                                        {tool.external ? (
                                            <OpenInNewIcon
                                                className="card-arrow"
                                                sx={{
                                                    fontSize: 16,
                                                    color: 'text.secondary',
                                                    opacity: 0,
                                                    transition: 'all 0.3s ease',
                                                }}
                                            />
                                        ) : (
                                            <ArrowForwardIcon
                                                className="card-arrow"
                                                sx={{
                                                    fontSize: 18,
                                                    color: 'text.secondary',
                                                    opacity: 0,
                                                    transition: 'all 0.3s ease',
                                                }}
                                            />
                                        )}
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ lineHeight: 1.6, mb: 2 }}
                                    >
                                        {tool.description}
                                    </Typography>
                                </Box>
                                <ToolChip>
                                    {tool.icon}
                                    {tool.tag}
                                </ToolChip>
                            </GlassCard>
                        );

                        return (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                {tool.external ? (
                                    <a
                                        href={tool.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: 'none', display: 'block', height: '100%' }}
                                    >
                                        {cardContent}
                                    </a>
                                ) : (
                                    <RouterLink
                                        to={tool.link}
                                        style={{ textDecoration: 'none', display: 'block', height: '100%' }}
                                    >
                                        {cardContent}
                                    </RouterLink>
                                )}
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>

            {/* External Links Section */}
            <Box
                sx={{
                    mt: 6,
                    animation: `${fadeInUp} 0.8s ease-out 0.4s both`,
                }}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <GlassCard
                            onClick={() =>
                                window.open(
                                    'https://balancer.defilytica.tools',
                                    '_blank',
                                )
                            }
                            sx={{
                                background:
                                    theme.palette.mode === 'dark'
                                        ? `linear-gradient(135deg, ${alpha('#3b82f6', 0.12)} 0%, ${alpha('#1e40af', 0.08)} 100%)`
                                        : `linear-gradient(135deg, ${alpha('#3b82f6', 0.08)} 0%, ${alpha('#1e40af', 0.04)} 100%)`,
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 700, mb: 0.5 }}
                                    >
                                        Operations Dashboard
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        DAO payloads, reward injectors & Chainlink automation
                                    </Typography>
                                </Box>
                                <OpenInNewIcon
                                    sx={{
                                        fontSize: 20,
                                        color: 'text.secondary',
                                        ml: 2,
                                    }}
                                />
                            </Box>
                        </GlassCard>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <GlassCard
                            onClick={() =>
                                window.open(
                                    'https://balancer.defilytica.com',
                                    '_blank',
                                )
                            }
                            sx={{
                                background:
                                    theme.palette.mode === 'dark'
                                        ? `linear-gradient(135deg, ${alpha('#d97706', 0.12)} 0%, ${alpha('#92400e', 0.08)} 100%)`
                                        : `linear-gradient(135deg, ${alpha('#d97706', 0.08)} 0%, ${alpha('#92400e', 0.04)} 100%)`,
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 700, mb: 0.5 }}
                                    >
                                        Analytics Dashboard
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Protocol metrics, pool analytics & TVL tracking
                                    </Typography>
                                </Box>
                                <OpenInNewIcon
                                    sx={{
                                        fontSize: 20,
                                        color: 'text.secondary',
                                        ml: 2,
                                    }}
                                />
                            </Box>
                        </GlassCard>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default LandingPage;
