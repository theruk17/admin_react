
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL

export const ProtectedRoute = () => {
    //const [user, setUser] = useState('')
    const { token, setToken } = useAuth();

    // Check if the user is authenticated

    if (token) {
        axios
            .post(API_URL + '/auth/refresh', {
                headers: {
                    Authorization: token
                }
            })
            .then(res => {
                setToken(res.data.accessToken)
                //setUser({ ...res.data.userData })
            })
            .catch(() => {
                localStorage.removeItem('userData')
                localStorage.removeItem('refreshToken')
                //localStorage.removeItem('token')
                //setUser(null)
                return <Navigate to="/login" />;
            })
        // If not authenticated, redirect to the login page

    } else {
        return <Navigate to="/login" />;
    }

    // If authenticated, render the child routes
    return <Navbar><Outlet /></Navbar>;
};