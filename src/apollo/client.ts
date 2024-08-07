import { ApolloClient, InMemoryCache } from '@apollo/client';
import {
    ArbitrumNetworkInfo, AvalancheNetworkInfo, BaseNetworkInfo,
    EthereumNetworkInfo, FraxtalNetworkInfo, GnosisNetworkInfo, ModeNetworkInfo, OptimismNetworkInfo,
    PolygonNetworkInfo,
    PolygonZkEVMNetworkInfo
} from "../constants/networks";

export const healthClient = new ApolloClient({
    uri: 'https://api.thegraph.com/index-node/graphql',
    cache: new InMemoryCache(),
});

export const blockClient = new ApolloClient({
    uri: EthereumNetworkInfo.blockClientUri,
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    },
});

export const client = new ApolloClient({
    uri: EthereumNetworkInfo.clientUri,
    cache: new InMemoryCache({
        typePolicies: {
            Token: {
                // Singleton types that have no identifying field can use an empty
                // array for their keyFields.
                keyFields: false,
            },
            Pool: {
                // Singleton types that have no identifying field can use an empty
                // array for their keyFields.
                keyFields: false,
            },
        },
    }),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    },
});

export const gaugeClient = new ApolloClient({
    uri: EthereumNetworkInfo.gaugeClientUri,
    cache: new InMemoryCache({
        typePolicies: {
            Token: {
                // Singleton types that have no identifying field can use an empty
                // array for their keyFields.
                keyFields: false,
            },
            Pool: {
                // Singleton types that have no identifying field can use an empty
                // array for their keyFields.
                keyFields: false,
            },
        },
    }),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    },
});

export const arbitrumClient = new ApolloClient({
    uri: ArbitrumNetworkInfo.clientUri,
    cache: new InMemoryCache({
      typePolicies: {
        Token: {
          // Singleton types that have no identifying field can use an empty
          // array for their keyFields.
          keyFields: false,
        },
        Pool: {
          // Singleton types that have no identifying field can use an empty
          // array for their keyFields.
          keyFields: false,
        },
      },
    }),
    queryDeduplication: true,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
  })

  export const arbitrumBlockClient = new ApolloClient({
    uri: ArbitrumNetworkInfo.blockClientUri,
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-first',
      },
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
    },
  })

  export const polygonClient = new ApolloClient({
    uri: PolygonNetworkInfo.clientUri,
    cache: new InMemoryCache({
      typePolicies: {
        Token: {
          // Singleton types that have no identifying field can use an empty
          // array for their keyFields.
          keyFields: false,
        },
        Pool: {
          // Singleton types that have no identifying field can use an empty
          // array for their keyFields.
          keyFields: false,
        },
      },
    }),
    queryDeduplication: true,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-first',
      },
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
    },
  })

  export const polygonBlockClient = new ApolloClient({
    uri: PolygonNetworkInfo.blockClientUri,
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-first',
      },
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
    },
  })

export const polygonZKEVMClient = new ApolloClient({
    uri: PolygonZkEVMNetworkInfo.clientUri,
    cache: new InMemoryCache({
        typePolicies: {
            Token: {
                // Singleton types that have no identifying field can use an empty
                // array for their keyFields.
                keyFields: false,
            },
            Pool: {
                // Singleton types that have no identifying field can use an empty
                // array for their keyFields.
                keyFields: false,
            },
        },
    }),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-first',
        },
        query: {
            fetchPolicy: 'cache-first',
            errorPolicy: 'all',
        },
    },
})

export const polygonZKEVMBlockClient = new ApolloClient({
    uri: 'https://api.studio.thegraph.com/query/48427/bleu-polygon-zkevm-blocks/version/latest',
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-first',
        },
        query: {
            fetchPolicy: 'cache-first',
            errorPolicy: 'all',
        },
    },
})

  export const gnosisClient = new ApolloClient({
    uri: GnosisNetworkInfo.clientUri,
    cache: new InMemoryCache({
      typePolicies: {
        Token: {
          // Singleton types that have no identifying field can use an empty
          // array for their keyFields.
          keyFields: false,
        },
        Pool: {
          // Singleton types that have no identifying field can use an empty
          // array for their keyFields.
          keyFields: false,
        },
      },
    }),
    queryDeduplication: true,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-first',
      },
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
    },
  })

  export const gnosisBlockClient = new ApolloClient({
    uri: GnosisNetworkInfo.blockClientUri,
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-first',
      },
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
    },
  })

export const optimismClient = new ApolloClient({
    uri: OptimismNetworkInfo.clientUri,
    cache: new InMemoryCache({
        typePolicies: {
            Token: {
                // Singleton types that have no identifying field can use an empty
                // array for their keyFields.
                keyFields: false,
            },
            Pool: {
                // Singleton types that have no identifying field can use an empty
                // array for their keyFields.
                keyFields: false,
            },
        },
    }),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    },
})

export const optimismBlockClient = new ApolloClient({
    uri: OptimismNetworkInfo.blockClientUri,
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-first',
        },
        query: {
            fetchPolicy: 'cache-first',
            errorPolicy: 'all',
        },
    },
})

export const avalancheBlockClient = new ApolloClient({
    uri: AvalancheNetworkInfo.blockClientUri,
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-first',
        },
        query: {
            fetchPolicy: 'cache-first',
            errorPolicy: 'all',
        },
    },
})

export const avalancheClient = new ApolloClient({
    uri: AvalancheNetworkInfo.clientUri,
    cache: new InMemoryCache({
        typePolicies: {
            Token: {
                // Singleton types that have no identifying field can use an empty
                // array for their keyFields.
                keyFields: false,
            },
            Pool: {
                // Singleton types that have no identifying field can use an empty
                // array for their keyFields.
                keyFields: false,
            },
        },
    }),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-first',
        },
        query: {
            fetchPolicy: 'cache-first',
            errorPolicy: 'all',
        },
    },
})

export const baseBlockClient = new ApolloClient({
    uri: 'https://api.studio.thegraph.com/query/48427/bleu-base-blocks/version/latest',
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-first',
        },
        query: {
            fetchPolicy: 'cache-first',
            errorPolicy: 'all',
        },
    },
})

export const baseClient = new ApolloClient({
    uri: BaseNetworkInfo.clientUri,
    cache: new InMemoryCache({
        typePolicies: {
            Token: {
                // Singleton types that have no identifying field can use an empty
                // array for their keyFields.
                keyFields: false,
            },
            Pool: {
                // Singleton types that have no identifying field can use an empty
                // array for their keyFields.
                keyFields: false,
            },
        },
    }),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-first',
        },
        query: {
            fetchPolicy: 'cache-first',
            errorPolicy: 'all',
        },
    },
})

export const modeBlockClient = new ApolloClient({
    uri: 'https://api.studio.thegraph.com/query/48427/bleu-mode-blocks/version/latest',
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-first',
        },
        query: {
            fetchPolicy: 'cache-first',
            errorPolicy: 'all',
        },
    },
})

export const modeClient = new ApolloClient({
    uri: ModeNetworkInfo.clientUri,
    cache: new InMemoryCache({
        typePolicies: {
            Token: {
                // Singleton types that have no identifying field can use an empty
                // array for their keyFields.
                keyFields: false,
            },
            Pool: {
                // Singleton types that have no identifying field can use an empty
                // array for their keyFields.
                keyFields: false,
            },
        },
    }),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-first',
        },
        query: {
            fetchPolicy: 'cache-first',
            errorPolicy: 'all',
        },
    },
})

export const fraxtalBlockClient = new ApolloClient({
    uri: 'https://api.goldsky.com/api/public/project_clwhu1vopoigi01wmbn514m1z/subgraphs/fraxtal-blocks/1.0.0/gn',
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-first',
        },
        query: {
            fetchPolicy: 'cache-first',
            errorPolicy: 'all',
        },
    },
})

export const fraxtalClient = new ApolloClient({
    uri: FraxtalNetworkInfo.clientUri,
    cache: new InMemoryCache({
        typePolicies: {
            Token: {
                // Singleton types that have no identifying field can use an empty
                // array for their keyFields.
                keyFields: false,
            },
            Pool: {
                // Singleton types that have no identifying field can use an empty
                // array for their keyFields.
                keyFields: false,
            },
        },
    }),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-first',
        },
        query: {
            fetchPolicy: 'cache-first',
            errorPolicy: 'all',
        },
    },
})

//FTM and OP token client
export const tokenClient = new ApolloClient({
    uri: 'https://backend-v3.beets-ftm-node.com/',
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    },
});

export const balancerV3APIClient = new ApolloClient({
    uri: 'https://api-v3.balancer.fi/',
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    },
});
