
import React, { useEffect, useState } from 'react';
import Topbar from '../components/main/Topbar';
import Sidebar from '../components/main/Sidebar';
import { DashboardTopbar, DashboardCustomer, DashboardKios, DashboardKiosStatus} from '../components/dashboard/Main';

import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDetails } from '../store/action/userAction';

export default function Dashboard(){
    const [company_ID,setCompany_ID] = useState('');
    const [kiosk_ID,setKiosk_ID] = useState('');
    
    const [logout, setLogout] = useState(true);
    const users = useSelector(state=> state.users);
    const dispatch = useDispatch();


    function setKioskDataList(company_ID){
        setCompany_ID(company_ID);
    }

    function setKioskListId(kioskID){
        setKiosk_ID(kioskID);
    }
    
    function logoutMethod(){
        dispatch(setUserDetails({ loggedin : 'no', userDetails : {} }));
        localStorage.clear();
        setLogout(!logout);
    }

    if(users.loggedin == "no" || !logout)
    {
        return<Navigate to="/" replace/>;
    }
    
    return(  <>
                <div className="main-wrapper">
                    <div id="wrapper">
                        <div className="container-fluid">
                            <Topbar logout={logoutMethod}/>
                            {/* <!-- Top Content --> */}
                            <div className="web-content d-flex">
                                <Sidebar/>

                                {/* <!-- Dashboard  --> */}
                                <section className="dashboard-count-container ms-4">
                                    <div className="row">

                                        <div className="col-12">
                                            <DashboardTopbar companyID={company_ID}/>
                                        </div>

                                        
                                        <div className="col-lg-4 col-6 pe-lg-0">
                                            <DashboardCustomer logOutDashboard={logoutMethod} setKioskDataList={setKioskDataList}/>
                                        </div>

                                        
                                        <div className="col-lg-3 col-6 pe-lg-0">
                                            <DashboardKios CompanyID={company_ID} setKioskListId={setKioskListId}/>
                                        </div>

                                        
                                        <div className="col-lg-5 col-12">
                                            <DashboardKiosStatus KioskID={kiosk_ID}/>
                                        </div>

                                    </div>
                                </section>
                            </div>
                            
                            <div className="verson-specification text-end">
                                <span>Version - Smart Kiosk 1.0</span>
                            </div>
                        </div>
                    </div>
                </div>

            </>);
}

 
