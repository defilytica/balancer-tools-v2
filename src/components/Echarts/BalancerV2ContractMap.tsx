import ReactEcharts,  { EChartsOption } from 'echarts-for-react';
import EChartsRef from 'echarts-for-react';
import {ECElementEvent, graphic} from 'echarts';
import { CircularProgress } from '@mui/material';
import { BalancerChartDataItem} from '../../data/balancer/balancerTypes';
import { formatAmount, formatDollarAmount } from '../../utils/numbers';
import {useEffect, useRef} from "react";
import {
    balancerContractDataLinks,
    balancerContractMapData
} from "../../data/static/balancer-v2/balancerContractMapData";
import {isMobile} from "react-device-detect";

export interface GovMapProps {
    backgroundColor?: string,
    height?: string,

}

// Custom type for the node data
interface NodeData {
    name: string;
    value: string;
    x: number;
    y: number;
}


export default function BalancerV2ContractMap({backgroundColor = '#6a7985', height = '800px'}: GovMapProps) {

    const chartRef = useRef<EChartsRef | null>(null);

    const handleClick = (params: ECElementEvent): void => {
        // Check if the clicked item is a node
        if (params.dataType === 'node') {
            const nodeData = params.data as NodeData;
            const nodeValue = nodeData.value;

            // Construct the URL and navigate to it
            window.location.href = `#/balancer/balancerContracts/${nodeValue}`;
        }
    };

    const nodeSize = isMobile ? 40 : 75;
    const option = {
        toolbox: {
            show: true,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: false },
                saveAsImage: { show: true }
            }
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                type: 'graph',
                layout: 'none',
                symbol: 'roundRect',
                itemStyle: {
                    color: '#0677E8FF',
                },
                symbolSize: nodeSize,
                roam: true,
                label: {
                    show: true,
                    formatter: function(params: { name: any; }) {
                        // Manually add line breaks to limit the width
                        const labelWidth = isMobile ? nodeSize : nodeSize * 0.95; // Width in pixels
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
                    fontSize: isMobile ? 10 : 20
                },
                data: balancerContractMapData,
                // links: [],
                links: balancerContractDataLinks,
                lineStyle: {
                    opacity: 0.9,
                    width: 2,
                    curveness: 0
                }
            }
        ]
    };

    useEffect(() => {
        // Attach the click event handler to the ECharts chart
        if (chartRef.current) {
            chartRef.current.getEchartsInstance().on('click', handleClick);
        }

        return () => {
            // Remove the click event handler when the component unmounts
            if (chartRef.current) {
                chartRef.current.getEchartsInstance().off('click', handleClick);
            }
        };
    }, []);

    return(
            <ReactEcharts
                ref={chartRef}
                option={option}
                style={{ height: height, width: '100%' }}
                className={'react_for_echarts'}
            />
    );
}