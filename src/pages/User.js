import { useState, useEffect } from 'react';
import Topbar from '../components/main/Topbar';
import Sidebar from '../components/main/Sidebar';
import { UserTopbar, UserCustomer, UserDetails } from '../components/user/Main';

import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDetails } from '../store/action/userAction';

const User = () => {

    const [customer_ID,setCustomer_ID] = useState('');
    const [dropdownFilterData,setDropdownFilterData] = useState([]);
    const [searchFilter_Data,setSearchFilter_Data] = useState('');

    const [logout, setLogout] = useState(true);
    const users = useSelector(state=> state.users);
    const dispatch = useDispatch();

    function set_UserDataTableCustomerID(customerID){
        setCustomer_ID(customerID);
    }

    function setDropdownFilter(data){
        setDropdownFilterData(data);
    }

    function set_serchFilterData(value){
        setSearchFilter_Data(value);
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
                        <section className="customer-count-container ms-4">
                            <div className="row">
                                {/* <!-- User Management top bar  --> */}
                                <div className="col-12">
                                    <UserTopbar customerID={customer_ID} setDropdownFilterData={setDropdownFilter} setSearchFilterData={set_serchFilterData}/>
                                </div>
                                <div className="col-lg-5 col-4 pe-0">
                                    <UserCustomer setUserDataTableCompanyID={set_UserDataTableCustomerID}/>
                                </div>
                                <div className="col-lg-7 col-8">
                                    <UserDetails customerID={customer_ID} dropdownFilterData={dropdownFilterData} searchFilterData={searchFilter_Data}/>
                                </div>
                            </div>
                        </section>                       
                    </div>
                </div>
            </div>
        </div>
        </>;
  }
  export default User;