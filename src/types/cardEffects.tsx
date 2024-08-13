import {
    CardClass,
    CardData,
    CardSubtype,
    CardType, getEffectsChainEffect,
    getEffectsCost, getEffectsEffect,
    isMonster,
    isTrap
} from "./card";

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
    NONE = 'None',
    DISCARD = 'Discard',
    LIFE = 'Life',
    MILL = 'Mill',
    RESHUFFLE = 'Reshuffle',
    SACRIFICE = 'Sacrifice',
}

export const isPaymentCostType = (value: string): value is PaymentCostType => {
    return Object.values(PaymentCostType).includes(value as PaymentCostType);
}

export enum StateCostType {
    NONE = 'None',
    COUNT_CARDS = 'Count cards',
    NO_MONSTERS = 'No monsters',
    SUMMONED_THIS_TURN = 'Summoned this turn',
    YOU_CONTROL_ONLY_THIS = 'You control only this'
}

export const isStateCostType = (value: string): value is StateCostType => {
    return Object.values(StateCostType).includes(value as StateCostType);
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

export const DEFAULT_EFFECTS_PAYMENT : EffectsPayment = {
    paymentType: PaymentCostType.NONE,
    amount: null,
    cardType: null
}

export enum Zone {
    NONE = 'None',
    DECK = 'Deck',
    FIELD = 'Field',
    GRAVE = 'Grave',
    HAND = 'Hand'
}

export const isZone = (value: string): value is Zone => {
    return Object.values(Zone).includes(value as Zone);
}

export enum TargetType {
    NONE = 'None',
    ALL = 'All',
    ATTACKER = 'Attacker',
    OTHER = 'Other',
    TARGET = 'Target',
    THIS = 'This'
}

const TARGET_OR_ALL_TARGET_TYPE_OPTIONS = [
    TargetType.ALL,
    TargetType.TARGET
];

const THIS_TARGET_OR_ALL_TARGET_TYPE_OPTIONS = [
    TargetType.ALL,
    TargetType.TARGET,
    TargetType.THIS
]

const ATTACK_TRIGGER_TARGET_TYPE_OPTIONS = [
    TargetType.ALL,
    TargetType.ATTACKER,
    TargetType.TARGET
]

export const isTargetType = (value: string): value is TargetType => {
    return Object.values(TargetType).includes(value as TargetType);
}

export enum TargetOwner {
    NONE = 'None',
    ANY = 'Any',
    BOTH = 'Both',
    OPPONENT = 'Opponent',
    YOU = 'You'
}

const ONE_TARGET_OWNER_OPTIONS = [
    TargetOwner.BOTH,
    TargetOwner.OPPONENT,
    TargetOwner.YOU
];

const TARGET_OWNER_FILTER_OPTIONS = [
    TargetOwner.ANY,
    TargetOwner.OPPONENT,
    TargetOwner.YOU
];

export const isTargetOwner = (value: string): value is TargetOwner => {
    return Object.values(TargetOwner).includes(value as TargetOwner);
}


export type EffectsTarget = {
    cardType: CardType|null,
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

export const DEFAULT_EFFECTS_TARGET: EffectsTarget = {
    cardType: null,
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
    NONE = 'None',
    LEVEL = 'Level'
}

export const isPostCountType = (value: string): value is PostCountType => {
    return Object.values(PostCountType).includes(value as PostCountType);
}

export enum LevelPostCountType {
    COMBINED = 'Combined'
}

export type PostCount = {
    countType: PostCountType,
    subtype: string|null;
}

export const DEFAULT_EFFECTS_POST_COUNT : PostCount = {
    countType: PostCountType.NONE,
    subtype: null
}

export enum EffectType {
    EVIL = 'Evil',
    KEYWORD = 'Keyword',
    MOVE_CARD = 'Move card',
    NONE = 'None',
    STAT = 'Stat'
}

export const isEffectType = (value: string): value is EffectType => {
    return Object.values(EffectType).includes(value as EffectType);
}

export enum StatEffectType {
    ATK = 'Atk',
    DEF = 'Def',
    LIFE = 'Life',
    POSITION = 'Position',
    SWITCH = 'Switch'
}

export enum KeywordEffectType {
    CHAIN_ATTACK = 'Chain-attack',
    PIERCING = 'Piercing',
    TRIBUTES_ALTERATION = 'Tributes alteration'
}

export enum TributesAlterationEffectType {
    DOUBLE_TRIBUTE = 'Double tribute'
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

export const DEFAULT_EFFECTS_COUNT : EffectsCount = {
    multiplier: 1,
    target: DEFAULT_EFFECTS_TARGET
}

export enum EffectsDirection {
    NONE = 'None',
    ATTACK = 'Attack',
    DEFENSE = 'Defense',
    DOUBLE = 'Double',
    FACE_DOWN = 'Face-down',
    FACE_UP = 'Face-up',
    GAIN = 'Gain',
    LOSE = 'Lose'
}

const FLIP_DIRECTION_CHOICES = [
    EffectsDirection.FACE_DOWN,
    EffectsDirection.FACE_UP
]

const STAT_DIRECTION_CHOICES = [
    EffectsDirection.DOUBLE,
    EffectsDirection.GAIN,
    EffectsDirection.LOSE
]

const POSITION_DIRECTION_CHOICES = [
    EffectsDirection.ATTACK,
    EffectsDirection.DEFENSE
]

const KEYWORD_DIRECTION_CHOICES = [
    EffectsDirection.GAIN,
    EffectsDirection.LOSE
]

const SUMMON_DIRECTION_CHOICES = [
    EffectsDirection.ATTACK,
    EffectsDirection.DEFENSE,
    EffectsDirection.FACE_UP
]

export const isEffectsDirection = (value: string): value is EffectsDirection => {
    return Object.values(EffectsDirection).includes(value as EffectsDirection);
}

export enum EffectsHindrance {
    NONE = 'None',
    CANNOT_ATTACK_DIRECTLY = 'Cannot attack directly',
    OPPONENT_TOP_SUMMONS = 'Opponent top-summons'
}

export const isEffectsHindrance = (value: string): value is EffectsHindrance => {
    return Object.values(EffectsHindrance).includes(value as EffectsHindrance);
}

export enum EffectsBenefit {
    NONE = 'None',
    DRAW = 'Draw a card'
}

export const isEffectsBenefit = (value: string): value is EffectsBenefit => {
    return Object.values(EffectsBenefit).includes(value as EffectsBenefit);
}

export type EffectsCost = {
    prestate: StateCostType|null;
    costType: CostType;
    subtype: string|null;
    supertype: string|null;
    amount: number|null;
    target: EffectsTarget|null;
    payment: EffectsPayment|null;
    postCount: PostCount|null;
}

export enum ChainType {
    NONE = 'None',
    ALTER_SUMMONED = 'Alter summoned'
}

export const isChainType = (value: string): value is ChainType => {
    return Object.values(ChainType).includes(value as ChainType);
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

export const DEFAULT_CHAIN_EFFECT = {
    chainType: ChainType.NONE,
    subtype: null,
    direction: null,
    amount: null
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

export const DEFAULT_EFFECTS_COST: EffectsCost = {
    prestate: null,
    costType: CostType.NONE,
    subtype: null,
    supertype: null,
    amount: null,
    target: null,
    payment: null,
    postCount: null
}

export const DEFAULT_EFFECTS_EFFECT: EffectsEffect = {
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

export const DEFAULT_CARD_EFFECTS: CardEffects = {
    cost: DEFAULT_EFFECTS_COST,
    effect: DEFAULT_EFFECTS_EFFECT
}

export const getCostSubtypeOptions = (cardData: CardData): Array<string> => {
    let costTypes;
    switch (cardData.cardEffects.cost.costType) {
        case CostType.PAYMENT:
            return Object.values(PaymentCostType).filter(type => type !== PaymentCostType.NONE);
        case CostType.STATE:
            costTypes = Object.values(StateCostType);
            const notAvailable = (isMonster(cardData) ? SpellSpecificStateCostTypes : MonsterSpecificStateCostTypes).concat([StateCostType.NONE]);
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


export const NULLABLE_STAT_AMOUNT_PROPS = {
    visible: true,
    min: -100,
    max: 2600,
    step: 100,
    default: -100
}

export const ALL_CARDS_AMOUNT_PROPS = {
    visible: true,
    min: 0,
    max: 0,
    step: 0,
    default: 0
}

export enum SelectionType {
    NONE = 'None',
    ALL_CARDS = 'All cards',
    ALL_PRIVATE_CARDS = 'All private cards',
    CARD = 'Card',
    HIDDEN_CARD = 'Hidden card',
    LEVEL = 'Level',
    PRIVATE_CARD = 'Private card',
    STAT = 'Stat'
}

export const isCardPropertySelection = (selectionType: SelectionType) => {
    return [
        SelectionType.ALL_CARDS,
        SelectionType.CARD,
        SelectionType.PRIVATE_CARD
    ].includes(selectionType);
}

export const getAmountProps = (selectionType: SelectionType) => {
    switch (selectionType) {
        case SelectionType.NONE:
            return DEFAULT_AMOUNT_PROPS;
        case SelectionType.ALL_CARDS:
            return ALL_CARDS_AMOUNT_PROPS;
        case SelectionType.ALL_PRIVATE_CARDS:
            return ALL_CARDS_AMOUNT_PROPS;
        case SelectionType.CARD:
            return CARD_AMOUNT_PROPS;
        case SelectionType.HIDDEN_CARD:
            return CARD_AMOUNT_PROPS;
        case SelectionType.LEVEL:
            return LEVEL_AMOUNT_PROPS;
        case SelectionType.PRIVATE_CARD:
            return CARD_AMOUNT_PROPS;
        case SelectionType.STAT:
            return STAT_AMOUNT_PROPS;
    }
}

export const fixSelectionTypeByTarget = (selectionType: SelectionType, target: EffectsTarget|null) => {
    if (target?.targetType === TargetType.ALL) {
        switch (selectionType) {
            case SelectionType.CARD:
                return SelectionType.ALL_CARDS;
            case SelectionType.PRIVATE_CARD:
                return SelectionType.ALL_PRIVATE_CARDS;
        }
    }
    return selectionType;
}

export const getCostSelectionType = (cardData: CardData) => {
    const cost = getEffectsCost(cardData);
    const selectionType = routeCostSelectionType(cost);
    return fixSelectionTypeByTarget(selectionType, cost?.target);
}

const routeCostSelectionType = (cost: EffectsCost) => {
    let selectionType;
    switch (cost.costType) {
        case CostType.PAYMENT:
            selectionType = routePaymentCostTypeSelectionType(cost.subtype || PaymentCostType.NONE);
            if (selectionType === SelectionType.NONE) {
                break;
            }
            return selectionType;
        case CostType.STATE:
            switch (cost.subtype) {
                case StateCostType.COUNT_CARDS:
                    return SelectionType.CARD;
            }
            break;
        case CostType.TRIGGER:
            switch (cost.subtype) {
                case TriggerCostType.OPPONENT:
                    switch (cost.supertype) {
                        case OpponentTriggerCostType.ATTACKS:
                        case OpponentTriggerCostType.SUMMONS:
                            return SelectionType.CARD;
                    }
                    break;
            }
            break;
    }
    return SelectionType.NONE;
}

export const routePaymentCostTypeSelectionType = (paymentType : string) => {
    switch (paymentType) {
        case PaymentCostType.DISCARD:
            return SelectionType.PRIVATE_CARD;
        case PaymentCostType.LIFE:
            return SelectionType.STAT;
        case PaymentCostType.MILL:
            return SelectionType.HIDDEN_CARD;
        case PaymentCostType.RESHUFFLE:
            return SelectionType.CARD;
        case PaymentCostType.SACRIFICE:
            return SelectionType.CARD;
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

export const getCostTargetTypeOptions = (cardData: CardData) => {
    const cost = getEffectsCost(cardData);
    switch (cost.costType) {
        case CostType.PAYMENT:
            switch(cost.subtype) {
                case PaymentCostType.DISCARD:
                    return [TargetType.ALL, TargetType.TARGET];
            }
            break;
    }
    return [];
}

export const getDefaultCostTargetType = (cardData: CardData) => {
    const cost = getEffectsCost(cardData);
    switch (cost.costType) {
        case CostType.PAYMENT:
            switch(cost.subtype) {
                case PaymentCostType.DISCARD:
                    return TargetType.TARGET;
            }
            break;
    }
    return TargetType.NONE;
}

export const getCostTargetOwnerOptions = (cardData: CardData) => {
    return [];
}

export const getDefaultCostTargetOwner = (cardData: CardData) => {
    return TargetOwner.NONE;
}

export const getCostTargetZoneOptions = (cardData: CardData) => {
    const cost = getEffectsCost(cardData);
    switch (cost.costType) {
        case CostType.STATE:
            switch (cost.subtype) {
                case StateCostType.COUNT_CARDS:
                    return [Zone.FIELD, Zone.GRAVE];
            }
    }
    return [];
}

export const getDefaultCostTargetZone = (cardData: CardData) => {
    const cost = getEffectsCost(cardData);
    switch (cost.costType) {
        case CostType.STATE:
            switch (cost.subtype) {
                case StateCostType.COUNT_CARDS:
                    return Zone.GRAVE;
            }
    }
    return Zone.NONE;
}

export const getCostPrestateOptions = (cardData: CardData) => {
    const options = Object.values(StateCostType).filter(type => ![
        StateCostType.COUNT_CARDS
    ].includes(type));
    const cost = getEffectsCost(cardData);
    switch (cost.costType) {
        case CostType.PAYMENT:
            return options;
        case CostType.STATE:
            return options;
    }
    return [];
}

export const getDefaultCostPrestate = (cardData: CardData) => {
    const cost = getEffectsCost(cardData);
    switch (cost.costType) {
    }
    return StateCostType.NONE;
}

export const getCostPaymentTypeOptions = (cardData: CardData) => {
    const options = Object.values(PaymentCostType);
    const cost = getEffectsCost(cardData);
    switch (cost.costType) {
        case CostType.PAYMENT:
            return options;
        case CostType.STATE:
            return options;
        case CostType.TRIGGER:
            return options;
    }
    return [];
}

export const getDefaultCostPaymentType = (cardData: CardData) => {
    const cost = getEffectsCost(cardData);
    switch (cost.costType) {
    }
    return PaymentCostType.NONE;
}

export const getCostPostCountTypeOptions = (cardData: CardData) => {
    const cost = getEffectsCost(cardData);
    if (cost.costType === CostType.PAYMENT) {
        return Object.values(PostCountType);
    }
    return [];
}

export const getDefaultCostPostCountType = (cardData: CardData) => {
    const cost = getEffectsCost(cardData);
    switch (cost.costType) {
    }
    return PaymentCostType.NONE;
}

export const getCostPostCountSubtypeOptions = (countType: PostCountType) => {
    switch (countType) {
        case PostCountType.LEVEL:
            return Object.values(LevelPostCountType);
    }
    return [];
}

export const getDefaultCostPostCountSubtype = (countType: PostCountType) => {
    switch (countType) {
        case PostCountType.LEVEL:
            return LevelPostCountType.COMBINED;
    }
    return '';
}

export const getEffectTypeOptions = (cardData: CardData) => {
    const options = Object.values(EffectType);
    switch (cardData.cardType) {
    }
    return options;
}

export const getDefaultEffectType = (cardData: CardData) => {
    return EffectType.NONE;
}

export const getEffectSubtypeOptions = (cardData: CardData) => {
    const effect = getEffectsEffect(cardData);
    switch (effect.effectType) {
        case EffectType.EVIL:
            return Object.values(EvilEffectType);
        case EffectType.KEYWORD:
            return Object.values(KeywordEffectType);
        case EffectType.MOVE_CARD:
            return Object.values(MoveCardEffectType);
        case EffectType.STAT:
            return Object.values(StatEffectType);
    }
    return [];
}

export const getDefaultEffectSubtype = (cardData: CardData) => {
    const effect = getEffectsEffect(cardData);
    switch (effect.effectType) {
        case EffectType.EVIL:
            return EvilEffectType.DESTROY;
        case EffectType.KEYWORD:
            return KeywordEffectType.PIERCING;
        case EffectType.MOVE_CARD:
            return MoveCardEffectType.DRAW;
        case EffectType.STAT:
            return StatEffectType.ATK;
    }
    return '';
}

export const getEffectSupertypeOptions = (cardData: CardData) => {
    const effect = getEffectsEffect(cardData);
    switch (effect.effectType) {
        case EffectType.EVIL:
            switch (effect.subtype) {
                case EvilEffectType.STEAL:
                    return Object.values(StealEffectType);
            }
            break;
        case EffectType.KEYWORD:
            switch (effect.subtype) {
                case KeywordEffectType.TRIBUTES_ALTERATION:
                    return Object.values(TributesAlterationEffectType);
            }
            break;
        case EffectType.MOVE_CARD:
            switch (effect.subtype) {
                case MoveCardEffectType.SUMMON:
                    return Object.values(SummonEffectType);
            }
            break;
    }
    return [];
}

export const getDefaultEffectSupertype = (cardData: CardData) => {
    const effect = getEffectsEffect(cardData);
    switch (effect.effectType) {
        case EffectType.EVIL:
            switch (effect.subtype) {
                case EvilEffectType.STEAL:
                    return StealEffectType.GAIN_CONTROL;
            }
            break;
        case EffectType.KEYWORD:
            switch (effect.subtype) {
                case KeywordEffectType.TRIBUTES_ALTERATION:
                    return TributesAlterationEffectType.DOUBLE_TRIBUTE;
            }
            break;
        case EffectType.MOVE_CARD:
            switch (effect.subtype) {
                case MoveCardEffectType.SUMMON:
                    return SummonEffectType.REBORN;
            }
            break;
    }
    return '';
}

export const getEffectSelectionType = (cardData: CardData) => {
    const effect = getEffectsEffect(cardData);
    const selectionType = routeEffectSelectionType(effect);
    if (effect.direction === EffectsDirection.DOUBLE) {
        return SelectionType.ALL_CARDS;
    }
    return fixSelectionTypeByTarget(selectionType, effect?.target);
}

const routeEffectSelectionType = (effect: EffectsEffect) => {
    switch (effect.effectType) {
        case EffectType.EVIL:
            switch (effect.subtype) {
                case EvilEffectType.DESTROY:
                    return SelectionType.CARD;
                case EvilEffectType.DISCARD:
                    return SelectionType.PRIVATE_CARD;
                case EvilEffectType.FLIP:
                    return SelectionType.CARD;
                case EvilEffectType.MILL:
                    return SelectionType.HIDDEN_CARD;
                case EvilEffectType.STEAL:
                    switch (effect.supertype) {
                        case StealEffectType.GAIN_CONTROL:
                            return SelectionType.CARD;
                        case StealEffectType.SWITCH_WITH:
                            return SelectionType.CARD;
                    }
                    break;
            }
            break;
        case EffectType.KEYWORD:
            return SelectionType.ALL_CARDS;
        case EffectType.MOVE_CARD:
            switch (effect.subtype) {
                case MoveCardEffectType.DRAW:
                    return SelectionType.HIDDEN_CARD;
                case MoveCardEffectType.RESTACK:
                    return SelectionType.CARD;
                case MoveCardEffectType.RETRIEVE:
                    return SelectionType.CARD;
                case MoveCardEffectType.SUMMON:
                    switch (effect.supertype) {
                        case SummonEffectType.TOP_SUMMON:
                            return SelectionType.CARD;
                        case SummonEffectType.REBORN:
                            return SelectionType.CARD;
                    }
                    break;
            }
            break;
        case EffectType.STAT:
            switch (effect.subtype) {
                case StatEffectType.ATK:
                    return SelectionType.STAT;
                case StatEffectType.DEF:
                    return SelectionType.STAT;
                case StatEffectType.LIFE:
                    return SelectionType.STAT;
                case StatEffectType.POSITION:
                    return SelectionType.ALL_CARDS;
                case StatEffectType.SWITCH:
                    return SelectionType.ALL_CARDS;
            }
            break;
    }
    return SelectionType.NONE;
}

export function isCountedAmount(amount: number|EffectsCount|null): amount is EffectsCount {
    return  typeof amount === 'object' && amount !== null;
}

export const getTargetTypeOptions = (selectionType: SelectionType) => {
    switch (selectionType) {
        case SelectionType.CARD:
            return [TargetType.ALL, TargetType.OTHER];
    }
    return [];
}

export const getDefaultTargetType = (selectionType: SelectionType) => {
   switch (selectionType) {
        case SelectionType.CARD:
            return TargetType.ALL;
    }
    return '';
}

export const getTargetOwnerOptions = (selectionType: SelectionType) => {
    switch (selectionType) {
        case SelectionType.CARD:
            return [TargetOwner.ANY, TargetOwner.OPPONENT, TargetOwner.YOU];
    }
    return [];
}

export const getDefaultTargetOwner = (selectionType: SelectionType) => {
    switch (selectionType) {
        case SelectionType.CARD:
            return TargetOwner.YOU;
    }
    return '';
}

export const getTargetZoneOptions = (selectionType: SelectionType) => {
    switch (selectionType) {
        case SelectionType.CARD:
            return [Zone.FIELD, Zone.GRAVE];
    }
    return [];
}

export const getDefaultTargetZone = (selectionType: SelectionType) => {
    switch (selectionType) {
        case SelectionType.CARD:
            return Zone.GRAVE;
    }
    return '';
}

const isAttackTrigger = (cardData: CardData) => {
    const cost = getEffectsCost(cardData);
    return cost.costType === CostType.TRIGGER
        && cost.subtype === TriggerCostType.OPPONENT
        && cost.supertype === OpponentTriggerCostType.ATTACKS;
}

export const getEffectTargetTypeOptions = (cardData: CardData) => {
    const effect = getEffectsEffect(cardData);
    switch (effect.effectType) {
        case EffectType.EVIL:
            switch (effect.subtype) {
                case EvilEffectType.DESTROY:
                case EvilEffectType.DISCARD:
                case EvilEffectType.FLIP:
                case EvilEffectType.STEAL:
                    return TARGET_OR_ALL_TARGET_TYPE_OPTIONS;
            }
            break;
        case EffectType.KEYWORD:
        case EffectType.STAT:
            return isMonster(cardData) ? THIS_TARGET_OR_ALL_TARGET_TYPE_OPTIONS
                : isAttackTrigger(cardData) ? ATTACK_TRIGGER_TARGET_TYPE_OPTIONS
                    : TARGET_OR_ALL_TARGET_TYPE_OPTIONS;
    }
    return [];
}

export const getDefaultEffectTargetType = (cardData: CardData) => {
    const effect = getEffectsEffect(cardData);
    switch (effect.effectType) {
        case EffectType.EVIL:
            switch (effect.subtype) {
                case EvilEffectType.DESTROY:
                case EvilEffectType.DISCARD:
                case EvilEffectType.FLIP:
                case EvilEffectType.STEAL:
                    return TargetType.TARGET;
            }
            break;
        case EffectType.KEYWORD:
        case EffectType.STAT:
            return isMonster(cardData) ? TargetType.THIS : isAttackTrigger(cardData) ? TargetType.ATTACKER : TargetType.TARGET;
    }
    return TargetType.NONE;
}

export const getEffectTargetOwnerOptions = (cardData: CardData) => {
    const effect = getEffectsEffect(cardData);
    switch (effect.effectType) {
        case EffectType.EVIL:
            switch (effect.subtype) {
                case EvilEffectType.DESTROY:
                    return TARGET_OWNER_FILTER_OPTIONS;
                case EvilEffectType.DISCARD:
                    return ONE_TARGET_OWNER_OPTIONS;
                case EvilEffectType.FLIP:
                    return TARGET_OWNER_FILTER_OPTIONS;
                case EvilEffectType.MILL:
                    return ONE_TARGET_OWNER_OPTIONS;
            }
            break;
        case EffectType.KEYWORD:
        case EffectType.STAT:
            return TARGET_OWNER_FILTER_OPTIONS;
    }
    return [];
}

export const getDefaultEffectTargetOwner = (cardData: CardData) => {
    const effect = getEffectsEffect(cardData);
    switch (effect.effectType) {
        case EffectType.EVIL:
            switch (effect.subtype) {
                case EvilEffectType.DESTROY:
                    return TargetOwner.ANY;
                case EvilEffectType.DISCARD:
                    return TargetOwner.OPPONENT;
                case EvilEffectType.FLIP:
                    return TargetOwner.ANY;
                case EvilEffectType.MILL:
                    return TargetOwner.OPPONENT;
            }
            break;
        case EffectType.KEYWORD:
        case EffectType.STAT:
            return TargetOwner.ANY;
    }
    return TargetOwner.NONE;
}

export const getEffectTargetZoneOptions = (cardData: CardData) => {
    const effect = getEffectsEffect(cardData);
    switch (effect.effectType) {
    }
    return [];
}

export const getDefaultEffectTargetZone = (cardData: CardData) => {
    const effect = getEffectsEffect(cardData);
    switch (effect.effectType) {
    }
    return Zone.NONE;
}

export const getEffectDirectionOptions = (cardData: CardData) => {
    const effect = getEffectsEffect(cardData);
    switch (effect.effectType) {
        case EffectType.EVIL:
            switch (effect.subtype) {
                case EvilEffectType.FLIP:
                    return FLIP_DIRECTION_CHOICES;
            }
            break;
        case EffectType.KEYWORD:
            switch (effect.subtype) {
                case KeywordEffectType.CHAIN_ATTACK:
                case KeywordEffectType.PIERCING:
                    return KEYWORD_DIRECTION_CHOICES;
            }
            break;
        case EffectType.MOVE_CARD:
            switch (effect.subtype) {
                case MoveCardEffectType.SUMMON:
                    return SUMMON_DIRECTION_CHOICES;
            }
            break;
        case EffectType.STAT:
            switch (effect.subtype) {
                case StatEffectType.ATK:
                case StatEffectType.DEF:
                case StatEffectType.LIFE:
                    return STAT_DIRECTION_CHOICES;
                case StatEffectType.POSITION:
                    return POSITION_DIRECTION_CHOICES;
            }
            break;
    }
    return [];
}

export const getDefaultEffectDirection = (cardData: CardData) => {
    const effect = getEffectsEffect(cardData);
    switch (effect.effectType) {
        case EffectType.EVIL:
            switch (effect.subtype) {
                case EvilEffectType.FLIP:
                    return EffectsDirection.FACE_DOWN;
            }
            break;
        case EffectType.KEYWORD:
            switch (effect.subtype) {
                case KeywordEffectType.CHAIN_ATTACK:
                case KeywordEffectType.PIERCING:
                    return EffectsDirection.GAIN;
            }
            break;
        case EffectType.MOVE_CARD:
            switch (effect.subtype) {
                case MoveCardEffectType.SUMMON:
                    return EffectsDirection.FACE_UP;
            }
            break;
        case EffectType.STAT:
            switch (effect.subtype) {
                case StatEffectType.ATK:
                case StatEffectType.DEF:
                case StatEffectType.LIFE:
                    return EffectsDirection.GAIN;
                case StatEffectType.POSITION:
                    return EffectsDirection.DEFENSE;
            }
            break;
    }
    return EffectsDirection.NONE;
}

export const getEffectHindranceOptions = (cardData: CardData) => {
    return Object.values(EffectsHindrance);
}

export const getEffectBenefitOptions = (cardData: CardData) => {
    return Object.values(EffectsBenefit);
}

export const getChainEffectTypeOptions = (cardData: CardData) => {
    const effect = getEffectsEffect(cardData);
    switch (effect.effectType) {
        case EffectType.MOVE_CARD:
            switch (effect.subtype) {
                case MoveCardEffectType.SUMMON:
                    return [ChainType.NONE, ChainType.ALTER_SUMMONED];
            }
            break;
    }
    return [];
}

export const getChainEffectSubtypeOptions = (cardData: CardData) => {
    const chainEffect = getEffectsChainEffect(cardData);
    switch (chainEffect.chainType) {
        case ChainType.ALTER_SUMMONED:
            return Object.values(AlterSummonedChainType);
    }
    return [];
}

export const getDefaultChainEffectSubtype = (cardData: CardData) => {
    const chainEffect = getEffectsChainEffect(cardData);
    switch (chainEffect.chainType) {
        case ChainType.ALTER_SUMMONED:
            return AlterSummonedChainType.ATK;
    }
    return '';
}

export const getChainEffectDirectionOptions = (cardData: CardData) => {
    const chainEffect = getEffectsChainEffect(cardData);
    switch (chainEffect.chainType) {
        case ChainType.ALTER_SUMMONED:
            return STAT_DIRECTION_CHOICES;
    }
    return [];
}

export const getDefaultChainEffectDirection = (cardData: CardData) => {
    const chainEffect = getEffectsChainEffect(cardData);
    switch (chainEffect.chainType) {
        case ChainType.ALTER_SUMMONED:
            return EffectsDirection.GAIN;
    }
    return '';
}

export const getChainEffectSelectionType = (cardData: CardData) => {
    const chainEffect = getEffectsChainEffect(cardData);
    switch (chainEffect.chainType) {
        case ChainType.ALTER_SUMMONED:
            if (chainEffect.direction === EffectsDirection.DOUBLE) {
                return SelectionType.NONE;
            }
            return SelectionType.STAT;
    }
    return SelectionType.NONE;
}
