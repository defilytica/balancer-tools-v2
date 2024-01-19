import axios from 'axios';
import { useEffect, useState } from 'react';
import { PaladinQuestsV2 } from './paladinTypes';
import { CoingeckoRawData } from "../balancer/useTokens";
import isDev from "../../constants";
import paladinQuestData from '../mocks/paladin-quests.json';

const API_URL = 'https://api.paladin.vote/quest/v2/board/bal';
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3/simple/token_price/ethereum';

export const useGetPaladinQuestsV2 = (): { quests: PaladinQuestsV2[] | null } => {
    const [quests, setQuests] = useState<PaladinQuestsV2[] | null>(null);

    useEffect(() => {
        const fetchPaladinIncentives = async () => {
            try {
                const response = await axios.get(API_URL);
                const mockData = JSON.parse(JSON.stringify(paladinQuestData));
                const questsData: PaladinQuestsV2[] = isDev() ? mockData : response.data;

                // Extract all rewardToken addresses to create the addresses string for Coingecko
                const addresses: string = questsData.map((quest) => quest.rewardToken).join(',');

                // Fetch token prices from CoinGecko
                const coingeckoData = await getTokenPrices(addresses);

                if (coingeckoData) {
                    const updatedQuestsData = questsData.map((quest) => {
                        const tokenPrice = coingeckoData[quest.rewardToken.toLowerCase()]?.usd || 0;

                        return {
                            ...quest,
                        };
                    });

                    setQuests(updatedQuestsData);
                } else {
                    setQuests(questsData);
                }
            } catch (error) {
                console.error(error);
                setQuests(null);
            }
        };

        fetchPaladinIncentives();
    }, []);

    const getTokenPrices = async (addresses: string) => {
        try {
            const queryParams = `?contract_addresses=${addresses}&vs_currencies=usd&include_24hr_change=true`;
            const coingeckoResponse = await fetch(COINGECKO_API_BASE + queryParams);
            const json: CoingeckoRawData = await coingeckoResponse.json();
            return json; // Return the raw Coingecko data without any conversion
        } catch (error) {
            console.log('Coingecko: token_price API not reachable', error);
            return null;
        }
    };

    return { quests };
};
