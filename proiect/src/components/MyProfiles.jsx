import { useEffect, useState} from "react";
import { useAuth } from "../contexts/authContext";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { updatePassword as firebaseUpdatePassword } from "firebase/auth";
import Header from "./Header";
import { Button, Box, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Grid, Card } from "@mui/material";
import './MyProfile.css';

const MyProfiles = () => {
    const { currentUser} = useAuth();
    const [open, setOpen] = useState(false);
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        birthdate: ''
    });
    const [editData, setEditData] = useState({});
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (currentUser) {
            const fetchUserData = async () => {
                try {
                    const userDoc = doc(db, 'users', currentUser.uid);
                    const userSnapshot = await getDoc(userDoc);
                    if (userSnapshot.exists()) {
                        setUserData(userSnapshot.data());
                    } else {
                        console.error("User document not found");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };

            fetchUserData();
        }
    }, [currentUser]);

    const handleEditOpen = () => {
        setEditData(userData);
        setPassword('');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async () => {
        try {
            const userDoc = doc(db, 'users', currentUser.uid);
            await updateDoc(userDoc, editData);
            setUserData(editData);

            // Update password if provided
            if (password) {
                await firebaseUpdatePassword(currentUser, password);
                alert('Password updated successfully.');
            }

            handleClose();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this account?')) {
            try {
                const userDocRef = doc(db, 'users', currentUser.uid);
                await deleteDoc(userDocRef);
                alert('Account deleted successfully.');
                // Add logic to sign out or redirect
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Error deleting user.');
            }
        }
    };

    return (
        <Box>
            <Header />
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '80vh' }}>
                <Grid item xs={12} sm={8} md={6}>
                    <div className="card__container">
                        <Card sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#dcdcdc' }}>
                            <CardContent>
                                <Typography variant="h5" align="center" gutterBottom sx={{ textTransform: 'uppercase' }}>
                                    My Profile
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body1"><strong>First Name:</strong> {userData.firstName}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body1"><strong>Last Name:</strong> {userData.lastName}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body1"><strong>Email:</strong> {userData.email}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body1"><strong>Date of Birth:</strong> {userData.birthdate}</Typography>
                                    </Grid>
                                    <Grid item xs={5} sm={5}>
                                        <Button color="primary" onClick={handleEditOpen} sx={{ backgroundColor: '#dcdcdc', color: 'rgba(0, 0, 0, 0.9)', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: '#dcdcdc' } }}>
                                            Edit
                                        </Button>
                                    </Grid>
                                    
                                        <Grid item xs={5} sm={5}>
                                            <Button color="secondary" onClick={handleDelete} sx={{ backgroundColor: '#9e1b32', color: '#dcdcdc', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.9)', color: '#dcdcdc' },  marginLeft: 7}}>
                                                Delete Account
                                            </Button>
                                        </Grid>
                                 
                                </Grid>
                            </CardContent>
                        </Card>
                    </div>
                </Grid>
            </Grid>

            <Dialog open={open} onClose={handleClose} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <DialogTitle sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#dcdcdc', textTransform: 'uppercase' }}>Edit Profile</DialogTitle>
                <DialogContent sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#dcdcdc', padding: 3 }}>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="First Name"
                            name="firstName"
                            fullWidth
                            value={editData.firstName}
                            onChange={handleChange}
                            sx={{
                                '& .MuiInputLabel-root': { color: '#dcdcdc' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#dcdcdc' },
                                    '&:hover fieldset': { borderColor: '#dcdcdc' },
                                    '&.Mui-focused fieldset': { borderColor: '#dcdcdc' },
                                },
                                '& .MuiInputBase-input': { color: '#dcdcdc' },
                            }}
                        />
                        <TextField
                            margin="dense"
                            label="Last Name"
                            name="lastName"
                            fullWidth
                            value={editData.lastName}
                            onChange={handleChange}
                            sx={{
                                '& .MuiInputLabel-root': { color: '#dcdcdc' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#dcdcdc' },
                                    '&:hover fieldset': { borderColor: '#dcdcdc' },
                                    '&.Mui-focused fieldset': { borderColor: '#dcdcdc' },
                                },
                                '& .MuiInputBase-input': { color: '#dcdcdc' },
                            }}
                        />
                        <TextField
                            margin="dense"
                            label="Email"
                            name="email"
                            fullWidth
                            value={editData.email}
                            onChange={handleChange}
                            sx={{
                                '& .MuiInputLabel-root': { color: '#dcdcdc' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#dcdcdc' },
                                    '&:hover fieldset': { borderColor: '#dcdcdc' },
                                    '&.Mui-focused fieldset': { borderColor: '#dcdcdc' },
                                },
                                '& .MuiInputBase-input': { color: '#dcdcdc' },
                            }}
                        />
                        <TextField
                            margin="dense"
                            label="Date of Birth"
                            name="birthdate"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={editData.birthdate}
                            onChange={handleChange}
                            sx={{
                                '& .MuiInputLabel-root': { color: '#dcdcdc' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#dcdcdc' },
                                    '&:hover fieldset': { borderColor: '#dcdcdc' },
                                    '&.Mui-focused fieldset': { borderColor: '#dcdcdc' },
                                },
                                '& .MuiInputBase-input': { color: '#dcdcdc' },
                            }}
                        />
                        <TextField
                            margin="dense"
                            label="New Password"
                            name="password"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={handlePasswordChange}
                            sx={{
                                '& .MuiInputLabel-root': { color: '#dcdcdc' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#dcdcdc' },
                                    '&:hover fieldset': { borderColor: '#dcdcdc' },
                                    '&.Mui-focused fieldset': { borderColor: '#dcdcdc' },
                                },
                                '& .MuiInputBase-input': { color: '#dcdcdc' },
                            }}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <Button onClick={handleClose} color="primary" sx={{ backgroundColor: '#dcdcdc', color: 'rgba(0, 0, 0, 0.9)' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} color="primary" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: '#dcdcdc' }}>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MyProfiles;
