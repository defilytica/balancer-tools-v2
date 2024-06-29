export const balancerContractMapData_POLYGON = [
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
        value: '0x42AC0e6FA47385D55Aff070d79eF0079868C48a6',
        x: 200,
        y: 400
    },
    {
        name: 'Protocol Fee Withdrawer',
        value: '0xEF44D6786b2b4d544b7850Fe67CE6381626Bf2D6',
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
        value: '0xeE071f4B516F69a1603dA393CdE8e76C40E5Be85',
        x: 800,
        y: 0

    },
    {
        name: 'Voting Escrow Delegation Proxy',
        value: '0x0f08eEf2C785AA5e7539684aF04755dEC1347b7c',
        x: 800,
        y: -400

    },
    {
        name: 'veBoost',
        value: '0xD961E30156C2E0D0d925A0De45f931CB7815e970',
        x: 600,
        y: -400

    },
    {
        name: 'Authorizer Adaptor Entry Point',
        value: '0xAB093cd16e765b5B23D34030aaFaF026558e0A19',
        x: 200,
        y: -400

    },
    {
        name: 'Authorizer Adaptor',
        value: '0xC128468b7Ce63eA702C1f104D55A2566b13D3ABD',
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
        value: '0x020301b0a99EFB6816B41007765Fb577259eC418',
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
        value: '0xEAedc32a51c510d35ebC11088fD5fF2b47aACF2E',
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
        value: '0x98FF7a7b63130de492eB95dc35119601E1ED5188',
        x: 1000,
        y: 0
    },
    {
        name: 'L2BalancerPseudoMinter',
        value: '0x47B489bf5836f83ABD928C316F8e39bC0587B020',
        x: 800,
        y: -200
    },
    {
        name: 'BAL Token',
        value: '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3',
        x: 1000,
        y: -200
    },
    {
        name: 'Root Gauge Factory',
        value: '0xa98Bce70c92aD2ef3288dbcd659bC0d6b62f8F13',
        x: 1000,
        y: 200
    },
    {
        name: 'Child Chain Gauge',
        value: '0xc9b36096f5201ea332Db35d6D195774ea0D5988f',
        x: 1200,
        y: 0
    },
    {
        name: 'Child Chain Gauge Factory',
        value: '0x22625eEDd92c81a219A83e1dc48f88d54786B017',
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
        value: '0xd18d5D377eb23362e54Fa496597d7E962d56C554',
        x: 1200,
        y: 800
    },
    {
        name: 'BatchRelayerLibrary',
        value: '0x4271de2595c3d85d2D455C5778adF2d7Ad54322C',
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
        value: '0xB98F54A74590a6e681fF664b2Fa22EBfFe1a929E',
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

export const balancerContractDataLinks_POLYGON = [
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
