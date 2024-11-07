import { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
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
import { toast } from 'react-toastify';
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
import { getUsername, AuthCookie } from '../../types/cookie.ts';

interface HomeBarProps {
  refetch: () => Promise<void>;
  onLeavePage?: () => void;
}

export interface HomeBarRef {
  toggleLoginOpen: () => void;
}
export const isUserLoggedIn = () => {
  const userId = Cookies.get(AuthCookie.USER_ID);
  return !!userId && !isNaN(parseInt(userId));
};
const HomeBar = forwardRef<HomeBarRef, HomeBarProps>(
  ({ refetch, onLeavePage }, ref) => {
    const { t } = useTranslation();
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [username, setUsername] = useState(getUsername(t)); // Track username for login state
    const navigate = useNavigate();

    const toggleLoginOpen = () => {
      setLoginOpen(!isLoginOpen);
    };

    useImperativeHandle(ref, () => ({
      toggleLoginOpen,
    }));

    useEffect(() => {
      // Update username whenever cookies change
      setUsername(getUsername(t));
    }, []);
    const isLoggedIn = isUserLoggedIn();
    const handleLogout = () => {
      // Clear authentication cookies on logout
      Cookies.remove(AuthCookie.AUTH_TOKEN);
      Cookies.remove(AuthCookie.USER_ID);
      Cookies.remove(AuthCookie.SYSTEM_USER);
      setUsername(t('GUEST'));
      toast.success(t('LOGOUT_SUCCESS'));
      refetch();
      window.location.reload();
    };

    const handleLoginSuccess = () => {
      setUsername(getUsername(t));
      setLoginOpen(false);
      refetch();
      window.location.reload();
    };

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
              data-testid="menu-open-button"
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
                  data-testid="menu-close-button"
                  onClick={() => setOpen(false)}
                  sx={{ mb: '0.75rem' }}
                >
                  <CloseIcon />
                </IconButton>
                <Divider />
                <ListItemButton
                  data-testid="nav-card-catalogue-button"
                  onClick={() => navigateTo(AppPage.CardCatalogue)}
                >
                  <ListItemIcon>
                    <AutoStoriesIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('PAGE_NAME.CARD_CATALOGUE')} />
                </ListItemButton>
                <ListItemButton
                  data-testid="nav-card-editor-button"
                  onClick={() => navigateTo(AppPage.CardEditor)}
                >
                  <ListItemIcon>
                    <AddToPhotosIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('PAGE_NAME.CARD_EDITOR')} />
                </ListItemButton>

                <Accordion
                  data-testid="releasing-accordion"
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
                      data-testid="nav-card-expansions-button"
                      onClick={() => navigateTo(AppPage.CardExpansions)}
                    >
                      <ListItemIcon>
                        <Inventory />
                      </ListItemIcon>
                      <ListItemText primary={t('PAGE_NAME.CARD_EXPANSIONS')} />
                    </ListItemButton>
                    <ListItemButton
                      data-testid="nav-process-management-button"
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
                  data-testid="nav-user-management-button"
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
              {username}
            </Typography>

            {isLoggedIn ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
                sx={{ marginLeft: '0.4rem' }}
              >
                {t('LOGOUT')}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="info"
                startIcon={<LoginIcon />}
                onClick={() => setLoginOpen(true)}
                sx={{ marginLeft: '0.4rem' }}
              >
                {t('LOGIN')}
              </Button>
            )}
            <LoginModal
              open={isLoginOpen}
              onClose={() => setLoginOpen(false)}
              refetch={refetch}
              onLoginSuccess={handleLoginSuccess}
            />
          </Toolbar>
        </AppBar>
      </Box>
    );
  }
);

export default HomeBar;
