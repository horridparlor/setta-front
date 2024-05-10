import React, {ChangeEvent, forwardRef, useImperativeHandle, useRef, useState} from 'react';
import CardPreviewer from './card-previewer/CardPreviewer';
import RightPanelSettings from './RightPanelSettings';
import domtoimage from 'dom-to-image';
import {Box} from "@mui/material";
import {CardData, DEFAULT_CARD_DATA, getOwnerId} from "../../types/card";
import {CardMainFrameColor} from "../../types/color";
import {toast} from "react-toastify";
import {AdminEndpoint, getAdminEndpoint, getHeaders, RequestMethod, showError} from "../../types/api";
import useExpansions from "../../hooks/useExpansions";
import {encodeEffectsString, normalizeName, serializeName} from "../../utils/string";
import {convertToBase64} from "../../types/files";
import axios from "axios";

interface CardEditorProps {
    closeUpdate: () => void;
    cards: Array<CardData>;
}

export interface CardEditorRef {
    setCard: (cardData: CardData) => void;
    handleSave: () => void;
    handleExport: () => void;
}

const CardEditor = forwardRef<CardEditorRef, CardEditorProps>(({closeUpdate, cards}, ref) => {
    const { expansions } = useExpansions();
    const [cardData, setCardData] = useState<CardData>(DEFAULT_CARD_DATA);
    const [imageFile, setImageFile] = useState<File | undefined>(undefined);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const cardRef = useRef<HTMLDivElement>(null);

    const handleCardDataChange = (field: keyof CardData, value: string | number) => {
        setCardData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        if (isSaving) {
            toast.info('Saving card... Please wait');
            return;
        }
        setIsSaving(true);
        await handleUploadImage();
        const url = getAdminEndpoint(AdminEndpoint.CARD);
        const method = cardData.cardId ? RequestMethod.PUT : RequestMethod.POST;
        const body = JSON.stringify({...cardData, serializedName: serializeName(cardData)});

        try {
            const response = await fetch(url, {
                method: method,
                headers: getHeaders(),
                body: body
            });
            const responseData = await response.json();
            if (!response.ok) {
                showError(responseData);
                setIsSaving(false);
                return;
            }
            const cardId = responseData.cardId;
            setCardData(cardData => ({
                ...cardData,
                cardId: cardId
            }));
            toast.success(`Card ${method === 'POST' ? `created` : `updated`}: ${normalizeName(cardData)}`);
            setIsSaving(false);
            closeUpdate();
        } catch (error) {
            toast.error('Failed to save card: ' + error);
            setIsSaving(false);
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
                headers: getHeaders(),
                body: body
            });
            const responseData = await response.json();
            if (!response.ok) {
                showError(responseData);
                return;
            }
            toast.success(`Card deleted: ${normalizeName(cardData)}`);
            closeUpdate();
        } catch (error) {
            toast.error('Failed to delete card: ' + error);
        }
    }

    const handleExport = async () => {
        if (!cardData.cardName) {
            toast.warning('Name the card before exporting');
            return;
        }
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
                link.download = normalizeName(cardData) + '.png';
                link.click();
                closeUpdate();
            } catch (err) {
                console.error('oops, something went wrong!', err);
            }
        }
    };

    const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setImageFile(files[0]);
        }
    };

    const handleUploadImage = async () => {
        if (!imageFile) {
            if (!cardData.cardId) {
                toast.warning("No image selected!");
            }
            return;
        }
        toast.info('Saving image...');
        try {
            const base64String = await convertToBase64(imageFile);
            const data = {
                ownerId: getOwnerId(cardData),
                imageName: serializeName(cardData),
                imageMime: imageFile.type,
                artScale: cardData.artScale,
                artXOffset: cardData.artXOffset,
                artYOffset: cardData.artYOffset,
                base64String: base64String
            };
            const body = JSON.stringify(data);
            const response = await fetch(getAdminEndpoint(AdminEndpoint.IMAGE), {
                method: RequestMethod.POST,
                headers: getHeaders(),
                body: body
            });
            const responseData = await response.json();
            if (!response.ok) {
                showError(responseData);
                return;
            }
            setImageFile(undefined);
            toast.success('Saved image: ' + serializeName(cardData) + '.png');
        } catch (error) {
            toast.error('Error storing image: ' + error);
        }
    };
    console.log(serializeName(cardData));

    const setCard = (card: CardData) => {
        setImageFile(undefined);
        setCardData(card);
    }

    const encodeEffects = () => {
        setCardData({
            ...cardData,
            costText: encodeEffectsString(cardData.costText),
            effectText: encodeEffectsString(cardData.effectText)
        });
    }

    useImperativeHandle(ref, () => ({
        setCard,
        handleSave,
        handleExport,
    }));

    return (
        <Box ref={ref} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', margin: '20px' }}>
            <Box sx={{ marginRight: '2rem' }}>
                <CardPreviewer cards={cards} cardData={cardData} cardRef={cardRef} scale={1} overwriteArt={imageFile}/>
            </Box>
            <RightPanelSettings cards={cards} cardData={cardData} expansions={expansions} canUpload={!!imageFile} onEncode={encodeEffects}
                                onCardDataChange={handleCardDataChange} onExport={handleExport} onImageFileChange={handleImageFileChange}
                                onSave={handleSave} onDelete={handleDelete} />
        </Box>
    );
});

export default CardEditor;
