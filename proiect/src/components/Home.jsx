import {useEffect,useState} from "react";
import { useNavigate,Link,useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { Button,Toolbar } from "@mui/material";
import { db } from "../../firebase";
import { collection,getDoc,getDocs,doc } from "firebase/firestore";
import AllFlats from "./Allflats";
import './Home.css'
import Header from "./Header";


function Home(){
    const navigate= useNavigate();
    const {currentUser,userLoggedIn,loading}=useAuth();
    // const [users,setUsers]=useState([]);
     const [isAdmin,setIsAdmin]=useState(false);
    // const [editData, setEditData]= useState({});
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
        <Header/>
          {/* {showAllFlats && <AllFlats />} Afișează AllFlats doar dacă showAllFlats este true */}
        <div className="home__container">
           <h2 className="welcome__message" > Welcome to Flat Finder – Your Journey to the Perfect Home Starts Here! Whether you're looking for a cozy apartment or a spacious home, we're here to make the search simple and enjoyable.</h2>
           </div>
     <div className="motivational__message"> <h2 >
       No More Stressful Searches – Discover Your Ideal Living Space with Flat Finder!
       </h2></div>
       
         <div>
                <Toolbar>
                    <Button 
                        color="inherit"
                        component={Link}
                        to="/my-flats"
                        sx={{ paddingLeft:30,
                            fontSize:'larger',paddingTop: 20,color:' #dcdcdc','&:hover':{
                backgroundColor:'rgba(0, 0, 0, 0.7)', color:'#dcdcdc'}
                        }} 
                    >
                        My Flats
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/favorite-flats"
                        sx={{fontSize:'larger',paddingTop: 20,
                            color:'#dcdcdc','&:hover':{
                backgroundColor:'rgba(0, 0, 0, 0.7)', color:'#dcdcdc'}
                        }} 
                    >
                        Favorite Flats
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/add-flat"
                        sx={{ fontSize:'larger',paddingTop: 20,
                            color:' #dcdcdc','&:hover':{
                backgroundColor:'rgba(0, 0, 0, 0.7)', color:'#dcdcdc'}
                        }} 
                    >
                        Add Flat
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/all-flats"
                        sx={{ fontSize:'larger',paddingTop: 20,
                            color:' #dcdcdc','&:hover':{
                backgroundColor:'rgba(0, 0, 0, 0.7)', color:'#dcdcdc',}
                        }} 
                    >
                        All Flats
                    </Button>
                </Toolbar>
            </div>
          
           
        
    
        
        </>
    
      
    )
}

export default Home;





