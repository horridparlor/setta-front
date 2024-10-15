import { useState } from 'react'
import { 
  Box, 
  TextField, 
  Select, 
  FormControl,
  MenuItem,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid2,
  Button,
  InputLabel,
  SelectChangeEvent
} from '@mui/material'
import { useTranslation } from 'react-i18next';

const checkboxLabels = [
  'CREATE NEW USER ACCOUNTS', 'CREATE NEW CARDS', 'TRIAL IMAGE GENERATION',
  'EDIT OTHER USER ACCOUNTS', 'EDIT CARDS NOT MADE BY YOU', 'MONTHLY TOKEN ACCESS',
  'ACTIVATE/DEACTIVATE USERS', 'DELETE CARDS', 'UNLIMITED IMAGE GENERATION',
  'ACCEPT TOKEN REQUESTS', 'CREATE EXPANSIONS', 'DELETE USER ACCOUNTS',
  'CREATE TOKEN REQUESTS', 'DELETE EXPANSIONS', 'PUBLISH AND PUSH CONTENT'
]
type CheckboxState = {
  [label: string]: boolean
}
const AccessRightsForm = () => {
  const [roleName, setRoleName] = useState('');
  const [role, setRole] = useState('')
  const { t } = useTranslation()
  const [checkedBoxes, setCheckedBoxes] = useState<CheckboxState>(
   checkboxLabels.reduce((acc, label) => ({ ...acc, [label]: false}), {})
  )
  const isAllSelected =  Object.values(checkedBoxes).every((checked)=>checked)

  const handleRoleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoleName(e.target.value)
  };

  const handleRoleChange = (e: SelectChangeEvent) => {
    setRole(e.target.value)
  }

  const handleCheckboxChange = (label: string) => {
    setCheckedBoxes((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  const handleSelectAllChange = () => {
    const newCheckedState = !isAllSelected
    const updatedBoxes = checkboxLabels.reduce(
      (acc, label) => ({ ...acc, [label]: newCheckedState}), {}
    )
    setCheckedBoxes(updatedBoxes)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //Logic for submitting form
    e.preventDefault()
  }
  return (
      <Box display={'flex'} justifyContent={'center'} sx={{marginTop:10}}>
        <form onSubmit={handleSubmit}>
          <Box display='flex' gap={2}>
            <TextField
              fullWidth
              required
              label={t('NAME OF THE ROLE')}
              value={roleName}
              onChange={handleRoleNameChange}
            />
            <FormControl fullWidth>
              <InputLabel>{t('COPY ACCESS RIGHTS FROM AN EXISTING ROLE')}</InputLabel>
              <Select
                value={role}
                onChange={handleRoleChange}
                label={t('COPY ACCESS RIGHTS FROM AN EXISTING ROLE')}
              >
                <MenuItem value='Superadmin'>
                  {t('SUPERADMIN')}
                </MenuItem>
                <MenuItem value='Admin'>
                  {t('ADMIN')}
                </MenuItem>
                <MenuItem value='Designer'>
                  {t('DESIGNER')}
                </MenuItem>
                <MenuItem value='Releaser'>
                  {t('RELEASER')}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <h2>{t('SELECT ACCESS RIGHTS')}</h2>
            <FormControl>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAllSelected}
                      onChange={handleSelectAllChange}
                    />
                  }
                  label={t('SELECT ALL')}
                />
                <Divider/>
                <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={1}>                  
                  {checkboxLabels.map((label) => (
                    <FormControlLabel
                      key={label}
                      control={
                        <Checkbox
                        checked={checkedBoxes[label]}
                        onChange={() => handleCheckboxChange(label)}
                        />
                      }
                      label={t(label, { defaultValue: label })} 
                    />
                  ))}
                </Box>
                <Divider/>
              </FormGroup>
                <Grid2 container justifyContent='flex-end' sx={{marginTop: 2}}>
                  <Button variant='outlined' sx={{marginRight: 2}}>{t('CANCEL')}</Button>
                  <Button type='submit' variant='contained'>{t('SAVE')}</Button>
                </Grid2>
            </FormControl>
          </form>
      </Box>
  )
}

export default AccessRightsForm