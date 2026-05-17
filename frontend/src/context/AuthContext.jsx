import { createContext,useState,useEffect,useContext } from "react";
import {useNavigate} from "react-router-dom";
import API from "../api/axiosInstance";

const AuthContext=createContext(null);

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);
    const navigate=useNavigate();

    useEffect(()=>{
        const savedUser=localStorage.getItem('user');
        const token=localStorage.getItem('token');
        if(savedUser && token){
            setUser(JSON.parse(savedUser));
        }else{
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        setLoading(false);

        const handleAuthExpired = () => {
            setUser(null);
            navigate('/login');
        };

        window.addEventListener('auth:expired', handleAuthExpired);
        return () => window.removeEventListener('auth:expired', handleAuthExpired);
    },[]);

    const loginUser=async(email,password)=>{
        try{
            const response=await API.post('/auth/login',{email,password});
            const {token,user:userData}=response.data;
            localStorage.setItem('token',token);
            localStorage.setItem('user',JSON.stringify(userData));
            setUser(userData);
            return {success:true};
        }catch(error){
            return {
                success:false,
                message:error.response?.data?.message || 'Login failed'};
        }
    };

    const registerUser=async(email,password,role='User')=>{
        try{
            await API.post('/auth/register',{email,password,role});
            return {success:true};
        }catch(error){
            return {
                success:false,
                message:error.response?.data?.message || 'Registration failed'};
        }
    };

    const logoutUser=()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return(
        <AuthContext.Provider value={{
            user,
            loading,
            loginUser,
            registerUser,
            logoutUser
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth=()=>useContext(AuthContext);
