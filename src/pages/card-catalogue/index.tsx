import {useEffect, useRef, useState} from 'react';
import { Box } from '@mui/material';
import {CardData} from "../../types/card";
import {CardOwner} from "../../types/user";
import {CardExpansion} from "../../types/expansion";
import HomeBar, {HomeBarRef} from "../../components/common/HomeBar";
import CardCatalogue, {CardCatalogueRef} from "../../components/card-catalogue/CardCatalogue";
import {useLocation, useNavigate} from "react-router-dom";
import {AppPage} from "../../types/navigation";
import {PageCookie} from "../../types/cookie";

interface CardCataloguePageProps {
    cards: Array<CardData>;
    cardOwners: Array<CardOwner>;
    expansions: Array<CardExpansion>;
    refetch: () => Promise<void>;
}

const CardCataloguePage = (props: CardCataloguePageProps) => {
    const DEFAULT_CARDS_SHOWN = 24;
    const initialCardsShown = parseInt(sessionStorage.getItem(PageCookie.CARD_CATALOGUE_CARDS_SHOWN) || (DEFAULT_CARDS_SHOWN).toString());
    const [visibleCardCount, setVisibleCardCount] = useState(initialCardsShown);

    const { cards, cardOwners,
        expansions, refetch } = props;
    const catalogueRef = useRef<CardCatalogueRef>(null);
    const homeBarRef = useRef<HomeBarRef>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const commitSave = () => {
        catalogueRef.current?.toggleFilters();
    }
    const commitReset = () => {
        catalogueRef.current?.resetFilters();
    }
    const commitEscape = () => {
       catalogueRef.current?.backdownFilters();
    }
    const handleCardClick = (card: CardData) => {
        onLeavePage();
        const cardRoute = `${AppPage.CardEditor}/${card.cardId.toString()}`;
        navigate(cardRoute);
    }
    const onLeavePage = () => {
        const params = new URLSearchParams(location.search);
        sessionStorage.setItem(PageCookie.CARD_CATALOGUE_CARDS_SHOWN, visibleCardCount.toString());
        sessionStorage.setItem(PageCookie.CARD_CATALOGUE_FILTERS, params.toString());
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey) {
                switch (event.key) {
                    case 's':
                        event.preventDefault();
                        commitSave();
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
    } );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#244775', overflowX: 'hidden' }}>
            <Box sx={{ width: '100%', p: 2 }}>
                <HomeBar refetch={refetch} ref={homeBarRef} onLeavePage={onLeavePage} />
            </Box>
            <Box sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'auto',
            }}>
                <CardCatalogue cards={cards} cardOwners={cardOwners} expansions={expansions}
                               ref={catalogueRef} handleCardClick={handleCardClick}
                               visibleCardCount={visibleCardCount} setVisibleCardCount={setVisibleCardCount}
                               defaultCardsShown={DEFAULT_CARDS_SHOWN}
                />
            </Box>
        </Box>
    );
}

export default CardCataloguePage;
