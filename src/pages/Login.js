
import React from 'react';

import { LoginIcon, LoginForm } from '../components/login/Main';
 
const Login =()=>
{ 
  return <>
            <div className="Login-mian-wrapper">
                <div className="container">
                    <div className="login-container">
                    <div className="login-wrapper">
                        <LoginIcon/>
                        <LoginForm/>
                    </div>
                    </div>
                </div>
            </div>
        </>;
}
 
export default Login;