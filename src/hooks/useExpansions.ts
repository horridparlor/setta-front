import { useState, useEffect } from 'react';
import axios from 'axios';
import {CardExpansion} from "../types/expansion";
import {UpdateFrequencies} from "../types/time";
import {getUserEndpoint, UserEndpoint} from "../types/api";

const useExpansions = () => {
    const [expansions, setExpansions] = useState<Array<CardExpansion>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const url = getUserEndpoint(UserEndpoint.EXPANSIONS);

    const fetchExpansions = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(url);
            setExpansions(response.data.expansions);
            setIsLoading(false);
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchExpansions();
        const interval = setInterval(fetchExpansions, UpdateFrequencies.TWENTY_MINUTES);
        return () => clearInterval(interval);
    }, [url]);

    return { expansions, isLoading, error, fetchExpansions };
};

export default useExpansions;