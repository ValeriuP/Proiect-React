import { useEffect,useState } from 'react';
import { Button,TextField,Typography,Box } from '@mui/material';
import { useNavigate,Link } from 'react-router-dom'; 
import { useAuth } from '../contexts/authContext';
import { doCreateUserWithEmailAndPassword } from '../../auth'; 
import { setDoc,doc,collection } from 'firebase/firestore'; 
import { db } from '../../firebase';


function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isReg, setIsReg] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    async function handleClick() {
        setErrorMessage(""); // Reset error message
        if (!isReg) {
            setIsReg(true);

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setErrorMessage("Invalid email format");
                setIsReg(false);
                return;
            }

            await doCreateUserWithEmailAndPassword(email, password)
                .then(async (user) => {
                    await setDoc(
                        doc(db, "users", user.user.uid),
                        { firstName, lastName, birthdate, email, password }
                    );
                    setIsReg(false);
                    setFirstName("");
                    setLastName("");
                    setBirthdate("");
                    setEmail("");
                    setPassword("");
                    navigate('/');
                })
                .catch((error) => {
                    console.error(error);
                    setErrorMessage(error.message);
                    setIsReg(false);
                });
        }
    }

    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '80vh',
            }}
        >
            <TextField
                required
                id="firstName"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                sx={{ marginBottom: 2, width: '250px' }}
            />
            <TextField
                required
                id="lastName"
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
                sx={{ marginBottom: 2, width: '250px' }}
            />
            <TextField
                required
                id="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ marginBottom: 2, width: '250px' }}
                error={Boolean(errorMessage)}
                helperText={errorMessage}
            />
            <TextField
                required
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: 2, width: '250px' }}
            />
            <Button
                variant="contained"
                onClick={handleClick}
                sx={{ marginBottom: 2, width: '250px' }}
                disabled={isReg}
            >
                Register
            </Button>
            <Typography variant="body2">
                Aveți cont? <Link to="/login">Login</Link>
            </Typography>
        </Box>
    );
}

export default Register;