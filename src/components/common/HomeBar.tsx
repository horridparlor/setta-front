import React from 'react';
import Button from '@mui/material/Button';
import {Box} from "@mui/material";
import {AppPage} from "../../types/navigation";

interface HomeBarProps {
    setPage: (page: AppPage) => void;
}

const HomeBar: React.FC<HomeBarProps> = ({ setPage }) => {
    return (
        <Box>
            <Button variant="contained" color="primary" onClick={() => setPage(AppPage.CardEditor)}>
                Card Editor
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setPage(AppPage.CardCatalogue)}>
                Card Catalogue
            </Button>
        </Box>
    );
};

export default HomeBar;
