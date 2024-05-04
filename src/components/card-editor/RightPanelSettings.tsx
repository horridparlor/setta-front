import React from 'react';
import {
    Box,
    Button,
    Card,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField
} from '@mui/material';
import {CardClass, CardData, CardSubtype, CardType} from "../../types/card";

interface RightPanelSettingsProps {
    cardData: CardData;
    onCardDataChange: (field: keyof CardData, value: string | number) => void;
    onExport: () => void;
}

const RightPanelSettings: React.FC<RightPanelSettingsProps> = ({
                                                                   cardData,
                                                                   onCardDataChange,
                                                                   onExport
                                                               }) => {
    const handleSelectChange = (field: keyof CardData) =>
        (event: SelectChangeEvent<string>) => {
            if (field === 'cardType') {
                onCardDataChange('subtype', event.target.value === CardType.MONSTER ? CardSubtype.EFFECT : CardSubtype.NORMAL);
            }
            onCardDataChange(field, event.target.value as any);
        };

    const handleInputChange = (field: keyof CardData) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            if (value === "") {
                onCardDataChange(field, "");
            } else {
                onCardDataChange(field, isNaN(+value) ? value : +value);
            }
        };

    const getActiveSubtypes = () => {
        switch (cardData.cardType) {
            case CardType.MONSTER:
                return [CardSubtype.NORMAL, CardSubtype.EFFECT, CardSubtype.FUSION, CardSubtype.REVENGE, CardSubtype.ROYAL];
            case CardType.SPELL:
                return [CardSubtype.NORMAL];
            case CardType.TRAP:
                return [CardSubtype.NORMAL, CardSubtype.RITUAL];
        }
    }

    return (
        <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
            <TextField
                fullWidth
                label="Card Name"
                variant="outlined"
                value={cardData.cardName}
                onChange={handleInputChange('cardName')}
                sx={{ marginBottom: 2 }}
            />
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
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
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
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
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
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
            <TextField
                fullWidth
                type="number"
                label="Level"
                variant="outlined"
                value={cardData.level}
                onChange={handleInputChange('level')}
                inputProps={{ min: 1, max: 9 }}
                sx={{ marginBottom: 2 }}
            />
            <TextField
                fullWidth
                type="number"
                label="Attack"
                variant="outlined"
                value={cardData.atk}
                onChange={handleInputChange('atk')}
                inputProps={{ min: 0, max: 2600, step: 100 }}
                sx={{ marginBottom: 2 }}
            />
            <TextField
                fullWidth
                type="number"
                label="Defense"
                variant="outlined"
                value={cardData.def}
                onChange={handleInputChange('def')}
                inputProps={{ min: 0, max: 2500, step: 100 }}
                sx={{ marginBottom: 2 }}
            />
            <TextField
                fullWidth
                label="Effect Text"
                variant="outlined"
                multiline
                rows={5}
                value={cardData.effectText}
                onChange={handleInputChange('effectText')}
                sx={{ marginBottom: 2 }}
            />
            <Button onClick={onExport} variant="contained" color="primary">
                Export as PNG
            </Button>
        </Box>
    );
};

export default RightPanelSettings;
