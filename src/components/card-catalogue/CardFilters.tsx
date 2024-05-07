import React, { useState } from 'react';
import {
    AppBar,
    TextField,
    Toolbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent, // Import SelectChangeEvent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {CardClass, CardData, CardType} from "../../types/card";
import {CardExpansion} from "../../types/expansion";
import Button from "@mui/material/Button";

interface CardFiltersProps {
    onFilterChange: (filters: { cardName: string, cardEffects: string, referenceId: string, cardClass: string,
        cardType: string, expansionId: string }) => void;
    expansions: Array<CardExpansion>;
    cards: Array<CardData>;
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: 'white',
    boxShadow: theme.shadows[4],
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    zIndex: theme.zIndex.appBar,
}));

const CardFilters: React.FC<CardFiltersProps> = ({ onFilterChange, cards, expansions }) => {
    const [cardName, setCardName] = useState('');
    const [cardEffects, setCardEffects] = useState('');
    const [referenceId, setReferenceId] = useState('');
    const [cardClass, setCardClass] = useState('');
    const [cardType, setCardType] = useState('');
    const [expansionId, setExpansionId] = useState('');

    const handleCardNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setCardName(value);
        onFilterChange({ cardName: value, cardEffects, referenceId, cardClass, cardType, expansionId });
    };

    const handleCardClassChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setCardClass(value);
        onFilterChange({ cardName, cardEffects, referenceId, cardClass: value, cardType, expansionId });
    };

    const handleCardTypeChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setCardType(value);
        onFilterChange({ cardName, cardEffects, referenceId, cardClass, cardType: value, expansionId });
    };

    const handleExpansionChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setExpansionId(value);
        onFilterChange({ cardName, cardEffects, referenceId, cardClass, cardType, expansionId: value });
    };

    const handleCardEffectsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value: string = event.target.value;
        setCardEffects(value);
        onFilterChange({ cardName, cardEffects: value, referenceId, cardClass, cardType, expansionId });
    };

    const handleReferenceIdChange = (event: SelectChangeEvent<string>) => {
        const value: string = event.target.value;
        setReferenceId(value);
        onFilterChange({ cardName, cardEffects, referenceId: value, cardClass, cardType, expansionId });
    };

    const resetFilters = () => {
        setCardName('');
        setCardEffects('');
        setReferenceId('');
        setCardClass('');
        setCardType('');
        setExpansionId('');
        onFilterChange({ cardName: '', cardEffects: '', referenceId: '', cardClass: '', cardType: '', expansionId: '' });
    };

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
                            <MenuItem key={card.cardId} value={card.cardId}>{card.cardName}</MenuItem>
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
                    disabled={!cardName && !cardEffects && !referenceId && !cardClass && !cardType && !expansionId}
                    sx={{ marginLeft: '0.6rem', borderRadius: '1rem', padding: '0.2rem' }}
                >
                    Reset
                </Button>
            </Toolbar>
        </StyledAppBar>
    );
};

export default CardFilters;
