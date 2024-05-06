import React from 'react';
import { Card, Box, Typography } from '@mui/material';
import useCards from "../../hooks/useCards";
import CardPreviewer from "../card-editor/card-previewer/CardPreviewer";

interface CardCatalogueProps {
}

const CardCatalogue: React.FC<CardCatalogueProps> = ({ }) => {
    const { cards } = useCards();
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
            {Object.values(cards).map((cardData, index) => (
                <CardPreviewer cardData={cardData} scale={0.8}/>
            ))}
        </Box>
    );
};

export default CardCatalogue;
