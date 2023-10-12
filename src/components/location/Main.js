import {useState, useEffect, memo, useCallback} from "react";
import './style.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpWideShort,faArrowDownWideShort,faChevronRight,faPencil,faTrash,faPlus } from "@fortawesome/free-solid-svg-icons";
import Search from '@mui/icons-material/Search';
import { getLocationInformation, getAllCompany, deleteLocationInformation, addLocationInformation, updateLocationInformation } from '../../services/api/api'
import Modal from 'react-bootstrap/Modal';

import RadioButtonChecked from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUnchecked from '@mui/icons-material/RadioButtonUnchecked';

// Notification 
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager} from 'react-notifications';
// Alert 
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

/*=====[ # Loader # ]=====*/
import Loader from "../main/Loader";


const LocationTopBar = ({locationDetailsPopup}) => {

    return <>
            {/* <!-- Location Management top bar  --> */}
            <div className="location-top-bar px-3 py-2 d-flex justify-content-between align-items-center mb-3">
                <div className="location-title"><span className="Page-heading">Location Management</span></div>
                <div className="add-new-location-container d-flex">
                    <a className="add-new-location d-flex align-items-center" onClick={()=>{locationDetailsPopup({type:'new'})}}>
                        <FontAwesomeIcon icon={faPlus} className="icon"/>
                        <span>Add New Location</span>
                    </a>
                    {/* <a className="add-new-location d-flex align-items-center ms-2" onClick={()=>{locationDetailsPopup({type:'new'})}}>
                        <FontAwesomeIcon icon={faPlus} className="icon"/>
                        <span>Add New Location</span>
                    </a> */}
                </div>
            </div>
        </>;
}

const LocationCustomerList = ({setLocationDataTable}) => {

    //[Initialization]
    const [customerList,setCustomerList] = useState([]);
    const [tempCustomerList,setTempCustomerList] = useState([]);

    const [locationCustomerOrder,setLocationCustomerOrder] = useState(true);
    const [activeCustomer,setActiveCustomer] = useState('');
    /*=====[ # Loader State # ]=====*/
    const [loaderDisplay,setLoaderDisplay] = useState('hide');

    // [Use Effect Hooks]
    useEffect(()=>{
        setLoaderDisplay('show');
        getAllCompany().then((result) => {
            setLoaderDisplay('hide');
            if(Object.keys(result).length != 0){
                setCustomerList(result ?? []);
                setActiveCustomer(result?.[0]?.CompanyID ?? []);
            }
        }).catch((error) => {
            console.log(error);
        });
    },[]);

    useEffect(()=>{
        setTempCustomerList(customerList);
    },[customerList]);

    useEffect(()=>{
        setLocationDataTable(activeCustomer);
    },[activeCustomer]);

    // [Functionality]
    function locationCustomerChangeOrder(){
        setLocationCustomerOrder(!locationCustomerOrder);
        tempCustomerList.reverse();
    }

    function showLocationTable(index,CompanyID){
        setActiveCustomer(CompanyID);
    }

    function searchCustomerList(e){
        let tempArray = [];
        let i = 0;
        if(e.target.value == '')
        {
            setTempCustomerList(customerList)
        }else{
            customerList.forEach((item,index) => {
                if(item.CompanyName.toLowerCase().includes(e.target.value.toLowerCase()))
                {
                    tempArray[i] = customerList[index];
                    i++;
                }
            });
            setTempCustomerList(tempArray);
        }
    }

    return <>
            {/* <!-- Location Customer container --> */}
            <div className="location-customer-list-container p-3 w-100 position-relative">

                <Loader 
                    display={loaderDisplay}
                />
                <div className="customer-heading d-flex align-items-center pb-2">
                    <span>Customer</span>
                    <FontAwesomeIcon onClick={()=>{locationCustomerChangeOrder()}} icon={locationCustomerOrder ? faArrowUpWideShort : faArrowDownWideShort} className="ms-2 icon"/>
                </div>
                <div className="location-customer-search mb-2">
                    <input id="location-customer-search-input" className="form-control border-0" type="text" placeholder="Search here..." onKeyUp={(e)=>{searchCustomerList(e)}}/>
                    <Search id="location-customer-list-search"/>
                </div>
                <div className="location-customer-list">

                    {
                        tempCustomerList.map((cust,index)=>{
                            return(<div title={cust.CompanyName} key={cust.CompanyID} className={activeCustomer == cust.CompanyID ? "active single-customer-list-container d-flex py-2 px-3" : "single-customer-list-container d-flex py-2 px-3"} onClick={()=>{showLocationTable(index,cust.CompanyID)}}>
                                        <div className="single-customer-content">
                                            <div>{ cust.CompanyName.substring(0,50) }</div>
                                        </div>
                                        <div className="single-location-customer-arrow d-flex justify-content-center align-items-center">
                                            <FontAwesomeIcon icon={faChevronRight}/>
                                        </div>
                                    </div>)
                        })
                    }

                </div>
            </div>
        </>;
}

const LocationList = ({CompanyID, locationDetailsPopup, resetLoc, UserID}) => {

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

    useEffect(()=>{

        // Dismiss all previous toasts
        NotificationManager.removeAll();

    },[]);
    
    //[Initialization]
    var [locationDetails,setLocationDetails] = useState([]);
    
    /*=====[ # Loader State # ]=====*/
    const [locLoaderDisplay,setLocLoaderDisplay] = useState('hide');

    //[Use Effect Hooks]
    useEffect(()=>{
        setLocLoaderDisplay('show');
        getLocation();
    },[CompanyID,resetLoc]);

    //[Functionality]
    function deleteLocation(LocationID){
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to delete this.',
            buttons: [
                {
                  label: 'Yes',
                  onClick: () => {
                    deleteLocationInformation({
                        LocationID : LocationID,
                        UserID
                    }).then((data) =>{
                        if(data.status == 200)
                        {
                            getLocation();
                            showToast('success','Location deleted successfully..!');
                        }else if(data.status == 404){
                            showToast('error','Incorrect requst..!');
                        } else if (data.status == 400) {
                            data.text().then(result => {
                                showToast('error', result);
                            });
                        } else{
                            showToast('error','Something went wrong..!');
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

    function editLocation(location){
        locationDetailsPopup(location);
    }

    function getLocation(){
        if(CompanyID != ''){
            getLocationInformation(CompanyID).then((result)=>{
                setLocLoaderDisplay('hide');
                if(Object.keys(result).length != 0){
                    setLocationDetails(result ?? []);
                }else
                {
                    setLocationDetails([]);
                }
            });
        }
    }

    return <>
        {/* <!-- Location container --> */}
        <div className="location-list-container p-3 w-100 position-relative">
            <Loader 
                display={locLoaderDisplay}
            />
            <div className="location-heading d-flex align-items-center pb-2">
                <span>Locations</span>
            </div>
            <div className="location-details">
                <table className="data-table">
                    <thead>
                        <tr>
                            <td>S/N</td>
                            <td>Location</td>
                            <td>Location ID</td>
                            <td>Actions</td>
                        </tr>
                    </thead>
                    <tbody className="locationDataTableBody">
                        {   
                            locationDetails.length != 0 
                            ?
                            locationDetails.map((loc,index)=>{
                                    return(<tr key={loc.LocationID}>
                                        <td>{index+1}</td>
                                        <td title={loc.LocationName}>{ loc.LocationName.substring(0,20) }</td>
                                        <td title={loc.LocationID}>{ loc.LocationID.substring(0,20) }</td>
                                        <td>
                                            <a><FontAwesomeIcon onClick={()=>{editLocation({'LocationID':loc.LocationID,'LocationName':loc.LocationName,'CompanyID':CompanyID})}} icon={faPencil} className="pe-3 icon"/></a>
                                            <FontAwesomeIcon onClick={()=>{deleteLocation(loc.LocationID)}} icon={faTrash} className="icon fa-trash"/>
                                        </td>
                                    </tr>)
                            })
                            :
                            <tr><td colspan="4" style={{textAlign:'center',padding:'1rem'}}>No Data Found!</td></tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>

    </>;
}

const LocationOffCanvas = () =>{

    return <>
        <div className="offcanvas location-offcanvas offcanvas-end" tabIndex="-1" id="LocationoffcanvasExample" aria-labelledby="LocationoffcanvasExampleLabel">
            {/* <!-- First Set --> */}
            <div className="offcanvas-header pb-0">
                <h6 className="offcanvas-title" id="LocationoffcanvasExampleLabel">Add New Location</h6>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>

            <div className="offcanvas-body pb-0">
                <div className="single-input-field">
                    <select type="text" autoComplete="off" name="company_name" id="company-name-input" className="form-control">
                        <option value="" selected disabled>Choose Customer</option>
                    </select>
                    <label htmlFor="company-name-input">Customer Name</label>
                </div>
                <div className="single-input-field">
                    <input type="text" autoComplete="off" name="location_name" id="location-name-input" className="form-control"/>
                    <label htmlFor="location-name-input">Location Name</label>
                </div>
                <div className="single-input-field">
                    <input type="text" autoComplete="off" name="location_name" id="location-id-input" className="form-control"/>
                    <label htmlFor="location-id-input">Location ID</label>
                </div>
                {/* <div className="single-input-field">
                    <input type="text" autoComplete="off" name="location_name" id="location-address-input" className="form-control"/>
                    <label htmlFor="location-address-input">Location Address</label>
                </div> */}
                {/* <div className="single-input-field">
                    <textarea type="text" autoComplete="off" name="remarks" id="location-remarks-input" className="form-control"></textarea>
                    <label htmlFor="location-remarks-input">Remarks</label>
                </div> */}
                <a className="modal-save btn btn-primary m-1">Save</a>
                <a className="offcanvas-close btn m-1" data-bs-dismiss="offcanvas" aria-label="Close">Close</a>
            </div>

        </div>
    </>;
}

const LocationModalPopup = ({location_Details, resetLocation, UserID}) =>{

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

    const [saveLocationType,setSaveLocationType] = useState('new');
    const [companyList,setCompanyList] = useState([]);

    const [locationDetails,setLocationDetails] = useState({
        LocationName : '',
        LocationID : '',
        CompanyID : ''
    });
    const [modalShow,setModalShow] = useState(false);
    const [kioskStatus,setKioskStatus] = useState("yes");


    useEffect(()=>{
        
        // Dismiss all previous toasts
        NotificationManager.removeAll();

        getCustomerDetails();
        setKioskStatus("yes");
    },[]);

    function getCustomerDetails(){
        getAllCompany().then((result) => {
            if(Object.keys(result).length != 0){
                setCompanyList(result);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(()=>{
        if(location_Details.type == 'new'){
            setSaveLocationType('new');
            setModalShow(true);
            setLocationDetails({
                LocationName : '',
                LocationID : '',
                CompanyID : ''
            });
        }else if(Object.keys(location_Details).length != 0)
        {
            setSaveLocationType('edit');
            setLocationDetails(location_Details);
            setModalShow(true);
        } 
    },[location_Details]);

    function handleClose(){
        setModalShow(false);
    }

    function saveLocationDetails(){
        if(locationDetails.CompanyID == '')
        {
            showToast('warning', 'Please select the company ID!');
        }else if(locationDetails.LocationID == '')
        {
            showToast('warning', 'Please enter the location ID!');
        }else if(locationDetails.LocationID.length > 50)
        {
            showToast('warning', 'The location ID should contain maximum 50 characters!');
        }else if(locationDetails.LocationName == '')
        {
            showToast('warning', 'Please enter the location name!');
        }else if(locationDetails.LocationName.length > 50)
        {
            showToast('warning', 'The location name should contain maximum 50 characters!');
        }
        else{
            if(saveLocationType == 'new')
            {
                addLocationInformation({
                    CompanyID : locationDetails.CompanyID,
                    LocationID : locationDetails.LocationID,
                    LocationName : locationDetails.LocationName,
                    UserID
                }).then((data)=>{
                    
                    if(data.status == 200)
                    {
                        handleClose();
                        resetLocation();
                        showToast('success', 'Location added successfully..!');
                    }
                    else if(data.status == 409)
                    {
                        data.text().then(resultData => {
                            showToast('warning', resultData);
                        });
                    }else{
                        showToast('error', 'Something went wrong..!');
                    }
                });
            }else{
                updateLocationInformation({
                    CompanyID : locationDetails.CompanyID,
                    LocationID : locationDetails.LocationID,
                    NewLocationName : locationDetails.LocationName,
                    kioskStatus,
                    UserID
                }).then((data)=>{
                    if(data.status == 200)
                    {
                        handleClose();
                        resetLocation();
                        showToast('success', 'Location updated successfully..!');
                    }
                    else if(data.status == 404)
                    {
                        showToast('error', 'No data found..!');
                    }else if(data.status == 409)
                    {
                        showToast('error', 'Can not have Duplicate Location Name..!');
                    }else{
                        showToast('error', 'Something went wrong..!');
                    }
                });
            }
        }
    }

    const RenderCustomerList = memo(function RenderCustomerList({list}){
        return list.map((comp,index)=>{
            return(<option key={locationDetails.CompanyID + index} selected={locationDetails.CompanyID == comp.CompanyID ? true : false} value={comp.CompanyID}>{comp.CompanyName}</option>)
        })
    });

    return(
        <>
        <Modal 
            show={modalShow} 
            onHide={handleClose}
            centered
        >
            <div className="modal-header pb-0">
                <h6 className="modal-title" id="locationModalLabel"><FontAwesomeIcon icon={saveLocationType == "new" ? faPlus : faPencil}/> {saveLocationType == "new" ? "Add" : "Edit"} Location</h6>
                <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body pb-0">
                <div className="single-input-field">
                    <select 
                        type="text" 
                        autoComplete="off" 
                        name="company_name" 
                        id="company-name-input" 
                        className="form-control"
                        onChange={(e)=>{setLocationDetails(locationDetails => ({...locationDetails,CompanyID:e.target.value}))}}
                        disabled={saveLocationType == 'edit' ? true : false}
                    >
                        <option value="" selected disabled>Choose Customer</option>
                        {   
                            // companyList.map((comp)=>{
                            //     return(<option key={locationDetails.CompanyID} selected={locationDetails.CompanyID == comp.CompanyID ? true : false} value={comp.CompanyID}>{comp.CompanyName}</option>)
                            // })
                        }
                        <RenderCustomerList list={companyList}/>
                    </select>
                    <label htmlFor="company-name-input">Customer Name { saveLocationType == 'edit' && '[Disabled]' }</label>
                </div>
                <div className="single-input-field">
                    <input 
                        type="text" 
                        autoComplete="off" 
                        name="location_name" 
                        id="location-name-input" 
                        className="form-control" 
                        value={locationDetails.LocationName || ''}
                        onChange={(e)=>{
                            if(e.target.value.length > 50)
                            {
                                showToast('warning', 'The location name should contain maximum 50 characters!');
                            }else if(e.target.value.length <= 50){
                                setLocationDetails(() => ({...locationDetails, LocationName : e.target.value}));
                            }
                        }}
                        placeholder="Maximum 50 characters only"
                    />
                    <label htmlFor="location-name-input">Location Name</label>
                </div>

                <div className="single-input-field">
                    <input 
                        type="text" 
                        autoComplete="off" 
                        name="location_name" 
                        id="location-id-input" 
                        className="form-control" 
                        value={locationDetails.LocationID} 
                        onChange={(e)=>{
                            if(e.target.value.length > 50)
                            {
                                showToast('warning', 'The location ID should contain maximum 50 characters!');
                            }else if(e.target.value.length <= 50){
                                setLocationDetails(locationDetails => ({...locationDetails,LocationID:e.target.value}));
                            }
                        }}
                        disabled={saveLocationType == 'edit' ? true : false}
                        placeholder="Maximum 50 characters only"
                    />
                    <label htmlFor="location-id-input">Location ID { saveLocationType == 'edit' && '[Disabled]' }</label>
                </div>
                <div>Location status</div>
                <div className="single-input-field py-3">
                    <div className="permission-type">
                        <div className="selecotr-item pointer">
                            <input 
                                type="radio" 
                                id='location-status-yes'
                                name='locationStatus' 
                                className="selector-item_radio"
                                defaultValue="yes"
                                onChange={(e)=>{
                                    setKioskStatus(e.target.value);
                                }}
                                checked={kioskStatus == "yes"? true : false }
                            />
                            <label 
                                htmlFor='location-status-yes' 
                                className="selector-item_label d-flex justify-content-center align-items-center"
                                style={{
                                    width : '70%'
                                }}
                            >
                                {kioskStatus == "yes" ? <RadioButtonChecked className="icon"/> : <RadioButtonUnchecked className="icon"/>}
                                Yes
                            </label>
                        </div>
                        <div className="selecotr-item pointer">
                            <input 
                                type="radio" 
                                id='location-status-no'
                                name='locationStatus' 
                                className="selector-item_radio"
                                defaultValue="no"
                                onChange={(e)=>{
                                    setKioskStatus(e.target.value);
                                }}
                                checked={kioskStatus == "no"? true : false }
                            />
                            <label 
                                htmlFor='location-status-no' 
                                className="selector-item_label d-flex justify-content-center align-items-center"
                                style={{
                                    width : '70%'
                                }}
                            >
                                {kioskStatus == "no" ? <RadioButtonChecked className="icon"/> : <RadioButtonUnchecked className="icon"/>}
                                No
                            </label>
                        </div>
                    </div>
                </div>

                {/* <div className="single-input-field">
                    <input type="text" autoComplete="off" name="location_name" id="location-address-input" className="form-control"/>
                    <label htmlFor="location-address-input">Location Address</label>
                </div> */}
                
                {/* <div className="single-input-field">
                    <textarea type="text" autoComplete="off" name="remarks" id="location-remarks-input" className="form-control"></textarea>
                    <label htmlFor="location-remarks-input">Remarks</label>
                </div> */}

            </div>
            <div className="modal-footer pt-0">
                <a className="modal-save btn btn-primary" onClick={()=>{saveLocationDetails()}}>Save</a>
                <a className="modal-close btn" onClick={handleClose}>Close</a>
            </div>
        </Modal>

        <NotificationContainer/>
        </>);
}

export { LocationCustomerList, LocationTopBar, LocationList,LocationOffCanvas,LocationModalPopup }