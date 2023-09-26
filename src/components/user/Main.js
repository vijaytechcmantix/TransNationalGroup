import React, { useState, useEffect, memo } from "react";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight,faArrowDownWideShort,faChevronDown,faChevronUp,faArrowUpWideShort,faPencil } from "@fortawesome/free-solid-svg-icons"; 
import Search from '@mui/icons-material/Search'; 
import SearchFilter from "../../services/helper/SearchFilter";
import { TrendingUpTwoTone } from "@mui/icons-material";
import { getAllCompany, getUser, getUserPCCode, getUserType, getUserMailbagCPCode, getUserOutgoingLocationID, getAllGroupID, getAllGroup } from "../../services/api/api";

// Modal 
import { Modal } from "react-bootstrap";
// Notification 
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager} from 'react-notifications';
// Alert 
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
// React Select
import Select from 'react-select';

export function  UserTopbar ({setSearchFilterData, customerID, setDropdownFilterData}){

    const [dropdownFilter,setDropdownFilter] = useState([
        {
            name :'PCCode',
            value :''
        },
        {
            name :'MailbagCPCode',
            value :''
        },
        {
            name :'OutgoingLocationID',
            value :''
        },
        {
            name :'UserType',
            value :''
        },
        {
            name :'GroupID',
            value :''
        },
        {
            name :'CompanyID',
            value :''
        }
    ]);
    const [activeFilter,setActiveFilter] = useState({
        PCCode : false,
        MailbagCPCode : false,
        OutgoingLocationID : false,
        UserType : false,
        GroupID : false,
        CompanyID : false
    });
    const [dropdownDetails,setDropdownDetails] = useState({
        PCCode : [],
        MailbagCPCode : [],
        OutgoingLocationID : [],
        UserType : [],
        GroupID : [],
        CompanyID : []
    });

    useEffect(()=>{

        let dropdown_Details = {};

          if(customerID != ''){
            Promise.all([
                getAllGroupID().then((result)=>{
                    return result;
                }).catch((error)=>{
                    console.log(error);
                }),
                getUserType(customerID).then((result)=>{
                    return result;
                }).catch((error)=>{
                    console.log(error);
                }),
                getUserPCCode(customerID).then((result)=>{
                    return result;
                }).catch((error)=>{
                    console.log(error);
                }),
                getUserMailbagCPCode(customerID).then((result)=>{
                    return result;
                }).catch((error)=>{
                    console.log(error);
                }),
                getUserOutgoingLocationID(customerID).then((result)=>{
                    return result;
                }).catch((error)=>{
                    console.log(error);
                }),
                getAllCompany().then((result) => {
                    return result;
                }).catch((error) => {
                    console.log(error);
                })
            ]).then(([groupID, userType, pcCode, mailbagCPCode, outgoingLocationID,companyID]) => {
                dropdown_Details = {
                    PCCode : pcCode,
                    MailbagCPCode : mailbagCPCode,
                    OutgoingLocationID : outgoingLocationID,
                    UserType : userType,
                    GroupID : groupID,
                    CompanyID : companyID
                };
                setDropdownDetails(dropdown_Details);
            }).catch((error) => {
                console.log(error);
            });
        }else{
            console.log('Customer ID is Empty..!');
        }

    },[customerID]);

    useEffect(()=>{
        setDropdownFilterData(dropdownFilter);
    },[dropdownFilter]);

    function searchUserDataTableList(value){
        setSearchFilterData(value);
    }

    function changeFilterData(value,index){
        // dropdownFilter[index].value = value;
        let item = [...dropdownFilter];
        item[index] = {
            ...dropdownFilter[index],
            value : value
        }
        setDropdownFilter(item);
    }

    return <>
    {console.log(dropdownDetails?.PCCode)}
        <div className="customer-top-bar px-3 py-2-5 d-flex justify-content-between align-items-center mb-2">
            <div className="customer-title"><span className="Page-heading">Users</span></div>
        </div>
        <div className="col-12">
            <div className="user-table-filter-container mb-2">
                <div className="row">
                    <div className="col-lg-4 col-12 d-flex align-items-center pe-lg-1">
                        <div className="user-table-filter-search-container">
                            <input id="user-overall-search-input" className="form-control border-0" type="text" placeholder="Search here..." onKeyUp={(e)=>{searchUserDataTableList(e.target.value)}}/>
                            {/* <i className="material-icons" id="user-overall-search">search</i> */}
                            <Search id="user-overall-search" className="material-icons"/>
                        </div>
                    </div>
                    <div className="col-lg-8 col-12 d-flex align-items-center ps-lg-0 mt-lg-0 mb-lg-0 mt-3 mb-2">
                        <div className="user-table-filter-dropdown-container d-flex">
                            <div className="single-user-input-field">
                                <select onClick={()=>{setActiveFilter({PCCode:!activeFilter.PCCode})}} onChange={(e)=>{changeFilterData(e.target.value,0)}} type="text" autoComplete="off" name="company_name" id="user-pc-code-input" className="form-control users-list">
                                    <option value="" selected>Choose</option>
                                    {
                                        dropdownDetails?.PCCode.length != 0 && dropdownDetails?.PCCode.map((item)=>{
                                            return(<option key={item.PCCode} value={item.PCCode}>{item.PCCode}</option>)
                                        })
                                    }
                                </select>
                                <label htmlFor="user-pc-code-input">PC Code</label>
                                <FontAwesomeIcon icon={ activeFilter.PCCode ? faChevronDown : faChevronUp } className="icon users-list-dropdown"/>
                            </div>
                            <div className="single-user-input-field">
                                <select onClick={()=>{setActiveFilter({MailbagCPCode:!activeFilter.MailbagCPCode})}} onChange={(e)=>{changeFilterData(e.target.value,1)}} type="text" autoComplete="off" name="company_name" id="user-mail-input" className="form-control users-list">
                                    <option value="" selected>Choose</option>
                                    {
                                        dropdownDetails.MailbagCPCode.length != 0 && dropdownDetails.MailbagCPCode.map((item)=>{
                                            return(<option key={item.MailbagCPCode} value={item.MailbagCPCode}>{item.MailbagCPCode}</option>)
                                        })
                                    }
                                </select>
                                <label htmlFor="user-mail-input">Mail Bag CP No.</label>
                                <FontAwesomeIcon icon={ activeFilter.MailbagCPCode ? faChevronDown : faChevronUp } className="icon users-list-dropdown"/>
                            </div>
                            <div className="single-user-input-field">
                                <select onClick={()=>{setActiveFilter({OutgoingLocationID:!activeFilter.OutgoingLocationID})}} onChange={(e)=>{changeFilterData(e.target.value,2)}} type="text" autoComplete="off" name="company_name" id="user-mail-location-input" className="form-control users-list">
                                    <option value="" selected>Choose</option>
                                    {
                                        dropdownDetails.OutgoingLocationID.length != 0 && dropdownDetails.OutgoingLocationID.map((item)=>{
                                            return(<option key={item.OutgoingLocationID} value={item.OutgoingLocationID}>{item.OutgoingLocationID}</option>)
                                        })
                                    }
                                </select>
                                <label htmlFor="user-mail-location-input">Outgoing Mail Location Code</label>
                                <FontAwesomeIcon icon={ activeFilter.OutgoingLocationID ? faChevronDown : faChevronUp } className="icon users-list-dropdown"/>
                            </div>
                            <div className="single-user-input-field">
                                <select onClick={()=>{setActiveFilter({UserType:!activeFilter.UserType})}} onChange={(e)=>{changeFilterData(e.target.value,3)}} type="text" autoComplete="off" name="company_name" id="user-type-input" className="form-control users-list">
                                    <option value="" selected>Choose</option>
                                    {
                                        dropdownDetails.UserType.length != 0 && dropdownDetails.UserType.map((item)=>{
                                            return(<option key={item.UserType} value={item.UserType}>{item.UserType}</option>)
                                        })
                                    }
                                </select>
                                <label htmlFor="user-type-input">User Type</label>
                                <FontAwesomeIcon icon={ activeFilter.UserType ? faChevronDown : faChevronUp } className="icon users-list-dropdown"/>
                            </div>
                            <div className="single-user-input-field">
                                <select onClick={()=>{setActiveFilter({GroupID:!activeFilter.GroupID})}} onChange={(e)=>{changeFilterData(e.target.value,4)}} type="text" autoComplete="off" name="company_name" id="user-groupid-input" className="form-control users-list">
                                    <option value="" selected>Choose</option>
                                    {
                                        dropdownDetails.GroupID.length != 0 && dropdownDetails.GroupID.map((item)=>{
                                            return(<option key={item.GroupID} value={item.GroupID}>{item.GroupID}</option>)
                                        })
                                    }
                                </select>
                                <label htmlFor="user-groupid-input">Group ID</label>
                                <FontAwesomeIcon icon={ activeFilter.GroupID ? faChevronDown : faChevronUp } className="icon users-list-dropdown"/>
                            </div>
                            <div className="single-user-input-field">
                                <select onClick={()=>{setActiveFilter({CompanyID:!activeFilter.CompanyID})}} onChange={(e)=>{changeFilterData(e.target.value,5)}} type="text" autoComplete="off" name="company_name" id="user-customerid-input" className="form-control users-list">
                                    <option value="" selected>Choose</option>
                                    {
                                        dropdownDetails.CompanyID.length != 0 && dropdownDetails.CompanyID.map((item)=>{
                                            return(<option key={item.CompanyID} value={item.CompanyID}>{item.CompanyID}</option>)
                                        })
                                    }
                                </select>
                                <label htmlFor="user-customerid-input">Customer ID</label>
                                <FontAwesomeIcon icon={ activeFilter.CompanyID ? faChevronDown : faChevronUp } className="icon users-list-dropdown"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </>;
}

export function  UserCustomer ({setUserDataTableCompanyID}) {
    
    const [customerList,setCustomerList] = useState([]);
    const [tempCustomerList,setTempCustomerList] = useState([]);
    const [activeCustomer,setActiveCustomer] = useState('');
    const [userCustomerOrder,setUserCustomerOrder] = useState(true);

    // [Use Effect Hooks]
    useEffect(()=>{
        getCustomerDetails();
    },[]);

    useEffect(()=>{
        setActiveCustomer(customerList?.[0]?.CompanyID || '');
        setTempCustomerList(customerList);
        setUserDataTableCompanyID(customerList?.[0]?.CompanyID || '');
    },[customerList]);
    
    //[Functionality]
    function ChanegUserCustomerListOrder(){
        setUserCustomerOrder(!userCustomerOrder);
        tempCustomerList.reverse();
    }

    function changeActiveCustomerList(CompanyID){
        setActiveCustomer(CompanyID);
        setUserDataTableCompanyID(CompanyID);
    }

    function getCustomerDetails(){
        getAllCompany().then((result) => {
            if(Object.keys(result).length != 0){
                setCustomerList(result);
                setActiveCustomer(result?.[0]?.CompanyID || '');
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    function searchCustomerList(e){
        // let tempArray = [];
        // let i = 0;
        // if(e.target.value == '')
        // {
        //     setTempCustomerList(customerList)
        // }else{
        //     customerList.forEach((item,index) => {
        //         if(item.CompanyName.toLowerCase().includes(e.target.value.toLowerCase()))
        //         {
        //             tempArray[i] = customerList[index];
        //             i++;
        //         }
        //     });
        //     setTempCustomerList(tempArray);
        // }

        if (e.target.value === '') {
            setTempCustomerList(customerList);
          } else {
            const filteredList = customerList.filter(item => item.CompanyName.toLowerCase().includes(e.target.value.toLowerCase()));
            setTempCustomerList(filteredList);
          }
    }

    return <>
        <div className="user-customer-list-container p-3 w-100">
            <div className="customer-heading d-flex align-items-center pb-2">
                <span>Customer</span>
                <FontAwesomeIcon onClick={()=>{ChanegUserCustomerListOrder()}} icon={ userCustomerOrder ? faArrowUpWideShort : faArrowDownWideShort} className="icon ms-2"/>
            </div>
            <div className="user-customer-search mb-2">
                <input id="user-customer-search-input" className="form-control border-0" type="text" placeholder="Search here..." onKeyUp={(e)=>{searchCustomerList(e)}}/>
                <Search id="user-customer-list-search" className="material-icons icon"/>
            </div>
            <div className="user-customer-list">
                {
                    tempCustomerList.map((item)=>{
                        return(
                            <div title={item.CompanyName} key={item.CompanyID} onClick={()=>{changeActiveCustomerList(item.CompanyID)}} className={activeCustomer == item.CompanyID ? "single-customer-list-container active d-flex py-2 px-3" : "single-customer-list-container d-flex py-2 px-3" }>
                                <div className="single-customer-content">
                                    <div>{item.CompanyName.substring(0,50)}</div>
                                </div>
                                <div className="user-single-customer-arrow d-flex justify-content-center align-items-center">
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

export function  UserDetails ({customerID, dropdownFilterData, searchFilterData}) {

    const [userDetailsDataTable,setUserDetailsDataTable] = useState([]);
    const [tempUserDetailsDataTable,setTempUserDetailsDataTable] = useState([]);
    const [sortByFirstName,setSortByFirstName] = useState(true);
    const [sortByLastName,setSortByLastName] = useState(true);
    const [editUserAccessModal,setEditUserAccessModal] = useState({
        show : false,
        userDetails : {}
    });

    useEffect(()=>{
        setTempUserDetailsDataTable(userDetailsDataTable);
    },[userDetailsDataTable]);

    useEffect(()=>{
        SearchFilter({
            value : searchFilterData,
            searchField : ['all'],
            data : userDetailsDataTable,
            success: function(data){
                setTempUserDetailsDataTable(data);
            },
            error: function(err){
                console.log(err);
            }
        });
    },[searchFilterData]);

    useEffect(()=>{
        // console.log('dropdownFilterData');
        let tempData = [...userDetailsDataTable];

        for(let i = 0;i < dropdownFilterData.length;i++) {
            if(dropdownFilterData[i].value != '' && dropdownFilterData[i].name != 'CompanyID')
            {
                SearchFilter({
                    value : dropdownFilterData[i].value,
                    searchField : [dropdownFilterData[i].name],
                    data : tempData,
                    success: function(data) {
                        tempData = [...data];
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
            }
            if(dropdownFilterData.length - 1 == i){
                setTempUserDetailsDataTable(tempData);
            }
        }
    },[dropdownFilterData]);

    useEffect(()=>{
        if(customerID != ''){
            getUser({customerID}).then((data)=>{
                console.log(data);
                setUserDetailsDataTable(data);
            }).catch((error)=>{
                console.log(error);
            });
        }
    },[customerID]);
    
    function ColumnSorter(column, method){   
        // let tempArray = tempUserDetailsDataTable;
        tempUserDetailsDataTable.sort((name1 , name2) => 
        { 
            return compareObjects(name1, name2, column, method);
        });
        // setTempUserDetailsDataTable(tempArray);
    }
    
    function compareObjects(object1, object2, key, method) {
        var obj1 = object1[key];
        var obj2 = object2[key];

        if(obj1 != null){ obj1 = object1[key].toUpperCase(); }
        else{ obj1 = '';  }
        if(obj2 != null || obj2 == ''){ obj2 = object2[key].toUpperCase(); }
        else{ obj2 = '';  }
        
        if(!isNaN(obj1) && !isNaN(obj2)){
            obj1 = Number(obj1);
            obj2 = Number(obj2);
        }
        
        if(method){ 
            if (obj1 < obj2) {
            return -1
            }
            if (obj1 > obj2) {
            return 1
            }
        }
        else{
            if (obj1 > obj2) {
            return -1
            }
            if (obj1 < obj2) {
            return 1
            }
        }
        return 0
    }

    function sortAllByFirstName(){
        setSortByFirstName(!sortByFirstName);
        ColumnSorter('Firstname',!sortByFirstName);
    }

    function sortAllByLastName(){
        setSortByLastName(!sortByLastName);
        ColumnSorter('Lastname',!sortByLastName);
    }

    function editUserGroup(data){
        setEditUserAccessModal({
            show : true,
            userDetails : data
        });
    }
    
    return <>
        <div className="user-list-container px-2 py-3 w-100">
            {/* <!-- <div className="user-heading d-flex align-items-center pb-2">
                <span></span>
            </div> --> */}
            <div className="user-details">
               
                <table className="data-table">
                    <thead>
                        <tr>
                            <td>First Name <FontAwesomeIcon onClick={()=>{ sortAllByFirstName() }} icon={ sortByFirstName ? faArrowUpWideShort : faArrowDownWideShort } className="icon"/></td>
                            <td>Last Name <FontAwesomeIcon onClick={()=>{ sortAllByLastName() }} icon={ sortByLastName ? faArrowUpWideShort : faArrowDownWideShort } className="icon"/></td>
                            <td>Emails</td>
                            <td>User ID</td>
                            <td>PC Code</td>
                            <td>Mail Bag CP No.</td>
                            <td>Outgoing Mail Location Code</td>
                            <td>User Access</td>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            tempUserDetailsDataTable.length != 0 ?

                            tempUserDetailsDataTable.map((item)=>{
                                return(<tr key={item.UserID}>
                                            <td>{item.Firstname}</td>
                                            <td>{item.Lastname}</td>
                                            <td>{item.Email}</td>
                                            <td>{item.UserID}</td>
                                            <td>{item.PCCode}</td>
                                            <td>{item.MailbagCPCode}</td>
                                            <td>{item.OutgoingLocationID}</td>
                                            <td class="text-center"><FontAwesomeIcon onClick={()=>{editUserGroup({
                                                UserID : item.UserID,
                                                UserGroup : item.UserGrou
                                            })}} icon={faPencil} className="icon"/></td>
                                        </tr>)
                            })

                            :

                            <tr className="text-center"><td colSpan={8}>No Data Found!</td></tr>
                        }
                        
                    </tbody>
                </table>
              
            </div>
            <UserModalPopup userDetails={editUserAccessModal} />
        </div>
    </>;
}

const UserModalPopup = memo(function UserModalPopup({ userDetails }){

    const [ userAccessModel, setUserAccessModel ] = useState(false);
    const [ userAccessList, setUserAccessList ] = useState([]);

    useEffect(()=>{
        setUserAccessModel(userDetails.show);
    },[userDetails]);

    useEffect(()=>{
        getAllGroup().then((result)=>{
            if(result.length != 0){
                let allGroup = [];
                result.map((group)=>{
                    allGroup = [...allGroup,{ value: group.GroupID,   label: group.GroupName}];
                });
                setUserAccessList(allGroup);
            }
        }).catch((error)=>{
            console.log(error);
        })
    },[]);

    function handleClose(){
        setUserAccessModel(false);
    }

    function handleInputChange(e){
        const { name, value } = e.target;
        console.log(name);
        console.log(value);
    }
    return(  <>
                <Modal
                    show={userAccessModel}
                    onHide={handleClose}
                    centered
                >
                    <div className="modal-header pb-0">
                        <h6 className="modal-title" id="CustomerModalLabel"><FontAwesomeIcon className="me-1" icon={faPencil}/> Edit User Access</h6>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body pb-0">
                        <Select
                            // defaultValue={[colourOptions[2], colourOptions[3]]}
                            isMulti
                            name="colors"
                            options={userAccessList}
                            className="basic-multi-select w-100 mb-3"
                            classNamePrefix="select"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="modal-footer pt-0">
                        <a className="modal-save btn btn-primary"> Save </a>
                        <a className="modal-close btn" onClick={handleClose}>Close</a>
                    </div>
                </Modal>

                <NotificationContainer/>

            </>);
});