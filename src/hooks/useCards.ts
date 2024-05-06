import { useState, useEffect } from 'react';
import axios from 'axios';
import {UpdateFrequencies} from "../types/time";
import {getUserEndpoint, UserEndpoint} from "../types/api";
import {CardData, normalizeCards} from "../types/card";

const useCards = () => {
    const [cards, setCards] = useState<{[key: number]: CardData}>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const url = getUserEndpoint(UserEndpoint.CARDS);

    useEffect(() => {
        const fetchCards = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(url);
                const cards = normalizeCards(response.data.cards);
                setCards(cards);
                setIsLoading(false);
            } catch (err: any) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchCards();
        const interval = setInterval(fetchCards, UpdateFrequencies.ONE_HOUR);
        return () => clearInterval(interval);
    }, [url]);

    return { cards, isLoading, error };
};

export default useCards;