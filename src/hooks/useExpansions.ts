import { useState, useEffect } from 'react';
import { CardExpansion } from '../types/expansion';
import { UpdateFrequencies } from '../types/time';
import {
  getHeaders,
  getUserEndpoint,
  RequestMethod,
  UserEndpoint,
} from '../types/api';

const useExpansions = () => {
  const [expansions, setExpansions] = useState<Array<CardExpansion>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const url = getUserEndpoint(UserEndpoint.EXPANSIONS);

  const fetchExpansions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(url, {
        method: RequestMethod.GET,
        headers: getHeaders(),
      });
      const responseData = await response.json();
      const expansions = responseData.expansions.sort(
        (expansionA: CardExpansion, expansionB: CardExpansion) =>
          expansionA.name.localeCompare(expansionB.name, undefined, {
            numeric: true,
          })
      );
      setExpansions(expansions);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchExpansions();
    const interval = setInterval(
      fetchExpansions,
      UpdateFrequencies.TWENTY_MINUTES
    );
    return () => clearInterval(interval);
  }, [url]);

  return { expansions, isLoading, error, fetchExpansions };
};

export default useExpansions;
