import { forwardRef, useImperativeHandle, useState } from 'react';
import Button from '@mui/material/Button';
import { 
  Box, 
  Divider, 
  ListItemButton, 
  AppBar, Toolbar, 
  Typography, 
  IconButton,
  Drawer,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { AppPage } from '../../types/navigation';
import LoginModal from './LoginModal';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PeopleIcon from '@mui/icons-material/People';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import LoginIcon from '@mui/icons-material/Login';
import { useTranslation } from 'react-i18next';
import LanguageSelect from './LanguageSelect';
import LanguageIcon from '@mui/icons-material/Language';


interface HomeBarProps {
  refetch: () => Promise<void>;
  onLeavePage?: () => void;
}

export interface HomeBarRef {
  toggleLoginOpen: () => void;
}

const HomeBar = forwardRef<HomeBarRef, HomeBarProps>(
  ({ refetch, onLeavePage }, ref) => {
    const { t } = useTranslation(); 
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

    const [open, setOpen] = useState(false);

    return (
      <Box>
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit" sx={{ mr: 2 }} onClick={() => setOpen(true)}>
              <MenuIcon/>
            </IconButton>
            <Drawer open={open}>
              <Box sx={{ p: 2 }}>
                <IconButton onClick={() => setOpen(false)}>
                  <CloseIcon/>
                </IconButton>
                <Divider />
                <ListItemButton
                  onClick={() => navigateTo(AppPage.CardCatalogue)}
                >
                  <ListItemIcon>
                    <AutoStoriesIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('CARD_CATALOGUE')} />
                </ListItemButton>
                <ListItemButton
                    onClick={() => navigateTo(AppPage.CardEditor)}
                >
                  <ListItemIcon >
                    <AddToPhotosIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('CARD_EDITOR')} />
                </ListItemButton>
                <ListItemButton>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('USER_MANAGEMENT')} />
                </ListItemButton>
                <ListItemButton>
                  <ListItemIcon>
                    <ManageAccountsIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('PROFILE')} />
                </ListItemButton>
                <LanguageIcon sx={{ ml: 2, mr:3 }}/>
                <LanguageSelect />
              </Box>
            </Drawer>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Setta
            </Typography>

            <Button
              variant="contained"
              color="info"
              startIcon={<LoginIcon />}
              onClick={() => setLoginOpen(true)}
              sx={{ marginLeft: '0.4rem' }}
            >
              {t('LOGIN')} 
            </Button>
            <LoginModal
              open={isLoginOpen}
              onClose={() => setLoginOpen(false)}
              refetch={refetch}
            />
          </Toolbar>
        </AppBar>
      </Box>
    );
  }
);

export default HomeBar;
