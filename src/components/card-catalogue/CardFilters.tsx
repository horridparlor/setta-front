import React, {forwardRef, useImperativeHandle, useState} from 'react';
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

interface CardFiltersProps extends React.RefAttributes<CardFiltersRef> {
    onFilterChange: (filters: { cardName: string, cardEffects: string, referenceId: string, cardClass: string,
        cardType: string, cardSubtype: string, cardSupertype: string, expansionId: string }) => void;
    expansions: Array<CardExpansion>;
    cards: Array<CardData>;
}

export interface CardFiltersRef {
    referenceCard: (cardId: string) => void;
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: 'white',
    boxShadow: theme.shadows[4],
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    zIndex: theme.zIndex.appBar,
}));

const CardFilters: React.FC<CardFiltersProps> = forwardRef<CardFiltersRef, CardFiltersProps>(({onFilterChange, expansions, cards}, ref) => {
    const [cardName, setCardName] = useState('');
    const [cardEffects, setCardEffects] = useState('');
    const [referenceId, setReferenceId] = useState('');
    const [cardClass, setCardClass] = useState('');
    const [cardType, setCardType] = useState('');
    const [cardSubtype, setCardSubtype] = useState('');
    const [cardSupertype, setCardSupertype] = useState('');
    const [expansionId, setExpansionId] = useState('');

    const getFilters = () => {
        return {
            cardName, cardEffects, referenceId, cardClass, cardType, cardSubtype, cardSupertype, expansionId
        }
    }

    const referenceCard = (cardId: string) => {
        const value = referenceId == cardId ? '' : cardId;
        setReferenceId(value);
        onFilterChange({ ...getFilters(), referenceId: value });
    }
    const handleCardNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setCardName(value);
        onFilterChange({ ...getFilters(), cardName: value });
    };

    const handleCardClassChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setCardClass(value);
        onFilterChange({ ...getFilters(), cardClass: value });
    };

    const handleCardTypeChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setCardType(value);
        onFilterChange({ ...getFilters(), cardType: value });
    };

    const handleCardSubtypeChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setCardSubtype(value);
        onFilterChange({ ...getFilters(), cardSubtype: value });
    };

    const handleCardSupertypeChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setCardSupertype(value);
        onFilterChange({ ...getFilters(), cardSupertype: value });
    };

    const handleExpansionChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setExpansionId(value);
        onFilterChange({ ...getFilters(), expansionId: value });
    };

    const handleCardEffectsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value: string = event.target.value;
        setCardEffects(value);
        onFilterChange({ ...getFilters(), cardEffects: value });
    };

    const handleReferenceIdChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setReferenceId(value);
        onFilterChange({ ...getFilters(), referenceId: value });
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
        onFilterChange({ cardName: '', cardEffects: '', referenceId: '', cardClass: '', cardType: '', cardSubtype: '', cardSupertype: '', expansionId: '' });
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
