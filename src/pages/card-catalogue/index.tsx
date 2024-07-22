import {useEffect, useRef} from 'react';
import { Box } from '@mui/material';
import {CardData} from "../../types/card";
import {CardOwner} from "../../types/user";
import {CardExpansion} from "../../types/expansion";
import HomeBar, {HomeBarRef} from "../../components/common/HomeBar";
import CardCatalogue, {CardCatalogueRef} from "../../components/card-catalogue/CardCatalogue";
import {useNavigate} from "react-router-dom";
import {AppPage} from "../../types/navigation";

interface CardCataloguePageProps {
    cards: Array<CardData>;
    cardOwners: Array<CardOwner>;
    expansions: Array<CardExpansion>;
    refetch: () => Promise<void>;
}

const CardCataloguePage = (props: CardCataloguePageProps) => {
    const { cards, cardOwners,
        expansions, refetch } = props;
    const catalogueRef = useRef<CardCatalogueRef>(null);
    const homeBarRef = useRef<HomeBarRef>(null);
    const navigate = useNavigate();

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
        const cardRoute = `${AppPage.CardEditor}/${card.cardId.toString()}`;
        navigate(cardRoute);
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
                <HomeBar refetch={refetch} ref={homeBarRef} />
            </Box>
            <Box sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'auto',
            }}>
                <CardCatalogue cards={cards} cardOwners={cardOwners} expansions={expansions}
                               ref={catalogueRef} handleCardClick={handleCardClick}/>
            </Box>
        </Box>
    );
}

export default CardCataloguePage;
