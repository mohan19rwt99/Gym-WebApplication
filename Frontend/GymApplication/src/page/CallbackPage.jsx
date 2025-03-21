import React, { useEffect } from 'react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { useNavigate } from 'react-router-dom';

const CallbackPage = () => {
    const { isAuthenticated, user } = useKindeAuth(); 
    const navigate = useNavigate();

    useEffect(() => {
        console.log("CallbackPage - isAuthenticated:", isAuthenticated);
        console.log("CallbackPage - user:", user);

        if (isAuthenticated) {
            navigate('/welcome');
        } else {
            navigate('/home');
        }
    }, [isAuthenticated, navigate, user]); 

    return <p>Redirecting...</p>;
};

export default CallbackPage;
