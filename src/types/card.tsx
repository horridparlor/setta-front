import { MenuItem } from '@mui/material';
import React from 'react';
import Cookies from 'js-cookie';
import { AuthCookie, getUserId } from './cookie';
import { CardExpansion, EXPANSION_NO_OWNER } from './expansion';
import {
  CardEffects,
  ChainEffect,
  CostType,
  DEFAULT_CARD_EFFECTS,
  DEFAULT_CHAIN_EFFECT,
  DEFAULT_EFFECTS_PAYMENT,
  DEFAULT_EFFECTS_POST_COUNT,
  DEFAULT_EFFECTS_TARGET,
  EffectsCost,
  EffectsEffect,
  EffectsPayment,
  EffectsTarget,
  isCountedAmount,
  PostCount,
} from './cardEffects';
import { NONE_STRING } from '../utils/string';
import { getUser } from './api';

export enum CardClass {
  NONE = 'None',
  ABYSS = 'Abyss',
  DRAGON = 'Dragon',
  KAWAII = 'Kawaii',
  SLIME = 'Slime',
  SPARKS = 'Sparks',
  ZOMBIE = 'Zombie',
}

export const isCardClass = (value: string): value is CardClass => {
  return Object.values(CardClass).includes(value as CardClass);
};

export enum CardType {
  NONE = 'None',
  MONSTER = 'Monster',
  BACKROW = 'Backrow',
  SPELL = 'Spell',
  TRAP = 'Trap',
}

export const isCardType = (value: string): value is CardType => {
  return Object.values(CardType).includes(value as CardType);
};

export enum CardDeck {
  NONE = 'None',
  MAIN = 'Main',
  EXTRA = 'Extra',
}

export const isCardDeck = (value: string): value is CardDeck => {
  return Object.values(CardDeck).includes(value as CardDeck);
};

export enum CardSubtype {
  NONE = 'None',
  NORMAL = 'Normal',
  EFFECT = 'Effect',
  FUSION = 'Fusion',
  REVENGE = 'Revenge',
  ROYAL = 'Royal',
  TIME_TRAVELLER = 'Time Traveller',
  KILLER_MOVE = 'Killer Move',
}

export const isCardSubtype = (value: string): value is CardSubtype => {
  return Object.values(CardSubtype).includes(value as CardSubtype);
};

export enum CardSupertype {
  NONE = 'None',
  HAND_TRAP = 'Hand Trap',
  MAXIMUM = 'Maximum',
  PENDULUM = 'Pendulum',
  DOMAIN = 'Domain',
}

export const isCardSupertype = (value: string): value is CardSupertype => {
  return Object.values(CardSupertype).includes(value as CardSupertype);
};

export enum MaximumPiece {
  NONE = 'None',
  LEFT = 'Left',
  MIDDLE = 'Middle',
  RIGHT = 'Right',
}

export enum SpecialCountsAs {
  NORMAL_ZOMBIE_IN_GRAVE = 'Is a {sb=$EFFECTS_SIZE}normal{/sb} {b=$EFFECTS_SIZE}Zombie{/b} in grave.',
}

export const SpecialCountsAsId = {
  [SpecialCountsAs.NORMAL_ZOMBIE_IN_GRAVE]: -1,
};

export const MONSTER_CARD_TYPES = [CardType.MONSTER];

export const BACKROW_CARD_TYPES = [CardType.SPELL, CardType.TRAP];

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
  errataOfId: number | null;
  ownerFirstname: string;
  ownerLastname: string;
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
  primaryMaterialId: number | null;
  secondaryMaterialId: number | null;
  tertiaryMaterialId: number | null;
  materialsReminder: string;
  costText: string;
  effectText: string;
  flavourText: string;
  countsAsId: number | null;
  artScale: number;
  artXOffset: number;
  artYOffset: number;
  nameSize: number;
  materialsSize: number;
  effectsSize: number;
  expansionId: number;
  originalExpansionId: number;
  createdAt: string;
  updatedAt: string;
  cardEffects: CardEffects;
}

export enum StatType {
  ATTACK = 'attack',
  DEFENSE = 'defense',
}

export const isExtraDeckCard = (cardData: CardData) => {
  return EXTRA_DECK_SUBTYPES.includes(cardData.subtype);
};

export const hasCostText = (cardData: CardData) => {
  switch (cardData.cardType) {
    case CardType.MONSTER:
      return (
        isPendulumCard(cardData) ||
        !(
          (cardData.subtype !== CardSubtype.NORMAL &&
            cardData.flavourText.length > 0) ||
          cardData.subtype === CardSubtype.NORMAL
        )
      );
    case CardType.SPELL:
      return !isExtraDeckCard(cardData);
    case CardType.TRAP:
      return true;
  }
};

export const hasEffectText = (cardData: CardData) => {
  if (isContinuous(cardData) && !isDomain(cardData)) {
    return false;
  }
  return (
    cardData.cardType !== CardType.MONSTER ||
    isHandTrapCard(cardData) ||
    !(
      cardData.subtype === CardSubtype.NORMAL || cardData.flavourText.length > 0
    )
  );
};

export const hasFlavourText = (cardData: CardData) => {
  return (
    isPendulumCard(cardData) ||
    isHandTrapCard(cardData) ||
    !(
      cardData.cardType !== CardType.MONSTER ||
      cardData.subtype === CardSubtype.EFFECT ||
      cardData.effectText.length > 0 ||
      cardData.costText.length > 0
    )
  );
};

export const isPendulumCard = (cardData: CardData) => {
  return cardData.supertype === CardSupertype.PENDULUM;
};

export const isHandTrapCard = (cardData: CardData) => {
  return cardData.supertype === CardSupertype.HAND_TRAP;
};

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
  createdAt: '',
  updatedAt: '',
  cardEffects: DEFAULT_CARD_EFFECTS,
};

export const combineEffectsTexts = (cardData: CardData | undefined) => {
  if (!cardData) {
    return '';
  }
  return cardData.costText + cardData.effectText + cardData.flavourText;
};

const MONSTER_SUBTYPES = [
  CardSubtype.NORMAL,
  CardSubtype.EFFECT,
  CardSubtype.FUSION,
  CardSubtype.REVENGE,
  CardSubtype.ROYAL,
  CardSubtype.TIME_TRAVELLER,
];

const getActiveSubtypes = (cardType: CardType) => {
  switch (cardType) {
    case CardType.NONE:
      return [];
    case CardType.MONSTER:
      return MONSTER_SUBTYPES;
    case CardType.SPELL:
      return [
        CardSubtype.NORMAL,
        CardSubtype.FUSION,
        CardSubtype.REVENGE,
        CardSubtype.ROYAL,
      ];
    case CardType.TRAP:
      return [CardSubtype.NORMAL, CardSubtype.KILLER_MOVE];
    case CardType.BACKROW:
      return [CardSubtype.NORMAL, CardSubtype.KILLER_MOVE];
  }
};

export const getSubtypeOptions = (cardType: CardType): React.ReactNode => {
  const activeSubtypes = getActiveSubtypes(cardType);
  return Object.values(CardSubtype)
    .filter(
      subtype => subtype !== NONE_STRING && activeSubtypes.includes(subtype)
    )
    .map(subtype => (
      <MenuItem key={subtype} value={subtype}>
        {subtype}
      </MenuItem>
    ));
};

const getActiveSupertypes = (cardType: CardType, subtype: CardSubtype) => {
  if (cardType === CardType.TRAP && subtype === CardSubtype.NORMAL) {
    return [CardSupertype.NONE, CardSupertype.DOMAIN];
  }
  if (cardType !== CardType.MONSTER) {
    return [CardSupertype.NONE];
  }
  switch (subtype) {
    case CardSubtype.NORMAL:
      return [
        CardSupertype.NONE,
        CardSupertype.HAND_TRAP,
        CardSupertype.PENDULUM,
      ];
    case CardSubtype.EFFECT:
      return [CardSupertype.NONE, CardSupertype.MAXIMUM];
    default:
      return [CardSupertype.NONE];
  }
};

export const isGroupCardType = (cardType: CardType | string) => {
  return isCardType(cardType) && [CardType.BACKROW].includes(cardType);
};

export const isIncludedInGroupCardType = (
  cardType: CardType,
  groupCardType: CardType | string
) => {
  switch (groupCardType) {
    case CardType.BACKROW:
      return BACKROW_CARD_TYPES.includes(cardType);
  }
  return false;
};

export const getSupertypeOptions = (
  cardType: CardType,
  subtype: CardSubtype
): React.ReactNode => {
  const activeSupertypes = getActiveSupertypes(cardType, subtype);
  return Object.values(CardSupertype)
    .filter(supertype => activeSupertypes.includes(supertype))
    .map(supertype => (
      <MenuItem key={supertype} value={supertype}>
        {supertype}
      </MenuItem>
    ));
};

export const getOwnerId = (cardData: CardData) => {
  const userId = Cookies.get(AuthCookie.USER_ID);
  return cardData.ownerId ? cardData.ownerId : (userId ?? 0);
};

export const getOwnerName = (cardData: CardData) => {
  const systemUser = getUser();
  const firstname = cardData.ownerFirstname.length
    ? cardData.ownerFirstname
    : Cookies.get(systemUser.firstName);
  const lastname = cardData.ownerLastname.length
    ? cardData.ownerLastname
    : Cookies.get(systemUser.lastName);
  return [firstname, lastname].join(' ');
};

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
};

export const isKiller = (cardData: CardData) => {
  return cardData.subtype === CardSubtype.KILLER_MOVE;
};

export const isDomain = (cardData: CardData) => {
  return cardData.supertype === CardSupertype.DOMAIN;
};

export const getCardsExpansion = (
  cardData: CardData,
  expansions: Array<CardExpansion>
) => {
  return expansions.find(expansion => expansion.id === cardData.expansionId);
};

export const canEditCard = (
  cardData: CardData,
  expansions: Array<CardExpansion>
) => {
  return canAlterCard(cardData, expansions, false);
};

export const canErrataCard = (
  cardData: CardData,
  expansions: Array<CardExpansion>
) => {
  return canAlterCard(cardData, expansions, true);
};

const canAlterCard = (
  cardData: CardData,
  expansions: Array<CardExpansion>,
  releaseState: boolean
) => {
  if (cardData.cardId === 0) {
    return !releaseState;
  }
  const expansion = getCardsExpansion(cardData, expansions);
  return (
    !!expansion?.isReleased === releaseState &&
    (expansion?.ownerId === EXPANSION_NO_OWNER ||
      expansion?.ownerId === getUserId())
  );
};

export const isMonster = (cardData: CardData) => {
  return cardData.cardType === CardType.MONSTER;
};

export const getFullTypeString = (cardData: CardData) => {
  const subtype =
    cardData.subtype === CardSubtype.NORMAL ? 'AAA' : cardData.subtype;
  const supertype =
    cardData.supertype === CardSupertype.NONE ? 'ZZZ' : cardData.supertype;
  return cardData.cardType + subtype + supertype;
};

export const getCombinedStats = (cardData: CardData) => {
  return cardData.atk + cardData.def;
};

export const countMaterials = (cardData: CardData) => {
  const materials = [
    cardData.primaryMaterialId,
    cardData.secondaryMaterialId,
    cardData.tertiaryMaterialId,
  ];
  return materials.filter(material => !!material).length;
};

export const hasAllMaterials = (cardData: CardData) => {
  return countMaterials(cardData) === 3;
};

export const hasTwoMaterials = (cardData: CardData) => {
  return countMaterials(cardData) >= 2;
};

export const getPointerId = (cardData: CardData): number => {
  if (cardData.errataOfId === null || cardData.errataOfId < 0) {
    return cardData.cardId;
  }
  return cardData.errataOfId;
};

export const isCardId = (
  cardData: CardData,
  cardId: number | null
): boolean => {
  if (cardId === null) {
    return false;
  }
  return cardData.cardId === cardId || cardData.errataOfId === cardId;
};

export const getCardsExpansionIds = (cardData: CardData): Set<number> => {
  return new Set([cardData.expansionId, cardData.originalExpansionId]);
};

export const isContinuous = (cardData: CardData): boolean => {
  return cardData.cardEffects.cost.costType === CostType.CONTINUOUS;
};

export const isSpell = (cardData: CardData): boolean => {
  return cardData.cardType === CardType.SPELL;
};

export const isTrap = (cardData: CardData): boolean => {
  return cardData.cardType === CardType.TRAP;
};

export const getEffectsCost = (cardData: CardData): EffectsCost => {
  return cardData.cardEffects.cost;
};

export const getEffectsEffect = (cardData: CardData): EffectsEffect => {
  return cardData.cardEffects.effect;
};

const fixEffectsTarget = (target: EffectsTarget | null) => {
  return target ? target : DEFAULT_EFFECTS_TARGET;
};

export const getEffectsCostTarget = (cardData: CardData) => {
  return fixEffectsTarget(cardData.cardEffects.cost.target);
};

const fixEffectsPayment = (payment: EffectsPayment | null) => {
  return payment ? payment : DEFAULT_EFFECTS_PAYMENT;
};

export const getEffectsCostPayment = (cardData: CardData) => {
  return fixEffectsPayment(cardData.cardEffects.cost.payment);
};

const fixEffectsPostCount = (postCount: PostCount | null) => {
  return postCount ? postCount : DEFAULT_EFFECTS_POST_COUNT;
};

export const getEffectsCostPostCount = (cardData: CardData) => {
  return fixEffectsPostCount(cardData.cardEffects.cost.postCount);
};

export const getEffectsEffectTarget = (cardData: CardData) => {
  return fixEffectsTarget(cardData.cardEffects.effect.target);
};

export const getEffectsEffectAmountTarget = (cardData: CardData) => {
  const amount = cardData.cardEffects.effect.amount;
  return fixEffectsTarget(isCountedAmount(amount) ? amount.target : null);
};

const fixChainEffect = (chainEffect: ChainEffect | null) => {
  return chainEffect ? chainEffect : DEFAULT_CHAIN_EFFECT;
};

export const getEffectsChainEffect = (cardData: CardData) => {
  return fixChainEffect(getEffectsEffect(cardData).chainEffect);
};

export const TARGETABLE_CARD_SUBTYPES = Object.values(CardSubtype).filter(
  subtype => subtype !== CardSubtype.EFFECT
);

export const isOfCardDeck = (card: CardData, deck: CardDeck | string) => {
  if (!isCardDeck(deck)) {
    return false;
  }
  switch (deck) {
    case CardDeck.MAIN:
      return !isExtraDeckCard(card);
    case CardDeck.EXTRA:
      return isExtraDeckCard(card);
  }
  return false;
};
