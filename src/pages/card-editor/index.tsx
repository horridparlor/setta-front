import {useEffect, useRef} from 'react';
import { Box } from '@mui/material';
import {CardData} from "../../types/card";
import HomeBar, {HomeBarRef} from "../../components/common/HomeBar";
import CardEditor, {CardEditorRef} from "../../components/card-editor/CardEditor";
import {useNavigate} from "react-router-dom";
import {AppPage} from "../../types/navigation";

interface CardEditorPageProps {
    cards: Array<CardData>;
    refetch: () => Promise<void>;
}

const CardEditorPage = (props: CardEditorPageProps) => {
    const { cards, refetch } = props;
    const editorRef = useRef<CardEditorRef>(null);
    const homeBarRef = useRef<HomeBarRef>(null);
    const navigate = useNavigate();

    const onCardSaved = async() => {
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
                    goToCard={goToCard}
                />
            </Box>
        </Box>
    );
}

export default CardEditorPage;
