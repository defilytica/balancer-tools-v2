import '@rainbow-me/rainbowkit/styles.css';

import {
    connectorsForWallets,
    getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, gnosis, polygonZkEvm } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import {ALCHEMY_KEY} from "../data/balancer/constants";
import {
    argentWallet,
    ledgerWallet,
    metaMaskWallet,
    rabbyWallet,
    trustWallet,
    walletConnectWallet
} from "@rainbow-me/rainbowkit/wallets";

export const { chains, publicClient } = configureChains(
    [mainnet, polygon, polygonZkEvm, arbitrum, gnosis, optimism],
    [
        alchemyProvider({ apiKey: ALCHEMY_KEY }),
        publicProvider()
    ]
);

const projectId = 'b22de024eab14e0dc002d5df42381e45';
const { wallets } = getDefaultWallets({
    appName: 'Defilytica Tools',
    projectId,
    chains,
});
const connectors = connectorsForWallets([
    ...wallets,
    {
        groupName: 'Recommended',
        wallets: [
            metaMaskWallet({ projectId, chains }),
            rabbyWallet({ chains }),
            ledgerWallet({ projectId, chains }),
            walletConnectWallet({chains, projectId})
        ],
    },
    {
        groupName: 'Other',
        wallets: [
            argentWallet({ projectId, chains }),
            trustWallet({ projectId, chains }),
            ledgerWallet({ projectId, chains }),
        ],
    },
]);

export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
})
