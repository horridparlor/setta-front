import {CardClass, CardSubtype, CardType} from "./card";

export enum CostType {
    NONE = 'None',
    CONTINUOUS = 'Continuous',
    PAYMENT = 'Payment',
    STATE = 'State',
    TRIGGER = 'Trigger',
}

export enum PaymentCostType {
    DISCARD = 'Discard',
    LIFE = 'Life',
    MILL = 'Mill',
    RESHUFFLE = 'Reshuffle',
    SACRIFICE = 'Sacrifice',
}

export enum StateCostType {
    COUNT_CARDS = 'Count cards',
    NO_MONSTERS = 'No monsters',
    SUMMONED_THIS_TURN = 'Summoned this turn',
    YOU_CONTROL_ONLY_THIS = 'You control only this'
}

export enum TriggerCostType {
    OPPONENT = 'Opponent',
    SELF_TRIGGERED = 'Self-triggered',
}

export enum OpponentTriggerCostType {
    ATTACKS = 'Attacks',
    SUMMONS = 'Summons'
}

export enum SelfTriggeredCostType {
    FLIPPED_WHEN_ATTACKED = 'Flipped when attacked'
}

export type EffectsPayment = {
    paymentType: PaymentCostType|null;
    amount: number|null;
    cardType: CardType|null;
}

export enum Zone {
    DECK = 'Deck',
    FIELD = 'Field',
    GRAVE = 'Grave',
    HAND = 'Hand'
}

export enum TargetType {
    ALL = 'All',
    ATTACKER = 'Attacker',
    OTHER = 'Other',
    TARGET = 'Target',
    THIS = 'This'
}

export enum TargetOwner {
    ANY = 'Any',
    OPPONENT = 'Opponent',
    YOU = 'You'
}

export type EffectsTarget = {
    class: CardClass|null,
    subtype: CardSubtype|null,
    minLevel: number|null,
    maxLevel: number|null,
    atk: number|null,
    def: number|null,
    zone: Zone|null,
    targetType: TargetType|null,
    owner: TargetOwner|null
}

export enum PostCountType {
    LEVEL = 'Level'
}

export enum LevelPostCountType {
    COMBINED = 'Combined'
}

export type PostCount = {
    countType: PostCountType,
    subtype: string|null;
}

export type EffectsCost = {
    preState: StateCostType|null;
    costType: CostType;
    subtype: string|null;
    supertype: string|null;
    amount: number|null;
    target: EffectsTarget|null;
    payment: EffectsPayment|null;
    postCount: PostCount|null;
}

export enum EffectType {
    EVIL = 'Evil',
    KEYWORD = 'Keyword',
    MOVE_CARD = 'Move card',
    STAT = 'Stat'
}

export enum StatEffectType {
    ATK = 'Atk',
    DEF = 'Def',
    LIFE = 'Life',
    POSITION = 'Position',
    SWITCH = 'Switch'
}

export enum KeywordEffectType {
    DOUBLE_TRIBUTE = 'Counts as 2 tributes',
    CHAIN_ATTACK = 'Chain-attack',
    PIERCING = 'Piercing'
}

export enum MoveCardEffectType {
    DRAW = 'Draw',
    RESTACK = 'Restack',
    RETRIEVE = 'Retrieve',
    SUMMON = 'Summon'
}

export enum SummonEffectType {
    REBORN = 'Reborn',
    TOP_SUMMON = 'Top-summon'
}

export enum EvilEffectType {
    DESTROY = 'Destroy',
    DISCARD = 'Discard',
    FLIP = 'Flip',
    MILL = 'Mill',
    STEAL = 'Steal'
}

export enum StealEffectType {
    GAIN_CONTROL = 'Gain control',
    SWITCH_WITH = 'Switch with'
}

export type EffectsCount = {
    multiplier: number;
    target: EffectsTarget|null;
}

export enum EffectsDirection {
    ATTACK = 'Attack',
    DEFENSE = 'Defense',
    DOUBLE = 'Double',
    GAIN = 'Gain',
    LOSE = 'Lose'
}

export enum EffectsHindrance {
    CANNOT_ATTACK_DIRECTLY = 'Cannot attack directly',
    OPPONENT_TOP_SUMMONS = 'Opponent top-summons'
}

export enum EffectsBenefit {
    DRAW = 'Draw a card'
}

export type EffectsEffect = {
    effectType: EffectType;
    subtype: string|null;
    supertype: string|null;
    amount: number|EffectsCount|null;
    target: EffectsTarget|null;
    direction: EffectsDirection;
    hindrance: EffectsHindrance;
    benefit: EffectsBenefit;
    chain: EffectsEffect|null;
}