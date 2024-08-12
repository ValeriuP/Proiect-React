import React,{useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { Button,Box,TextField,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper } from "@mui/material";
import { doCreateUserWithEmailAndPassword}from "../../auth";
import { setDoc,doc } from "firebase/firestore";
import { db } from "../../firebase";
import { collection,getDoc,getDocs,deleteDoc } from "firebase/firestore";
import Header from "./Header";
import '../Home.css';

function Home(){
    const navigate= useNavigate();
    const {currentUser}=useAuth();
    const [users,setUsers]=useState([]);
    const [isAdmin,setAdmin]=useState(false);
    const [editData, setEditData]= useState({});
    
    
    return (
        <div className="homeContainer" >
            <div className="headercontainer">
            <Header />
            </div>
            
            <div className="homeContainer_2">
               <Button variant="contained" >Add Flats</Button>
            </div>
           
        </div>
    
      
    )
}

export default Home





