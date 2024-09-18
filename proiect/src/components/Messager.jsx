// import { useState, useEffect } from 'react';
// import { TableBody, TableCell, TableHead, TableRow, Table, Paper, TableContainer, TablePagination, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
// import { Delete,Replay } from '@mui/icons-material'; // Only delete icon
// import { db } from '../../firebase';
// import { collection, getDocs, doc, deleteDoc,getDoc } from 'firebase/firestore'; // Add deleteDoc
// import { useAuth } from '../contexts/authContext';
// import Header from './Header';

// // aceasta functie preia datele celui care trimite mesajul
// const getUserById = async (userId) => {
//     try {
//         const userDoc = await getDoc(doc(db, 'users', userId)); // Fetch the user document
//         if (userDoc.exists()) {
//             return userDoc.data(); // Return user data
//         } else {
//             console.log('No such user!');
//             return null;
//         }
//     } catch (error) {
//         console.error('Error fetching user:', error);
//         return null;
//     }
// };

// function Messages() {
//     const { currentUser } = useAuth();
//     const [messages, setMessages] = useState([]);
//     const [open, setOpen] = useState(false);
//     const [openConfirmDelete, setOpenConfirmDelete] = useState(false); // Confirmation dialog state
//     const [selectedMessageId, setSelectedMessageId] = useState(null); // ID of message to delete
//     const [dialogMessage, setDialogMessage] = useState(null);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);

   
//     useEffect(() => {
//         async function getData() {
//             const messagesRef = collection(db, 'messages');
//             let doc = await getDocs(messagesRef);
//             let data = doc.docs.map(d => ({ ...d.data(), id: d.id }));
    
//             // Filter messages for the current user and fetch sender's details
//             let filteredMessages = await Promise.all(
//                 data.filter(d => d.receiverId === currentUser.uid).map(async (msg) => {
//                     const senderData = await getUserById(msg.senderId); // Get sender's details
//                     return {
//                         ...msg,
//                         senderFirstName: senderData?.firstName || 'Unknown',
//                         senderLastName: senderData?.lastName || 'Unknown',
//                         senderEmail: senderData?.email || 'Unknown'
//                     };
//                 })
//             );
    
//             setMessages(filteredMessages);
//         }
    
//         getData();
//     }, [currentUser]);


//     const handleClose = () => {
//         setOpen(false);
//         setDialogMessage(null);
//     };

//     const handleOpenConfirmDelete = (messageId) => {
//         setSelectedMessageId(messageId); // Store the message ID to be deleted
//         setOpenConfirmDelete(true); // Open confirmation dialog
//     };

//     const handleCloseConfirmDelete = () => {
//         setOpenConfirmDelete(false); // Close confirmation dialog
//         setSelectedMessageId(null); // Reset the selected message
//     };

//     const handleDeleteMessage = async () => {
//         if (selectedMessageId) {
//             try {
//                 await deleteDoc(doc(db, 'messages', selectedMessageId)); // Delete the message from Firebase
//                 setMessages(prevMessages => prevMessages.filter(msg => msg.id !== selectedMessageId)); // Update the state to remove the message
//                 handleCloseConfirmDelete(); // Close confirmation dialog
//             } catch (error) {
//                 console.error('Error deleting message:', error);
//             }
//         }
//     };

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     return (
//         <div>
//             <Header />
            
//             <TableContainer component={Paper} sx={{
//     marginTop: 15,
//     borderRadius: 2,
//     overflowX: 'auto',
//     backgroundColor: 'rgba(0, 0, 0, 0.6)', // Black background
//     color: '#dcdcdc', // Light gray text color
// }}>
//     <Table sx={{ minWidth: 650 }} aria-label="customized table">
//         <TableHead>
//             <TableRow sx={{ backgroundColor: '#dcdcdc', textTransform: 'uppercase' }}>
//                 <TableCell sx={{ color: 'rgba(0, 0, 0, 0.9)', fontWeight: 'bold' }}>Sender Name</TableCell>
//                 <TableCell sx={{ color: 'rgba(0, 0, 0, 0.9)', fontWeight: 'bold' }}>Sender Email</TableCell>
//                 <TableCell sx={{ color: 'rgba(0, 0, 0, 0.9)', fontWeight: 'bold' }}>Message</TableCell>
//                 <TableCell sx={{ color: 'rgba(0, 0, 0, 0.9)', fontWeight: 'bold' }}>Actions</TableCell>
//             </TableRow>
//         </TableHead>
//         <TableBody>
//             {messages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((msg) => (
//                 <TableRow
//                     key={msg.id}
//                     sx={{
//                         backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly lighter background for rows
//                     }}
//                 >
//                     <TableCell sx={{ color: '#dcdcdc' }}>{msg.senderFirstName} {msg.senderLastName}</TableCell>
//                     <TableCell sx={{ color: '#dcdcdc' }}>{msg.senderEmail}</TableCell>
//                     <TableCell sx={{ color: '#dcdcdc' }}>{msg.message}</TableCell>
//                     <TableCell>
//                         <IconButton onClick={() => handleOpenConfirmDelete(msg.id)}>
//                             <Delete sx={{ color: '#9e1b32' }} />
//                         </IconButton>
//                     </TableCell>
//                 </TableRow>
//             ))}
//         </TableBody>
//     </Table>
//     <TablePagination
//         component="div"
//         count={messages.length}
//         page={page}
//         onPageChange={handleChangePage}
//         rowsPerPage={rowsPerPage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//         sx={{
//             '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { color: '#dcdcdc' },
//             '& .MuiIconButton-root': { color: '#dcdcdc' },
//         }}
//     />
// </TableContainer>

//             {/* Modal Dialog for Viewing Message */}
//             <Dialog open={open} onClose={handleClose}>
//                 <DialogTitle sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: '#dcdcdc' }}>Message Details</DialogTitle>
//                 <DialogContent sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: '#dcdcdc' }}>
//                     {dialogMessage && (
//                         <div>
//                             <p><strong>Message:</strong> {dialogMessage.message}</p>
//                             <p><strong>Sender ID:</strong> {dialogMessage.senderId}</p>
//                         </div>
//                     )}
//                 </DialogContent>
//                 <DialogActions sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
//                     <Button onClick={handleClose} sx={{ color: '#dcdcdc' }}>
//                         Close
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Confirmation Dialog for Delete */}
//             <Dialog open={openConfirmDelete} onClose={handleCloseConfirmDelete}>
//                 <DialogTitle sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: '#dcdcdc' }}>Confirm Deletion</DialogTitle>
//                 <DialogContent sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: '#dcdcdc' }}>
//                     Are you sure you want to delete this message?
//                 </DialogContent>
//                 <DialogActions sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
//                     <Button onClick={handleCloseConfirmDelete} sx={{ color: '#dcdcdc' }}>
//                         Cancel
//                     </Button>
//                     <Button onClick={handleDeleteMessage} sx={{ color: 'red' }}>
//                         Delete
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </div>
//     );
// }

// export default Messages;

import { useState, useEffect } from 'react';
import { TableBody, TableCell, TableHead, TableRow, Table, Paper, TableContainer, TablePagination, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { Delete, Replay } from '@mui/icons-material'; 
import { db } from '../../firebase';
import { collection, getDocs, doc, deleteDoc, getDoc, addDoc } from 'firebase/firestore'; // Add addDoc for sending messages
import { useAuth } from '../contexts/authContext';
import Header from './Header';

// Function to fetch user details by ID
const getUserById = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId)); 
        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            console.log('No such user!');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
};

function Messages() {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [open, setOpen] = useState(false);
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false); 
    const [openReply, setOpenReply] = useState(false); // Dialog for replying
    const [selectedMessageId, setSelectedMessageId] = useState(null); 
    const [dialogMessage, setDialogMessage] = useState(null);
    const [replyMessage, setReplyMessage] = useState(''); // State for reply message
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        async function getData() {
            const messagesRef = collection(db, 'messages');
            let doc = await getDocs(messagesRef);
            let data = doc.docs.map(d => ({ ...d.data(), id: d.id }));

            let filteredMessages = await Promise.all(
                data.filter(d => d.receiverId === currentUser.uid).map(async (msg) => {
                    const senderData = await getUserById(msg.senderId);
                    return {
                        ...msg,
                        senderFirstName: senderData?.firstName || 'Unknown',
                        senderLastName: senderData?.lastName || 'Unknown',
                        senderEmail: senderData?.email || 'Unknown'
                    };
                })
            );

            setMessages(filteredMessages);
        }

        getData();
    }, [currentUser]);

    const handleClose = () => {
        setOpen(false);
        setDialogMessage(null);
    };

    const handleOpenReplyDialog = (msg) => {
        setDialogMessage(msg);
        setOpenReply(true);
    };

    const handleCloseReplyDialog = () => {
        setOpenReply(false);
        setReplyMessage(''); // Reset reply message
    };

    const handleReplyMessage = async () => {
        if (replyMessage.trim()) {
            try {
                // Send reply to the original sender
                await addDoc(collection(db, 'messages'), {
                    senderId: currentUser.uid, // current user's ID
                    receiverId: dialogMessage.senderId, // original sender is now the receiver
                    message: replyMessage,
                    timestamp: new Date()
                });
                handleCloseReplyDialog(); // Close dialog on success
            } catch (error) {
                console.error('Error sending reply:', error);
            }
        }
    };

    const handleOpenConfirmDelete = (messageId) => {
        setSelectedMessageId(messageId);
        setOpenConfirmDelete(true);
    };

    const handleCloseConfirmDelete = () => {
        setOpenConfirmDelete(false);
        setSelectedMessageId(null);
    };

    const handleDeleteMessage = async () => {
        if (selectedMessageId) {
            try {
                await deleteDoc(doc(db, 'messages', selectedMessageId));
                setMessages(prevMessages => prevMessages.filter(msg => msg.id !== selectedMessageId));
                handleCloseConfirmDelete();
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div>
            <Header />
            <TableContainer component={Paper} sx={{
                marginTop: 15,
                borderRadius: 2,
                overflowX: 'auto',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: '#dcdcdc',
            }}>
                <Table sx={{ minWidth: 650 }} aria-label="customized table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#dcdcdc', textTransform: 'uppercase' }}>
                            <TableCell sx={{ color: 'rgba(0, 0, 0, 0.9)', fontWeight: 'bold' }}>Sender Name</TableCell>
                            <TableCell sx={{ color: 'rgba(0, 0, 0, 0.9)', fontWeight: 'bold' }}>Sender Email</TableCell>
                            <TableCell sx={{ color: 'rgba(0, 0, 0, 0.9)', fontWeight: 'bold' }}>Message</TableCell>
                            <TableCell sx={{ color: 'rgba(0, 0, 0, 0.9)', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {messages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((msg) => (
                            <TableRow
                                key={msg.id}
                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                            >
                                <TableCell sx={{ color: '#dcdcdc' }}>{msg.senderFirstName} {msg.senderLastName}</TableCell>
                                <TableCell sx={{ color: '#dcdcdc' }}>{msg.senderEmail}</TableCell>
                                <TableCell sx={{ color: '#dcdcdc' }}>{msg.message}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenReplyDialog(msg)}>
                                        <Replay sx={{ color: '#1e88e5' }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenConfirmDelete(msg.id)}>
                                        <Delete sx={{ color: '#9e1b32' }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={messages.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { color: '#dcdcdc' },
                        '& .MuiIconButton-root': { color: '#dcdcdc' },
                    }}
                />
            </TableContainer>

            {/* Reply Dialog */}
            <Dialog open={openReply} onClose={handleCloseReplyDialog}>
                <DialogTitle sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: '#dcdcdc' }}>Reply to Message</DialogTitle>
                <DialogContent sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: '#dcdcdc' }}>
                    <TextField
                        label="Your Reply"
                        fullWidth
                        multiline
                        rows={4}
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        sx={{ backgroundColor: '#dcdcdc' }}
                    />
                </DialogContent>
                <DialogActions sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
                    <Button onClick={handleCloseReplyDialog} sx={{ color: '#dcdcdc' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleReplyMessage} sx={{ color: '#1e88e5' }}>
                        Send Reply
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Dialog for Delete */}
            <Dialog open={openConfirmDelete} onClose={handleCloseConfirmDelete}>
                <DialogTitle sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: '#dcdcdc' }}>Confirm Deletion</DialogTitle>
                <DialogContent sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: '#dcdcdc' }}>
                    Are you sure you want to delete this message?
                </DialogContent>
                <DialogActions sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
                    <Button onClick={handleCloseConfirmDelete} sx={{ color: '#dcdcdc' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteMessage} sx={{ color: 'red' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Messages;

