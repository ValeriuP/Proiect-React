import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { db } from "../../firebase";
import { getDocs, collection, query, where, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import Header from "./Header";
import { Link } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { IconButton } from "@mui/material";

function MyFlats() {
    const { currentUser } = useAuth();
    const [flats, setFlats] = useState([]);
    const [favoriteFlats, setFavoriteFlats] = useState([]);

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
            width: 150,
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
                        <Button
                            color="secondary"
                            onClick={() => handleDelete(params.row.id)}
                            sx={{ marginLeft: 1,color:'#9e1b32'  }}
                        >
                            Delete
                        </Button>
                    )}
                </>
            ),
        },
    ];

    return (
        <div>
            <div>
                <Header />
            </div>

            <Box>
                <DataGrid
                    rows={flats}
                    columns={columns}
                    pageSize={12}
                    rowsPerPageOptions={[12]}
                    disableRowSelectionOnClick
                    autoHeight
                    sx={{
                        marginTop: 15,
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
                        }
                    }}
                />
            </Box>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    sx={{
                        color: 'rgba(0, 0, 0, 0.9)',
                        fontSize: '20px',
                        width: 100,
                        backgroundColor: '#dcdcdc',
                        marginTop: 5,
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                            color: '#dcdcdc'
                        }
                    }}
                    color="inherit" component={Link} to="/">Back</Button>
            </div>
        </div>
    );
}

export default MyFlats;
