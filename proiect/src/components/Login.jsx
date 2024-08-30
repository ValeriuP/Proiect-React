import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { doSignInWithEmailAndPassword } from '../../auth';
import './Login.css'
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const { userLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [error, setError]=useState("");
    
    // useEffect(()=>{
    //     if(currenUser){
    //         navigate('/home')
    //     }
    // })

    const handleLogin = async () => {
        try {
            setError("");
            await doSignInWithEmailAndPassword(email, password);
            navigate('/');
        } catch (error) {
            console.error("Login failed:", error);
            if (error.code === "auth/user-not-found") {
                setError("Emailul introdus nu există.");
            } else if (error.code === "auth/invalid-email") {
                setError("Emailul introdus este invalid.");
            } else if (error.code === "auth/wrong-password") {
                setError("Parola introdusă este incorectă.");
            } else {
                setError("A apărut o eroare. Te rugăm să încerci din nou.");
            }
        }
    };

    return (
        <div className="login__container">
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '70vh',
            }}
        >
               <Typography variant="h4" sx={{ marginBottom: 4, color:'#aaaaa2'}} >
               Sign In
            </Typography>

            <TextField
                required
                id="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ marginBottom: 2 }}
            />
            <TextField
                required
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: 2 }}
            />
            <Button
                variant="contained"
                onClick={handleLogin}
                sx={{ marginBottom: 2, width: '210px' , color:' #aaaaa2', backgroundColor: 'rgba(0, 0, 0, 0.5)',  '&:hover':{
                    backgroundColor:' #aaaaa2', color:'black'
                }}}
            >
                Login
            </Button>
            <Typography variant="body2" sx={{ color:'#aaaaa2', marginTop: 3}}>
                Don't have an account? 
                <Link to="/register" className="link-register-style">Register</Link>
            </Typography>
        </Box>
        </div>
    );
}

export default Login;