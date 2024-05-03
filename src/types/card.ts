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
    NONE = 'None',
    NORMAL = 'Normal',
    EFFECT = 'Effect',
    FUSION = 'Fusion',
    REVENGE = 'Revenge',
    ROYAL = 'Royal',
    RITUAL = 'Ritual'
}

export interface CardData {
    cardName: string;
    cardClass: CardClass;
    cardType: CardType;
    subtype: CardSubtype;
    level: number;
    atk: number;
    def: number;
    effectText: string;
}

export enum StatType {
    ATTACK = 'attack',
    DEFENSE = 'defense'
}