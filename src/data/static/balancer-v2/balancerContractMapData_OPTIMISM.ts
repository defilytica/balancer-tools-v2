export const balancerContractMapData_OPTIMISM = [
    {
        name: 'Vault',
        value: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
        x: 200,
        y: 800
    },
    {
        name: 'Protocol Fee Collector',
        value: '0xce88686553686DA562CE7Cea497CE749DA109f9F',
        x: 400,
        y: 200
    },
    {
        name: 'Protocol Fee Percentages Provider',
        value: '0xacAaC3e6D6Df918Bf3c809DFC7d42de0e4a72d4C',
        x: 200,
        y: 400
    },
    {
        name: 'Protocol Fee Withdrawer',
        value: '0xC128a9954e6c874eA3d62ce62B468bA073093F25',
        x: 400,
        y: 600
    },
    {
        name: 'Mimic Smart Vault',
        value: '0x94Dd9C6152a2A0BBcB52d3297b723A6F01D5F9f7',
        x: 600,
        y: 400
    },
    {
        name: 'Protocol Fee Multisig',
        value: '0x09Df1626110803C7b3b07085Ef1E053494155089',
        x: 800,
        y: 400
    },
    {
        name: 'DAO Multisig',
        value: '0x043f9687842771b3dF8852c1E9801DCAeED3f6bc',
        x: 800,
        y: 0

    },
    {
        name: 'Voting Escrow Delegation Proxy',
        value: '0x9dA18982a33FD0c7051B19F0d7C76F2d5E7e017c',
        x: 800,
        y: -400

    },
    {
        name: 'veBoost',
        value: '0x6817149cb753BF529565B4D023d7507eD2ff4Bc0',
        x: 600,
        y: -400

    },
    {
        name: 'Authorizer Adaptor Entry Point',
        value: '0xed86ff0c507D3AF5F35d3523B77C17415FCfFaCb',
        x: 200,
        y: -400

    },
    {
        name: 'Authorizer Adaptor',
        value: '0x8F42aDBbA1B16EaAE3BB5754915E0D06059aDd75',
        x: 200,
        y: -200

    },
    {
        name: 'Authorizer',
        value: '0xA331D84eC860Bf466b4CdCcFb4aC09a1B43F3aE6',
        x: 200,
        y: 0

    },
    {
        name: 'Authorizer with Adaptor Validation',
        value: '0xAcf05BE5134d64d150d153818F8C67EE36996650',
        x: 200,
        y: 200

    },
    {
        name: 'Liquidity Pools',
        x: 1200,
        y: 200
    },
    {
        name: 'Pool Factories',
        value: '0x4bdCc2fb18AEb9e2d281b0278D946445070EAda7',
        x: 1400,
        y: 200
    },
    {
        name: 'Balancer Maxi LM Multisig',
        value: '0x09Df1626110803C7b3b07085Ef1E053494155089',
        x: 1400,
        y: 400
    },
    {
        name: 'Root Gauges - Mainnet',
        value: '0x6A2C2d4502335638d2c2f40f0171253fb2c2db88',
        x: 1000,
        y: 0
    },
    {
        name: 'L2BalancerPseudoMinter',
        value: '0x4fb47126Fa83A8734991E41B942Ac29A3266C968',
        x: 800,
        y: -200
    },
    {
        name: 'BAL Token',
        value: '0xfe8b128ba8c78aabc59d4c64cee7ff28e9379921',
        x: 1000,
        y: -200
    },
    {
        name: 'Root Gauge Factory',
        value: '0x866D4B65694c66fbFD15Dd6fa933D0A6b3940A36',
        x: 1000,
        y: 200
    },
    {
        name: 'Child Chain Gauge',
        value: '0x81cFAE226343B24BA12EC6521Db2C79E7aeeb310',
        x: 1200,
        y: 0
    },
    {
        name: 'Child Chain Gauge Factory',
        value: '0xa523f47A933D5020b23629dDf689695AA94612Dc',
        x: 1200,
        y: -400
    },
    {
        name: 'StakelessGaugeCheckpointer-v2',
        value: '0x0C8f71D19f87c0bD1b9baD2484EcC3388D5DbB98',
        x: 800,
        y: 200
    },
    {
        name: 'BatchRelayer',
        value: '0x03F1ab8b19bcE21EB06C364aEc9e40322572a1e9',
        x: 1200,
        y: 800
    },
    {
        name: 'BatchRelayerLibrary',
        value: '0x96484f2aBF5e58b15176dbF1A799627B53F13B6d',
        x: 1400,
        y: 800
    },
    {
        name: 'Emergency subDAO Multisig',
        value: '0x3c58668054c299bE836a0bBB028Bee3aD4724846',
        x: 1400,
        y: 0
    },
    {
        name: 'L2LayerZeroBridgeForwarder',
        value: '0xbef13D1e54D0c79DA8B0AD704883E1Cea7EB2100',
        x: 400,
        y: -400
    },
    {
        name: 'Mainnet Smart Vault',
        value: '',
        x: 600,
        y: 200
    },
]

export const balancerContractDataLinks_OPTIMISM = [
    {
        source: 'Vault',
        target: 'Protocol Fee Collector'
    },
    {
        source: 'Liquidity Pools',
        target: 'Vault',
        lineStyle: {
            curveness: 0.5
        }
    },
    {
        source: 'Protocol Fee Collector',
        target: 'Protocol Fee Withdrawer',
        lineStyle: {
            curveness: -0.2
        }
    },
    {
        source: 'Protocol Fee Withdrawer',
        target: 'Protocol Fee Collector',
        lineStyle: {
            curveness: -0.2,
            type: 'dotted'
        }
    },
    {
        source: 'Protocol Fee Percentages Provider',
        target: 'Protocol Fee Collector'
    },
    {
        source: 'BAL Token',
        target: 'Child Chain Gauge'
    },
    {
        source: 'Protocol Fee Withdrawer',
        target: 'Mimic Smart Vault',
        lineStyle: {
            curveness: -0.2
        }
    },
    {
        source: 'Mimic Smart Vault',
        target: 'Protocol Fee Withdrawer',
        lineStyle: {
            curveness: -0.2,
            type: 'dotted'
        }
    },
    {
        source: 'Mimic Smart Vault',
        target: 'Mainnet Smart Vault',
    },
    {
        source: 'Pool Factories',
        target: 'Liquidity Pools',
        lineStyle: {
            type: 'dashed'
        }
    },
    {
        source: 'Balancer Maxi LM Multisig',
        target: 'Liquidity Pools',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'L2BalancerPseudoMinter',
        target: 'BAL Token',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'Root Gauges - Mainnet',
        target: 'L2BalancerPseudoMinter',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'Root Gauge Factory',
        target: 'Root Gauges - Mainnet',
        lineStyle: {
            type: 'dashed'
        }
    },
    {
        source: 'Liquidity Pools',
        target: 'Child Chain Gauge Factory',
        lineStyle: {
            type: 'dashed',
            curveness: -0.3
        }
    },
    {
        source: 'Child Chain Gauge',
        target: 'Root Gauge Factory',
        lineStyle: {
            type: 'dashed'
        }
    },
    {
        source: 'Child Chain Gauge Factory',
        target: 'Child Chain Gauge',
        lineStyle: {
            type: 'dashed'
        }
    },
    {
        source: 'DAO Multisig',
        target: 'Authorizer Adaptor Entry Point',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'DAO Multisig',
        target: 'Authorizer',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'Authorizer Adaptor Entry Point',
        target: 'Authorizer Adaptor',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'Authorizer Adaptor',
        target: 'Authorizer',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'Authorizer',
        target: 'Authorizer with Adaptor Validation',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'StakelessGaugeCheckpointer-v2',
        target: 'Root Gauges - Mainnet',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'Voting Escrow Delegation Proxy',
        target: 'veBoost',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'L2LayerZeroBridgeForwarder',
        target: 'veBoost',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'L2LayerZeroBridgeForwarder',
        target: 'Child Chain Gauge',
        lineStyle: {
            type: 'dotted',
            curveness: 0.7,
        }
    },
    {
        source: 'Emergency subDAO Multisig',
        target: 'Liquidity Pools',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'BatchRelayerLibrary',
        target: 'BatchRelayer',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'BatchRelayerLibrary',
        target: 'Vault',
        lineStyle: {
            type: 'dotted'
        }
    }
]
