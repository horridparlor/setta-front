import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { getHeaders, showError } from '../../types/api';
import { AuthCookie } from '../../types/cookie';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../api/client.ts';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  refetch: () => Promise<void>;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, refetch }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [retypeNewPassword, setRetypeNewPassword] = useState('');

  const handleLogin = async () => {
    const { data: responseData, error } = await apiClient.POST(
      '/api/user/authenticate',
      {
        headers: getHeaders(),
        body: {
          username: username,
          password: password,
        },
      }
    );
    if (error) {
      showError(error);
      return;
    }
    Cookies.set(AuthCookie.AUTH_TOKEN, responseData.authToken, { expires: 1 });
    Cookies.set(AuthCookie.USER_ID, responseData.userId.toString(), {
      expires: 7,
    });
    Cookies.set(
      AuthCookie.SYSTEM_USER,
      JSON.stringify({
        firstName: responseData.firstname,
        lastName: responseData.lastname,
        accessRights: responseData.accessRights,
      }),
      { expires: 7 }
    );
    toast.success(
      t('AUTHENTICATED', {
        firstName: responseData.firstname,
        lastName: responseData.lastname,
      })
    );
    toast.success(
      t('AUTHENTICATED', {
        firstName: responseData.firstname,
        lastName: responseData.lastname,
      })
    );
    await refetch();
    onClose();
  };

  const handleChangePassword = async () => {
    if (newPassword !== retypeNewPassword) {
      toast.error(t('PASSWORDS_DO_NOT_MATCH'));
      return;
    }
    const { error } = await apiClient.POST('/user/change-password', {
      headers: getHeaders(),
      body: {
        password: newPassword,
      },
    });
    if (error) {
      showError(error);
      return;
    }
    toast.success(t('PASSWORD_CHANGED_SUCCESS'));
    setChangePasswordOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{t('LOGIN_TITLE')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label={t('USERNAME')}
            type="text"
            fullWidth
            variant="outlined"
            value={username}
            onChange={e => setUsername(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            margin="dense"
            id="password"
            label={t('PASSWORD')}
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Typography
            color="info"
            onClick={() => setChangePasswordOpen(true)}
            sx={{ cursor: 'pointer', marginTop: 2 }}
          >
            {t('CHANGE_PASSWORD')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('CANCEL')}</Button>
          <Button onClick={handleLogin}>{t('LOGIN')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      >
        <DialogTitle>{t('CHANGE_PASSWORD')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="newPassword"
            label={t('NEW_PASSWORD')}
            type="password"
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            margin="dense"
            id="retypeNewPassword"
            label={t('RETYPE_NEW_PASSWORD')}
            type="password"
            fullWidth
            variant="outlined"
            value={retypeNewPassword}
            onChange={e => setRetypeNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordOpen(false)}>
            {t('CANCEL')}
          </Button>
          <Button onClick={handleChangePassword}>{t('UPDATE_PASSWORD')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoginModal;
