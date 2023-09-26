import React, { useEffect, useState, useRef } from "react";
import "./style.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight, faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
// import "https://www.google.com/recaptcha/api.js";
import logo from "../../assets/img/logo.png";
import captcha from "../../assets/img/captcha.png";
import { Navigate } from 'react-router-dom';

import { setUserDetails } from "../../store/action/userAction";
import { useSelector, useDispatch } from 'react-redux';
import { OneKPlusOutlined } from "@mui/icons-material";
import { userLogin, getAllCompany } from "../../services/api/api";
import jwt_decode from 'jwt-decode';

// Notification 
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager} from 'react-notifications';
// Alert 
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import ReCAPTCHA  from "react-google-recaptcha"

export function LoginIcon(){
    return (
    <>
        <div className="login-logo pb-4">
            <img src={logo} alt="Logo"/>
        </div>
    </>);
}

export function LoginForm(){
    const users = useSelector(state => state.users);
    const dispatch = useDispatch();

    const [userName, setUserName] = useState('');
    const [pass, setPass] = useState('');
    const [passwordType, setPasswordType] = useState('password');
    const [isLogin, setIsLogin] = useState(false);

    const captchaRef = useRef(null);
    
    useEffect(()=>{
        if (users.loggedin === "yes"){
            localStorage.getItem('UserID') == null && setLocalstorageDetails(users.userDetails);
            setIsLogin(!isLogin);
        }
    },[users]);

    const handleOnchange = (e) => {
        const token = captchaRef.current.getValue();
        captchaRef.current.reset();
    }

    const handleKeypress = (e) => {
        if (e.key == 'Enter') {
            verifyLogin();
        }
    };

    function setLocalstorageDetails({ UserID, accessToken, features }){
        localStorage.clear();
        localStorage.setItem("UserID", btoa(UserID));
        localStorage.setItem("accessToken", btoa(accessToken));
        localStorage.setItem("features", btoa(JSON.stringify(features)));
        localStorage.setItem('UserRole', btoa('Admin Staff'));
    }

    function verifyLogin(){

        if(userName == ''){
            NotificationManager.warning('Please enter the user name!','Warning!',3000);
        }else if(pass == ''){
            NotificationManager.warning('Please enter the password!','Warning!',3000);
        }else{

            userLogin({userName,password:pass}).then((data)=>{

                if(data?.accessToken == null && data?.feature == 'Fail'){
                    NotificationManager.warning('Please enter the correct password!','Warning!',3000);
                }else if(data?.accessToken == null){
                    NotificationManager.warning('User not found!','Warning!',3000);
                }else if(data?.accessToken && data?.accessToken != null){
                    setPass('');
                    setUserName('');
    
                    let user = {
                        accessToken : data?.accessToken || '',
                        features :  data?.feature || [],
                        UserID : jwt_decode(data?.accessToken || '')?.id || '',
                        UserRole : 'Admin Staff'
                    }
                    
                    let isLogin = 'yes';
                    dispatch(setUserDetails({ user,isLogin }));
                }else{
                    NotificationManager.warning('something went wrong!','Warning!',3000);
                }

            }).catch((error)=>{
                console.log(error);
            });

        }

    }

    if(users.loggedin == "yes")
    {
        return <Navigate to="/dashboard" replace/>;
    }

    return (
        <>
        <div className="login-title">
            <h4>Sign In</h4>
            <p>to your address</p>
        </div>

            <div className="login-credentials">
                <input 
                    type="text" 
                    className="form-control" 
                    name="setUserName" 
                    id="login-email"
                    placeholder="User Name" 
                    onChange={(event)=>{ setUserName(event.target.value) }}
                    onKeyUp={(event) => {handleKeypress(event)}}
                    value={userName}
                    autoComplete="off" 
                />
                <input 
                    type={passwordType} 
                    className="form-control" 
                    name="setPass" 
                    id="login-password" 
                    placeholder="Password"
                    onChange={(event)=>{ setPass(event.target.value) }}
                    onKeyUp={(event) => {handleKeypress(event)}}
                    value={pass}
                    autoComplete="off"
                />
                <small className="invalid-feedback login-password"></small>
                <div className="view-password-icon">
                {passwordType === "password" ?
                    (<FontAwesomeIcon icon={faEyeSlash} onClick={()=>{setPasswordType("text")}}/>):
                    (<FontAwesomeIcon icon={faEye} onClick={()=>{setPasswordType("password")}}/>)
                }
                </div>
            </div>
            <div className="login-forget-password text-right w-100 pb-3">
                <a className="primary pointer">Forget Password?</a>
            </div>
            <div className="login-captcha-one text-right w-100">
                <ReCAPTCHA  
                    style={{
                        width : "fit-content",
                        marginLeft : 'auto'
                    }}
                    sitekey={"6LcvKhgnAAAAACFofartTDSpkNNZERvgHX2KwrFP"}
                    ref={captchaRef}
                    onChange={handleOnchange}
                />
            </div>

            {/* <div className="login-captcha-two pt-lg-5 pt-2">
                <div className="row">
                    <div className="col-lg-5 col-10"><img src={captcha} alt="captcha"/></div>
                    <div className="col-lg-1 col-2 p-0 m-0 text-center d-flex align-items-center">
                        <FontAwesomeIcon icon={faRotateRight} className="login-captcha-reload"/>
                    </div>
                    <div className="col-lg-6 col-12 mt-lg-0 mt-4 d-flex"><input type="text" className="form-control" name="captcha" id="captcha" placeholder="Enter captcha code"/></div>
                </div>
            </div> */}

            {/* <small className="invalid-feedback captcha"></small> */}
            <button className="btn btn-primary mt-4 py-2 w-100" onClick={()=>{verifyLogin()}}>Verify & Sign in</button>

        <NotificationContainer/>
        </>);
}