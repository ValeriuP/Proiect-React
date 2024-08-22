import React, { useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import { doSignOut } from "../../auth";
import { Button,Box,Typography } from "@mui/material";
import { Link,useNavigate,useLocation } from "react-router-dom";
import { StayCurrentPortrait } from "@mui/icons-material";

function Header() {
    const navigate=useNavigate();
    const location= useLocation();
    const {currentUser,userLoggedIn}=useAuth();
    const isLoginPage =location.pathname ==='/login';
    const isRegisterPage= location.pathname==='/register';

    useEffect(()=>{console.log(location)},[])
    function renderSwitch(param)
    {
        switch (param)
        {
            case "/":
                return "Home Page"
                case "/all-flats":
                return "All Flats"
        }
        

    }

  return (
    <>
    
            <Box
                component="nav"
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 20px',
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    marginTop:'10px',
                    opacity:3,
                }}
            >
                   <div>
                         <Button color="inherit" component={Link} to="/"> Home</Button>
                         <Button color="inherit" component={Link} to="/my-profiles">My Profile </Button>
                         <Button color="inherit" component={Link} to="/all-flats">All Flats</Button>
                         </div> 
<<<<<<< HEAD
                <Typography variant="h6">{renderSwitch(location.pathname)}</Typography>
=======
                         <div>
                            {/* <Typography variant='h1'sx={{display:'flex',alignItems:'center'}}>Hello ,document</Typography> */}
                         </div>
                <Typography variant="h6">Home Page</Typography>
>>>>>>> 1830b3ee2c091729c0a037ac9e8af26656a24bc4
                <Box sx={{ display:'flex', alignItems: 'center' }}>
                    {userLoggedIn ? (
                        <>
                       
                        <div className="hello">
                            <Typography variant="body1" sx={{ marginRight: '20px',marginLeft:'150px'}}>
                                Hello, {currentUser.email}
                            </Typography>
                            </div>
                         
                            <Button
                                style={{
                                    backgroundColor: "#ed5853",
                                    color: "black",
                                    fontSize: "12px",
                                    margin: "4px",
                                    marginLeft: "2rem",
                                    marginTop: "0px",
                                    alignItems: "center"
                                }}
                                onClick={() => {
                                    console.log("askjhdsa")
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
            </Box>
           
            
        </>
    );
}

const styles = {
    bottomContainer: {
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        padding: '10px',
        backgroundColor: 'cyan',
        width: '100%',
        boxShadow: '0 -1px 10px rgba(0, 0, 0, 0.1)',
    },
};

export default Header;