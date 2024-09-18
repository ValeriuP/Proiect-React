import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { db } from "../../firebase";
import { getDocs, collection, query, where, doc, setDoc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import Header from "./Header";
import { Link } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

function MyFlats() {
    const { currentUser } = useAuth();
    const [flats, setFlats] = useState([]);
    const [favoriteFlats, setFavoriteFlats] = useState([]);
    const [editFlat, setEditFlat] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const fetchFlat = async () => {
            const flatsCollection = collection(db, 'flats');
            const flatsQuery = query(flatsCollection, where('ownerUid', '==', currentUser.uid));
            const flatsSnapshot = await getDocs(flatsQuery);
            const flatsList = flatsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFlats(flatsList);
        };

        const fetchFavorites = async () => {
            const favoritesCollection = collection(db, 'users', currentUser.uid, 'favorites');
            const flatsNow = await getDocs(favoritesCollection);
            const favoritesList = flatsNow.docs.map(doc => doc.id);
            setFavoriteFlats(favoritesList);
        };

        if (currentUser) {
            fetchFlat();
            fetchFavorites();
        }
    }, [currentUser]);

    const handleFavorite = async (flatId) => {
        try {
            const userFavoritesRef = doc(db, 'users', currentUser.uid, 'favorites', flatId);
            const favoriteDoc = await getDoc(userFavoritesRef);

            if (favoriteDoc.exists()) {
                await deleteDoc(userFavoritesRef);
                setFavoriteFlats(prev => prev.filter(id => id !== flatId));
                console.log('Removed from favorites');
            } else {
                await setDoc(userFavoritesRef, { flatId });
                setFavoriteFlats(prev => [...prev, flatId]);
                console.log('Added to favorites');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const handleDelete = async (flatId) => {
        try {
            await deleteDoc(doc(db, 'flats', flatId));
            setFlats(prevFlats => prevFlats.filter(flat => flat.id !== flatId));
        } catch (error) {
            console.error("Error deleting flat: ", error);
        }
    };

    const handleEdit = (flat) => {
        setEditFlat(flat);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditFlat(null);
    };

    const handleSave = async () => {
        try {
            const flatRef = doc(db, 'flats', editFlat.id);
            await updateDoc(flatRef, editFlat);
            setFlats(prevFlats => prevFlats.map(flat => flat.id === editFlat.id ? editFlat : flat));
            handleCloseDialog();
        } catch (error) {
            console.error("Error updating flat: ", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFlat(prev => ({ ...prev, [name]: value }));
    };

    const columns = [
        { field: 'city', headerName: 'City', width: 150 },
        { field: 'streetName', headerName: 'Street Name', width: 150 },
        { field: 'streetNumber', headerName: 'Street Number', width: 150 },
        { field: 'areaSize', headerName: 'Area Size', width: 100 },
        { field: 'ac', headerName: 'AC', width: 100 },
        { field: 'yearBuilt', headerName: 'Year Built', width: 120 },
        { field: 'rentPrice', headerName: 'Rent Price $', width: 120 },
        { field: 'dateAvailable', headerName: 'Date Available', width: 150 },
        { field: 'ownerEmail', headerName: 'Email Owner', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => handleFavorite(params.row.id)}>
                        {favoriteFlats.includes(params.row.id) ? (
                            <Favorite sx={{ color: '#9e1b32' }} />
                        ) : (
                            <FavoriteBorder sx={{ color: '#9e1b32' }} />
                        )}
                    </IconButton>

                    {currentUser.uid === params.row.ownerUid && (
                        <>
                            <Button
                                color="primary"
                                onClick={() => handleEdit(params.row)}
                                sx={{ marginLeft: 1, color: '#007bff' }}
                            >
                                Edit
                            </Button>
                            <Button
                                color="secondary"
                                onClick={() => handleDelete(params.row.id)}
                                sx={{ marginLeft: 1, color: '#9e1b32' }}
                            >
                                Delete
                            </Button>
                        </>
                    )}
                </>
            ),
        },
    ];

    return (
        <Box sx={{ padding: 2 }}>
            <Header />

            <Box sx={{ marginTop: 2 }}>
                <DataGrid
                    rows={flats}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    disableRowSelectionOnClick
                    autoHeight
                    sx={{
                        "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
                            outline: "none",
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#333333',
                            color: 'rgba(0, 0, 0, 0.9)',
                            fontSize: '16px',
                            textTransform: 'uppercase',
                        },
                        '& .MuiDataGrid-row': {
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: '#dcdcdc',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                color: '#dcdcdc',
                            },
                        },
                        '& .MuiDataGrid-cell': {
                            borderColor: '#cccccc',
                        },
                        '& .MuiDataGrid-cell.Mui-selected': {
                            backgroundColor: '#555555',
                            color: 'rgba(0, 0, 0, 0.6)',
                        },
                        '& .MuiDataGrid-row.Mui-selected': {
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: '#ffffff',
                        },
                        '.MuiDataGrid-menuIcon': {
                            visibility: 'visible !important',
                            width: "auto !important",
                        },
                        '@media (max-width:600px)': {
                            '& .MuiDataGrid-columnHeaders': {
                                fontSize: '14px',
                            },
                            '& .MuiDataGrid-cell': {
                                fontSize: '12px',
                            },
                        }
                    }}
                />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <Button
                    sx={{
                        color: 'rgba(0, 0, 0, 0.9)',
                        fontSize: '16px',
                        width: 100,
                        backgroundColor: '#dcdcdc',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                            color: '#dcdcdc'
                        }
                    }}
                    color="inherit" component={Link} to="/">
                    Back
                </Button>
            </Box>

            {/* Edit Flat Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Edit Flat</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="city"
                        label="City"
                        type="text"
                        fullWidth
                        value={editFlat?.city || ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="streetName"
                        label="Street Name"
                        type="text"
                        fullWidth
                        value={editFlat?.streetName || ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="streetNumber"
                        label="Street Number"
                        type="text"
                        fullWidth
                        value={editFlat?.streetNumber || ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="areaSize"
                        label="Area Size"
                        type="number"
                        fullWidth
                        value={editFlat?.areaSize || ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="ac"
                        label="AC"
                        type="text"
                        fullWidth
                        value={editFlat?.ac || ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="yearBuilt"
                        label="Year Built"
                        type="number"
                        fullWidth
                        value={editFlat?.yearBuilt || ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="rentPrice"
                        label="Rent Price $"
                        type="number"
                        fullWidth
                        value={editFlat?.rentPrice || ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="dateAvailable"
                        label="Date Available"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={editFlat?.dateAvailable || ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="ownerEmail"
                        label="Owner Email"
                        type="email"
                        fullWidth
                        value={editFlat?.ownerEmail || ''}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default MyFlats;

