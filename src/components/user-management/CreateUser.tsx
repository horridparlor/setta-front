import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { useNavigate } from 'react-router';
import { AppPage } from '../../types/navigation';
import { useTranslation } from 'react-i18next';
import { createUser } from '../../api/userManagementApi';
import { listRoles, createRole } from '../../api/rolesApi';
import { UserRole } from '../../api/types.ts';

const defaultRoles: string[] = [
  'SuperAdmin',
  'Admin',
  'Designer',
  'Releaser',
  'Custom role',
];
const adminCheckboxLabels = [
  'canManageAdmins',
  'canManageImageGeneration',
  'canManageUsers',
  'canRelease',
  'canMessageAdmins',
  'canClearContent',
  'hasUnlimitedTokens',
  'canMassExport',
  'canShareTokens',
  'canManageCards',
];
const commonCheckboxLabels = [
  'isRegularUser',
  'canMessage',
  'isEmployee',
  'canCreateContent',
  'isPriorityUser',
  'canGenerateImages',
  'isContentCreator',
  'autoRefillTokens',
];

export interface UserCreationRef {
  handleSave: () => void;
}
type CheckboxState = {
  [label: string]: boolean;
};
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
  const [role, setRole] = useState('');
  const [accessRights, setAccessRights] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);
  const [isActive] = useState(true);
  const [roleId, setRoleId] = useState<number | undefined>();
  const userName = `${firstName}.${lastName}`.toLowerCase();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [customRoleName, setCustomRoleName] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);

  // Fetch roles from the backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await listRoles();

        if (Array.isArray(response)) {
          setRoles(response);
        } else if (response && Array.isArray(response)) {
          setRoles(response);
        } else {
          console.error('Roles data is missing in the response:', response);
        }
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const initialAccessRights = [
      ...adminCheckboxLabels,
      ...commonCheckboxLabels,
    ].reduce((acc, label) => ({ ...acc, [label]: false }), {});
    setAccessRights(initialAccessRights);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const filteredAccessRights = { ...accessRights };
    delete filteredAccessRights.isSuperAdmin;

    const username = `${firstName}.${lastName}`.toLowerCase();
    let customRoleId;

    if (isCustomRole && customRoleName) {
      try {
        const roleData = {
          name: customRoleName,
          accessRights: filteredAccessRights,
        };
        const response2 = await createRole(roleData);
        customRoleId = response2?.data?.roleId;

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
        roleId: customRoleId || roleId,
        accessRights: filteredAccessRights,
      });
      alert('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      alert(`Failed to create user: ${error}`);
    }
  };

  // Admin level access rights
  const [checkedAdminBoxes, setCheckedAdminBoxes] = useState<CheckboxState>(
    adminCheckboxLabels.reduce((acc, label) => ({ ...acc, [label]: false }), {})
  );

  // Common level access rights
  const [checkedCommonBoxes, setCheckedCommonBoxes] = useState<CheckboxState>(
    commonCheckboxLabels.reduce(
      (acc, label) => ({ ...acc, [label]: false }),
      {}
    )
  );

  const isAllAdminSelected = Object.values(checkedAdminBoxes).every(
    checked => checked
  );

  const isAllCommonSelected = Object.values(checkedCommonBoxes).every(
    checked => checked
  );

  const handleAdminCheckboxChange = (label: string) => {
    setCheckedAdminBoxes(prev => {
      const newCheckedState = !prev[label];
      const updatedAdminBoxes = { ...prev, [label]: newCheckedState };
      setAccessRights(prevAccessRights => ({
        ...prevAccessRights,
        [label]: newCheckedState,
      }));

      return updatedAdminBoxes;
    });
  };

  const handleCommonCheckboxChange = (label: string) => {
    setCheckedCommonBoxes(prev => {
      const newCheckedState = !prev[label];
      const updatedCommonBoxes = { ...prev, [label]: newCheckedState };
      setAccessRights(prevAccessRights => ({
        ...prevAccessRights,
        [label]: newCheckedState,
      }));

      return updatedCommonBoxes;
    });
  };

  const handleAdminSelectAllChange = () => {
    const newCheckedState = !isAllAdminSelected;
    const updatedBoxes = adminCheckboxLabels.reduce(
      (acc, label) => ({ ...acc, [label]: newCheckedState }),
      {}
    );
    const updatedAccessRights = {
      ...accessRights,
      ...updatedBoxes,
      ...updatedBoxes,
      isSuperAdmin: newCheckedState,
    };

    setCheckedAdminBoxes(updatedBoxes);
    setCheckedCommonBoxes(updatedBoxes);
    if (!isAllCommonSelected) {
      handleCommonSelectAllChange();
    }
    setAccessRights(updatedAccessRights);

    // Set roleId to 2 if all are checked, or reset if not
    // this needs updating to suit the customer wihses of
    setRoleId(newCheckedState ? 2 : undefined);
    setCheckedAdminBoxes(updatedBoxes);
  };

  const handleCommonSelectAllChange = () => {
    const newCheckedState = !isAllCommonSelected;
    const updatedBoxes = commonCheckboxLabels.reduce(
      (acc, label) => ({ ...acc, [label]: newCheckedState }),
      {}
    );
    setCheckedCommonBoxes(updatedBoxes);
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    const selectedRoleName = event.target.value;
    setRole(selectedRoleName);

    const selectedRole = roles.find(r => r.name === selectedRoleName);
    if (selectedRole) {
      setAccessRights(selectedRole.accessRights);
      setRoleId(selectedRole.id);
      setIsCustomRole(false);
    } else if (selectedRoleName === 'Custom role') {
      setAccessRights({});
      setIsCustomRole(true);
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
              <Select
                required
                labelId="select-role"
                id="select-role"
                value={role}
                label="Select role"
                onChange={handleRoleChange}
              >
                {roles.map(role => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>
                {t('COPY_ACCESS_RIGHTS_FROM_AN_EXISTING_ROLE')}
              </InputLabel>
              <Select
                labelId="copy-access-rights"
                id="copy-access-rights"
                value={role}
                onChange={handleRoleChange}
                label={t('COPY_ACCESS_RIGHTS_FROM_AN_EXISTING_ROLE')}
              >
                {defaultRoles.map(role => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mt: 2 }}></Box>

          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              backgroundColor: 'white',
              px: 1,
              transform: 'translate(10px, -12px)',
              zIndex: 1,
            }}
          >
            {t('ADMIN_LEVEL_ACCESS_RIGHTS')}
          </Typography>
          <FormControl
            fullWidth
            sx={{
              border: '1px solid red',
              borderRadius: '4px',
              paddingTop: '8px',
              paddingLeft: '8px',
              paddingBottom: '8px',
            }}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAllAdminSelected}
                    onChange={handleAdminSelectAllChange}
                  />
                }
                label={'isSuperAdmin'}
              />
              <Divider />
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 1,
                }}
              >
                {adminCheckboxLabels.map(label => (
                  <FormControlLabel
                    key={label}
                    control={
                      <Checkbox
                        checked={checkedAdminBoxes[label]}
                        onChange={() => handleAdminCheckboxChange(label)}
                      />
                    }
                    label={t(label, { defaultValue: label })}
                  />
                ))}
              </Box>
            </FormGroup>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                backgroundColor: 'white',
                px: 1,
                transform: 'translate(10px, -12px)',
                zIndex: 1,
              }}
            >
              {t('COMMON_ACCESS_RIGHTS')}
            </Typography>
            <FormControl
              fullWidth
              sx={{
                border: '1px solid blue',
                borderRadius: '4px',
                paddingTop: '8px',
                paddingLeft: '8px',
                paddingBottom: '8px',
              }}
            >
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAllCommonSelected}
                      onChange={handleCommonSelectAllChange}
                    />
                  }
                  label={t('SELECT_ALL')}
                />
                <Divider />
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 1,
                  }}
                >
                  {commonCheckboxLabels.map(label => (
                    <FormControlLabel
                      key={label}
                      control={
                        <Checkbox
                          checked={checkedCommonBoxes[label]}
                          onChange={() => handleCommonCheckboxChange(label)}
                        />
                      }
                      label={t(label, { defaultValue: label })}
                    />
                  ))}
                </Box>
              </FormGroup>
            </FormControl>
          </Box>
          <Box sx={{ marginTop: 3, display: 'flex' }}>
            <TextField
              fullWidth
              label="Custom Role Name"
              value={customRoleName}
              onChange={e => setCustomRoleName(e.target.value)}
              placeholder="Enter custom role name"
            />
          </Box>
          <Box sx={rowContainerStyle}>
            <FormControlLabel
              control={<Checkbox />}
              label="Save as a new role"
            />
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
