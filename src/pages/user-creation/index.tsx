import Box from '@mui/material/Box';
import HomeBar, { HomeBarRef } from '../../components/common/HomeBar';
import { useRef } from 'react';
import UserCreation from '../../components/user-management/CreateUser';

interface UserCreationProps {
  refetch: () => Promise<void>;
}

const onLeavePage = () => {
  // const params = new URLSearchParams(location.search);
};

const UserCreationPage = (props: UserCreationProps) => {
  const homeBarRef = useRef<HomeBarRef>(null);

  const { refetch } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
      }}
    >
      <Box sx={{ width: '100%' }}>
        <HomeBar refetch={refetch} ref={homeBarRef} onLeavePage={onLeavePage} />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'auto',
          p: 2,
        }}
      >
        <UserCreation />
      </Box>
    </Box>
  );
};

export default UserCreationPage;
