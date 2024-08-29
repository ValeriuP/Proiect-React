import React,{useEffect,useState} from "react";
import { useNavigate,Outlet,Link,useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { Button,Box,TextField,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Toolbar } from "@mui/material";
import { doCreateUserWithEmailAndPassword}from "../../auth";
import { setDoc,doc } from "firebase/firestore";
import { db } from "../../firebase";
import { collection,getDoc,getDocs,deleteDoc } from "firebase/firestore";
import Header from "./Header";
import AllFlats from "./AllFlats";
import '../Home.css';


function Home(){
    const navigate= useNavigate();
    const {currentUser,userLoggedIn,loading}=useAuth();
    const [users,setUsers]=useState([]);
    const [isAdmin,setIsAdmin]=useState(false);
    const [editData, setEditData]= useState({});
    const location =useLocation();
    const [showAllFlats,setShowAllFlats]=useState(true);
    
    useEffect(()=>{
      
       
        if(!loading)
        {
        if (!currentUser){
            navigate('/login');
        }else{
            checkAdminStatus();
            fetchUsers();
        }
        }
    },[loading]);
    
    useEffect(() => {
        // Actualizează vizibilitatea lui AllFlats în funcție de ruta curentă
        if (location.pathname === '/') {
            setShowAllFlats(true);
        } else {
            setShowAllFlats(false);
        }
    }, [location]);
    const checkAdminStatus = async () => {
        if (currentUser) {
            const userDoc = doc(db, "users", currentUser.uid);
            const userSnapshot = await getDoc(userDoc);
            const userData = userSnapshot.data();
            if (userData) {
                setIsAdmin(userData.isAdmin);
            }
        }
    };
    const fetchUsers = async () => {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    
    return (
        <>
        
          {showAllFlats && <AllFlats />} {/* Afișează AllFlats doar dacă showAllFlats este true */}
         <div>
                <Toolbar>
                    <Button 
                        color="inherit"
                        component={Link}
                        to="/my-flats"
                        sx={{
                            color:' #aaaaa2','&:hover':{
                backgroundColor:'#3E482A', color:'#79804D'}
                        }} 
                    >
                        My Flats
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/favorite-flats"
                        sx={{
                            color:' #aaaaa2','&:hover':{
                backgroundColor:'#3E482A', color:'#79804D'}
                        }} 
                    >
                        Favorite Flats
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/add-flat"
                        sx={{
                            color:' #aaaaa2','&:hover':{
                backgroundColor:'#3E482A', color:'#79804D'}
                        }} 
                    >
                        Add Flat
                    </Button>
                </Toolbar>
            </div>
          
           
        
    
        
        </>
    
      
    )
}

export default Home;





