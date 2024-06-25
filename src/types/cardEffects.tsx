import {CardClass, CardSubtype, CardSupertype, CardType} from "./card";

export enum TriggerType {
    AUTOMATIC = 'Automatic',
    CONTINUOUS = 'Continuous',
    PAID = 'Paid',
}

export enum AutomaticTriggerType {
    FLIPPED_WHEN_ATTACKED = 'Flipped when attacked',
}

export enum PaymentType {
    DISCARD = 'Discard',
    MILL = 'Mill'
}

export enum CardStat {
    ATK = 'Atk',
    DEF = 'Def',
    EFFECTS = 'Effects',
    LIFE = 'Life',
    LEVEL = 'Level'
}

export enum Player {
    BOTH = 'Both',
    OPPONENT = 'Opponent',
    YOU = 'You'
}

export enum Zone {
    ARMOR_STACK = 'Armor stack',
    DECK = 'Deck',
    EXILE = 'EXILE',
    EXTRA_DECK = 'Extra-deck',
    GRAVE = 'Grave',
    HAND = 'Hand',
    PARASITE = 'Parasite'
}

export enum EffectType {
    KEYWORD = 'Keyword',
    STAT = 'Stat',
}

export enum EffectRelation {
    GAIN = 'Gain',
    LOSE = 'Lose'
}

export enum Keyword {
    GOADED = 'Goaded',
    INCINERATION = 'Incineration',
    PIERCING = 'Piercing'
}

export interface CardEffectsTarget {
    player: Player|null;
    stat: CardStat|null;
    amount: number|null;
    cardClass: CardClass|null;
    cardType: CardType|null;
    cardSubtype: CardSubtype|null;
    cardSupertype: CardSupertype|null;
}

export interface CardEffectsEffect {
    effectType: EffectType|null;
    relation: EffectRelation|null;
    amount: number|null;
    target: CardEffectsTarget
}

export interface CardEffects {
    cost: CardEffectsCost|null;
    effect: CardEffectsEffect|null;
    chain: CardEffectsEffect|null;
}