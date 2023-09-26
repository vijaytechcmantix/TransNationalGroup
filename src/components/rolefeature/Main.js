import { useState, useEffect, useRef } from "react";
import './style.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpWideShort,faChevronRight,faPencil,faTrash,faPlus } from "@fortawesome/free-solid-svg-icons";
import RadioButtonChecked from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUnchecked from '@mui/icons-material/RadioButtonUnchecked';
import Modal from 'react-bootstrap/Modal';

import { getAllGroup, getFeatureType, getAllFeatures, getGroupFeature, addGroup, updateGroup, deleteGroup, getAllAccessRights, updateFeatureAccessRightsUpdate } from '../../services/api/api';

// Notification 
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager} from 'react-notifications';
// Alert 
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export function RoleFeatureTopbar ({setGroupConfig}) {
    return <>
            {/* <!-- Customer Management top bar  --> */}
            <div className="role-top-bar px-3 py-2 d-flex justify-content-between align-items-center mb-3">
                <div className="role-title"><span className="Page-heading">Role & Feature</span></div>
                <div className="role-count d-flex">
                    <a className="add-new-role d-flex align-items-center" onClick={()=>{setGroupConfig({type:'new'})}}>
                        <FontAwesomeIcon icon={faPlus} className="icon"/>
                        <span>Create New Role</span>
                    </a>
                </div>
            </div>
    </>;
}

export function GroupList({setGroupConfig, setFeatureGroupID, resetGroupDetails, UserID}){

    const [group,setGroup] = useState([]);
    const [activeGroup,setActiveGroup] = useState('');

    useEffect(()=>{
        // Dismiss all previous toasts
        NotificationManager.removeAll();
    },[]);

    useEffect(()=>{
        getAllGroupDetails();
    },[resetGroupDetails]);

    useEffect(()=>{
        setFeatureGroupID(activeGroup);
    },[activeGroup]);

    useEffect(()=>{
        setActiveGroup(group[0]?.GroupID || '');
    },[group]);

    const showToast = (type, message) => {

        let listNotify = NotificationManager.listNotify;

        if(listNotify.length == 0){
            if(type == 'success'){

                NotificationManager.success(message, 'Congratulations!', 3000);
    
            }else if(type == 'warning'){
    
                NotificationManager.warning(message, 'Warning!', 3000);
    
            }else if(type == 'error'){
    
                NotificationManager.error(message, 'Error!', 3000);
                
            }
        }

    };

    function changeActiveGroup(GroupID){
        setActiveGroup(GroupID);
    }

    function editRole(item){
        setGroupConfig(item);
    }

    function deleteRole(GroupID){
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to delete this.',
            buttons: [
                {
                  label: 'Yes',
                  onClick: () => {
                    deleteGroup({
                        GroupID : GroupID,
                        UserID
                    }).then((data) =>{
                        if(data.status == 200)
                        {
                            getAllGroupDetails();
                            showToast('success', 'Group deleted successfully..!');
                        }else if(data.status == 404){
                            showToast('error', 'Incorrect requst..!');
                        }else{
                            showToast('error', 'Something went wrong..!');
                        }
                    })
                  }
                },
                {
                  label: 'No',
                  onClick: () => {
                    
                  }
                }
              ]
        });
    }

    function getAllGroupDetails(){
        getAllGroup().then((result) => {
            setGroup(result);
        }).catch((error) => {
            console.log(error);
        });
    }
    
    return <>
        {/* <!-- Role container --> */}
        <div className="role-list-container p-3 w-100">
            <div className="role-heading d-flex align-items-center pb-2">
                <span>Role</span>
            </div>
            <div className="role-role-list">

                {
                    group.map((item)=>{
                        
                        return(<div key={item.GroupID} onClick={()=>{changeActiveGroup(item.GroupID)}} className={ activeGroup == item.GroupID ? "single-role-list-container active d-flex py-2 px-3" : "single-role-list-container d-flex py-2 px-3" }>
                            <div className="single-role-content">
                                <div>{item.GroupName}</div>
                            </div>
                            <div className="single-role-arrow d-flex justify-content-center align-items-center">
                                <FontAwesomeIcon onClick={()=>{editRole(item)}} icon={faPencil} className="icon me-3"/>
                                <FontAwesomeIcon onClick={()=>{deleteRole(item.GroupID)}} icon={faTrash} className="icon"/>
                                <FontAwesomeIcon icon={faChevronRight} className="icon"/>
                            </div>
                        </div>)

                    })
                }

            </div>
        </div>
    </>;
}

export function FeatureTypeList({featureFilter}){

    const [featureType,setFeatureType] = useState([]);
    const [activeFeatureType,setActiveFeatureType] = useState('');

    useEffect(()=>{
        getFeatureType().then((result) => {
            setFeatureType(result);
        }).catch((error) => {
            console.log(error);
        });;
    },[]);

    useEffect(()=>{
        setActiveFeatureType(featureType[0]?.FeatureType || '')
    },[featureType])

    useEffect(()=>{
        featureFilter(activeFeatureType);
    },[activeFeatureType])
    
    return <>
        {/* <!-- Role container --> */}
        <div className="role-list-container p-3 w-100">
            <div className="role-heading d-flex align-items-center pb-2">
                <span>Feature Type</span>
            </div>
            <div className="role-role-list">

                {
                    featureType.map((item)=>{
                        
                        return(<div key={item.FeatureType} onClick={()=>{setActiveFeatureType(item.FeatureType)}} className={ activeFeatureType == item.FeatureType ? "single-role-list-container active d-flex py-2 px-3" : "single-role-list-container d-flex py-2 px-3" }>
                            <div className="single-role-content">
                                <div>{item.FeatureType}</div>
                            </div>
                            <div className="single-role-arrow d-flex justify-content-center align-items-center">
                                <FontAwesomeIcon icon={faChevronRight} className="icon"/>
                            </div>
                        </div>)

                    })
                }

            </div>
        </div>
    </>;
}

export function FeaturesList ({FeatureGroupID, FeatureType, UserID}){

    const [featureDetails,setFeatureDetails] = useState([]);
    const [tempFeatureDetails,setTempFeatureDetails] = useState([]);
    const [accessRights,setAccessRights] = useState([]);
    const [resetfeatureDetails,setResetfeatureDetails] = useState(true);
    const roleFeatureFormData = useRef();

    useEffect(()=>{
        getAllAccessRights().then((resultOne)=>{
            setAccessRights(resultOne);
        }).catch((error)=>{
            console.log(error);
        });

        getAllFeatures().then((result)=>{
            setFeatureDetails(result);
        }).catch((error)=>{
            console.log(error);
        })

        // Dismiss all previous toasts
        NotificationManager.removeAll();
    
    },[]);

    useEffect(()=>{
        if(FeatureGroupID != '' && FeatureType != '')
        {
            getGroupFeature(FeatureGroupID).then((result)=>{
                let groupFeatureDetails = result.map(arrayOne => {
                    let arrayTwo = featureDetails.find(arrayTwo => arrayTwo.FeatureID === arrayOne.FeatureID);
                    return Object.assign({}, arrayOne, arrayTwo);
                });
                let featureTypeFilter = groupFeatureDetails.filter(item =>{
                    return(item.FeatureType == FeatureType)
                });
                setTempFeatureDetails(featureTypeFilter);
            }).catch((error)=>{
                console.log(error);
            })
            
        }
    },[FeatureType,FeatureGroupID,resetfeatureDetails]);

    const showToast = (type, message) => {

        let listNotify = NotificationManager.listNotify;

        if(listNotify.length == 0){
            if(type == 'success'){

                NotificationManager.success(message, 'Congratulations!', 3000);
    
            }else if(type == 'warning'){
    
                NotificationManager.warning(message, 'Warning!', 3000);
    
            }else if(type == 'error'){
    
                NotificationManager.error(message, 'Error!', 3000);
                
            }
        }

    };

    function selectThisMenu(AccessRightID,FeatureID){

        updateFeatureAccessRightsUpdate({
            AccessRightID,
            FeatureID,
            GroupID:FeatureGroupID,
            UserID
        }).then((data)=>{

            // Dismiss all previous toasts
            NotificationManager.removeAll();

            if(data.status == 200)
            {
                setResetfeatureDetails(!resetfeatureDetails);
                showToast('success', 'Feature access updated successfully..!');
            }
            else if(data.status == 404)
            {
                showToast('error', 'Feature access not found..!');
            }else{
                showToast('error', 'Something went wrong..!');
            }
        }).catch((error)=>{
            console.log(error);
        })
    }

    return <>
        {/* <!-- Permissions container --> */}
        <div className="permissions-list-container p-3 w-100">

            <div className="role-heading d-flex align-items-center pb-2">
                <span>Feature</span>
            </div>

            <form ref={roleFeatureFormData}>
                <div className="permissions-details">
                    {
                        tempFeatureDetails.length != 0 
                        ?
                        tempFeatureDetails.map((item)=>{
                            return( <div key={item.FeatureID} className="single-permission-item">

                                        <div className="permission-item-name">
                                            {item.Feature}:
                                        </div>

                                        <div className="permission-type">

                                            {
                                                accessRights.map((itemTwo)=>{
                                                    return(<div className="selecotr-item">
                                                        <input 
                                                            type="radio" 
                                                            id={item.Feature + itemTwo.AccessRightID} 
                                                            name={item.FeatureID} 
                                                            className="selector-item_radio"
                                                            defaultValue={itemTwo.AccessRightID}
                                                            onChange={(e)=>{
                                                                selectThisMenu(e.target.value,item.FeatureID);
                                                            }}
                                                            checked={item.AccessRightID == itemTwo.AccessRightID ? true : false}
                                                            
                                                        />
                                                        <label htmlFor={item.Feature + itemTwo.AccessRightID} className="selector-item_label d-flex justify-content-center align-items-center">
                                                            {item.AccessRightID == itemTwo.AccessRightID ? <RadioButtonChecked className="icon"/> : <RadioButtonUnchecked className="icon"/>}{itemTwo.AccessRight}
                                                        </label>
                                                    </div>)
                                                })
                                            }

                                        </div>

                                    </div>)
                        })
                        :
                        "No Features Found"
                    }

                    {/* <!-- Single permission item --> */}
                    {/* <div className="single-permission-item">
                        <div className="permission-item-name">
                            Dashboard:
                        </div>
                        <div className="permission-type">
                            <div className="selecotr-item" onClick={()=>{selectThisMenu()}}>
                                <input type="radio" id="dashboard1" name="dashboard" className="selector-item_radio"/>
                                <label htmlFor="dashboard1" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonChecked className="icon"/>Full</label>
                            </div>
                            <div className="selecotr-item">
                                <input type="radio" id="dashboard2" name="dashboard" className="selector-item_radio"/>
                                <label htmlFor="dashboard2" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonUnchecked className="icon"/>None</label>
                            </div>
                            <div className="selecotr-item">
                                <input type="radio" id="dashboard3" name="dashboard" className="selector-item_radio"/>
                                <label htmlFor="dashboard3" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonUnchecked className="icon"/>Partially</label>
                            </div>
                        </div>
                    </div> */}
                    {/* <!-- Single permission item --> */}
                    {/* <div className="single-permission-item">
                        <div className="permission-item-name">
                            Company:
                        </div>
                        <div className="permission-type">
                            <div className="selecotr-item">
                                <input type="radio" id="company1" name="company" className="selector-item_radio"/>
                                <label htmlFor="company1" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonChecked className="icon"/>Full</label>
                            </div>
                            <div className="selecotr-item">
                                <input type="radio" id="company2" name="company" className="selector-item_radio"/>
                                <label htmlFor="company2" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonUnchecked className="icon"/>None</label>
                            </div>
                            <div className="selecotr-item">
                                <input type="radio" id="company3" name="company" className="selector-item_radio"/>
                                <label htmlFor="company3" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonUnchecked className="icon"/>Partially</label>
                            </div>
                        </div>
                    </div> */}
                    {/* <!-- Single permission item --> */}
                    {/* <div className="single-permission-item">
                        <div className="permission-item-name">
                            Location:
                        </div>
                        <div className="permission-type">
                            <div className="selecotr-item">
                                <input type="radio" id="location1" name="location" className="selector-item_radio"/>
                                <label htmlFor="location1" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonChecked className="icon"/>Full</label>
                            </div>
                            <div className="selecotr-item">
                                <input type="radio" id="location2" name="location" className="selector-item_radio"/>
                                <label htmlFor="location2" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonUnchecked className="icon"/>None</label>
                            </div>
                            <div className="selecotr-item">
                                <input type="radio" id="location3" name="location" className="selector-item_radio"/>
                                <label htmlFor="location3" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonUnchecked className="icon"/>Partially</label>
                            </div>
                        </div>
                    </div> */}
                    {/* <!-- Single permission item --> */}
                    {/* <div className="single-permission-item">
                        <div className="permission-item-name">
                            Kiosk:
                        </div>
                        <div className="permission-type">
                            <div className="selecotr-item">
                                <input type="radio" id="kiosk1" name="kiosk" className="selector-item_radio"/>
                                <label htmlFor="kiosk1" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonChecked className="icon"/>Full</label>
                            </div>
                            <div className="selecotr-item">
                                <input type="radio" id="kiosk2" name="kiosk" className="selector-item_radio"/>
                                <label htmlFor="kiosk2" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonUnchecked className="icon"/>None</label>
                            </div>
                            <div className="selecotr-item">
                                <input type="radio" id="kiosk3" name="kiosk" className="selector-item_radio"/>
                                <label htmlFor="kiosk3" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonUnchecked className="icon"/>Partially</label>
                            </div>
                        </div>
                    </div> */}
                    {/* <!-- Single permission item --> */}
                    {/* <div className="single-permission-item">
                        <div className="permission-item-name">
                            User:
                        </div>
                        <div className="permission-type">
                            <div className="selecotr-item">
                                <input type="radio" id="user1" name="user" className="selector-item_radio"/>
                                <label htmlFor="user1" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonChecked className="icon"/>Full</label>
                            </div>
                            <div className="selecotr-item">
                                <input type="radio" id="user2" name="user" className="selector-item_radio"/>
                                <label htmlFor="user2" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonUnchecked className="icon"/>None</label>
                            </div>
                            <div className="selecotr-item">
                                <input type="radio" id="user3" name="user" className="selector-item_radio"/>
                                <label htmlFor="user3" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonUnchecked className="icon"/>Partially</label>
                            </div>
                        </div>
                    </div> */}
                    {/* <!-- Single permission item --> */}
                    {/* <div className="single-permission-item">
                        <div className="permission-item-name">
                            Role & Features:
                        </div>
                        <div className="permission-type">
                            <div className="selecotr-item">
                                <input type="radio" id="role1" name="role" className="selector-item_radio"/>
                                <label htmlFor="role1" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonChecked className="icon"/>Full</label>
                            </div>
                            <div className="selecotr-item">
                                <input type="radio" id="role2" name="role" className="selector-item_radio"/>
                                <label htmlFor="role2" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonUnchecked className="icon"/>None</label>
                            </div>
                            <div className="selecotr-item">
                                <input type="radio" id="role3" name="role" className="selector-item_radio"/>
                                <label htmlFor="role3" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonUnchecked className="icon"/>Partially</label>
                            </div>
                        </div>
                    </div> */}
                    {/* <!-- Single permission item --> */}
                    {/* <div className="single-permission-item">
                        <div className="permission-item-name">
                            Other:
                        </div>
                        <div className="permission-type">
                            <div className="selecotr-item">
                                <input type="radio" id="other1" name="other" className="selector-item_radio"/>
                                <label htmlFor="other1" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonChecked className="icon"/>Full</label>
                            </div>
                            <div className="selecotr-item">
                                <input type="radio" id="other2" name="other" className="selector-item_radio"/>
                                <label htmlFor="other2" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonUnchecked className="icon"/>None</label>
                            </div>
                            <div className="selecotr-item">
                                <input type="radio" id="other3" name="other" className="selector-item_radio"/>
                                <label htmlFor="other3" className="selector-item_label d-flex justify-content-center align-items-center"><RadioButtonUnchecked className="icon"/>Partially</label>
                            </div>
                        </div>
                    </div> */}

                </div>
            </form>

            {/* <div className="form-submit-container">
                <div className="form-submin-buttons">
                    <a className="modal-save btn btn-primary me-2">Save</a>
                    <a className="modal-close btn" data-dismiss="modal" >Close</a>
                </div>
            </div> */}

        </div>
    </>;
}

export function RoleFeatureModalPopup ({setGroupConfig, resetGroupDetails, UserID}){

    const [groupModalShow,setGroupModalShow] = useState(false);
    const [groupDetails,setGroupDetails] = useState({
        GroupID: '',
        GroupName: ''
    });
    const [mode,setMode] = useState('');

    useEffect(()=>{
        
        // Dismiss all previous toasts
        NotificationManager.removeAll();

    },[]);

    useEffect(() => {
        setGroupDetails({
            GroupID: '',
            GroupName: ''
        });
    },[groupModalShow]);

    useEffect(()=>{
        setGroupDetails({
            GroupID: setGroupConfig?.GroupID || '',
            GroupName: setGroupConfig?.GroupName || ''
        });

        setGroupConfig?.type ? setMode("new") : setMode("edit");
        setGroupConfig && setGroupModalShow(true);
    },[setGroupConfig]);

    const showToast = (type, message) => {

        let listNotify = NotificationManager.listNotify;

        if(listNotify.length == 0){
            if(type == 'success'){

                NotificationManager.success(message, 'Congratulations!', 3000);
    
            }else if(type == 'warning'){
    
                NotificationManager.warning(message, 'Warning!', 3000);
    
            }else if(type == 'error'){
    
                NotificationManager.error(message, 'Error!', 3000);
                
            }
        }

    };

    function handleClose(){
        setGroupModalShow(false);
    }

    function saveFeaturesData(){
        // if(groupDetails.GroupID == '')
        // {
        //      showToast('warning','Please enter the group ID!');
        // }else 
        if(groupDetails.GroupName == ''){
            showToast('warning','Please enter the group Name!');
        }else{
            setGroupConfig?.type == 'new' ?
            addGroup({
                GroupID     : groupDetails.GroupID,
                GroupName   : groupDetails.GroupName,
                UserID 
            }).then((data)=>{
                if(data.status == 200)
                {
                    handleClose();
                    resetGroupDetails();
                    showToast('success','Group added successfully..!');
                }
                else if(data.status == 404)
                {
                    showToast('error','No data found..!');
                }else{
                    showToast('error','Something went wrong..!');
                }
            }).catch((error)=>{
                console.log(error);
            })
            :
            groupDetails.GroupID == setGroupConfig?.GroupID && groupDetails.GroupName == setGroupConfig?.GroupName
            ?
                showToast('warning','No changes made!')
            :
            updateGroup({
                GroupID     : groupDetails.GroupID,
                GroupName   : groupDetails.GroupName,
                UserID 
            }).then((data)=>{
                if(data.status == 200)
                {
                    handleClose();
                    resetGroupDetails();
                    showToast('success','Group updated successfully..!')
                }
                else if(data.status == 404)
                {
                    showToast('error','Group not found..!')
                }else{
                    showToast('error','Something went wrong..!')
                }
            }).catch((error)=>{
                console.log(error);
            })
        }
        
    }

    return <>
        
        <Modal 
            show={groupModalShow} 
            onHide={handleClose}
            size={"md"}
            centered
        >
            <div className="modal-header pb-0">
            <h6 className="modal-title" id="RoleFeatureModalLabel"><FontAwesomeIcon icon={ mode == "new" ? faPlus : faPencil }/> { mode == "new" ? "Add" : "Edit" } Create New Group</h6>
            {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
            </div>
            <div className="modal-body pb-0">
                <div className="single-input-field">
                    <input disabled={setGroupConfig?.type == 'new' ? false : true} type="text" autoComplete="off" name="group_id" id="role-id-input" className="form-control" onChange={(e)=>{setGroupDetails(groupDetails => ({...groupDetails,GroupID:e.target.value}))}} defaultValue={groupDetails.GroupID ?? ''}/>
                    <label htmlFor="role-id-input">Group ID { setGroupConfig?.type != 'new' && '[Disabled]' }</label>
                </div>
                <div className="single-input-field">
                    <input type="text" autoComplete="off" name="group_name" id="role-name-input" className="form-control" onChange={(e)=>{setGroupDetails(groupDetails => ({...groupDetails,GroupName:e.target.value}))}} defaultValue={groupDetails.GroupName ?? ''}/>
                    <label htmlFor="role-name-input">Group Name</label>
                </div>
            </div>
            <div className="modal-footer pt-0">
                <a className="modal-save btn btn-primary" onClick={()=>{saveFeaturesData()}}>Save</a>
                <a className="modal-close btn" onClick={()=>{handleClose()}} >Close</a>
            </div>
        </Modal>
        <NotificationContainer/>
    </>;
}