import { useState, useEffect } from 'react';
import { TableBody, TableCell, TableHead, TableRow, Table, Paper, TableContainer, TablePagination, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { Delete } from '@mui/icons-material'; // Only delete icon
import { db } from '../../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'; // Add deleteDoc
import { useAuth } from '../contexts/authContext';
import Header from './Header';

function Messages() {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [open, setOpen] = useState(false);
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false); // Confirmation dialog state
    const [selectedMessageId, setSelectedMessageId] = useState(null); // ID of message to delete
    const [dialogMessage, setDialogMessage] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        async function getData() {
            const messagesRef = collection(db, 'messages');
            let doc = await getDocs(messagesRef);
            let data = doc.docs.map(d => ({ ...d.data(), id: d.id }));
            let filteredMessages = data.filter(d => d.receiverId === currentUser.uid);
            setMessages(filteredMessages);
        }
        getData();
    }, [currentUser]);


    const handleClose = () => {
        setOpen(false);
        setDialogMessage(null);
    };

    const handleOpenConfirmDelete = (messageId) => {
        setSelectedMessageId(messageId); // Store the message ID to be deleted
        setOpenConfirmDelete(true); // Open confirmation dialog
    };

    const handleCloseConfirmDelete = () => {
        setOpenConfirmDelete(false); // Close confirmation dialog
        setSelectedMessageId(null); // Reset the selected message
    };

    const handleDeleteMessage = async () => {
        if (selectedMessageId) {
            try {
                await deleteDoc(doc(db, 'messages', selectedMessageId)); // Delete the message from Firebase
                setMessages(prevMessages => prevMessages.filter(msg => msg.id !== selectedMessageId)); // Update the state to remove the message
                handleCloseConfirmDelete(); // Close confirmation dialog
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
                backgroundColor: 'rgba(0, 0, 0, 0.6)', // Black background
                color: '#dcdcdc', // Light gray text color
            }}>
                <Table sx={{ minWidth: 650 }} aria-label="customized table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#dcdcdc', textTransform: 'uppercase' }}>
                            <TableCell sx={{ color: 'rgba(0, 0, 0, 0.9)', fontWeight: 'bold' }}>Sender Id</TableCell>
                            <TableCell sx={{ color: 'rgba(0, 0, 0, 0.9)', fontWeight: 'bold' }}>Message</TableCell>
                            <TableCell sx={{ color: 'rgba(0, 0, 0, 0.9)', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {messages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((msg) => (
                            <TableRow
                                key={msg.id}
                                sx={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly lighter background for rows
                                }}
                            >
                                <TableCell sx={{ color: '#dcdcdc' }}>{msg.senderId}</TableCell>
                                <TableCell sx={{ color: '#dcdcdc' }}>{msg.message}</TableCell>
                                <TableCell>

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

            {/* Modal Dialog for Viewing Message */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: '#dcdcdc' }}>Message Details</DialogTitle>
                <DialogContent sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: '#dcdcdc' }}>
                    {dialogMessage && (
                        <div>
                            <p><strong>Message:</strong> {dialogMessage.message}</p>
                            <p><strong>Sender ID:</strong> {dialogMessage.senderId}</p>
                        </div>
                    )}
                </DialogContent>
                <DialogActions sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
                    <Button onClick={handleClose} sx={{ color: '#dcdcdc' }}>
                        Close
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
