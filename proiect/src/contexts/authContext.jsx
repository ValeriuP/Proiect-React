import { useContext,useEffect,useState,createContext } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth"; 

const AuthContext=createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({children}){
const [currentUser,setCurrentUser]=useState(null);
const [userLoggedIn,setUserLoggedIn]=useState(false);
const [loading,setLoading]=useState(false);


useEffect(()=>{
    const unsubscribe=onAuthStateChanged(auth,initializeUser);
    return unsubscribe;
},[])

async function initializeUser(user){
    setLoading(true);
    if(user)
    {
        setCurrentUser({...user});
        setUserLoggedIn(true);
    }
    else
    {
        setCurrentUser(null);
        setUserLoggedIn(false);
    }
    setLoading(false);
}
const value={currentUser,userLoggedIn,loading};
return <AuthContext.Provider value={value}>
{!loading && children}
</AuthContext.Provider>
}