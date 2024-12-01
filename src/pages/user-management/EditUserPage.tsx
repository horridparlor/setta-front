import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HomeBar, { HomeBarRef } from '../../components/common/HomeBar';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Tooltip,
  Chip,
} from '@mui/material';
import { fetchUserById, updateUser } from '../../api/userManagementApi';
import { createRole } from '../../api/rolesApi';
import { RoleAccessRightsCheckboxesWidget } from '../../components/user-management/RoleCheckboxesWidget';
import {
  AccessRightsRequired,
  createFullAccessRightsFromPartial,
} from '../../components/user-management/CreateUser';
import { UserRole } from '../../api/types';
import { toast } from 'react-toastify';
import NewTokenRequest from '../../components/user-profile/NewTokenRequest';
import { useUsersWithRoles } from '../../hooks/useUsersWithRoles';
import { Check, Close } from '@mui/icons-material';

interface EditUserPageProps {
  refetch: () => Promise<void>;
}

const EditUserPage = (props: EditUserPageProps) => {
  const { refetch } = props;
  const homeBarRef = useRef<HomeBarRef>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [penName, setPenName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [customRoleName, setCustomRoleName] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [accessRights, setAccessRights] = useState<AccessRightsRequired>(
    createFullAccessRightsFromPartial({})
  );
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { roles, fetchUsersAndRoles } = useUsersWithRoles();

  useEffect(() => {
    const fetchUserAndRole = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const user = await fetchUserById(Number(id));
        setFirstName(user.firstname);
        setLastName(user.lastname);
        setEmail(user.email || '');
        setPhoneNumber(user.phoneNumber || '');
        setPenName(user.penName || '');
        setUserId(String(user.id));
        setUsername(user.username);
        setAccessRights(createFullAccessRightsFromPartial(user.accessRights));
        setIsActive(Boolean(user.isActive));

        // Match user's roleId with available roles and set roleName
        const role = roles.find(role => role.id === user.roleId);
        if (role) {
          setSelectedRole(role); // Set the selected role
        } else {
          setSelectedRole(null); // Clear selection if no match
        }
      } catch (error) {
        console.error('Error fetching user or role:', error);
        toast.error('Failed to fetch user or role data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndRole();
  }, [id, roles]);

  const handleRoleSelect = useCallback(
    (roleId: number) => {
      const role = roles.find(role => role.id === roleId);
      if (role) {
        setAccessRights(createFullAccessRightsFromPartial(role.accessRights));
        setCustomRoleName('');
        setSelectedRole(role);
      }
    },
    [roles]
  );

  const handleCopyAccessRights = useCallback(
    (roleId: number) => {
      const role = roles.find(role => role.id === roleId);
      if (role) {
        setAccessRights(createFullAccessRightsFromPartial(role.accessRights));
        setSelectedRole(null);
      }
    },
    [roles]
  );

  const handleSave = async () => {
    if (!userId) {
      toast.error('User ID is missing!');
      return;
    }

    const { isSuperAdmin, ...filteredAccessRights } = accessRights;

    let roleId = selectedRole?.id;
    if (!selectedRole && customRoleName) {
      try {
        const roleResponse = await createRole({
          name: customRoleName,
          accessRights: filteredAccessRights,
        });
        if (roleResponse?.data?.roleId) {
          roleId = roleResponse.data.roleId;
          toast.success('Custom role created successfully.');
        } else {
          throw new Error('Role creation failed: Missing roleId in response.');
        }
      } catch (error) {
        console.error('Error creating role:', error);
        toast.error('Failed to create custom role.');
        return;
      }
    }

    try {
      await updateUser({
        userId: Number(userId),
        firstname: firstName,
        lastname: lastName,
        username,
        email,
        phoneNumber,
        penName,
        accessRights: filteredAccessRights,
        isActive,
        roleId,
      });
      toast.success('User updated successfully.');
      await fetchUsersAndRoles();
      navigate('/user-management');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user.');
    }
  };

  const toggleActivation = () => {
    setIsActive(prev => !prev);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#244775',
        overflowX: 'hidden',
        marginBottom: 2,
      }}
    >
      <Box sx={{ width: '100%' }}>
        <HomeBar refetch={refetch} ref={homeBarRef} />
      </Box>
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 3,
          maxWidth: 800,
          margin: 'auto',
          borderRadius: 2,
          boxShadow: 3,
          marginTop: 3,
        }}
      >
        <NewTokenRequest />
        <Typography variant="h4" sx={{ mb: 3 }}>
          Personal Information
        </Typography>
        <Box>
          <TextField
            label="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Phone Number"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
        </Box>
        <Typography variant="h4" sx={{ mt: 3 }}>
          User Account
        </Typography>
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 2,
            }}
          >
            <Typography variant="subtitle1">Status:</Typography>
            <Tooltip title={isActive ? 'Deactivate' : 'Activate'}>
              <Chip
                clickable
                label={isActive ? 'Active' : 'Deactivated'}
                color={isActive ? 'success' : 'error'}
                icon={isActive ? <Close /> : <Check />}
                onClick={toggleActivation}
              />
            </Tooltip>
          </Box>
          <TextField
            label="UserID"
            value={userId}
            fullWidth
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            label="Username"
            value={username}
            fullWidth
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            label="Pen Name"
            value={penName}
            onChange={e => setPenName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
        </Box>
        <Typography variant="h4" sx={{ mt: 3 }}>
          Role and Access Rights
        </Typography>
        <Typography variant="h5" sx={{ mt: 2, marginBottom: 2 }}>
          Current Role: {selectedRole?.name || 'None'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, mt: 2, mb: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="copy-access-rights-label">
              Copy Access Rights
            </InputLabel>
            <Select
              labelId="copy-access-rights-label"
              value={selectedRole?.id ?? ''}
              onChange={e => {
                const roleId = Number(e.target.value);
                handleCopyAccessRights(roleId);
                handleRoleSelect(roleId);
              }}
              label="Copy Access Rights"
            >
              {roles.map(role => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <RoleAccessRightsCheckboxesWidget
          value={accessRights}
          onChange={setAccessRights}
        />
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate('/user-management')}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditUserPage;
