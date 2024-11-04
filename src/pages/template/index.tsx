import { useRef } from 'react';
import { Box } from '@mui/material';
import { CardData } from '../../types/card.tsx';
import HomeBar, { HomeBarRef } from '../../components/common/HomeBar.tsx';

interface TemplatePageProps {
  cards: Array<CardData>;
  refetch: () => Promise<void>;
}

const TemplatePage = (props: TemplatePageProps) => {
  const { refetch } = props;
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
      <Box sx={{ width: '100%' }}>
        <HomeBar refetch={refetch} ref={homeBarRef} />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'auto',
          p: 2,
        }}
      ></Box>
    </Box>
  );
};

export default TemplatePage;
