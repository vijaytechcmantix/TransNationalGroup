import {useState, useEffect} from "react";
import './style.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpWideShort,faArrowDownWideShort,faChevronRight,faPencil,faTrash,faPlus } from "@fortawesome/free-solid-svg-icons";
import Search from '@mui/icons-material/Search';
import { getUserPCCode, getAllCompany } from '../../services/api/api'
import Modal from 'react-bootstrap/Modal';

// Notification 
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager} from 'react-notifications';
// Alert 
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


const PcTopBar = () => {

    return <>
            {/* <!-- PC Management top bar  --> */}
            <div className="pc-top-bar px-3 py-2 d-flex justify-content-between align-items-center mb-3">
                <div className="pc-title"><span className="Page-heading">CP Management</span></div>
                {/* <div className="add-new-pc-container d-flex">
                    <a className="add-new-location d-flex align-items-center" onClick={()=>{locationDetailsPopup({type:'new'})}}>
                        <FontAwesomeIcon icon={faPlus} className="icon"/>
                        <span>Add New PC</span>
                    </a>
                </div> */}
            </div>
        </>;
}

const PcManagementCustomerList = ({setcpManagementDataTable}) => {

    //[Initialization]
    const [customerList,setCustomerList] = useState([]);
    const [tempCustomerList,setTempCustomerList] = useState([]);

    const [cpManagementCustomerOrder,setCpManagementCustomerOrder] = useState(true);
    const [activeCustomer,setActiveCustomer] = useState('');

    // [Use Effect Hooks]
    useEffect(()=>{
        getAllCompany().then((result) => {
            setCustomerList(result);
            setActiveCustomer(result?.[0]?.CompanyID ?? '');
        }).catch((error) => {
            console.log(error);
        });
    },[]);

    useEffect(()=>{
        setTempCustomerList(customerList);
    },[customerList]);

    useEffect(()=>{
        setcpManagementDataTable(activeCustomer);
    },[activeCustomer]);

    // [Functionality]
    function cpManagementCustomerChangeOrder(){
        setCpManagementCustomerOrder(!cpManagementCustomerOrder);
        tempCustomerList.reverse();
    }

    function showCpManagementTable(index,CompanyID){
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
            <div className="pc-customer-list-container p-3 w-100">
                <div className="customer-heading d-flex align-items-center pb-2">
                    <span>Customer</span>
                    <FontAwesomeIcon onClick={()=>{cpManagementCustomerChangeOrder()}} icon={cpManagementCustomerOrder ? faArrowUpWideShort : faArrowDownWideShort} className="ms-2 icon"/>
                </div>
                <div className="pc-customer-search mb-2">
                    <input id="pc-customer-search-input" className="form-control border-0" type="text" placeholder="Search here..." onKeyUp={(e)=>{searchCustomerList(e)}}/>
                    <Search id="pc-customer-list-search"/>
                </div>
                <div className="pc-customer-list">

                    {
                        tempCustomerList.map((cust,index)=>{
                            return(<div key={cust.CompanyID} className={activeCustomer == cust.CompanyID ? "active single-customer-list-container d-flex py-2 px-3" : "single-customer-list-container d-flex py-2 px-3"} onClick={()=>{showCpManagementTable(index,cust.CompanyID)}}>
                                        <div className="single-customer-content">
                                            <div>{cust.CompanyName}</div>
                                        </div>
                                        <div className="single-pc-customer-arrow d-flex justify-content-center align-items-center">
                                            <FontAwesomeIcon icon={faChevronRight}/>
                                        </div>
                                    </div>)
                        })
                    }

                </div>
            </div>
        </>;
}

const CpList = ({ CompanyID }) => {
    
    //[Initialization]
    var [pcDetails,setPcDetails] = useState([]);

    //[Use Effect Hooks]
    useEffect(()=>{
        CompanyID != ''
        &&
        getUserPCCode(CompanyID).then((result)=>{
            setPcDetails(result);
        });
    },[CompanyID]);

    return <>
        {/* <!-- Location container --> */}
        <div className="pc-list-container p-3 w-100">
            <div className="pc-heading d-flex align-items-center pb-2">
                <span>CP List</span>
            </div>
            <div className="pc-details">
                <table className="data-table">
                    <thead>
                        <tr>
                            <td>S/N</td>
                            <td>PC Code</td>
                            {/* <td>Actions</td> */}
                        </tr>
                    </thead>
                    <tbody className="locationDataTableBody">
                        {   
                            pcDetails?.length != 0
                            ?
                            pcDetails.map((pc,index)=>{
                                    return(<tr key={pc.PCCode}>
                                        <td>{index + 1}</td>
                                        <td>{pc.PCCode}</td>
                                    </tr>)
                            })
                            :
                            <tr><td colspan="2" style={{textAlign:'center',padding:'1rem'}}>No Data Found!</td></tr>
                        }
                        {/* Edit and Delete button for PC Management Page
                        <td>
                            <a><FontAwesomeIcon onClick={()=>{editPcCode()}} icon={faPencil} className="pe-3 icon"/></a>
                            <FontAwesomeIcon onClick={()=>{deletePcCode()}} icon={faTrash} className="icon fa-trash"/>
                        </td> */}
                    </tbody>
                </table>
            </div>
        </div>

    </>;
}

const PcModalPopup = () =>{

    const user = "peterwong";
    const [modalShow,setModalShow] = useState(false);

    function handleClose(){
        setModalShow(false);
    }

    return(
        <>
        <Modal 
            show={modalShow} 
            onHide={handleClose}
            centered
        >
            <div className="modal-header pb-0">
                <h6 className="modal-title" id="locationModalLabel"><i className="fa-solid fa-plus"></i> Add New Location</h6>
                <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body pb-0">

                <div className="single-input-field">
                    <input id="pc-code-input" className="form-control"/>
                    <label htmlFor="pc-code-input">PC Code</label>
                </div>

            </div>
            <div className="modal-footer pt-0">
                <a className="modal-save btn btn-primary" onClick={()=>{}}>Save</a>
                <a className="modal-close btn" onClick={handleClose}>Close</a>
            </div>
        </Modal>

        <NotificationContainer/>
        </>);
}

export { PcManagementCustomerList, PcTopBar, CpList, PcModalPopup }