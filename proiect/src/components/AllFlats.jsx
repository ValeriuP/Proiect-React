import React,{useEffect,useState} from "react";
import { db } from "../../firebase";
import { useAuth } from "../contexts/authContext";
// import {DataGrid} from "@mui/material"
// import {DataGrid} from "@mui/x-data-grid";

// import {Favorite,Send,FavoriteBorder} from '@mui/icons-material'
import { getDoc,doc,setDoc,getDocs,collection,deleteDoc } from "firebase/firestore";


function AllFlats() {
    const [flats, setFlats] = useState([]);
    const [filteredFlats, setFilteredFlats] = useState([]);
    const [favoriteFlats, setFavoriteFlats] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchFlats = async () => {
            const flatsCollection = collection(db, 'flats');
            const flatsNow = await getDocs(flatsCollection);
            const flatsList = flatsNow.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFlats(flatsList);
            setFilteredFlats(flatsList);
        };

        const fetchFavorites = async () => {
            const favoritesCollection = collection(db, 'users', currentUser.uid, 'favorites');
            const flatsNow = await getDocs(favoritesCollection);
            const favoritesList = flatsNow.docs.map(doc => doc.id);
            setFavoriteFlats(favoritesList);
        };

        fetchFlats();
        fetchFavorites();
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

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const results = flats.filter(flat =>
            flat.city.toLowerCase().includes(searchTerm) ||
            flat.streetName.toLowerCase().includes(searchTerm) ||
            flat.rentPrice.toString().includes(searchTerm) ||
            flat.areaSize.toString().includes(searchTerm)
        );
        setFilteredFlats(results);
    };

    const columns = [
        { field: 'city', headerName: 'City', width: 200 },
        { field: 'streetName', headerName: 'Street Name', width: 200 },
        { field: 'streetNumber', headerName: 'Street Number', width: 150 },
        { field: 'areaSize', headerName: 'Area Size', width: 120 },
        { field: 'ac', headerName: 'AC', width: 100 },
        { field: 'yearBuilt', headerName: 'Year Built', width: 120 },
        { field: 'rentPrice', headerName: 'Rent Price $', width: 120 },
        { field: 'dateAvailable', headerName: 'Date Available', width: 150 },
        { field: 'ownerEmail', headerName: 'Email Owner', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => handleFavorite(params.row.id)}>
                        {favoriteFlats.includes(params.row.id) ? <Favorite sx={{ color: 'red' }} /> : <FavoriteBorder />}
                    </IconButton>
                    <IconButton
                        onClick={() => window.location.href = `mailto:${params.row.ownerEmail}`} // Trimite email către proprietar
                    >
                        <Send />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Box>
            <TextField
                variant="outlined"
                placeholder="Search..."
                onChange={handleSearch}
                sx={{ marginBottom: 2, width: '300px' }}
            />

            <DataGrid
                rows={filteredFlats}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                autoHeight
            />
        </Box>
    );
}

export default AllFlats;