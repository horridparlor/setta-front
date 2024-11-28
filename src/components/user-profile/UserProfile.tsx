import { Check, Close } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  TextField,
  Typography,
  Button,
  Grid2,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { fetchLoggedInUser, updateUser } from '../../api/userManagementApi';
import { useTranslation } from 'react-i18next';
import { AccessRights } from '../../types/api';

interface UserProfileProps {
  userId?: string; // Optional user ID to fetch another user's data
}

//testfile
const UserProfile = ({ userId }: UserProfileProps) => {
  const { t } = useTranslation();

  // State to store user data
  const [userDataId, setUserDataId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states for editable fields
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Preserve the original value for non-editable fields
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [penName, setPenName] = useState<string | null>(null);
  const [roleName, setRoleName] = useState<string | null>(null);
  const userName = `${firstname}.${lastname}`.toLowerCase();
  const [roleId, setRoleId] = useState<number | null>(null);
  const [_accessRights, setAccessRights] = useState<object | null>(null);

  // State to manage unsaved changes
  const [originalValues, setOriginalValues] = useState<any>(null);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await fetchLoggedInUser();

        // Normalize `isActive` to boolean and preserve it in state
        const activeStatus = Boolean(data);

        setUserDataId(data.id);
        setOriginalValues({ ...data }); // Keep track of original data

        // Set form fields
        setFirstname(data.firstname || '');
        setLastname(data.lastname || '');
        setEmail(data.email || '');
        setPhoneNumber(data.phoneNumber || '');
        setPenName(data.penName || '');
        // setRoleName(data.roleName || '');
        setRoleId(data.roleId);
        setAccessRights(data.accessRights || '');
        setIsActive(activeStatus);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleSave = async () => {
    try {
      const filteredAccessRights: AccessRights = { ..._accessRights };
      delete filteredAccessRights.isSuperAdmin;
      console.log('this is filtered rights: ', filteredAccessRights);
      //const { isSuperAdmin, ...filteredAccessRights } = accessRights;
      const updatedUser = {
        //...userData,
        userId: Number(userDataId), // Ensure userId is included
        username: userName, // Include dynamically computed username
        firstname,
        lastname,
        //penName,
        email,
        phoneNumber,
        roleId,
        accessRights: filteredAccessRights,
      };
      // Normalize and preserve isActive and username
      console.log(updatedUser);
      const response = await updateUser(updatedUser);
      setUserDataId(response.data?.userId ?? null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCancel = () => {
    // Reset fields to original values
    if (originalValues) {
      setFirstname(originalValues.firstname);
      setLastname(originalValues.lastname);
      setEmail(originalValues.email);
      setPhoneNumber(originalValues.phoneNumber);

      // Reset non-editable fields to original value
      setIsActive(Boolean(originalValues.isActive));
      setPenName(originalValues.penName);
      setRoleName(originalValues.roleName);
      setRoleId(originalValues.roleId);
      setAccessRights(originalValues.accessRights);
    }
  };

  if (loading) {
    return <Typography variant="h6">"LOADING"</Typography>;
  }

  if (!userDataId) {
    return <Typography variant="h6">"NO_USER_DATA"</Typography>;
  }

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
              {/* Personal Information */}
              <Box sx={rowContainerStyle}>
                <Box sx={{ pr: 10 }}>
                  <Typography variant="h5" gutterBottom align="inherit">
                    {t('PERSONAL_INFORMATION')}
                  </Typography>
                </Box>
                <Box sx={columnContainerStyle}>
                  <TextField
                    value={firstname || ''}
                    onChange={e => setFirstname(e.target.value)}
                    label={t('FIRST_NAME')}
                    size="medium"
                    variant="standard"
                  />
                  <TextField
                    value={lastname || ''}
                    onChange={e => setLastname(e.target.value)}
                    label={t('LAST_NAME')}
                    size="medium"
                    variant="standard"
                  />
                  <TextField
                    value={email || ''}
                    onChange={e => setLastname(e.target.value)}
                    label={t('EMAIL')}
                    size="medium"
                    variant="standard"
                  />
                  <TextField
                    value={phoneNumber || ''}
                    onChange={e => setPhoneNumber(e.target.value)}
                    label={t('PHONE_NUMBER')}
                    size="medium"
                    variant="standard"
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
          {/* User Account */}
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
                      label={isActive ? 'ACTIVE' : 'INACTIVE'}
                      variant="filled"
                      color={isActive ? 'success' : 'error'}
                      icon={isActive ? <Check /> : <Close />}
                    />
                  </Box>
                  {/*can be implemented if this kind of data is available on backend
                    <Typography variant="caption" gutterBottom>
                      {t('ACTIVE_SINCE')}activationdate 
                    </Typography>*/}
                  <TextField
                    value={userName || ''}
                    label={t('USERNAME')}
                    size="medium"
                    variant="standard"
                    disabled
                  />
                  <TextField
                    value={penName || ''}
                    label={t('PEN_NAME')}
                    size="medium"
                    variant="standard"
                    disabled
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>

          {/* Role Information */}
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
                    {roleName || 'UNKNOWN'}
                  </Typography>

                  <Grid2
                    container
                    sx={{ justifyContent: 'flex-end', marginTop: 2, gap: 2 }}
                  >
                    <Button onClick={handleCancel} variant="outlined">
                      {t('CANCEL')}
                    </Button>
                    <Button onClick={handleSave} variant="contained">
                      {t('SAVE')}
                    </Button>
                  </Grid2>
                  {/*can be implemented if this kind of data is available on backend
                    <Typography variant="caption" gutterBottom>
                      {t('LAST_EDITED')}dd/mm/yyyy
                    </Typography>*/}
                  <Typography variant="caption" gutterBottom>
                    {t('EDITED_BY')}
                    {userName}
                  </Typography>
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
