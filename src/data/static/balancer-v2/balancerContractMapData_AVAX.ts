export const balancerContractMapData_AVAX = [
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
        value: '0x239e55F427D44C3cc793f49bFB507ebe76638a2b',
        x: 200,
        y: 400
    },
    {
        name: 'Protocol Fee Withdrawer',
        value: '0x8F42aDBbA1B16EaAE3BB5754915E0D06059aDd75',
        x: 400,
        y: 600
    },
    {
        name: 'Mimic Smart Vault - DNE',
        value: '0x326A7778DB9B741Cb2acA0DE07b9402C7685dAc6',
        x: 600,
        y: 400
    },
    {
        name: 'Protocol Fee Multisig',
        value: '0x326A7778DB9B741Cb2acA0DE07b9402C7685dAc6',
        x: 800,
        y: 400
    },
    {
        name: 'DAO Multisig',
        value: '0x17b11FF13e2d7bAb2648182dFD1f1cfa0E4C7cf3',
        x: 800,
        y: 0

    },
    {
        name: 'Voting Escrow Delegation Proxy',
        value: '0x0c6052254551EAe3ECac77B01DFcf1025418828f',
        x: 800,
        y: -400

    },
    {
        name: 'veBoost',
        value: '0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5',
        x: 600,
        y: -400

    },
    {
        name: 'Authorizer Adaptor Entry Point',
        value: '0x4E7bBd911cf1EFa442BC1b2e9Ea01ffE785412EC',
        x: 200,
        y: -400

    },
    {
        name: 'Authorizer Adaptor',
        value: '0xdAE7e32ADc5d490a43cCba1f0c736033F2b4eFca',
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
        value: '0x8df317a729fcaA260306d7de28888932cb579b88',
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
        value: '0xE42FFA682A26EF8F25891db4882932711D42e467',
        x: 1400,
        y: 200
    },
    {
        name: 'Balancer Maxi LM Multisig',
        value: '0x326A7778DB9B741Cb2acA0DE07b9402C7685dAc6',
        x: 1400,
        y: 400
    },
    {
        name: 'Root Gauges - Mainnet',
        value: '0x956074628A64a316086f7125074a8A52d3306321',
        x: 1000,
        y: 0
    },
    {
        name: 'L2BalancerPseudoMinter',
        value: '0x85a80afee867aDf27B50BdB7b76DA70f1E853062',
        x: 800,
        y: -200
    },
    {
        name: 'BAL Token',
        value: '0xe15bcb9e0ea69e6ab9fa080c4c4a5632896298c3',
        x: 1000,
        y: -200
    },
    {
        name: 'Root Gauge Factory',
        value: '0x22625eEDd92c81a219A83e1dc48f88d54786B017',
        x: 1000,
        y: 200
    },
    {
        name: 'Child Chain Gauge',
        value: '0x4132f7AcC9dB7A6cF7BE2Dd3A9DC8b30C7E6E6c8',
        x: 1200,
        y: 0
    },
    {
        name: 'Child Chain Gauge Factory',
        value: '0xf23b4DB826DbA14c0e857029dfF076b1c0264843',
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
        value: '0x45fFd460cC6642B8D8Fb12373DFd77Ceb0f4932B',
        x: 1400,
        y: 800
    },
    {
        name: 'Emergency subDAO Multisig',
        value: '0x308f8d3536261C32c97D2f85ddc357f5cCdF33F0',
        x: 1400,
        y: 0
    },
    {
        name: 'L2LayerZeroBridgeForward',
        value: '0x4638ab64022927C9bD5947607459D13f57f1551C',
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

export const balancerContractDataLinks_AVAX = [
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
            type: 'dotted'
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
        source: 'Child Chain Gauge',
        target: 'Root Gauge Factory',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'Child Chain Gauge Factory',
        target: 'Child Chain Gauge',
        lineStyle: {
            type: 'dotted'
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
        source: 'L2LayerZeroBridgeForward',
        target: 'veBoost',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'L2LayerZeroBridgeForward',
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
