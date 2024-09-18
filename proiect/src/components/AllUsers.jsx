import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { getDocs, deleteDoc, doc, collection } from "firebase/firestore";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, DialogTitle, DialogContent, DialogContentText, Dialog, DialogActions, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import Header from "./Header";

function AllUsers() {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAdmin === undefined) {
            return; // Do nothing if isAdmin is undefined (still loading)
        }

        if (!isAdmin) {
            navigate('/'); // Redirect non-admin users to home or another page
        } else {
            setLoading(false);
        }
    }, [isAdmin, navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollection);
                const usersList = usersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    firstName: doc.data().firstName, // Preia prenumele
                    lastName: doc.data().lastName,   // Preia numele de familie
                    email: doc.data().email,         // preia email
                    // ...doc.data()
                }));
                setUsers(usersList);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUser = async () => {
        try {
            if (selectedUserId) {
                await deleteDoc(doc(db, 'users', selectedUserId));
                setUsers(users.filter(user => user.id !== selectedUserId));
                console.log('User deleted successfully');
            }
            setOpen(false);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleOpenModal = (userId) => {
        setSelectedUserId(userId);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    const columns = [
        {field:'firstName', headerName:'First Name',width:350}, // afiseaza nume prenume email
        {field:'lastName',headerName: 'Last Name',width:250},
        { field: 'email', headerName: 'Email', width: 250 },
        
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <IconButton onClick={() => handleOpenModal(params.row.id)}>
                    <Delete color="error" />
                </IconButton>
            ),
        },
    ];

    if (loading) {
        return <p>Loading...</p>; // Optionally, you can show a spinner or loader component
    }

    // Render nothing if the user is not an admin
    if (!isAdmin) {
        return null;
    }

    return (
        <div>
            <Header/>
            <Box>
                <DataGrid
                    sx={{
                        marginTop: 15, "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
                            outline: "none",
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#333333',  // Header background color
                            color: 'rgba(0, 0, 0, 0.9)',  // Header text color
                            fontSize: '16px',
                            textTransform: 'uppercase',   // Header font size
                        },
                        '& .MuiDataGrid-row': {
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',  // Row background color
                            color: '#dcdcdc',                       // Row text color
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',         // Row hover background color
                                color: '#dcdcdc',        // Row hover text color
                            },
                        },
                        '& .MuiDataGrid-cell': {
                            borderColor: '#cccccc',                 // Cell border color
                        },
                        '& .MuiDataGrid-cell.Mui-selected': {
                            backgroundColor: '#555555',             // Selected cell background color
                            color: 'rgba(0, 0, 0, 0.6)',                       // Selected cell text color
                        },
                        '& .MuiDataGrid-row.Mui-selected': {
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',             // Selected row background color
                            color: '#ffffff',                       // Selected row text color
                        },

                        '.MuiDataGrid-menuIcon': {
                            visibility: 'visible !important',
                            width: "auto !important",
                        }
                    }}
                    rows={users}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    disableRowSelectionOnClick
                    autoHeight
                    sortModel={[
                        {
                            field: 'email',
                            sort: 'asc',
                        },
                    ]}
                />
            </Box>

            <Dialog
                open={open}
                onClose={handleCloseModal}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this user? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteUser} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AllUsers;
