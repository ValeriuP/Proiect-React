import React from "react";
import { useAuth } from "../contexts/authContext";
import { doSignOut } from "../../auth";
import { Button,Box,Typography } from "@mui/material";
import { Link,useNavigate,useLocation } from "react-router-dom";

function Header() {
    const navigate=useNavigate();
    const location= useLocation();
    const {currentUser,userLoggedIn}=useAuth();
    const isLoginPage =location.pathname ==='/login';
    const isRegisterPage= location.pathname==='/register';

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
                }}
            >
                <Typography variant="h6">Home Page</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {userLoggedIn ? (
                        <>
                            <Typography variant="body1" sx={{ marginRight: '16px' }}>
                                Hello, {currentUser.email}
                            </Typography>
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
                            <Button
                                style={{
                                    backgroundColor: "#91c1eb",
                                    color: "black",
                                    fontSize: "12px",
                                    margin: "4px",
                                    alignItems: "center"
                                }}
                                href="/login"
                            >
                                Login
                            </Button>
                            <Button
                                style={{
                                    backgroundColor: "#91c1eb",
                                    color: "black",
                                    fontSize: "12px",
                                    margin: "4px",
                                    alignItems: "center"
                                }}
                                href="/register"
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Box>
            {!userLoggedIn && (
                <Box sx={styles.bottomContainer}>
                    {isLoginPage && (
                        <Typography variant="body2">
                            Dacă nu aveți cont, <Link to="/register">Register</Link>
                        </Typography>
                    )}
                    {isRegisterPage && (
                        <Typography variant="body2">
                            Aveți cont, <Link to="/login">Login</Link>
                        </Typography>
                    )}
                </Box>
            )}
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
        backgroundColor: 'white',
        width: '100%',
        boxShadow: '0 -1px 10px rgba(0, 0, 0, 0.1)',
    },
};

export default Header;