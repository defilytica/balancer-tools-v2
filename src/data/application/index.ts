import { useActiveNetworkVersion } from '../../state/application/hooks';
import { healthClient } from './../../apollo/client';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import {
    ArbitrumNetworkInfo, AvalancheNetworkInfo, BaseNetworkInfo,
    EthereumNetworkInfo, FraxtalNetworkInfo,
    GnosisNetworkInfo, ModeNetworkInfo, OptimismNetworkInfo,
    PolygonNetworkInfo,
    PolygonZkEVMNetworkInfo
} from '../../constants/networks';

export const SUBGRAPH_HEALTH = gql`
    query health($name: Bytes) {
        indexingStatusForCurrentVersion(subgraphName: $name, subgraphError: allow) {
            synced
            health
            chains {
                chainHeadBlock {
                    number
                }
                latestBlock {
                    number
                }
            }
        }
    }
`;

interface HealthResponse {
    indexingStatusForCurrentVersion: {
        chains: {
            chainHeadBlock: {
                number: string;
            };
            latestBlock: {
                number: string;
            };
        }[];
        synced: boolean;
    };
}

/**
 * Fetch top addresses by volume
 */
export function useFetchedSubgraphStatus(): {
    available: boolean | null;
    syncedBlock: number | undefined;
    headBlock: number | undefined;
} {
    const [activeNetwork] = useActiveNetworkVersion();

    const {loading, error, data} = useQuery<HealthResponse>(SUBGRAPH_HEALTH, {
        client: healthClient,
        fetchPolicy: 'network-only',
        variables: {
            name:
                activeNetwork === EthereumNetworkInfo
                    ? 'blocklytics/ethereum-blocks'
                    : activeNetwork === ArbitrumNetworkInfo
                        ? 'ianlapham/uniswap-arbitrum-one'
                        : activeNetwork === PolygonNetworkInfo
                            ? 'ianlapham/polygon-blocks'
                            : activeNetwork === PolygonZkEVMNetworkInfo
                                ? 'query/48427/bleu-polygon-zkevm-blocks/version/latest'
                                : activeNetwork === AvalancheNetworkInfo
                                    ? 'lynnshaoyu/avalanche-blocks'
                                    : activeNetwork === BaseNetworkInfo
                                        ? 'query/48427/bleu-base-blocks/version/latest'
                                        : activeNetwork === ModeNetworkInfo
                                            ? 'query/48427/bleu-mode-blocks/version/latest'
                                            : activeNetwork === FraxtalNetworkInfo
                                                ? 'https://api.goldsky.com/api/public/project_clwhu1vopoigi01wmbn514m1z/subgraphs/fraxtal-blocks/1.0.0/gn'
                                                : 'x0swapsubgraph/xdai-blocks'
        },
    });

    const parsed = data?.indexingStatusForCurrentVersion;

    if (loading) {
        return {
            available: null,
            syncedBlock: undefined,
            headBlock: undefined,
        };
    }

    if ((!loading && !parsed) || error) {
        return {
            available: false,
            syncedBlock: undefined,
            headBlock: undefined,
        };
    }

    const syncedBlock = parsed?.chains[0].latestBlock.number;
    const headBlock = parsed?.chains[0].chainHeadBlock.number;

    return {
        available: true,
        syncedBlock: syncedBlock ? parseFloat(syncedBlock) : undefined,
        headBlock: headBlock ? parseFloat(headBlock) : undefined,
    };
}
