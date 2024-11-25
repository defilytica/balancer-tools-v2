import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { ECharts } from 'echarts';
import { ethers } from 'ethers';
import { useTheme } from '@mui/material/styles'

export interface VestingPosition {
    amount: string;
    vestingEnds: number;
    claimed: boolean;
}

interface VestingChartProps {
    vestingPositions: VestingPosition[];
}

const VestingChart: React.FC<VestingChartProps> = ({ vestingPositions }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<ECharts | null>(null);

    const theme = useTheme()

    useEffect(() => {
        if (chartRef.current) {
            chartInstance.current = echarts.init(chartRef.current);
        }

        const options = {

            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    const date = new Date(params[0].data[0] * 1000).toLocaleString();
                    const amount = params[0].data[1];
                    return `Date: ${date.toLocaleString()}<br/>Amount: ${amount}`;
                },
            },
            xAxis: {
                type: 'time',
                name: 'Unlock Date',
                nameLocation: 'middle',
                nameGap: 30,
                axisLabel: {
                    formatter: (value: number) => {
                        const date = new Date(value * 1000);
                        return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`;
                    },
                },
            },
            yAxis: {
                type: 'value',
                name: 'Amount (stkAuraBAL)',
                nameLocation: 'middle',
                nameGap: 60,
            },
            series: [
                {
                    name: 'Vesting Amount',
                    type: 'line',
                    data: vestingPositions.map(position => [position.vestingEnds, parseFloat(ethers.utils.formatUnits(position.amount, 18))]),
                },
            ],
        };

        if (chartInstance.current) {
            chartInstance.current.setOption(options);
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.dispose();
            }
        };
    }, [vestingPositions]);

    return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default VestingChart;
