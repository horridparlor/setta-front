import React from 'react';
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
    TextField
} from '@mui/material';
import {
    CardClass,
    CardData,
    CardSubtype,
    CardSupertype,
    CardType,
    hasCostText,
    hasEffectText,
    hasFlavourText,
    isExtraDeckCard,
    MaximumPiece
} from "../../types/card";
import {CardExpansion} from "../../types/expansion";

interface RightPanelSettingsProps {
    cardData: CardData;
    expansions: {[key: number]: CardExpansion};
    onCardDataChange: (field: keyof CardData, value: string | number) => void;
    onExport: () => void;
    onSave: () => void;
}

const RightPanelSettings: React.FC<RightPanelSettingsProps> = ({
    cardData,
    expansions,
    onCardDataChange,
    onExport,
    onSave,
}) => {
    const handleSelectChange = (field: keyof CardData) =>
        (event: SelectChangeEvent<string>) => {
            const value = event.target.value;
            switch (field) {
                case 'cardType':
                    onCardDataChange('subtype', value === CardType.MONSTER ? CardSubtype.EFFECT : CardSubtype.NORMAL);
                    onCardDataChange('supertype', CardSupertype.NONE);
                    onCardDataChange('flavourText', '');
                    break;
                case 'subtype':
                    if (value === CardSubtype.EFFECT) {
                        onCardDataChange('flavourText', '');
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
            }
            onCardDataChange(field, event.target.value as any);
        };

    const handleInputChange = (field: keyof CardData) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
            if (value === "") {
                onCardDataChange(field, "");
            } else {
                onCardDataChange(field, typeof value === 'boolean' ? (value ? 1 : 0) : (isNaN(+value) ? value : +value));
            }
            switch (field) {
                case "costText":
                    if (cardData.cardType === CardType.MONSTER && cardData.subtype !== CardSubtype.NORMAL) {
                        onCardDataChange('flavourText', '');
                    }
                    break;
            }
        };

    const getActiveSubtypes = () => {
        switch (cardData.cardType) {
            case CardType.MONSTER:
                return [CardSubtype.NORMAL, CardSubtype.EFFECT,
                    CardSubtype.FUSION, CardSubtype.REVENGE, CardSubtype.ROYAL, CardSubtype.TIME_TRAVELLER];
            case CardType.SPELL:
                return [CardSubtype.NORMAL];
            case CardType.TRAP:
                return [CardSubtype.NORMAL, CardSubtype.RITUAL];
        }
    }

    const getActiveSupertypes = () => {
        switch (cardData.subtype) {
            case CardSubtype.NORMAL:
                return [CardSupertype.NONE, CardSupertype.HAND_TRAP, CardSupertype.PENDULUM];
            case CardSubtype.EFFECT:
                return [CardSupertype.NONE, CardSupertype.MAXIMUM];
            default:
                return [CardSupertype.NONE];
        }
    }

    const rowContainerStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginBottom: 2,
        display: 'flex',
    }

    return (
        <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
            <Box
                sx={rowContainerStyle}
            >
                <TextField
                    fullWidth
                    label="Card Name"
                    variant="outlined"
                    value={cardData.cardName}
                    onChange={handleInputChange('cardName')}
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
                    >
                        {Object.values(MaximumPiece).map(c => (
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
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={cardData.isAce}
                            onChange={handleInputChange('isAce')}
                            name="isAce"
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
                    inputProps={{ min: 0, max: 20 }}
                />
                <TextField
                    fullWidth
                    type="number"
                    label="X Offset"
                    variant="outlined"
                    value={cardData.artXOffset}
                    onChange={handleInputChange('artXOffset')}
                    inputProps={{ min: 0, max: 50 }}
                />
                <TextField
                    fullWidth
                    type="number"
                    label="Y Offset"
                    variant="outlined"
                    value={cardData.artYOffset}
                    onChange={handleInputChange('artYOffset')}
                    inputProps={{ min: 0, max: 50 }}
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
                        >
                            {Object.values(CardClass).map(c => (
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
                    >
                        {Object.values(CardType).map(t => (
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
                    >
                        {Object.values(CardSubtype).filter(s => getActiveSubtypes().includes(s)).map(s => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{ display: cardData.cardType === CardType.MONSTER &&
                    [CardSubtype.NORMAL, CardSubtype.EFFECT].includes(cardData.subtype) ? 'inline' : 'none' }}>
                    <FormControl fullWidth>
                        <InputLabel id="supertype-selector-label">Supertype</InputLabel>
                        <Select
                            labelId="supertype-selector-label"
                            value={cardData.supertype}
                            label="Supertype"
                            onChange={handleSelectChange('supertype')}
                        >
                            {Object.values(CardSupertype).filter(s => getActiveSupertypes().includes(s)).map(c => (
                                <MenuItem key={c} value={c}>{c}</MenuItem>
                            ))}
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
                />
                <TextField
                    fullWidth
                    type="number"
                    label="Attack"
                    variant="outlined"
                    value={cardData.atk}
                    onChange={handleInputChange('atk')}
                    inputProps={{ min: 0, max: 2600, step: 100 }}
                />
                <TextField
                    fullWidth
                    type="number"
                    label="Defense"
                    variant="outlined"
                    value={cardData.def}
                    onChange={handleInputChange('def')}
                    inputProps={{ min: 0, max: 2500, step: 100 }}
                />
            </Box>

            <Box
                sx={{
                    ...rowContainerStyle,
                    display: isExtraDeckCard(cardData) ? 'flex' : 'none',
                }}
            >
                <TextField
                    fullWidth
                    label="Primary Material"
                    variant="outlined"
                    value={cardData.primaryMaterial}
                    onChange={handleInputChange('primaryMaterial')}
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    fullWidth
                    label="Secondary Material"
                    variant="outlined"
                    value={cardData.secondaryMaterial}
                    onChange={handleInputChange('secondaryMaterial')}
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    fullWidth
                    label="Tertiary Material"
                    variant="outlined"
                    value={cardData.tertiaryMaterial}
                    onChange={handleInputChange('tertiaryMaterial')}
                    sx={{
                        display: cardData.subtype === CardSubtype.RITUAL || cardData.secondaryMaterial.length === 0 ? 'none' : 'flex',
                        marginBottom: 2
                    }}
                />
            </Box>
            <TextField
                fullWidth
                label="Cost Text"
                variant="outlined"
                multiline
                rows={2}
                value={cardData.costText}
                onChange={handleInputChange('costText')}
                sx={{
                    display: hasCostText(cardData) ? 'flex' : 'none',
                    marginBottom: 2
                }}
            />
            <TextField
                fullWidth
                label="Effect Text"
                variant="outlined"
                multiline
                rows={2}
                value={cardData.effectText}
                onChange={handleInputChange('effectText')}
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
                sx={{
                    display: hasFlavourText(cardData) ? 'flex' : 'none',
                    marginBottom: 2
                }}
            />
            <Box
                sx={rowContainerStyle}
            >
                <TextField
                    fullWidth
                    label="Counts as"
                    variant="outlined"
                    value={cardData.countsAs}
                    onChange={handleInputChange('countsAs')}
                />
                <TextField
                    type="number"
                    label="Materials Size"
                    variant="outlined"
                    value={cardData.materialsSize}
                    onChange={handleInputChange('materialsSize')}
                    inputProps={{ min: 1, max: 5 }}
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
                    sx={{ minWidth: '8rem' }}
                />
                <FormControl fullWidth>
                    <InputLabel id="expansion-selector-label">Expansion</InputLabel>
                    <Select
                        labelId="expansion-selector-label"
                        value={cardData.expansionId.toString()}
                        label="Expansion"
                        onChange={handleSelectChange('expansionId')}
                    >
                        {Object.entries(expansions)
                            .sort(([aId, aExpansion], [bId, bExpansion]) => aExpansion.name.localeCompare(bExpansion.name))
                            .map(([id, expansion]) => (
                                <MenuItem key={id} value={id}>{expansion.name}</MenuItem>
                        ))}

                    </Select>
                </FormControl>
            </Box>
            <Box sx={{...rowContainerStyle, marginBottom: 0}}>
                <Button onClick={onSave} variant="contained" color="primary" disabled={cardData.cardName.length === 0}>
                    Save
                </Button>
                <Button onClick={onExport} variant="contained" color="secondary">
                    Export as PNG
                </Button>
            </Box>
        </Box>
    );
};

export default RightPanelSettings;
