import {useRef} from 'react';
import { Box } from '@mui/material';
import {CardData} from "../../types/card.tsx";
import {CardExpansion} from "../../types/expansion.ts";
import HomeBar, {HomeBarRef} from "../../components/common/HomeBar.tsx";

interface CardExpansionsPageProps {
  cards: Array<CardData>;
  expansions: Array<CardExpansion>;
  refetch: () => Promise<void>;
}

const CardExpansionsPage = (props: CardExpansionsPageProps) => {
  const {refetch} = props;
  const homeBarRef = useRef<HomeBarRef>(null);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#244775',
        overflowX: 'hidden',
      }}
    >
      <Box sx={{ width: '100%', p: 2 }}>
        <HomeBar refetch={refetch} ref={homeBarRef} />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'auto',
        }}
      >
      </Box>
    </Box>
  );
};

export default CardExpansionsPage;
