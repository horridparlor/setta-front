import React, {useRef, useState} from 'react';
import CardPreviewer from './card-previewer/CardPreviewer';
import RightPanelSettings from './RightPanelSettings';
import domtoimage from 'dom-to-image';
import {Box} from "@mui/material";
import {CardClass, CardData, CardSubtype, CardSupertype, CardType, MaximumPiece} from "../../types/card";
import {CardMainFrameColor} from "../../types/color";

const CardEditor: React.FC = () => {
    const [cardData, setCardData] = useState<CardData>({
        cardName: '',
        isAce: false,
        cardClass: CardClass.ABYSS,
        cardType: CardType.MONSTER,
        subtype: CardSubtype.FUSION,
        supertype: CardSupertype.NONE,
        maximumPiece: MaximumPiece.NONE,
        level: 1,
        atk: 0,
        def: 0,
        primaryMaterial: '',
        secondaryMaterial: '',
        tertiaryMaterial: '',
        costText: '',
        effectText: '',
        flavourText: '',
        countsAs: '',
        artScale: 1,
        artXOffset: 0,
        artYOffset: 0,
        nameSize: 4,
        materialsSize: 5,
        effectsSize: 5,
        expansionId: 1,
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
            wrapper.style.padding = '2rem';

            const parent = cardRef.current.parentNode;
            parent.insertBefore(wrapper, cardRef.current);
            wrapper.appendChild(cardRef.current);

            try {
                const dataUrl = await domtoimage.toPng(wrapper, {
                    height: wrapper.offsetHeight * 2,
                    width: wrapper.offsetWidth * 2,
                    style: {
                        transform: 'scale(2)',
                        transformOrigin: 'top left',
                        width: `${wrapper.offsetWidth}px`,
                        height: `${wrapper.offsetHeight}px`
                    }
                });

                if (parent) {
                    parent.insertBefore(cardRef.current, wrapper);
                }
                wrapper.remove();

                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = cardData.cardName + '.png';
                link.click();
            } catch (err) {
                console.error('oops, something went wrong!', err);
            }
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
