import axios from 'axios';
import { useEffect, useState } from 'react';
import { PaladinQuest } from './paladinTypes';
import { CoingeckoRawData } from "../balancer/useTokens";
import isDev from "../../constants";
import paladinQuestData from '../mocks/paladin-quests.json';

const API_URL = 'https://api.warden.vote/boards/bal/active';
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3/simple/token_price/ethereum';

export const useGetPaladinQuests = (): { quests: PaladinQuest[] | null } => {
    const [quests, setQuests] = useState<PaladinQuest[] | null>(null);

    useEffect(() => {
        const fetchPaladinIncentives = async () => {
            try {
                const response = await axios.get(API_URL);
                const mockData = JSON.parse(JSON.stringify(paladinQuestData));
                const questsData: PaladinQuest[] = isDev() ? mockData : response.data;

                // Extract all rewardToken addresses to create the addresses string for Coingecko
                const addresses: string = questsData.map((quest) => quest.rewardToken).join(',');

                // Fetch token prices from CoinGecko
                const coingeckoData = await getTokenPrices(addresses);

                if (coingeckoData) {
                    const updatedQuestsData = questsData.map((quest) => {
                        const tokenPrice = coingeckoData[quest.rewardToken.toLowerCase()]?.usd || 0;
                        const rewardPerVote = (parseFloat(quest.rewardPerVote) / 1e18 * tokenPrice).toString();
                        const rewardAmountPerPeriod = (parseFloat(quest.rewardAmountPerPeriod) / 1e18 * tokenPrice).toString();

                        return {
                            ...quest,
                            rewardPerVote: rewardPerVote,
                            rewardAmountPerPeriod: rewardAmountPerPeriod,
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
