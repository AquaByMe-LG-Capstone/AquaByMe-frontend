import React, { useState } from 'react';
import { InputField } from '@enact/sandstone/Input';
import Button from '@enact/sandstone/Button';
import Alert from '@enact/sandstone/Alert';
import styles from "./Login.module.less";
import useAuth from '../../hooks/useAuth';
import CONFIG from '../../config';
import axios from 'axios';

const Login = ({ onLogin, onLogout }) => {
    const {
        userState,
        setUserState,
        handleLogin,
        handleLogout,
    } = useAuth();

    const [signupState, setSignupState] = useState({
        email: '',
        username: '',
        password: '',
        password2: '',
    });
    const [isSignupVisible, setisSignupVisible] = useState(false);

    const showSignup = () => setisSignupVisible(true);
    const closeSignup = () => setisSignupVisible(false);

    const handleSignup = () => {

        const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/user/signup`;
        const data = { ...signupState };

        axios.post(url, data)
            .then((resp) => {
                console.log('Signup successful:', resp.data);
                closeSignup(); // Close modal on success
            })
            .catch((error) => {
                console.error('Signup error:', error.message);
            });
    };

    return (
        <div className={styles.loginPage}>
            <h2>Login</h2>
            <InputField
                type="text"
                placeholder="Username"
                value={userState.username}
                onChange={(e) => setUserState((prev) => ({ ...prev, username: e.value }))}
            />
            <InputField
                type="password"
                placeholder="Password"
                value={userState.password}
                onChange={(e) => setUserState((prev) => ({ ...prev, password: e.value }))}
            />
            <Button onClick={() => handleLogin(onLogin)}>Log In</Button>
            <Button
                backgroundOpacity="transparent"
                size="small"
                onClick={showSignup}
            >
                Sign Up
            </Button>

            <Alert
                open={isSignupVisible}
                onClose={closeSignup}
                title="Sign Up"
                type="fullscreen"
            >
                <div>
                    <InputField
                        type="email"
                        placeholder="Email"
                        value={signupState.email}
                        onChange={(e) => setSignupState((prev) => ({ ...prev, email: e.value }))}
                    />
                    <InputField
                        type="text"
                        placeholder="Username"
                        value={signupState.username}
                        onChange={(e) => setSignupState((prev) => ({ ...prev, username: e.value }))}
                    />
                    <InputField
                        type="password"
                        placeholder="Password"
                        value={signupState.password}
                        onChange={(e) => setSignupState((prev) => ({ ...prev, password: e.value }))}
                    />
                    <InputField
                        type="password"
                        placeholder="Confirm Password"
                        value={signupState.password2}
                        onChange={(e) => setSignupState((prev) => ({ ...prev, password2: e.value }))}
                    />
                    <div>
                        <Button
                            className={styles.cancelButton}
                            backgroundOpacity="transparent"
                            icon="closex"
                            onClick={closeSignup}
                        >
                        </Button>
                        <Button onClick={handleSignup}>Submit</Button>
                    </div>
                </div>
            </Alert>
        </div>
    );
};

export default Login;