import ReactEcharts from 'echarts-for-react';
import { graphic } from 'echarts';
import { CircularProgress } from '@mui/material';
import { BalancerChartDataItem} from '../../data/balancer/balancerTypes';
import { formatAmount, formatDollarAmount } from '../../utils/numbers';

export interface GovMapProps {
    backgroundColor?: string,
    height?: string,

}


export default function BalancerV2ContractMap({backgroundColor = '#6a7985', height = '500px'}: GovMapProps) {


    const option = {
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                type: 'graph',
                layout: 'none',
                symbolSize: 120,
                roam: true,
                label: {
                    show: true,
                    formatter: function(params: { name: any; }) {
                        // Manually add line breaks to limit the width
                        const labelWidth = 100; // Width in pixels
                        const text = params.name;
                        let wrappedText = '';
                        let line = '';
                        let lineWidth = 0;

                        for (let i = 0; i < text.length; i++) {
                            const char = text.charAt(i);
                            const charWidth = char === '\n' ? 0 : 8; // Adjust the width as needed

                            if (lineWidth + charWidth <= labelWidth) {
                                line += char;
                                lineWidth += charWidth;
                            } else {
                                // Add a hyphen to indicate word separation
                                if (line.trim() !== '') {
                                    wrappedText += line + '-\n';
                                } else {
                                    wrappedText += line + '\n';
                                }

                                line = char;
                                lineWidth = charWidth;
                            }
                        }

                        wrappedText += line; // Add the last line
                        return wrappedText;
                    }
                },
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [4, 10],
                edgeLabel: {
                    fontSize: 20
                },
                data: [
                    {
                        name: 'Vault',
                        value: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
                        x: -50,
                        y: 800
                    },
                    {
                        name: 'Protocol Fee Collector',
                        x: 200,
                        y: 400
                    },
                    {
                        name: 'Protocol Fee Percentages Provider',
                        x: -50,
                        y: 400
                    },
                    {
                        name: 'Protocol Fee Withdrawer',
                        x: 300,
                        y: 600
                    },
                    {
                        name: 'Mimic Smart Vault',
                        x: 500,
                        y: 600
                    },
                    {
                        name: 'DAO Treasury',
                        x: 600,
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
                        x: 800,
                        y: 400
                    },
                    {
                        name: 'Liquidity Pools',
                        x: 1200,
                        y: 500
                    },
                ],
                // links: [],
                links: [
                    {
                        source: 'Vault',
                        target: 'Protocol Fee Collector'
                    },
                    {
                        source: 'Vault',
                        target: 'Liquidity Pools',
                        lineStyle: {
                            curveness: -0.2
                        }
                    },
                    {
                        source: 'Protocol Fee Collector',
                        target: 'Protocol Fee Withdrawer'
                    },
                    {
                        source: 'Protocol Fee Percentages Provider',
                        target: 'Protocol Fee Collector'
                    },
                    {
                        source: 'Protocol Fee Withdrawer',
                        target: 'Mimic Smart Vault'
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
                    }
                ],
                lineStyle: {
                    opacity: 0.9,
                    width: 2,
                    curveness: 0
                }
            }
        ]
    };

    return(
            <ReactEcharts
                option={option}
                style={{ height: height, width: '100%' }}
                className={'react_for_echarts'}
            />
    );
}