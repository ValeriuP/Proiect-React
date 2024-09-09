import React,{useEffect,useState} from "react";
import { db } from "../../firebase";
import { getDocs,deleteDoc,doc,collection } from "firebase/firestore";
import { DataGrid } from "@mui/x-data-grid";
import { Box,Button,DialogTitle,DialogContent,DialogContentText,Dialog,DialogActions,IconButton } from "@mui/material";
import { Delete, Repeat } from "@mui/icons-material";
import Header from "./Header";
import { Link,useLocation,useNavigate } from "react-router-dom";


function AllUsers() {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollection);
                const usersList = usersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
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
        { field: 'email', headerName: 'Email', width: 550 },
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

    return (
        <div sx={{backgroundImage:'url("../assets/modern-apartment-building-features-green-facade-design-generated-by-ai-free-photo.jpg")',backgroundRepeat:'repeat'}} >
            <Header />

            <Box >
                <DataGrid
               sx={{marginTop: 15, "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
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
