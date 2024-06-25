export enum CostType {
    DISCARD = 'Discard',
    FLIPPED_WHEN_ATTACKED = 'Flipped when attacked',
    NONE = 'None',
    PAY_LIFE = 'Pay life',
    YOU_CONTROL_ONLY_THIS = 'You control only this',
}

export enum EffectType {
    EXTRAMILL = 'Extramill',
    CANNOT_ATTACK_DIRECTLY = 'Cannot attack directly',
    DESTROY = 'Destroy',
    MILL = 'Mill',
    REBORN = 'Reborn',
    RETRIEVE = 'Retrieve',
    STAT = 'Stat',
}

export enum EffectRelation {
    ANY_POSITION = 'Any position',
    ATTACK_POSITION = 'In attack',
    DEFENSE_POSITION = 'In defense',
    GAIN = 'Gain',
    LOSE = 'Lose',
}

export enum TargetType {
    ALL_CARDS = 'All cards',
    ALL_MONSTERS = 'All monsters',
    BOTH_PLAYERS = 'Both players',
    OPPONENT = 'Opponent',
    OPPONENTS_MONSTERS = 'Opponent\'s monsters',
    TARGET_MONSTER = 'Target monster',
    THIS = 'This',
    YOU = 'You',
    YOUR_MONSTERS = 'Your monsters',
}

export interface EffectsCost {
    costType: CostType;
    amount: number;
}

export enum CardTag {
    LIFE_GAIN = 'Life-gain',
    TURN_ENDING = 'Turn ending',
}

export enum FilterType {
    ATK = 'Atk',
    CARD = 'Card',
    CARD_CLASS = 'Class',
    CARD_SUBTYPE = 'Subtype',
    CARD_SUPERTYPE = 'Supertype',
    CARD_TAG = 'Tag',
    CARD_TYPE = 'Type',
    DEF = 'Def',
    LEVEL = 'Level',
    LIFE = 'Life',
}

export interface TargetFilter {
    filterType: FilterType;
    included: Array<number|string>;
    max: number|null;
    min: number|null;
    notIncluded: Array<number|string>
}

export interface EffectTarget {
    targetType: TargetType;
    filters: Array<TargetFilter>;
}

export enum CountType {
    CARDS_IN_GRAVE = 'Cards in grave',

}

export interface CountedAmount {
    countType: CountType;
    target: EffectTarget;
}

export interface EffectsEffect {
    effectType: EffectType;
    relation: EffectRelation|null;
    amount: number|null;
    countedAmount : CountedAmount|null;
    target: EffectTarget;
    chainedEffect: EffectsEffect|null;
}

export interface CardEffects {
    cost: EffectsCost;
    effect: EffectsEffect;
}