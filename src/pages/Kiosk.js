
import { useEffect, useState } from 'react';
import Topbar from "../components/main/Topbar";
import Sidebar from "../components/main/Sidebar";
import { KioskList,KioskModalPopupOne,KioskModalPopupTwo,KioskCusomerList,KioskTopbar,KioskOffCanvas} from "../components/kiosk/Main"

import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDetails } from '../store/action/userAction';
 
const Kiosk = (props)=>
{

    const userDetails = useSelector(state=> state.users);
    const [kioskPopupDetails,setKioskPopupDetails] = useState({});
    const [customerID,setCustomerID] = useState([]);
    const [refreshKioskId,setRefreshKioskId] = useState(0);

    const [logout, setLogout] = useState(true);
    const users = useSelector(state=> state.users);
    const dispatch = useDispatch();
    
    function setActiveCustomerID(Customer_ID){
        setCustomerID(Customer_ID);
    }

    function set_KioskPopupDetails(data){
        setKioskPopupDetails(data)
    }

    function refreshDetails(Customer_ID){
        setRefreshKioskId(Customer_ID);
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

    return <>
          <div className="main-wrapper">
            <div id="wrapper">
                <div className="container-fluid">
                    <Topbar logout={logoutMethod}/>

                    <div className="web-content d-flex">
                        <Sidebar/>

                        {/* <!-- Kiosk Management  --> */}
                        <section className="customer-count-container ms-4">
                            <div className="row">

                                <div className="col-12">
                                    <KioskTopbar setKioskPopupDetails={set_KioskPopupDetails}/>
                                </div>

                                
                                <div className="col-lg-5 col-6 pe-0">
                                    {/* <!-- Customer list container -->  */}
                                    <KioskCusomerList setActiveCustomerID={setActiveCustomerID} refreshID={refreshKioskId}/>

                                </div>

                                
                                <div className="col-lg-7 col-6">
                                    <KioskList setKioskPopupDetails={set_KioskPopupDetails} CustomerID={customerID} refreshID={refreshKioskId} UserID={userDetails?.userDetails?.UserID || ''}/>
                                </div>

                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* <!-- Kiosk Management Modal Popup One--> */}
            {/* <KioskModalPopupOne/> */}
            <KioskModalPopupOne UserID={users?.userDetails?.UserID || ''} kioskPopupDetails={kioskPopupDetails} refresh_details={refreshDetails}/>

        </div>
        </>;
}

export default Kiosk;