import { SupportedChainId } from '@uniswap/sdk-core';
import MULTICALL_ABI from './abi.json';

const MULTICALL_NETWORKS: { [chainId in SupportedChainId]: string } = {
    [SupportedChainId.ARBITRUM_GOERLI]: '',
    [SupportedChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
    [SupportedChainId.GOERLI]: '',
    [SupportedChainId.ARBITRUM_ONE]: '',
    [SupportedChainId.CELO]: '',
    [SupportedChainId.CELO_ALFAJORES]: '',
    [SupportedChainId.OPTIMISM]: '',
    [SupportedChainId.OPTIMISM_GOERLI]: '',
    [SupportedChainId.POLYGON]: '',
    [SupportedChainId.POLYGON_MUMBAI]: '',
    [SupportedChainId.BNB]: '',


};

export { MULTICALL_ABI, MULTICALL_NETWORKS };