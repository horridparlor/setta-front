import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  TextField,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { fetchLoggedInUser, fetchUserById } from '../../api/userManagementApi';
import { useTranslation } from 'react-i18next';

interface UserProfileProps {
  userId?: string; // Optional user ID to fetch another user's data
}

//testfile
const UserProfile = ({ userId }: UserProfileProps) => {
  const { t } = useTranslation();

  // State to store user data
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data;
        if (userId) {
          data = await fetchUserById(userId);
        } else {
          data = await fetchLoggedInUser();
        }
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) {
    return <Typography variant="h6">"LOADING"</Typography>;
  }

  if (!userData) {
    return <Typography variant="h6">"NO_USER_DATA"</Typography>;
  }

  // Destructure user data for rendering
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    penName,
    userID,
    isActive,
    activationDate,
    role,
  } = userData;
  const userName = `${firstName}.${lastName}`.toLowerCase();

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
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* Personal Information */}
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {t('PERSONAL_INFORMATION')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                value={firstName || ''}
                label={'FIRST_NAME'}
                size="medium"
                variant="standard"
                disabled
              />
              <TextField
                value={lastName || ''}
                label={'LAST_NAME'}
                size="medium"
                variant="standard"
                disabled
              />
              <TextField
                value={email || ''}
                label={'EMAIL'}
                size="medium"
                variant="standard"
                disabled
              />
              <TextField
                value={phoneNumber || ''}
                label="PHONE_NUMBER"
                size="medium"
                variant="standard"
                disabled
              />
            </Box>
          </CardContent>

          {/* User Account */}
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {t('USER_ACCOUNT')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Chip
                size="small"
                label={isActive ? 'ACTIVE' : 'INACTIVE'}
                variant="filled"
                color={isActive ? 'success' : 'error'}
              />
              <Typography variant="caption" gutterBottom>
                {t('ACTIVE_SINCE')} {activationDate || 'UNKNOWN'}
              </Typography>
              <TextField
                value={userID || ''}
                label={'USER_ID'}
                size="medium"
                variant="standard"
                disabled
              />
              <TextField
                value={userName || ''}
                label={t('USERNAME')}
                size="medium"
                variant="standard"
                disabled
              />
              <TextField
                value={penName || ''}
                label={'PEN_NAME'}
                size="medium"
                variant="standard"
                disabled
              />
            </Box>
          </CardContent>

          {/* Role Information */}
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {t('ROLE')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" gutterBottom>
                {role || 'UNKNOWN'}
              </Typography>
            </Box>
          </CardContent>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
