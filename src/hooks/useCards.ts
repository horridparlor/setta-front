import { useState, useEffect } from 'react';
import axios from 'axios';
import {UpdateFrequencies} from "../types/time";
import {getHeaders, getUserEndpoint, RequestMethod, UserEndpoint} from "../types/api";
import {CardData} from "../types/card";

const useCards = () => {
    const [cards, setCards] = useState<Array<CardData>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const url = getUserEndpoint(UserEndpoint.CARDS);

    const fetchCards = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(url, {
                method: RequestMethod.GET,
                headers: getHeaders()
            });
            const responseData = await response.json();
            setCards(responseData.cards);
            setIsLoading(false);
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchCards();
        const interval = setInterval(fetchCards, UpdateFrequencies.ONE_HOUR);
        return () => clearInterval(interval);
    }, [url]);

    return { cards, isLoading, error, fetchCards };
};

export default useCards;