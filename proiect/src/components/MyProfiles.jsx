import React,{useEffect,useState,useCallback} from "react";
import { useAuth } from "../contexts/authContext";
import { db } from "../../firebase";
import { doc,getDoc,updateDoc,deleteDoc } from "firebase/firestore";
import { updatePassword as firebaseUpdatePassword  } from "firebase/auth";
import Header from "./Header";
import { Button,Box,CardContent,Dialog,DialogActions,DialogContent,DialogTitle,TextField,Typography,Grid,Card } from "@mui/material";
import './MyProfile.css';

const MyProfiles = () => {
    const { currentUser } = useAuth();
    const [open, setOpen] = useState(false);
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        birthdate: ''
    });
    const [editData, setEditData] = useState({});
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchUserData = useCallback(async () => {
        if (currentUser) {
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
        }
    }, [currentUser]);

    const checkIfAdmin = useCallback(async () => {
        if (currentUser) {
            try {
                const userDoc = doc(db, 'users', currentUser.uid);
                const userSnapshot = await getDoc(userDoc);
                const userData = userSnapshot.data();
                if (userData) {
                    setIsAdmin(userData.isAdmin || false);
                } else {
                    console.error("Admin check failed: User data not found");
                }
            } catch (error) {
                console.error("Error checking admin status:", error);
            }
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            fetchUserData();
            checkIfAdmin();
        }
    }, [currentUser, fetchUserData, checkIfAdmin]);

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
            console.log(editData);
            await updateDoc(userDoc, editData);
            setUserData(editData);

            // Modificarea parolei, dacă a fost introdusă una nouă
            if (password) {
                await firebaseUpdatePassword(currentUser, password);
                alert('Parola a fost actualizată cu succes.');
            }

            handleClose();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('A apărut o eroare la actualizarea profilului.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Sunteți sigur că doriți să ștergeți acest utilizator?')) {
            try {
                const userDocRef = doc(db, 'users', currentUser.uid);
                await deleteDoc(userDocRef);
                alert('Contul a fost șters cu succes din Firestore.');
                //  adăuga logica pentru deconectare sau redirecționare
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('A apărut o eroare la ștergerea utilizatorului.');
            }
        }
    };

    return (
        <Box>
            <Header />
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '80vh' }}>
                <Grid item xs={12} sm={8} md={6}>
                    <div className="card__container">
                    <Card sx={{
                        backgroundColor:'rgba(0, 0, 0, 0.5)', color:'#dcdcdc',
                    }}>
                        <CardContent>
                            <Typography variant="h5" align="center" gutterBottom>
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
                                <Grid item xs={5} sm={5}  >
                                    <Button color="primary" onClick={handleEditOpen} sx={{backgroundColor:'rgba(0, 0, 0, 0.9)',
                     color:'#dcdcdc','&:hover':{
                    backgroundColor:'#dcdcdc', color:'black'}
                }}>
                                     Edit <Button />
                                    </Button>
                                </Grid>
                                {isAdmin && (
                                    <div item xs={5} sm={5}>
                                        <Button color="secondary" onClick={handleDelete}>
                                    Delete <Button />
                                        </Button>
                                    </div>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>
                    </div>
                </Grid>
            </Grid>

            <Dialog open={open} onClose={handleClose} sx={{
                backgroundColor:'rgba(0, 0, 0, 0.5)'
            }}>
                <DialogTitle
                sx={{
                    backgroundColor:' rgba(0, 0, 0, 0.5)', color:' rgba(0, 0, 0, 0.7)', textTransform:'uppercase',
                }}>Edit Profile</DialogTitle>
                <DialogContent   sx={{
                    backgroundColor:' rgba(0, 0, 0, 0.5)', color:'#dcdcdc',
                }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="First Name"
                        name="firstName"
                        fullWidth
                        value={editData.firstName}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Second Name"
                        name="lastName"
                        fullWidth
                        value={editData.lastName}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        fullWidth
                        value={editData.email}
                        onChange={handleChange}
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
                    />
                    <TextField
                        margin="dense"
                        label="New Password"
                        name="password"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </DialogContent>
                <DialogActions   sx={{
                    backgroundColor:' rgba(0, 0, 0, 0.5)'
                }}>
                    <Button onClick={handleClose} color="primary"  sx={{
                    backgroundColor:' rgba(0, 0, 0, 0.5)', color:'#dcdcdc',
                }}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} color="primary"  sx={{
                    backgroundColor:' rgba(0, 0, 0, 0.5)', color:'#dcdcdc',
                }}> 
                       Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MyProfiles;