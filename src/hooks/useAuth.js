import { useState } from 'react';
import axios from 'axios';
import CONFIG from '../config';

const useAuth = () => {
    const [userState, setUserState] = useState({ username: '', password: '' });
    const [token, setToken] = useState(null);

    const handleLogin = (onLogin) => {
        const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/user/signin`;
        const data = {
            username: userState.username,
            password: userState.password,
        };

        axios.post(url, data)
            .then((resp) => {
                if (resp.status === 200) {
                    window.localStorage.setItem("authToken", resp.data.token);
                    onLogin(resp.data.token); // Notify parent component
                } else {
                    console.error('Log in failed!');
                }
            })
            .catch((error) => {
                console.error('Error during login:', error.message);
            });
    };

    const handleLogout = (onLogout) => {
        const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/user/signout`;

        axios.post(url, { token }) // Send token for logout if required
            .then((resp) => {
                if (resp.status === 200) {
                    setToken(null); // Clear the token
                    onLogout(); // Notify parent component
                } else {
                    console.error('Unexpected error during logout.');
                }
            })
            .catch((error) => {
                console.error('Error during logout:', error.message);
            });
    };

    return {
        userState,
        setUserState,
        token,
        handleLogin,
        handleLogout,
    };
};

export default useAuth;