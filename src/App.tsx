import React, { useState } from 'react';
import { ThemeProvider, Box } from '@mui/material';
import { theme } from './styles/Theme';
import HomeBar from './components/common/HomeBar';
import CardEditor from './components/card-editor/CardEditor';
import CardCatalogue from './components/card-catalogue/CardCatalogue';
import ImageCapture from "./components/test/ImageCapture";

interface AppProps {}

const App: React.FC<AppProps> = () => {
    const [activeComponent, setActiveComponent] = useState<string>('editor');

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#244775' }}>
                <Box sx={{ width: '100%', p: 2 }}>
                    <HomeBar setActiveComponent={setActiveComponent} />
                </Box>
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'auto'
                }}>
                    {activeComponent === 'editor' ?
                        <CardEditor /> :
                        <CardCatalogue cards={{}} />}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default App;
