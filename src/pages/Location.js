import React, { useState, useEffect } from "react";
import Topbar from "../components/main/Topbar";
import Sidebar from "../components/main/Sidebar";
import { LocationCustomerList, LocationTopBar, LocationList, LocationOffCanvas, LocationModalPopup } from '../components/location/Main';

import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDetails } from '../store/action/userAction';

export default Location = () =>{

    //[Initialization]
    const [companyID,setCompanyID] = useState('');
    const [locationDetails,setLocationDetails] = useState({});
    const [reset_Loc, setReset_Loc] = useState(true);

    const [logout, setLogout] = useState(true);
    const users = useSelector(state=> state.users);
    const dispatch = useDispatch();

    //[Use Effect Hooks]

    //[Functionality]
    function setLocationDataTable(company_ID){
        setCompanyID(company_ID);
    }

    function locationDetailsPopup(location){
        setLocationDetails(location);
    }

    function reset_Location(){
        setReset_Loc(!reset_Loc);
    }

    function logoutMethod(){
        dispatch(setUserDetails({ loggedin : 'no', userDetails : {} }));
        setLogout(!logout);
    }
    
    if(users.loggedin == "no" || !logout)
    {
        localStorage.clear();
        return<Navigate to="/" replace/>;
    }

    return  <>
            <div className="main-wrapper">

                <div id="wrapper">
                    <div className="container-fluid">
                        <Topbar logout={logoutMethod}/>
                        {/* <!-- Top Content --> */}
                        <div className="web-content d-flex">
                            <Sidebar/>

                            {/* <!-- Location Management  --> */}
                            <section className="customer-count-container ms-4">
                                <div className="row">

                                    
                                    <div className="col-12">
                                        <LocationTopBar locationDetailsPopup={locationDetailsPopup}/>
                                    </div>

                                    <div className="col-lg-4 col-6 pe-0">
                                        <LocationCustomerList setLocationDataTable={setLocationDataTable}/>
                                    </div>

                                    <div className="col-lg-8 col-6">
                                        <LocationList UserID={users?.userDetails?.UserID || ''} CompanyID={companyID} locationDetailsPopup={locationDetailsPopup} resetLoc={reset_Loc}/>
                                    </div>

                                </div>
                            </section>

                        </div>
                    </div>
                </div>

                {/* <LocationOffCanvas location_Details_1={locationDetails}/> */}

                <LocationModalPopup UserID={users?.userDetails?.UserID || ''} location_Details={locationDetails} resetLocation={reset_Location}/>

            </div>                  
            </>;
}