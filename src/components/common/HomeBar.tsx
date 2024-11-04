import { forwardRef, useImperativeHandle, useState } from 'react';
import Button from '@mui/material/Button';
import {
  Box,
  Divider,
  ListItemButton,
  AppBar,
  Toolbar,
  IconButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Drawer,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';
import { AppPage, isAppPage } from '../../types/navigation';
import LoginModal from './LoginModal';
import { useLocation, useNavigate } from 'react-router-dom';
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
import {
  ExpandMore,
  FormatPaint,
  Inventory,
  GridViewRounded,
} from '@mui/icons-material';
import { getUsername } from '../../types/cookie.ts';

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

    const getPageName = () => {
      const location = useLocation();
      const pageLocation =
        '/' + location.pathname.split('/').filter(Boolean)[0] || '';
      const appPage = isAppPage(pageLocation) ? pageLocation : AppPage.Error;
      switch (appPage) {
        case AppPage.CardCatalogue:
          return t('PAGE_NAME.CARD_CATALOGUE');
        case AppPage.CardEditor:
          return t('PAGE_NAME.CARD_EDITOR');
        case AppPage.CardExpansions:
          return t('PAGE_NAME.CARD_EXPANSIONS');
        case AppPage.ProcessManagement:
          return t('PAGE_NAME.PROCESS_MANAGEMENT');
        case AppPage.UserManagement:
          return t('PAGE_NAME.USER_MANAGEMENT');
        case AppPage.Error:
          return t('ERROR') + ': ' + pageLocation;
      }
    };

    return (
      <Box>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              color="inherit"
              sx={{ mr: 2 }}
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              open={open}
              ModalProps={{ onBackdropClick: () => setOpen(false) }}
            >
              <Box sx={{ p: 2 }}>
                <IconButton
                  onClick={() => setOpen(false)}
                  sx={{ mb: '0.75rem' }}
                >
                  <CloseIcon />
                </IconButton>
                <Divider />
                <ListItemButton
                  onClick={() => navigateTo(AppPage.CardCatalogue)}
                >
                  <ListItemIcon>
                    <AutoStoriesIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('PAGE_NAME.CARD_CATALOGUE')} />
                </ListItemButton>
                <ListItemButton onClick={() => navigateTo(AppPage.CardEditor)}>
                  <ListItemIcon>
                    <AddToPhotosIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('PAGE_NAME.CARD_EDITOR')} />
                </ListItemButton>

                <Accordion
                  disableGutters
                  elevation={0}
                  sx={{
                    '&:before': {
                      display: 'none',
                    },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <ListItemIcon>
                      <FormatPaint />
                    </ListItemIcon>
                    <ListItemText primary={t('PAGE_NAME.RELEASING')} />
                  </AccordionSummary>

                  <AccordionDetails>
                    <ListItemButton
                      onClick={() => navigateTo(AppPage.CardExpansions)}
                    >
                      <ListItemIcon>
                        <Inventory />
                      </ListItemIcon>
                      <ListItemText primary={t('PAGE_NAME.CARD_EXPANSIONS')} />
                    </ListItemButton>
                    <ListItemButton
                      onClick={() => navigateTo(AppPage.ProcessManagement)}
                    >
                      <ListItemIcon>
                        <GridViewRounded />
                      </ListItemIcon>
                      <ListItemText
                        primary={t('PAGE_NAME.PROCESS_MANAGEMENT')}
                      />
                    </ListItemButton>
                  </AccordionDetails>
                </Accordion>

                <ListItemButton
                  onClick={() => navigateTo(AppPage.UserManagement)}
                >
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('PAGE_NAME.USER_MANAGEMENT')} />
                </ListItemButton>
                <ListItemButton>
                  <ListItemIcon>
                    <ManageAccountsIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('PROFILE')} />
                </ListItemButton>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LanguageIcon sx={{ ml: 2, mr: 3 }} />
                  <LanguageSelect />
                </Box>
              </Box>
            </Drawer>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Setta
            </Typography>

            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600 }}>
              {getPageName()}
            </Typography>

            <Typography variant="h6" sx={{ marginRight: 2 }}>
              {getUsername(t)}
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
