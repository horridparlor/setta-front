import { useState, useEffect } from 'react';
import { UpdateFrequencies } from '../types/time';
import {
  getUserEndpoint,
  UserEndpoint,
} from '../types/api';
import { CardData } from '../types/card';
import { CardOwner } from '../types/user';
import {apiClient} from "../api/client.ts";

const useCards = () => {
  const [cards, setCards] = useState<Array<CardData>>([]);
  const [cardOwners, setCardOwners] = useState<Array<CardOwner>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const url = getUserEndpoint(UserEndpoint.CARDS);

  const fetchCards = async () => {
    setIsLoading(true);
    const { data, error } = await apiClient.GET('/api/user/cards', {});
    if (error) {
      setError(error);
      setIsLoading(false);
    }
    const cards = data.cards as CardData[];
    const owners = cards
        .reduce((acc: CardOwner[], card: CardData) => {
          if (!acc.some(owner => owner.id === card.ownerId)) {
            const owner: CardOwner = {
              id: card.ownerId,
              name: `${card.ownerFirstname} ${card.ownerLastname}`,
            };
            acc.push(owner);
          }
          return acc;
        }, [])
        .sort((ownerA: CardOwner, ownerB: CardOwner) =>
            ownerA.name.localeCompare(ownerB.name)
        );
    setCards(cards);
    setCardOwners(owners);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchCards();
    const interval = setInterval(fetchCards, UpdateFrequencies.ONE_HOUR);
    return () => clearInterval(interval);
  }, [url]);

  return { cards, cardOwners, isLoading, error, fetchCards };
};

export default useCards;
