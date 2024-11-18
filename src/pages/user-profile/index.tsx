import Box from '@mui/material/Box';
import HomeBar, { HomeBarRef } from '../../components/common/HomeBar';
import { useRef } from 'react';
import UserProfile from '../../components/user-profile/UserProfile';

interface UserProfileProps {
  refetch: () => Promise<void>;
}

const onLeavePage = () => {
  // const params = new URLSearchParams(location.search);
};

const UserProfilePage = (props: UserProfileProps) => {
  const homeBarRef = useRef<HomeBarRef>(null);

  const { refetch } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#244775',
        overflowX: 'hidden',
      }}
    >
      <Box sx={{ width: '100%' }}>
        <HomeBar refetch={refetch} ref={homeBarRef} />
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
        <UserProfile />
      </Box>
    </Box>
  );
};

export default UserProfilePage;
