export const balancerContractMapData_GNOSIS = [
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
        value: '0x41B953164995c11C81DA73D212ED8Af25741b7Ac',
        x: 200,
        y: 400
    },
    {
        name: 'Protocol Fee Withdrawer',
        value: '0xdAE7e32ADc5d490a43cCba1f0c736033F2b4eFca',
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
        value: '0x14969B55a675d13a1700F71A37511bc22D90155a',
        x: 800,
        y: 400
    },
    {
        name: 'DAO Multisig',
        value: '0x2a5AEcE0bb9EfFD7608213AE1745873385515c18',
        x: 800,
        y: 0

    },
    {
        name: 'Voting Escrow Delegation Proxy',
        value: '0x7A2535f5fB47b8e44c02Ef5D9990588313fe8F05',
        x: 800,
        y: -400

    },
    {
        name: 'veBoost',
        value: '0x5DbAd78818D4c8958EfF2d5b95b28385A22113Cd',
        x: 600,
        y: -400

    },
    {
        name: 'Authorizer Adaptor Entry Point',
        value: '0x8F42aDBbA1B16EaAE3BB5754915E0D06059aDd75',
        x: 200,
        y: -400

    },
    {
        name: 'Authorizer Adaptor',
        value: '0x5aDDCCa35b7A0D07C74063c48700C8590E87864E',
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
        value: '0x03F3Fb107e74F2EAC9358862E91ad3c692712054',
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
        value: '0x14969B55a675d13a1700F71A37511bc22D90155a',
        x: 1400,
        y: 400
    },
    {
        name: 'Root Gauges - Mainnet',
        value: '0xb1af0D75AEEa1c13c450ffc7e12083072DAf41eb',
        x: 1000,
        y: 0
    },
    {
        name: 'L2BalancerPseudoMinter',
        value: '0xA8920455934Da4D853faac1f94Fe7bEf72943eF1',
        x: 800,
        y: -200
    },
    {
        name: 'BAL Token',
        value: '0x7eF541E2a22058048904fE5744f9c7E4C57AF717',
        x: 1000,
        y: -200
    },
    {
        name: 'Root Gauge Factory',
        value: '0x2a18B396829bc29F66a1E59fAdd7a0269A6605E8',
        x: 1000,
        y: 200
    },
    {
        name: 'Child Chain Gauge',
        value: '0x96484f2aBF5e58b15176dbF1A799627B53F13B6d',
        x: 1200,
        y: 0
    },
    {
        name: 'Child Chain Gauge Factory',
        value: '0x83E443EF4f9963C77bd860f94500075556668cb8',
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
        value: '0x3536fD480CA495Ac91E698A703248A8915c137a3',
        x: 1200,
        y: 800
    },
    {
        name: 'BatchRelayerLibrary',
        value: '0xb9aD3466cdd42015cc05d4804DC68D562b6a2065',
        x: 1400,
        y: 800
    },
    {
        name: 'Emergency subDAO Multisig',
        value: '0xd6110A7756080a4e3BCF4e7EBBCA8E8aDFBC9962',
        x: 1400,
        y: 0
    },
    {
        name: 'L2LayerZeroBridgeForwarder',
        value: '0xeb151668006CD04DAdD098AFd0a82e78F77076c3',
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

export const balancerContractDataLinks_GNOSIS = [
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
