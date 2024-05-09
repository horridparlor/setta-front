import React, {useEffect, useRef, useState} from 'react';
import { ThemeProvider, Box } from '@mui/material';
import { theme } from './styles/Theme';
import HomeBar from './components/common/HomeBar';
import CardEditor, {CardEditorRef} from './components/card-editor/CardEditor';
import CardCatalogue from './components/card-catalogue/CardCatalogue';
import './styles/montserrat.css';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {AppPage} from "./types/navigation";
import {CardData, DEFAULT_CARD_DATA} from "./types/card";
import useCards from "./hooks/useCards";
import useExpansions from "./hooks/useExpansions";

interface AppProps {}

const App: React.FC<AppProps> = () => {
    const [activeComponent, setActiveComponent] = useState<string>(AppPage.CardCatalogue);
    const onCardClicked = (cardData: CardData) => {
        editorRef.current?.setCard(cardData);
        setActiveComponent(AppPage.CardEditor);
    }
    const { cards, fetchCards } = useCards();
    const onCardUpdate = () => {
        fetchCards();
        setActiveComponent(AppPage.CardCatalogue);
    }
    const editorRef = useRef<CardEditorRef>(null);
    const changePage = (page: AppPage) => {
        setActiveComponent(page);
        editorRef.current?.setCard(DEFAULT_CARD_DATA);
    }
    const { expansions } = useExpansions();
    const commitSave = () => {
        switch (activeComponent) {
            case AppPage.CardEditor:
                editorRef.current?.handleSave();
        }
    }
    const commitExport = () => {
        switch (activeComponent) {
            case AppPage.CardEditor:
                editorRef.current?.handleExport();
        }
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey) {
                event.preventDefault();
                switch (event.key) {
                    case 's':
                        commitSave();
                        break;
                    case 'e':
                        commitExport();
                        break;

                }
            } else if (activeComponent === AppPage.CardEditor && event.key === 'Escape') {
                setActiveComponent(AppPage.CardCatalogue);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [activeComponent]);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#244775', overflowX: 'hidden' }}>
                <Box sx={{ width: '100%', p: 2 }}>
                    <HomeBar setPage={changePage} />
                </Box>
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'auto',
                }}>
                    <Box sx={{display: activeComponent === AppPage.CardEditor ? 'flex' : 'none'}}>
                        <CardEditor cards={cards} closeUpdate={onCardUpdate} ref={editorRef} />
                    </Box>
                    <Box sx={{display: activeComponent === AppPage.CardCatalogue ? 'flex' : 'none'}}>
                        <CardCatalogue cards={cards} expansions={expansions} handleCardClick={onCardClicked}/>
                    </Box>
                </Box>
            </Box>
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
            />
        </ThemeProvider>
    );
};

export default App;
