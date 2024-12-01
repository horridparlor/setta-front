import { Edit, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { UserRole } from '../../api/types';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { AppPage } from '../../types/navigation';
import { toast } from 'react-toastify';
import { deleteRole } from '../../api/rolesApi';
import { t } from 'i18next';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { UserWithRole } from '../../hooks/useUsersWithRoles';

export type RoleTableProps = {
  roles: UserRole[];
  users: UserWithRole[];
  refetch: () => void;
};

export const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  users,
  refetch,
}) => {
  const navigate = useNavigate();

  const roleIdToUserMapping = useMemo(() => {
    const roleIdsInUseBy: Record<number, UserWithRole[]> = {};

    users.forEach(user => {
      if (!roleIdsInUseBy[user.roleId]) {
        roleIdsInUseBy[user.roleId] = [];
      }

      roleIdsInUseBy[user.roleId].push(user);
    });
    return roleIdsInUseBy;
  }, [users]);

  const [searchText, setSearchText] = useState('');

  const filteredRoles = useMemo(() => {
    return roles.filter(role => {
      const search = searchText.toLowerCase().trim();
      return role.name.toLowerCase().includes(search);
    });
  }, [roles, searchText]);

  type RoleTypeFilter = {
    name: string;
    value: string;
  };

  const roleTypeFilters: Record<string, RoleTypeFilter> = {
    'Show All': { name: 'Show All', value: 'Show All' },
    Customized: { name: 'Customized', value: 'Customized' },
  };

  const [roleTypeFilter, setRoleTypeFilter] = useState<RoleTypeFilter>(
    roleTypeFilters['Show All']
  );

  const [confirmingDeletionOfRole, setConfirmDeletionOfRole] =
    useState<UserRole | null>(null);

  const handleDeleteRoleId = async (roleId: number) => {
    try {
      await deleteRole(roleId);
      await refetch();
      toast.success('Role deleted successfully');
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete role');
    }
    setConfirmDeletionOfRole(null);
  };

  const handleCreateNewRoleClick = () => {
    navigate(AppPage.UserRoles);
  };

  const roleColumns: GridColDef<UserRole>[] = [
    { field: 'name', headerName: 'Role', flex: 1 },
    {
      field: 'custom',
      headerName: 'Type',
      flex: 1,
      renderCell: _params => {
        return <span>Role types</span>;
      },
    },
    { field: 'updatedAt', headerName: 'Last Edited', flex: 1 },
    {
      field: 'options',
      headerName: 'Options',
      flex: 1,
      renderCell: params => (
        <>
          <IconButton>
            <Edit />
          </IconButton>
          <Tooltip
            title={
              <>
                {roleIdToUserMapping[params.row.id]?.length > 0 && (
                  <div>
                    Role cannot be deleted because it is in use by
                    {roleIdToUserMapping[params.row.id]!.map(user => (
                      <div key={user.id}>
                        {user.firstname} {user.lastname}
                      </div>
                    ))}
                  </div>
                )}
                {!roleIdToUserMapping[params.row.id] && <div>Delete role</div>}
              </>
            }
          >
            <span>
              <IconButton
                onClick={() => {
                  setConfirmDeletionOfRole(params.row);
                }}
                sx={{ color: false ? 'grey' : 'default' }}
                disabled={roleIdToUserMapping[params.row.id]?.length > 0}
              >
                <Delete />
              </IconButton>
            </span>
          </Tooltip>
        </>
      ),
      align: 'right',
    },
  ];

  return (
    <>
      <ConfirmationDialog
        open={confirmingDeletionOfRole !== null}
        handleClose={() => setConfirmDeletionOfRole(null)}
        handleConfirm={() => handleDeleteRoleId(confirmingDeletionOfRole!.id)}
        contentText={`Are you sure you want to delete the role ${confirmingDeletionOfRole?.name}? This user role will be deleted permanently and cannot be recovered.`}
        titleText={'Delete Role'}
        confirmText={t('DELETE')}
      />
      <Card sx={{ m: 1, p: 1, width: '90%' }}>
        <CardHeader title="Roles and Access Rights" />
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <TextField
              value={searchText}
              onChange={event => setSearchText(event.target.value)}
              label="Search"
              variant="outlined"
              sx={{ width: '30%' }}
            />
            <FormControl variant="outlined" sx={{ width: '20%' }}>
              <InputLabel id="filter">Role Type</InputLabel>
              <Select
                id="role-type"
                label="role-type"
                value={roleTypeFilter.name}
              >
                {Object.keys(roleTypeFilters).map(filterName => (
                  <MenuItem
                    key={filterName}
                    value={filterName}
                    onClick={() =>
                      setRoleTypeFilter(roleTypeFilters[filterName])
                    }
                  >
                    {filterName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              data-testid="create-new-role-button"
              variant="contained"
              sx={{ ml: 'auto' }}
              onClick={handleCreateNewRoleClick}
            >
              Create a New Role
            </Button>
          </Box>

          <Box sx={{ mt: 2 }}>
            <DataGrid
              rows={filteredRoles}
              columns={roleColumns}
              disableRowSelectionOnClick
            />
          </Box>
        </CardContent>
      </Card>
    </>
  );
};
