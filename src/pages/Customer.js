
import React, { useState } from 'react';
import Topbar from '../components/main/Topbar';
import Sidebar from '../components/main/Sidebar';
import { CustomerTopbar, CustomerList, Customerdetails,CustomerModalPopup,CustomerOffCanvas } from '../components/customer/Main';
import { CurtainsOutlined } from '@mui/icons-material';

import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDetails } from '../store/action/userAction';

const Customer = () => {

    //[Initialization]
    const [active_Customer,setActiveCustomer] = useState({
        CompanyID : '',
        CompanyName : ''
    });
    const [openCustomerPopupModal,setOpenCustomerPopupModal] = useState({});
    const [add_Company,setAdd_Company] = useState(true);
    const [edit_Company,setEdit_Company] = useState({
        CompanyID : '',
        CompanyName : ''
    });

    const [logout, setLogout] = useState(true);
    const users = useSelector(state=> state.users);
    const dispatch = useDispatch();

    // [Functionality]
    function set_ActiveCustomerDetails(item){
        setActiveCustomer(item);
    }

    function open_CustomerModal(data){
        setOpenCustomerPopupModal(data);
    }

    function reset_CustomerList(){
        setAdd_Company(!add_Company);
    }

    function edit_Customer(CustomerID){
        setEdit_Company(CustomerID);
    }

    function reset_Customer(){
        setEdit_Company({
            CompanyID : '',
            CompanyName : ''
        });
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
                {/* <!-- Top Content --> */}
                <div className="web-content d-flex">
                    <Sidebar/>

                    <section className="customer-count-container ms-4">
                        <div className="row">
                            <div className="col-12">
                                <CustomerTopbar open_CustomerModal={open_CustomerModal}/>
                            </div>
                            <div className="col-6 pe-lg-0">
                                <CustomerList setActiveCustomerDetails={set_ActiveCustomerDetails} addCompany={add_Company} editCustomer={edit_Customer}/>
                            </div>
                            <div className="col-6">
                                <Customerdetails activeCustomer={active_Customer}/>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>

        <CustomerOffCanvas/>

        <CustomerModalPopup UserID={users?.userDetails?.UserID || ''} openCustomerModal={openCustomerPopupModal} resetCustomerList={reset_CustomerList} editCompany={edit_Company} resetCustomer={reset_Customer}/>
    </div>
    </>;
}

export default Customer;


