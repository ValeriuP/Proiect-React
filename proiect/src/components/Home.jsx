import { useEffect, useState } from "react"; // Hook-uri pentru gestionarea ciclului de viață al componentelor și a stării
import { useNavigate, Link, useLocation } from "react-router-dom"; // Navigare și legături pentru rutare
import { useAuth } from "../contexts/authContext"; // Context personalizat pentru autentificare
import { Button, Toolbar } from "@mui/material"; // Componente Material UI
import { db } from "../../firebase"; // Firebase database pentru acces la Firestore
import { collection, getDoc, getDocs, doc } from "firebase/firestore"; // Funcții Firestore pentru acces la documente și colecții
import './Home.css'; // Fișier CSS personalizat pentru stilizare
import Header from "./Header"; // Componenta Header pentru interfața cu utilizatorul


function Home() {
    const navigate = useNavigate(); // Hook pentru navigare programatică între pagini
    const { currentUser, userLoggedIn, loading } = useAuth(); // Destructurare din contextul de autentificare
    const [isAdmin, setIsAdmin] = useState(false); // Stare locală pentru verificarea dacă utilizatorul este admin
    const location = useLocation(); // Hook pentru a obține informații despre ruta curentă
    const [showAllFlats, setShowAllFlats] = useState(true); // Stare pentru a controla vizibilitatea secțiunii "All Flats"
    
    // Hook care se declanșează la schimbarea valorii `loading` sau la montarea componentului
    useEffect(() => {
        // Dacă nu se mai încarcă datele și nu există utilizator curent, navighează la pagina de login
        if (!loading) {
            if (!currentUser) {
                navigate('/login');
            } else {
                checkAdminStatus(); // Verifică dacă utilizatorul este admin
                fetchUsers(); //  utilizatorii din baza de date
            }
        }
    }, [loading]); // Dependința este `loading`

    // Hook pentru a actualiza vizibilitatea secțiunii "All Flats" în funcție de ruta curentă
    useEffect(() => {
        // Dacă ruta curentă este '/', setează `showAllFlats` pe true
        if (location.pathname === '/') {
            setShowAllFlats(true);
        } else {
            setShowAllFlats(false); // Dacă e pe altă pagină, setează pe false
        }
    }, [location]); // Dependința este `location`

    // Funcție asincronă pentru a verifica dacă utilizatorul curent este admin
    const checkAdminStatus = async () => {
        if (currentUser) {
            const userDoc = doc(db, "users", currentUser.uid); // Referință către documentul utilizatorului în Firestore
            const userSnapshot = await getDoc(userDoc); // Fetch documentul utilizatorului
            const userData = userSnapshot.data(); // Obține datele din document
            if (userData) {
                setIsAdmin(userData.isAdmin); // Setează starea `isAdmin` dacă utilizatorul este admin
            }
        }
    };

    // Funcție asincronă pentru a obține toți utilizatorii din colecția "users"
    const fetchUsers = async () => {
        const usersCollection = collection(db, "users"); // Referință către colecția "users" din Firestore
        const usersSnapshot = await getDocs(usersCollection); // Fetch toate documentele din colecție
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Mapare pentru a obține o listă cu utilizatorii
        // Aici poți salva `usersList` dacă vei folosi datele
    };

    return (
        <>
            <Header /> 
          
            <div className="home__container"> 
                <h2 className="welcome__message">
                    Welcome to Flat Finder – Your Journey to the Perfect Home Starts Here!
                    Whether you're looking for a cozy apartment or a spacious home, we're here to make the search simple and enjoyable.
                </h2>
            </div>

            <div className="motivational__message"> {/* Mesaj */}
                <h2>No More Stressful Searches – Discover Your Ideal Living Space with Flat Finder!</h2>
            </div>

            <div>
                <Toolbar> {/* Toolbar pentru butoanele de navigare */}
                    <div className="start__message">Start Now</div> {/* Mesaj de start */}

                    {/* Buton care duce către pagina cu toate apartamentele */}
                    <Button
                        color="inherit"
                        component={Link}
                        to="/all-flats"
                        sx={{ 
                            fontSize: 'larger', 
                            paddingTop: 10, 
                            color: '#dcdcdc', 
                            '&:hover': {
                                color: '#dcdcdc', 
                                textDecorationLine: 'underline' 
                            }
                        }}
                    >
                        All Flats
                    </Button>

                    {/* Buton care duce către apartamentele utilizatorului */}
                    <Button
                        color="inherit"
                        component={Link}
                        to="/my-flats"
                        sx={{
                            fontSize: 'larger', 
                            paddingTop: 10, 
                            color: ' #dcdcdc', 
                            '&:hover': {
                                textDecorationLine: 'underline', 
                                color: '#dcdcdc'
                            }
                        }}
                    >
                        My Flats
                    </Button>

                    {/* Buton care duce către apartamentele favorite */}
                    <Button
                        color="inherit"
                        component={Link}
                        to="/favorite-flats"
                        sx={{
                            fontSize: 'larger', 
                            paddingTop: 10, 
                            color: '#dcdcdc', 
                            '&:hover': {
                                textDecorationLine: 'underline', 
                                color: '#dcdcdc'
                            }
                        }}
                    >
                        Favorite Flats
                    </Button>

                    {/* Buton care duce către pagina pentru adăugarea unui apartament, vizibil doar pentru admini  */}
                    <Button
                        color="inherit"
                        component={Link}
                        to="/add-flat"
                        sx={{
                            fontSize: 'larger', 
                            paddingTop: 10, 
                            color: ' #dcdcdc', 
                            '&:hover': {
                                textDecorationLine: 'underline', 
                                color: '#dcdcdc'
                            }
                        }}
                    >
                        Add Flat
                    </Button>
                </Toolbar>
            </div>
        </>
    );
}

export default Home; // Exportă componenta pentru a putea fi utilizată în alte părți ale aplicației




