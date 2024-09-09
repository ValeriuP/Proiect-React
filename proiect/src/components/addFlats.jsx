import React,{useEffect,useState} from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { addDoc,collection } from "firebase/firestore";
import { Button,Container,TextField,Table,TableBody,TableContainer,TableRow,TableCell,Paper,ToggleButton,ToggleButtonGroup }  from "@mui/material";
import { Link} from "react-router-dom";
import { Box,CardContent,Dialog,DialogActions,DialogContent,DialogTitle,Typography,Grid,Card } from "@mui/material";



    function AddFlat() {
        const [flatData, setFlatData] = useState({
            city: '',
            streetName: '',
            streetNumber: '',
            areaSize: '',
            ac: '',
            yearBuilt: '',
            rentPrice: '',
            dateAvailable: '',
            ownerEmail: '',
            
        });
        const { currentUser } = useAuth()
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();
       const validate=()=>{
        let temporarErrors={};
        temporarErrors.city = flatData.city ? "" : "City is required.";
        temporarErrors.streetName = flatData.streetName ? "" : "Street Name is required.";
        temporarErrors.streetNumber = flatData.streetNumber ? "" : "Street Number is required.";
        temporarErrors.areaSize = flatData.areaSize && !isNaN(flatData.areaSize) ? "" : "Area Size is required and must be a number.";
        temporarErrors.ac = flatData.ac ? "" : "AC status is required.";
        temporarErrors.yearBuilt = flatData.yearBuilt && !isNaN(flatData.yearBuilt) ? "" : "Year Built is required and must be a number.";
        temporarErrors.rentPrice = flatData.rentPrice && !isNaN(flatData.rentPrice) ? "" : "Rent Price is required and must be a number.";
        temporarErrors.dateAvailable = flatData.dateAvailable ? "" : "Date Available is required.";
        temporarErrors.ownerEmail = flatData.ownerEmail ? "" : "Email is required.";
       
        setErrors(temporarErrors);
        return Object.values(temporarErrors).every(x=>x ==="");
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFlatData(prevData => ({ ...prevData, [name]: value }));
    };
    const handleDateChange = (e) => {
        setFlatData(prevData => ({ ...prevData, dateAvailable: e.target.value }));
    };
    const handleACChange = (e, newAC) => {
        if (newAC !== null) {
            setFlatData(prevData => ({ ...prevData, ac: newAC }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);  
        if (validate()) {
            setIsFormValid(true);
            try {
                if (currentUser) {
                    const flatData1 = { ...flatData, ownerUid: currentUser.uid }

                    const flatsCollection = collection(db, 'flats');
                    await addDoc(flatsCollection, flatData1);
                }
                navigate('/all-flats');
            } catch (error) {
                console.error("Error adding flat: ", error);
            }
        } else {
            setIsFormValid(false);
        }
    };

    return (
        
    <Container sx={{ maxWidth: '100%', paddingTop: 15, display: 'flex', justifyContent: 'center', alignItems: 'start', minHeight: '100vh' }}>
    <TableContainer sx={{ width: '450px', padding: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    <Typography variant="h5" sx={{ color: '#dcdcdc', display:'flex', justifyContent:'center', textTransform:'uppercase' }}>
        Add Flat
    </Typography>
            <Table sx={{ minWidth: 300,'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'transparent', // Transparent border on focus
        }, }}>
                <TableBody>
                    <TableRow sx={{ height: '40px' }}>
                        <TableCell sx={{ padding: '10px 8px' }}>
                            <TextField
                                name="city"
                                label="City"
                                onChange={handleChange}
                                sx={{ width: '100%', margin: 0 }}
                                InputProps={{ sx: { height: '40px', color: '#dcdcdc' } }}
                                InputLabelProps={{ sx: { color: '#dcdcdc' } }} 
                                error={isSubmitted && !!errors.city}
                                helperText={isSubmitted && errors.city}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow sx={{ height: '40px' }}>
                        <TableCell sx={{ padding: '10px 8px' }}>
                            <TextField
                                name="streetName"
                                label="Street Name"
                                onChange={handleChange}
                                sx={{ width: '100%', margin: 0 }}
                                InputProps={{ sx: { height: '40px', color: '#dcdcdc' } }}
                                InputLabelProps={{ sx: { color: '#dcdcdc' } }} 
                                error={isSubmitted && !!errors.streetName}
                                helperText={isSubmitted && errors.streetName}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow sx={{ height: '40px' }}>
                        <TableCell sx={{ padding: '10px 8px' }}>
                            <TextField
                                name="streetNumber"
                                label="Street Number"
                                onChange={handleChange}
                                sx={{ width: '100%', margin: 0 }}
                                InputProps={{ sx: { height: '40px', color: '#dcdcdc' } }}
                                InputLabelProps={{ sx: { color: '#dcdcdc' } }}
                                error={isSubmitted && !!errors.streetNumber}
                                helperText={isSubmitted && errors.streetNumber}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow sx={{ height: '40px' }}>
                        <TableCell sx={{ padding: '10px 8px' }}>
                            <TextField
                                name="areaSize"
                                label="Area Size"
                                onChange={handleChange}
                                sx={{ width: '100%', margin: 0 }}
                                InputProps={{ sx: { height: '40px', color: '#dcdcdc' } }}
                                InputLabelProps={{ sx: { color: '#dcdcdc' } }} 
                                error={isSubmitted && !!errors.areaSize}
                                helperText={isSubmitted && errors.areaSize}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow sx={{ height: '40px' }}>
                        <TableCell sx={{ padding: '10px 8px' }}>
                            <TextField
                                name="yearBuilt"
                                label="Year Built"
                                onChange={handleChange}
                                sx={{ width: '100%', margin: 0 }}
                                InputProps={{ sx: { height: '40px', color: '#dcdcdc' } }}
                                InputLabelProps={{ sx: { color: '#dcdcdc' } }} 
                                error={isSubmitted && !!errors.yearBuilt}
                                helperText={isSubmitted && errors.yearBuilt}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow sx={{ height: '40px' }}>
                        <TableCell sx={{ padding: '10px 8px' }}>
                            <TextField
                                name="rentPrice"
                                label="Rent Price"
                                onChange={handleChange}
                                sx={{ width: '100%', margin: 0 }}
                                InputProps={{ sx: { height: '40px', color: '#dcdcdc' } }}
                                InputLabelProps={{ sx: { color: '#dcdcdc' } }}
                                error={isSubmitted && !!errors.rentPrice}
                                helperText={isSubmitted && errors.rentPrice}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow sx={{ height: '40px' }}>
                        <TableCell sx={{ padding: '10px 8px' }}>
                            <TextField
                                required
                                id="dateAvailable"
                                label="Date Available"
                                type="date"
                                InputLabelProps={{ shrink: true, sx: { color: '#dcdcdc' } }} 
                                value={flatData.dateAvailable}
                                onChange={handleDateChange}
                                sx={{ marginBottom: 0, width: '100%' }}
                                InputProps={{ sx: { height: '40px', color: '#dcdcdc' } }}
                                error={isSubmitted && !!errors.dateAvailable}
                                helperText={isSubmitted && errors.dateAvailable}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow sx={{ height: '40px' }}>
                        <TableCell sx={{ padding: '10px 8px' }}>
                            <TextField
                                name="ownerEmail"
                                label="Email Owner"
                                onChange={handleChange}
                                sx={{ width: '100%', margin: 0 }}
                                InputProps={{ sx: { height: '40px', color: '#dcdcdc' } }}
                                InputLabelProps={{ sx: { color: '#dcdcdc' } }}
                                error={isSubmitted && !!errors.ownerEmail}
                                helperText={isSubmitted && errors.ownerEmail}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell align="center" sx={{ padding: '4px 8px', color: 'white' }}>
                        <Button
                               
                                sx={{
                                    backgroundColor: 'green',
                                    color: 'white',
                                    width: '100px',
                                    height: '30px',
                                    marginTop: 1, backgroundColor:'#dcdcdc',marginInline:2,  color:'rgba(0, 0, 0, 0.9)', '&:hover':{
                                        backgroundColor:'rgba(0, 0, 0, 0.9)', color:'#dcdcdc'}
                                }}
                                // component={Link}
                                //      to="/"
                            >
                             Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                sx={{
                                    backgroundColor: 'green',
                                    color: 'white',
                                    width: '100px',
                                    height: '30px',
                                    marginTop: 1, backgroundColor:'rgba(0, 0, 0, 0.9)',  color:'#dcdcdc', '&:hover':{
                                        backgroundColor:'#dcdcdc', color:'rgba(0, 0, 0, 0.9)'}
                                }}
                                disabled={isFormValid}
                            >
                                Save
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    </Container>
);


    }
    export default AddFlat;