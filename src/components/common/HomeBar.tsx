import React from 'react';
import Button from '@mui/material/Button';
import {Box} from "@mui/material";

interface HomeBarProps {
    setActiveComponent: (component: string) => void;
}

const HomeBar: React.FC<HomeBarProps> = ({ setActiveComponent }) => {
    return (
        <Box>
            <Button variant="contained" color="primary" onClick={() => setActiveComponent('editor')}>
                Card Editor
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setActiveComponent('catalogue')}>
                Card Catalogue
            </Button>
        </Box>
    );
};

export default HomeBar;
