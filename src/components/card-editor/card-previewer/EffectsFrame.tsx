import React from 'react';
import {Box, Typography} from '@mui/material';
import {
    CardData,
    CardSubtype,
    hasCostText,
    hasEffectText,
    hasFlavourText,
    isExtraDeckCard,
    isHandTrapCard,
    isPendulumCard, isRitual
} from "../../../types/card";
import {getCardEffectFrameColor, getEffectsBorder} from "../../../types/color";
import {addSizeToRichText, formatText, getFontSize} from "../../../utils/fonts";
import {endsSentence, normalizeName, replaceIfEmpty, starsWithVowel} from "../../../utils/string";

interface EffectsFrameProps {
    cardData: CardData;
    scale: number;
    cards: Array<CardData>;
}

const EffectsFrame: React.FC<EffectsFrameProps> = ({ cardData, scale, cards }) => {
    const getMaterialsSeparator = () => {
        switch (cardData.subtype) {
            case CardSubtype.REVENGE:
                return 'x';
            case CardSubtype.ROYAL:
                return '⋅'
            case CardSubtype.TIME_TRAVELLER:
                return '★'
            case CardSubtype.RITUAL:
                return '->'
            default:
                return '+';
        }
    }
    const getMaterialsSize = () => {
        return cardData.materialsSize - 1;
    }
    const getEffectsSize = () => {
        return cardData.effectsSize - 1;
    }
    const getMaterialsReminder = () => {
        if (!cardData.materialsReminder.length) {
            return '';
        }
        return ` {i=${getEffectsSize()}}(${cardData.materialsReminder}.){/i}`;
    }
    const getMaterialsText = () => {
        const materialsPrefix = `{h=${getMaterialsSize()}}(`;
        let materials =  [
            replaceIfEmpty(normalizeName(cards.find(card => card.cardId === cardData.primaryMaterialId)), 'Primary'),
            replaceIfEmpty(normalizeName(cards.find(card => card.cardId === cardData.secondaryMaterialId)), 'Secondary'),
            normalizeName(cards.find(card => card.cardId === cardData.tertiaryMaterialId)) ?? '',
        ];
        if (!isRitual(cardData)) {
            materials = materials.sort((a, b) => a.localeCompare(b));
        }
        const materialsText = materials.filter(material => material.length).join(` ${getMaterialsSeparator()} `);
        return isExtraDeckCard(cardData) ? materialsPrefix + materialsText + `){/h}${(getMaterialsReminder())}\n` : '';
    }
    const getCostText = () => {
        const costPrefix = `{i=${getEffectsSize()}}${isPendulumCard(cardData) ? 'Pendulum>>' : 'Cost:'} {/i}`;
        const costText = addSizeToRichText(cardData.costText, getEffectsSize());
        return hasCostText(cardData) ? costPrefix + costText + '\n' : '';
    }
    const getEffectText = () => {
        const effectPrefix = `{i=${getEffectsSize()}}${isHandTrapCard(cardData) ? 'Hand Trap>>' : 'Effect:'} {/i}`;
        const effectText = addSizeToRichText(cardData.effectText, getEffectsSize());
        return hasEffectText(cardData) ? effectPrefix + effectText + '\n' : '';
    }
    const getFlavourText = () => {
        const flavourPrefix = `{i=${getEffectsSize()}}`;
        const flavourText = addSizeToRichText(cardData.flavourText, getEffectsSize());
        return hasFlavourText(cardData) ? flavourPrefix + (flavourText.length ? flavourText : 'Flavour text...') + '{/i}' + '\n' : '';
    }
    const getEffectsText = () => {
        return getMaterialsText() + getCostText() + getEffectText() + getFlavourText();
    }
    const getLineHeight = () => {
        return 1.2 + (0.01 * (getEffectsSize() + 1));
    }
    const getTopPadding = () => {
        const firstLineSize = isExtraDeckCard(cardData) ? getMaterialsSize() : getEffectsSize();
        return Math.max(0, 0.25 + 0.06 * (firstLineSize + (isExtraDeckCard(cardData) ? 2 : 1)) - ((getEffectsSize() + 1) * 0.045 * getLineHeight()));
    }
    const getCountsAs = () => {
        const countsAsText = normalizeName(cards.find(card => card.cardId === cardData.countsAsId)) ?? '';
        const countsAsPrefix = `Counts as ${starsWithVowel(countsAsText) ? 'an' : 'a'} {bi=${getEffectsSize()}}`;
        if (!countsAsText.length) {
            return '';
        }
        return (
            <>
                <Box
                    sx={{
                        flexGrow: 1,
                        marginTop: `${0.4 * scale}rem`,
                        height: `${0.12 * scale}rem`,
                        backgroundColor: 'black',
                        opacity: 0.2,
                    }}
                />
                {formatText(countsAsPrefix +  countsAsText + `{/bi}${endsSentence(countsAsText) ? '' : '.'}`, scale)}
            </>
        );
    }
    return (
        <Typography variant="subtitle1" sx={{
            textAlign: 'left',
            paddingLeft: '0.7rem',
            paddingRight: '0.5rem',
            paddingTop: `${getTopPadding()}rem`,
            backgroundColor: getCardEffectFrameColor(cardData),
            borderRadius: '0.4rem',
            height: `${(11.9 - getTopPadding()) * scale}rem`,
            overflow: 'hidden',
            fontSize: getFontSize(getEffectsSize(), scale),
            whiteSpace: 'pre-line',
            lineHeight: `${getLineHeight()}`,
            fontWeight: '400',
            border: getEffectsBorder(cardData, scale),
        }}>
            {formatText(getEffectsText(), scale)}
            {getCountsAs()}
        </Typography>
    );
};

export default EffectsFrame;
