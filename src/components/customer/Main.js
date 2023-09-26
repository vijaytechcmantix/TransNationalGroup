import { useState, useEffect } from "react";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faChevronRight, faPlus, faPencil, faArrowUpWideShort, faArrowDownWideShort } from "@fortawesome/free-solid-svg-icons";
import { getAllCompany, addCompany, deleteCompany, updateCompany } from "../../services/api/api";
import { Modal } from "react-bootstrap";

// Notification 
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
// Alert 
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

/*=====[ # Loader # ]=====*/
import Loader from "../main/Loader";

const CustomerTopbar = ({ open_CustomerModal }) => {
    function openCustomerModal() {
        open_CustomerModal({ type: 'new' });
    }
    return <>
        <div className="customer-top-bar px-3 py-2 d-flex justify-content-between align-items-center mb-3">
            <div className="customer-title"><span className="Page-heading">Customer Management</span></div>
            <div className="customer-count d-flex">
                <a className="add-new-customer d-flex align-items-center" onClick={() => { openCustomerModal() }}>
                    <FontAwesomeIcon icon={faPlus} className="icon" />
                    <span>Add New Customer</span>
                </a>
            </div>
        </div>
    </>;

}

const CustomerList = ({ setActiveCustomerDetails, addCompany, editCustomer }) => {

    //[Initialization]
    const user = 'peterwong';
    const [customerList, setCustomerList] = useState([]);
    const [tempCustomerList, setTempCustomerList] = useState([]);
    const [customerOrder, setCustomerOrder] = useState(true);
    const [activeCustomer, setActiveCustomer] = useState('');
    const [loaderDisplayCust, setLoaderDisplayCust] = useState('hide');


    useEffect(() => {
        setLoaderDisplayCust('show');
        resetCustomerDetails();
    }, [addCompany]);

    useEffect(() => {
        setActiveCustomerDetails(customerList?.[0] || []);
        setActiveCustomer(customerList?.[0]?.CompanyID || []);
        setTempCustomerList(customerList);
    }, [customerList]);

    // [Functionality]
    function changeCustomerDetails(item) {
        setActiveCustomer(item.CompanyID);
        setActiveCustomerDetails(item);
    }

    function deleteCustomerDetails(item) {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to delete this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        deleteCompany({
                            CompanyID: item.CompanyID,
                            user: user
                        }).then((data) => {
                            if (data.status == 200) {
                                resetCustomerDetails();
                                NotificationManager.success('Company deleted successfully..!', 'Congratulations!', 3000);
                            } else if (data.status == 404) {
                                NotificationManager.error('Incorrect requst..!', 'Error!', 3000);
                            } else {
                                NotificationManager.error('Something went wrong..!', 'Error!', 3000);
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

    function editCustomerDetails(item) {
        editCustomer(item);
    }

    function resetCustomerDetails() {
        getAllCompany().then((result) => {
            setLoaderDisplayCust('hide');
            if (Object.keys(result).length != 0) {
                setCustomerList(result);
                setActiveCustomer(result[0].CompanyID);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    function locationCustomerChangeOrder() {
        setCustomerOrder(!customerOrder);
        tempCustomerList.reverse();
    }

    return <>
        <div className="customer-list-container p-3 w-100 position-relative">

            <Loader
                display={loaderDisplayCust}
            />

            <div className="customer-heading d-flex align-items-center pb-2">
                <span>Customer</span>
                <FontAwesomeIcon onClick={() => { locationCustomerChangeOrder() }} icon={customerOrder ? faArrowUpWideShort : faArrowDownWideShort} className="ms-2 icon" />
            </div>
            <div className="customer-customer-list">

                {
                    tempCustomerList.map((item) => {
                        return (
                            <div title={item.CompanyName} key={item.CompanyID} onClick={() => { changeCustomerDetails(item) }} className={activeCustomer == item.CompanyID ? "single-customer-list-container active d-flex py-2 px-3" : "single-customer-list-container d-flex py-2 px-3"}>
                                <div className="single-customer-content">
                                    <div>{item.CompanyName.substring(0, 50)}</div>
                                    {/* <span>{item.kiosk}</span> */}
                                </div>
                                <div className="single-customer-arrow d-flex justify-content-center align-items-center">
                                    <FontAwesomeIcon onClick={() => { editCustomerDetails(item) }} icon={faPencil} className="icon me-4" />
                                    <FontAwesomeIcon onClick={() => { deleteCustomerDetails(item) }} icon={faTrash} className="icon" />
                                    <FontAwesomeIcon icon={faChevronRight} className="icon" />
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    </>;

}

const Customerdetails = ({ activeCustomer }) => {
    const [activeCustomerDetails, setActiveCustomerDetails] = useState({});

    useEffect(() => {
        setActiveCustomerDetails(activeCustomer);
    }, [activeCustomer])
    return <>

        <div className="customer-list-container p-3 w-100">
            <div className="customer-heading d-flex align-items-center pb-2">
                <span>Customer Details</span>
            </div>
            <div className="customer-details">
                <div className="customer-name">
                    <div className="customer-name-heading">Customer Name</div>
                    <input type="text" disabled style={{ width: '25rem' }} className="form-control" value={activeCustomerDetails.CompanyName} />
                </div>
                <div className="customer-ID">
                    <div className="customer-ID-heading">Customer ID</div>
                    <input type="text" disabled style={{ width: '25rem' }} className="form-control" value={activeCustomerDetails.CompanyID} />
                </div>
            </div>
        </div>
    </>;
}

const CustomerModalPopup = ({ openCustomerModal, resetCustomerList, editCompany, resetCustomer, UserID }) => {

    const [customerName, setCustomerName] = useState('');
    const [customerID, setCustomerID] = useState('');
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [mode, setMode] = useState('');

    const [loader, setLoader] = useState(false);

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

    useEffect(() => {
        if (openCustomerModal.type == 'new') {
            setCustomerName('');
            setCustomerID('');
            setMode('new');
            setShowCustomerModal(true);
        }
    }, [openCustomerModal]);

    useEffect(() => {
        if (editCompany.CompanyID != '') {
            setMode('edit');
            setCustomerName(editCompany.CompanyName);
            setCustomerID(editCompany.CompanyID);
            setShowCustomerModal(true);
        }
    }, [editCompany]);

    function addCompanyDetails(payload) {

        let stopLoader = false;

        if (payload.CompanyName == '') {
            setLoader(false);
            showToast('warning','Please enter the company name!');
        }
        else if (payload.CompanyName.length > 50) {
            setLoader(false);
            showToast('warning','The company name should contain maximum 50 characters!');
        }
        else if (payload.CompanyID.length > 50) {
            setLoader(false);
            showToast('warning','The company ID should contain maximum 50 characters!');
        }
        else if (payload.CompanyID == '') {
            setLoader(false);
            showToast('warning','Please enter the company ID!');
        }
        else {
            if (mode == 'edit') {
                if (editCompany.CompanyID == payload.CompanyID && editCompany.CompanyName == payload.CompanyName) {
                    setLoader(false);
                    showToast('warning','No changes made!');
                } else {
                    updateCompany({
                        CompanyID: payload.CompanyID,
                        newCompanyName: payload.CompanyName,
                        UserID
                    }).then((data) => {

                        setLoader(false);
                        if (data.status == 200) {
                            handleClose();
                            resetCustomerList();

                            showToast('success','Company updated successfully..!');
                        } else if (data.status == 409) {
                            showToast('warning','Company already exist..!');
                        } else {
                            showToast('error','Something went wrong..!');
                        }
                    });
                }
            } else {
                addCompany({ ...payload, UserID }).then((data) => {

                    setLoader(false);
                    if (data.status == 200) {
                        handleClose();
                        resetCustomerList();
                        showToast('success','Company added successfully..!');
                    } else if (data.status == 409) {

                        data.text().then(resultData => {

                            showToast('warning',resultData);

                        });

                    } else {
                        showToast('error','Something went wrong..!');
                    }
                });
            }
        }
    }

    function handleClose() {
        resetCustomer();
        setShowCustomerModal(false);
    }

    return (<>
        <Modal
            show={showCustomerModal}
            onHide={handleClose}
            centered
        >
            <div className="modal-header pb-0">
                <h6 className="modal-title" id="CustomerModalLabel"><FontAwesomeIcon icon={mode == "new" ? faPlus : faPencil} /> {mode == "new" ? "Add" : "Edit"} Customer</h6>
                <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body pb-0">
                <div className="single-input-field">
                    <input
                        type="text"
                        autoComplete="off"
                        name="customer_name"
                        id="customer-name-input"
                        className="form-control"
                        value={customerName}
                        placeholder="Maximum 50 characters only"
                        onChange={(e) => {
                            if (e.target.value.length > 50) {
                                showToast('warning','The company name should contain maximum 50 characters!');
                            } else if (e.target.value.length <= 50) {
                                setCustomerName(e.target.value)
                            }
                        }}
                    />
                    <label htmlFor="customer-name-input">Customer Name</label>
                </div>
                <div className="single-input-field">
                    <input
                        disabled={mode == 'edit' ? true : false}
                        type="text"
                        autoComplete="off"
                        name="customer_id"
                        id="customer-id-input"
                        className="form-control"
                        value={customerID}
                        placeholder="Maximum 50 characters only"
                        onChange={(e) => {
                            if (e.target.value.length > 50) {
                                showToast('warning','The company ID should contain maximum 50 characters!');
                            } else if (e.target.value.length <= 50) {
                                setCustomerID(e.target.value)
                            }
                        }}
                    />
                    <label htmlFor="customer-id-input">Customer ID {mode == 'edit' && '[Disabled]'}</label>
                </div>
            </div>
            <div className="modal-footer pt-0">
                <a
                    className={`modal-save btn btn-primary ${ loader ? 'loader-button' : ''}`}
                    onClick={() => {
                        if(!loader){
                            setLoader(true);
                            addCompanyDetails({
                                CompanyID: customerID,
                                CompanyName: customerName
                            });
                        }
                    }}
                >
                    Save
                </a>
                <a className="modal-close btn" onClick={() => { handleClose() }}>Close</a>
            </div>
        </Modal>

        <NotificationContainer />

    </>);
}

const CustomerOffCanvas = () => {
    return <>
        <div className="offcanvas customer-offcanvas offcanvas-end" tabIndex="-1" id="CustomeroffcanvasExample" aria-labelledby="CustomeroffcanvasExampleLabel">
            {/* <!-- First Set --> */}
            <div className="offcanvas-header pb-0">
                <h6 className="offcanvas-title" id="CustomeroffcanvasExampleLabel"><FontAwesomeIcon icon={faPlus} /> Add Customer</h6>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>

            <div className="offcanvas-body pb-0">
                <div className="single-input-field">
                    <input type="text" autoComplete="off" name="customer_name" id="customer-name-input" className="form-control" />
                    <label htmlFor="customer-name-input">Customer Name</label>
                </div>
                <div className="single-input-field">
                    <input type="text" autoComplete="off" name="customer_id" id="customer-id-input" className="form-control" />
                    <label htmlFor="customer-id-input">Customer ID</label>
                </div>
                <a className="modal-save btn btn-primary m-1">Save</a>
                <a className="offcanvas-close btn m-1" data-bs-dismiss="offcanvas" aria-label="Close">Close</a>
            </div>

        </div>
    </>;
}

export { CustomerTopbar, CustomerList, Customerdetails, CustomerModalPopup, CustomerOffCanvas };