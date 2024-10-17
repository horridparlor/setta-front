import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid2, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import { useNavigate } from "react-router";
import { AppPage } from "../../types/navigation";
import AccessRightsSelection from "../common/AccessRightsSelection";


export interface UserCreationRef {
    handleSave: () => void;
}

const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;

const defaultRoles: string[] = [
    'SuperAdmin',
    'Admin',
    'Designer',
    'Releaser',
    'Custom role',
]
const userCopies: string[] = [
    'User1, role',
    'User2, role',
    'User3, role',
]
const UserCreation = forwardRef<UserCreationRef>((props, ref) => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userID, setUserID] = useState('');
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [penName, setPenName] = useState('');
    const [role, setRole] = useState('')
    const [userCopy, setUserCopy] = useState([]);
    const [accessRights, setAccessRights] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const formattedUserName = `${firstName}.${lastName}`.toLowerCase();
        setUsername(formattedUserName);
    }, [firstName, lastName]);

    const dialogRef = useRef(null);

    const handleSave = () => {
        console.log("Save function called")
    }
    const handleRoleChange = (event: SelectChangeEvent) => {
        setRole(event.target.value as string);
    };
    const handleAccessRightsChange = (event: SelectChangeEvent) => {
        setAccessRights(event.target.value as string);
    };
    const handleFirstNameChange = (event: SelectChangeEvent) => {
        setFirstName(event.target.value as string);
        console.log(userName)
        setUsername(userName + "." + lastName)
    }
    const handleLastNameChange = (event: SelectChangeEvent) => {
        setLastName(event.target.value as string);
    }
    const handleEmailChange = (event: SelectChangeEvent) => {
        setEmail(event.target.value as string);
    }
    const handleUserIdChange = (event: SelectChangeEvent) => {
        setPhoneNumber(event.target.value as string);
    }
    const handleFullNameChange = (event: SelectChangeEvent) => {

    }
    const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSendPasswordChecked({
            ...state,
            [event.target.name]: event.target.checked,
        });
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        //Logic for submitting form
        e.preventDefault()
    }
    const navigate = useNavigate();
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleDiscard = () => {
        navigate(AppPage.CardCatalogue)
        setOpen(false);
    }
    useImperativeHandle(ref, () => ({
        handleSave,
    }));

    const fetchAccessRightCopies = () => {
        try {
            //const response = await fetch('/accessRights')
            setUserCopy(userCopies)
        } catch (error) {
            console.error('Failed to fetch')
        }
    }
    useEffect(() => {
        fetchAccessRightCopies();
    }, []);
    const rowContainerStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginBottom: 2,
        display: 'flex',
    };
    return (
        <Box>
            <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Create a new user
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={rowContainerStyle}>
                        <TextField
                            required
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setFirstName(event.target.value);
                            }}
                            label="First name"
                            variant="outlined"
                            value={firstName}
                            fullWidth
                        />
                        <TextField
                            required
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setLastName(event.target.value);
                            }}
                            label="Last name"
                            variant="outlined"
                            value={lastName}
                            fullWidth
                        />
                    </Box>
                    <Box sx={rowContainerStyle}>
                        <TextField
                            required
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setEmail(event.target.value);
                            }}
                            label="Email"
                            variant="outlined"
                            value={email}
                            fullWidth
                        />
                        <TextField
                            required
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setPhoneNumber(event.target.value);
                            }}
                            label="Phone number"
                            variant="outlined"
                            value={phoneNumber}
                            fullWidth
                        />
                    </Box>
                    <Box sx={rowContainerStyle}>
                        <TextField
                            label="Autogenerated userID"
                            variant="outlined"
                            value={userID}
                            fullWidth
                            disabled
                        />
                        <TextField
                            label="firstname.lastname"
                            placeholder="firstname.lastname"
                            variant="outlined"
                            value={userName}
                            fullWidth
                            disabled
                        />
                    </Box>
                    <Box sx={rowContainerStyle}>
                        <Box>
                            <TextField
                                label="Autogenerated password"
                                placeholder="autogenerated password"
                                variant="outlined"
                                value={password}
                                fullWidth
                                disabled
                            />
                        </Box>
                        <Box>
                            <TextField
                                label="Pen name"
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setPenName(event.target.value);
                                }}
                                placeholder="Pen name"
                                variant="outlined"
                                value={penName}
                                fullWidth
                                helperText="Pen name is optional and will be shown on published material instead of Your real name."
                            />
                        </Box>
                    </Box>
                    <Box sx={{ marginBottom: 3 }}>
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Send password to user via email" />
                    </Box>
                    <Typography variant="h5">
                        Role and access rights
                    </Typography>
                    <FormControl>
                        <AccessRightsSelection />
                    </FormControl>
                    <Box sx={{ marginTop: 3 }}>
                        <TextField label="Create a new custom role" variant="outlined" size="medium" />
                    </Box>
                    <Box sx={rowContainerStyle}>
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Save as a new role" />
                    </Box>
                    <Grid2 container sx={{ justifyContent: 'flex-end', marginTop: 2 }}>
                        <Button onClick={handleClickOpen} variant='outlined' sx={{ marginRight: 2 }}>CANCEL</Button>
                        <Button type='submit' variant='contained'>SAVE</Button>
                    </Grid2>
                    <Box>
                        <ConfirmationDialog ref={dialogRef} open={open} handleClose={handleClose} handleDiscard={handleDiscard} />
                    </Box>
                </form>
            </Box>

        </Box>
    );
})

export default UserCreation;