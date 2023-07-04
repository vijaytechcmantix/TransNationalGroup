import { useState, useEffect } from "react";
import './style.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpWideShort,faArrowDownWideShort,faChevronRight,faPencil,faTrash,faPlus } from "@fortawesome/free-solid-svg-icons";
import Search from '@mui/icons-material/Search';
import { getAllCompany, getLocationInformation,  getKioskConfigurationGet, getCPCodeGet, getKioskList, addUpdateKioskInformation, deleteKiosk, getKiosk } from "../../services/api/api";
import Modal from 'react-bootstrap/Modal';
import { ConnectingAirportsOutlined } from "@mui/icons-material";
// Notification 
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager} from 'react-notifications';
// Alert 
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const KioskTopbar = ({ setKioskPopupDetails }) =>{
    return <>
    {/* <!-- Kiosk Management top bar  --> */}
    <div className="customer-top-bar px-3 py-2 d-flex justify-content-between align-items-center mb-3">
        <div className="customer-title"><span className="Page-heading">Kiosk Management</span></div>
        <div className="customer-count d-flex">
            <a className="add-new-customer d-flex align-items-center" onClick={()=>{setKioskPopupDetails({ type:'new' })}}>
                <FontAwesomeIcon icon={faPlus} className="icon"/>
                <span>Add Kiosk</span>
            </a>
            {/* <a className="add-new-customer d-flex align-items-center ms-2" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">
                <FontAwesomeIcon icon={faPlus} className="icon"/>
                <span>Type Two</span>
            </a> */}
            {/* <a className="add-new-customer d-flex align-items-center ms-2" data-bs-toggle="modal" data-bs-target="#exampleModalTwo">
                <FontAwesomeIcon icon={faPlus} className="icon"/>
                <span>Type Two</span>
            </a> */}
        </div>
    </div>
    </>;
}

const KioskCusomerList = ({setActiveCustomerID}) =>{

    //[Initialization]
    const [customerList,setCustomerList] = useState([]);
    const [tempCustomerList,setTempCustomerList] = useState([]);
    const [activeCustomer,setActiveCustomer] = useState('');
    const [kioskCustomerOrder,setKioskCustomerOrder] = useState(true);

    // [Use Effect Hooks]
    useEffect(()=>{
        getCustomerDetails();
    },[]);

    useEffect(()=>{
        setActiveCustomerID(activeCustomer);
    },[activeCustomer]);

    useEffect(()=>{
        setActiveCustomer(customerList?.[0]?.CompanyID || []);
        setTempCustomerList(customerList);
    },[customerList]);

    //[Functionality]
    function kioskCustomerChangeOrder(){
        setKioskCustomerOrder(!kioskCustomerOrder);
        tempCustomerList.reverse();
    }

    function setKioskDataTable(index,CompanyID){
        setActiveCustomer(CompanyID);
    }

    function getCustomerDetails(){
        getAllCompany().then((result) => {
            if(Object.keys(result).length != 0){
                setCustomerList(result);
                setActiveCustomer(result[0].CompanyID);
            }
        }).catch((error) => {
            console.log(error);
        });
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
        {/* <!-- Customer list container -->  */}
        <div className="kiosk-customer-list-container p-3 w-100">
            <div className="customer-heading d-flex align-items-center pb-2">
                <span>Customer</span>
                <FontAwesomeIcon onClick={()=>{kioskCustomerChangeOrder()}} icon={kioskCustomerOrder ? faArrowUpWideShort : faArrowDownWideShort } className="ms-2 icon"/>
            </div>
            <div className="kiosk-customer-search mb-2">
                <input id="kiosk-customer-search-input" className="form-control border-0" type="text" placeholder="Search here..." onKeyUp={(e)=>{searchCustomerList(e)}}/>
                <Search id="kiosk-customer-list-search" className="icon"/>
            </div>
            <div className="kiosk-customer-list">

                {
                    tempCustomerList.map((item,index)=>{
                        return(
                            <div key={item.CompanyID} onClick={()=>{setKioskDataTable(index,item.CompanyID)}} className={activeCustomer == item.CompanyID ? "single-customer-list-container active d-flex py-2 px-3" : "single-customer-list-container d-flex py-2 px-3"}>
                                <div className="single-customer-content">
                                    <div>{item.CompanyName}</div>
                                </div>
                                <div className="single-kiosk-customer-arrow d-flex justify-content-center align-items-center">
                                    <FontAwesomeIcon icon={faChevronRight} className="icon"/>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    </>;
}

const KioskList = ({ setKioskPopupDetails, CustomerID, UserID}) =>{
    
    //[Initialization]
    const [kioskDataTable,setKioskDataTable] = useState([]);
    const [tempKioskDataTable,setTempKioskDataTable] = useState([]);
    const [kioskDataTableOrder,setKioskDataTableOrder] = useState(true);

    // [Use Effect Hooks]
    useEffect(()=>{
        getKioskDetails(CustomerID);
    },[CustomerID]);

    useEffect(()=>{
        setTempKioskDataTable(kioskDataTable);
    },[kioskDataTable]);

    //[Functionality]
    function changeKioskDataTableOrder(){
        setKioskDataTableOrder(!kioskDataTableOrder);
        tempKioskDataTable.reverse();
    }

    function kioskSearchFilter(e){
        if (e.target.value === '') {
            setTempKioskDataTable(kioskDataTable);
        } else {
            const filteredList = kioskDataTable.filter(item => {
                if( item.KioskID.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.LocationID.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.Status.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    String(item.BoxQty).includes(e.target.value.toLowerCase()))
                {
                    return 1
                }
            });
            setTempKioskDataTable(filteredList);
        }
    }

    function editKioskDataTable(KioskID){
        setKioskPopupDetails({KioskID,CustomerID});
    }

    function deleteKioskDataTable(KioskID){
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to delete this.',
            buttons: [
                {
                  label: 'Yes',
                  onClick: () => {
                    deleteKiosk({ KioskID, UserID }).then((result)=>{
                        if(result.status == 200)
                        {
                            getKioskDetails(CustomerID);
                            NotificationManager.success('Kiosk deleted successfully..!','Congratulations!',3000);
                        }
                        else if(result.status == 404)
                        {
                            NotificationManager.error('Kiosk did not exist..!','Error!',3000);
                        }else{
                            NotificationManager.error('Something went wrong..!','Error!',3000);
                        }
                    }).catsh((error)=>{
                        console.log(error);
                    });
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

    function getKioskDetails(CustomerID){
        getKioskList(CustomerID).then((data)=>{
            setKioskDataTable(data);
        }).catch((error) =>{
            console.log(error);
        });
    }

    return<>
        {/* <!-- Kiosk container --> */}
        <div className="kiosk-list-container p-3 w-100">
            <div className="kiosk-heading d-flex align-items-center pb-2 justify-content-between">
                <span>Kiosks</span>
                <div className="kiosk-table-container mb-2 d-flex">
                    <div className="kiosk-table-search">
                        <input id="kiosk-table-search-input" onKeyUp={(e)=>{kioskSearchFilter(e)}} className="form-control border-0" type="text" placeholder="Search here..."/>
                        <Search id="kiosk-table-list-search" className="icon"/>
                    </div>
                    {/* <a className="btn btn-primary ms-2">Create</a> */}
                </div>
            </div>
            <div className="kiosk-details">
                <table className="data-table">
                    <thead>
                        <tr>
                            <td>Kiosk ID<FontAwesomeIcon onClick={()=>{changeKioskDataTableOrder()}} icon={kioskDataTableOrder ? faArrowUpWideShort : faArrowDownWideShort} className="ms-2 icon"/></td>
                            <td>Location ID</td>
                            <td>Status</td>
                            <td>Box QTY</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tempKioskDataTable.length != 0 
                            ?
                            tempKioskDataTable.map((item)=>{
                                return(
                                    <tr key={item.KioskID}>
                                        <td>{item.KioskID}</td>
                                        <td>{item.LocationID}</td>
                                        <td>{item.Status}</td>
                                        <td>{item.BoxQty}</td>
                                        <td>
                                            <a onClick={()=>{editKioskDataTable(item.KioskID)}}><FontAwesomeIcon icon={faPencil} className="pe-3 icon"/></a>
                                            <a onClick={()=>{deleteKioskDataTable(item.KioskID)}}><FontAwesomeIcon icon={faTrash} className="icon fa-trash"/></a>
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            <tr colspan="5" className="text-center">
                                <td>No data found!</td>
                            </tr>
                        }
                        
                    </tbody>
                </table>
            </div>
        </div>
    </>;
}

const KioskModalPopupOne = ({UserID, kioskPopupDetails}) => {

    const [kioskConfiguration,setKioskConfiguration] = useState([]);
    const [customerList,setCustomerList] = useState([]);//Customer list Details
    const [kisokLocationDetails,setKioskLocationDetails] = useState([]);//Location List Details

    const [mode,setMode] = useState('');//popup model mode [ new / edit]
    const [modalShow,setModalShow] = useState(false);//popup model show [ true / false ]
    
    // const [boxCount,setBoxCount] = useState([]);
    const [cpCodeDetails,setCPCodeDetails] = useState([]);
    const [boxCount,setBoxCount] = useState([]);
    const [kioskDetails,setKioskDetails] = useState({
        ConfigurationID : '',
        Password : '',
        KioskNumber : '',
        LocationID : '',
        CompanyID : ''
    });

    useEffect(()=>{
        console.log(kioskDetails);
    },[kioskDetails]);

    useEffect(() => {

        if(kioskPopupDetails?.type) {
            setKioskDetails({
                Password : '',
                ConfigurationID : '',
                KioskNumber : '',
                LocationID : '',
                CompanyID : ''
            });
            setMode('new');
            setModalShow(true);
        } else if(kioskPopupDetails?.KioskID){
            setMode('edit');
            getSingleKioskDetails(kioskPopupDetails.KioskID);
            setModalShow(true);
        }else{
            setModalShow(false);
        }
        
    },[kioskPopupDetails]);
    
    useEffect(()=>{
        getAllCompany().then((result) => {
            if(Object.keys(result).length !== 0){
                setCustomerList(result ?? []);
            }
        }).catch((error) => {
            console.log(error);
        });
    },[]);

    useEffect(()=>{
        getKioskLocationDetails(kioskDetails.CompanyID);
        getCPCodeDetails(kioskDetails.CompanyID);
    },[kioskDetails.CompanyID]);

    useEffect(()=>{
        getBoxDetails(kioskDetails.ConfigurationID);
    },[kioskDetails.ConfigurationID]);

    // @kiosk page last pending work. need password and customer ID to display in edit popup modal
    function getSingleKioskDetails(KioskID){
        getKiosk(KioskID).then((result)=>{
            if(result.reply == 'Error With DB Server')
            {
                setKioskDetails({
                    Password : '',
                    ConfigurationID : '',
                    KioskNumber : '',
                    LocationID : '',
                    CompanyID : ''
                });
            }else{
                setKioskDetails({
                    Password : '',
                    ConfigurationID : result[0].Configuration|| '',
                    KioskNumber : result[0].KioskID,
                    LocationID : result?.[0]?.['LocationID'] || '',
                    CompanyID : kioskPopupDetails.CustomerID
                });
                handleChanges(result?.[0]?.['configuration'] || '');
                setBoxCount(result?.[0]?.['KioskBox'] || []);
            }
            
        }).catch((error)=>{
            console.log(error);
        });
    }

    function getKioskLocationDetails(CompanyID){
        CompanyID !== '' &&
        getLocationInformation(CompanyID).then(result=>{
            setKioskLocationDetails(result);
        }).catch(error => {
            console.log(error);
        });
    }

    function getCPCodeDetails(CompanyID){
        CompanyID !== '' 
        &&
        getCPCodeGet(CompanyID).then(result=>{
            setCPCodeDetails(result);
        }).catch(error => {
            console.log(error);
        });
    }

    function getBoxDetails(ConfigurationID) {
        // console.log(ConfigurationID);
    }

    

    useEffect(() =>{
        getKioskConfigurationGet().then((data) =>{
            setKioskConfiguration(data);
        }).catch((error)=>{
            console.log(error);
        });
    },[]);

    function handleChanges(value) {
        let boxQty = value;
        boxQty == 1 ? setBoxCount(createArray(7)) : boxQty == 2 ? setBoxCount(createArray(13)) : boxQty == 3 && setBoxCount(createArray(19))
    }

    function createArray(count){
        let array = [];
        for(let i=0;i<count;i++){
            array[i] = '';
        }
        return array;
    }

    function handleClose(){

        setModalShow(false);
    }
    
    // let BoxNos = [];
    function handleChange(value,index) {
        boxCount[index] = value;
      }

      function saveKioskDetails(){
        if(kioskDetails.CompanyID == '')
        {
            NotificationManager.warning('Please select the company ID!','Warning!',3000);
        }
        if(kioskDetails.LocationID == '')
        {
            NotificationManager.warning('Please enter the Location Name!','Warning!',3000);
        }
        if(kioskDetails.KioskNumber == '')
        {
            NotificationManager.warning('Please enter the Kiosk Number!','Warning!',3000);
        }
        if(kioskDetails.ConfigurationID == '')
        {
            NotificationManager.warning('Please enter the Comp Qty!','Warning!',3000);
        }
        if(kioskDetails.Password == '')
        {
            NotificationManager.warning('Please enter the Password!','Warning!',3000);
        }
        else{
            addUpdateKioskInformation({
                CompanyID : kioskDetails.CompanyID,
                LocationID : kioskDetails.LocationID,
                KioskNumber : kioskDetails.KioskNumber,
                DeviceNumber : kioskDetails.CompanyID+'-'+kioskDetails.LocationID+'-'+kioskDetails.KioskNumber,
                ConfigurationID : kioskDetails.ConfigurationID,
                Password : kioskDetails.Password,
                UserID,
                boxCount : JSON.stringify(boxCount)
            }).then((data)=>{
                if(data.status == 200)
                {
                    handleClose();
                    //resetLocation();
                    NotificationManager.success(`Kiosk Details ${mode == 'new' ? 'added' : 'saved'} successfully..!`,'Congratulations!',3000);
                }
                else if(data.status == 404)
                {
                    NotificationManager.error('Kiosk Details already exist..!','Error!',3000);
                }else{
                    NotificationManager.error('Something went wrong..!','Error!',3000);
                }
            });
        }
    }
    

    return <>
        {/* <!-- Kiosk Management Modal Popup --> */}
        <Modal 
            show={modalShow} 
            onHide={()=> { handleClose() }} 
            size ='lg'
            centered >
            <div className="modal-header pb-0">
                <h6 className="modal-title" id="exampleModalLabel_two">Kiosk Information</h6>
                <button type="button" className="btn-close" onClick={()=>{ handleClose() }} aria-label="Close"></button>
            </div>
            <div className="modal-body pb-0">                
                <div className="single-input-field">
                    <select type="text" autoComplete="off" name="company_name" id="company-name-input" className="form-control" onChange={(e)=>{setKioskDetails(kioskDetails => ({...kioskDetails,CompanyID:e.target.value}))}} >
                        <option value="" selected disabled>Choose Customer</option>
                        {   
                            customerList.map((comp)=>{
                                return(<option key={comp.CompanyID} selected={kioskDetails.CompanyID === comp.CompanyID ? true : false} value={comp.CompanyID}>{comp.CompanyName}</option>)
                            })
                        }
                    </select>
                    <label htmlFor="kiosk-customer-name-input">Customer</label>
                </div>
                <div className="single-input-field">
                    <select type="text" autoComplete="off" name="location_name" id="kiosk-loation-input" className="form-control kiosks-list" onChange={(e)=>{setKioskDetails(kioskDetails => ({...kioskDetails,LocationID:e.target.value}))}}>
                        <option value="" selected disabled>Choose Location</option>
                            {   
                                kisokLocationDetails.length != 0 &&
                                kisokLocationDetails.map((loc)=>{
                                    return(<option key={loc.LocationID} selected={kioskDetails.LocationID === loc.LocationID ? true : false} value={loc.LocationID}>{loc.LocationName}</option>)
                                })
                            }
                    </select>
                    <label htmlFor="kiosk-loation-input">Location</label>
                        <i className="fa-solid fa-chevron-down kiosks-list-dropdown"></i>
                </div>
                <div className="single-input-field">
                    <input type="text" autoComplete="off" name="kiosk_number" id="kiosk-number-input" className="form-control" placeholder="Enter kiosk number" defaultValue={kioskDetails.KioskNumber} onChange={(e)=>{setKioskDetails(kioskDetails => ({...kioskDetails,KioskNumber:e.target.value}))}} />
                    <label htmlFor="kiosk-number-input">Kiosk Number</label>
                </div>
                <div className="single-input-field">
                    <select type="text" autoComplete="off" name="compartment_quantity" id="kiosk-compartment-quantity-input" className="form-control kiosks-list" 
                        onChange={(e)=>{
                            handleChanges(e.target.value);
                            setKioskDetails(kioskDetails => ({...kioskDetails,ConfigurationID:e.target.value}))
                        }} >
                        <option value="" selected disabled>Select</option>
                            {
                                kioskConfiguration.length != 0 &&
                                kioskConfiguration.map((item)=>{
                                    console.log(item);
                                    return(<option key={item?.ConfigurationID || ''} selected={kioskDetails.ConfigurationID === item.ConfigurationID ? true : false} value={item?.ConfigurationID || ''}>{item?.Configuration || ''}</option>);
                                })
                            }
                    </select>
                    <label htmlFor="kiosk-compartment-quantity-input">Compartment Quantity</label>
                    <i className="fa-solid fa-chevron-down kiosks-list-dropdown"></i>
                </div>
                <div className="single-input-field">
                    <input type="text" autoComplete="off" name="password"  className="form-control" placeholder="Enter Password" defaultValue={kioskDetails.Password} onChange={(e)=>{setKioskDetails(kioskDetails => ({...kioskDetails,Password:e.target.value}))}} />
                    <label htmlFor="kiosk-number-input">Password</label>
                </div>
            </div>

            {/* <!-- Second Set --> */}
            <div className="modal-header py-0">
                <h6 className="modal-title">Compartment Assignment</h6>
            </div>
            <div className="modal-body pb-0">
                <div className="row">
                    { 
                        boxCount.map((box,index)=>{
                        return(
                            <div className="col-6">
                                <div className="single-input-field">
                                    <select type="text" autoComplete="off" name="boxs" id="kiosk-box-1" className="form-control kiosks-list" onChange={(e)=>handleChange(e.target.value,index)} >
                                        <option value="" selected={mode == "new"}>Not Select</option>
                                            { 
                                                cpCodeDetails.length != 0 
                                                ?
                                                cpCodeDetails.map((cpcodes)=> {
                                                    return(<option selected={box.CPNo == cpcodes?.CPCode} value={cpcodes?.CPCode || ''}>{cpcodes?.CPCode || ''}</option>);
                                                })
                                                :
                                                <></>
                                            } 
                                    </select>
                                    <label htmlFor="kiosk-box-1">Box {index + 1}</label>
                                    <i className="fa-solid fa-chevron-down kiosks-list-dropdown"></i>
                                </div>
                            </div> 
                            );
                        })
                    } 
                </div>
            </div>
            <div className="modal-footer pt-0">
                <a className="modal-save btn btn-primary" onClick={()=>{saveKioskDetails()}}>Save</a>
                <a className="modal-close btn" onClick={()=>{ handleClose() }} >Close</a>
            </div>
        </Modal>
            <NotificationContainer/>
    </>;
};

const KioskModalPopupTwo = () => {
    return <>
        {/* <!-- Kiosk Management Modal Popup --> */}
        <div className="modal fade" id="exampleModalTwo" tabIndex="-1" aria-labelledby="exampleModalLabel_three" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    {/* <!-- First Set --> */}
                    <div className="modal-header pb-0">
                        <h6 className="modal-title" id="exampleModalLabel_two">Kiosk Information</h6>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body pb-0">
                            
                        <div className="single-input-field">
                            <input type="text" autoComplete="off" name="customer_name" id="kiosk-customer-name-input" className="form-control"/>
                            <label htmlFor="kiosk-customer-name-input">Customer</label>
                        </div>
                        <div className="single-input-field">
                            <select type="text" autoComplete="off" name="company_name" id="kiosk-loation-input" className="form-control kiosks-list">
                                <option value="" selected disabled>Enter Location</option>
                            </select>
                            <label htmlFor="kiosk-loation-input">Location</label>
                            <i className="fa-solid fa-chevron-down kiosks-list-dropdown"></i>
                        </div>
                        <div className="single-input-field">
                            <input type="text" autoComplete="off" name="kiosk_number" id="kiosk-number-input" className="form-control" placeholder="Enter kiosk number"/>
                            <label htmlFor="kiosk-number-input">Kiosk Number</label>
                        </div>
                        <div className="single-input-field">
                            <select type="text" autoComplete="off" name="compartment_quantity" id="kiosk-compartment-quantity-input" className="form-control kiosks-list">
                                <option value="" selected disabled>Select</option>
                            </select>
                            <label htmlFor="kiosk-compartment-quantity-input">Compartment Quality</label>
                            <i className="fa-solid fa-chevron-down kiosks-list-dropdown"></i>
                        </div>

                    </div>

                    {/* <!-- Second Set --> */}
                    <div className="modal-header py-0">
                        <h6 className="modal-title">Compartment Assignment</h6>
                    </div>
                    <div className="modal-body pb-0">
                        <div className="row">
                            <div className="col-5">

                                <div className="single-input-field">
                                    <input type="text" autoComplete="off" name="box_one" id="kiosk-box-1" className="form-control"/>
                                    <label htmlFor="kiosk-box-1">Box 1</label>                                                                                      
                                </div>
                                <div className="single-input-field">
                                    <input type="text" autoComplete="off" name="box_one" id="kiosk-box-3" className="form-control"/>
                                    <label htmlFor="kiosk-box-3">Box 3</label>
                                </div>
                                <div className="single-input-field">
                                    <input type="text" autoComplete="off" name="box_one" id="kiosk-box-5" className="form-control"/>
                                    <label htmlFor="kiosk-box-5">Box 5</label>
                                </div>
                                <div className="single-input-field">
                                    <input type="text" autoComplete="off" name="box_one" id="kiosk-box-7" className="form-control"/>
                                    <label htmlFor="kiosk-box-7">Box 7</label>
                                </div>
                                <div className="single-input-field">
                                    <input type="text" autoComplete="off" name="box_one" id="kiosk-box-9" className="form-control"/>
                                    <label htmlFor="kiosk-box-9">Box 9</label>
                                </div>
                                <div className="single-input-field">
                                    <input type="text" autoComplete="off" name="box_one" id="kiosk-box-11" className="form-control"/>
                                    <label htmlFor="kiosk-box-11">Box 11</label>
                                </div>

                            </div>
                            <div className="col-1 px-0">
                                <div className="availablity-box available"></div>
                                <div className="availablity-box available"></div>
                                <div className="availablity-box not-available"></div>
                                <div className="availablity-box available"></div>
                                <div className="availablity-box not-available"></div>
                                <div className="availablity-box not-available"></div>
                            </div>
                            <div className="col-5 ps-lg-0">

                                <div className="single-input-field">
                                    <input type="text" autoComplete="off" name="box_one" id="kiosk-box-2" className="form-control"/>
                                    <label htmlFor="kiosk-box-2">Box 2</label>                                                                                      
                                </div>
                                <div className="single-input-field">
                                    <input type="text" autoComplete="off" name="box_one" id="kiosk-box-4" className="form-control"/>
                                    <label htmlFor="kiosk-box-4">Box 4</label>
                                </div>
                                <div className="single-input-field">
                                    <input type="text" autoComplete="off" name="box_one" id="kiosk-box-6" className="form-control"/>
                                    <label htmlFor="kiosk-box-6">Box 6</label>
                                </div>
                                <div className="single-input-field">
                                    <input type="text" autoComplete="off" name="box_one" id="kiosk-box-8" className="form-control"/>
                                    <label htmlFor="kiosk-box-8">Box 8</label>
                                </div>
                                <div className="single-input-field">
                                    <input type="text" autoComplete="off" name="box_one" id="kiosk-box-10" className="form-control"/>
                                    <label htmlFor="kiosk-box-10">Box 10</label>
                                </div>
                                <div className="single-input-field">
                                    <input type="text" autoComplete="off" name="box_one" id="kiosk-box-12" className="form-control"/>
                                    <label htmlFor="kiosk-box-12">Box 12</label>
                                </div>

                            </div>
                            <div className="col-1">
                                <div className="availablity-box available"></div>
                                <div className="availablity-box available"></div>
                                <div className="availablity-box not-available"></div>
                                <div className="availablity-box available"></div>
                                <div className="availablity-box not-available"></div>
                                <div className="availablity-box not-available"></div>
                            </div>

                        </div>
                    </div>
                    <div className="modal-footer pt-0 d-flex justify-content-between align-items-center">
                        <div className="form button">
                            <a className="modal-save btn btn-primary">Save</a>
                            <a className="modal-close btn" data-bs-dismiss="modal" >Close</a>
                        </div>
                        <div className="form-color-code d-flex align-items-center">
                            <div className="availablity-status-box available"></div>
                            <span>Available</span>
                            <div className="availablity-status-box not-available"></div>
                            <span>Not Available</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>;
}

const KioskOffCanvas = () => {
    return <>
        <div className="offcanvas kiosk-offcanvas offcanvas-end" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
            {/* <!-- First Set --> */}
            <div className="offcanvas-header pb-0">
                <h6 className="offcanvas-title" id="offcanvasExampleLabel">Kiosk Information</h6>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>

            <div className="offcanvas-body pb-0">
                <div className="single-input-field">
                    <input type="text" autoComplete="off" name="customer_name" id="kiosk-customer-name-input" className="form-control"/>
                    <label htmlFor="kiosk-customer-name-input">Customer</label>
                </div>
                <div className="single-input-field">
                    <select type="text" autoComplete="off" name="company_name" id="kiosk-loation-input" className="form-control kiosks-list">
                        <option value="" selected disabled>Enter Location</option>
                    </select>
                    <label htmlFor="kiosk-loation-input">Location</label>
                    <i className="fa-solid fa-chevron-down kiosks-list-dropdown"></i>
                </div>
                <div className="single-input-field">
                    <input type="text" autoComplete="off" name="kiosk_number" id="kiosk-number-input" className="form-control" placeholder="Enter kiosk number"/>
                    <label htmlFor="kiosk-number-input">Kiosk Number</label>
                </div>
                <div className="single-input-field">
                    <select type="text" autoComplete="off" name="compartment_quantity" id="kiosk-compartment-quantity-input" className="form-control kiosks-list">
                        <option value="" selected disabled>Select</option>
                    </select>
                    <label htmlFor="kiosk-compartment-quantity-input">Compartment Quality</label>
                    <i className="fa-solid fa-chevron-down kiosks-list-dropdown"></i>
                </div>
            </div>

            {/* <!-- Second Set --> */}
            <div className="offcanvas-header pb-0">
                <h6 className="offcanvas-title">Compartment Assignment</h6>
            </div>

            <div className="offcanvas-body pb-0">
                <div className="row">
                    <div className="col-6">

                        <div className="single-input-field">
                            <select type="text" autoComplete="off" name="box_one" id="kiosk-box-1" className="form-control kiosks-list">
                                <option value="" selected disabled>Select</option>
                            </select>
                            <label htmlFor="kiosk-box-1">Box 1</label>
                            <i className="fa-solid fa-chevron-down kiosks-list-dropdown"></i>
                        </div>
                        <div className="single-input-field">
                            <select type="text" autoComplete="off" name="box_one" id="kiosk-box-3" className="form-control kiosks-list">
                                <option value="" selected disabled>Select</option>
                            </select>
                            <label htmlFor="kiosk-box-3">Box 3</label>
                        <i className="fa-solid fa-chevron-down kiosks-list-dropdown"></i>
                        </div>
                        <div className="single-input-field">
                            <select type="text" autoComplete="off" name="box_one" id="kiosk-box-5" className="form-control kiosks-list">
                                <option value="" selected disabled>Select</option>
                            </select>
                            <label htmlFor="kiosk-box-5">Box 5</label>
                        <i className="fa-solid fa-chevron-down kiosks-list-dropdown"></i>
                        </div>
                        <div className="single-input-field">
                            <select type="text" autoComplete="off" name="box_one" id="kiosk-box-7" className="form-control kiosks-list">
                                <option value="" selected disabled>Select</option>
                            </select>
                            <label htmlFor="kiosk-box-7">Box 7</label>
                        <i className="fa-solid fa-chevron-down kiosks-list-dropdown"></i>
                        </div>
                        <div className="single-input-field">
                            <select type="text" autoComplete="off" name="box_one" id="kiosk-box-9" className="form-control kiosks-list">
                                <option value="" selected disabled>Select</option>
                            </select>
                            <label htmlFor="kiosk-box-9">Box 9</label>
                        <i className="fa-solid fa-chevron-down kiosks-list-dropdown"></i>
                        </div>
                        <div className="single-input-field">
                            <select type="text" autoComplete="off" name="box_one" id="kiosk-box-11" className="form-control kiosks-list">
                                <option value="" selected disabled>Select</option>
                            </select>
                            <label htmlFor="kiosk-box-11">Box 11</label>
                        <i className="fa-solid fa-chevron-down kiosks-list-dropdown"></i>
                        </div>

                    </div>
                    <div className="col-6">

                        <div className="single-input-field">
                            <select type="text" autoComplete="off" name="box_one" id="kiosk-box-2" className="form-control kiosks-list">
                                <option value="" selected disabled>Select</option>
                            </select>
                            <label htmlFor="kiosk-box-2">Box 2</label>
                            <i className="fa-solid fa-chevron-down kiosks-list-dropdown"></i>
                        </div>
                        <div className="single-input-field">
                            <select type="text" autoComplete="off" name="box_one" id="kiosk-box-4" className="form-control kiosks-list">
                                <option value="" selected disabled>Select</option>
                            </select>
                            <label htmlFor="kiosk-box-4">Box 4</label>
                            <i className="fa-solid fa-chevron-down kiosks-list-dropdown"></i>
                        </div>
                        <div className="single-input-field">
                            <select type="text" autoComplete="off" name="box_one" id="kiosk-box-6" className="form-control kiosks-list">
                                <option value="" selected disabled>Select</option>
                            </select>
                            <label htmlFor="kiosk-box-6">Box 6</label>
                            <i className="fa-solid fa-chevron-down kiosks-list-dropdown"></i>
                        </div>
                        <div className="single-input-field">
                            <select type="text" autoComplete="off" name="box_one" id="kiosk-box-8" className="form-control kiosks-list">
                                <option value="" selected disabled>Select</option>
                            </select>
                            <label htmlFor="kiosk-box-8">Box 8</label>
                            <i className="fa-solid fa-chevron-down kiosks-list-dropdown"></i>
                        </div>
                        <div className="single-input-field">
                            <select type="text" autoComplete="off" name="box_one" id="kiosk-box-10" className="form-control kiosks-list">
                                <option value="" selected disabled>Select</option>
                            </select>
                            <label htmlFor="kiosk-box-10">Box 10</label>
                            <i className="fa-solid fa-chevron-down kiosks-list-dropdown"></i>
                        </div>
                        <div className="single-input-field">
                            <select type="text" autoComplete="off" name="box_one" id="kiosk-box-12" className="form-control kiosks-list">
                                <option value="" selected disabled>Select</option>
                            </select>
                            <label htmlFor="kiosk-box-12">Box 12</label>
                            <i className="fa-solid fa-chevron-down kiosks-list-dropdown"></i>
                        </div>

                    </div>
                </div>
            </div>

            <div className="offcanvas-body">
                <a className="modal-save btn btn-primary m-1">Save</a>
                <a className="offcanvas-close btn m-1" data-bs-dismiss="offcanvas" aria-label="Close">Close</a>
            </div>

        </div>
    </>;
}

export { KioskTopbar, KioskCusomerList, KioskList, KioskModalPopupOne,KioskModalPopupTwo,KioskOffCanvas };