import '@rainbow-me/rainbowkit/styles.css';

import {
    getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, gnosis } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import {ALCHEMY_KEY} from "../data/balancer/constants";

export const { chains, publicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum, gnosis],
    [
        alchemyProvider({ apiKey: ALCHEMY_KEY }),
        publicProvider()
    ]
);

const { connectors } = getDefaultWallets({
    appName: 'Defilytica Tools',
    projectId: 'b22de024eab14e0dc002d5df42381e45',
    chains
});

export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
})
