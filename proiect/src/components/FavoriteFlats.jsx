import  { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { db } from "../../firebase";
import { Button,Box } from "@mui/material";
import { doc, deleteDoc, getDocs, collection, query, where } from "firebase/firestore";
import Header from "./Header";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";

function FavoriteFlats() {
    const [favoriteFlats, setFavoriteFlats] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchFavoriteFlats = async () => {
            try {
                const favoritesCollection = collection(db, 'users', currentUser.uid, 'favorites');
                const favoritesSnapshot = await getDocs(favoritesCollection);
                const flatIds = favoritesSnapshot.docs.map(doc => doc.data().flatId);
             
                if (flatIds.length > 0) {
                    const flatsQuery = query(collection(db, 'flats'), where('__name__', 'in', flatIds));
                    const flatsSnapshot = await getDocs(flatsQuery);
                    const flatsList = flatsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    console.log(flatsList);
                    setFavoriteFlats(flatsList);
                } else {
                    setFavoriteFlats([]); // Clear the list if there are no favorites
                }
            } catch (error) {
                console.error('Error fetching favorite flats:', error);
            }
        };

        if (currentUser) {
            fetchFavoriteFlats();
        }
    }, [currentUser]);

    const handleDelete = async (flatId) => {
        try {
            const favoriteDocRef = doc(db, 'users', currentUser.uid, 'favorites', flatId);
            await deleteDoc(favoriteDocRef);

            // Update local state to remove the deleted flat
            setFavoriteFlats(prevFlats => prevFlats.filter(flat => flat.id !== flatId));
        } catch (error) {
            console.error('Error deleting favorite:', error);
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
                    {/* Allow users to remove from favorites */}
                    <Button
                        color="secondary"
                        onClick={() => handleDelete(params.row.id)}
                        sx={{ marginLeft: 1, color:'#9e1b32'
                         }}
                    >
                      Unfavorite
                    </Button>
                </>
            ),
        },
    ];

    if (!currentUser) return <div>Loading...</div>;  // Prevent rendering if currentUser is undefined

    return (
        <div>
            <Header />
            <Box>
                <DataGrid
                    rows={favoriteFlats}
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

export default FavoriteFlats;
