import { useRef, useState } from 'react'
import { 
  Box, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import WarningIcon from '@mui/icons-material/Warning'
import HomeBar, { HomeBarRef } from '../../components/common/HomeBar'
import AccessRightsForm from '../../components/common/AccessRightsForm'
import { useTranslation } from 'react-i18next'

interface UserRolesPageProps {
  refetch: () => Promise<void>;
}

const UserRolesPage = (props: UserRolesPageProps) => {
  const { refetch } = props
  const { t } = useTranslation(); 
  const homeBarRef = useRef<HomeBarRef>(null)
  const [open, setOpen]= useState(false)
  // Toggling between modes for now in the future use roleId props to determine mode
  const [isEditMode, setIsEditMode]= useState(false)
    
  // Toggling between modes for now
  const handleToggleMode = () => {
    setIsEditMode((prev) => !prev)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflowX: 'hidden',
      }}
    >
      <Box sx={{ width: '100%', p: 2 }}>
        <HomeBar refetch={refetch} ref={homeBarRef} />
      </Box>
      <h1 style={{ marginLeft: 40 }}>
        {isEditMode ? t('EDIT_ROLE'): t('CREATE_NEW_ROLE')}
      </h1>
      <AccessRightsForm/>
      {isEditMode && (
        <Box 
          sx={{
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center', 
            marginTop:10
          }}
        >
          <Button 
            variant='contained'
            onClick={() => setOpen(true)} 
            color="error" 
            endIcon={<DeleteIcon />}
          >
            {t('DELETE_USER_ROLE')}
          </Button>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>
              {t('ARE_YOU_SURE')}
            </DialogTitle>
            <DialogContent>
              <Box 
                sx={{
                  display:'flex',
                  flexDirection:'column',
                  justifyContent:'center',
                  alignItems:'center'
                }}
              >
                <WarningIcon color="error" />
                <DialogContentText sx={{ marginTop: 2 }}>
                  {t('THIS_USER_ROLE_WILL_BE_DELETED_PERMANENTLY_AND_CANNOT_BE_RECOVERED')}
                </DialogContentText>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>{t('CANCEL')}</Button>
              <Button onClick={() => setOpen(false)} color="error">{t('DELETE_ROLE')}</Button>
            </DialogActions>
          </Dialog>
          <Typography variant='body2' >
            {t('DELETING_A_USER_ROLE_IS_AN_IRREVERSIBLE_OPERATION')}
          </Typography>
          <Typography variant='body2' >
            {t('ONCE_THE_ROLE_HAS_BEEN_DELETED_IT_CANNOT_BE_RECOVERED')}
          </Typography>
        </Box>
      )}
      <Button onClick={handleToggleMode}>
        {isEditMode ? 'Switch to create mode' : 'Switch to edit mode'}
      </Button>
      </Box>  
  )  
}

export default UserRolesPage