import React from 'react';
import { CardData } from '../../types/card';
import { Card, Box, Typography } from '@mui/material';

interface CardCatalogueProps {
    cards: { [key: string]: CardData };
}

const CardCatalogue: React.FC<CardCatalogueProps> = ({ cards }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                overflowX: 'scroll',
                padding: 2,
                gap: 2
            }}
        >
            {Object.values(cards).map((card, index) => (
                <Card
                    key={index}
                    sx={{
                        minWidth: 200,
                        backgroundColor: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 250,
                        padding: 1
                    }}
                >
                    <Typography variant="h6" component="h2">
                        {card.cardName}
                    </Typography>
                    <Typography variant="body2">{card.cardClass}</Typography>
                    <Typography variant="body2">{card.cardType} - {card.subtype}</Typography>
                    {card.level && <Typography variant="body2">Level: {card.level}</Typography>}
                    {card.atk !== null && <Typography variant="body2">ATK: {card.atk}</Typography>}
                    {card.def !== null && <Typography variant="body2">DEF: {card.def}</Typography>}
                    <Typography variant="caption" sx={{ textAlign: 'center' }}>
                        {card.effectText}
                    </Typography>
                </Card>
            ))}
        </Box>
    );
};

export default CardCatalogue;
