import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { useNavigate } from 'react-router';
import { AppPage } from '../../types/navigation';
import { useTranslation } from 'react-i18next';
import { createUser } from '../../api/userManagementApi';
import { createRole } from '../../api/rolesApi';
import { AccessRights, UserRole } from '../../api/types.ts';
import { RoleAccessRightsCheckboxesWidget } from './RoleCheckboxesWidget.tsx';
import { useUsersWithRoles } from '../../pages/user-management/userUsersAndRoles.tsx';

export type AccessRightsRequired = Required<AccessRights>;
export type AccessRightName = keyof AccessRightsRequired;

export const EMPTY_ACCESS_RIGHTS: AccessRightsRequired = Object.freeze({
  canManageAdmins: false,
  canManageUsers: false,
  canRelease: false,
  canMessageAdmins: false,
  canClearContent: false,
  hasUnlimitedTokens: false,
  canMassExport: false,
  canShareTokens: false,
  isRegularUser: false,
  canMessage: false,
  isEmployee: false,
  canCreateContent: false,
  isPriorityUser: false,
  canGenerateImages: false,
  isContentCreator: false,
  autoRefillTokens: false,
  isSuperAdmin: false,
});

export const createFullAccessRightsFromPartial = (
  accessRights: AccessRights
): AccessRightsRequired => {
  const populated: AccessRightsRequired = { ...EMPTY_ACCESS_RIGHTS };
  for (const key in accessRights) {
    populated[key as AccessRightName] =
      accessRights[key as AccessRightName] ?? false;
  }

  return populated;
};

export const ADMIN_LEVEL_ACCESS_RIGHTS: AccessRightName[] = [
  'canManageAdmins',
  'canManageUsers',
  'canRelease',
  'canMessageAdmins',
  'canClearContent',
  'hasUnlimitedTokens',
  'canMassExport',
  'canShareTokens',
];

export const COMMON_ACCESS_RIGHTS: AccessRightName[] = [
  'isRegularUser',
  'canMessage',
  'isEmployee',
  'canCreateContent',
  'isPriorityUser',
  'canGenerateImages',
  'isContentCreator',
  'autoRefillTokens',
];

export const isCommonAccessRight = (accessRight: AccessRightName): boolean =>
  COMMON_ACCESS_RIGHTS.includes(accessRight);

export const isAdminAccessRight = (accessRight: AccessRightName): boolean =>
  ADMIN_LEVEL_ACCESS_RIGHTS.includes(accessRight);

export interface UserCreationRef {
  handleSave: () => void;
}
const UserCreation = () => {
  const { t } = useTranslation();
  const dialogRef = useRef(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userID] = useState('');
  const [password] = useState('testi');
  const [penName, setPenName] = useState('');
  const [accessRights, setAccessRights] = useState<AccessRightsRequired>({
    canManageAdmins: false,
    canManageUsers: false,
    canRelease: false,
    canMessageAdmins: false,
    canClearContent: false,
    hasUnlimitedTokens: false,
    canMassExport: false,
    canShareTokens: false,
    isRegularUser: false,
    canMessage: false,
    isEmployee: false,
    canCreateContent: false,
    isPriorityUser: false,
    canGenerateImages: false,
    isContentCreator: false,
    autoRefillTokens: false,
    isSuperAdmin: false,
  });
  const { roles } = useUsersWithRoles();
  const [open, setOpen] = useState(false);
  const [isActive] = useState(true);
  const userName = `${firstName}.${lastName}`.toLowerCase();
  const [customRoleName, setCustomRoleName] = useState('');
  const [selectedExistingRole, _setSelectedExistingRole] =
    useState<UserRole | null>(null);

  console.log('Role', selectedExistingRole);

  // Handle setting the accessrights fields to those of the role if a role is selected
  const handleRoleSelect = useCallback((newRole: UserRole | null) => {
    if (newRole) {
      console.log('Updating access rights for changed role', newRole);
      setAccessRights(createFullAccessRightsFromPartial(newRole.accessRights));
      setCustomRoleName('');
    }
    _setSelectedExistingRole(newRole);
  }, []);

  // Handle copying access rights from a selected role
  const copyAccessRightsFromRole = useCallback(
    (copyFromRole: UserRole | null) => {
      if (copyFromRole) {
        console.log('Copying access rights from role', copyFromRole);
        setAccessRights(
          createFullAccessRightsFromPartial(copyFromRole.accessRights)
        );
        _setSelectedExistingRole(null);
      }
    },
    []
  );

  // Handle managing the isSuperAdmin field in access rights when other fields are changed
  // This should be done in the backend, but alas
  useEffect(() => {
    const everythingRequiredForSuperAdminIsSelected = Object.entries(
      accessRights
    ).every(v => Boolean(v[1]) || v[0] === 'isSuperAdmin');

    if (
      everythingRequiredForSuperAdminIsSelected &&
      accessRights.isSuperAdmin === false
    ) {
      setAccessRights(prev => ({ ...prev, isSuperAdmin: true }));
    } else if (
      !everythingRequiredForSuperAdminIsSelected &&
      accessRights.isSuperAdmin === true
    ) {
      setAccessRights(prev => ({ ...prev, isSuperAdmin: false }));
    }
  }, [accessRights]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const filteredAccessRights = { ...accessRights };

    const username = `${firstName}.${lastName}`.toLowerCase();

    const isCustomRole = !selectedExistingRole;
    let roleId = selectedExistingRole?.id;

    // Create a new role before the user if a custom set of access rights was selected
    if (isCustomRole && customRoleName) {
      try {
        const roleData = {
          name: customRoleName,
          accessRights: filteredAccessRights,
        };
        const roleCreateResponse = await createRole(roleData);
        roleId = roleCreateResponse?.data?.roleId;

        alert('Custom role created successfully!');
      } catch (error) {
        console.error('Failed to create custom role:', error);
        alert(
          `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    try {
      await createUser({
        username,
        password,
        firstname: firstName,
        lastname: lastName,
        email,
        phoneNumber,
        isActive,
        roleId,
        accessRights: filteredAccessRights,
      });
      alert('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      alert(`Failed to create user: ${error}`);
    }
  };

  const navigate = useNavigate();
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDiscard = () => {
    navigate(AppPage.UserManagement);
    setOpen(false);
  };

  const fetchAccessRightCopies = () => {
    try {
      //this is for copying the accessrights form a selected role but role fetching is nto yet implemented
      //const response = await fetch()
    } catch (error) {
      console.error('Failed to fetch');
    }
  };

  useEffect(() => {
    fetchAccessRightCopies();
  }, []);

  const rowContainerStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 2,
    display: 'flex',
  };

  return (
    <Box>
      <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
        <Typography variant="h4" gutterBottom>
          {t('CREATE_A_NEW_USER')}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={rowContainerStyle}>
            <TextField
              required
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFirstName(event.target.value);
              }}
              label="First name"
              variant="outlined"
              value={firstName}
              fullWidth
            />
            <TextField
              required
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setLastName(event.target.value);
              }}
              label="Last name"
              variant="outlined"
              value={lastName}
              fullWidth
            />
          </Box>
          <Box sx={rowContainerStyle}>
            <TextField
              required
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(event.target.value);
              }}
              label="Email"
              variant="outlined"
              value={email}
              fullWidth
            />
            <TextField
              required
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPhoneNumber(event.target.value);
              }}
              label="Phone number"
              variant="outlined"
              value={phoneNumber}
              fullWidth
            />
          </Box>
          <Box sx={rowContainerStyle}>
            <TextField
              label="Autogenerated userID"
              variant="outlined"
              value={userID}
              fullWidth
              disabled
            />
            <TextField
              label="firstname.lastname"
              placeholder="firstname.lastname"
              variant="outlined"
              value={userName}
              fullWidth
              disabled
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                label="Autogenerated password"
                placeholder="Autogenerated password"
                variant="outlined"
                value={password}
                fullWidth
                disabled
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                label="Pen name"
                onChange={event => {
                  setPenName(event.target.value);
                }}
                placeholder="Pen name"
                variant="outlined"
                value={penName}
                fullWidth
                helperText={t('PEN_NAME_IS_OPTIONAL_AND_WILL_BE_SHOWN')}
              />
            </Box>
          </Box>
          <Box sx={{ marginBottom: 3 }}>
            <FormControlLabel
              control={<Checkbox />}
              label="Send password to user via email"
            />
          </Box>
          <Typography sx={{ marginBottom: 3 }} variant="h5">
            {t('ROLE_AND_ACCESS_RIGHTS')}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="select-role">{t('SELECT_ROLE')}</InputLabel>
              <Select<number>
                required
                id="select-role"
                label="select-role"
                value={selectedExistingRole?.id ?? -1}
                onChange={event => {
                  handleRoleSelect(
                    roles.find(role => role.id === event.target.value) ?? null
                  );
                }}
              >
                {roles.map(role => (
                  <MenuItem key={role.id} value={role.id}>
                    #{role.id} {role.name}
                  </MenuItem>
                ))}
                <MenuItem value={-1} sx={{ display: 'none' }}>
                  Custom role
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>
                {t('COPY_ACCESS_RIGHTS_FROM_AN_EXISTING_ROLE')}
              </InputLabel>
              <Select
                labelId="copy-access-rights"
                id="copy-access-rights"
                label={t('COPY_ACCESS_RIGHTS_FROM_AN_EXISTING_ROLE')}
                value={-1}
              >
                {roles.map(role => (
                  <MenuItem
                    key={role.id}
                    value={role.id}
                    onClick={() => {
                      copyAccessRightsFromRole(role);
                    }}
                  >
                    {role.name}
                  </MenuItem>
                ))}
                <MenuItem value={-1} sx={{ display: 'none' }}>
                  {t('SELECT_ROLE')}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mt: 2 }}></Box>

          <RoleAccessRightsCheckboxesWidget
            value={accessRights}
            onChange={v => {
              setAccessRights(v);
              handleRoleSelect(null);
            }}
          />
          <Box
            sx={{
              marginTop: 3,
              flexDirection: 'column',
              display: selectedExistingRole ? 'none' : 'flex',
            }}
          >
            <TextField
              fullWidth
              label="Custom Role Name"
              value={customRoleName}
              disabled={!!selectedExistingRole}
              required={!selectedExistingRole}
              onChange={e => setCustomRoleName(e.target.value)}
              placeholder="Enter custom role name"
            />
            <Box sx={rowContainerStyle}>
              <FormControlLabel
                control={<Checkbox />}
                label="Save as a new role"
              />
            </Box>
          </Box>
          <Grid2 container sx={{ justifyContent: 'flex-end', marginTop: 2 }}>
            <Button
              onClick={handleClickOpen}
              variant="outlined"
              sx={{ marginRight: 2 }}
            >
              {t('CANCEL')}
            </Button>
            <Button type="submit" variant="contained">
              {t('SAVE')}
            </Button>
          </Grid2>
          <Box>
            <ConfirmationDialog
              ref={dialogRef}
              open={open}
              handleClose={handleClose}
              handleDiscard={handleDiscard}
              titleText={t('ARE_YOU_SURE')}
              contentText={t('ANY_UNSAVED_CHANGES_WILL_BE_LOST')}
              cancelText={t('CANCEL')}
              discardText={t('DISCARD_CHANGES')}
            />
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default UserCreation;
