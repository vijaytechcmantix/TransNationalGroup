import { useState,useEffect } from "react";
import Sidebar from "../components/main/Sidebar";
import Topbar from "../components/main/Topbar";
import { RoleFeatureTopbar, GroupList, FeatureTypeList, FeaturesList, RoleFeatureModalPopup } from '../components/rolefeature/Main';

import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDetails } from '../store/action/userAction';

export default function RoleFeature(){

    const [groupConfig,setGroupConfig] = useState();
    const [FeatureGroupID,setFeatureGroupID] = useState('');
    const [FeatureType,setFeatureType] = useState('');
    const [resetGroupDetails,setResetGroupDetails] = useState(false);

    const [logout, setLogout] = useState(true);
    const users = useSelector(state=> state.users);
    const dispatch = useDispatch();

    function set_featureGroupID(GroupID){
        setFeatureGroupID(GroupID);
    }

    function feature_filter(FeatureType){
        setFeatureType(FeatureType);
    }

    function set_groupConfig(data){
        setGroupConfig(data);
    }

    function reset_groupDetails(){
        setResetGroupDetails(!resetGroupDetails);
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

                            {/* <!-- Customer Management  --> */}
                            <section className="role-count-container ms-4">
                                <div className="row">
                                    
                                    <div className="col-12">
                                        <RoleFeatureTopbar setGroupConfig={set_groupConfig}/>
                                    </div>

                                    
                                    <div className="col-4 pe-lg-0">
                                        <GroupList UserID={users?.userDetails?.UserID || ''} setGroupConfig={set_groupConfig} setFeatureGroupID={set_featureGroupID} resetGroupDetails={resetGroupDetails}/>
                                    </div>

                                    <div className="col-2 pe-lg-0">
                                        <FeatureTypeList featureFilter={feature_filter}/>
                                    </div>

                                    <div className="col-6">
                                        <FeaturesList UserID={users?.userDetails?.UserID || ''} FeatureGroupID={FeatureGroupID} FeatureType={FeatureType}/>
                                    </div>

                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                <RoleFeatureModalPopup UserID={users?.userDetails?.UserID || ''} setGroupConfig={groupConfig} resetGroupDetails={reset_groupDetails}/>
            </div>
            </>;
}