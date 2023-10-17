export const balancerContractMapData_BASE = [
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
        value: '0xDEd7Fef7D8eCdcB74F22f0169e1A9EC696e6695d',
        x: 200,
        y: 400
    },
    {
        name: 'Protocol Fee Withdrawer',
        value: '0xAcf05BE5134d64d150d153818F8C67EE36996650',
        x: 400,
        y: 600
    },
    {
        name: 'Mimic Smart Vault',
        value: '0x65226673F3D202E0f897C862590d7e1A992B2048',
        x: 600,
        y: 400
    },
    {
        name: 'Protocol Fee Multisig',
        value: '0x65226673F3D202E0f897C862590d7e1A992B2048',
        x: 800,
        y: 400
    },
    {
        name: 'DAO Multisig',
        value: '0xC40DCFB13651e64C8551007aa57F9260827B6462',
        x: 800,
        y: 0

    },
    {
        name: 'Voting Escrow Delegation Proxy',
        value: '0xD87F44Df0159DC78029AB9CA7D7e57E7249F5ACD',
        x: 800,
        y: -400

    },
    {
        name: 'veBoost',
        value: '0xE42FFA682A26EF8F25891db4882932711D42e467',
        x: 600,
        y: -400

    },
    {
        name: 'Authorizer Adaptor Entry Point',
        value: '0x9129E834e15eA19b6069e8f08a8EcFc13686B8dC',
        x: 200,
        y: -400

    },
    {
        name: 'Authorizer Adaptor',
        value: '0x6CaD2ea22BFA7F4C14Aae92E47F510Cd5C509bc7',
        x: 200,
        y: -200

    },
    {
        name: 'Authorizer',
        value: '0x809B79b53F18E9bc08A961ED4678B901aC93213a',
        x: 200,
        y: 0

    },
    {
        name: 'Authorizer with Adaptor Validation',
        value: '0xA69E0Ccf150a29369D8Bbc0B3f510849dB7E8EEE',
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
        value: '0x8df317a729fcaA260306d7de28888932cb579b88',
        x: 1400,
        y: 200
    },
    {
        name: 'Balancer Maxi LM Multisig',
        value: '0x65226673F3D202E0f897C862590d7e1A992B2048',
        x: 1400,
        y: 400
    },
    {
        name: 'Root Gauges - Mainnet',
        value: '0x4C7730DEFfb57EED2e60262f9DAd4f96B8A00138',
        x: 1000,
        y: 0
    },
    {
        name: 'L2BalancerPseudoMinter',
        value: '0x0c5538098EBe88175078972F514C9e101D325D4F',
        x: 800,
        y: -200
    },
    {
        name: 'BAL Token',
        value: '0x4158734D47Fc9692176B5085E0F52ee0Da5d47F1',
        x: 1000,
        y: -200
    },
    {
        name: 'Root Gauge Factory',
        value: '0x8e3B64b3737097F283E965869e3503AA20F31E4D',
        x: 1000,
        y: 200
    },
    {
        name: 'Child Chain Gauge',
        value: '0x9f7E65887413a8497b87bA2058cE6E4Ef4B37013',
        x: 1200,
        y: 0
    },
    {
        name: 'Child Chain Gauge Factory',
        value: '0xb1a4FE1C6d25a0DDAb47431A92A723dd71d9021f',
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
        value: '0x76f7204B62f554b79d444588EDac9dfA7032c71a',
        x: 1200,
        y: 800
    },
    {
        name: 'BatchRelayerLibrary',
        value: '0xDF9B5B00Ef9bca66e9902Bd813dB14e4343Be025',
        x: 1400,
        y: 800
    },
    {
        name: 'Emergency subDAO Multisig',
        value: '0x183C55A0dc7A7Da0f3581997e764D85Fd9E9f63a',
        x: 1400,
        y: 0
    },
    {
        name: 'L2LayerZeroBridgeForward',
        value: '0x8eA89804145c007e7D226001A96955ad53836087',
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

export const balancerContractDataLinks_BASE = [
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
