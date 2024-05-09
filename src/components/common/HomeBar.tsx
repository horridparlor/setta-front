import React, {forwardRef, useImperativeHandle, useState} from 'react';
import Button from '@mui/material/Button';
import {Box} from "@mui/material";
import {AppPage} from "../../types/navigation";
import LoginModal from "./LoginModal";
import {CardData} from "../../types/card";
import {CardEditorRef} from "../card-editor/CardEditor";

interface HomeBarProps {
    setPage: (page: AppPage) => void;
}

export interface HomeBarRef {
    toggleLoginOpen: () => void;
}

const HomeBar = forwardRef<HomeBarRef, HomeBarProps>(({setPage}, ref) => {
    const [isLoginOpen, setLoginOpen] = useState(false);

    const toggleLoginOpen = () => {
        setLoginOpen(!isLoginOpen);
    }
    useImperativeHandle(ref, () => ({
        toggleLoginOpen
    }));

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
});

export default HomeBar;
