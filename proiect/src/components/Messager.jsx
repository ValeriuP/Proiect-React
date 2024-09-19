import { useState, useEffect } from 'react'; // Importă hook-urile React pentru starea și efectele secundare
import { TableBody, TableCell, TableHead, TableRow, Table, Paper, TableContainer, TablePagination, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material'; // Importă componentele MUI pentru UI
import { Delete, Replay } from '@mui/icons-material'; // Importă iconițele pentru ștergere și răspuns
import { db } from '../../firebase'; // Importă baza de date Firebase
import { collection, getDocs, doc, deleteDoc, getDoc, addDoc } from 'firebase/firestore'; // Importă funcțiile Firestore pentru gestionarea documentelor
import { useAuth } from '../contexts/authContext'; // Importă hook-ul pentru autentificarea utilizatorului curent
import Header from './Header'; // Importă componenta Header

// Funcție pentru a prelua utilizatorul după ID
const getUserById = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId)); // Obține documentul utilizatorului cu ID-ul specificat
        if (userDoc.exists()) {
            return userDoc.data(); // Dacă documentul există, returnează datele utilizatorului
        } else {
            console.log('No such user!'); // Dacă documentul nu există, afișează un mesaj în consolă
            return null; // Returnează null dacă nu există utilizator
        }
    } catch (error) {
        console.error('Error fetching user:', error); // Afișează eroarea dacă apare una
        return null; // Returnează null în caz de eroare
    }
};

function Messages() {
    const { currentUser } = useAuth(); // Obține utilizatorul curent din contextul de autentificare
    const [messages, setMessages] = useState([]); // Definire starea pentru mesaje, inițial o listă goală
    const [setOpen] = useState(false); // Definire starea pentru un dialog deschis (neutilizat aici)
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false); // Definire starea pentru dialogul de confirmare ștergere
    const [openReply, setOpenReply] = useState(false); // Definire starea pentru dialogul de răspuns
    const [selectedMessageId, setSelectedMessageId] = useState(null); // Starea pentru a ține minte ID-ul mesajului selectat pentru ștergere
    const [dialogMessage, setDialogMessage] = useState(null); // Starea pentru mesajul selectat în dialogul de răspuns
    const [replyMessage, setReplyMessage] = useState(''); // Starea pentru conținutul răspunsului
    const [page, setPage] = useState(0); // Starea pentru pagina curentă a tabelului
    const [rowsPerPage, setRowsPerPage] = useState(10); // Starea pentru numărul de rânduri pe pagină

    // Hook-ul useEffect pentru a prelua mesajele din Firestore la montarea componentei
    useEffect(() => {
        async function getData() {
            const messagesRef = collection(db, 'messages'); // Referință la colecția 'messages' din Firestore
            let doc = await getDocs(messagesRef); // Obține toate documentele din colecția 'messages'
            let data = doc.docs.map(d => ({ ...d.data(), id: d.id })); // Mapare a documentelor pentru a extrage datele și ID-ul

            let filteredMessages = await Promise.all(
                data.filter(d => d.receiverId === currentUser.uid).map(async (msg) => { // Filtrează mesajele unde receiverId este ID-ul utilizatorului curent
                    const senderData = await getUserById(msg.senderId); // Preia datele expeditorului pe baza ID-ului
                    return {
                        ...msg,
                        senderFirstName: senderData?.firstName || 'Unknown', // Adaugă prenumele expeditorului
                        senderLastName: senderData?.lastName || 'Unknown', // Adaugă numele de familie al expeditorului
                        senderEmail: senderData?.email || 'Unknown' // Adaugă email-ul expeditorului
                    };
                })
            );

            setMessages(filteredMessages); // Actualizează starea cu mesajele filtrate și îmbogățite cu datele expeditorului
        }

        getData(); // Apelează funcția pentru a prelua datele la montarea componentei
    }, [currentUser]); // Efectul rulează de fiecare dată când se schimbă utilizatorul curent

    const handleClose = () => {
        setOpen(false); // Închide dialogul
        setDialogMessage(null); // Resetează mesajul din dialog
    };

    const handleOpenReplyDialog = (msg) => {
        setDialogMessage(msg); // Setează mesajul selectat pentru răspuns
        setOpenReply(true); // Deschide dialogul de răspuns
    };

    const handleCloseReplyDialog = () => {
        setOpenReply(false); // Închide dialogul de răspuns
        setReplyMessage(''); // Resetează mesajul de răspuns
    };

    const handleReplyMessage = async () => {
        if (replyMessage.trim()) { // Verifică dacă răspunsul nu este gol
            try {
                await addDoc(collection(db, 'messages'), { // Adaugă un nou document în colecția 'messages'
                    senderId: currentUser.uid, // ID-ul expeditorului (utilizatorul curent)
                    receiverId: dialogMessage.senderId, // ID-ul destinatarului (expeditorul original al mesajului)
                    message: replyMessage, // Conținutul răspunsului
                    timestamp: new Date() // Timpul curent
                });
                handleCloseReplyDialog(); // Închide dialogul de răspuns după trimitere
            } catch (error) {
                console.error('Error sending reply:', error); // Afișează eroarea în caz de eșec
            }
        }
    };

    const handleOpenConfirmDelete = (messageId) => {
        setSelectedMessageId(messageId); // Setează ID-ul mesajului selectat pentru ștergere
        setOpenConfirmDelete(true); // Deschide dialogul de confirmare ștergere
    };

    const handleCloseConfirmDelete = () => {
        setOpenConfirmDelete(false); // Închide dialogul de confirmare ștergere
        setSelectedMessageId(null); // Resetează mesajul selectat
    };

    const handleDeleteMessage = async () => {
        if (selectedMessageId) { // Verifică dacă există un mesaj selectat
            try {
                await deleteDoc(doc(db, 'messages', selectedMessageId)); // Șterge documentul din Firestore pe baza ID-ului
                setMessages(prevMessages => prevMessages.filter(msg => msg.id !== selectedMessageId)); // Actualizează starea eliminând mesajul șters
                handleCloseConfirmDelete(); // Închide dialogul de confirmare
            } catch (error) {
                console.error('Error deleting message:', error); // Afișează eroarea în caz de eșec
            }
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage); // Actualizează pagina curentă a tabelului
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10)); // Actualizează numărul de rânduri pe pagină
        setPage(0); // Resetează pagina curentă la 0 când se schimbă numărul de rânduri pe pagină
    };

    return (
        <div>
            <Header /> {/* Afișează componenta Header */}
            <TableContainer component={Paper} sx={{
                marginTop: 15, // Margine de sus pentru container
                borderRadius: 2, // Colțuri rotunjite pentru container
                overflowX: 'auto', // Activează derularea pe orizontală
                backgroundColor: 'rgba(0, 0, 0, 0.6)', // Culoarea de fundal semi-transparentă
                color: '#dcdcdc', // Culoarea textului
            }}>
                <Table sx={{ minWidth: 650 }} aria-label="customized table"> {/* Tabel personalizat */}
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#dcdcdc', textTransform: 'uppercase' }}> {/* Rândul de antet */}
                            <TableCell sx={{ color: 'rgba(0, 0, 0, 0.9)', fontWeight: 'bold' }}>Sender Name</TableCell> {/* Celula pentru numele expeditorului */}
                            <TableCell sx={{ color: 'rgba(0, 0, 0, 0.9)', fontWeight: 'bold' }}>Sender Email</TableCell> {/* Celula pentru email-ul expeditorului */}
                            <TableCell sx={{ color: 'rgba(0, 0, 0, 0.9)', fontWeight: 'bold' }}>Message</TableCell> {/* Celula pentru mesaj */}
                            <TableCell sx={{ color: 'rgba(0, 0, 0, 0.9)', fontWeight: 'bold' }}>Actions</TableCell> {/* Celula pentru acțiuni */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {messages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((msg) => ( // Iterează prin mesaje pentru a crea rânduri
                            <TableRow
                                key={msg.id} // Cheia unică pentru fiecare rând
                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }} // Culoarea de fundal a rândurilor
                            >
                                <TableCell sx={{ color: '#dcdcdc' }}>{msg.senderFirstName} {msg.senderLastName}</TableCell> {/* Afișează numele complet al expeditorului */}
                                <TableCell sx={{ color: '#dcdcdc' }}>{msg.senderEmail}</TableCell> {/* Afișează email-ul expeditorului */}
                                <TableCell sx={{ color: '#dcdcdc' }}>{msg.message}</TableCell> {/* Afișează mesajul */}
                                <TableCell>
                                    <IconButton onClick={() => handleOpenReplyDialog(msg)}> {/* Butonul pentru deschiderea dialogului de răspuns */}
                                        <Replay sx={{ color: '#1e88e5' }} /> {/* Iconița de răspuns */}
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenConfirmDelete(msg.id)}> {/* Butonul pentru deschiderea dialogului de confirmare ștergere */}
                                        <Delete sx={{ color: '#9e1b32' }} /> {/* Iconița de ștergere */}
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div" // Pagination component
                    count={messages.length} // Numărul total de mesaje
                    page={page} // Pagina curentă
                    onPageChange={handleChangePage} // Funcția pentru schimbarea paginii
                    rowsPerPage={rowsPerPage} // Numărul de rânduri pe pagină
                    onRowsPerPageChange={handleChangeRowsPerPage} // Funcția pentru schimbarea numărului de rânduri pe pagină
                    sx={{
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { color: '#dcdcdc' }, // Stilizare pentru componentele de paginare
                        '& .MuiIconButton-root': { color: '#dcdcdc' }, // Stilizare pentru butoanele de paginare
                    }}
                />
            </TableContainer>

            {/* Dialog pentru răspuns */}
            <Dialog open={openReply} onClose={handleCloseReplyDialog}> {/* Dialog pentru a răspunde la un mesaj */}
                <DialogTitle sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: '#dcdcdc' }}>Reply to Message</DialogTitle> {/* Titlul dialogului */}
                <DialogContent sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: '#dcdcdc' }}> {/* Conținutul dialogului */}
                    <TextField
                        label="Your Reply" // Eticheta câmpului
                        fullWidth // Ocupă toată lățimea disponibilă
                        multiline // Activează modul multi-linie
                        rows={4} // Numărul de linii pentru textul din câmp
                        value={replyMessage} // Valoarea curentă a câmpului
                        onChange={(e) => setReplyMessage(e.target.value)} // Actualizează starea la modificarea textului
                        sx={{ backgroundColor: '#dcdcdc' }} // Stilizare pentru câmpul text
                    />
                </DialogContent>
                <DialogActions sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}> {/* Acțiunile din dialog */}
                    <Button onClick={handleCloseReplyDialog} sx={{ color: '#dcdcdc' }}> {/* Butonul pentru anularea răspunsului */}
                        Cancel
                    </Button>
                    <Button onClick={handleReplyMessage} sx={{ color: '#dcdcdc' }}> {/* Butonul pentru trimiterea răspunsului */}
                        Reply
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog de confirmare pentru ștergere */}
            <Dialog open={openConfirmDelete} onClose={handleCloseConfirmDelete}> {/* Dialog pentru confirmarea ștergerii */}
                <DialogTitle sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: '#dcdcdc' }}>Confirm Deletion</DialogTitle> {/* Titlul dialogului */}
                <DialogContent sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: '#dcdcdc' }}> {/* Conținutul dialogului */}
                    Are you sure you want to delete this message?
                </DialogContent>
                <DialogActions sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}> {/* Acțiunile din dialog */}
                    <Button onClick={handleCloseConfirmDelete} sx={{ color: '#dcdcdc' }}> {/* Butonul pentru anularea ștergerii */}
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteMessage} sx={{ color: 'red' }}> {/* Butonul pentru confirmarea ștergerii */}
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Messages; // Exportă componenta pentru a fi utilizată în alte părți ale aplicației


