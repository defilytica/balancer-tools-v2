export const balancerContractMapData = [
    {
        name: 'Vault',
        value: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
        x: -50,
        y: 800
    },
    {
        name: 'Protocol Fee Collector',
        value: '0xce88686553686DA562CE7Cea497CE749DA109f9F',
        x: 200,
        y: 400
    },
    {
        name: 'Protocol Fee Percentages Provider',
        value: '0x97207B095e4D5C9a6e4cfbfcd2C3358E03B90c4A',
        x: 0,
        y: 400
    },
    {
        name: 'Protocol Fee Withdrawer',
        value: '0x5ef4c5352882b10893b70DbcaA0C000965bd23c5',
        x: 300,
        y: 600
    },
    {
        name: 'Mimic Smart Vault',
        value: '0x94Dd9C6152a2A0BBcB52d3297b723A6F01D5F9f7',
        x: 500,
        y: 600
    },
    {
        name: 'DAO Treasury',
        x: 800,
        y: 400
    },
    {
        name: 'Protocol Fee Multisig',
        x: 800,
        y: 600
    },

    {
        name: 'Core Pool Voting Incentives',
        x: 1000,
        y: 400
    },
    {
        name: 'veBAL Fee Injector',
        value: '0x8AD2512819A7eae1dd398973EFfaE48dafBe8255',
        x: 600,
        y: 400

    },
    {
        name: 'Fee Distributor',
        value: '',
        x: 600,
        y: 200

    },
    {
        name: 'DAO Multisig',
        value: '',
        x: 400,
        y: 200

    },
    {
        name: 'veBAL',
        value: '',
        x: 600,
        y: 0

    },
    {
        name: 'Smart Wallet Checker',
        value: '',
        x: 600,
        y: -200

    },
    {
        name: 'Voting Escrow Remapper',
        value: '',
        x: 400,
        y: 0

    },
    {
        name: 'Omni Voting Escrow',
        value: '',
        x: 400,
        y: -200

    },
    {
        name: 'Voting Escrow Delegation Proxy',
        value: '',
        x: 400,
        y: -400

    },
    {
        name: 'veBoost',
        value: '',
        x: 200,
        y: -400

    },
    {
        name: 'Layer Zero Multisig',
        value: '',
        x: 0,
        y: -400

    },
    {
        name: 'Layer Zero Endpoint (L2 Boosts)',
        value: '',
        x: 0,
        y: -200

    },
    {
        name: 'Omni Voting Escrow Adaptor',
        value: '',
        x: 200,
        y: 0

    },
    {
        name: 'Authorizer Adaptor Entry Point',
        value: '',
        x: -200,
        y: 0

    },
    {
        name: 'Authorizer Adaptor',
        value: '',
        x: -200,
        y: 200

    },
    {
        name: 'Authorizer',
        value: '',
        x: -200,
        y: 400

    },
    {
        name: 'Authorizer with Adaptor Validation',
        value: '',
        x: -200,
        y: 600

    },
    {
        name: 'Gauge Controller',
        value: '',
        x: 800,
        y: 0

    },
    {
        name: 'Liquidity Pools',
        x: 1200,
        y: 200
    },
    {
        name: 'Pool Factories',
        x: 1400,
        y: 200
    },
    {
        name: 'Balancer Maxi LM Multisig',
        value: '',
        x: 1000,
        y: 200
    },
    {
        name: 'Gauge Adder',
        value: '',
        x: 1000,
        y: 0
    },
    {
        name: 'Gauges',
        x: 1000,
        y: -200
    },
    {
        name: 'Balancer Minter',
        value: '',
        x: 1000,
        y: -400
    },
    {
        name: 'BAL Token',
        value: '',
        x: 1200,
        y: -400
    },
    {
        name: 'Root Gauge Factory',
        value: '',
        x: 800,
        y: -400
    },
    {
        name: 'Balancer Token Admin',
        value: '',
        x: 1000,
        y: -600
    },
    {
        name: 'Child Chain Gauge',
        value: '',
        x: 800,
        y: -600
    },
    {
        name: 'Child Chain Gauge Factory',
        value: '',
        x: 600,
        y: -600
    },
]

export const balancerContractDataLinks = [
    {
        source: 'Vault',
        target: 'Protocol Fee Collector'
    },
    {
        source: 'Vault',
        target: 'Liquidity Pools',
        lineStyle: {
            curveness: -0.5
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
            curveness: -0.2
        }
    },
    {
        source: 'Protocol Fee Percentages Provider',
        target: 'Protocol Fee Collector'
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
            curveness: -0.2
        }
    },
    {
        source: 'Mimic Smart Vault',
        target: 'Protocol Fee Multisig'
    },
    {
        source: 'Protocol Fee Multisig',
        target: 'DAO Treasury'
    },
    {
        source: 'Protocol Fee Multisig',
        target: 'veBAL Fee Injector'
    },
    {
        source: 'Protocol Fee Multisig',
        target: 'Core Pool Voting Incentives'
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
        target: 'Liquidity Pools'
    },
    {
        source: 'Liquidity Pools',
        target: 'Gauges',
        lineStyle: {
            curveness: -0.2,
            type: 'dotted'
        }
    },
    {
        source: 'Balancer Maxi LM Multisig',
        target: 'Gauge Adder'
    },
    {
        source: 'veBAL Fee Injector',
        target: 'Fee Distributor'
    },
    {
        source: 'veBAL',
        target: 'Gauge Controller'
    },
    {
        source: 'Gauge Adder',
        target: 'Gauge Controller'
    },
    {
        source: 'Gauge Adder',
        target: 'Gauges',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'Fee Distributor',
        target: 'veBAL'
    },
    {
        source: 'Gauges',
        target: 'Balancer Minter'
    },
    {
        source: 'BAL Token',
        target: 'Gauges',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'Balancer Token Admin',
        target: 'BAL Token'
    },
    {
        source: 'Root Gauge Factory',
        target: 'Gauges',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'Child Chain Gauge',
        target: 'Root Gauge Factory'
    },
    {
        source: 'Child Chain Gauge Factory',
        target: 'Child Chain Gauge',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'veBAL',
        target: 'Smart Wallet Checker',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'veBAL',
        target: 'Voting Escrow Remapper',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'veBAL',
        target: 'Omni Voting Escrow',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'veBAL',
        target: 'Voting Escrow Delegation Proxy',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'Voting Escrow Delegation Proxy',
        target: 'veBoost'
    },
    {
        source: 'Voting Escrow Remapper',
        target: 'Omni Voting Escrow Adaptor'
    },
    {
        source: 'Omni Voting Escrow Adaptor',
        target: 'Omni Voting Escrow',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'Omni Voting Escrow',
        target: 'Layer Zero Endpoint (L2 Boosts)',
        lineStyle: {
            type: 'dotted'
        }
    },
    {
        source: 'Layer Zero Multisig',
        target: 'Layer Zero Endpoint (L2 Boosts)'
    },
    {
        source: 'DAO Multisig',
        target: 'Authorizer Adaptor Entry Point'
    },
    {
        source: 'Authorizer Adaptor Entry Point',
        target: 'Authorizer Adaptor'
    },
    {
        source: 'Authorizer Adaptor',
        target: 'Authorizer'
    },
    {
        source: 'Authorizer',
        target: 'Authorizer with Adaptor Validation'
    },
]