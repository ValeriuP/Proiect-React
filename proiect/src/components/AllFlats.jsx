import {useEffect,useState} from "react";
import { useAuth } from "../contexts/authContext";
import { db } from "../../firebase";
import { getDoc,doc,setDoc,getDocs,collection,deleteDoc } from "firebase/firestore";
import {Box,TextField,IconButton} from "@mui/material"
import {DataGrid} from "@mui/x-data-grid";
import {Favorite,Send,FavoriteBorder} from '@mui/icons-material' 
import Header from "./Header";
import { Link} from "react-router-dom";
import {Button } from "@mui/material";

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
        { field: 'city', headerName: 'City', width: 150,},
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
        <Favorite sx={{ color: '#ff0000',  }} />  
    ) : (
        <FavoriteBorder sx={{ color: '#dcdcdc' }} />  
    )}
</IconButton>
<IconButton
    onClick={() => window.location.href = `mailto:${params.row.ownerEmail}`}
>
    <Send sx={{ color: '#dcdcdc' }} /> 
</IconButton>

                </>
            ),
        },
    ];

    return (
        <div>
            <Header />
            
        <Box 
       
        >
           <TextField
    variant="outlined"
    placeholder="Search..."
    onChange={handleSearch}
    sx={{ 
        marginBottom: 3, 
        marginTop: 4, 
        width: '200px', 
        borderRadius: 2, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        color: '#dcdcdc',
        '& .MuiOutlinedInput-root': {
            '&::placeholder': {
                color: '#dcdcdc', // Customize placeholder color
                opacity: 1, // Ensures opacity is set for color to take effect
         
            },
         
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'transparent', // Transparent border on focus
        },
    }}
    InputProps={{
        style: {
            color: '#dcdcdc', // Customize text color
        },
    }}
/>


<DataGrid 
    rows={filteredFlats}
    columns={columns}
    pageSize={12}
    rowsPerPageOptions={[12]}
    disableRowSelectionOnClick
    autoHeight
    sx={{ "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
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
/>

        </Box>
        <div  style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
    component={Link}
    to="/"
>
    Back
</Button>
</div>
        </div>
        
    );
}

export default AllFlats;