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
import {CardCatalogueCookie, PageCookie} from "../../types/cookie";
import {ComparisonType} from "../../types/filter";
import {CardOwner} from "../../types/user";
import {useLocation, useNavigate} from "react-router-dom";

interface CardFiltersProps extends React.RefAttributes<CardFiltersRef> {
    onFilterChange: (filters: { cardName: string, cardEffects: string, referenceId: string, cardClass: string,
        cardType: string, cardSubtype: string, cardSupertype: string, expansionId: string, sortOrder: string,
        sortBy: string, level: number, levelOperation: string, atk: number, atkOperation: string, def: number,
        defOperation: string, isAce: boolean, ownerId: string, isReleased: boolean, isErrata: boolean
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
    const navigate = useNavigate();
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const cookieParams = sessionStorage.getItem(PageCookie.CARD_CATALOGUE_FILTERS) || '';
    const params = urlParams.size ? urlParams : new URLSearchParams(cookieParams);
    const loadFiltersFromCookies = () => {
        return {
            cardName: params.get(CardCatalogueCookie.CARD_NAME) || '',
            cardEffects: params.get(CardCatalogueCookie.CARD_EFFECTS) || '',
            referenceId: params.get(CardCatalogueCookie.REFERENCE_ID) || '',
            cardClass: params.get(CardCatalogueCookie.CARD_CLASS) || '',
            cardType: params.get(CardCatalogueCookie.CARD_TYPE) || '',
            cardSubtype: params.get(CardCatalogueCookie.CARD_SUBTYPE) || '',
            cardSupertype: params.get(CardCatalogueCookie.CARD_SUPERTYPE) || '',
            expansionId: params.get(CardCatalogueCookie.EXPANSION_ID) || '',
            sortOrder: params.get(CardCatalogueCookie.SORT_ORDER) || '',
            sortBy: params.get(CardCatalogueCookie.SORT_BY) || '',
            level: params.get(CardCatalogueCookie.LEVEL) || 1,
            levelOperation: params.get(CardCatalogueCookie.LEVEL_OPERATION) || '',
            atk: params.get(CardCatalogueCookie.ATK) || 0,
            atkOperation: params.get(CardCatalogueCookie.ATK_OPERATION) || '',
            def: params.get(CardCatalogueCookie.DEF) || 0,
            defOperation: params.get(CardCatalogueCookie.DEF_OPERATION) || '',
            isAce: params.get(CardCatalogueCookie.IS_ACE) || false,
            ownerId: params.get(CardCatalogueCookie.OWNER_ID) || '',
            isReleased: params.get(CardCatalogueCookie.IS_RELEASED) || false,
            isErrata: params.get(CardCatalogueCookie.IS_ERRATA) || false,
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
    const [isReleased, setIsReleased] = useState(initialState.isReleased);
    const [isErrata, setIsErrata] = useState(initialState.isErrata);

    const [isModalOpen, setModalOpen] = useState(false);

    const getFilters = () => {
        return {
            cardName, cardEffects, referenceId, cardClass, cardType, cardSubtype, cardSupertype, expansionId, sortOrder, sortBy,
            level, levelOperation, atk, atkOperation, def, defOperation, isAce, ownerId, isReleased, isErrata
        }
    }

    const getEmptyFilters = () => {
        return {
            cardName: '', cardEffects: '', referenceId: '', cardClass: '',
            cardType: '', cardSubtype: '', cardSupertype: '', expansionId: '',
            sortOrder: '', sortBy: '', level: 1, levelOperation: '',
            atk: 0, atkOperation: '', def: 0, defOperation: '', isAce: false, ownerId: '',
            isReleased: false, isErrata: false
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
            atkOperation, def: makeInt(def), defOperation, isAce: (typeof isAce === 'boolean' ? isAce : isAce.toLowerCase() === "true"), ownerId,
            isReleased: (typeof isReleased === 'boolean' ? isReleased : isReleased.toLowerCase() === "true"),
            isErrata: (typeof isErrata === 'boolean' ? isErrata : isErrata.toLowerCase() === "true")
        });
    }, [cardName, cardEffects, referenceId, cardClass, cardType, cardSubtype,
        cardSupertype, expansionId, sortOrder, sortBy, level, levelOperation, atk,
        atkOperation, def, defOperation, isAce, ownerId, isReleased, isErrata]);

    const referenceCard = (cardData: CardData) => {
        const cardId = getPointerId(cardData).toString();
        const value = referenceId === cardId ? '' : cardId;
        if (value === cardId) {
            toast.info('References to card: ' + normalizeName(cardData.cardName));
        }
        setReferenceId(value);
        onFilterChange({ ...getEmptyFilters(), referenceId: value });
    }
    const updateNavigate = () => {
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
        sessionStorage.setItem(PageCookie.CARD_CATALOGUE_FILTERS, params.toString());
    }
    const handleCookieChange = (key : string, value: any) => {
        params.set(key, value);
        updateNavigate();
    }
    const removeCookie = (key : string) => {
        params.delete(key);
        updateNavigate();
    }
    const handleCardNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setCardName(value);
        handleCookieChange(CardCatalogueCookie.CARD_NAME, value);
    };

    const handleCardClassChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setCardClass(value);
        handleCookieChange(CardCatalogueCookie.CARD_CLASS, value);
    };

    const handleCardTypeChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setCardType(value);
        handleCookieChange(CardCatalogueCookie.CARD_TYPE, value);
    };

    const handleCardSubtypeChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setCardSubtype(value);
        handleCookieChange(CardCatalogueCookie.CARD_SUBTYPE, value);
    };

    const handleCardSupertypeChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setCardSupertype(value);
        handleCookieChange(CardCatalogueCookie.CARD_SUPERTYPE, value);
    };

    const handleExpansionChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setExpansionId(value);
        handleCookieChange(CardCatalogueCookie.EXPANSION_ID, value);
    };

    const handleCardEffectsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value: string = event.target.value;
        setCardEffects(value);
        handleCookieChange(CardCatalogueCookie.CARD_EFFECTS, value);
    };

    const handleReferenceIdChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setReferenceId(value);
        handleCookieChange(CardCatalogueCookie.REFERENCE_ID, value);
    };

    const handleSortOrderChange = (event: React.MouseEvent<HTMLElement>, value: string | null ) => {
        if (value === null) {
            value = sortOrder;
        }
        setSortOrder(value);
        handleCookieChange(CardCatalogueCookie.SORT_ORDER, value);
    };

    const handleSortByChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setSortBy(value);
        handleCookieChange(CardCatalogueCookie.SORT_BY, value);
    };

    const handleLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setLevel(value);
        if (levelOperation === '') {
            setLevelOperation(ComparisonType.EQUAL);
        }
        handleCookieChange(CardCatalogueCookie.LEVEL, value.toString());
    };
    const handleLevelOperationChange = (event: React.MouseEvent<HTMLElement>, value: string | null ) => {
        if (value === null) {
            value = '';
        }
        setLevelOperation(value);
        handleCookieChange(CardCatalogueCookie.LEVEL_OPERATION, value);
    };

    const handleAtkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setAtk(value);
        if (atkOperation === '') {
            setAtkOperation(ComparisonType.EQUAL);
        }
        handleCookieChange(CardCatalogueCookie.ATK, value.toString());
    };
    const handleAtkOperationChange = (event: React.MouseEvent<HTMLElement>, value: string | null ) => {
        if (value === null) {
            value = '';
        }
        setAtkOperation(value);
        handleCookieChange(CardCatalogueCookie.ATK_OPERATION, value);
    };

    const handleDefChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setDef(value);
        if (defOperation === '') {
            setDefOperation(ComparisonType.EQUAL);
        }
        handleCookieChange(CardCatalogueCookie.DEF, value.toString());
    };
    const handleDefOperationChange = (event: React.MouseEvent<HTMLElement>, value: string | null ) => {
        if (value === null) {
            value = '';
        }
        setDefOperation(value);
        handleCookieChange(CardCatalogueCookie.DEF_OPERATION, value);
    };

    const handleIsAceChange = (value: boolean) => {
        setIsAce(value);
        handleCookieChange(CardCatalogueCookie.IS_ACE, String(value));
    };

    const handleOwnerIdChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setOwnerId(value);
        handleCookieChange(CardCatalogueCookie.OWNER_ID, value);
    };

    const handleIsReleasedChange = (value: boolean) => {
        setIsReleased(value);
        handleCookieChange(CardCatalogueCookie.IS_RELEASED, String(value));
    };

    const handleIsErrataChange = (value: boolean) => {
        setIsErrata(value);
        handleCookieChange(CardCatalogueCookie.IS_ERRATA, String(value));
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
        setIsReleased(false);
        setIsErrata(false);

        onFilterChange(getEmptyFilters());
        resetFilterCookies();
    };

    const resetFilterCookies = () => {
        removeCookie(CardCatalogueCookie.CARD_NAME);
        removeCookie(CardCatalogueCookie.CARD_EFFECTS);
        removeCookie(CardCatalogueCookie.REFERENCE_ID);
        removeCookie(CardCatalogueCookie.CARD_CLASS);
        removeCookie(CardCatalogueCookie.CARD_TYPE);
        removeCookie(CardCatalogueCookie.CARD_SUBTYPE);
        removeCookie(CardCatalogueCookie.CARD_SUPERTYPE);
        removeCookie(CardCatalogueCookie.EXPANSION_ID);
        removeCookie(CardCatalogueCookie.SORT_ORDER);
        removeCookie(CardCatalogueCookie.SORT_BY);
        removeCookie(CardCatalogueCookie.LEVEL);
        removeCookie(CardCatalogueCookie.LEVEL_OPERATION);
        removeCookie(CardCatalogueCookie.ATK);
        removeCookie(CardCatalogueCookie.ATK_OPERATION);
        removeCookie(CardCatalogueCookie.DEF);
        removeCookie(CardCatalogueCookie.DEF_OPERATION);
        removeCookie(CardCatalogueCookie.IS_ACE);
        removeCookie(CardCatalogueCookie.OWNER_ID);
        removeCookie(CardCatalogueCookie.IS_RELEASED);
        removeCookie(CardCatalogueCookie.IS_ERRATA);
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
                              isAce={isAce === true || isAce === 'true'} handleIsAceChange={handleIsAceChange}
                              ownerId={ownerId} handleOwnerIdChange={handleOwnerIdChange}
                              isReleased={isReleased === true || isReleased === 'true'} handleIsReleasedChange={handleIsReleasedChange}
                              isErrata={isErrata === true || isErrata === 'true'} handleIsErrataChange={handleIsErrataChange}
                />
            </Toolbar>
        </StyledAppBar>
    );
});

export default CardFilters;
