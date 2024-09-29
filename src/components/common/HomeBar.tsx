import { forwardRef, useImperativeHandle, useState } from 'react';
import Button from '@mui/material/Button';
import { Box, Divider, ListItemButton } from '@mui/material';
import { AppPage } from '../../types/navigation';
import LoginModal from './LoginModal';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PeopleIcon from '@mui/icons-material/People';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import LoginIcon from '@mui/icons-material/Login';

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

    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
      setOpen(newOpen);
    };

    return (
      <Box>
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit" sx={{ mr: 2 }}>
              <MenuIcon onClick={toggleDrawer(true)} />
            </IconButton>
            <Drawer open={open}>
              <Box sx={{ p: 2 }}>
                <IconButton>
                  <CloseIcon onClick={toggleDrawer(false)} />
                </IconButton>
                <Divider />
                <ListItemButton
                  onClick={() => navigateTo(AppPage.CardCatalogue)}
                >
                  <ListItemIcon>
                    <AutoStoriesIcon />
                  </ListItemIcon>
                  <ListItemText primary="Card Catalogue" />
                </ListItemButton>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <AddToPhotosIcon sx={{ mr: 2 }} /> Card Creation
                  </AccordionSummary>
                  <AccordionDetails>
                    <ListItemButton
                      onClick={() => navigateTo(AppPage.CardEditor)}
                    >
                      <ListItemText primary="Card Editor" />
                    </ListItemButton>
                  </AccordionDetails>
                </Accordion>
                <ListItemButton>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="User Management" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemIcon>
                    <ManageAccountsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
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
              Login
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
