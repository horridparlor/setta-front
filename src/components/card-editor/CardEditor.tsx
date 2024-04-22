import React, { useState, useRef } from 'react';
import CardPreviewer from './card-previewer/CardPreviewer';
import RightPanelSettings from './RightPanelSettings';
import html2canvas from 'html2canvas';
import {Box, Card} from "@mui/material";
import {CardClass, CardData, CardSubtype, CardType} from "../../types/card";
import {CardMainFrameColor} from "../../types/color";

const CardEditor: React.FC = () => {
    const [cardData, setCardData] = useState<CardData>({
        cardName: '',
        cardClass: CardClass.ABYSS,
        cardType: CardType.MONSTER,
        subtype: CardSubtype.NONE,
        level: 1,
        atk: 0,
        def: 0,
        effectText: ''
    });

    const cardRef = useRef<HTMLDivElement>(null);

    const handleCardDataChange = (field: keyof CardData, value: string | number) => {
        setCardData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleExport = async () => {
        if (cardRef.current && cardRef.current.parentNode) {
            const wrapper = document.createElement('div');
            wrapper.style.backgroundColor = CardMainFrameColor.FRAME;
            wrapper.style.padding = '2.5rem';

            const parent = cardRef.current.parentNode;
            parent.insertBefore(wrapper, cardRef.current);
            wrapper.appendChild(cardRef.current);

            const canvas = await html2canvas(wrapper, {
                scale: 2,
                backgroundColor: CardMainFrameColor.FRAME,
                useCORS: true,
            });

            if (parent) {
                parent.insertBefore(cardRef.current, wrapper);
            }
            wrapper.remove();

            const image = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
            const link = document.createElement('a');
            link.href = image;
            link.download = 'card.png';
            link.click();
        }
    };


    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', margin: '20px' }}>
            <Box sx={{ marginRight: '2rem' }}>
                <CardPreviewer cardData={cardData} cardRef={cardRef} scale={1}/>
            </Box>
            <RightPanelSettings cardData={cardData} onCardDataChange={handleCardDataChange} onExport={handleExport} />
        </Box>
    );
};

export default CardEditor;
