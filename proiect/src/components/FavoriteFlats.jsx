import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { db } from "../../firebase";
import { Button,Table,TableBody,TableContainer,TableRow,TableCell,Paper }  from "@mui/material";
import { doc,deleteDoc,getDocs,collection,query,where } from "firebase/firestore";
import {TableHead} from "@mui/material";
import Header from "./Header";

function FavoriteFlats(){
    const {currentUser,userLoggedIn,loading}=useAuth();
    const [favoriteFlats,setFavoriteFlats]=useState([]);

    useEffect(()=>{
        const nowFavoriteFlats=async ()=> {
            try{
                console.log(currentUser);
                console.log(loading)
                if(!loading)
                {
                    console.log("test")
                const favoriteColection=collection(db,'users',currentUser.uid,'favorites');
                const favoriteNow=await getDocs(favoriteColection);
                const flatIdis=favoriteNow.docs.map(doc=>doc.data().flatId);
                console.log(flatIdis)

                if( flatIdis.length>0) {
                    const flatsQuestion=query(collection(db, 'flats'),where('_name_','in',flatIdis));
                    const flatsNow=await getDocs(flatsQuestion);
                    const flatsList=flatsNow.docs.map(doc=>({id:doc.id,...doc.data()}));
                    console.log(flatsList)
                    setFavoriteFlats(flatsList);
                }
            }
            } catch (error) {
                console.error('eroare la preluarea apartamentelor preferate',error);
            }
        };
        nowFavoriteFlats();
    },[loading]);


    const handleDelete =async (flatId) =>{
        try{
            favoriteNowRef=doc(db, 'user',currentUser.uid,'favorites',flatId);
            await deleteDoc(favoriteNowRef);
            setFavoriteFlats(prevFlats =>prevFlats.filter(flat => flat.id !== flatId));
            console.log('Favorite deleted');
    
   
  }catch (error) {
        console.error('Error deleting favorite:', error);
    }
}
return (
    <div>
        <div>
            <Header />
        </div>
    <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>City</TableCell>
                        <TableCell>Stret Name</TableCell>
                        <TableCell>Stret Number</TableCell>
                        <TableCell>Area Size</TableCell>
                        <TableCell>AC</TableCell>
                        <TableCell>Year Built</TableCell>
                        <TableCell>Rent Price $</TableCell>
                        <TableCell>Date Available</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {favoriteFlats.map(favoriteFlats => (
                        <TableRow key={favoriteFlats.id}>
                            <TableCell>{favoriteFlats.city}</TableCell>
                            <TableCell>{favoriteFlats.streetName}</TableCell>
                            <TableCell>{favoriteFlats.streetNumber}</TableCell>
                            <TableCell>{favoriteFlats.areaSize}</TableCell>
                            <TableCell>{favoriteFlats.ac}</TableCell>
                            <TableCell>{favoriteFlats.yearBuilt}</TableCell>
                            <TableCell>{favoriteFlats.rentPrice}</TableCell>
                            <TableCell>{favoriteFlats.dateAvailable}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => handleDelete(favoriteFlats.id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
</div>

);

}
export default FavoriteFlats;