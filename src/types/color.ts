import {
  CardData,
  CardSubtype,
  CardSupertype,
  CardType,
  StatType,
} from './card';

const ARTWORK_BORDER_THICKNESS = 0.225;
const EFFECTS_BORDER_THICKNESS = 0.2;

export enum CardMainFrameColor {
  NORMAL = '#e0c71b',
  EFFECT = '#ec8c57',
  FUSION = '#b361e2',
  REVENGE = '#f35a5a',
  ROYAL_DARK = '#1d1d1d',
  ROYAL_LIGHT = '#616161',
  TIME_TRAVELLER_DARK = '#102058',
  TIME_TRAVELLER_LIGHT = '#2650ea',
  SPELL = '#4cb871',
  TRAP = '#e77c9b',
  KILLER_MOVE = '#5f9bdb',
  FRAME = '#171717',
}

export enum CardEffectFrameColor {
  NORMAL = '#f6f4cb',
  EFFECT = '#f5dfd4',
  FUSION = '#eee2f5',
  REVENGE = '#f6dcdc',
  ROYAL = '#e5e5e5',
  TIME_TRAVELLER = '#e9ecf6',
  SPELL = '#e3f5ea',
  TRAP = '#f5e0e6',
  KILLER_MOVE = '#e7f0f7',
}

export enum StatBoxColor {
  ATK = '#aa2929',
  DEF = '#2a7aaf',
}

export enum TextColor {
  BLACK = '#000000',
  FADED = '#3E3E3E',
  LESS_IMPORTANT = '#151515',
  SHINING = '#cdcdcd',
  PEARL_WHITE = '#f3f3f3',
  WHITE = '#ffffff',
}

export enum GradientCutPoint {
  HAND_TRAP_DROP = 16,
  HAND_TRAP_EDGE = 64,
  PENDULUM_DROP = 20,
  PENDULUM_EDGE = 72,
}

export const getCardBackgroundColor = (cardData: CardData) => {
  switch (cardData.cardType) {
    case CardType.MONSTER:
      return getMonsterBackgroundColor(cardData.subtype);
    case CardType.SPELL:
      return getSpellBackgroundColor(cardData.subtype);
    case CardType.TRAP:
      return getTrapBackgroundColor(cardData.subtype);
  }
};

export const getCardBackground = (cardData: CardData) => {
  let darkColor;
  let lightColor;
  switch (cardData.subtype) {
    case CardSubtype.ROYAL:
      darkColor = CardMainFrameColor.ROYAL_DARK;
      lightColor = CardMainFrameColor.ROYAL_LIGHT;
      break;
    case CardSubtype.TIME_TRAVELLER:
      darkColor = CardMainFrameColor.TIME_TRAVELLER_DARK;
      lightColor = CardMainFrameColor.TIME_TRAVELLER_LIGHT;
      break;
  }
  switch (cardData.supertype) {
    case CardSupertype.DECK_MASTER:
      darkColor = `${CardMainFrameColor.NORMAL} ${GradientCutPoint.HAND_TRAP_DROP}%`;
      lightColor = `${CardEffectFrameColor.NORMAL} ${GradientCutPoint.PENDULUM_DROP + GradientCutPoint.PENDULUM_EDGE}%`;
      break;
    case CardSupertype.HAND_TRAP:
      darkColor = `${CardMainFrameColor.NORMAL} ${GradientCutPoint.HAND_TRAP_DROP}%`;
      lightColor = `${CardMainFrameColor.TRAP} ${GradientCutPoint.HAND_TRAP_DROP + GradientCutPoint.HAND_TRAP_EDGE}%`;
      break;
    case CardSupertype.PENDULUM:
      darkColor = `${CardMainFrameColor.NORMAL} ${GradientCutPoint.PENDULUM_DROP}%`;
      lightColor = `${CardMainFrameColor.SPELL} ${GradientCutPoint.PENDULUM_DROP + GradientCutPoint.PENDULUM_EDGE}%`;
      break;
    case CardSupertype.DOMAIN:
      darkColor = `${CardMainFrameColor.TRAP} ${GradientCutPoint.HAND_TRAP_DROP}%`;
      lightColor = `${CardMainFrameColor.SPELL} ${GradientCutPoint.HAND_TRAP_DROP + GradientCutPoint.HAND_TRAP_EDGE}%`;
      break;
  }
  if (darkColor !== undefined) {
    return `linear-gradient(to bottom, ${darkColor}, ${lightColor})`;
  }
  return '';
};

const getMonsterBackgroundColor = (subtype: CardSubtype) => {
  switch (subtype) {
    case CardSubtype.EFFECT:
      return CardMainFrameColor.EFFECT;
    case CardSubtype.FUSION:
      return CardMainFrameColor.FUSION;
    case CardSubtype.REVENGE:
      return CardMainFrameColor.REVENGE;
    default:
      return CardMainFrameColor.NORMAL;
  }
};

const getSpellBackgroundColor = (subtype: CardSubtype) => {
  switch (subtype) {
    case CardSubtype.FUSION:
      return CardMainFrameColor.FUSION;
    case CardSubtype.REVENGE:
      return CardMainFrameColor.REVENGE;
    case CardSubtype.ROYAL:
      return CardEffectFrameColor.ROYAL;
  }
  return CardMainFrameColor.SPELL;
};

const getTrapBackgroundColor = (subtype: CardSubtype) => {
  switch (subtype) {
    case CardSubtype.KILLER_MOVE:
      return CardMainFrameColor.KILLER_MOVE;
    default:
      return CardMainFrameColor.TRAP;
  }
};

export const getCardEffectFrameColor = (cardData: CardData) => {
  switch (cardData.cardType) {
    case CardType.MONSTER:
      return getMonsterEffectFrameColor(cardData);
    case CardType.SPELL:
      return getSpellEffectFrameColor(cardData);
    case CardType.TRAP:
      return getTrapEffectFrameColor(cardData);
  }
};

const getMonsterEffectFrameColor = (cardData: CardData) => {
  switch (cardData.subtype) {
    case CardSubtype.EFFECT:
      return CardEffectFrameColor.EFFECT;
    case CardSubtype.FUSION:
      return CardEffectFrameColor.FUSION;
    case CardSubtype.REVENGE:
      return CardEffectFrameColor.REVENGE;
    case CardSubtype.ROYAL:
      return CardEffectFrameColor.ROYAL;
    case CardSubtype.TIME_TRAVELLER:
      return CardEffectFrameColor.TIME_TRAVELLER;
    default:
      return getNormalMonsterEffectFrameColor(cardData.supertype);
  }
};

const getSpellEffectFrameColor = (cardData: CardData) => {
  switch (cardData.subtype) {
    case CardSubtype.FUSION:
      return CardEffectFrameColor.FUSION;
    case CardSubtype.REVENGE:
      return CardEffectFrameColor.REVENGE;
    case CardSubtype.ROYAL:
      return CardEffectFrameColor.ROYAL;
  }
  return CardEffectFrameColor.SPELL;
};

const getNormalMonsterEffectFrameColor = (supertype: CardSupertype) => {
  switch (supertype) {
    case CardSupertype.HAND_TRAP:
      return CardEffectFrameColor.TRAP;
    case CardSupertype.PENDULUM:
      return CardEffectFrameColor.SPELL;
    default:
      return CardEffectFrameColor.NORMAL;
  }
};

export const getTrapEffectFrameColor = (cardData: CardData) => {
  switch (cardData.supertype) {
    case CardSupertype.DOMAIN:
      return CardEffectFrameColor.SPELL;
  }
  switch (cardData.subtype) {
    case CardSubtype.KILLER_MOVE:
      return CardEffectFrameColor.KILLER_MOVE;
    default:
      return CardEffectFrameColor.TRAP;
  }
};

export const getStatBoxBackgroundColor = (statType: StatType) => {
  switch (statType) {
    case StatType.ATTACK:
      return StatBoxColor.ATK;
    case StatType.DEFENSE:
      return StatBoxColor.DEF;
  }
};

export const getArtworkBorder = (scale: number) => {
  return `solid ${ARTWORK_BORDER_THICKNESS * scale}rem black`;
};

export const getEffectsBorder = (cardData: CardData, scale: number) => {
  return `solid ${EFFECTS_BORDER_THICKNESS * scale}rem ${
    [
      CardSubtype.REVENGE,
      CardSubtype.ROYAL,
      CardSubtype.TIME_TRAVELLER,
    ].includes(cardData.subtype)
      ? 'black'
      : 'transparent'
  }`;
};

export const getFrameTextColor = (cardData: CardData) => {
  switch (cardData.subtype) {
    case CardSubtype.ROYAL:
      return TextColor.PEARL_WHITE;
    case CardSubtype.TIME_TRAVELLER:
      return TextColor.PEARL_WHITE;
    default:
      return TextColor.BLACK;
  }
};
