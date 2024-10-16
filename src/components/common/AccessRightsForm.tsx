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
  'CREATE_NEW_USER_ACCOUNTS', 'CREATE_NEW_CARDS', 'TRIAL_IMAGE_GENERATION',
  'EDIT_OTHER_USER_ACCOUNTS', 'EDIT_CARDS_NOT_MADE_BY_YOU', 'MONTHLY_TOKEN_ACCESS',
  'ACTIVATE/DEACTIVATE_USERS', 'DELETE_CARDS', 'UNLIMITED_IMAGE_GENERATION',
  'ACCEPT_TOKEN_REQUESTS', 'CREATE_EXPANSIONS', 'DELETE_USER_ACCOUNTS',
  'CREATE_TOKEN_REQUESTS', 'DELETE_EXPANSIONS', 'PUBLISH_AND_PUSH_CONTENT'
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
      <Box 
        sx={{
        display:'flex',
        justifyContent:'center',
        marginTop:10
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box sx={{display:'flex', gap:2}}>
            <TextField
              fullWidth
              required
              label={t('NAME_OF_THE_ROLE')}
              value={roleName}
              onChange={handleRoleNameChange}
            />
            <FormControl fullWidth>
              <InputLabel>{t('COPY_ACCESS_RIGHTS_FROM_AN_EXISTING_ROLE')}</InputLabel>
              <Select
                value={role}
                onChange={handleRoleChange}
                label={t('COPY_ACCESS_RIGHTS_FROM_AN_EXISTING_ROLE')}
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
          <h2>{t('SELECT_ACCESS_RIGHTS')}</h2>
            <FormControl>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAllSelected}
                      onChange={handleSelectAllChange}
                    />
                  }
                  label={t('SELECT_ALL')}
                />
                <Divider/>
                <Box 
                  sx={{
                  display:'grid' ,
                  gridTemplateColumns:'repeat(3, 1fr)', 
                  gap:1
                  }}
                >                  
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
                <Grid2 container sx={{justifyContent:'flex-end', marginTop: 2}}>
                  <Button variant='outlined' sx={{marginRight: 2}}>{t('CANCEL')}</Button>
                  <Button type='submit' variant='contained'>{t('SAVE')}</Button>
                </Grid2>
            </FormControl>
          </form>
      </Box>
  )
}

export default AccessRightsForm