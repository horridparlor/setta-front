import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  AccessRightsRequired,
  createFullAccessRightsFromPartial,
} from '../../components/user-management/CreateUser';
import { RoleAccessRightsCheckboxesWidget } from '../../components/user-management/RoleCheckboxesWidget';
import { useUsersWithRoles } from '../user-management/userUsersAndRoles';
import { useCallback } from 'react';
import { UserRole } from '../../api/types';
import { t } from 'i18next';

export type RoleEditorWidgetProps = {
  name: string;
  accessRights: AccessRightsRequired;
  onChange: (role: {
    name: string;
    accessRights: AccessRightsRequired;
  }) => void;
};

export const RoleEditorWidget: React.FC<RoleEditorWidgetProps> = ({
  name,
  accessRights,
  onChange,
}) => {
  const { roles } = useUsersWithRoles();

  // Handle copying access rights from a selected role
  const copyAccessRightsFromRole = useCallback(
    (copyFromRole: UserRole | null) => {
      if (copyFromRole) {
        onChange({
          name,
          accessRights: createFullAccessRightsFromPartial(
            copyFromRole.accessRights
          ),
        });
      }
    },
    [name]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          paddingBottom: 2,
        }}
      >
        <FormControl fullWidth>
          <TextField
            fullWidth
            label="Name of the role"
            value={name}
            required
            placeholder="Name of the role"
            onChange={e => {
              onChange({ name: e.target.value, accessRights });
            }}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>
            {t('COPY_ACCESS_RIGHTS_FROM_AN_EXISTING_ROLE')}
          </InputLabel>
          <Select
            fullWidth
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
      <Typography sx={{ marginBottom: 2 }} variant="h5">
        {t('SELECT_ACCESS_RIGHTS')}
      </Typography>
      <RoleAccessRightsCheckboxesWidget
        value={accessRights}
        onChange={v => {
          onChange({ name, accessRights: v });
        }}
      />
    </Box>
  );
};
