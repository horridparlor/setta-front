import {Card} from "@mui/material";

export enum CardClass {
    ABYSS = 'Abyss',
    DRAGON = 'Dragon',
    KAWAII = 'Kawaii',
    SLIME = 'Slime',
    SPARKS = 'Sparks',
    ZOMBIE = 'Zombie'
}

export enum CardType {
    MONSTER = 'Monster',
    SPELL = 'Spell',
    TRAP = 'Trap'
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

export enum CardSupertype {
    NONE = 'None',
    HAND_TRAP = 'Hand Trap',
    MAXIMUM = 'Maximum',
    PENDULUM = 'Pendulum'
}

export enum MaximumPiece {
    NONE = 'None',
    LEFT = 'Left',
    MIDDLE = 'Middle',
    RIGHT = 'Right',
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
    primaryMaterialId: number|null;
    secondaryMaterialId: number|null;
    tertiaryMaterialId: number|null;
    costText: string;
    effectText: string;
    flavourText: string;
    countsAsId: number|null;
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

export const DEFAULT_CARD_DATA = {
    cardId: 0,
    cardName: '',
    isAce: false,
    cardClass: CardClass.ABYSS,
    cardType: CardType.MONSTER,
    subtype: CardSubtype.FUSION,
    supertype: CardSupertype.NONE,
    maximumPiece: MaximumPiece.NONE,
    level: 1,
    atk: 0,
    def: 0,
    primaryMaterialId: null,
    secondaryMaterialId: null,
    tertiaryMaterialId: null,
    costText: '',
    effectText: '',
    flavourText: '',
    countsAsId: null,
    artScale: 0,
    artXOffset: 0,
    artYOffset: 0,
    nameSize: 4,
    materialsSize: 5,
    effectsSize: 5,
    expansionId: 1,
}