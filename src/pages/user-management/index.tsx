import Box from "@mui/material/Box"
import HomeBar, { HomeBarRef } from "../../components/common/HomeBar"
import { useRef } from "react";
import UserCreation from "../../components/user-management/create-user";
import { useTranslation } from "react-i18next";

interface UserManagementProps {
    refetch: () => Promise<void>;
}

const onLeavePage = () => {
    const params = new URLSearchParams(location.search);
};

const UserManagementPage = (props: UserManagementProps) => {
    const homeBarRef = useRef<HomeBarRef>(null);
    const { t } = useTranslation();

    const { refetch } = props;
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                overflowX: 'hidden',
            }}
        >
            <Box sx={{ width: '100%', p: 2 }}>
                <HomeBar refetch={refetch} ref={homeBarRef} onLeavePage={onLeavePage} />
            </Box>
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'auto',
                }}
            >
                <UserCreation />
            </Box>
        </Box>
    )
}

export default UserManagementPage;