import {useEffect,useState} from "react";
import { useNavigate,Link,useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { Button,Toolbar } from "@mui/material";
import { db } from "../../firebase";
import { collection,getDoc,getDocs,doc } from "firebase/firestore";
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
          
        <div className="home__container">
           <h2 className="welcome__message" > Welcome to Flat Finder – Your Journey to the Perfect Home Starts Here! Whether you're looking for a cozy apartment or a spacious home, we're here to make the search simple and enjoyable.</h2>
     </div>
     <div className="motivational__message"> <h2 >
       No More Stressful Searches – Discover Your Ideal Living Space with Flat Finder!
       </h2></div>

         <div>
                <Toolbar>
                    <div className="start__message">Start Now</div>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/all-flats"
                        sx={{ fontSize:'larger',paddingTop: 10,
                            color:' #dcdcdc','&:hover':{
                color:'#dcdcdc', textDecorationLine:'underline'}
                        }} 
                    >
                        All Flats
                    </Button>
                    <Button 
                        color="inherit"
                        component={Link}
                        to="/my-flats"
                        sx={{ 
                            fontSize:'larger',paddingTop: 10,color:' #dcdcdc','&:hover':{
                                textDecorationLine:'underline', color:'#dcdcdc'}
                        }} 
                    >
                        My Flats
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/favorite-flats"
                        sx={{fontSize:'larger',paddingTop: 10,
                            color:'#dcdcdc','&:hover':{
                                textDecorationLine:'underline', color:'#dcdcdc'}
                        }} 
                    >
                        Favorite Flats
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/add-flat"
                        sx={{ fontSize:'larger',paddingTop: 10,
                            color:' #dcdcdc','&:hover':{
                                textDecorationLine:'underline', color:'#dcdcdc'}
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





