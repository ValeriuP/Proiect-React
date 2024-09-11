import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { db } from "../../firebase";
import { getDoc, doc, setDoc, getDocs, collection, deleteDoc, query, documentId,where, addDoc } from "firebase/firestore";
import { Box, TextField, IconButton, Modal, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Favorite, Send, FavoriteBorder } from '@mui/icons-material';
import Header from "./Header";
import { Link } from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';

function AllFlats() {
    const [flats, setFlats] = useState([]);
    const [filteredFlats, setFilteredFlats] = useState([]);
    const [favoriteFlats, setFavoriteFlats] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedFlatId, setSelectedFlatId] = useState(null);
    const [message, setMessage] = useState("");
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

    // Open modal to send a message
    const handleOpenModal = (flatId) => {
        console.log(flatId)
        setSelectedFlatId(flatId);
        setOpenModal(true);
    };

    // Close the modal
    const handleCloseModal = () => {
        setOpenModal(false);
        setMessage("");  // Clear the message input field
    };

    // Send message and store in Firebase
    const handleSendMessage = async () => {
        if (!message.trim()) return;


     const apRef =collection(db,'flats');
    
        let doc = await  getDocs(apRef);
        
        let data = doc.docs.map(d=>({...d.data(),id:d.id}))
        let mess_data = data.filter(d=>d.id==selectedFlatId)
        console.log(mess_data)
        let owner_id=mess_data[0].ownerUid;

        const messageRef=collection(db,'messages');
        await addDoc(messageRef,{
            message:message,
            senderId:currentUser.uid,
            receiverId:owner_id,
            // email:currentUser.email,
            
            
        })
        handleCloseModal();
 
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
                    {/* Open the modal when clicking the send icon */}
                    <IconButton onClick={() => handleOpenModal(params.row.id)}>
                        <SendIcon sx={{color:'#dcdcdc'}} />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <div>
            <Header />
            <Box>
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
                                color: '#dcdcdc',
                                opacity: 1,
                            },
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent',
                        },
                    }}
                    InputProps={{
                        style: {
                            color: '#dcdcdc',
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
                    }}
                />
            </Box>

            {/* Modal for sending a message */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        Send Message to Owner
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        label="Your message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        sx={{ mt: 2, mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendMessage}
                        endIcon={<Send />}
                    >
                        Send
                    </Button>
                </Box>
            </Modal>

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
