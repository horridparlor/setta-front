import { useState, useEffect } from 'react';
import { CardExpansion } from '../types/expansion';
import { UpdateFrequencies } from '../types/time';
import { getHeaders } from '../types/api';
import { apiClient } from '../api/client.ts';

const useExpansions = () => {
  const [expansions, setExpansions] = useState<Array<CardExpansion>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpansions = async () => {
    setIsLoading(true);
    const { data: responseData, error } = await apiClient.GET(
      '/api/user/expansions',
      {
        credentials: 'same-origin',
        headers: getHeaders(),
      }
    );
    if (error) {
      setError(error);
      setIsLoading(false);
    }
    const expansions = responseData.expansions.sort(
      (expansionA: CardExpansion, expansionB: CardExpansion) =>
        expansionA.name.localeCompare(expansionB.name, undefined, {
          numeric: true,
        })
    );
    setExpansions(expansions);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchExpansions();
    const interval = setInterval(
      fetchExpansions,
      UpdateFrequencies.TWENTY_MINUTES
    );
    return () => clearInterval(interval);
  }, []);

  return { expansions, isLoading, error, fetchExpansions };
};

export default useExpansions;
