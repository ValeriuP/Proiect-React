import React,{useEffect,useState} from "react";
import { useAuth } from "../contexts/authContext";
import { db } from "../../firebase";
import { getDocs,collection,query,where, doc } from "firebase/firestore";
import { Table,TableCell,TableBody,TableHead,TableContainer,TableRow,Button,Paper } from "@mui/material";
import Header from "./Header";
import { Link, useNavigate, useLocation } from "react-router-dom";



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
    },[currentUser]);

    return(
        <div>
            <div>
                <Header />
            </div>

         <TableContainer  sx={{marginTop:'80px', backgroundColor:' rgba(0, 0, 0, 0.7)'}}>
            <Table>
                <TableHead>
                    <TableRow sx={{height:100}}> 
                        <TableCell sx={{color:'#dcdcdc', textTransform:'uppercase'}}>City</TableCell>
                        <TableCell sx={{color:'#dcdcdc', textTransform:'uppercase'}}>Stret Name</TableCell>
                        <TableCell sx={{color:'#dcdcdc', textTransform:'uppercase'}}>Stret Number</TableCell>
                        <TableCell sx={{color:'#dcdcdc', textTransform:'uppercase'}}>Area Size</TableCell>
                        <TableCell sx={{color:'#dcdcdc', textTransform:'uppercase'}}>Has AC</TableCell>
                        <TableCell sx={{color:'#dcdcdc', textTransform:'uppercase'}}>Year Built</TableCell>
                        <TableCell sx={{color:'#dcdcdc', textTransform:'uppercase'}}>Rent Price</TableCell>
                        <TableCell sx={{color:'#dcdcdc', textTransform:'uppercase'}}>Date Available</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{
                    flats.map(flat=>(
                        <TableRow key={flat.id} >
                        <TableCell sx={{color:'#dcdcdc', textTransform:'capitalize'}}>{flat.city}</TableCell>
                        <TableCell sx={{color:'#dcdcdc', textTransform:'capitalize'}}>{flat.streetName}</TableCell>
                        <TableCell sx={{color:'#dcdcdc'}}>{flat.streetNumber}</TableCell>
                         <TableCell sx={{color:'#dcdcdc'}}>{flat.areaSize}</TableCell>
                         <TableCell sx={{color:'#dcdcdc', textTransform:'uppercase'}}>{flat.ac}</TableCell>
                         <TableCell sx={{color:'#dcdcdc'}}>{flat.yearBuilt}</TableCell>
                         <TableCell sx={{color:'#dcdcdc'}}>{flat.rentPrice}</TableCell>
                         <TableCell sx={{color:'#dcdcdc'}}>{flat.dateAvailable}</TableCell>
                         
                            <Button  sx={{color:'#dcdcdc', '&:hover':{
                    backgroundColor:' #aaaaa2', color:'black'
                }}}>Favorite</Button>
                            <Button  sx={{color:'#dcdcdc', '&:hover':{
                    backgroundColor:' #aaaaa2', color:'black'
                }}}>Delete</Button>
                        

                        </TableRow>
                    ))
                    }

                </TableBody>
            </Table>
        </TableContainer> 
      <div  style={{ display: 'flex', justifyContent: 'flex-end' }}> <Button  sx={{
                                color:'  rgba(0, 0, 0, 0.9)',fontSize:'20px',width:100,backgroundColor:'#dcdcdc',marginTop:5, '&:hover':{
                    backgroundColor:'rgba(0, 0, 0, 0.9)', color:' #dcdcdc'}
                            }} 
                            color="inherit" component={Link} to="/">Back</Button> </div> 

        </div>
    );
}
export default MyFlats;