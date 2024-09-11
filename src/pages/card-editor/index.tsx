import {useEffect, useRef, useState} from 'react';
import { Box } from '@mui/material';
import {CardData} from "../../types/card";
import HomeBar, {HomeBarRef} from "../../components/common/HomeBar";
import CardEditor, {CardEditorRef} from "../../components/card-editor/CardEditor";
import {useNavigate} from "react-router-dom";
import {AppPage} from "../../types/navigation";
import {MultitaskCookie} from "../../types/cookie";
import Cookies from "js-cookie";

interface CardEditorPageProps {
    cards: Array<CardData>;
    refetch: () => Promise<void>;
}

const CardEditorPage = (props: CardEditorPageProps) => {
    const { cards, refetch } = props;
    const editorRef = useRef<CardEditorRef>(null);
    const homeBarRef = useRef<HomeBarRef>(null);
    const navigate = useNavigate();
    const [ multiTaskNextCard, setMultiTaskNextCard ] = useState<number>(0);

    const onCardSaved = async() => {
        console.log(555, multiTaskNextCard);
        if (multiTaskNextCard) {
            setMultiTaskNextCard(0);
            goToCard(multiTaskNextCard);
            return;
        }
        await refetch();
        onClose();
    }

    const goToCard = (cardId: number) => {
        navigate(`${AppPage.CardEditor}/${cardId.toString()}`);
    }

    const onClose = () => {
        navigate(AppPage.CardCatalogue);
    }

    const commitSave = () => {
        editorRef.current?.handleSave();
    }
    const commitExport = () => {
        editorRef.current?.handleExport();
    }
    const commitDelete = () => {
        editorRef.current?.handleDelete();
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey) {
                switch (event.key) {
                    case 's':
                        event.preventDefault();
                        commitSave();
                        break;
                    case 'e':
                        event.preventDefault();
                        commitExport();
                        break;
                    case 'l':
                        event.preventDefault();
                        homeBarRef.current?.toggleLoginOpen();
                        break;
                    case 'd':
                        event.preventDefault();
                        commitDelete();
                        break;
                }
            } else if (event.key === 'Escape') {
               onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    } );

    const onCardSet = (card: CardData) => {
        const exportingAllCards: string|undefined = Cookies.get(MultitaskCookie.EXPORTING_ALL_CARDS);
        const exportingAllIndex: string|undefined = Cookies.get(MultitaskCookie.EXPORTING_ALL_INDEX);
        if (!exportingAllCards || !card.cardId) {
            return;
        }
        const cardIds: Array<number> = JSON.parse(exportingAllCards);
        const currentIndex: number = JSON.parse(exportingAllIndex ?? '0');
        const nextIndex: number = currentIndex + 1;
        Cookies.set(MultitaskCookie.EXPORTING_ALL_INDEX, JSON.stringify(nextIndex));
        if (nextIndex >= cardIds.length) {
            console.log(999);
            Cookies.remove(MultitaskCookie.EXPORTING_ALL_CARDS);
            Cookies.remove(MultitaskCookie.EXPORTING_ALL_INDEX);
            commitExport();
        } else {
            setMultiTaskNextCard(cardIds[nextIndex]);
        }
    };

    useEffect(() => {
        if (multiTaskNextCard) {
            commitExport();
        }
    }, [multiTaskNextCard]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#244775', overflowX: 'hidden' }}>
            <Box sx={{ width: '100%', p: 2 }}>
                <HomeBar refetch={refetch} ref={homeBarRef} />
            </Box>
            <Box sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'auto',
            }}>
                <CardEditor cards={cards} closeUpdate={onCardSaved} ref={editorRef} refetch={refetch}
                    goToCard={goToCard} onCardSet={onCardSet}
                />
            </Box>
        </Box>
    );
}

export default CardEditorPage;
