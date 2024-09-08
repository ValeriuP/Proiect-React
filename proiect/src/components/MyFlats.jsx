import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { db } from "../../firebase";
import { getDocs, collection, query, where, doc, setDoc, deleteDoc } from "firebase/firestore";
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

    // Fetch flats from Firestore and also get the favorite flats for the current user
    useEffect(() => {
        const fetchFlatsAndFavorites = async () => {
            // Fetch all flats owned by the current user
            const flatsCollection = collection(db, 'flats');
            const flatsQuery = query(flatsCollection, where('ownerUid', '==', currentUser.uid));
            const flatsSnapshot = await getDocs(flatsQuery);
            const flatsList = flatsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFlats(flatsList);

            // Fetch favorite flats from the 'favorites' collection for the current user
            const favoritesCollection = collection(db, 'favorites');
            const favoritesQuery = query(favoritesCollection, where('userId', '==', currentUser.uid));
            const favoritesSnapshot = await getDocs(favoritesQuery);
            const favoriteIds = favoritesSnapshot.docs.map(doc => doc.data().flatId);
            setFavoriteFlats(favoriteIds);
        };

        if (currentUser) {
            fetchFlatsAndFavorites();
        }
    }, [currentUser]);

    // Handle favorite toggle and save/remove it from Firestore
    const handleFavorite = async (flatId) => {
        const favoritesCollection = collection(db, 'favorites');
        const favoriteDocRef = doc(favoritesCollection, `${currentUser.uid}_${flatId}`);

        if (favoriteFlats.includes(flatId)) {
            // Remove the flat from favorites in Firestore
            await deleteDoc(favoriteDocRef);
            setFavoriteFlats(prevFavorites => prevFavorites.filter(id => id !== flatId));
        } else {
            // Add the flat to favorites in Firestore
            await setDoc(favoriteDocRef, { userId: currentUser.uid, flatId });
            setFavoriteFlats(prevFavorites => [...prevFavorites, flatId]);
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
                <IconButton onClick={() => handleFavorite(params.row.id)}>
                    {favoriteFlats.includes(params.row.id) ? (
                        <Favorite sx={{ color: '#ff0000' }} />  // Change to red when favorited
                    ) : (
                        <FavoriteBorder sx={{ color: '#dcdcdc' }} />  // Default color when not favorited
                    )}
                </IconButton>
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
