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

export enum StatType {
    ATTACK = 'attack',
    DEFENSE = 'defense'
}