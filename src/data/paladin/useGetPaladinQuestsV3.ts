import {useEffect, useState} from "react";
import axios from "axios";
import {PaladinQuestResponse} from "./paladinTypesV3";

const PALADIN_API = 'https://api.paladin.vote/quest/v3/gauges/bal'

const useGetPaladinQuestsV3 = () => {
    const [data, setData] = useState<PaladinQuestResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<PaladinQuestResponse>(PALADIN_API);
                setData(response.data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

export default useGetPaladinQuestsV3;
