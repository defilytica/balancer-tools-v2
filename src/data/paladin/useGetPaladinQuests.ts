import axios from 'axios';
import {useEffect, useState} from 'react';
import {PaladinQuest} from './paladinTypes';
import {CoingeckoRawData} from "../balancer/useTokens";
import isDev from "../../constants";
import paladinQuestData from '../mocks/paladin-quests.json'

const API_URL = 'https://api.warden.vote/boards/bal/active';
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3/simple/token_price/ethereum';

export const useGetPaladinQuests = (): { quests: PaladinQuest[] | null } => {
    const [quests, setQuests] = useState<PaladinQuest[] | null>(null);

    // Coingecko data state to store the token prices
    const [coingeckoData, setCoingeckoData] = useState<CoingeckoRawData | null>(null);

    useEffect(() => {
        const fetchPaladinIncentives = async () => {
            try {
                const response = await axios.get(API_URL);
                const mockData = JSON.parse(JSON.stringify(paladinQuestData));
                const questsData: PaladinQuest[] = isDev() ? mockData : response.data;

                // Extract all rewardToken addresses to create the addresses string for Coingecko
                const addresses: string = questsData.map((quest) => quest.rewardToken).join(',');

                // Fetch token prices from CoinGecko
                await getTokenPrices(addresses);

                // Calculate the value per vote and update the questsData accordingly
                if (coingeckoData) {
                        for (const quest of questsData) {
                            const tokenPrice = coingeckoData[quest.rewardToken.toLowerCase()]?.usd || 0; // Default to 0 if token price not found
                            quest.rewardPerVote = (parseFloat(quest.rewardPerVote) / 1e18 * tokenPrice).toString();
                            quest.TotalRewardAmount = (parseFloat(quest.TotalRewardAmount) / 1e18 * tokenPrice).toString();
                        }
                    setQuests(questsData);
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
            setCoingeckoData(json);
        } catch (error) {
            console.log('Coingecko: token_price API not reachable', error);
            setCoingeckoData(null);
        }
    };

    return { quests };
};
