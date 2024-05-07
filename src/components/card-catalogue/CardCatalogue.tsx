import React, {useRef, useState} from 'react';
import {Box, Card} from '@mui/material';
import {CardData, CardType, combineEffectsTexts} from "../../types/card";
import CardFilters, {CardFiltersRef} from "./CardFilters";
import CardPreviewer from "../card-editor/card-previewer/CardPreviewer";
import {CardExpansion} from "../../types/expansion";
import {normalizeName} from "../../utils/string";

interface CardCatalogueProps {
    handleCardClick: (cardData: CardData) => void;
    cards: Array<CardData>;
    expansions: Array<CardExpansion>;
}

const CardCatalogue: React.FC<CardCatalogueProps> = ({ handleCardClick, cards, expansions }) => {
    const [filters, setFilters] = useState({
        cardName: '',
        cardEffects: '',
        referenceId: '',
        cardType: '',
        cardSubtype: '',
        cardSupertype: '',
        cardClass: '',
        expansionId: ''
    });

    const filtersRef = useRef<CardFiltersRef>(null);

    const onGetReferences = (cardData: CardData) => {
        filtersRef.current?.referenceCard(cardData);
    }

    const getReferencesCountsAs = () => {
        return cards.find(c => c.cardId.toString() === filters.referenceId)?.countsAsId;
    }

    const filteredCards = cards.filter(card =>
        normalizeName(card.cardName).toLowerCase().includes(normalizeName(filters.cardName).toLowerCase())
        && filters.cardEffects.toLowerCase().split(' ').every(word => (card.costText + card.effectText).toLowerCase().includes(word))
        && (filters.referenceId === '' ||
            [card.cardId, card.primaryMaterialId, card.secondaryMaterialId, card.tertiaryMaterialId, card.countsAsId]
                .includes(parseInt(filters.referenceId)) ||
            !!cards.find(c => c.cardId === parseInt(filters.referenceId)
                && ([c.primaryMaterialId, c.secondaryMaterialId, c.tertiaryMaterialId, c.countsAsId].some(reference => reference === card.cardId || (card.countsAsId && reference === card.countsAsId)) ||
                    combineEffectsTexts(c).toLowerCase().includes(normalizeName(card.cardName).toLowerCase()) ||
                    (card.countsAsId && combineEffectsTexts(c).toLowerCase().includes(normalizeName(cards.find(c2 => c2.cardId === card.countsAsId)?.cardName.toLowerCase()))))) ||
                cards.find(c => c.cardId.toString() === filters.referenceId) && combineEffectsTexts(card).includes(cards.find(c => c.cardId.toString() === filters.referenceId)!.cardName) ||
                cards.find(c => c.cardId.toString() === getReferencesCountsAs()?.toString()) && combineEffectsTexts(card).includes(cards.find(c => c.cardId.toString() === getReferencesCountsAs()?.toString())!.cardName))
        && (filters.cardType === '' || card.cardType === filters.cardType)
        && (filters.cardSubtype === '' || card.subtype === filters.cardSubtype)
        && (filters.cardSupertype === '' || card.supertype === filters.cardSupertype)
        && (filters.cardClass === '' || (card.cardType === CardType.MONSTER && card.cardClass === filters.cardClass))
        && (filters.expansionId === '' || card.expansionId === parseInt(filters.expansionId))
    );
    const cardScale = 0.55;

    return (
        <Box
            sx={{
                padding: 2,
            }}
        >
            <CardFilters ref={filtersRef} cards={cards} expansions={expansions} onFilterChange={setFilters} />
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
                        onContextMenu={(event) => {
                            event.preventDefault();
                            onGetReferences(cardData);
                        }}
                        sx={{
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            borderRadius: `${1.5 * cardScale}rem`,
                            minWidth: `${30 * cardScale}rem`,
                        }}
                        elevation={0}
                    >
                        <CardPreviewer cards={cards} cardData={cardData} scale={cardScale} />
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default CardCatalogue;
