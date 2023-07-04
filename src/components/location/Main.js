import {useState, useEffect, memo, useCallback} from "react";
import './style.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpWideShort,faArrowDownWideShort,faChevronRight,faPencil,faTrash,faPlus } from "@fortawesome/free-solid-svg-icons";
import Search from '@mui/icons-material/Search';
import { getLocationInformation, getAllCompany, deleteLocationInformation, addLocationInformation, updateLocationInformation } from '../../services/api/api'
import Modal from 'react-bootstrap/Modal';

// Notification 
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager} from 'react-notifications';
// Alert 
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


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

    // [Use Effect Hooks]
    useEffect(()=>{
        getAllCompany().then((result) => {
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
            <div className="location-customer-list-container p-3 w-100">
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
                            return(<div key={cust.CompanyID} className={activeCustomer == cust.CompanyID ? "active single-customer-list-container d-flex py-2 px-3" : "single-customer-list-container d-flex py-2 px-3"} onClick={()=>{showLocationTable(index,cust.CompanyID)}}>
                                        <div className="single-customer-content">
                                            <div>{cust.CompanyName}</div>
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
    
    //[Initialization]
    var [locationDetails,setLocationDetails] = useState([]);

    //[Use Effect Hooks]
    useEffect(()=>{
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
                            NotificationManager.success('Location deleted successfully..!','Congratulations!',3000);
                        }else if(data.status == 404){
                            NotificationManager.error('Incorrect requst..!','Error!',3000);
                        }else{
                            NotificationManager.error('Something went wrong..!','Error!',3000);
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
        getLocationInformation(CompanyID).then((result)=>{
            if(Object.keys(result).length != 0){
                setLocationDetails(result ?? []);
            }else
            {
                setLocationDetails([]);
            }
        });
    }

    return <>
        {/* <!-- Location container --> */}
        <div className="location-list-container p-3 w-100">
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
                                        <td>{loc.LocationName}</td>
                                        <td>{loc.LocationID}</td>
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
                <div className="single-input-field">
                    <input type="text" autoComplete="off" name="location_name" id="location-address-input" className="form-control"/>
                    <label htmlFor="location-address-input">Location Address</label>
                </div>
                <div className="single-input-field">
                    <textarea type="text" autoComplete="off" name="remarks" id="location-remarks-input" className="form-control"></textarea>
                    <label htmlFor="location-remarks-input">Remarks</label>
                </div>
                <a className="modal-save btn btn-primary m-1">Save</a>
                <a className="offcanvas-close btn m-1" data-bs-dismiss="offcanvas" aria-label="Close">Close</a>
            </div>

        </div>
    </>;
}

const LocationModalPopup = ({location_Details, resetLocation, UserID}) =>{

    const [saveLocationType,setSaveLocationType] = useState('new');
    const [companyList,setCompanyList] = useState([]);

    const [locationDetails,setLocationDetails] = useState({
        LocationName : '',
        LocationID : '',
        CompanyID : ''
    });
    const [modalShow,setModalShow] = useState(false);

    useEffect(()=>{
        getCustomerDetails();
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
            NotificationManager.warning('Please select the company ID!','Warning!',3000);
        }
        if(locationDetails.LocationID == '')
        {
            NotificationManager.warning('Please enter the location ID!','Warning!',3000);
        }
        if(locationDetails.LocationName == '')
        {
            NotificationManager.warning('Please enter the location name!','Warning!',3000);
        }else{
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
                        NotificationManager.success('Location added successfully..!','Congratulations!',3000);
                    }
                    else if(data.status == 404)
                    {
                        NotificationManager.error('Location already exist..!','Error!',3000);
                    }else{
                        NotificationManager.error('Something went wrong..!','Error!',3000);
                    }
                });
            }else{
                updateLocationInformation({
                    CompanyID : locationDetails.CompanyID,
                    NewLocationID : locationDetails.LocationID,
                    OldLocationID : location_Details.LocationID,
                    NewLocationName : locationDetails.LocationName,
                    UserID
                }).then((data)=>{
                    if(data.status == 200)
                    {
                        handleClose();
                        resetLocation();
                        NotificationManager.success('Location updated successfully..!','Congratulations!',3000);
                    }
                    else if(data.status == 404)
                    {
                        NotificationManager.error('No data found..!','Error!',3000);
                    }else{
                        NotificationManager.error('Something went wrong..!','Error!',3000);
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
                    >
                        <option value="" selected disabled>Choose Customer</option>
                        {   
                            // companyList.map((comp)=>{
                            //     return(<option key={locationDetails.CompanyID} selected={locationDetails.CompanyID == comp.CompanyID ? true : false} value={comp.CompanyID}>{comp.CompanyName}</option>)
                            // })
                        }
                        <RenderCustomerList list={companyList}/>
                    </select>
                    <label htmlFor="company-name-input">Customer Name</label>
                </div>
                <div className="single-input-field">
                    <input 
                        type="text" 
                        autoComplete="off" 
                        name="location_name" 
                        id="location-name-input" 
                        className="form-control" 
                        defaultValue={locationDetails.LocationName} 
                        onKeyUp={(e)=>{setLocationDetails(locationDetails => ({...locationDetails,LocationName:e.target.value}))}}    
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
                        defaultValue={locationDetails.LocationID} 
                        onKeyUp={(e)=>{setLocationDetails(locationDetails => ({...locationDetails,LocationID:e.target.value}))}}/>
                    <label htmlFor="location-id-input">Location ID</label>
                </div>
                <div className="single-input-field">
                    <input type="text" autoComplete="off" name="location_name" id="location-address-input" className="form-control"/>
                    <label htmlFor="location-address-input">Location Address</label>
                </div>
                <div className="single-input-field">
                    <textarea type="text" autoComplete="off" name="remarks" id="location-remarks-input" className="form-control"></textarea>
                    <label htmlFor="location-remarks-input">Remarks</label>
                </div>
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