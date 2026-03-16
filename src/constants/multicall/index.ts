import { SupportedChainId } from '@uniswap/sdk-core';
import MULTICALL_ABI from './abi.json';

const MULTICALL_NETWORKS: { [chainId in SupportedChainId]: string } = {
    [SupportedChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
    [SupportedChainId.ROPSTEN]: '',
    [SupportedChainId.RINKEBY]: '',
    [SupportedChainId.GOERLI]: '',
    [SupportedChainId.KOVAN]: '',
    [SupportedChainId.ARBITRUM_ONE]: '',
    [SupportedChainId.ARBITRUM_RINKEBY]: '',
    [SupportedChainId.ARBITRUM_GOERLI]: '',
    [SupportedChainId.OPTIMISM]: '',
    [SupportedChainId.OPTIMISM_GOERLI]: '',
    [SupportedChainId.POLYGON]: '',
    [SupportedChainId.POLYGON_MUMBAI]: '',
    [SupportedChainId.CELO]: '',
    [SupportedChainId.CELO_ALFAJORES]: '',
};

export { MULTICALL_ABI, MULTICALL_NETWORKS };