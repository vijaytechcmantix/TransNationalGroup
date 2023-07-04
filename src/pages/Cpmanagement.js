import React, { useState } from "react";
import Topbar from "../components/main/Topbar";
import Sidebar from "../components/main/Sidebar";
import { PcManagementCustomerList , PcTopBar, CpList , PcModalPopup } from '../components/pcmanagement/Main';

import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDetails } from '../store/action/userAction';
 
const Cpmanagement =()=>
{  
     //[Initialization]
     const [companyID,setCompanyID] = useState('');

     const [logout, setLogout] = useState(true);
     const users = useSelector(state=> state.users);
     const dispatch = useDispatch();
 
     //[Functionality]
     function set_CpManagementDataTable(company_ID){
         setCompanyID(company_ID);
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
 
                             {/* <!-- PC Management  --> */}
                             <section className="customer-count-container ms-4">
                                 <div className="row">
 
                                     
                                     <div className="col-12">
                                         <PcTopBar/>
                                     </div>
 
                                     <div className="col-lg-4 col-6 pe-0">
                                         <PcManagementCustomerList setcpManagementDataTable={set_CpManagementDataTable}/>
                                     </div>
 
                                     <div className="col-lg-8 col-6">
                                         <CpList CompanyID={companyID}/>
                                     </div>
 
                                 </div>
                             </section>
 
                         </div>
                     </div>
                 </div>
 
                 <PcModalPopup />
 
             </div>                  
             </>;
}
 
export default Cpmanagement;