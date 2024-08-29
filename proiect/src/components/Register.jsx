import { useEffect,useState } from 'react';
import { Button,TextField,Typography,Box } from '@mui/material';
import { useNavigate,Link } from 'react-router-dom'; 
import { useAuth } from '../contexts/authContext';
import { doCreateUserWithEmailAndPassword } from '../../auth'; 
import { setDoc,doc,collection } from 'firebase/firestore'; 
import { db,} from '../../firebase';
import './Register.css'


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
                    setIsReg(false);
                    console.log(user.user.uid)
                    setFirstName("");
                    setLastName("");
                    setBirthdate("");
                    setEmail("");
                    setPassword("");
                    console.log(firstName);
                    await setDoc(
                        doc(db, "users", user.user.uid),
                        { firstName:firstName, lastName:lastName, birthdate:birthdate, email:email, password:password, isAdmin:false, favorite:[], }
                    );
                //   aici
                    
                })
                .catch((error) => {
                    console.error(error);
                    setErrorMessage(error.message);
                    setIsReg(false);
                });
        }
    }

    useEffect(() => {
        console.log(currentUser)
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
              {/* Title for the registration form */}
              <Typography variant="h4" sx={{ marginBottom: 4, color:'#3E482A'}} >
               Sign Up
            </Typography>

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
                InputLabelProps={{ shrink: true, 
                    sx:{
                        top:'15px'
                    }
                }}
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                sx={{ marginBottom: 2, width: '250px'
                 
                 }}
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
                sx={{ marginBottom: 2, width: '250px' , backgroundColor: '#3E482A', color:'#aaaaa2', '&:hover':{
                    backgroundColor:'#3E482A', color:'#79804D'
                }
                  }}
                disabled={isReg}
              
            >
                Register
            </Button>
            <Typography variant="body2"  sx={{ color:'#3E482A'}}>
                Already have an account? <Link to="/login" className="link-style">
                Log In</Link>
            </Typography>
        </Box>
        </div>
    );
}

export default Register;