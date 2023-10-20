export const balancerContractMapData_ZKEVM = [
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
        y: 200,
    },
    {
        name: 'Protocol Fee Percentages Provider',
        value: '0x1802953277FD955f9a254B80Aa0582f193cF1d77',
        x: 200,
        y: 400
    },
    {
        name: 'Protocol Fee Withdrawer',
        value: '0x230a59F4d9ADc147480f03B0D3fFfeCd56c3289a',
        x: 400,
        y: 600
    },
    {
        name: 'Mimic Smart Vault - DNE',
        value: '0xB59Ab49CA8d064E645Bf2c546d9FE6d1d4147a09',
        x: 600,
        y: 400
    },
    {
        name: 'Protocol Fee Multisig',
        value: '0xB59Ab49CA8d064E645Bf2c546d9FE6d1d4147a09',
        x: 800,
        y: 400
    },
    {
        name: 'DAO Multisig',
        value: '0x2f237e7643a3bF6Ef265dd6FCBcd26a7Cc38dbAa',
        x: 800,
        y: 0

    },
    {
        name: 'Voting Escrow Delegation Proxy',
        value: '0xc7E5ED1054A24Ef31D827E6F86caA58B3Bc168d7',
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
        value: '0xb9aD3466cdd42015cc05d4804DC68D562b6a2065',
        x: 200,
        y: -400

    },
    {
        name: 'Authorizer Adaptor',
        value: '0xdcdbf71A870cc60C6F9B621E28a7D3Ffd6Dd4965',
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
        value: '0x956CCab09898C0AF2aCa5e6C229c3aD4E93d9288',
        x: 1400,
        y: 200
    },
    {
        name: 'Balancer Maxi LM Multisig',
        value: '0xB59Ab49CA8d064E645Bf2c546d9FE6d1d4147a09',
        x: 1400,
        y: 400
    },
    {
        name: 'Root Gauges - Mainnet',
        value: '0x48799A2B0b9ec11E4fa158c781AD8bFAbB892D58',
        x: 1000,
        y: 0
    },
    {
        name: 'L2BalancerPseudoMinter',
        value: '0x475D18169BE8a89357A9ee3Ab00ca386d20fA229',
        x: 800,
        y: -200
    },
    {
        name: 'BAL Token',
        value: '0x120ef59b80774f02211563834d8e3b72cb1649d6',
        x: 1000,
        y: -200
    },
    {
        name: 'Root Gauge Factory',
        value: '0x9bF951848288cCD87d06FaC426150262cD3447De',
        x: 1000,
        y: 200
    },
    {
        name: 'Child Chain Gauge',
        value: '0x59562f93c447656F6E4799fC1FC7c3d977C3324F',
        x: 1200,
        y: 0
    },
    {
        name: 'Child Chain Gauge Factory',
        value: '0x2498A2B0d6462d2260EAC50aE1C3e03F4829BA95',
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
        value: '0x4678731DC41142A902a114aC5B2F77b63f4a259D',
        x: 1200,
        y: 800
    },
    {
        name: 'BatchRelayerLibrary',
        value: '0x54f8F9d28e26Fa5864cfA80f50A5Df95fD85f46a',
        x: 1400,
        y: 800
    },
    {
        name: 'Emergency subDAO Multisig',
        value: '0x79b131498355daa2cC740936fcb9A7dF76A86223',
        x: 1400,
        y: 0
    },
    {
        name: 'L2LayerZeroBridgeForwarder',
        value: '0xDEd7Fef7D8eCdcB74F22f0169e1A9EC696e6695d',
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

export const balancerContractDataLinks_ZKEVM = [
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
        target: 'Protocol Fee Multisig',
        lineStyle: {
            curveness: -0.4
        }
    },
    {
        source: 'Protocol Fee Multisig',
        target: 'Protocol Fee Withdrawer',
        lineStyle: {
            curveness: 0.2,
            type: 'dotted'
        }
    },
    {
        source: 'Protocol Fee Multisig',
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
