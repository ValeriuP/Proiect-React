import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { db } from "../../firebase";
import { Button,Container,TextField,Table,TableBody,TableContainer,TableRow,TableCell,Paper,ToggleButton,ToggleButtonGroup }  from "@mui/material";
import { doc,deleteDoc,getDocs,collection,query,where } from "firebase/firestore";
import { Try } from "@mui/icons-material";

function FavoriteFlats(){
    const {currentUser}=useAuth;
    const [favoriteFlats,setFavoriteFlats]=useState([]);

    useEffect(()=>{
        const nowFavoriteFlats=async ()=> {
            try{
                const favoriteColection=collection(db,'users',currentUser.uid,'favorites');
                const favoriteNow=await getDocs(favoriteColection);
                const flatIdis=favoriteNow.docs.map(doc=>doc.data().flatId);

                if( flatIdis.length>0) {
                    const flatsQuestion=query(collection(db, 'flats'),where('_name_','in',flatIdis));
                    const flatsNow=await getDocs(flatsQuestion);
                    const flatsList=flatsNow.docs.map(doc=>({id:doc.id,...doc.data()}));
                    setFavoriteFlats(flatsList);
                }
            } catch (error) {
                console.error('eroare la preluarea apartamentelor preferate',error);
            }
        };
        nowFavoriteFlats();
    },[currentUser]);


    const handleDelete =async (flatId) =>{
        try{
            favoriteNowRef=doc(db, 'user',currentUser.uid,'favorites',flatId);
            await deleteDoc(favoriteNowRef);
            setFavoriteFlats(prevFlats =>prevFlats.filter(flat => flat.id !== flatId));
            console.log('Favorite deleted');
    
   
  }catch (error) {
        console.error('Error deleting favorite:', error);

};
return (
    <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>City</TableCell>
                        <TableCell>Street Name</TableCell>
                        <TableCell>Street Number</TableCell>
                        <TableCell>Area Size</TableCell>
                        <TableCell>AC</TableCell>
                        <TableCell>Year Built</TableCell>
                        <TableCell>Rent Price $</TableCell>
                        <TableCell>Date Available</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {favoriteFlats.map(flat => (
                        <TableRow key={flat.id}>
                            <TableCell>{flat.city}</TableCell>
                            <TableCell>{flat.streetName}</TableCell>
                            <TableCell>{flat.streetNumber}</TableCell>
                            <TableCell>{flat.areaSize}</TableCell>
                            <TableCell>{flat.ac}</TableCell>
                            <TableCell>{flat.yearBuilt}</TableCell>
                            <TableCell>{flat.rentPrice}</TableCell>
                            <TableCell>{flat.dateAvailable}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => handleDelete(flat.id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
);
}
}
export default FavoriteFlats;