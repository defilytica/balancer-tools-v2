import { useState, useEffect } from "react";

export interface HHData {
    pageProps: PageProps
    __N_SSG: boolean
}

export interface PageProps {
    key: string
    page: Page
    proposalsData: ProposalsDaum[]
    partnerSettingsData: PartnerSettingsData
    additionalData: any[]
}

export interface Page {
    slug: string
    name: string
    title: string
    logo: Logo
    symbol: string
    baseSymbol: string
    baseAddress: BaseAddress
    contractName: string
    delegation: boolean
    lockLink: string
    theme: Theme
}

export interface Logo {
    src: string
    height: number
    width: number
    blurDataURL: string
}

export interface BaseAddress {
    ethereum: string
}

export interface Theme {
    primaryColor: string
    colors: Colors
    colorScheme: string
    fontFamily: string
    headings: Headings
}

export interface Colors {
    primary: string[]
}

export interface Headings {
    fontFamily: string
}

export interface ProposalsDaum {
    proposal: string
    proposalHash: string
    title: string
    proposalDeadline: number
    totalValue: number
    voteCount: number
    valuePerVote: number
    bribes: any[]
}

export interface PartnerSettingsData {
    weekTimestamp: number
    voteDecimals: number
    voteUrl: string
    whitelistedTokens: WhitelistedToken[]
    currentDeadline: number
    emissionValuePerVote: number
    totalVote: number
}

export interface WhitelistedToken {
    address: string
    symbol: string
    decimals: number
    chainId: number
}


const useDecorateGaugesWithBribs = (): HHData[] => {
    const [gaugeData, setGaugeData] = useState<HHData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "https://hiddenhand.finance/_next/data/SH8HjuH-t6QJfw_AG3vtv/balancer.json"
                );
                const data = await response.json();
                setGaugeData(data);
            } catch (error) {
                console.error("Error fetching gauge data:", error);
            }
        };

        fetchData();
    }, []);

    return gaugeData;
};

export default useDecorateGaugesWithBribs;
