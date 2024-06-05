import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {
    AppBar,
    TextField,
    Toolbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {CardData, getPointerId} from "../../types/card";
import {CardExpansion} from "../../types/expansion";
import Button from "@mui/material/Button";
import {normalizeName} from "../../utils/string";
import {toast} from "react-toastify";
import Cookies from "js-cookie";
import FiltersModal from "./FiltersModal";
import {CardCatalogueCookie} from "../../types/cookie";
import {ComparisonType} from "../../types/filter";
import {CardOwner} from "../../types/user";

interface CardFiltersProps extends React.RefAttributes<CardFiltersRef> {
    onFilterChange: (filters: { cardName: string, cardEffects: string, referenceId: string, cardClass: string,
        cardType: string, cardSubtype: string, cardSupertype: string, expansionId: string, sortOrder: string,
        sortBy: string, level: number, levelOperation: string, atk: number, atkOperation: string, def: number,
        defOperation: string, isAce: boolean, ownerId: string
    }) => void;
    expansions: Array<CardExpansion>;
    cards: Array<CardData>;
    cardOwners: Array<CardOwner>;
}

export interface CardFiltersRef {
    referenceCard: (cardData: CardData) => void;
    resetFilters: () => void;
    clearReference: () => void;
    toggleFilters: () => void;
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: 'white',
    boxShadow: theme.shadows[4],
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    zIndex: theme.zIndex.appBar,
}));

const CardFilters: React.FC<CardFiltersProps> = forwardRef<CardFiltersRef, CardFiltersProps>(({onFilterChange, expansions,
    cards, cardOwners}, ref) => {
    const loadFiltersFromCookies = () => {
        return {
            cardName: Cookies.get(CardCatalogueCookie.CARD_NAME) || '',
            cardEffects: Cookies.get(CardCatalogueCookie.CARD_EFFECTS) || '',
            referenceId: Cookies.get(CardCatalogueCookie.REFERENCE_ID) || '',
            cardClass: Cookies.get(CardCatalogueCookie.CARD_CLASS) || '',
            cardType: Cookies.get(CardCatalogueCookie.CARD_TYPE) || '',
            cardSubtype: Cookies.get(CardCatalogueCookie.CARD_SUBTYPE) || '',
            cardSupertype: Cookies.get(CardCatalogueCookie.CARD_SUPERTYPE) || '',
            expansionId: Cookies.get(CardCatalogueCookie.EXPANSION_ID) || '',
            sortOrder: Cookies.get(CardCatalogueCookie.SORT_ORDER) || '',
            sortBy: Cookies.get(CardCatalogueCookie.SORT_BY) || '',
            level: Cookies.get(CardCatalogueCookie.LEVEL) || 1,
            levelOperation: Cookies.get(CardCatalogueCookie.LEVEL_OPERATION) || '',
            atk: Cookies.get(CardCatalogueCookie.ATK) || 0,
            atkOperation: Cookies.get(CardCatalogueCookie.ATK_OPERATION) || '',
            def: Cookies.get(CardCatalogueCookie.DEF) || 0,
            defOperation: Cookies.get(CardCatalogueCookie.DEF_OPERATION) || '',
            isAce: Cookies.get(CardCatalogueCookie.IS_ACE) || false,
            ownerId: Cookies.get(CardCatalogueCookie.OWNER_ID) || '',
        };
    }

    const initialState = loadFiltersFromCookies();
    const [cardName, setCardName] = useState(initialState.cardName);
    const [cardEffects, setCardEffects] = useState(initialState.cardEffects);
    const [referenceId, setReferenceId] = useState(initialState.referenceId);
    const [cardClass, setCardClass] = useState(initialState.cardClass);
    const [cardType, setCardType] = useState(initialState.cardType);
    const [cardSubtype, setCardSubtype] = useState(initialState.cardSubtype);
    const [cardSupertype, setCardSupertype] = useState(initialState.cardSupertype);
    const [expansionId, setExpansionId] = useState(initialState.expansionId);
    const [sortOrder, setSortOrder] = useState(initialState.sortOrder);
    const [sortBy, setSortBy] = useState(initialState.sortBy);
    const [level, setLevel] = useState(initialState.level);
    const [levelOperation, setLevelOperation] = useState(initialState.levelOperation);
    const [atk, setAtk] = useState(initialState.atk);
    const [atkOperation, setAtkOperation] = useState(initialState.atkOperation);
    const [def, setDef] = useState(initialState.def);
    const [defOperation, setDefOperation] = useState(initialState.defOperation);
    const [isAce, setIsAce] = useState(initialState.isAce);
    const [ownerId, setOwnerId] = useState(initialState.ownerId);

    const [isModalOpen, setModalOpen] = useState(false);

    const getFilters = () => {
        return {
            cardName, cardEffects, referenceId, cardClass, cardType, cardSubtype, cardSupertype, expansionId, sortOrder, sortBy,
            level, levelOperation, atk, atkOperation, def, defOperation, isAce, ownerId
        }
    }

    const getEmptyFilters = () => {
        return {
            cardName: '', cardEffects: '', referenceId: '', cardClass: '',
            cardType: '', cardSubtype: '', cardSupertype: '', expansionId: '',
            sortOrder: '', sortBy: '', level: 1, levelOperation: '',
            atk: 0, atkOperation: '', def: 0, defOperation: '', isAce: false, ownerId: ''
        };
    }

    const makeInt = (value: string|number) => {
        if (typeof value === 'number') {
            return value;
        }
        return parseInt(value);
    }

    useEffect(() => {
        onFilterChange({
            cardName, cardEffects, referenceId, cardClass, cardType, cardSubtype, cardSupertype,
            expansionId, sortOrder, sortBy, level: makeInt(level), levelOperation, atk: makeInt(atk),
            atkOperation, def: makeInt(def), defOperation, isAce: (typeof isAce === 'boolean' ? isAce : isAce.toLowerCase() === "true"), ownerId
        });
    }, [cardName, cardEffects, referenceId, cardClass, cardType, cardSubtype,
        cardSupertype, expansionId, sortOrder, sortBy, level, levelOperation, atk,
        atkOperation, def, defOperation, isAce, ownerId]);

    const referenceCard = (cardData: CardData) => {
        const cardId = getPointerId(cardData).toString();
        const value = referenceId === cardId ? '' : cardId;
        if (value === cardId) {
            toast.info('References to card: ' + normalizeName(cardData.cardName));
        }
        setReferenceId(value);
        onFilterChange({ ...getEmptyFilters(), referenceId: value });
    }
    const handleCardNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setCardName(value);
        Cookies.set(CardCatalogueCookie.CARD_NAME, value);
    };

    const handleCardClassChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setCardClass(value);
        Cookies.set(CardCatalogueCookie.CARD_CLASS, value);
    };

    const handleCardTypeChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setCardType(value);
        Cookies.set(CardCatalogueCookie.CARD_TYPE, value);
    };

    const handleCardSubtypeChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setCardSubtype(value);
        Cookies.set(CardCatalogueCookie.CARD_SUBTYPE, value);
    };

    const handleCardSupertypeChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setCardSupertype(value);
        Cookies.set(CardCatalogueCookie.CARD_SUPERTYPE, value);
    };

    const handleExpansionChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setExpansionId(value);
        Cookies.set(CardCatalogueCookie.EXPANSION_ID, value);
    };

    const handleCardEffectsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value: string = event.target.value;
        setCardEffects(value);
        Cookies.set(CardCatalogueCookie.CARD_EFFECTS, value);
    };

    const handleReferenceIdChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setReferenceId(value);
        Cookies.set(CardCatalogueCookie.REFERENCE_ID, value);
    };

    const handleSortOrderChange = (event: React.MouseEvent<HTMLElement>, value: string | null ) => {
        if (value === null) {
            value = sortOrder;
        }
        setSortOrder(value);
        Cookies.set(CardCatalogueCookie.SORT_ORDER, value);
    };

    const handleSortByChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setSortBy(value);
        Cookies.set(CardCatalogueCookie.SORT_BY, value);
    };

    const handleLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setLevel(value);
        if (levelOperation === '') {
            setLevelOperation(ComparisonType.EQUAL);
        }
        Cookies.set(CardCatalogueCookie.LEVEL, value.toString());
    };
    const handleLevelOperationChange = (event: React.MouseEvent<HTMLElement>, value: string | null ) => {
        if (value === null) {
            value = '';
        }
        setLevelOperation(value);
        Cookies.set(CardCatalogueCookie.LEVEL_OPERATION, value);
    };

    const handleAtkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setAtk(value);
        if (atkOperation === '') {
            setAtkOperation(ComparisonType.EQUAL);
        }
        Cookies.set(CardCatalogueCookie.ATK, value.toString());
    };
    const handleAtkOperationChange = (event: React.MouseEvent<HTMLElement>, value: string | null ) => {
        if (value === null) {
            value = '';
        }
        setAtkOperation(value);
        Cookies.set(CardCatalogueCookie.ATK_OPERATION, value);
    };

    const handleDefChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setDef(value);
        if (defOperation === '') {
            setDefOperation(ComparisonType.EQUAL);
        }
        Cookies.set(CardCatalogueCookie.DEF, value.toString());
    };
    const handleDefOperationChange = (event: React.MouseEvent<HTMLElement>, value: string | null ) => {
        if (value === null) {
            value = '';
        }
        setDefOperation(value);
        Cookies.set(CardCatalogueCookie.DEF_OPERATION, value);
    };

    const handleIsAceChange = (value: boolean) => {
        setIsAce(value);
        Cookies.set(CardCatalogueCookie.IS_ACE, String(value));
    };

    const handleOwnerIdChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setOwnerId(value);
        Cookies.set(CardCatalogueCookie.OWNER_ID, value);
    };


    const resetFilters = () => {
        setCardName('');
        setCardEffects('');
        setReferenceId('');
        setCardClass('');
        setCardType('');
        setCardSubtype('');
        setCardSupertype('');
        setExpansionId('');
        setSortOrder('');
        setSortBy('');
        setLevel(1);
        setLevelOperation('');
        setAtk(0);
        setAtkOperation('');
        setDef(0);
        setDefOperation('');
        setIsAce(false);
        setOwnerId('');

        onFilterChange(getEmptyFilters());
        resetFilterCookies();
    };

    const resetFilterCookies = () => {
        Cookies.remove(CardCatalogueCookie.CARD_NAME);
        Cookies.remove(CardCatalogueCookie.CARD_EFFECTS);
        Cookies.remove(CardCatalogueCookie.REFERENCE_ID);
        Cookies.remove(CardCatalogueCookie.CARD_CLASS);
        Cookies.remove(CardCatalogueCookie.CARD_TYPE);
        Cookies.remove(CardCatalogueCookie.CARD_SUBTYPE);
        Cookies.remove(CardCatalogueCookie.CARD_SUPERTYPE);
        Cookies.remove(CardCatalogueCookie.EXPANSION_ID);
        Cookies.remove(CardCatalogueCookie.SORT_ORDER);
        Cookies.remove(CardCatalogueCookie.SORT_BY);
        Cookies.remove(CardCatalogueCookie.LEVEL);
        Cookies.remove(CardCatalogueCookie.LEVEL_OPERATION);
        Cookies.remove(CardCatalogueCookie.ATK);
        Cookies.remove(CardCatalogueCookie.ATK_OPERATION);
        Cookies.remove(CardCatalogueCookie.DEF);
        Cookies.remove(CardCatalogueCookie.DEF_OPERATION);
        Cookies.remove(CardCatalogueCookie.IS_ACE);
        Cookies.remove(CardCatalogueCookie.OWNER_ID);
    }

    const clearReference = () => {
        setReferenceId('');
        onFilterChange({ ...getEmptyFilters(), referenceId: '' });
    };
    const toggleFilters = () => {
        setModalOpen(!isModalOpen);
    };

    useImperativeHandle(ref, () => ({
        referenceCard,
        resetFilters,
        clearReference,
        toggleFilters,
    }));

    return (
        <StyledAppBar position="sticky" sx={{margin: '0.2rem 0'}}>
            <Toolbar disableGutters>
                <TextField
                    label="Card Name"
                    variant="outlined"
                    value={cardName}
                    onChange={handleCardNameChange}
                    fullWidth
                />
                <TextField sx={{marginLeft: '0.4rem'}}
                    label="Effects"
                    variant="outlined"
                    value={cardEffects}
                    onChange={handleCardEffectsChange}
                    fullWidth
                />
                <FormControl fullWidth sx={{marginLeft: '0.4rem'}}>
                    <InputLabel id="references-label">References</InputLabel>
                    <Select
                        labelId="references-selector-label"
                        value={referenceId}
                        label="References"
                        onChange={handleReferenceIdChange}
                    >
                        <MenuItem key={'none'} value={''}>–</MenuItem>
                        {cards.map(card => (
                            <MenuItem key={card.cardId} value={card.cardId.toString()}>{normalizeName(card.cardName)}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{marginLeft: '0.4rem'}}>
                    <InputLabel id="expansion-label">Expansion</InputLabel>
                    <Select
                        labelId="expansion-selector-label"
                        value={expansionId}
                        label="Expansion"
                        onChange={handleExpansionChange}
                    >
                        <MenuItem key={'none'} value={''}>–</MenuItem>
                        {expansions
                            .sort((expansionA, expansionB) => expansionA.name.localeCompare(expansionB.name))
                            .map(expansion => (
                            <MenuItem key={expansion.id} value={expansion.id}>{expansion.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setModalOpen(true)}
                    sx={{ marginLeft: '0.6rem', borderRadius: '1rem', padding: '0.2rem' }}
                >
                    Filters
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={resetFilters}
                    disabled={
                        !cardName && !cardEffects && !referenceId && !cardClass && !cardType && !cardSubtype && !cardSupertype && !expansionId
                        && !sortOrder && !sortBy && !levelOperation && !atkOperation && !defOperation && !isAce && !ownerId
                    }
                    sx={{ marginLeft: '0.6rem', borderRadius: '1rem', padding: '0.2rem' }}
                >
                    Reset
                </Button>
                <FiltersModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}
                              cardOwners={cardOwners}
                              cardClass={cardClass} handleCardClassChange={handleCardClassChange}
                              cardType={cardType} handleCardTypeChange={handleCardTypeChange}
                              cardSubtype={cardSubtype} handleCardSubtypeChange={handleCardSubtypeChange}
                              cardSupertype={cardSupertype} handleCardSupertypeChange={handleCardSupertypeChange}
                              sortOrder={sortOrder} handleSortOrderChange={handleSortOrderChange}
                              sortBy={sortBy} handleSortByChange={handleSortByChange}
                              level={level as number} handleLevelChange={handleLevelChange}
                              levelOperation={levelOperation} handleLevelOperationChange={handleLevelOperationChange}
                              atk={atk as number} handleAtkChange={handleAtkChange}
                              atkOperation={atkOperation} handleAtkOperationChange={handleAtkOperationChange}
                              def={def as number} handleDefChange={handleDefChange}
                              defOperation={defOperation} handleDefOperationChange={handleDefOperationChange}
                              isAce={isAce as boolean} handleIsAceChange={handleIsAceChange}
                              ownerId={ownerId} handleOwnerIdChange={handleOwnerIdChange}
                />
            </Toolbar>
        </StyledAppBar>
    );
});

export default CardFilters;
