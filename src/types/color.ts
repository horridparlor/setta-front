import {CardData, CardType, StatType} from "./card";

const ARTWORK_BORDER_THICKNESS = 0.15

export enum CardMainFrameColor {
    NORMAL = '#e0c71b',
    EFFECT = '#ec8c57',
    FUSION = '#b361e2',
    REVENGE = '#f35a5a',
    ROYAL = '#505051',
    SPELL = '#4cb871',
    TRAP = '#e77c9b',
    RITUAL = '#5f9bdb',
    FRAME = '#171717'
}

export enum CardEffectFrameColor {
    NORMAL = '#f6f4cb',
    EFFECT = '#f5dfd4',
    FUSION = '#eee2f5',
    REVENGE = '#f6dcdc',
    ROYAL = '#e5e5e5',
    SPELL = '#e3f5ea',
    TRAP = '#f5e0e6',
    RITUAL = '#e7f0f7',
}

export enum StatBoxColor {
    ATK = '#aa2929',
    DEF = '#2a7aaf'
}

export const getCardBackgroundColor = (cardData : CardData) => {
    switch (cardData.cardType) {
        case CardType.MONSTER:
            return CardMainFrameColor.EFFECT;
        case CardType.SPELL:
            return CardMainFrameColor.SPELL;
        case CardType.TRAP:
            return CardMainFrameColor.TRAP;
    }
};

export const getCardEffectFrameColor = (cardData : CardData) => {
    switch (cardData.cardType) {
        case CardType.MONSTER:
            return CardEffectFrameColor.EFFECT;
        case CardType.SPELL:
            return CardEffectFrameColor.SPELL;
        case CardType.TRAP:
            return CardEffectFrameColor.TRAP;
        default:
            return 'defaultColor';
    }
};

export const getStatBoxBackgroundColor = (statType : StatType) => {
    switch (statType) {
        case StatType.ATTACK:
            return StatBoxColor.ATK;
        case StatType.DEFENSE:
            return StatBoxColor.DEF;
    }
};

export const getArtworkBorder = (scale: number) => {
    return `solid ${ARTWORK_BORDER_THICKNESS * scale}rem black`;
}