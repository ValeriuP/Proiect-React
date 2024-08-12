import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { doSignInWithEmailAndPassword } from '../../auth';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await doSignInWithEmailAndPassword(email, password);
            navigate('/home');
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '70vh',
            }}
        >
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
                sx={{ marginBottom: 2 }}
            >
                Login
            </Button>
            <Typography variant="body2">
                Dacă nu aveți cont, <Link to="/register">Register</Link>
            </Typography>
        </Box>
    );
}

export default Login;