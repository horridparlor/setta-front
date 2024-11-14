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
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { UserRole } from '../../api/types';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AppPage } from '../../types/navigation';
import { useUsersWithRoles } from './userUsersAndRoles';

export type RoleTableProps = {};

export const RoleTable: React.FC<RoleTableProps> = () => {
  const { roles } = useUsersWithRoles();
  const navigate = useNavigate();
  const [selectedUserRole, setSelectedUserRole] = useState<UserRole | null>(
    null
  );

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
      renderCell: _params => (
        <>
          <IconButton>
            <Edit />
          </IconButton>
          <IconButton disabled sx={{ color: false ? 'grey' : 'default' }}>
            <Delete />
          </IconButton>
        </>
      ),
      align: 'right',
    },
  ];

  return (
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
          <TextField label="Search" variant="outlined" sx={{ width: '30%' }} />
          <FormControl variant="outlined" sx={{ width: '20%' }}>
            <InputLabel id="select-role">Select Role</InputLabel>
            <Select<number>
              id="select-role"
              label="select-role"
              value={selectedUserRole?.id ?? -1}
              onChange={event => {
                setSelectedUserRole(
                  roles.find(role => role.id === event.target.value) ?? null
                );
              }}
            >
              <MenuItem value={-1}>Show All</MenuItem>
              {roles.map(role => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ width: '20%' }}>
            <InputLabel id="filter">Filter</InputLabel>
            <Select id="filter" label="filter">
              <MenuItem>Show All</MenuItem>
              <MenuItem>Customized</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            sx={{ ml: 'auto' }}
            onClick={handleCreateNewRoleClick}
          >
            Create a New Role
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          <DataGrid
            rows={roles}
            columns={roleColumns}
            disableRowSelectionOnClick
          />
        </Box>
      </CardContent>
    </Card>
  );
};
