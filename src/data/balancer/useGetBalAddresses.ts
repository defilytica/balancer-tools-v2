import { useState, useEffect } from "react";

export interface BalAddresses {
    label: string;
    address: string;
}

const useGetBalAddresses = (): BalAddresses[] => {
    const [balAddresses, setBalAddresses] = useState<BalAddresses[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "https://raw.githubusercontent.com/BalancerMaxis/bal_addresses/main/outputs/mainnet.json"
                );
                const data = await response.json();
                
                setBalAddresses(data);
            } catch (error) {
                console.error("Error fetching gauge data:", error);
            }
        };

        fetchData();
    }, []);

    return balAddresses;
};

export default useGetBalAddresses;
