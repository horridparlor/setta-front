import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Button,
  Grid2,
  TextField,
  Typography,
} from '@mui/material';
import { useRef, useState } from 'react';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { useTranslation } from 'react-i18next';

const UserProfile = () => {
  const { t } = useTranslation();
  const dialogRef = useRef(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userID] = useState('');
  const [penName, setPenName] = useState('');

  const userName = `${firstName}.${lastName}`.toLowerCase();

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const rowContainerStyle = {
    flexDirection: 'row',
    alignItems: 'top-left',
    gap: 2,
    marginBottom: 2,
    display: 'flex',
  };

  const columnContainerStyle = {
    flexDirection: 'column',
    alignItems: 'top-left',
    gap: 2,
    marginBottom: 2,
    display: 'flex',
    width: '60%',
  };

  return (
    <Card sx={{ m: 1, pt: 60, width: '70%', overflow: 'auto' }}>
      <CardHeader
        titleTypographyProps={{ variant: 'h4' }}
        title={t('PROFILE')}
      />
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'top-left',
            gap: 2,
            flexDirection: 'column',
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'top-left',
                gap: 2,
                flexDirection: 'column',
              }}
            >
              <Box sx={rowContainerStyle}>
                <Box sx={{ pr: 10 }}>
                  <Typography variant="h5" gutterBottom align="inherit">
                    {t('PERSONAL_INFORMATION')}
                  </Typography>
                </Box>
                <Box sx={columnContainerStyle}>
                  <TextField
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setFirstName(event.target.value);
                    }}
                    value={firstName}
                    label="First name"
                    size="medium"
                    variant="standard"
                  />
                  <TextField
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setLastName(event.target.value);
                    }}
                    value={lastName}
                    label="Last name"
                    size="medium"
                    variant="standard"
                  />
                  <TextField
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setEmail(event.target.value);
                    }}
                    value={email}
                    label="Email"
                    size="medium"
                    variant="standard"
                  />
                  <TextField
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setPhoneNumber(event.target.value);
                    }}
                    value={phoneNumber}
                    label="Phone number"
                    size="medium"
                    variant="standard"
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>

          <CardContent>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'top-left',
                gap: 2,
                flexDirection: 'column',
              }}
            >
              <Box sx={rowContainerStyle}>
                <Box sx={{ pr: 21 }}>
                  <Typography variant="h5" gutterBottom>
                    {t('USER_ACCOUNT')}
                  </Typography>
                </Box>
                <Box sx={columnContainerStyle}>
                  <Box>
                    <Chip
                      size="small"
                      label="Active"
                      variant="filled"
                      color="success"
                    />
                  </Box>
                  <Typography variant="caption" gutterBottom>
                    {t('ACTIVE_SINCE')}/*activationdate */
                  </Typography>
                  <TextField
                    value={userID}
                    label="UserID"
                    size="medium"
                    variant="standard"
                    disabled
                  />
                  <TextField
                    value={userName}
                    label="Username"
                    size="medium"
                    variant="standard"
                    disabled
                  />
                  <TextField
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setPenName(event.target.value);
                    }}
                    value={penName}
                    label="Pen name"
                    size="medium"
                    variant="standard"
                    disabled
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>

          <CardContent>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'top-left',
                gap: 2,
                flexDirection: 'column',
              }}
            >
              <Box sx={rowContainerStyle}>
                <Box sx={{ pr: 35 }}>
                  <Typography variant="h5" gutterBottom>
                    {t('ROLE')}
                  </Typography>
                </Box>
                <Box sx={columnContainerStyle}>
                  <Typography variant="h6" gutterBottom>
                    {t('DESIGNER')}
                  </Typography>
                  <Typography variant="caption" gutterBottom>
                    {t('CUSTOMIZED_ACCESS_RIGHTS')}
                  </Typography>
                  <Grid2
                    container
                    sx={{ justifyContent: 'flex-end', marginTop: 2 }}
                  >
                    <Button
                      onClick={handleClickOpen}
                      variant="outlined"
                      size="small"
                      sx={{ marginRight: 2 }}
                    >
                      {t('CANCEL')}
                    </Button>
                    <Button type="submit" variant="contained" size="small">
                      {t('SAVE')}
                    </Button>
                  </Grid2>
                  <Typography variant="caption" gutterBottom>
                    {t('LAST_EDITED')}/*dd/mm/yyyy*/
                  </Typography>
                  <Typography variant="caption" gutterBottom>
                    {t('EDITED_BY')}
                    {userName}
                  </Typography>
                  <Box>
                    <ConfirmationDialog
                      ref={dialogRef}
                      open={open}
                      handleClose={handleClose}
                      handleConfirm={() => {}}
                      titleText={t('ARE_YOU_SURE')}
                      contentText={t('ANY_UNSAVED_CHANGES_WILL_BE_LOST')}
                      cancelText={t('CANCEL')}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Box>
      </CardContent>
    </Card>
  );
};
export default UserProfile;
