import React,{useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { Button,Box,TextField,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper } from "@mui/material";
import { doCreateUserWithEmailAndPassword}from "../../auth";
import { setDoc,doc } from "firebase/firestore";
import { db } from "../../firebase";
import { collection,getDoc,getDocs,deleteDoc } from "firebase/firestore";
import Header from "./Header";

function Home(){
    const navigate= useNavigate();
    const {currentUser}=useAuth();
    const [users,setUsers]=useState([]);
    const [isAdmin,setAdmin]=useState(false);
    const [editData, setEditData]= useState({});

    useEffect(() =>{
        if (!currentUser){
            navigate('/login');
        }else {
            checkAdminStatus();
            fetchUsers();
        }
    },[currentUser,navigate]);

    const fetchUsers = async()=>{
        const usersCollection = collection(db,"users");
    }
    return (
        <div>
            <Header />

            <div className="container">
                <Button
                 variant="contained"
                //  onClick={}
                 sx={{marginBottom: 2}}
                >

                </Button>
            </div>
        </div>
    
      
    )
}





