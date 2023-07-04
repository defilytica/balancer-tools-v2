import axios from 'axios';
import { useState, useEffect } from 'react';
import { HiddenHandIncentives } from './hiddenHandTypes';

const API_URL = 'https://api.hiddenhand.finance/proposal/balancer';

export const useGetHHVotingIncentives = (): { incentives: HiddenHandIncentives | null } => {
    const [incentives, setIncentives] = useState<HiddenHandIncentives | null>(null);

    useEffect(() => {
        const fetchBalancerIncentives = () => {
            axios
                .get(API_URL)
                .then((response) => {
                    const json: HiddenHandIncentives = response.data;
                    setIncentives(json);
                })
                .catch((error) => {
                    console.error(error);
                    setIncentives(null);
                });
        };
        fetchBalancerIncentives();
    }, []);

    return { incentives };
};
