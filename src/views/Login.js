import React, { useState } from 'react';
// import $L from '@enact/i18n/$L';
import axios from 'axios';
import { InputField } from '@enact/sandstone/Input';
import Button from '@enact/sandstone/Button';
import Alert from '@enact/sandstone/Alert';
import styles from "./Login.module.less";

const Login = ({ onLogin }) => {
    const ip_addr = "192.168.0.48";
    const port = "8000";


    const [userState, setUserState] = useState({
        username: '',
        password: ''
    });

    const handleLogin = () => {
        const url = `http://${ip_addr}:${port}/user/signin`;
        const data = {
            username: userState.username,
            password: userState.password
        }

        // prefix = "Token "
        // token = respnse.body['token']
        // authorization_header = [prefix + token, ...]
        axios.post(url, data)
            .then(function (resp) {
                if (resp.status == 200) {
                    onLogin(); // Notify parent component of successful login
                } else {
                    console.log("failed!");
                }
            });
    };

    const [signupState, setSignupState] = useState({
        email: '',
        username: '',
        password: '',
        password2: ''
    });
    const [isSignupVisible, setisSignupVisible] = useState(false);

    // Function to show the signup
    const showSignup = () => {
        setisSignupVisible(true);
    };

    // Function to hide the signup
    const closeSignup = () => {
        setisSignupVisible(false);
    };


    const handleSignup = () => {
        const url = `http://${ip_addr}:${port}/user/signup`;
        const data = {
            email: signupState.email,
            username: signupState.username,
            password: signupState.password,
            password2: signupState.password2
        };

        const resp = axios.post(url, data);
        console.log('Response:', resp.data);
    }

    return (
        <>
            <div className={styles.loginPage}>
                <h2>Login</h2>
                <InputField
                    type="text"
                    placeholder="Username"
                    value={userState.username}
                    onChange={e => setUserState(prev => ({ ...prev, username: e.value }))}
                />
                <InputField
                    type="password"
                    placeholder="Password"
                    value={userState.password}
                    onChange={e => setUserState(prev => ({ ...prev, password: e.value }))}
                />
                <Button onClick={handleLogin}>Log In</Button>
                <Button
                    backgroundOpacity="transparent"
                    size="small"
                    onClick={showSignup}>
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
                            onChange={e => setSignupState(prev => ({ ...prev, email: e.value }))}
                        />
                        <InputField
                            type="text"
                            placeholder="Username"
                            value={signupState.username}
                            onChange={e => setSignupState(prev => ({ ...prev, username: e.value }))}
                        />
                        <InputField
                            type="password"
                            placeholder="Password"
                            value={signupState.password}
                            onChange={e => setSignupState(prev => ({ ...prev, password: e.value }))}
                        />
                        <InputField
                            type="password"
                            placeholder="Confirm Password"
                            value={signupState.password2}
                            onChange={e => setSignupState(prev => ({ ...prev, password2: e.value }))}
                        />

                        <div>
                            <Button
                                className={styles.cancelButton}
                                backgroundOpacity='transparent'
                                icon="closex"
                                onClick={closeSignup}>
                            </Button>
                            <Button
                                onClick={handleSignup}>
                                Submit
                            </Button>
                        </div>
                    </div>
                </Alert>
            </div>
        </>
    );
};

export default Login;