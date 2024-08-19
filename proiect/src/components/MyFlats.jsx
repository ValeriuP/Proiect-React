import React,{useEffect,useState} from "react";
import { useAuth } from "../contexts/authContext";
import { db } from "../../firebase";
import { Table,TableCell,TableBody,TableHead,TableContainer,TableRow,Button,Paper } from "@mui/material";
import { getDocs,collection,query,where, doc } from "firebase/firestore";


function MyFlats(){
    const {currentUser}=useAuth();
    const [flats,setFlats]=useState([]);

    useEffect(()=>{
        const fetchFlats=async()=>{
            const flatsCollection=collection(db,'flats');
            const cant=query(flatsCollection,where('ownerUid','==',currentUser.uid));
            const flatsNow= await getDocs(cant);
            const flatsList=flatsNow.docs.map(doc=>({id:doc.id, ...doc.data()}));
            setFlats(flatsList);

        };
        fetchFlats();

    },[currentUser.uid]);

    return(
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>City</TableCell>
                        <TableCell>Stret Name</TableCell>
                        <TableCell>Stret Number</TableCell>
                        <TableCell>Area Size</TableCell>
                        <TableCell>Has AC</TableCell>
                        <TableCell>Year Built</TableCell>
                        <TableCell>Rent Price</TableCell>
                        <TableCell>Date Availabe</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{
                    flats.map(flat=>(
                        <TableRow key={flat.id}>
                        <TableCell>{flat.city}</TableCell>
                        <TableCell>{flat.stretName}</TableCell>
                        <TableCell>{flat.stretNumber}</TableCell>
                         <TableCell>{flat.areaSize}</TableCell>
                         <TableCell>{flat.hasAc}</TableCell>
                         <TableCell>{flat.yearBuilt}</TableCell>
                         <TableCell>{flat.rentPrice}</TableCell>
                         <TableCell>{flat.dateAvailble}</TableCell>
                         <TableCell>
                            <Button variant="outlined">Favorit</Button>
                            <Button variant="outlined">Delete</Button>
                         </TableCell>

                        </TableRow>
                    ))
                    }

                </TableBody>
            </Table>
        </TableContainer>
    );
}
export default MyFlats;