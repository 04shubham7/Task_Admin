import {Navigate,Outlet} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

const ProtectedRoute=({allowedRoles})=>{
    const {user}=useAuth();

    if(!user){
        //Not authenticated,send them packing to the login screen
        return <Navigate to="/login" replace />;
    }

    if(allowedRoles && !allowedRoles.includes(user.role)){
        //Non-admin users should never reach admin-only pages.
        const redirectTo = allowedRoles.includes('Admin') ? '/dashboard' : '/login';
        return <Navigate to={redirectTo} replace />;
    }
        //User has the required role, render the component
        return <Outlet />;
    }

    export default ProtectedRoute;