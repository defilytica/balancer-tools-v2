import { useGetTokenListQuery } from '../../apollo/generated/graphql-codegen-generated';
import { tokenClient } from '../../apollo/client';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';


export function useLatestTokenList(clientOverride?: ApolloClient<NormalizedCacheObject>, chainId?: string){
    const { data, loading } = useGetTokenListQuery(
        {
            client: clientOverride ? clientOverride : tokenClient,
            context: {
                headers: {
                    chainId: chainId ? chainId : '10'
                }
            }
        }
        );

    return {
        tokenList: data?.tokenGetTokens,
        loading,
    };
}
