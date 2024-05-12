import React, {useEffect, useRef, useState} from 'react';
import { ThemeProvider, Box } from '@mui/material';
import { theme } from './styles/Theme';
import HomeBar, {HomeBarRef} from './components/common/HomeBar';
import CardEditor, {CardEditorRef} from './components/card-editor/CardEditor';
import CardCatalogue, {CardCatalogueRef} from './components/card-catalogue/CardCatalogue';
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
    const { cards, cardOwners, fetchCards } = useCards();
    const onCardUpdate = () => {
        fetchCards();
        setActiveComponent(AppPage.CardCatalogue);
    }
    const editorRef = useRef<CardEditorRef>(null);
    const catalogueRef = useRef<CardCatalogueRef>(null);
    const homeBarRef = useRef<HomeBarRef>(null);
    const changePage = (page: AppPage) => {
        setActiveComponent(page);
        editorRef.current?.setCard(DEFAULT_CARD_DATA);
    }
    const { expansions } = useExpansions();
    const commitSave = () => {
        switch (activeComponent) {
            case AppPage.CardEditor:
                editorRef.current?.handleSave();
                break;
            case AppPage.CardCatalogue:
                catalogueRef.current?.toggleFilters();
                break;
        }
    }
    const commitExport = () => {
        switch (activeComponent) {
            case AppPage.CardEditor:
                editorRef.current?.handleExport();
                break;
        }
    }
    const commitReset = () => {
        switch (activeComponent) {
            case AppPage.CardCatalogue:
                catalogueRef.current?.resetFilters();
                break;
        }
    }
    const commitEscape = () => {
        switch (activeComponent) {
            case AppPage.CardEditor:
                setActiveComponent(AppPage.CardCatalogue);
                break;
            case AppPage.CardCatalogue:
                catalogueRef.current?.backdownFilters();
                break;
        }
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
                    case 'r':
                        event.preventDefault();
                        commitReset();
                        break;
                }
            } else if (event.key === 'Escape') {
                commitEscape();
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
                    <HomeBar ref={homeBarRef} setPage={changePage} />
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
                        <CardCatalogue cards={cards} cardOwners={cardOwners} expansions={expansions}
                                       ref={catalogueRef} handleCardClick={onCardClicked}/>
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
