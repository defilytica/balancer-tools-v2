export const balancerContractMapData_ARBITRUM = [
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
        value: '0x5ef4c5352882b10893b70DbcaA0C000965bd23c5',
        x: 200,
        y: 400
    },
    {
        name: 'Protocol Fee Withdrawer',
        value: '0x70Bbd023481788e443472e123AB963e5EBF58D06',
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
        value: '0x7c68c42De679ffB0f16216154C996C354cF1161B',
        x: 800,
        y: 400
    },
    {
        name: 'DAO Multisig',
        value: '0xaF23DC5983230E9eEAf93280e312e57539D098D0',
        x: 800,
        y: 0

    },
    {
        name: 'Voting Escrow Delegation Proxy',
        value: '0x81cFAE226343B24BA12EC6521Db2C79E7aeeb310',
        x: 800,
        y: -400

    },
    {
        name: 'veBoost',
        value: '0x6B5dA774890Db7B7b96C6f44e6a4b0F657399E2e',
        x: 600,
        y: -400

    },
    {
        name: 'Authorizer Adaptor Entry Point',
        value: '0x97207B095e4D5C9a6e4cfbfcd2C3358E03B90c4A',
        x: 200,
        y: -400

    },
    {
        name: 'Authorizer Adaptor',
        value: '0x0F3e0c4218b7b0108a3643cFe9D3ec0d4F57c54e',
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
        value: '0x6B1Da720Be2D11d95177ccFc40A917c2688f396c',
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
        value: '0xc7E5ED1054A24Ef31D827E6F86caA58B3Bc168d7',
        x: 1400,
        y: 200
    },
    {
        name: 'Balancer Maxi LM Multisig',
        value: '0xc38c5f97B34E175FFd35407fc91a937300E33860',
        x: 1400,
        y: 400
    },
    {
        name: 'Root Gauges - Mainnet',
        value: '0x90DDAa2A6D192Db2F47195d847626F94E940c7Ac',
        x: 1000,
        y: 0
    },
    {
        name: 'L2BalancerPseudoMinter',
        value: '0x239e55F427D44C3cc793f49bFB507ebe76638a2b',
        x: 800,
        y: -200
    },
    {
        name: 'BAL Token',
        value: '0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a56B8',
        x: 1000,
        y: -200
    },
    {
        name: 'Root Gauge Factory',
        value: '0x1c99324EDC771c82A0DCCB780CC7DDA0045E50e7',
        x: 1000,
        y: 200
    },
    {
        name: 'Child Chain Gauge',
        value: '0xfC745035F31BCbaEb2D1a89aA9171495c671F6cE',
        x: 1200,
        y: 0
    },
    {
        name: 'Child Chain Gauge Factory',
        value: '0x6817149cb753BF529565B4D023d7507eD2ff4Bc0',
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
        value: '0x598ce0f1ab64B27256759ef99d883EE51138b9bd',
        x: 1200,
        y: 800
    },
    {
        name: 'BatchRelayerLibrary',
        value: '0xD87F44Df0159DC78029AB9CA7D7e57E7249F5ACD',
        x: 1400,
        y: 800
    },
    {
        name: 'Emergency subDAO Multisig',
        value: '0xf404C5a0c02397f0908A3524fc5eb84e68Bbe60D',
        x: 1400,
        y: 0
    },
    {
        name: 'L2LayerZeroBridgeForward',
        value: '0x598ce0f1ab64B27256759ef99d883EE51138b9bd',
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

export const balancerContractDataLinks_ARBITRUM = [
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
