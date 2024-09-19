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
import {
  getHeaders,
  getUserEndpoint,
  RequestMethod,
  showError,
  UserEndpoint,
} from '../../types/api';
import { AuthCookie } from '../../types/cookie';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  refetch: () => Promise<void>;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, refetch }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [retypeNewPassword, setRetypeNewPassword] = useState('');

  const handleLogin = async () => {
    const data = { username, password };
    const body = JSON.stringify(data);
    const response = await fetch(getUserEndpoint(UserEndpoint.AUTHENTICATE), {
      method: RequestMethod.POST,
      headers: getHeaders(),
      body,
    });
    const responseData = await response.json();
    if (!response.ok) {
      showError(responseData);
      return;
    }
    Cookies.set(AuthCookie.AUTH_TOKEN, responseData.authToken, { expires: 1 });
    Cookies.set(AuthCookie.USER_ID, responseData.userId, { expires: 7 });
    Cookies.set(
      AuthCookie.SYSTEM_USER,
      JSON.stringify({
        firstName: responseData.firstName,
        lastName: responseData.lastName,
        isAdmin: responseData.isAdmin,
      }),
      { expires: 7 }
    );
    toast.success(
      `Authenticated: ${responseData.firstname} ${responseData.lastname}`
    );
    await refetch();
    onClose();
  };

  const handleChangePassword = async () => {
    if (newPassword !== retypeNewPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const data = {
      password: newPassword,
    };
    const body = JSON.stringify(data);
    const response = await fetch(
      getUserEndpoint(UserEndpoint.CHANGE_PASSWORD),
      {
        method: RequestMethod.POST,
        headers: getHeaders(),
        body,
      }
    );
    const responseData = await response.json();
    if (!response.ok) {
      showError(responseData);
      return;
    }
    toast.success('Password Changed Successfully');
    setChangePasswordOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
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
            label="Password"
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
            Change Password
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleLogin}>Login</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="newPassword"
            label="New Password"
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
            label="Retype New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={retypeNewPassword}
            onChange={e => setRetypeNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordOpen(false)}>Cancel</Button>
          <Button onClick={handleChangePassword}>Update Password</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoginModal;
