export enum CostType {
    CONTINUOUS = 'Continuous',
    FLIPPED_WHEN_ATTACKED = 'Flipped when attacked',
    IN_MAXIMUM_MODE = 'In maximum mode',
    MAXIMUM_SUMMONED = 'Maximum summoned',
    NONE = 'None',
    YOU_CONTROL_ONLY_THIS = 'You control only this',
}

export enum EffectType {
    CHECK_IF = 'Check if',
    COUNTS_AS_MULTIPLE_TRIBUTES = 'Counts as multiple tributes',
    DISCARD = 'Discard',
    EXTRAMILL = 'Extramill',
    CAN_SET_FACE_UP = 'Can set face-up',
    CANNOT_ATTACK_DIRECTLY = 'Cannot attack directly',
    CANNOT_BE_ACTIVATED = 'Cannot be activated',
    CHANGE_POSITION = 'Change position',
    COUNT_CARDS = 'Count cards',
    DESTROY = 'Destroy',
    KEYWORD = 'Keyword',
    MILL = 'Mill',
    PAY_LIFE = 'Pay life',
    REBORN = 'Reborn',
    RETRIEVE = 'Retrieve',
    REVERSE_ATTACK_GIVING = 'Reverse attack-giving',
    STAT = 'Stat',
}

export enum EffectRelation {
    ANY_POSITION = 'Any position',
    ATTACK_POSITION = 'Attack',
    DEFENSE_POSITION = 'Defense',
    GAIN = 'Gain',
    LOSE = 'Lose',
    WHEN_ATTACKS = 'When attacks',
}

export enum TargetType {
    ALL_CARDS = 'All cards',
    ALL_MONSTERS = 'All monsters',
    ATTACKER = 'Attacker',
    BOTH_PLAYERS = 'Both players',
    DEFENDER = 'Defender',
    NEXT_SUMMONED = 'Next summoned',
    OPPONENT = 'Opponent',
    OPPONENTS_MONSTERS = 'Opponent\'s monsters',
    REFERENCE_PREVIOUS_EFFECT = 'Reference previous effect',
    TARGET_MONSTER = 'Target monster',
    THIS = 'This',
    YOU = 'You',
    YOUR_MONSTERS = 'Your monsters',
}

export interface EffectsCost {
    costType: CostType|EffectType;
    relation: EffectRelation|null;
    target: EffectTarget;

    amount: number|null;
    countedAmount : CountedAmount|null;
    countedMin: number|null;
    countedMax: number|null;
}

export enum CardTag {
    LIFE_GAIN = 'Life-gain',
    TURN_ENDING = 'Turn ending',
}

export enum MonsterKeyword {
    PIERCING = 'Piercing',
    SLEEPTALK = 'Sleeptalk',
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
    DIFFERENT = 'Different',
    FACE = 'Face',
    KEYWORD = 'Keyword',
    LEVEL = 'Level',
    LIFE = 'Life',
    POSITION = 'Position',
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
    selfFilters: Array<TargetFilter>;
}

export enum CountType {
    CARDS_IN_GRAVE = 'Cards in grave',
    THIS = 'This',
}

export interface CountedAmount {
    countType: CountType;
    target: EffectTarget;
}

export interface EffectsEffect {
    effectType: EffectType;
    relation: EffectRelation|null;
    target: EffectTarget;

    amount: number|null;
    countedAmount : CountedAmount|null;
    countedMin: number|null;
    countedMax: number|null;

    chainedEffect: EffectsEffect|null;
}

export interface CardEffects {
    cost: EffectsCost;
    effect: EffectsEffect;
}