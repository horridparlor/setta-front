import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import CardPreviewer from './card-previewer/CardPreviewer';
import RightPanelSettings from './RightPanelSettings';
import domtoimage from 'dom-to-image';
import {Box} from "@mui/material";
import {CardData, DEFAULT_CARD_DATA} from "../../types/card";
import {CardMainFrameColor} from "../../types/color";
import {toast} from "react-toastify";
import {AdminEndpoint, getAdminEndpoint, RequestMethod} from "../../types/api";
import useExpansions from "../../hooks/useExpansions";

interface CardEditorProps {
    closeUpdate: () => void;
    cards: Array<CardData>;
}

export interface CardEditorRef {
    setCardData: (cardData: CardData) => void;
}

const CardEditor = forwardRef<CardEditorRef, CardEditorProps>(({closeUpdate, cards}, ref) => {
    const { expansions } = useExpansions();
    const [cardData, setCardData] = useState<CardData>(DEFAULT_CARD_DATA);

    const cardRef = useRef<HTMLDivElement>(null);

    const handleCardDataChange = (field: keyof CardData, value: string | number) => {
        setCardData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        const url = getAdminEndpoint(AdminEndpoint.CARD);
        const method = cardData.cardId ? RequestMethod.PUT : RequestMethod.POST;
        const body = JSON.stringify(cardData);

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });
            if (!response.ok) {
                toast.error('Network error');
            }
            const responseData = await response.json();
            const cardId = responseData.cardId;
            setCardData(cardData => ({
                ...cardData,
                cardId: cardId
            }));
            toast.success(`Card ${method === 'POST' ? `created` : `updated`}: ${cardData.cardName}`);
            closeUpdate();
        } catch (error) {
            toast.error('Failed to save card: ' + error);
        }
    }

    const handleDelete = async () => {
        const url = getAdminEndpoint(AdminEndpoint.CARD);
        const method = RequestMethod.DELETE;
        const body = JSON.stringify({
            'cardId': cardData.cardId
        });

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });
            if (!response.ok) {
                toast.error('Network error');
            }
            await response.json();
            toast.success(`Card deleted: ${cardData.cardName}`);
            closeUpdate();
        } catch (error) {
            toast.error('Failed to delete card: ' + error);
        }
    }

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
                closeUpdate();
            } catch (err) {
                console.error('oops, something went wrong!', err);
            }
        }
    };

    useImperativeHandle(ref, () => ({
        setCardData
    }));

    return (
        <Box ref={ref} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', margin: '20px' }}>
            <Box sx={{ marginRight: '2rem' }}>
                <CardPreviewer cards={cards} cardData={cardData} cardRef={cardRef} scale={1}/>
            </Box>
            <RightPanelSettings cards={cards} cardData={cardData} expansions={expansions}
                                onCardDataChange={handleCardDataChange} onExport={handleExport}
                                onSave={handleSave} onDelete={handleDelete} />
        </Box>
    );
});

export default CardEditor;
