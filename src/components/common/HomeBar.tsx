import { forwardRef, useImperativeHandle, useState } from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { AppPage } from '../../types/navigation';
import LoginModal from './LoginModal';
import { useNavigate } from 'react-router-dom';

interface HomeBarProps {
  refetch: () => Promise<void>;
  onLeavePage?: () => void;
}

export interface HomeBarRef {
  toggleLoginOpen: () => void;
}

const HomeBar = forwardRef<HomeBarRef, HomeBarProps>(
  ({ refetch, onLeavePage }, ref) => {
    const [isLoginOpen, setLoginOpen] = useState(false);
    const navigate = useNavigate();

    const toggleLoginOpen = () => {
      setLoginOpen(!isLoginOpen);
    };
    useImperativeHandle(ref, () => ({
      toggleLoginOpen,
    }));

    const navigateTo = (page: AppPage) => {
      if (onLeavePage) {
        onLeavePage();
      }
      navigate(page);
    };

    return (
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            navigateTo(AppPage.CardEditor);
          }}
        >
          Card Editor
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigateTo(AppPage.CardCatalogue)}
          sx={{ marginLeft: '0.4rem' }}
        >
          Card Catalogue
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={() => setLoginOpen(true)}
          sx={{ marginLeft: '0.4rem' }}
        >
          Login
        </Button>
        <LoginModal
          open={isLoginOpen}
          onClose={() => setLoginOpen(false)}
          refetch={refetch}
        />
      </Box>
    );
  }
);

export default HomeBar;
