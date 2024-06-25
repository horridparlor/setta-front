export enum CostType {
    EQUIP = 'Equip',
    FLIPPED_WHEN_ATTACKED = 'Flipped when attacked',
    IN_MAXIMUM_MODE = 'In maximum mode',
    MAXIMUM_SUMMONED = 'Maximum summoned',
    NO_MONSTERS = 'No monsters',
    NONE = 'None',
    SUMMONED_THIS_TURN = 'Summoned this turn',
    WHEN_REMOVED = 'When removed',
    WHEN_EQUIPPED_REMOVED = 'When equipped removed',
    WHENEVER = 'Whenever',
    YOU_CONTROL_ONLY_THIS = 'You control only this',
}

export enum EffectType {
    ACTIVATE = 'Activate',
    ARMOR_UP = 'Armor-up',
    CHECK_IF = 'Check if',
    COUNTS_AS_MULTIPLE_TRIBUTES = 'Counts as multiple tributes',
    DISCARD = 'Discard',
    DONT_HAVE_TO_TRIBUTE = 'Don\'t have to tribute',
    EXTRAMILL = 'Extramill',
    CAN_BE_ANY_MATERIAL = 'Can be any material',
    CAN_SET_FACE_UP = 'Can set face-up',
    CANNOT_ATTACK_DIRECTLY = 'Cannot attack directly',
    CANNOT_BE_ACTIVATED = 'Cannot be activated',
    CHANGE_FACE = 'Change face',
    CHANGE_POSITION = 'Change position',
    COUNT_CARDS = 'Count cards',
    DESTROY = 'Destroy',
    DRAW = 'Draw',
    FUSE_FROM_HAND = 'Fuse from hand',
    KEYWORD = 'Keyword',
    MILL = 'Mill',
    NEGATE_EFFECT = 'Negate effects',
    PAY_LIFE = 'Pay life',
    REBORN = 'Reborn',
    REPEAT = 'Repeat',
    RESCALE = 'Rescale',
    RESETTLE = 'Resettle',
    RESHUFFLE = 'Reshuffle',
    RESTACK = 'Restack',
    RETRIEVE = 'Retrieve',
    REVERSE_ATTACK_GIVING = 'Reverse attack-giving',
    SACRIFICE = 'Sacrifice',
    SET = 'Set',
    SHOOT = 'Shoot',
    SHUFFLE = 'Shuffle',
    STAT = 'Stat',
    STEALS = 'Steals',
    SUMMON = 'Summon',
    SWITCH_ATTACK_TARGET = 'Switch attack target',
}

export enum EffectRelation {
    ANY_FACE = 'Any face',
    ANY_POSITION = 'Any position',
    ATTACK_POSITION = 'Attack',
    DEFENSE_POSITION = 'Defense',
    FACE_DOWN = 'Face-down',
    FACE_UP = 'Face-up',
    GAIN = 'Gain',
    LOSE = 'Lose',
    NONE = 'None',
    SWAP = 'Swap',
    SWITCH = 'Switch',
    UNTIL = 'Until',
    WHEN_ATTACKS = 'When attacks',
    WHEN_FIGHTS = 'When fights',
}

export enum TargetType {
    ALL_CARDS = 'All cards',
    ALL_MONSTERS = 'All monsters',
    ATTACKER = 'Attacker',
    BOTH_PLAYERS = 'Both players',
    DEFENDER = 'Defender',
    FOUGHT_CARD = 'Fought card',
    FROM_TARGET_TO_TARGET = 'From target to target',
    NEXT_SUMMONED = 'Next summoned',
    OF_EACH_REFERENCED = 'Of each referenced',
    OPPONENT = 'Opponent',
    OPPONENTS_MONSTERS = 'Opponent\'s monsters',
    REFERENCE_PREVIOUS_EFFECT = 'Reference previous effect',
    TARGET_MONSTER = 'Target monster',
    THIS = 'This',
    YOU = 'You',
    YOUR_MONSTERS = 'Your monsters',
}

export enum EffectTiming {
    CONTINUOUS = 'Continuous',
    END_OF_TURN = 'End of turn',
    IMMEDIATE = 'Immediate',
    RULER_EFFECT = 'Ruler-effect',
}

export interface EffectsCost {
    costType: CostType|EffectType;
    relation: EffectRelation|null;
    target: EffectTarget;

    amount: number|null;
    minAmount: number|null;
    countedAmount : CountedAmount|null;
    countedMin: number|null;
    countedMax: number|null;

    payment: EffectsCost|null;
    trigger: EffectsCost|null;
}

export enum CardTag {
    LIFE_GAIN = 'Life-gain',
    TURN_ENDING = 'Turn ending',
}

export enum MonsterKeyword {
    CHAIN_ATTACK = 'Chain-attack',
    PIERCING = 'Piercing',
    SLEEPTALK = 'Sleeptalk',
    TRIPLE_ATTACK = 'Triple-attack',
    UNAFFECTED_BY_EFFECTS = 'Unaffected by effects',
}

export enum Zone {
    ARMOR_STACK = 'Armor stack',
    DECK = 'Deck',
    EXILE = 'Exile',
    EXTRA_DECK = 'Extra-deck',
    FIELD = 'Field',
    HAND = 'Hand',
    PARASITE = 'Parasite',
}

export enum RemovalSource {
    ANY = 'Any',
    DESTROYED = 'Destroyed',
    DESTROYED_BY_ATTACK = 'Destroyed by attack',
    DESTROYED_BY_EFFECT = 'Destroyed by effect',
    EFFECT = 'Effect'
}

export enum FilterType {
    ATK = 'Atk',
    CARD = 'Card',
    CARD_CLASS = 'Class',
    CARD_SUBTYPE = 'Subtype',
    CARD_SUPERTYPE = 'Supertype',
    CARD_TAG = 'Tag',
    CARD_TYPE = 'Type',
    COST_TYPE = 'Cost type',
    DEF = 'Def',
    REMOVAL_SOURCE = 'Removal source',
    DIFFERENT = 'Different',
    EFFECT_TYPE = 'Effect type',
    FACE = 'Face',
    KEYWORD = 'Keyword',
    LESS = 'Less',
    LEVEL = 'Level',
    LIFE = 'Life',
    MORE = 'More',
    NAME = 'Name',
    POSITION = 'Position',
    SAME = 'Same',
    ZONE = 'Zone'
}

export interface TargetFilter {
    filterType: FilterType;
    included: Array<number|string>;
    max: number|null;
    min: number|null;
    notIncluded: Array<number|string>
}

export interface EffectTarget {
    targetType: TargetType|null;
    filters: Array<TargetFilter>|null;
    sourceTargetType: TargetType|null;
    sourceFilters: Array<TargetFilter>|null;
    selfFilters: Array<TargetFilter>|null;
}

export enum CountType {
    CARDS_DISCARDED = 'Cards discarded',
    CARDS_IN_ZONE = 'Cards in grave',
    FIELD_ONLY_HAS = 'Field only has',
    INCLUDES_ALL = 'Includes all',
    REFERENCE_HIGHEST = 'Reference highest',
    REFERENCE_LOWEST = 'Reference lowest',
    REFERENCE_PREVIOUS_EFFECT = 'Reference previous effect',
    THIS = 'This',
}

export interface CountedAmount {
    countType: CountType;
    target: EffectTarget;
    multiplier: number;
}

export interface EffectsEffect {
    effectType: EffectType;
    relation: EffectRelation|null;
    target: EffectTarget;
    timing: EffectTiming;

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