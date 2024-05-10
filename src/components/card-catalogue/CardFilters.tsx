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
import {CardClass, CardData, CardSubtype, CardSupertype, CardType} from "../../types/card";
import {CardExpansion} from "../../types/expansion";
import Button from "@mui/material/Button";
import {normalizeName} from "../../utils/string";
import {toast} from "react-toastify";
import Cookies from "js-cookie";

interface CardFiltersProps extends React.RefAttributes<CardFiltersRef> {
    onFilterChange: (filters: { cardName: string, cardEffects: string, referenceId: string, cardClass: string,
        cardType: string, cardSubtype: string, cardSupertype: string, expansionId: string }) => void;
    expansions: Array<CardExpansion>;
    cards: Array<CardData>;
}

export interface CardFiltersRef {
    referenceCard: (cardData: CardData) => void;
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: 'white',
    boxShadow: theme.shadows[4],
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    zIndex: theme.zIndex.appBar,
}));

const CardFilters: React.FC<CardFiltersProps> = forwardRef<CardFiltersRef, CardFiltersProps>(({onFilterChange, expansions, cards}, ref) => {
    const loadFiltersFromCookies = () => {
        return {
            cardName: Cookies.get('cardName') || '',
            cardEffects: Cookies.get('cardEffects') || '',
            referenceId: Cookies.get('referenceId') || '',
            cardClass: Cookies.get('cardClass') || '',
            cardType: Cookies.get('cardType') || '',
            cardSubtype: Cookies.get('cardSubtype') || '',
            cardSupertype: Cookies.get('cardSupertype') || '',
            expansionId: Cookies.get('expansionId') || ''
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

    const getFilters = () => {
        return {
            cardName, cardEffects, referenceId, cardClass, cardType, cardSubtype, cardSupertype, expansionId
        }
    }

    const getEmptyFilters = () => {
        return {
            cardName: '', cardEffects: '', referenceId: '', cardClass: '', cardType: '', cardSubtype: '', cardSupertype: '', expansionId: ''
        };
    }

    useEffect(() => {
        onFilterChange({
            cardName, cardEffects, referenceId, cardClass, cardType, cardSubtype, cardSupertype, expansionId
        });
    }, [cardName, cardEffects, referenceId, cardClass, cardType, cardSubtype, cardSupertype, expansionId]);

    const referenceCard = (cardData: CardData) => {
        const cardId = cardData.cardId.toString();
        const value = referenceId === cardId ? '' : cardId;
        if (value === cardId) {
            toast.info('References to card: ' + normalizeName(cardData.cardName));
        }
        resetFilters();
        setReferenceId(value);
        onFilterChange({ ...getEmptyFilters(), referenceId: value });
    }
    const handleCardNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setCardName(value);
        Cookies.set('cardName', value);
    };

    const handleCardClassChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setCardClass(value);
        Cookies.set('cardClass', value);
    };

    const handleCardTypeChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setCardType(value);
        Cookies.set('cardType', value);
    };

    const handleCardSubtypeChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setCardSubtype(value);
        Cookies.set('cardSubtype', value);
    };

    const handleCardSupertypeChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setCardSupertype(value);
        Cookies.set('cardSupertype', value);
    };

    const handleExpansionChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setExpansionId(value);
        Cookies.set('expansionId', value);
    };

    const handleCardEffectsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value: string = event.target.value;
        setCardEffects(value);
        Cookies.set('cardEffects', value);
    };

    const handleReferenceIdChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setReferenceId(value);
        Cookies.set('referenceId', value);
    };

    const resetFilters = () => {
        setCardName('');
        Cookies.remove('cardName');
        setCardEffects('');
        Cookies.remove('cardEffects');
        setReferenceId('');
        Cookies.remove('referenceId');
        setCardClass('');
        Cookies.remove('cardClass');
        setCardType('');
        Cookies.remove('cardType');
        setCardSubtype('');
        Cookies.remove('cardSubtype');
        setCardSupertype('');
        Cookies.remove('cardSupertype');
        setExpansionId('');
        Cookies.remove('expansionId');
        onFilterChange(getEmptyFilters());
    };

    useImperativeHandle(ref, () => ({
        referenceCard
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
                    <InputLabel id="card-type-selector-label">Card Type</InputLabel>
                    <Select
                        labelId="card-type-selector-label"
                        value={cardType}
                        label="Card Type"
                        onChange={handleCardTypeChange}
                    >
                        <MenuItem key={'none'} value={''}>–</MenuItem>
                        {Object.values(CardType).map(c => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{marginLeft: '0.4rem'}}>
                    <InputLabel id="card-subtype-selector-label">Subtype</InputLabel>
                    <Select
                        labelId="card-subtype-selector-label"
                        value={cardSubtype}
                        label="Subtype"
                        onChange={handleCardSubtypeChange}
                    >
                        <MenuItem key={'none'} value={''}>–</MenuItem>
                        {Object.values(CardSubtype).map(c => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{marginLeft: '0.4rem'}}>
                    <InputLabel id="card-supertype-selector-label">Supertype</InputLabel>
                    <Select
                        labelId="card-supertype-selector-label"
                        value={cardSupertype}
                        label="Supertype"
                        onChange={handleCardSupertypeChange}
                    >
                        <MenuItem key={'none'} value={''}>–</MenuItem>
                        {Object.values(CardSupertype).map(c => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{marginLeft: '0.4rem'}}>
                    <InputLabel id="class-selector-label">Class</InputLabel>
                    <Select
                        labelId="class-selector-label"
                        value={cardClass}
                        label="Class"
                        onChange={handleCardClassChange}
                    >
                        <MenuItem key={'none'} value={''}>–</MenuItem>
                        {Object.values(CardClass).map(c => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
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
                    onClick={resetFilters}
                    disabled={!cardName && !cardEffects && !referenceId && !cardClass && !cardType && !cardSubtype && !cardSupertype && !expansionId}
                    sx={{ marginLeft: '0.6rem', borderRadius: '1rem', padding: '0.2rem' }}
                >
                    Reset
                </Button>
            </Toolbar>
        </StyledAppBar>
    );
});

export default CardFilters;
