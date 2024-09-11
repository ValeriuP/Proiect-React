import  { useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import { doSignOut } from "../../auth";
import { Button, Box, Typography } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import './Header.css';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, userLoggedIn } = useAuth();
    const { isAdmin } = useAuth(); // Get isAdmin from the Auth context

    useEffect(() => { console.log(location) }, []);

    function renderSwitch(param) {
        switch (param) {
            case "/":
                return "Home Page";
            case "/all-flats":
                return "All Flats";
            case "/my-profiles":
                return "My Profile";
                case "/messages":
                    return "My Messages";
             case "/all-users":
                return "All Users";
            default:
                return "";
        }
    }

    return (
    
        <div className="navbar__container">

            <HomeIcon  sx={{ fontSize: 40, color:' #dcdcdc' }}/>

            <h2 className='logo__name' >FlatFinder</h2>
          

            <div className="hello">
                <Typography variant="body1" sx={{
                                color:' #dcdcdc'
                            }} >
                    Hello, {currentUser?.email}
                </Typography>
            </div>
        
            <div> <Typography variant="h6" sx={{
                textTransform:'uppercase', 
                    color:' #dcdcdc',
                    padding:'100px'
                
            }}>{renderSwitch(location.pathname)}</Typography></div>
     
          
            <Box component="nav">
                <div className="components__pagename">
               
                    <Button sx={{
                                color:' #dcdcdc','&:hover':{
                    backgroundColor:'black', color:'#dcdcdc'}
                            }}
                              color="inherit" component={Link} to="/">Home</Button>
                    <Button sx={{
                                color:'#dcdcdc','&:hover':{
                    backgroundColor:'black', color:'#dcdcdc'}
                            }} 
                            color="inherit" component={Link} to="/my-profiles">My Profile</Button>
                    <Button  sx={{
                                color:' #dcdcdc', '&:hover':{
                    backgroundColor:'black', color:'#dcdcdc'}
                            }} 
                            color="inherit" component={Link} to="/messages">Messages</Button>
             
                 {isAdmin && (
    <Link to="/all-users">
        <Button
            sx={{
                color: '#dcdcdc',
                '&:hover': {
                    backgroundColor: 'black',
                    color: '#dcdcdc'
                },
                '&.Mui-focusVisible': {
                    border: 'none' // Remove any border when focused
                },
                '&:focus': {
                    outline: 'none', // Remove default focus outline
                    border: 'none'   // Ensure no border on focus
                }
            }}
        >
            All Users
        </Button>
    </Link>
)}
                <Box>
                    {userLoggedIn ? (
                        <>
                            <Button sx={{
                                backgroundColor:'#9e1b32',color:'#dcdcdc','&:hover':{
                    backgroundColor:'black', color:'#dcdcdc'}
                            }} 
                                onClick={() => {
                                    doSignOut().then(() => {
                                        navigate('/login');
                                    });
                                }}
                            >
                                Logout
                            </Button>
                        </>
                        
                    ) : (
                        <>
                           
                        </>
                    )}
                </Box>   
                  </div>
            </Box>
           
        </div>
    );
}

export default Header;
