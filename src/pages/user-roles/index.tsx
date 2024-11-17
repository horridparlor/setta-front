import { useCallback, useRef, useState } from 'react';
import { Box, Button, Grid2 } from '@mui/material';
import HomeBar, { HomeBarRef } from '../../components/common/HomeBar';
import { useTranslation } from 'react-i18next';
import { AccessRights, UserRole } from '../../api/types';
import {
  AccessRightsRequired,
  EMPTY_ACCESS_RIGHTS,
} from '../../components/user-management/CreateUser';
import { RoleEditorWidget } from './roleEditorWidget';
import { useUsersWithRoles } from '../user-management/userUsersAndRoles';
import { createRole } from '../../api/rolesApi';
import { useNavigate } from 'react-router';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { AppPage } from '../../types/navigation';
import { toast } from 'react-toastify';

interface UserRolesPageProps {
  refetch: () => Promise<void>;
}

export type RoleCreationFormState = {
  id: UserRole['id'] | null;
  name: UserRole['name'];
  accessRights: AccessRightsRequired;
};

const DEFAULT_FORM_STATE: RoleCreationFormState = {
  id: null,
  name: '',
  accessRights: EMPTY_ACCESS_RIGHTS,
};
const UserRolesPage = (props: UserRolesPageProps) => {
  const { refetch } = props;
  const { refetchUsersAndRoles } = useUsersWithRoles();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const homeBarRef = useRef<HomeBarRef>(null);
  const [formState, setFormState] =
    useState<RoleCreationFormState>(DEFAULT_FORM_STATE);

  const [confirmExitDialogOpen, setConfirmExitDialogOpen] = useState(false);

  const handleCancel = useCallback(() => {
    const formWasTouched = formState !== DEFAULT_FORM_STATE;
    if (formWasTouched) {
      setConfirmExitDialogOpen(true);
      return;
    }
    navigate(AppPage.UserManagement);
  }, [navigate, formState]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!formState) {
        toast.error('Form state is not set');
        return;
      }
      if (!formState.name || formState.name.trim().length === 0) {
        toast.error('Role name cannot be empty');
        return;
      }
      if (!formState.accessRights) {
        return;
      }
      const filteredAccessRights: AccessRights = { ...formState.accessRights };
      delete filteredAccessRights.isSuperAdmin;

      // If we have no ID, we are creating a new role instead of editing one
      const isCreatingNewRole = formState.id === null;
      if (isCreatingNewRole) {
        try {
          const roleData = {
            name: formState.name,
            accessRights: filteredAccessRights,
          };
          const roleCreateResponse = await createRole(roleData);
          if (roleCreateResponse?.data) {
            await refetchUsersAndRoles();
            navigate(AppPage.UserManagement);
            toast.success('Role created successfully');
          }
        } catch (error) {
          console.error('Failed to create custom role:', error);
          toast.error('Failed to create role');
        }
      }
    },
    [formState, refetchUsersAndRoles, navigate]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflowX: 'hidden',
      }}
    >
      <Box sx={{ width: '100%' }}>
        <HomeBar refetch={refetch} ref={homeBarRef} />
      </Box>
      <form onSubmit={handleSubmit}>
        <Box sx={{ margin: '16px' }}>
          <h1 style={{ marginLeft: 40 }}>{t('CREATE_NEW_ROLE')}</h1>
          {formState && (
            <RoleEditorWidget
              name={formState.name}
              accessRights={formState.accessRights}
              onChange={value => {
                setFormState(prev => {
                  return {
                    ...prev,
                    ...value,
                  };
                });
              }}
            />
          )}
          <Grid2
            container
            sx={{ justifyContent: 'flex-end', marginTop: 2, gap: 2 }}
          >
            <Button type="button" variant="outlined" onClick={handleCancel}>
              {t('CANCEL')}
            </Button>
            <Button type="submit" variant="contained">
              {t('SAVE')}
            </Button>
          </Grid2>
        </Box>
      </form>
      <ConfirmationDialog
        open={confirmExitDialogOpen}
        handleClose={() => setConfirmExitDialogOpen(false)}
        handleConfirm={() => navigate(AppPage.UserManagement)}
        titleText={t('ARE_YOU_SURE')}
        contentText={t('ANY_UNSAVED_CHANGES_WILL_BE_LOST')}
        cancelText={t('CANCEL')}
        confirmText={t('DISCARD_CHANGES')}
      />
    </Box>
  );
};

export default UserRolesPage;
