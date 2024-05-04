import {CardData, CardSubtype, CardType, StatType} from "./card";

const ARTWORK_BORDER_THICKNESS = 0.15

export enum CardMainFrameColor {
    NORMAL = '#e0c71b',
    EFFECT = '#ec8c57',
    FUSION = '#b361e2',
    REVENGE = '#f35a5a',
    ROYAL = '#212121',
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

export enum TextColor {
    BLACK = '#000000',
    PEARL_WHITE = '#f3f3f3',
    WHITE = '#ffffff',
}

export const getCardBackgroundColor = (cardData : CardData) => {
    switch (cardData.cardType) {
        case CardType.MONSTER:
            return getMonsterBackgroundColor(cardData.subtype);
        case CardType.SPELL:
            return CardMainFrameColor.SPELL;
        case CardType.TRAP:
            return getTrapBackgroundColor(cardData.subtype);
    }
};

export const getMonsterBackgroundColor = (subtype : CardSubtype) => {
    switch (subtype) {
        case CardSubtype.EFFECT:
            return CardMainFrameColor.EFFECT;
        case CardSubtype.FUSION:
            return CardMainFrameColor.FUSION;
        case CardSubtype.REVENGE:
            return CardMainFrameColor.REVENGE;
        case CardSubtype.ROYAL:
            return CardMainFrameColor.ROYAL;
        default:
            return CardMainFrameColor.NORMAL;
    }
};

export const getTrapBackgroundColor = (subtype : CardSubtype) => {
    switch (subtype) {
        case CardSubtype.RITUAL:
            return CardMainFrameColor.RITUAL;
        default:
            return CardMainFrameColor.TRAP;
    }
};

export const getCardEffectFrameColor = (cardData : CardData) => {
    switch (cardData.cardType) {
        case CardType.MONSTER:
            return getMonsterEffectFrameColor(cardData.subtype);
        case CardType.SPELL:
            return CardEffectFrameColor.SPELL;
        case CardType.TRAP:
            return getTrapEffectFrameColor(cardData.subtype);
    }
};

export const getMonsterEffectFrameColor = (subtype : CardSubtype) => {
    switch (subtype) {
        case CardSubtype.EFFECT:
            return CardEffectFrameColor.EFFECT;
        case CardSubtype.FUSION:
            return CardEffectFrameColor.FUSION;
        case CardSubtype.REVENGE:
            return CardEffectFrameColor.REVENGE;
        case CardSubtype.ROYAL:
            return CardEffectFrameColor.ROYAL;
        default:
            return CardEffectFrameColor.NORMAL;
    }
};

export const getTrapEffectFrameColor = (subtype : CardSubtype) => {
    switch (subtype) {
        case CardSubtype.RITUAL:
            return CardEffectFrameColor.RITUAL;
        default:
            return CardEffectFrameColor.TRAP;
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

export const getFrameTextColor = (cardData: CardData) => {
    switch (cardData.subtype) {
        case CardSubtype.ROYAL:
            return TextColor.PEARL_WHITE;
        default:
            return TextColor.BLACK;
    }
}