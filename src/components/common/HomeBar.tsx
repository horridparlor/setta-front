import React, {useState} from 'react';
import Button from '@mui/material/Button';
import {Box} from "@mui/material";
import {AppPage} from "../../types/navigation";
import LoginModal from "./LoginModal";

interface HomeBarProps {
    setPage: (page: AppPage) => void;
}

const HomeBar: React.FC<HomeBarProps> = ({ setPage }) => {
    const [isLoginOpen, setLoginOpen] = useState(false);

    return (
        <Box>
            <Button variant="contained" color="primary" onClick={() => setPage(AppPage.CardEditor)}>
                Card Editor
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setPage(AppPage.CardCatalogue)} sx={{marginLeft: '0.4rem'}}>
                Card Catalogue
            </Button>
            <Button variant="contained" color="info" onClick={() => setLoginOpen(true)} sx={{marginLeft: '0.4rem'}}>
                Login
            </Button>
            <LoginModal open={isLoginOpen} onClose={() => setLoginOpen(false)} />
        </Box>
    );
};

export default HomeBar;
