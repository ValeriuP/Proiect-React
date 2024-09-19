import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { db } from "../../firebase";
import { getDoc, doc, setDoc, getDocs, collection, deleteDoc, addDoc } from "firebase/firestore";
import { Box, TextField, IconButton, Modal, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Favorite, Send, FavoriteBorder } from '@mui/icons-material';
import Header from "./Header";
import { Link } from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';

function AllFlats() {
    const [flats, setFlats] = useState([]); // Starea pentru a stoca lista de apartamente
    const [filteredFlats, setFilteredFlats] = useState([]); // Starea pentru a stoca apartamentele filtrate (pentru căutare)
    const [favoriteFlats, setFavoriteFlats] = useState([]); // Starea pentru a stoca lista de apartamente favorite
    const [openModal, setOpenModal] = useState(false); // Starea pentru a controla vizibilitatea modalei de trimitere a mesajului
    const [selectedFlatId, setSelectedFlatId] = useState(null); // Starea pentru a stoca ID-ul apartamentului selectat
    const [message, setMessage] = useState(""); // Starea pentru a stoca mesajul care urmează să fie scris
    const { currentUser } = useAuth(); // Obține utilizatorul curent din contextul de autentificare

    useEffect(() => {
        // Funcția pentru a prelua apartamentele și favoritele atunci când componenta este montată
        const fetchFlats = async () => {
            const flatsCollection = collection(db, 'flats'); // Referință la colecția 'flats' din Firestore
            const flatsNow = await getDocs(flatsCollection); // Preia toate documentele din colecția 'flats'
            const flatsList = flatsNow.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Mapează documentele într-un array de obiecte de tip apartament
            setFlats(flatsList); // Actualizează starea cu lista de apartamente
            setFilteredFlats(flatsList); // Setează apartamentele filtrate la aceeași listă inițială
        };

        const fetchFavorites = async () => {
            const favoritesCollection = collection(db, 'users', currentUser.uid, 'favorites'); // Referință la subcolecția 'favorites' a utilizatorului
             const flatsNow = await getDocs(favoritesCollection); // Preia toate documentele din colecția de favorite a utilizatorului
             const favoritesList = flatsNow.docs.map(doc => doc.id); // Mapează documentele într-un array de ID-uri de apartamente
                        setFavoriteFlats(favoritesList); // Actualizează starea cu lista de ID-uri ale apartamentelor favorite
        };

        fetchFlats();
        fetchFavorites();
    }, [currentUser]);

    const handleFavorite = async (flatId) => {
        try {
             const userFavoritesRef = doc(db, 'users', currentUser.uid, 'favorites', flatId); // Referință la documentul specific de favorit pentru apartament
            const favoriteDoc = await getDoc(userFavoritesRef); // Verifică dacă apartamentul este deja în favoritele utilizatorului

            if (favoriteDoc.exists()) {
                await deleteDoc(userFavoritesRef); // Dacă există, îl elimină din favorite
                setFavoriteFlats(prev => prev.filter(id => id !== flatId)); // Actualizează starea eliminând ID-ul apartamentului din lista de favorite
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

// import { useEffect, useState } from "react"; // Importă hook-urile pentru gestionarea stării și efectelor secundare
// import { useAuth } from "../contexts/authContext"; // Importă contextul de autentificare pentru a obține datele utilizatorului curent
// import { db } from "../../firebase"; // Importă instanța Firebase Firestore
// import { getDoc, doc, setDoc, getDocs, collection, deleteDoc, addDoc } from "firebase/firestore"; // Importă metodele Firestore pentru operațiuni CRUD
// import { Box, TextField, IconButton, Modal, Button, Typography } from "@mui/material"; // Importă componentele MUI pentru layout și elemente UI
// import { DataGrid } from "@mui/x-data-grid"; // Importă componenta DataGrid pentru afișarea datelor în format tabelar
// import { Favorite, Send, FavoriteBorder } from '@mui/icons-material'; // Importă iconițele MUI pentru acțiuni UI
// import Header from "./Header"; // Importă componenta personalizată Header
// import { Link } from "react-router-dom"; // Importă componenta Link pentru navigare
// import SendIcon from '@mui/icons-material/Send'; // Importă iconița pentru trimiterea mesajului

// function AllFlats() {
//     const [flats, setFlats] = useState([]); // Starea pentru a stoca lista de apartamente
//     const [filteredFlats, setFilteredFlats] = useState([]); // Starea pentru a stoca apartamentele filtrate (pentru căutare)
//     const [favoriteFlats, setFavoriteFlats] = useState([]); // Starea pentru a stoca lista de apartamente favorite
//     const [openModal, setOpenModal] = useState(false); // Starea pentru a controla vizibilitatea modalei de trimitere a mesajului
//     const [selectedFlatId, setSelectedFlatId] = useState(null); // Starea pentru a stoca ID-ul apartamentului selectat
//     const [message, setMessage] = useState(""); // Starea pentru a stoca mesajul care urmează să fie scris
//     const { currentUser } = useAuth(); // Obține utilizatorul curent din contextul de autentificare

//     useEffect(() => {
//         // Funcția pentru a prelua apartamentele și favoritele atunci când componenta este montată
//         const fetchFlats = async () => {
//             const flatsCollection = collection(db, 'flats'); // Referință la colecția 'flats' din Firestore
//             const flatsNow = await getDocs(flatsCollection); // Preia toate documentele din colecția 'flats'
//             const flatsList = flatsNow.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Mapează documentele într-un array de obiecte de tip apartament
//             setFlats(flatsList); // Actualizează starea cu lista de apartamente
//             setFilteredFlats(flatsList); // Setează apartamentele filtrate la aceeași listă inițială
//         };

//         const fetchFavorites = async () => {
//             const favoritesCollection = collection(db, 'users', currentUser.uid, 'favorites'); // Referință la subcolecția 'favorites' a utilizatorului
//             const flatsNow = await getDocs(favoritesCollection); // Preia toate documentele din colecția de favorite a utilizatorului
//             const favoritesList = flatsNow.docs.map(doc => doc.id); // Mapează documentele într-un array de ID-uri de apartamente
//             setFavoriteFlats(favoritesList); // Actualizează starea cu lista de ID-uri ale apartamentelor favorite
//         };

//         fetchFlats(); // Preia apartamentele din Firestore
//         fetchFavorites(); // Preia apartamentele favorite ale utilizatorului din Firestore
//     }, [currentUser]); // Efectul se execută atunci când currentUser se schimbă

//     const handleFavorite = async (flatId) => {
//         try {
//             const userFavoritesRef = doc(db, 'users', currentUser.uid, 'favorites', flatId); // Referință la documentul specific de favorit pentru apartament
//             const favoriteDoc = await getDoc(userFavoritesRef); // Verifică dacă apartamentul este deja în favoritele utilizatorului

//             if (favoriteDoc.exists()) {
//                 await deleteDoc(userFavoritesRef); // Dacă există, îl elimină din favorite
//                 setFavoriteFlats(prev => prev.filter(id => id !== flatId)); // Actualizează starea eliminând ID-ul apartamentului din lista de favorite
//                 console.log('Eliminat din favorite');
//             } else {
//                 await setDoc(userFavoritesRef, { flatId }); // Dacă nu există, îl adaugă în favorite
//                 setFavoriteFlats(prev => [...prev, flatId]); // Actualizează starea adăugând ID-ul apartamentului în lista de favorite
//                 console.log('Adăugat la favorite');
//             }
//         } catch (error) {
//             console.error('Eroare la gestionarea favoritului:', error); // Afișează erorile
//         }
//     };

//     const handleSearch = (event) => {
//         const searchTerm = event.target.value.toLowerCase(); // Convertește termenul de căutare în litere mici
//         const results = flats.filter(flat =>
//             flat.city.toLowerCase().includes(searchTerm) || // Filtrează apartamentele după oraș
//             flat.streetName.toLowerCase().includes(searchTerm) || // Filtrează apartamentele după numele străzii
//             flat.rentPrice.toString().includes(searchTerm) || // Filtrează apartamentele după prețul chiriei
//             flat.areaSize.toString().includes(searchTerm) // Filtrează apartamentele după dimensiunea zonei
//         );
//         setFilteredFlats(results); // Actualizează starea apartamentelor filtrate cu rezultatele căutării
//     };

//     // Deschide modalul pentru a trimite un mesaj
//     const handleOpenModal = (flatId) => {
//         console.log(flatId); // Afișează ID-ul apartamentului selectat
//         setSelectedFlatId(flatId); // Setează starea ID-ului apartamentului selectat
//         setOpenModal(true); // Deschide modalul pentru trimiterea mesajului
//     };

//     // Închide modalul
//     const handleCloseModal = () => {
//         setOpenModal(false); // Închide modalul pentru trimiterea mesajului
//         setMessage("");  // Golește câmpul de introducere a mesajului
//     };

//     // Trimite mesajul și îl stochează în Firebase
//     const handleSendMessage = async () => {
//         if (!message.trim()) return; // Nu face nimic dacă mesajul este gol

//         const apRef = collection(db, 'flats'); // Referință la colecția 'flats'
//         let doc = await getDocs(apRef); // Preia toate documentele din colecția 'flats'
//         let data = doc.docs.map(d => ({ ...d.data(), id: d.id })); // Mapează documentele într-un array de obiecte de tip apartament
//         let mess_data = data.filter(d => d.id == selectedFlatId); // Găsește apartamentul selectat în array-ul de date
//         console.log(mess_data); // Afișează datele apartamentului selectat
//         let owner_id = mess_data[0].ownerUid; // Extrage ID-ul proprietarului din datele apartamentului

//         const messageRef = collection(db, 'messages'); // Referință la colecția 'messages'
//         await addDoc(messageRef, {
//             message: message, // Stochează textul mesajului
//             senderId: currentUser.uid, // Stochează ID-ul utilizatorului curent ca expeditor
//             receiverId: owner_id, // Stochează ID-ul proprietarului ca destinatar
//         });
//         handleCloseModal(); // Închide modalul după trimiterea mesajului
//     };

//     const columns = [
//         { field: 'city', headerName: 'City', width: 150 }, // Coloană pentru orașul apartamentului
//         { field: 'streetName', headerName: 'Street Name', width: 150 }, // Coloană pentru numele străzii
//         { field: 'streetNumber', headerName: 'Street Number', width: 150 }, // Coloană pentru numărul străzii
//         { field: 'areaSize', headerName: 'Area Size', width: 100 }, // Coloană pentru dimensiunea zonei
//         { field: 'ac', headerName: 'AC', width: 100 }, // Coloană pentru disponibilitatea aerului condiționat
//         { field: 'yearBuilt', headerName: 'Year Built', width: 120 }, // Coloană pentru anul construcției apartamentului
//         { field: 'rentPrice', headerName: 'Rent Price $', width: 120 }, // Coloană pentru prețul chiriei
//         { field: 'dateAvailable', headerName: 'Date Available', width: 150 }, // Coloană pentru data disponibilității
//         { field: 'ownerEmail', headerName: 'Email Owner', width: 150 }, // Coloană pentru emailul proprietarului
//         {
//             field: 'actions', headerName: 'Actions', width: 150, renderCell: (params) => ( // Coloană pentru acțiuni (favorite și trimiterea mesajului)
//                 <>
//                     <IconButton onClick={() => handleFavorite(params.row.id)}> {/* Buton pentru gestionarea favoritei */}
//                         {favoriteFlats.includes(params.row.id) ? (
//                             <Favorite style={{ color: 'red' }} /> // Iconiță pentru apartamentele favorite
//                         ) : (
//                             <FavoriteBorder /> // Iconiță pentru apartamentele care nu sunt favorite
//                         )}
//                     </IconButton>
//                     <IconButton onClick={() => handleOpenModal(params.row.id)}> {/* Buton pentru deschiderea modalului de trimitere a mesajului */}
//                         <Send /> {/* Iconiță pentru trimiterea mesajului */}
//                     </IconButton>
//                 </>
//             )
//         }
//     ];

//     return (
//         <div>
//             <Header /> {/* Afișează componenta Header */}
//             <Box sx={{ margin: '20px' }}> {/* Stil pentru containerul principal */}
//                 <TextField
//                     fullWidth
//                     label="Search Flats" // Etichetă pentru câmpul de căutare
//                     variant="outlined"
//                     onChange={handleSearch} // Declanșează căutarea la schimbarea textului
//                     sx={{
//                         marginBottom: '20px', // Spațiere între căutare și tabel
//                         '& .MuiOutlinedInput-root': {
//                             '& fieldset': {
//                                 borderColor: 'rgba(0, 0, 0, 0.9)', // Culoare pentru bordura câmpului
//                             },
//                             '&:hover fieldset': {
//                                 borderColor: '#333333', // Bordura la hover
//                             },
//                             '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                 borderColor: 'transparent', // Bordura la focus
//                             },
//                     }}
//                         InputProps={{
//                             style: {
//                                 color: '#dcdcdc', 
//                             },
//                         }}
//                     }}
                
//                 />

//                 <DataGrid
//                     rows={filteredFlats} // Datele pentru tabel (apartamentele filtrate)
//                     columns={columns} // Configurația coloanelor din tabel
//                     pageSize={12} // Numărul de rânduri pe pagină
//                     rowsPerPageOptions={[12]} // Opțiuni pentru numărul de rânduri pe pagină
//                     disableRowSelectionOnClick // Dezactivează selecția rândurilor la click
//                     autoHeight // Ajustează automat înălțimea tabelului
//                     sx={{
//                         "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
//                             outline: "none", // Elimină conturul la focus pe celule
//                         },
//                         '& .MuiDataGrid-columnHeaders': {
//                             backgroundColor: '#333333', // Stil pentru antetul coloanelor
//                             color: 'rgba(0, 0, 0, 0.9)',
//                             fontSize: '16px',
//                             textTransform: 'uppercase',
//                         },
//                         '& .MuiDataGrid-row': {
//                             backgroundColor: 'rgba(0, 0, 0, 0.6)', // Stil pentru rândurile din tabel
//                             color: '#dcdcdc',
//                             '&:hover': {
//                                 backgroundColor: 'rgba(0, 0, 0, 0.6)',
//                                 color: '#dcdcdc',
//                             },
//                         },
//                         '& .MuiDataGrid-cell': {
//                             borderColor: '#cccccc', // Stil pentru bordura celulelor
//                         },
//                     }}
//                 />
//             </Box>

//             {/* Modal pentru trimiterea unui mesaj */}
//             <Modal
//                 open={openModal} // Controlează vizibilitatea modalului
//                 onClose={handleCloseModal} // Închide modalul la click pe fundal
//                 aria-labelledby="modal-title"
//                 aria-describedby="modal-description"
//             >
//                 <Box sx={{
//                     position: 'absolute',
//                     top: '50%', // Centrează modalul vertical
//                     left: '50%', // Centrează modalul orizontal
//                     transform: 'translate(-50%, -50%)', // Centrează modalul în viewport
//                     width: 400,
//                     bgcolor: 'background.paper', // Culoarea de fundal a modalului
//                     boxShadow: 24,
//                     p: 4, // Padding pentru conținutul modalului
//                 }}>
//                     <Typography id="modal-title" variant="h6" component="h2">
//                         Send Message to Owner {/* Titlul modalului */}
//                     </Typography>
//                     <TextField
//                         fullWidth
//                         multiline // Câmp de text pentru mesaj (multiliniar)
//                         rows={4}
//                         variant="outlined"
//                         label="Your message" // Etichetă pentru câmpul de introducere a mesajului
//                         value={message} // Leagă valoarea introducerii de starea mesajului
//                         onChange={(e) => setMessage(e.target.value)} // Actualizează starea mesajului la schimbarea textului
//                         sx={{ mt: 2, mb: 2 }} // Spațiere pentru câmpul de introducere a mesajului
//                     />
//                     <Button
//                         variant="contained"
//                         color="primary" // Stilul butonului principal
//                         onClick={handleSendMessage} // Trimite mesajul la click
//                         endIcon={<Send />} // Iconiță pentru trimiterea mesajului lângă textul butonului
//                     >
//                         Send {/* Textul butonului */}
//                     </Button>
//                 </Box>
//             </Modal>

//             <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//                 <Button
//                     sx={{
//                         color: 'rgba(0, 0, 0, 0.9)', // Culoarea textului butonului
//                         fontSize: '20px', // Dimensiunea fontului butonului
//                         width: 100, // Lățimea butonului
//                         backgroundColor: '#dcdcdc', // Culoarea de fundal a butonului
//                         marginTop: 5, // Margină de sus pentru buton
//                         '&:hover': {
//                             backgroundColor: 'rgba(0, 0, 0, 0.9)', // Culoarea de fundal la hover
//                             color: '#dcdcdc' // Culoarea textului la hover
//                         }
//                     }}
//                     component={Link} // Componenta Link pentru navigare
//                     to="/" // Navighează înapoi la pagina de start la click
//                 >
//                     Back {/* Textul butonului */}
//                 </Button>
//             </div>
//         </div>
//     );
// }

// export default AllFlats; // Exportă componenta ca export implicit
