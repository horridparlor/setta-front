import React, {ChangeEvent} from 'react';
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
    BACKROW_CARD_TYPES, canEditCard,
    CardClass,
    CardData,
    CardSubtype,
    CardSupertype,
    CardType, combineEffectsTexts, DefaultTextSize,
    EXTRA_DECK_SUBTYPES,
    getSubtypeOptions,
    getSupertypeOptions,
    hasCostText,
    hasEffectText,
    hasFlavourText,
    isExtraDeckCard, isRitual,
    MaximumPiece, MONSTER_CARD_TYPES
} from "../../types/card";
import {CardExpansion, EXPANSION_NO_OWNER} from "../../types/expansion";
import {normalizeName} from "../../utils/string";
import Cookies from "js-cookie";
import {getUserId} from "../../types/cookie";

interface RightPanelSettingsProps {
    cardData: CardData;
    expansions: Array<CardExpansion>;
    onCardDataChange: (field: keyof CardData, value: string | number) => void;
    onExport: () => void;
    onSave: () => void;
    onImageFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onDelete: () => void;
    onEncode: () => void;
    cards: Array<CardData>;
    canUpload: boolean;
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
}) => {
    const cardSelector = (source: Array<CardData> = cards) => {
        return [<MenuItem key='none' value=''>–</MenuItem>,
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
            switch (field) {
                case 'cardType':
                    onCardDataChange('subtype', value === CardType.MONSTER ? CardSubtype.EFFECT : CardSubtype.NORMAL);
                    onCardDataChange('supertype', CardSupertype.NONE);
                    onCardDataChange('flavourText', '');
                    onCardDataChange('primaryMaterialId', '');
                    onCardDataChange('secondaryMaterialId', '');
                    onCardDataChange('tertiaryMaterialId', '');
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
                        case CardSubtype.RITUAL:
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
                    disabled={cannotEdit()}
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
                        disabled={cannotEdit()}
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
                        disabled={cannotEdit()}
                    >
                        {getSubtypeOptions(cardData.cardType)}
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
                        {isRitual(cardData) ? monsterCardSelector() : cardSelector()}
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
                        {isRitual(cardData) ? backrowCardSelector() : cardSelector()}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ marginBottom: 2, display: !isRitual(cardData) ? 'flex' : 'none', }}>
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
                        {cardSelector()}

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
            <Box sx={{...rowContainerStyle, marginBottom: 0}}>
                <Button onClick={onSave} variant="contained" color="primary" disabled={cannotEdit() || cardData.cardName.length === 0}>
                    Save
                </Button>
                <Button onClick={onExport} variant="contained" color="secondary" disabled={cardData.cardName.length === 0}>
                    Export as PNG
                </Button>
                <Button variant="contained" color="info" component="label" disabled={cannotEdit()}>
                    Upload Image
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={onImageFileChange}
                    />
                </Button>
                <Button onClick={onEncode} variant="contained" color="secondary" disabled={cannotEdit() || combineEffectsTexts(cardData).length === 0}>
                    ENCODE
                </Button>
                <Button onClick={onDelete} variant="contained" color="error" disabled={cannotEdit() || cardData.cardId === 0}>
                    Delete
                </Button>
            </Box>
        </Box>
    );
};

export default RightPanelSettings;
