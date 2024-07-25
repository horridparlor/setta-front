import {CardClass, CardData, CardSubtype, CardType, getEffectsCost, isMonster, isSpell, isTrap} from "./card";

export enum CostType {
    NONE = 'None',
    CONTINUOUS = 'Continuous',
    PAYMENT = 'Payment',
    STATE = 'State',
    TRIGGER = 'Trigger',
}

export const isCostType = (value: string): value is CostType => {
    return Object.values(CostType).includes(value as CostType);
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

export const MonsterSpecificStateCostTypes: Array<string> = [
    StateCostType.SUMMONED_THIS_TURN,
    StateCostType.YOU_CONTROL_ONLY_THIS
]

export const SpellSpecificStateCostTypes: Array<string> = [
    StateCostType.NO_MONSTERS,
]

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
    cardClass: CardClass|null,
    subtype: CardSubtype|null,
    minLevel: number|null,
    maxLevel: number|null,
    atk: number|null,
    def: number|null,
    zone: Zone|null,
    targetType: TargetType|null,
    owner: TargetOwner|null
}

export const DEFAULT_EFFECTS_TARGET = {
    cardClass: null,
    subtype: null,
    minLevel: null,
    maxLevel: null,
    atk: null,
    def: null,
    zone: null,
    targetType: null,
    owner: null
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

export enum EffectType {
    EVIL = 'Evil',
    KEYWORD = 'Keyword',
    MOVE_CARD = 'Move card',
    NONE = 'None',
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

export enum ChainType {
    ALTER_SUMMONED = 'Alter summoned'
}

export enum AlterSummonedChainType {
    ATK = 'Atk',
    DEF = 'Def'
}

export type ChainEffect = {
    chainType: ChainType;
    subtype: string|null;
    direction: EffectsDirection|null;
    amount: number|null;
}

export type EffectsEffect = {
    effectType: EffectType;
    subtype: string|null;
    supertype: string|null;
    amount: number|EffectsCount|null;
    maxAmount: number|null;
    target: EffectsTarget|null;
    direction: EffectsDirection|null;
    hindrance: EffectsHindrance|null;
    benefit: EffectsBenefit|null;
    chainEffect: ChainEffect|null;
}

export type CardEffects = {
    cost: EffectsCost;
    effect: EffectsEffect;
}

export const DEFAULT_CARD_EFFECTS: CardEffects = {
    cost: {
        preState: null,
        costType: CostType.NONE,
        subtype: null,
        supertype: null,
        amount: null,
        target: null,
        payment: null,
        postCount: null
    },
    effect: {
        effectType: EffectType.NONE,
        subtype: null,
        supertype: null,
        amount: null,
        maxAmount: null,
        target: null,
        direction: null,
        hindrance: null,
        benefit: null,
        chainEffect: null
    }
}

export const getCostSubtypeOptions = (cardData: CardData): Array<string> => {
    let costTypes;
    switch (cardData.cardEffects.cost.costType) {
        case CostType.PAYMENT:
            return Object.values(PaymentCostType);
        case CostType.STATE:
            costTypes = Object.values(StateCostType);
            const notAvailable = isMonster(cardData) ? SpellSpecificStateCostTypes : MonsterSpecificStateCostTypes;
            return costTypes.filter(costType => !notAvailable.includes(costType));
        case CostType.TRIGGER:
            costTypes = Object.values(TriggerCostType);
            return costTypes.filter(costType => costType !==
                (isMonster(cardData) ? TriggerCostType.OPPONENT : TriggerCostType.SELF_TRIGGERED));
    }
    return [];
}

export const getDefaultCostSubtype = (cardData: CardData) => {
    switch (cardData.cardEffects.cost.costType) {
        case CostType.PAYMENT:
            return PaymentCostType.MILL;
        case CostType.STATE:
            return isMonster(cardData) ? StateCostType.SUMMONED_THIS_TURN : StateCostType.COUNT_CARDS;
        case CostType.TRIGGER:
            return isTrap(cardData) ? TriggerCostType.OPPONENT : TriggerCostType.SELF_TRIGGERED;
        default:
            return '';
    }
}

export const getCostSupertypeOptions = (cardData: CardData): Array<string> => {
    const cost = getEffectsCost(cardData);
    switch (cost.costType) {
        case CostType.TRIGGER:
            switch (cost.subtype) {
                case TriggerCostType.SELF_TRIGGERED:
                    return Object.values(SelfTriggeredCostType);
                case TriggerCostType.OPPONENT:
                    return Object.values(OpponentTriggerCostType);
            }
    }
    return [];
}

export const getDefaultCostSupertype = (cardData: CardData) => {
    const cost = getEffectsCost(cardData);
    switch (cost.costType) {
        case CostType.TRIGGER:
            switch (cost.subtype) {
                case TriggerCostType.SELF_TRIGGERED:
                    return SelfTriggeredCostType.FLIPPED_WHEN_ATTACKED;
                case TriggerCostType.OPPONENT:
                    return OpponentTriggerCostType.ATTACKS;
            }
            break;
    }
    return '';
}

export interface AmountProps {
    visible: boolean;
    min: number;
    max: number;
    step: number;
    default: number;
}

export const DEFAULT_AMOUNT_PROPS = {
    visible: false,
    min: 0,
    max: 0,
    step: 0,
    default: 0
}

export const CARD_AMOUNT_PROPS = {
    visible: true,
    min: 1,
    max: 10,
    step: 1,
    default: 1
}

export const LEVEL_AMOUNT_PROPS = {
    visible: true,
    min: 1,
    max: 9,
    step: 1,
    default: 1
}

export const NULLABLE_LEVEL_AMOUNT_PROPS = {
    visible: true,
    min: 0,
    max: 9,
    step: 1,
    default: 0
}


export const STAT_AMOUNT_PROPS = {
    visible: true,
    min: 0,
    max: 2600,
    step: 100,
    default: 100
}

export enum SelectionType {
    NONE = 'None',
    CARD = 'Card',
    HIDDEN_CARD = 'Hidden card',
    LEVEL = 'Level',
    STAT = 'Stat'
}


export const getAmountProps = (selectionType: SelectionType) => {
    switch (selectionType) {
        case SelectionType.NONE:
            return DEFAULT_AMOUNT_PROPS;
        case SelectionType.CARD:
            return CARD_AMOUNT_PROPS;
        case SelectionType.HIDDEN_CARD:
            return CARD_AMOUNT_PROPS;
        case SelectionType.LEVEL:
            return LEVEL_AMOUNT_PROPS;
        case SelectionType.STAT:
            return STAT_AMOUNT_PROPS;
    }
}

export const getCostSelectionType = (cardData: CardData) => {
    const cost = getEffectsCost(cardData);
    switch (cost.costType) {
        case CostType.PAYMENT:
            switch (cost.subtype) {
                case PaymentCostType.DISCARD:
                    return SelectionType.CARD;
                case PaymentCostType.LIFE:
                    return SelectionType.STAT;
                case PaymentCostType.MILL:
                    return SelectionType.HIDDEN_CARD;
                case PaymentCostType.RESHUFFLE:
                    return SelectionType.CARD;
                case PaymentCostType.SACRIFICE:
                    return SelectionType.CARD;
            }
            break;
        case CostType.STATE:
            switch (cost.subtype) {
                case StateCostType.COUNT_CARDS:
                    return SelectionType.CARD;
            }
            break;
    }
    return SelectionType.NONE;
}

export const getCostTypeOptions = (cardData: CardData) => {
    const options = Object.values(CostType);
    switch (cardData.cardType) {
        case CardType.SPELL:
            return options.filter(option => ![CostType.TRIGGER].includes(option));
        case CardType.TRAP:
            return [CostType.TRIGGER];
    }
    return options;
}

export const getDefaultCostType = (cardData: CardData) => {
    return isTrap(cardData) ? CostType.TRIGGER : CostType.NONE;
}