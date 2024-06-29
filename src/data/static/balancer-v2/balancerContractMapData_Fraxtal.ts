export const balancerContractMapData_FRAXTAL = [
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
        value: '0xf23b4DB826DbA14c0e857029dfF076b1c0264843',
        x: 200,
        y: 400
    },
    {
        name: 'Protocol Fee Withdrawer',
        value: '0x85a80afee867aDf27B50BdB7b76DA70f1E853062',
        x: 400,
        y: 600
    },
    {
        name: 'Mimic Smart Vault',
        value: 'N/A',
        x: 600,
        y: 400
    },
    {
        name: 'Protocol Fee Multisig',
        value: '0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e',
        x: 800,
        y: 400
    },
    {
        name: 'DAO Multisig',
        value: '0x4f22C2784Cbd2B24a172566491Ee73fee1A63c2e',
        x: 800,
        y: 0

    },
    {
        name: 'Voting Escrow Delegation Proxy',
        value: '0xE3881627B8DeeBCCF9c23B291430a549Fc0bE5F7',
        x: 800,
        y: -400

    },
    {
        name: 'veBoost',
        value: '0x1702067424096F07A60e62cceE3dE9420068492D',
        x: 600,
        y: -400

    },
    {
        name: 'Authorizer Adaptor Entry Point',
        value: '0xb9F8AB3ED3F3aCBa64Bc6cd2DcA74B7F38fD7B88',
        x: 200,
        y: -400

    },
    {
        name: 'Authorizer Adaptor',
        value: '0x36caC20dd805d128c1a6Dd16eeA845C574b5A17C',
        x: 200,
        y: -200

    },
    {
        name: 'Authorizer',
        value: '0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5',
        x: 200,
        y: 0

    },
    {
        name: 'Authorizer with Adaptor Validation',
        value: '0x6817149cb753BF529565B4D023d7507eD2ff4Bc0',
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
        value: '0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e',
        x: 1400,
        y: 400
    },
    {
        name: 'Root Gauges - Mainnet',
        value: '0x18CC3C68A5e64b40c846Aa6E45312cbcBb94f71b',
        x: 1000,
        y: 0
    },
    {
        name: 'L2BalancerPseudoMinter',
        value: '0x9805dcfD25e6De36bad8fe9D3Fe2c9b44B764102',
        x: 800,
        y: -200
    },
    {
        name: 'BAL Token',
        value: '0x2FC7447F6cF71f9aa9E7FF8814B37E55b268Ec91',
        x: 1000,
        y: -200
    },
    {
        name: 'Root Gauge Factory',
        value: '0x18CC3C68A5e64b40c846Aa6E45312cbcBb94f71b',
        x: 1000,
        y: 200
    },
    {
        name: 'Child Chain Gauge',
        value: '0x34E040bC0342EbBfBC7a6306EB1B8E6579185c94',
        x: 1200,
        y: 0
    },
    {
        name: 'Child Chain Gauge Factory',
        value: '0xc3ccacE87f6d3A81724075ADcb5ddd85a8A1bB68',
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
        value: '0xb541765F540447646A9545E0A4800A0Bacf9E13D',
        x: 1200,
        y: 800
    },
    {
        name: 'BatchRelayerLibrary',
        value: '0x662112B8CB18889e81459b92CA0f894a2ef2c1B8',
        x: 1400,
        y: 800
    },
    {
        name: 'Emergency subDAO Multisig',
        value: '0xC66d0Ba27b8309D27cCa70064dfb40b73DB6de9E',
        x: 1400,
        y: 0
    },
    {
        name: 'L2LayerZeroBridgeForwarder',
        value: '0xa523f47A933D5020b23629dDf689695AA94612Dc',
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

export const balancerContractDataLinks_FRAXTAL = [
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
