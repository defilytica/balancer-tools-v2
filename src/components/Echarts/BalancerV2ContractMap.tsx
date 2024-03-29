import ReactEcharts from 'echarts-for-react';
import EChartsRef from 'echarts-for-react';
import {ECElementEvent} from 'echarts';
import {useEffect, useRef} from "react";
import {
    balancerContractDataLinks_MAINNET,
    balancerContractMapData_MAINNET
} from "../../data/static/balancer-v2/balancerContractMapData_MAINNET";
import {
    balancerContractDataLinks_ARBITRUM,
    balancerContractMapData_ARBITRUM
} from "../../data/static/balancer-v2/balancerContractMapData_ARBITRUM";
import {
    balancerContractDataLinks_POLYGON,
    balancerContractMapData_POLYGON
} from "../../data/static/balancer-v2/balancerContractMapData_POLYGON";
import {
    balancerContractDataLinks_GNOSIS,
    balancerContractMapData_GNOSIS
} from "../../data/static/balancer-v2/balancerContractMapData_GNOSIS";
import {
    balancerContractDataLinks_ZKEVM,
    balancerContractMapData_ZKEVM
} from "../../data/static/balancer-v2/balancerContractMapData_ZKEVM";
import {
  balancerContractDataLinks_AVAX,
  balancerContractMapData_AVAX
} from "../../data/static/balancer-v2/balancerContractMapData_AVAX";
import {
  balancerContractDataLinks_BASE,
  balancerContractMapData_BASE
} from "../../data/static/balancer-v2/balancerContractMapData_BASE";
import {
  balancerContractDataLinks_OPTIMISM,
  balancerContractMapData_OPTIMISM
} from "../../data/static/balancer-v2/balancerContractMapData_OPTIMISM";
import {isMobile} from "react-device-detect";
import {useActiveNetworkVersion} from "../../state/application/hooks";
import {ArbitrumNetworkInfo, EthereumNetworkInfo, PolygonNetworkInfo, GnosisNetworkInfo, PolygonZkEVMNetworkInfo, AvalancheNetworkInfo, BaseNetworkInfo, OptimismNetworkInfo} from "../../constants/networks";
import {active} from "@rainbow-me/rainbowkit/dist/css/touchableStyles.css";

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
  const [activeNetwork] = useActiveNetworkVersion();
  const colorsByNetwork = {
    Ethereum: "#7393B3",
    Arbitrum: "#0096FF",
    Polygon: "#5D3FD3",
    Gnosis: "#008080",
    zkEVM: "#CF9FFF",
    Base: "#0052ff",
    Avalanche: "#E84142",
    Optismim: "#E50914"
  };
  const specificNodeIdentifiers = ["Root Gauge Factory", "Root Gauges - Mainnet","StakelessGaugeCheckpointer-v2","Mainnet Smart Vault"]; // Replace with your specific node's identifiers

  // Function to update the color of a specific node
  const updateNodeColor = (node: { name: string; }) => {
    if (specificNodeIdentifiers.includes(node.name)) {
      return {
        ...node,
        itemStyle: {
          color: "#7393B3", // Replace 'yourCustomColor' with your desired color
        },
      };
    }
    return node;
  };

  const handleClick = (params: ECElementEvent): void => {
    // Check if the clicked item is a node
    if (params.dataType === "node") {
      const nodeData = params.data as NodeData;
      const nodeValue = nodeData.value;
      const isEthereumNetwork = activeNetwork === EthereumNetworkInfo;
      console.log("isEthereumNetwork", isEthereumNetwork)

      // Construct the URL and navigate to it
      window.location.href = isEthereumNetwork ? `#/balancer/balancerContracts/${nodeValue}` : `#/${activeNetwork.route}/balancer/balancerContracts/${nodeValue}`;
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
        saveAsImage: { show: true },
      },
    },
    tooltip: {},
    animationDurationUpdate: 1500,
    animationEasingUpdate: "quinticInOut",
    series: [
      {
        type: "graph",
        layout: "none",
        symbol: "roundRect",
        itemStyle: {
          color: "#0677E8FF",
        },
        symbolSize: nodeSize,
        roam: true,
        label: {
          show: true,
          formatter: function (params: { name: any }) {
            // Manually add line breaks to limit the width
            const labelWidth = isMobile ? nodeSize : nodeSize * 0.95; // Width in pixels
            const text = params.name;
            let wrappedText = "";
            let line = "";
            let lineWidth = 0;

            for (let i = 0; i < text.length; i++) {
              const char = text.charAt(i);
              const charWidth = char === "\n" ? 0 : 8; // Adjust the width as needed

              if (lineWidth + charWidth <= labelWidth) {
                line += char;
                lineWidth += charWidth;
              } else {
                // Add a hyphen to indicate word separation
                if (line.trim() !== "") {
                  wrappedText += line + "-\n";
                } else {
                  wrappedText += line + "\n";
                }

                line = char;
                lineWidth = charWidth;
              }
            }

            wrappedText += line; // Add the last line
            return wrappedText;
          },
        },
        edgeSymbol: ["circle", "arrow"],
        edgeSymbolSize: [4, 10],
        edgeLabel: {
          fontSize: isMobile ? 10 : 20,
        },
        data:
          activeNetwork === EthereumNetworkInfo
            ? balancerContractMapData_MAINNET
                .map((node) => ({
                  ...node,
                  itemStyle: { color: colorsByNetwork.Ethereum }, // Use the color for Ethereum
                }))
                .map(updateNodeColor)
            : activeNetwork === ArbitrumNetworkInfo
            ? balancerContractMapData_ARBITRUM
                .map((node) => ({
                  ...node,
                  itemStyle: { color: colorsByNetwork.Arbitrum }, // Use the color for Arbitrum
                }))
                .map(updateNodeColor)
            : activeNetwork === PolygonNetworkInfo
            ? balancerContractMapData_POLYGON
                .map((node) => ({
                  ...node,
                  itemStyle: { color: colorsByNetwork.Polygon }, // Use the color for Polygon
                }))
                .map(updateNodeColor)
            : activeNetwork === GnosisNetworkInfo
            ? balancerContractMapData_GNOSIS
                .map((node) => ({
                  ...node,
                  itemStyle: { color: colorsByNetwork.Gnosis }, // Use the color for Gnosis
                }))
                .map(updateNodeColor)
            : activeNetwork === PolygonZkEVMNetworkInfo
            ? balancerContractMapData_ZKEVM
                .map((node) => ({
                  ...node,
                  itemStyle: { color: colorsByNetwork.zkEVM }, // Use the color for zkEVM
                }))
                .map(updateNodeColor)
            : activeNetwork === AvalancheNetworkInfo
            ? balancerContractMapData_AVAX
                .map((node) => ({
                  ...node,
                  itemStyle: { color: colorsByNetwork.Avalanche }, // Use the color for Avalanche
                }))
                .map(updateNodeColor)
            : activeNetwork === BaseNetworkInfo
            ? balancerContractMapData_BASE
                .map((node) => ({
                  ...node,
                  itemStyle: { color: colorsByNetwork.Base }, // Use the color for Base
                }))
                .map(updateNodeColor)
            : activeNetwork === OptimismNetworkInfo
            ? balancerContractMapData_OPTIMISM
                .map((node) => ({
                  ...node,
                  itemStyle: { color: colorsByNetwork.Optismim }, // Use the color for Optimism
                }))
                .map(updateNodeColor)
            : [], // links: [],
        links:
          activeNetwork === EthereumNetworkInfo
            ? balancerContractDataLinks_MAINNET
            : activeNetwork === ArbitrumNetworkInfo
            ? balancerContractDataLinks_ARBITRUM
            : activeNetwork === PolygonNetworkInfo
            ? balancerContractDataLinks_POLYGON
            : activeNetwork === GnosisNetworkInfo
            ? balancerContractDataLinks_GNOSIS
            : activeNetwork === PolygonZkEVMNetworkInfo
            ? balancerContractDataLinks_ZKEVM
            : activeNetwork === AvalancheNetworkInfo
            ? balancerContractDataLinks_AVAX
            : activeNetwork === BaseNetworkInfo
            ? balancerContractDataLinks_BASE
            : activeNetwork === OptimismNetworkInfo
            ? balancerContractDataLinks_OPTIMISM
            : null,
        lineStyle: {
          opacity: 0.9,
          width: 2,
          curveness: 0,
        },
      },
    ],
  };

  useEffect(() => {
    // Attach the click event handler to the ECharts chart
    if (chartRef.current) {
      chartRef.current.getEchartsInstance().on("click", handleClick);
    }

    return () => {
      // Remove the click event handler when the component unmounts
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().off("click", handleClick);
      }
    };
  }, [activeNetwork]);

  return (
    <ReactEcharts
      ref={chartRef}
      option={option}
      style={{ height: height, width: "100%" }}
      className={"react_for_echarts"}
    />
  );
}