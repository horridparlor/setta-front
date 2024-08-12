import React, {ChangeEvent, ReactNode, useEffect, useMemo, useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import {
    BACKROW_CARD_TYPES,
    canEditCard,
    canErrataCard,
    CardClass,
    CardData,
    CardSubtype,
    CardSupertype,
    CardType,
    combineEffectsTexts,
    DefaultTextSize,
    EXTRA_DECK_SUBTYPES,
    getEffectsCost,
    getEffectsCostPayment, getEffectsCostPostCount,
    getEffectsCostTarget, getEffectsEffect,
    getSubtypeOptions,
    getSupertypeOptions,
    hasCostText,
    hasEffectText,
    hasFlavourText,
    hasTwoMaterials,
    isCardClass,
    isCardSubtype,
    isCardType,
    isExtraDeckCard,
    isKiller,
    MaximumPiece,
    MONSTER_CARD_TYPES,
    SpecialCountsAs,
    SpecialCountsAsId,
    TARGETABLE_CARD_SUBTYPES
} from "../../types/card";
import {CardExpansion, EXPANSION_NO_OWNER} from "../../types/expansion";
import {getStringSelector, isNoneString, normalizeName} from "../../utils/string";
import {getUserId} from "../../types/cookie";
import {
    CardEffects,
    CostType,
    DEFAULT_EFFECTS_COST, DEFAULT_EFFECTS_EFFECT,
    EffectsPayment,
    EffectsTarget, EffectType,
    getAmountProps,
    getCostPaymentTypeOptions, getCostPostCountSubtypeOptions,
    getCostPostCountTypeOptions,
    getCostPrestateOptions,
    getCostSelectionType,
    getCostSubtypeOptions,
    getCostSupertypeOptions,
    getCostTargetOwnerOptions,
    getCostTargetTypeOptions,
    getCostTargetZoneOptions,
    getCostTypeOptions,
    getDefaultCostPaymentType, getDefaultCostPostCountSubtype, getDefaultCostPostCountType,
    getDefaultCostPrestate,
    getDefaultCostSubtype,
    getDefaultCostSupertype,
    getDefaultCostTargetOwner,
    getDefaultCostTargetType,
    getDefaultCostTargetZone,
    getDefaultCostType, getDefaultEffectSubtype, getDefaultEffectSupertype, getDefaultEffectType,
    isCardPropertySelection,
    isCostType, isEffectType,
    isPaymentCostType, isPostCountType,
    isStateCostType,
    isTargetOwner,
    isTargetType,
    isZone,
    MonsterSpecificStateCostTypes,
    NULLABLE_LEVEL_AMOUNT_PROPS,
    NULLABLE_STAT_AMOUNT_PROPS,
    PaymentCostType, PostCount,
    PostCountType,
    routePaymentCostTypeSelectionType,
    SelectionType,
    SpellSpecificStateCostTypes,
    StateCostType,
    TargetOwner,
    TargetType,
    TriggerCostType,
    Zone
} from "../../types/cardEffects";
import {menuTitleStyle} from "../../utils/fonts";
import {isEqual} from 'lodash';

interface RightPanelSettingsProps {
    cardData: CardData;
    expansions: Array<CardExpansion>;
    onCardDataChange: (field: keyof CardData, value: string | number | CardEffects) => void;
    onExport: () => void;
    onSave: () => void;
    onImageFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onDelete: () => void;
    onEncode: () => void;
    cards: Array<CardData>;
    canUpload: boolean;
    onErrata: () => void;
    onCopy: () => void;
}

const RightPanelSettings: React.FC<RightPanelSettingsProps> = ({
    cardData,
    expansions,
    onCardDataChange,
    onExport,
    onSave,
    onImageFileChange,
    onDelete,
    onEncode,
    cards,
    canUpload,
    onErrata,
    onCopy,
}) => {
    const STATS_TAB = 0;
    const EFFECTS_TAB = 1;
    const [tabId, setTabId] = useState<number>(0);
    const countsAsSelector = () => {
        const countsAsOptions = Object.values(SpecialCountsAs).map(countsAs => {
            const id = SpecialCountsAsId[countsAs];
            return (
                <MenuItem key={id} value={id}>{normalizeName(countsAs)}</MenuItem>
            );
        });
        return cardSelector(cards, countsAsOptions);
    }
    const cardSelector = (source: Array<CardData> = cards, additionalOptions: Array<JSX.Element> = []) => {
        return [<MenuItem key='none' value=''>–</MenuItem>,
            ...additionalOptions,
        ...source
            .sort((cardA, cardB) => normalizeName(cardA).localeCompare(normalizeName(cardB)))
            .map(card => (
                <MenuItem key={card.cardId} value={card.cardId}>{normalizeName(card)}</MenuItem>
            ))
        ];
    }
    const monsterCardSelector = () => {
        return cardSelector(cards.filter(card => MONSTER_CARD_TYPES.includes(card.cardType)));
    }
    const backrowCardSelector = () => {
        return cardSelector(cards.filter(card => BACKROW_CARD_TYPES.includes(card.cardType)));
    }
    const handleSelectChange = (field: keyof CardData) =>
        (event: SelectChangeEvent<string>) => {
            const value = event.target.value;
            let card;
            let cost;
            switch (field) {
                case 'cardType':
                    card = {...cardData, cardType: isCardType(value) ? value : cardData.cardType};
                    cost = getEffectsCost(card);
                    onCardDataChange('subtype', value === CardType.MONSTER ? CardSubtype.EFFECT : CardSubtype.NORMAL);
                    onCardDataChange('supertype', CardSupertype.NONE);
                    onCardDataChange('flavourText', '');
                    onCardDataChange('primaryMaterialId', '');
                    onCardDataChange('secondaryMaterialId', '');
                    onCardDataChange('tertiaryMaterialId', '');
                    switch (value) {
                        case CardType.MONSTER:
                            switch (cost.costType) {
                                case CostType.STATE:
                                    if (cost.subtype && SpellSpecificStateCostTypes.includes(cost.subtype)) {
                                        handleCostSubtypeChange(StateCostType.YOU_CONTROL_ONLY_THIS, card);
                                    }
                                    break;
                                case CostType.TRIGGER:
                                    if (cost.subtype === TriggerCostType.OPPONENT) {
                                        handleCostSubtypeChange(TriggerCostType.SELF_TRIGGERED, card);
                                    }
                                    break;
                            }
                            break;
                        case CardType.SPELL:
                            switch (cost.costType) {
                                case CostType.STATE:
                                    if (cost.subtype && MonsterSpecificStateCostTypes.includes(cost.subtype)) {
                                        handleCostTypeChange(CostType.NONE, card);
                                    }
                                    break;
                                case CostType.TRIGGER:
                                    handleCostTypeChange(CostType.NONE, card);
                                    break;
                            }
                            break;
                        case CardType.TRAP:
                            switch (cost.costType) {
                                case CostType.TRIGGER:
                                    if (cost.subtype === TriggerCostType.SELF_TRIGGERED) {
                                        handleCostSubtypeChange(TriggerCostType.OPPONENT, card);
                                    }
                                    break;
                                default:
                                    handleCostTypeChange(CostType.TRIGGER, card);
                            }
                            break;
                    }
                    break;
                case 'subtype':
                    switch (value) {
                        case CardSubtype.NORMAL:
                            if (cardData.cardType === CardType.MONSTER) {
                                onCardDataChange('costText', '');
                                onCardDataChange('effectText', '');
                            }
                            break;
                        case CardSubtype.EFFECT:
                            onCardDataChange('flavourText', '');
                            break;
                        case CardSubtype.KILLER_MOVE:
                            onCardDataChange('tertiaryMaterialId', '');
                            break;
                    }
                    if (cardData.flavourText.length) {
                        switch (cardData.supertype) {
                            case CardSupertype.HAND_TRAP:
                                onCardDataChange('effectText', '');
                                break;
                            case CardSupertype.PENDULUM:
                                onCardDataChange('costText', '');
                                break;
                        }
                    }
                    if (!EXTRA_DECK_SUBTYPES.includes(value as CardSubtype)) {
                        onCardDataChange('primaryMaterialId', '');
                        onCardDataChange('secondaryMaterialId', '');
                        onCardDataChange('tertiaryMaterialId', '');
                    }
                    onCardDataChange('supertype', CardSupertype.NONE);
                    break;
                case 'supertype':
                    switch (cardData.supertype) {
                        case CardSupertype.HAND_TRAP:
                            onCardDataChange('effectText', '');
                            break;
                        case CardSupertype.PENDULUM:
                            onCardDataChange('costText', '');
                            break;
                    }
                    onCardDataChange('maximumPiece', value === CardSupertype.MAXIMUM ? MaximumPiece.LEFT : MaximumPiece.NONE);
                    break;
                case 'primaryMaterialId':
                    onCardDataChange('materialsSize', DefaultTextSize.EFFECTS_BOX.toString());
                    break;
                case 'secondaryMaterialId':
                    onCardDataChange('materialsSize', DefaultTextSize.EFFECTS_BOX.toString());
                    break;
                case "tertiaryMaterialId":
                    onCardDataChange('materialsSize', DefaultTextSize.EFFECTS_BOX.toString());
                    break;
            }
            onCardDataChange(field, event.target.value as any);
        };

    const handleInputChange = (field: keyof CardData) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
            const mustBeString = ['cardName', 'costText', 'effectText', 'flavourText'].includes(field);
            if (value === "") {
                onCardDataChange(field, "");
            } else {
                onCardDataChange(field, typeof value === 'boolean' ? (value ? 1 : 0) : (mustBeString || isNaN(+value) ? value : +value));
            }
            switch (field) {
                case "costText":
                    if (cardData.cardType === CardType.MONSTER && cardData.subtype !== CardSubtype.NORMAL) {
                        onCardDataChange('flavourText', '');
                    }
                    break;
            }
        };

    const cannotEdit = () => {
        return !canEditCard(cardData, expansions);
    }

    const rowContainerStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginBottom: 2,
        display: 'flex',
    }

    const hideHiddenButton = () => {
        return {display: cannotEdit() ? 'none' : 'flex'};
    }

    const onTabClicked = (event: React.ChangeEvent<{}>, newId: number) => {
        setTabId(newId);
    };

    const handleCostTypeChange = (value: string, prevCard: CardData = cardData, justReturn: boolean = false) => {
        const costType: CostType = isCostType(value) ? value : CostType.NONE;
        const card = {...prevCard};
        card.cardEffects.cost.costType = costType;
        const subtype = getDefaultCostSubtype(card);
        const cost = {...handleCostSubtypeChange(subtype, card, true),
            costType: costType
        };
        if (justReturn) {
            return cost;
        }
        onCardDataChange('cardEffects',
            {...cardData.cardEffects, cost: cost});
        return cost;
    }

    const handleCostSubtypeChange = (subtype: string, prevCard : CardData = cardData, justReturn: boolean = false) => {
        const card = {...prevCard};
        card.cardEffects.cost.subtype = subtype;
        const supertype = getDefaultCostSupertype(card);
        let cost = getEffectsCost(cardData);
        const prestate = cost.costType === CostType.STATE && cost.prestate === subtype ? StateCostType.NONE : cost.prestate;
        cost = {...handleCostSupertypeChange(supertype, card, true),
            subtype: subtype,
            prestate: prestate
        };
        if (justReturn) {
            return cost;
        }
        onCardDataChange('cardEffects',
            {...cardData.cardEffects, cost: cost});
        return cost;
    }

    const handleCostSupertypeChange = (supertype: string, prevCard: CardData = cardData, justReturn: boolean = false) => {
        const card = {...prevCard};
        card.cardEffects.cost.supertype = supertype;
        const cost = {...getEffectsCost(cardData),
            target: handleTargetTypeChange(getEffectsCostTarget(card).targetType || getDefaultCostTargetType(card),
                getEffectsCostTarget(card), handleCostTargetChange, card,true),
            supertype: supertype
        };
        if (justReturn) {
            return cost;
        }
        onCardDataChange('cardEffects',
            {...cardData.cardEffects, cost: cost});
        return cost;
    }

    const handleCostPrestateChange = (value: string, prevCard: CardData = cardData, justReturn: boolean = false) => {
        const prestate : StateCostType|null = isStateCostType(value) ? value : null;
        let cost = getEffectsCost(prevCard);
        const subtype = cost.costType === CostType.STATE && cost.subtype === prestate ? StateCostType.COUNT_CARDS : cost.subtype || getDefaultCostSubtype(prevCard);
        cost = {...handleCostSubtypeChange(subtype, prevCard, true),
            prestate: prestate
        };
        if (justReturn) {
            return cost;
        }
        onCardDataChange('cardEffects',
            {...cardData.cardEffects, cost: cost});
        return cost;
    }

    const handleCostAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const amount = parseInt(event.target.value);
        const cost = {...getEffectsCost(cardData), amount: amount};
        onCardDataChange('cardEffects',
            {...cardData.cardEffects, cost: cost});
        return cost;
    }

    const handleCostTargetChange = (updatedTarget: EffectsTarget, justReturn: boolean = false) => {
        const cost = {...getEffectsCost(cardData),
            target: updatedTarget
        };
        if (justReturn) {
            return cost;
        }
        onCardDataChange('cardEffects',
            {...cardData.cardEffects, cost: cost});
        return cost;
    }

    const handleTargetClassChange = (value: string, prevTarget: EffectsTarget,
                                     handle: (target: EffectsTarget) => void, justReturn: boolean = false) => {
        const cardClass: CardClass|null = isCardClass(value) ? value : null;
        const target = {...prevTarget,
            cardClass: cardClass
        };
        if (justReturn) {
            return target;
        }
        handle(target);
        return target;
    }

    const handleTargetSubtypeChange = (value: string, prevTarget: EffectsTarget,
                                     handle: (target: EffectsTarget) => void, justReturn: boolean = false) => {
        const subtype: CardSubtype|null = isCardSubtype(value) ? value : null;
        const target = {...prevTarget,
            subtype: subtype
        };
        if (justReturn) {
            return target;
        }
        handle(target);
        return target;
    }

    const handleTargetMinLevelChange = (minLevel: number, prevTarget: EffectsTarget,
                                     handle: (target: EffectsTarget) => void, justReturn: boolean = false) => {
        const maxLevel = minLevel && prevTarget.maxLevel ? Math.max(prevTarget.maxLevel, minLevel) : prevTarget.maxLevel;
        const target = {...prevTarget,
            minLevel: minLevel,
            maxLevel: maxLevel
        };
        if (justReturn) {
            return target;
        }
        handle(target);
        return target;
    }
    const handleTargetMaxLevelChange = (maxLevel: number, prevTarget: EffectsTarget,
                                     handle: (target: EffectsTarget) => void, justReturn: boolean = false) => {
        const minLevel = maxLevel && prevTarget.minLevel ? Math.min(prevTarget.minLevel, maxLevel) : prevTarget.minLevel;
        const target = {...prevTarget,
            minLevel: minLevel,
            maxLevel: maxLevel
        };
        if (justReturn) {
            return target;
        }
        handle(target);
        return target;
    }
    const handleTargetAtkChange = (atk: number, prevTarget: EffectsTarget,
                                     handle: (target: EffectsTarget) => void, justReturn: boolean = false) => {
        const target = {...prevTarget,
            atk: atk
        };
        if (justReturn) {
            return target;
        }
        handle(target);
        return target;
    }
    const handleTargetDefChange = (def: number, prevTarget: EffectsTarget,
                                     handle: (target: EffectsTarget) => void, justReturn: boolean = false) => {
        const target = {...prevTarget,
            def: def
        };
        if (justReturn) {
            return target;
        }
        handle(target);
        return target;
    }
    const handleTargetTypeChange = (value: string, prevTarget: EffectsTarget,
                                     handle: (target: EffectsTarget) => void, prevCard: CardData = cardData,
                                    justReturn: boolean = false) => {
        const options = getCostTargetTypeOptions(prevCard);
        const defaultTo = getDefaultCostTargetType(prevCard);
        const targetType = isTargetType(value) ? value : TargetType.NONE;
        const target = {...prevTarget,
            targetType: options.includes(targetType) ? targetType : defaultTo
        };
        if (justReturn) {
            return target;
        }
        handle(target);
        return target;
    }
    const handleTargetOwnerChange = (value: string, prevTarget: EffectsTarget,
                                     handle: (target: EffectsTarget) => void, justReturn: boolean = false) => {
        const owner = isTargetOwner(value) ? value : TargetOwner.NONE;
        const target = {...prevTarget,
            owner: owner
        };
        if (justReturn) {
            return target;
        }
        handle(target);
        return target;
    }
    const handleTargetZoneChange = (value: string, prevTarget: EffectsTarget,
                                     handle: (target: EffectsTarget) => void, justReturn: boolean = false) => {
        const zone = isZone(value) ? value : Zone.NONE;
        const target = {...prevTarget,
            zone: zone
        };
        if (justReturn) {
            return target;
        }
        handle(target);
        return target;
    }

    const handleCostPaymentChange = (updatedPayment: EffectsPayment, justReturn: boolean = false) => {
        const cost = {...getEffectsCost(cardData),
            payment: updatedPayment
        };
        if (justReturn) {
            return cost;
        }
        onCardDataChange('cardEffects',
            {...cardData.cardEffects, cost: cost});
        return cost;
    }

    const handlePaymentTypeChange = (value: string, prevPayment: EffectsPayment,
                                     handle: (payment: EffectsPayment) => void, justReturn: boolean = false) => {
        const paymentType = isPaymentCostType(value) ? value : PaymentCostType.NONE;
        const payment = {...prevPayment,
            paymentType: paymentType
        };
        if (justReturn) {
            return payment;
        }
        handle(payment);
        return payment;
    }

    const handlePaymentAmountChange = (amount: number, prevPayment: EffectsPayment,
                                     handle: (payment: EffectsPayment) => void, justReturn: boolean = false) => {
        const payment = {...prevPayment,
            amount: amount
        };
        if (justReturn) {
            return payment;
        }
        handle(payment);
        return payment;
    }

    const handlePaymentCardTypeChange = (value: string, prevPayment: EffectsPayment,
                                     handle: (payment: EffectsPayment) => void, justReturn: boolean = false) => {
        const cardType = isCardType(value) ? value : CardType.NONE;
        const payment = {...prevPayment,
            cardType: cardType
        };
        if (justReturn) {
            return payment;
        }
        handle(payment);
        return payment;
    }

    const handleCostPostCountChange = (updatedPostCount: PostCount, justReturn: boolean = false) => {
        const cost = {...getEffectsCost(cardData),
            postCount: updatedPostCount
        };
        if (justReturn) {
            return cost;
        }
        onCardDataChange('cardEffects',
            {...cardData.cardEffects, cost: cost});
        return cost;
    }

    const handlePostCountTypeChange = (value: string, prevPostCount: PostCount,
                                     handle: (postCount: PostCount) => void, justReturn: boolean = false) => {
        const countType = isPostCountType(value) ? value : PostCountType.NONE;
        const postCount = {...handlePostCountSubtypeChange(getDefaultCostPostCountSubtype(countType), prevPostCount, handle, true),
            countType: countType
        };
        if (justReturn) {
            return postCount;
        }
        handle(postCount);
        return postCount;
    }

    const handlePostCountSubtypeChange = (subtype: string|null, prevPostCount: PostCount,
                                     handle: (postCount: PostCount) => void, justReturn: boolean = false) => {
        const postCount = {...prevPostCount,
            subtype: subtype
        };
        if (justReturn) {
            return postCount;
        }
        handle(postCount);
        return postCount;
    }

    const costSubtypeOptions = useMemo(() => {
        return getCostSubtypeOptions(cardData);
    }, [cardData.cardEffects.cost.costType, cardData.cardType]);
    const costSupertypeOptions = useMemo(() => {
        return getCostSupertypeOptions(cardData);
    }, [cardData.cardEffects.cost.subtype, cardData.cardType]);
    const costSelectionType = useMemo(() => {
        return getCostSelectionType(cardData);
    }, [cardData.cardEffects.cost]);
    const costAmountProps = useMemo(() => {
        return getAmountProps(costSelectionType);
    }, [costSelectionType]);

    const costCardSelectionVisible = {
        display: isCardPropertySelection(costSelectionType) ? 'flex' : 'none'
    }

    const isCostAmountSelectable = costAmountProps.min !== costAmountProps.max
        && getEffectsCost(cardData).costType !== CostType.TRIGGER;

    const resetCost = () => {
        const prevCost = handleCostTypeChange(getDefaultCostType(cardData), cardData, true);
        const cost = {
            prestate: null,
            costType: prevCost.costType,
            subtype: prevCost.subtype,
            supertype: prevCost.supertype,
            amount: DEFAULT_EFFECTS_COST.amount,
            target: null,
            payment: null,
            postCount: null
        };
        onCardDataChange('cardEffects', {...cardData.cardEffects, cost: cost});
    }

    const isCostPaymentConfable = getCostPaymentTypeOptions(cardData).length && getEffectsCostPayment(cardData).paymentType !== PaymentCostType.NONE;

    const costPaymentSelectionType = routePaymentCostTypeSelectionType(getEffectsCostPayment(cardData).paymentType || PaymentCostType.NONE);
    const costPaymentProps = getAmountProps(costPaymentSelectionType);

    const handleEffectTypeChange = (value: string, prevCard: CardData = cardData, justReturn: boolean = false) => {
        const effectType: EffectType = isEffectType(value) ? value : EffectType.NONE;
        const card = {...prevCard};
        card.cardEffects.effect.effectType = effectType;
        const subtype = getDefaultEffectSubtype(card);
        const effect = {...handleEffectSubtypeChange(subtype, card, true),
            effectType: effectType
        };
        if (justReturn) {
            return effect;
        }
        onCardDataChange('cardEffects',
            {...cardData.cardEffects, effect: effect});
        return effect;
    }

    const handleEffectSubtypeChange = (value: string, prevCard: CardData = cardData, justReturn: boolean = false) => {
        return getEffectsEffect(cardData);
    }

    const resetEffect = () => {
        const preEffect = handleEffectTypeChange(getDefaultEffectType(cardData), cardData, true);
        const effect = {
            effectType: preEffect.effectType,
            subtype: preEffect.subtype ?? '',
            supertype: preEffect.supertype ?? '',
            amount: DEFAULT_EFFECTS_EFFECT.amount,
            maxAmount: null,
            target: null,
            direction: null,
            hindrance: null,
            benefit: null,
            chainEffect: null
        };
        onCardDataChange('cardEffects', {...cardData.cardEffects, effect: effect});
    }

    const getEffectsTab = () => {
        return (
            <>
                <Typography sx={{...menuTitleStyle, marginBottom: '0.6rem'}}>Cost:</Typography>
                <Box
                    sx={{...rowContainerStyle, display: getCostPrestateOptions(cardData).length ? 'flex' : 'none'}}
                >
                    <FormControl fullWidth>
                        <InputLabel id="cost-prestate-label">Prestate</InputLabel>
                        <Select
                            labelId="cost-prestate-label"
                            value={cardData.cardEffects.cost?.prestate || StateCostType.NONE}
                            label="Prestate"
                            onChange={(event: SelectChangeEvent<StateCostType>, child: ReactNode) => handleCostPrestateChange(event.target.value)}
                            disabled={cannotEdit()}
                        >
                            {getStringSelector(getCostPrestateOptions(cardData), getDefaultCostPrestate(cardData))}
                        </Select>
                    </FormControl>
                </Box>
                <Box
                    sx={rowContainerStyle}
                >
                    <FormControl fullWidth>
                        <InputLabel id="cost-type-selector-label">Type</InputLabel>
                        <Select
                            labelId="cost-type-selector-label"
                            value={cardData.cardEffects.cost?.costType}
                            label="Type"
                            onChange={(event: SelectChangeEvent<CostType>, child: ReactNode) => handleCostTypeChange(event.target.value)}
                            disabled={cannotEdit()}
                        >
                            {getStringSelector(getCostTypeOptions(cardData), getDefaultCostType(cardData))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{display: costSubtypeOptions.length ? 'flex' : 'none'}}
                        fullWidth>
                        <InputLabel id="cost-subtype-selector-label">Subtype</InputLabel>
                        <Select
                            labelId="cost-subtype-selector-label"
                            value={cardData.cardEffects.cost?.subtype || ''}
                            label="Subtype"
                            onChange={(event: SelectChangeEvent<string>, child: ReactNode) => handleCostSubtypeChange(event.target.value)}
                            disabled={cannotEdit()}
                        >
                            {getStringSelector(costSubtypeOptions, getDefaultCostSubtype(cardData))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{display: costSupertypeOptions.length ? 'flex' : 'none'}}
                        fullWidth>
                        <InputLabel id="cost-supertype-selector-label">Supertype</InputLabel>
                        <Select
                            labelId="cost-supertype-selector-label"
                            value={cardData.cardEffects.cost?.supertype || ''}
                            label="Supertype"
                            onChange={(event: SelectChangeEvent<string>, child: ReactNode) => handleCostSupertypeChange(event.target.value)}
                            disabled={cannotEdit()}
                        >
                            {getStringSelector(costSupertypeOptions, getDefaultCostSupertype(cardData))}
                        </Select>
                    </FormControl>
                </Box>
                <Box
                    sx={{...rowContainerStyle, display: costAmountProps.visible ? 'flex' : 'none'}}
                >
                    <TextField
                        fullWidth
                        type="number"
                        label="Amount"
                        variant="outlined"
                        value={cardData.cardEffects.cost.amount || costAmountProps.default}
                        onChange={handleCostAmountChange}
                        inputProps={costAmountProps}
                        disabled={cannotEdit()}
                        sx={{display: isCostAmountSelectable ? 'flex' : 'none'}}
                    />
                    <FormControl fullWidth sx={costCardSelectionVisible}>
                        <InputLabel id="cost-target-subtype-selector-label">Subtype</InputLabel>
                        <Select
                            labelId="cost-target-subtype-selector-label"
                            value={cardData.cardEffects.cost?.target?.subtype || CardSubtype.NONE}
                            label="Subtype"
                            onChange={(event: SelectChangeEvent<CardSubtype>, child: ReactNode) =>
                                handleTargetSubtypeChange(event.target.value, getEffectsCostTarget(cardData), handleCostTargetChange)}
                            disabled={cannotEdit()}
                        >
                            {getStringSelector(TARGETABLE_CARD_SUBTYPES)}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={costCardSelectionVisible}>
                        <InputLabel id="cost-target-class-selector-label">Class</InputLabel>
                        <Select
                            labelId="cost-target-class-selector-label"
                            value={cardData.cardEffects.cost?.target?.cardClass || CardClass.NONE}
                            label="Class"
                            onChange={(event: SelectChangeEvent<CardClass>, child: ReactNode) =>
                                handleTargetClassChange(event.target.value, getEffectsCostTarget(cardData), handleCostTargetChange)}
                            disabled={cannotEdit()}
                        >
                            {getStringSelector(Object.values(CardClass))}
                        </Select>
                    </FormControl>
                </Box>
                <Box
                    sx={{...rowContainerStyle, display: [SelectionType.CARD, SelectionType.ALL_CARDS, SelectionType.PRIVATE_CARD].includes(costSelectionType) ? 'flex' : 'none'}}
                >
                    <TextField
                        fullWidth
                        type="number"
                        label="Min level"
                        variant="outlined"
                        value={getEffectsCostTarget(cardData).minLevel || NULLABLE_LEVEL_AMOUNT_PROPS.default}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            handleTargetMinLevelChange(parseInt(event.target.value), getEffectsCostTarget(cardData), handleCostTargetChange)}
                        inputProps={NULLABLE_LEVEL_AMOUNT_PROPS}
                        disabled={cannotEdit()}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Max level"
                        variant="outlined"
                        value={getEffectsCostTarget(cardData).maxLevel || NULLABLE_LEVEL_AMOUNT_PROPS.default}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            handleTargetMaxLevelChange(parseInt(event.target.value), getEffectsCostTarget(cardData), handleCostTargetChange)}
                        inputProps={NULLABLE_LEVEL_AMOUNT_PROPS}
                        disabled={cannotEdit()}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Atk"
                        variant="outlined"
                        value={getEffectsCostTarget(cardData).atk ?? NULLABLE_STAT_AMOUNT_PROPS.default}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            handleTargetAtkChange(parseInt(event.target.value), getEffectsCostTarget(cardData), handleCostTargetChange)}
                        inputProps={NULLABLE_STAT_AMOUNT_PROPS}
                        disabled={cannotEdit()}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Def"
                        variant="outlined"
                        value={getEffectsCostTarget(cardData).def ?? NULLABLE_STAT_AMOUNT_PROPS.default}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            handleTargetDefChange(parseInt(event.target.value), getEffectsCostTarget(cardData), handleCostTargetChange)}
                        inputProps={NULLABLE_STAT_AMOUNT_PROPS}
                        disabled={cannotEdit()}
                    />
                </Box>
                <Box
                    sx={{...rowContainerStyle, display:
                            getCostTargetTypeOptions(cardData).length
                            || getCostTargetOwnerOptions(cardData).length
                            || getCostTargetZoneOptions(cardData).length
                                ? 'flex' : 'none'}}
                >
                    <FormControl fullWidth sx={{display: getCostTargetTypeOptions(cardData).length ? 'flex' : 'none'}}>
                        <InputLabel id="cost-target-type-selector-label">Target</InputLabel>
                        <Select
                            labelId="cost-target-type-selector-label"
                            value={cardData.cardEffects.cost?.target?.targetType || getDefaultCostTargetType(cardData)}
                            label="Target"
                            onChange={(event: SelectChangeEvent<TargetType>, child: ReactNode) =>
                                handleTargetTypeChange(event.target.value, getEffectsCostTarget(cardData), handleCostTargetChange)}
                            disabled={cannotEdit()}
                        >
                            {getStringSelector(getCostTargetTypeOptions(cardData), getDefaultCostTargetType(cardData))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{display: getCostTargetOwnerOptions(cardData).length ? 'flex' : 'none'}}>
                        <InputLabel id="cost-target-owner-selector-label">Owner</InputLabel>
                        <Select
                            labelId="cost-target-owner-selector-label"
                            value={cardData.cardEffects.cost?.target?.owner || getDefaultCostTargetOwner(cardData)}
                            label="Owner"
                            onChange={(event: SelectChangeEvent<TargetOwner>, child: ReactNode) =>
                                handleTargetOwnerChange(event.target.value, getEffectsCostTarget(cardData), handleCostTargetChange)}
                            disabled={cannotEdit()}
                        >
                            {getStringSelector(getCostTargetOwnerOptions(cardData), getDefaultCostTargetOwner(cardData))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{display: getCostTargetZoneOptions(cardData).length ? 'flex' : 'none'}}>
                        <InputLabel id="cost-target-zone-selector-label">Zone</InputLabel>
                        <Select
                            labelId="cost-target-zone-selector-label"
                            value={cardData.cardEffects.cost?.target?.zone || getDefaultCostTargetZone(cardData)}
                            label="Zone"
                            onChange={(event: SelectChangeEvent<Zone>, child: ReactNode) =>
                                handleTargetZoneChange(event.target.value, getEffectsCostTarget(cardData), handleCostTargetChange)}
                            disabled={cannotEdit()}
                        >
                            {getStringSelector(getCostTargetZoneOptions(cardData), getDefaultCostTargetZone(cardData))}
                        </Select>
                    </FormControl>
                </Box>
                <Box
                    sx={{...rowContainerStyle, display: getCostPaymentTypeOptions(cardData).length ? 'flex' : 'none'}}
                >
                    <FormControl fullWidth>
                        <InputLabel id="cost-payment-type-label">Payment</InputLabel>
                        <Select
                            labelId="cost-payment-type-label"
                            value={cardData.cardEffects.cost?.payment?.paymentType || PaymentCostType.NONE}
                            label="Payment"
                            onChange={(event: SelectChangeEvent<PaymentCostType>, child: ReactNode) =>
                                handlePaymentTypeChange(event.target.value, getEffectsCostPayment(cardData), handleCostPaymentChange)}
                            disabled={cannotEdit()}
                        >
                            {getStringSelector(getCostPaymentTypeOptions(cardData), getDefaultCostPaymentType(cardData))}
                        </Select>
                    </FormControl>
                    <TextField sx={{display: isCostPaymentConfable ? 'flex' : 'none'}}
                        fullWidth
                        type="number"
                        label="Amount"
                        variant="outlined"
                        value={getEffectsCostPayment(cardData).amount ?? costPaymentProps.default}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            handlePaymentAmountChange(parseInt(event.target.value), getEffectsCostPayment(cardData), handleCostPaymentChange)}
                        inputProps={costPaymentProps}
                        disabled={cannotEdit()}
                    />
                    <FormControl fullWidth sx={{display: isCostPaymentConfable && isCardPropertySelection(costPaymentSelectionType) ? 'flex' : 'none'}}>
                        <InputLabel id="cost-payment-card-type-label">Card Type</InputLabel>
                        <Select
                            labelId="cost-payment-card-type-label"
                            value={cardData.cardEffects.cost?.payment?.cardType || CardType.NONE}
                            label="Card Type"
                            onChange={(event: SelectChangeEvent<CardType>, child: ReactNode) =>
                                handlePaymentCardTypeChange(event.target.value, getEffectsCostPayment(cardData), handleCostPaymentChange)}
                            disabled={cannotEdit()}
                        >
                            {getStringSelector(Object.values(CardType))}
                        </Select>
                    </FormControl>
                </Box>
                <Box
                    sx={{...rowContainerStyle, display: getCostPostCountTypeOptions(cardData).length ? 'flex' : 'none'}}
                >
                   <FormControl fullWidth>
                        <InputLabel id="cost-post-count-type-label">Post Count</InputLabel>
                        <Select
                            labelId="cost-post-count-type-label"
                            value={cardData.cardEffects.cost?.postCount?.countType || PostCountType.NONE}
                            label="Post Count"
                            onChange={(event: SelectChangeEvent<PostCountType>, child: ReactNode) =>
                                handlePostCountTypeChange(event.target.value, getEffectsCostPostCount(cardData), handleCostPostCountChange)}
                            disabled={cannotEdit()}
                        >
                            {getStringSelector(getCostPostCountTypeOptions(cardData), getDefaultCostPostCountType(cardData))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{display: getCostPostCountSubtypeOptions(getEffectsCostPostCount(cardData).countType).length ? 'flex' : 'none'}}>
                        <InputLabel id="cost-post-count-subtype-label">Subtype</InputLabel>
                        <Select
                            labelId="cost-post-count-subtype-label"
                            value={cardData.cardEffects.cost?.postCount?.subtype || getDefaultCostPostCountSubtype(getEffectsCostPostCount(cardData).countType)}
                            label="Subtype"
                            onChange={(event: SelectChangeEvent<string|null>, child: ReactNode) =>
                                handlePostCountSubtypeChange(event.target.value, getEffectsCostPostCount(cardData), handleCostPostCountChange)}
                            disabled={cannotEdit()}
                        >
                            {getStringSelector(getCostPostCountSubtypeOptions(getEffectsCostPostCount(cardData).countType),
                                getDefaultCostPostCountSubtype(getEffectsCostPostCount(cardData).countType)
                            )}
                        </Select>
                    </FormControl>
                </Box>
                <Box
                    sx={{...rowContainerStyle, display: cannotEdit() ? 'none' : 'flex'}}
                >
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={resetCost}
                        disabled={
                            isEqual(getEffectsCost(cardData), {...DEFAULT_EFFECTS_COST, costType: getDefaultCostType(cardData),
                                subtype: getDefaultCostSubtype(cardData), supertype: getDefaultCostSupertype(cardData)})
                        }
                        sx={{ marginLeft: '0.6rem', borderRadius: '1rem', padding: '0.2rem' }}
                    >
                        Reset
                    </Button>
                </Box>

                <Typography sx={{...menuTitleStyle, marginBottom: '0.6rem'}}>Effect:</Typography>
                <Box
                    sx={rowContainerStyle}
                >

                </Box>
                <Box
                    sx={{...rowContainerStyle, display: cannotEdit() ? 'none' : 'flex'}}
                >
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={resetEffect}
                        disabled={
                            isEqual(getEffectsEffect(cardData), {...DEFAULT_EFFECTS_EFFECT, effectType: getDefaultEffectType(cardData),
                                subtype: getDefaultEffectSubtype(cardData), supertype: getDefaultEffectSupertype(cardData)})
                        }
                        sx={{ marginLeft: '0.6rem', borderRadius: '1rem', padding: '0.2rem' }}
                    >
                        Reset
                    </Button>
                </Box>
            </>
        );
    }

    const fixEffects = () => {
        if (!getCostTypeOptions(cardData).includes(getEffectsCost(cardData).costType)) {
            handleCostTypeChange(getDefaultCostType(cardData));
        }
    }

    return (
        <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
            <Tabs value={tabId} onChange={onTabClicked} aria-label="form tabs" sx={{marginBottom: '2rem', marginTop: '2rem'}}>
                <Tab label="Stats" />
                <Tab label="Effects" onClick={() => fixEffects()} />
            </Tabs>
            <Box sx={{display: tabId === STATS_TAB ? 'block' : 'none'}}>
                <Box
                    sx={rowContainerStyle}
                >
                    <TextField
                        fullWidth
                        label="Card Name"
                        variant="outlined"
                        value={cardData.cardName}
                        onChange={handleInputChange('cardName')}
                        disabled={cannotEdit() || (!!cardData.errataOfId && cardData.errataOfId !== cardData.cardId)}
                    />
                    <FormControl sx={{
                        minWidth: '9rem',
                        display: cardData.supertype === CardSupertype.MAXIMUM ? 'flex' : 'none'
                    }}>
                        <InputLabel id="maximum-selector-label">Maximum Piece</InputLabel>
                        <Select
                            labelId="maximum-selector-label"
                            value={cardData.maximumPiece}
                            label="Maximum Piece"
                            onChange={handleSelectChange('maximumPiece')}
                            disabled={cannotEdit()}
                        >
                            {Object.values(MaximumPiece).filter(piece => cardData.supertype !== CardSupertype.MAXIMUM || piece !== MaximumPiece.NONE).map(c => (
                                <MenuItem key={c} value={c}>{c}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        type="number"
                        label="Name Size"
                        variant="outlined"
                        value={cardData.nameSize}
                        onChange={handleInputChange('nameSize')}
                        inputProps={{ min: 1, max: 4 }}
                        sx={{ minWidth: '8rem' }}
                        disabled={cannotEdit()}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={cardData.isAce}
                                onChange={handleInputChange('isAce')}
                                name="isAce"
                                disabled={cannotEdit()}
                            />
                        }
                        label="Is Ace"
                        sx={{ minWidth: 'fit-content' }}
                    />
                </Box>
                <Box
                    sx={rowContainerStyle}
                >
                    <TextField
                        fullWidth
                        type="number"
                        label="Art Scale"
                        variant="outlined"
                        value={cardData.artScale}
                        onChange={handleInputChange('artScale')}
                        inputProps={{ min: 0, max: 50 }}
                        disabled={cannotEdit()}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="X Offset"
                        variant="outlined"
                        value={cardData.artXOffset}
                        onChange={handleInputChange('artXOffset')}
                        inputProps={{ min: 0, max: 250 }}
                        disabled={cannotEdit()}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Y Offset"
                        variant="outlined"
                        value={cardData.artYOffset}
                        onChange={handleInputChange('artYOffset')}
                        inputProps={{ min: 0, max: 100 }}
                        disabled={cannotEdit()}
                    />
                </Box>
                <Box
                    sx={rowContainerStyle}
                >
                    <Box sx={{ display: cardData.cardType === CardType.MONSTER ? 'inline' : 'none' }}>
                        <FormControl fullWidth>
                            <InputLabel id="class-selector-label">Class</InputLabel>
                            <Select
                                labelId="class-selector-label"
                                value={cardData.cardClass}
                                label="Class"
                                onChange={handleSelectChange('cardClass')}
                                disabled={cannotEdit()}
                            >
                                {Object.values(CardClass).filter(value => !isNoneString(value)).map(c => (
                                    <MenuItem key={c} value={c}>{c}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <FormControl fullWidth>
                        <InputLabel id="type-selector-label">Card Type</InputLabel>
                        <Select
                            labelId="type-selector-label"
                            value={cardData.cardType}
                            label="Card Type"
                            onChange={handleSelectChange('cardType')}
                            disabled={cannotEdit()}
                        >
                            {Object.values(CardType).filter(value => !isNoneString(value)).map(t => (
                                <MenuItem key={t} value={t}>{t}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="subtype-selector-label">Subtype</InputLabel>
                        <Select
                            labelId="subtype-selector-label"
                            value={cardData.subtype}
                            label="Subtype"
                            onChange={handleSelectChange('subtype')}
                            disabled={cannotEdit()}
                        >
                            {getSubtypeOptions(cardData.cardType)}
                        </Select>
                    </FormControl>
                    <Box sx={{ display: [CardType.MONSTER, CardType.TRAP].includes(cardData.cardType) &&
                        [CardSubtype.NORMAL, CardSubtype.EFFECT].includes(cardData.subtype) ? 'inline' : 'none' }}>
                        <FormControl fullWidth>
                            <InputLabel id="supertype-selector-label">Supertype</InputLabel>
                            <Select
                                labelId="supertype-selector-label"
                                value={cardData.supertype}
                                label="Supertype"
                                onChange={handleSelectChange('supertype')}
                                disabled={cannotEdit()}
                            >
                                {getSupertypeOptions(cardData.cardType, cardData.subtype)}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Box
                    sx={{
                        ...rowContainerStyle,
                        display: cardData.cardType === CardType.MONSTER ? 'flex' : 'none',
                    }}
                >
                    <TextField
                        fullWidth
                        type="number"
                        label="Level"
                        variant="outlined"
                        value={cardData.level}
                        onChange={handleInputChange('level')}
                        inputProps={{ min: 1, max: 9 }}
                        disabled={cannotEdit()}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Attack"
                        variant="outlined"
                        value={cardData.atk}
                        onChange={handleInputChange('atk')}
                        inputProps={{ min: 0, max: 2600, step: 100 }}
                        disabled={cannotEdit()}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Defense"
                        variant="outlined"
                        value={cardData.def}
                        onChange={handleInputChange('def')}
                        inputProps={{ min: 0, max: 2500, step: 100 }}
                        disabled={cannotEdit()}
                    />
                </Box>

                <Box
                    sx={{
                        ...rowContainerStyle,
                        display: isExtraDeckCard(cardData) ? 'flex' : 'none',
                    }}
                >
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel id="primary-material-selector-label">Primary material</InputLabel>
                        <Select
                            labelId="primary-material-selector-label"
                            value={cardData.primaryMaterialId ? cardData.primaryMaterialId.toString() : ''}
                            label="Primary material"
                            onChange={handleSelectChange('primaryMaterialId')}
                            disabled={cannotEdit()}
                        >
                            {isKiller(cardData) ? monsterCardSelector() : cardSelector()}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel id="secondary-material-selector-label">Secondary material</InputLabel>
                        <Select
                            labelId="secondary-material-selector-label"
                            value={cardData.secondaryMaterialId ? cardData.secondaryMaterialId.toString() : ''}
                            label="Secondary material"
                            onChange={handleSelectChange('secondaryMaterialId')}
                            disabled={cannotEdit()}
                        >
                            {isKiller(cardData) ? backrowCardSelector() : cardSelector()}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ marginBottom: 2, display: !isKiller(cardData) ? 'flex' : 'none', }}>
                        <InputLabel id="tertiary-material-selector-label">Tertiary material</InputLabel>
                        <Select
                            labelId="tertiary-material-selector-label"
                            value={cardData.tertiaryMaterialId ? cardData.tertiaryMaterialId.toString() : ''}
                            label="Tertiary material"
                            onChange={handleSelectChange('tertiaryMaterialId')}
                            disabled={cannotEdit()}
                        >
                            {cardSelector()}
                        </Select>
                    </FormControl>
                </Box>
                <Box
                    sx={rowContainerStyle}
                >
                    <TextField
                        fullWidth
                        label="Cost Text"
                        variant="outlined"
                        multiline
                        rows={2}
                        value={cardData.costText}
                        onChange={handleInputChange('costText')}
                        disabled={cannotEdit()}
                        sx={{
                            display: hasCostText(cardData) ? 'flex' : 'none',
                            marginBottom: 2
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Materials Reminder"
                        variant="outlined"
                        multiline
                        rows={2}
                        value={cardData.materialsReminder}
                        onChange={handleInputChange('materialsReminder')}
                        disabled={cannotEdit()}
                        sx={{
                            display: hasTwoMaterials(cardData) ? 'flex' : 'none',
                            marginBottom: 2
                        }}
                    />
                </Box>
                <TextField
                    fullWidth
                    label="Effect Text"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={cardData.effectText}
                    onChange={handleInputChange('effectText')}
                    disabled={cannotEdit()}
                    sx={{
                        display: hasEffectText(cardData) ? 'flex' : 'none',
                        marginBottom: 2
                    }}
                />
                <TextField
                    fullWidth
                    label="Flavour Text"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={cardData.flavourText}
                    onChange={handleInputChange('flavourText')}
                    disabled={cannotEdit()}
                    sx={{
                        display: hasFlavourText(cardData) ? 'flex' : 'none',
                        marginBottom: 2
                    }}
                />
                <Box
                    sx={rowContainerStyle}
                >
                    <FormControl fullWidth>
                        <InputLabel id="counts-as-selector-label">Counts as</InputLabel>
                        <Select
                            labelId="counts-as-selector-label"
                            value={cardData.countsAsId ? cardData.countsAsId.toString() : ''}
                            label="Counts as"
                            onChange={handleSelectChange('countsAsId')}
                            disabled={cannotEdit()}
                        >
                            {countsAsSelector()}

                        </Select>
                    </FormControl>
                    <TextField
                        type="number"
                        label="Materials Size"
                        variant="outlined"
                        value={cardData.materialsSize}
                        onChange={handleInputChange('materialsSize')}
                        inputProps={{ min: 1, max: 5 }}
                        disabled={cannotEdit()}
                        sx={{
                            display: isExtraDeckCard(cardData) ? 'flex' : 'none',
                            minWidth: '8rem'
                        }}
                    />
                    <TextField
                        type="number"
                        label="Effects Size"
                        variant="outlined"
                        value={cardData.effectsSize}
                        onChange={handleInputChange('effectsSize')}
                        inputProps={{ min: 1, max: 5 }}
                        disabled={cannotEdit()}
                        sx={{ minWidth: '8rem' }}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="expansion-selector-label">Expansion</InputLabel>
                        <Select
                            labelId="expansion-selector-label"
                            value={cardData.expansionId.toString()}
                            label="Expansion"
                            disabled={cannotEdit()}
                            onChange={handleSelectChange('expansionId')}
                        >
                            {expansions
                                .filter(expansion => expansion.id === cardData.expansionId || expansion.ownerId === getUserId() || expansion.ownerId === EXPANSION_NO_OWNER)
                                .sort((expansionA, expansionB) => expansionA.name.localeCompare(expansionB.name))
                                .map(expansion => (
                                    <MenuItem key={expansion.id} value={expansion.id}>{expansion.name}</MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                </Box>
            </Box>
            <Box sx={{display: tabId === EFFECTS_TAB ? 'block' : 'none'}}>
                {getEffectsTab()}
            </Box>
            <Box sx={{...rowContainerStyle, marginBottom: 0}}>
                <Button onClick={onSave} variant="contained" color="primary" disabled={cardData.cardName.length === 0} sx={hideHiddenButton()}>
                    Save
                </Button>
                <Button onClick={onExport} variant="contained" color="secondary" disabled={cardData.cardName.length === 0}>
                    Export as PNG
                </Button>
                <Button variant="contained" color="info" component="label" sx={hideHiddenButton()}>
                    Upload Image
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={onImageFileChange}
                    />
                </Button>
                <Button onClick={onEncode} variant="contained" color="secondary" disabled={(cardData.cardName + combineEffectsTexts(cardData)).length === 0} sx={hideHiddenButton()}>
                    ENCODE
                </Button>
                <Button onClick={onDelete} variant="contained" color="error" disabled={cardData.cardId === 0} sx={hideHiddenButton()}>
                    Delete
                </Button>
                <Button onClick={onErrata} variant="contained" color="primary" sx={{display: canErrataCard(cardData, expansions) ? 'flex' : 'none'}}>
                    Errata
                </Button>
                <Button onClick={onCopy} variant="contained" color="secondary">
                    Copy
                </Button>
            </Box>
        </Box>
    );
};

export default RightPanelSettings;
