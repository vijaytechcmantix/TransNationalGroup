import React, { useState, useEffect } from "react";
import logo from "../../assets/img/logo.png";
// import men from "../../assets/img/men.png";
import men from "../../assets/img/user.png";
import Search from '@mui/icons-material/Search';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Navigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { setUserDetails } from '../../store/action/userAction';


const Topbar = ({ logout }) => {

    // const [render, setRender] = useState(true);
    // const dispatch = useDispatch();
    const { userDetails } = useSelector(state=> state.users);

    return  <>
                {/* <!-- Top Novbar --> */}
                <nav id="top-nav-bar"> 
                    <div className="topnavbar d-flex flex-center">
                        {/* <!-- logo --> */}
                        <div className="nav-logo">
                            <img src={logo} alt=""/>
                        </div>
                        <div className="nav-search-profile flex-center">
                            <div className="nav-search d-flex justify-content-end">  
                                <input className="nav-searchtext-field" type="text" placeholder="Search here..."/>
                                <Search className="nav-searchicon"/>
                            </div>
                            <div className="nav-profile flex-center">
                                <img src={men} alt="profile"/>
                                <div className="dropdown nav-dropdown">
                                    <button type="button" className="dropdown-toggle-custom flex-center"  data-bs-toggle="dropdown" aria-expanded="false" Dropdown button>
                                        { userDetails?.UserID || ''}
                                        <ExpandMore className="nav-expandicon"/>
                                    </button>
                                    <span> { userDetails?.UserRole || ''} </span>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item pointer" onClick={()=>{ logout() }}>Logout</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div> 
                </nav>

            </>; 
}

export default Topbar;