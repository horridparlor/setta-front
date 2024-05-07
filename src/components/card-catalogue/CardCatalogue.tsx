import React, { useState } from 'react';
import { Box, Card } from '@mui/material';
import {CardData} from "../../types/card";
import CardFilters from "./CardFilters";
import CardPreviewer from "../card-editor/card-previewer/CardPreviewer";
import {CardExpansion} from "../../types/expansion";
import {normalizeName} from "../../utils/string";

interface CardCatalogueProps {
    handleCardClick: (cardId: CardData) => void;
    cards: Array<CardData>;
    expansions: Array<CardExpansion>;
}

const CardCatalogue: React.FC<CardCatalogueProps> = ({ handleCardClick, cards, expansions }) => {
    const [filters, setFilters] = useState({
        cardName: '',
        cardEffects: '',
        referenceId: '',
        cardType: '',
        cardClass: '',
        expansionId: ''
    });

    const filteredCards = cards.filter(card =>
        normalizeName(card.cardName).toLowerCase().includes(normalizeName(filters.cardName).toLowerCase())
        && filters.cardEffects.toLowerCase().split(' ').every(word => (card.costText + card.effectText).toLowerCase().includes(word))
        && (filters.referenceId === '' ||
            [card.cardId, card.primaryMaterialId, card.secondaryMaterialId, card.tertiaryMaterialId, card.countsAsId]
                .includes(parseInt(filters.referenceId)) ||
            (card.costText + card.effectText + card.flavourText).toLowerCase().includes(normalizeName(cards.find(c => c.cardId === parseInt(filters.referenceId, 10))?.cardName || '').toLowerCase()))
        && (filters.cardType === '' || card.cardType === filters.cardType)
        && (filters.cardClass === '' || card.cardClass === filters.cardClass)
        && (filters.expansionId === '' || card.expansionId === parseInt(filters.expansionId))
    );
    const cardScale = 0.7;

    return (
        <Box
            sx={{
                padding: 2,
            }}
        >
            <CardFilters cards={cards} expansions={expansions} onFilterChange={setFilters} />
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                overflowX: 'auto',
                flexWrap: 'wrap',
                justifyContent: 'center',
                overflowY: 'auto',
                height: '100vh',
                marginTop: '12rem',
            }}>
                {filteredCards.map((cardData, index) => (
                    <Card
                        key={index}
                        onClick={() => handleCardClick(cardData)}
                        sx={{
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            borderRadius: `${1.5 * cardScale}rem`,
                            minWidth: `${30 * cardScale}rem`,
                        }}
                    >
                        <CardPreviewer cards={cards} cardData={cardData} scale={cardScale} />
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default CardCatalogue;
