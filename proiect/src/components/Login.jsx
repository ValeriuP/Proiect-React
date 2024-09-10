import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { doSignInWithEmailAndPassword } from '../../auth';
import './Login.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State for error messages
    const navigate = useNavigate();

    const handleLogin = async () => {
        // Input validation
        if (!email || !password) {
            setError("Please fill in all fields."); // Error if fields are empty
            return;
        }

        try {
            setError(""); // Clear previous errors
            await doSignInWithEmailAndPassword(email, password);
            navigate('/');
        } catch (error) {
            console.error("Login failed:", error);
            setError("Incorrect email or password."); // Generic error message
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
                <Typography variant="h4" sx={{ marginBottom: 4, color: '#aaaaa2' }}>
                    Sign In
                </Typography>

                {/* Display the error message */}
                {error && (
                    <Typography variant="body1" sx={{ color: 'red', marginBottom: 2 }}>
                        {error}
                    </Typography>
                )}

                <TextField
                    required
                    id="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                        marginBottom: 2,
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent',
                        },
                    }}
                />
                <TextField
                    required
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                        marginBottom: 2,
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent',
                        },
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleLogin}
                    sx={{
                        marginBottom: 2,
                        width: '210px',
                        color: '#aaaaa2',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': {
                            backgroundColor: ' #aaaaa2',
                            color: 'black',
                        },
                    }}
                >
                    Login
                </Button>
                <Typography variant="body2" sx={{ color: '#aaaaa2', marginTop: 3 }}>
                    Don't have an account? 
                    <Link to="/register" className="link-register-style">Register</Link>
                </Typography>
            </Box>
        </div>
    );
}

export default Login;
