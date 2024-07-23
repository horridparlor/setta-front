import {MenuItem} from "@mui/material";
import React from "react";
import Cookies from "js-cookie";
import {AuthCookie, getUserId} from "./cookie";
import {CardExpansion, EXPANSION_NO_OWNER} from "./expansion";
import {CardEffects, DEFAULT_CARD_EFFECTS} from "./cardEffects";

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
    KILLER_MOVE = 'Killer Move',
}

export enum CardSupertype {
    NONE = 'None',
    HAND_TRAP = 'Hand Trap',
    MAXIMUM = 'Maximum',
    PENDULUM = 'Pendulum',
    DOMAIN = 'Domain'
}

export enum MaximumPiece {
    NONE = 'None',
    LEFT = 'Left',
    MIDDLE = 'Middle',
    RIGHT = 'Right',
}

export enum SpecialCountsAs {
    NORMAL_ZOMBIE_IN_GRAVE = 'Is a {sb=$EFFECTS_SIZE}normal{/sb} {b=$EFFECTS_SIZE}Zombie{/b} in grave.'
}

export const SpecialCountsAsId = {
    [SpecialCountsAs.NORMAL_ZOMBIE_IN_GRAVE]: -1
}

export const MONSTER_CARD_TYPES = [
    CardType.MONSTER
]

export const BACKROW_CARD_TYPES = [
    CardType.SPELL,
    CardType.TRAP
]

export const EXTRA_DECK_SUBTYPES = [
  CardSubtype.FUSION,
  CardSubtype.REVENGE,
  CardSubtype.ROYAL,
  CardSubtype.TIME_TRAVELLER,
  CardSubtype.KILLER_MOVE,
];

export interface CardData {
    cardId: number;
    ownerId: number;
    errataOfId: number|null;
    ownerFirstname: string,
    ownerLastname: string,
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
    materialsReminder: string;
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
    originalExpansionId: number;
    cardEffects: CardEffects;
    created_at: string;
    updated_at: string;
}

export enum StatType {
    ATTACK = 'attack',
    DEFENSE = 'defense'
}

export const isExtraDeckCard = (cardData : CardData) => {
    return EXTRA_DECK_SUBTYPES.includes(cardData.subtype);
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

export enum DefaultTextSize {
    NAME = 4,
    EFFECTS_BOX = 5,
}

export const DEFAULT_CARD_DATA = {
    cardId: 0,
    ownerId: 0,
    errataOfId: null,
    ownerFirstname: '',
    ownerLastname: '',
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
    materialsReminder: '',
    costText: '',
    effectText: '',
    flavourText: '',
    countsAsId: null,
    artScale: 0,
    artXOffset: 0,
    artYOffset: 0,
    nameSize: DefaultTextSize.NAME,
    materialsSize: DefaultTextSize.EFFECTS_BOX,
    effectsSize: DefaultTextSize.EFFECTS_BOX,
    expansionId: 8,
    originalExpansionId: 8,
    cardEffects: DEFAULT_CARD_EFFECTS,
    created_at: '',
    updated_at: '',
}

export const combineEffectsTexts = (cardData: CardData|undefined) => {
    if (!cardData) {
        return '';
    }
    return cardData.costText + cardData.effectText + cardData.flavourText;
}

const MONSTER_SUBTYPES = [CardSubtype.NORMAL, CardSubtype.EFFECT,
    CardSubtype.FUSION, CardSubtype.REVENGE, CardSubtype.ROYAL, CardSubtype.TIME_TRAVELLER];

const getActiveSubtypes = (cardType: CardType) => {
    switch (cardType) {
        case CardType.MONSTER:
            return MONSTER_SUBTYPES;
        case CardType.SPELL:
            return [CardSubtype.NORMAL];
        case CardType.TRAP:
            return [CardSubtype.NORMAL, CardSubtype.KILLER_MOVE];
    }
}

export const getSubtypeOptions = (cardType: CardType): React.ReactNode => {
    const activeSubtypes = getActiveSubtypes(cardType);
    return Object.values(CardSubtype)
        .filter(subtype => activeSubtypes.includes(subtype))
        .map(subtype => (
            <MenuItem key={subtype} value={subtype}>{subtype}</MenuItem>
        ));
}

const getActiveSupertypes = (cardType: CardType, subtype: CardSubtype) => {
    if (cardType === CardType.TRAP && subtype === CardSubtype.NORMAL) {
        return [CardSupertype.NONE, CardSupertype.DOMAIN];
    }
    if (cardType !== CardType.MONSTER) {
        return [CardSupertype.NONE];
    }
    switch (subtype) {
        case CardSubtype.NORMAL:
            return [CardSupertype.NONE, CardSupertype.HAND_TRAP, CardSupertype.PENDULUM];
        case CardSubtype.EFFECT:
            return [CardSupertype.NONE, CardSupertype.MAXIMUM];
        default:
            return [CardSupertype.NONE];
    }
}

export const getSupertypeOptions = (cardType: CardType, subtype: CardSubtype): React.ReactNode => {
    const activeSupertypes = getActiveSupertypes(cardType, subtype);
    return Object.values(CardSupertype)
        .filter(supertype => activeSupertypes.includes(supertype))
        .map(supertype => (
            <MenuItem key={supertype} value={supertype}>{supertype}</MenuItem>
        ));
}

export const getOwnerId = (cardData: CardData) => {
    const userId = Cookies.get(AuthCookie.USER_ID);
    return cardData.ownerId ? cardData.ownerId : userId ?? 0;
}

export const getOwnerName = (cardData: CardData) => {
    const firstname = cardData.ownerFirstname.length ? cardData.ownerFirstname : Cookies.get(AuthCookie.FIRSTNAME);
    const lastname = cardData.ownerLastname.length ? cardData.ownerLastname : Cookies.get(AuthCookie.LASTNAME);
    return [firstname, lastname].join(' ');
}

export const getMaximumExtension = (cardData: CardData) => {
    switch (cardData.maximumPiece) {
        case MaximumPiece.NONE:
            return '';
        case MaximumPiece.LEFT:
            return ' [L]';
        case MaximumPiece.MIDDLE:
            return ' [M]';
        case MaximumPiece.RIGHT:
            return ' [R]';
    }
}

export const isKiller = (cardData: CardData) => {
    return cardData.subtype === CardSubtype.KILLER_MOVE;
}

export const isDomain = (cardData: CardData) => {
    return cardData.supertype === CardSupertype.DOMAIN;
}

export const getCardsExpansion = (cardData: CardData, expansions: Array<CardExpansion>) => {
    return expansions.find(expansion => expansion.id === cardData.expansionId);
}

export const canEditCard = (cardData: CardData, expansions: Array<CardExpansion>) => {
    return canAlterCard(cardData, expansions, false);
}

export const canErrataCard = (cardData: CardData, expansions: Array<CardExpansion>) => {
    return canAlterCard(cardData, expansions, true);
}

const canAlterCard = (cardData: CardData, expansions: Array<CardExpansion>, releaseState: boolean) => {
    if (cardData.cardId === 0) {
        return !releaseState;
    }
    const expansion = getCardsExpansion(cardData, expansions);
    return !!expansion?.isReleased === releaseState && (expansion?.ownerId === EXPANSION_NO_OWNER || expansion?.ownerId === getUserId());
}

export const isMonster = (cardData: CardData) => {
    return cardData.cardType === CardType.MONSTER;
}

export const getFullTypeString = (cardData: CardData) => {
    const subtype = cardData.subtype === CardSubtype.NORMAL ? 'AAA' : cardData.subtype;
    const supertype = cardData.supertype === CardSupertype.NONE ? 'ZZZ' : cardData.supertype;
    return cardData.cardType + subtype + supertype;
}

export const getCombinedStats = (cardData: CardData) => {
    return cardData.atk + cardData.def;
}

export const countMaterials = (cardData: CardData) => {
    const materials = [cardData.primaryMaterialId, cardData.secondaryMaterialId, cardData.tertiaryMaterialId];
    return materials.filter(material => !!material).length;
}

export const hasAllMaterials = (cardData: CardData) => {
    return countMaterials(cardData) === 3;
}

export const hasTwoMaterials = (cardData: CardData) => {
    return countMaterials(cardData) >= 2;
}

export const getPointerId = (cardData: CardData): number => {
    if (cardData.errataOfId === null || cardData.errataOfId < 0) {
        return cardData.cardId;
    }
    return cardData.errataOfId;
}

export const isCardId = (cardData: CardData, cardId: number|null): boolean => {
    if (cardId === null) {
        return false;
    }
    return cardData.cardId === cardId || cardData.errataOfId === cardId;
}
export const getCardsExpansionIds = (cardData: CardData): Set<number> => {
    return new Set([cardData.expansionId, cardData.originalExpansionId]);
};
