import { useEffect, useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { doCreateUserWithEmailAndPassword, doSignOut } from '../../auth';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import './Register.css';


function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isReg, setIsReg] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errors, setErrors] = useState({}); // Track individual field errors
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const validateFields = () => {
        let newErrors = {};
        if (!firstName) newErrors.firstName = "First name is required.";
        if (!lastName) newErrors.lastName = "Last name is required.";
        if (!birthdate) newErrors.birthdate = "Birthdate is required.";
        if (!email) newErrors.email = "Email is required.";
        if (!password) newErrors.password = "Password is required.";
        else if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function handleClick() {
        setErrorMessage(""); // Reset error message
        
        if (!validateFields()) {
            setIsReg(false); // Don't proceed if fields are invalid
            return;
        }

        if (!isReg) {
            setIsReg(true); // Disable the button when processing starts

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setErrorMessage("Invalid email format");
                setIsReg(false);
                return;
            }

            try {
                const user = await doCreateUserWithEmailAndPassword(email, password);

                // Store user data in Firestore
                await setDoc(doc(db, "users", user.user.uid), {
                    firstName,
                    lastName,
                    birthdate,
                    email,
                    isAdmin: false,
                    favorite: [],
                });

                // Sign the user out after registration
                await doSignOut();

                // Navigate to the login page
                navigate('/login');
            } catch (error) {
                console.error(error);
                setErrorMessage("Registration failed. Please try again.");
            } finally {
                setIsReg(false); // Re-enable the button
            }
        }
    }

    useEffect(() => {
        if (currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    return (
        
        <div className="registration__container">
  
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '80vh',
                }}
            >
          
                <Typography variant="h4" sx={{ marginBottom: 4, color: '#aaaaa2' }}>
                    Sign Up
                </Typography>

                {/* Display generic error message */}
                {errorMessage && (
                    <Typography variant="body1" sx={{ color: 'red', marginBottom: 2 }}>
                        {errorMessage}
                    </Typography>
                )}

                <TextField
                    required
                    id="firstName"
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    error={!!errors.firstName} // Show error for this field
                    helperText={errors.firstName}
                    sx={{ marginBottom: 2, width: '250px' }}
                />
                <TextField
                    required
                    id="lastName"
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    sx={{ marginBottom: 2, width: '250px' }}
                />
                <TextField
                    required
                    id="birthdate"
                    label="Birthdate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    error={!!errors.birthdate}
                    helperText={errors.birthdate}
                    sx={{ marginBottom: 2, width: '250px' }}
                />
                <TextField
                    required
                    id="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email || "Enter a valid email address."}
                    sx={{ marginBottom: 2, width: '250px' }}
                />
                <TextField
                    required
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password || "Password must be at least 6 characters."}
                    sx={{ marginBottom: 2, width: '250px' }}
                />
                <Button
                    variant="contained"
                    onClick={handleClick}
                    sx={{
                        marginBottom: 2,
                        width: '250px',
                        color: '#aaaaa2',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': {
                            backgroundColor: ' #aaaaa2',
                            color: 'black'
                        }
                    }}
                    disabled={isReg}
                >
                    Register
                </Button>
                <Typography variant="body2" sx={{ color: '#aaaaa2' }}>
                    Already have an account? 
                    <Link to="/login" className="link-style">
                        Log In
                    </Link>
                </Typography>
            </Box>
        </div>
    );
}

export default Register;
