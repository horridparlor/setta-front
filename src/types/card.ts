import {Card} from "@mui/material";

export enum CardClass {
    ABYSS = 'Abyss',
    DRAGON = 'Dragon',
    KAWAII = 'Kawaii',
    SLIME = 'Slime',
    SPARKS = 'Sparks',
    ZOMBIE = 'Zombie'
}
const CardClassToId = {
    [CardClass.ABYSS]: 1,
    [CardClass.DRAGON]: 2,
    [CardClass.KAWAII]: 3,
    [CardClass.SLIME]: 4,
    [CardClass.SPARKS]: 5,
    [CardClass.ZOMBIE]: 6,
};
const IdToCardClass = Object.fromEntries(
    Object.entries(CardClassToId).map(([key, value]) => [value, key])
);
export const getCardClassId = (cardClass: CardClass): number => {
    return CardClassToId[cardClass];
}
export const getCardClassName = (id: number): CardClass => {
    return IdToCardClass[id] as CardClass;
}

export enum CardType {
    MONSTER = 'Monster',
    SPELL = 'Spell',
    TRAP = 'Trap'
}
const CardTypeToId = {
    [CardType.MONSTER]: 1,
    [CardType.SPELL]: 2,
    [CardType.TRAP]: 3,
};
const IdToCardType = Object.fromEntries(
    Object.entries(CardTypeToId).map(([key, value]) => [value, key])
);
export const getCardTypeId = (cardType: CardType): number => {
    return CardTypeToId[cardType];
}
export const getCardTypeName = (id: number): CardType => {
    return IdToCardType[id] as CardType;
}

export enum CardSubtype {
    NORMAL = 'Normal',
    EFFECT = 'Effect',
    FUSION = 'Fusion',
    REVENGE = 'Revenge',
    ROYAL = 'Royal',
    TIME_TRAVELLER = 'Time Traveller',
    RITUAL = 'Ritual'
}
const CardSubtypeToId = {
    [CardSubtype.NORMAL]: 1,
    [CardSubtype.EFFECT]: 2,
    [CardSubtype.FUSION]: 3,
    [CardSubtype.REVENGE]: 4,
    [CardSubtype.ROYAL]: 5,
    [CardSubtype.TIME_TRAVELLER]: 6,
    [CardSubtype.RITUAL]: 7,
};
const IdToCardSubtype = Object.fromEntries(
    Object.entries(CardSubtypeToId).map(([key, value]) => [value, key])
);
export const getCardSubtypeId = (cardSubtype: CardSubtype): number => {
    return CardSubtypeToId[cardSubtype];
}
export const getCardSubtypeName = (id: number): CardSubtype => {
    return IdToCardSubtype[id] as CardSubtype;
}

export enum CardSupertype {
    NONE = 'None',
    HAND_TRAP = 'Hand Trap',
    MAXIMUM = 'Maximum',
    PENDULUM = 'Pendulum'
}
const CardSupertypeToId = {
    [CardSupertype.NONE]: 1,
    [CardSupertype.HAND_TRAP]: 2,
    [CardSupertype.MAXIMUM]: 3,
    [CardSupertype.PENDULUM]: 4,
};
const IdToCardSupertype = Object.fromEntries(
    Object.entries(CardSupertypeToId).map(([key, value]) => [value, key])
);
export const getCardSupertypeId = (cardSupertype: CardSupertype): number => {
    return CardSupertypeToId[cardSupertype];
}
export const getCardSupertypeName = (id: number): CardSupertype => {
    return IdToCardSupertype[id] as CardSupertype;
}

export enum MaximumPiece {
    NONE = 'None',
    LEFT = 'Left',
    MIDDLE = 'Middle',
    RIGHT = 'Right',
}
const MaximumPieceToId = {
    [MaximumPiece.NONE]: 1,
    [MaximumPiece.LEFT]: 2,
    [MaximumPiece.MIDDLE]: 3,
    [MaximumPiece.RIGHT]: 4,
};
const IdToMaximumPiece = Object.fromEntries(
    Object.entries(MaximumPieceToId).map(([key, value]) => [value, key])
);
export const getMaximumPieceId = (maximumPiece: MaximumPiece): number => {
    return MaximumPieceToId[maximumPiece];
}
export const getMaximumPieceName = (id: number): MaximumPiece => {
    return IdToMaximumPiece[id] as MaximumPiece;
}



export const EXTRA_DECK_SUBTYPES = [
  CardSubtype.FUSION,
  CardSubtype.REVENGE,
  CardSubtype.ROYAL,
  CardSubtype.TIME_TRAVELLER,
  CardSubtype.RITUAL,
];

export interface CardData {
    cardId: number;
    cardName: string;
    isAce: boolean;
    cardClass: CardClass;
    cardType: CardType;
    subtype: CardSubtype;
    supertype: CardSupertype;
    maximumPiece: MaximumPiece;
    level: number;
    atk: number;
    def: number;
    primaryMaterial: string;
    secondaryMaterial: string;
    tertiaryMaterial: string;
    costText: string;
    effectText: string;
    flavourText: string;
    countsAs: string;
    artScale: number;
    artXOffset: number;
    artYOffset: number;
    nameSize: number;
    materialsSize: number;
    effectsSize: number;
    expansionId: number;
}

export interface RawCardData {
    id: number;
    cardName: string;
    isAce: boolean;
    cardClassId: number;
    cardTypeId: number;
    subtypeId: number;
    supertypeId: number;
    maximumPiece: number;
    level: number;
    atk: number;
    def: number;
    primaryMaterialId: number;
    secondaryMaterialId: number;
    tertiaryMaterialId: number;
    costText: string;
    effectText: string;
    flavourText: string;
    countsAsId: number;
    artScale: number;
    artXOffset: number;
    artYOffset: number;
    nameSize: number;
    materialsSize: number;
    effectsSize: number;
    expansionId: number;
}

export enum StatType {
    ATTACK = 'attack',
    DEFENSE = 'defense'
}

export const isExtraDeckCard = (cardData : CardData) => {
    return EXTRA_DECK_SUBTYPES.includes(cardData.subtype);
}

export const hasCostText = (cardData : CardData) => {
    return cardData.cardType !== CardType.MONSTER || isPendulumCard(cardData) || !((cardData.subtype !== CardSubtype.NORMAL
        && cardData.flavourText.length > 0) || cardData.subtype === CardSubtype.NORMAL);
}

export const hasEffectText = (cardData : CardData) => {
    return cardData.cardType !== CardType.MONSTER || isHandTrapCard(cardData) ||
        !(cardData.subtype === CardSubtype.NORMAL || cardData.flavourText.length > 0);
}

export const hasFlavourText = (cardData : CardData) => {
    return isPendulumCard(cardData) || isHandTrapCard(cardData) || !(cardData.cardType !== CardType.MONSTER
        || cardData.subtype === CardSubtype.EFFECT
        || cardData.effectText.length > 0
        || cardData.costText.length > 0);
}

export const isPendulumCard = (cardData: CardData) => {
    return cardData.supertype === CardSupertype.PENDULUM;
}

export const isHandTrapCard = (cardData: CardData) => {
    return cardData.supertype === CardSupertype.HAND_TRAP;
}

export const normalizeCards = (cards: {[key: number]: RawCardData}): {[key: number]: CardData} => {
    return Object.fromEntries(
        Object.entries(cards).map(([id, rawCardData]) =>
            [id, {
                cardId: rawCardData.id,
                cardName: rawCardData.cardName,
                isAce: rawCardData.isAce,
                cardClass: CardClass.ABYSS,
                cardType: CardType.MONSTER,
                subtype: CardSubtype.FUSION,
                supertype: CardSupertype.NONE,
                maximumPiece: MaximumPiece.NONE,
                level: rawCardData.level,
                atk: rawCardData.atk,
                def: rawCardData.def,
                primaryMaterial: rawCardData.primaryMaterialId ? cards[rawCardData.primaryMaterialId].cardName : '',
                secondaryMaterial: rawCardData.secondaryMaterialId ? cards[rawCardData.secondaryMaterialId].cardName : '',
                tertiaryMaterial: rawCardData.tertiaryMaterialId ? cards[rawCardData.tertiaryMaterialId].cardName : '',
                costText: rawCardData.costText,
                effectText: rawCardData.effectText,
                flavourText: rawCardData.flavourText,
                countsAs: rawCardData.countsAsId ? cards[rawCardData.countsAsId].cardName : '',
                artScale: rawCardData.artScale,
                artXOffset: rawCardData.artXOffset,
                artYOffset: rawCardData.artYOffset,
                nameSize: rawCardData.nameSize,
                materialsSize: rawCardData.materialsSize,
                effectsSize: rawCardData.effectsSize,
                expansionId: rawCardData.expansionId,
            }]
        )
    );
};