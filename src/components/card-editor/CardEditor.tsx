import {
  ChangeEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import CardPreviewer from './card-previewer/CardPreviewer';
import RightPanelSettings from './RightPanelSettings';
import GenerateBox from './GenerateBox';
import domtoimage from 'dom-to-image';
import { Box } from '@mui/material';
import { CardData, DEFAULT_CARD_DATA, getOwnerId } from '../../types/card';
import { CardMainFrameColor } from '../../types/color';
import { toast } from 'react-toastify';
import { getHeaders, RequestMethod, showError } from '../../types/api';
import useExpansions from '../../hooks/useExpansions';
import {
  encodeEffectsString,
  encodeNameString,
  normalizeName,
  serializeName,
} from '../../utils/string';
import { convertToBase64 } from '../../types/files';
import { useParams } from 'react-router-dom';
import { CardEffects } from '../../types/cardEffects';
import { apiClient } from '../../api/client.ts';

interface CardEditorProps {
  closeUpdate: () => void;
  cards: Array<CardData>;
  refetch: () => Promise<void>;
  goToCard: (cardId: number) => void;
  onCardSet: (card: CardData) => void;
}

export interface CardEditorRef {
  handleSave: () => void;
  handleExport: () => void;
  handleDelete: () => void;
}

const CardEditor = forwardRef<CardEditorRef, CardEditorProps>(
  ({ closeUpdate, cards, refetch, goToCard, onCardSet }, ref) => {
    const { expansions } = useExpansions();
    const [cardData, setCardData] = useState<CardData>(DEFAULT_CARD_DATA);
    const [imageFile, setImageFile] = useState<File | undefined>(undefined);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [oldName, setOldName] = useState<string>('');
    const [activeTab, setActiveTab] = useState<number>(0);
    const { cardId } = useParams();
    const cardRef = useRef<HTMLDivElement>(null);
    // const handleActiveTabChange = (newTabId: number) => {
    //   setActiveTab(newTabId);
    // };
    // const handleResetFields = () => {
    //   // Logic to reset all fields in BackgroundTab, CharacterTab, and SpecialEffectsTab
    //   setCardData(DEFAULT_CARD_DATA);
    //   // Assuming that each tab component has a reset method, call those here if needed.
    // };

    const handleCardDataChange = (
      field: keyof CardData,
      value: string | number | CardEffects
    ) => {
      setCardData(prev => ({
        ...prev,
        [field]: value,
      }));
    };

    const handleSave = async () => {
      if (isSaving) {
        toast.info('Saving card... Please wait');
        return;
      }
      setIsSaving(true);
      const method = cardData.cardId ? RequestMethod.PUT : RequestMethod.POST;
      const params = {
        ...cardData,
        serializedName: serializeName(cardData),
        oldSerializedName: serializeName(oldName),
      };
      const { data: responseData, error } = await (method === RequestMethod.POST
        ? apiClient.POST('/admin/card', {
            headers: getHeaders(),
            body: params,
          })
        : apiClient.PUT('/admin/card', {
            headers: getHeaders(),
            body: params,
          }));
      if (error) {
        showError(error);
        setIsSaving(false);
        return;
      }
      const cardId = responseData.cardId;
      setCardData(cardData => ({
        ...cardData,
        cardId: cardId,
        serializedName: serializeName(cardData),
      }));
      toast.success(
        `Card ${method === 'POST' ? `created` : `updated`}: ${normalizeName(cardData)}`
      );
      await handleUploadImage(cardId);
      setIsSaving(false);
      closeUpdate();
    };

    const handleDelete = async () => {
      const { error } = await apiClient.DELETE('/admin/card', {
        headers: getHeaders(),
        body: {
          cardId: cardData.cardId,
        },
      });
      if (error) {
        showError(error);
        return;
      }
      toast.success(`Card deleted: ${normalizeName(cardData)}`);
      closeUpdate();
    };

    const handleErrata = async () => {
      await copyCard(true);
    };

    const handleCopy = async () => {
      await copyCard();
    };

    const copyCard = async (doErrata = false) => {
      const params = {
        cardId: cardData.cardId,
        serializedName: serializeName(cardData),
        doErrata: doErrata,
      };
      const actionWord = doErrata ? 'errata' : 'copy';

      const { data: responseData, error } = await apiClient.POST(
        '/admin/copy-card',
        {
          headers: getHeaders(),
          body: params,
        }
      );
      if (error) {
        showError(error);
        return;
      }
      toast.success(`New ${actionWord} of card: ${normalizeName(cardData)}`);
      goToCard(responseData.cardId);
      await refetch();
    };

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
              height: `${wrapper.offsetHeight}px`,
            },
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

    const handleUploadImage = async (cardId: number) => {
      if (!imageFile) {
        if (!cardData.cardId) {
          toast.warning('No image selected!');
        }
        return;
      }
      toast.info('Saving image...');
      try {
        const base64String = await convertToBase64(imageFile);
        const data = {
          cardId: cardId,
          ownerId: getOwnerId(cardData),
          imageName: serializeName(cardData),
          imageMime: imageFile.type,
          artScale: cardData.artScale,
          artXOffset: cardData.artXOffset,
          artYOffset: cardData.artYOffset,
          base64String: base64String,
        };
        const { error } = await apiClient.POST('/admin/image', {
          headers: getHeaders(),
          body: data,
        });
        if (error) {
          showError(error);
          return;
        }
        setImageFile(undefined);
        toast.success('Saved image: ' + serializeName(cardData) + '.png');
      } catch (error) {
        toast.error('Error storing image: ' + error);
      }
    };

    const setCard = (card: CardData) => {
      setImageFile(undefined);
      setOldName(serializeName(card));
      setCardData(card);
    };

    useEffect(() => {
      if (
        cardData.cardId &&
        expansions.find(expansion => expansion.id === cardData.expansionId)
      ) {
        onCardSet(cardData);
      }
    }, [cardData, onCardSet, expansions]);

    useEffect(() => {
      const card =
        cardId === undefined
          ? undefined
          : cards.find(card => card.cardId === parseInt(cardId));
      setCard(card || DEFAULT_CARD_DATA);
    }, [cardId, cards]);

    const encodeEffects = () => {
      setCardData({
        ...cardData,
        cardName: encodeNameString(cardData.cardName),
        costText: encodeEffectsString(cardData.costText),
        effectText: encodeEffectsString(cardData.effectText),
      });
    };

    useImperativeHandle(ref, () => ({
      handleSave,
      handleExport,
      handleDelete,
    }));

    return (
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          alignItems: 'start',
          justifyContent: 'space-around',
          width: '100%',
        }}
      >
        <Box>
          <CardPreviewer
            cards={cards}
            expansions={expansions}
            cardData={cardData}
            cardRef={cardRef}
            scale={1}
            overwriteArt={imageFile}
            oldName={oldName}
          />
          {(activeTab === 2 || activeTab == 3) && <GenerateBox />}
        </Box>
        <RightPanelSettings
          cards={cards}
          cardData={cardData}
          expansions={expansions}
          canUpload={!!imageFile}
          onEncode={encodeEffects}
          onCardDataChange={handleCardDataChange}
          onExport={handleExport}
          onImageFileChange={handleImageFileChange}
          onSave={handleSave}
          onDelete={handleDelete}
          onErrata={handleErrata}
          onCopy={handleCopy}
          tabId={activeTab}
          onActiveTabChange={setActiveTab}
        />
      </Box>
    );
  }
);

export default CardEditor;
