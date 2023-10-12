import React, { useRef, useState, useEffect } from "react";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownWideShort,faArrowUpWideShort,faChevronRight,faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Search from '@mui/icons-material/Search';
import { 
    getLocationInformation, 
    getAllCompany, 
    getKioskOfflineTotal, 
    getKioskStickerLowTotal, 
    getKioskUPSActivatedTotal, 
    getKioskOffline, 
    getKioskStickerLow, 
    getKioskUPSActivated, 
    getKioskList, 
    getKiosk } from "../../services/api/api";
import { FirstSlave, SecondSlave } from './Slave';
import DashboardModal from './DashboardModal';

/*=====[ # Loader # ]=====*/
import Loader from "../main/Loader";

const DashboardTopbar=({ companyID })=>
{
    const [kioskTopbarCount, setKioskTopbarCount] = useState({
        kioskOfflineCount : 0,
        kioskStickerLowCount : 0,
        kioskUPSActivatedCount : 0
    });

    // const [kioskTopbar, setKioskTopbar] = useState({
    //     kioskOffline : [],
    //     kioskStickerLow : [],
    //     kioskUPSActivated : []
    // });

    const [tableData, setTableData] = useState([]);

    const dataTableHeading = [
        {
            lable : 'Index'
        },
        {
            lable : 'KioskID'
        },
        {
            lable : 'DeviceNo'
        },
        {
            lable : 'LocationID'
        },
        {
            lable : 'CustomerID'
        }
    ];

    const [ PopupModal, setPopupModal ] = useState({
        show : false,
        title : ''
    });

    useEffect(()=>{

        if(companyID != ''){

            Promise.all([
                getKioskOfflineTotal({companyID}).then((result)=>{
                    return result;
                }).catch((error)=>{
                    console.log(error);
                }),
                getKioskStickerLowTotal({companyID}).then((result)=>{
                    return result;
                }).catch((error)=>{
                    console.log(error);
                }),
                getKioskUPSActivatedTotal({companyID}).then((result)=>{
                    return result;
                }).catch((error)=>{
                    console.log(error);
                })
            ]).then(([kioskOfflineTotal, kioskStickerLowTotal, kioskUPSActivatedTotal])=>{
                let newObj = {
                    kioskOfflineCount : kioskOfflineTotal[0]?.Total != undefined ? kioskOfflineTotal[0]?.Total : 0,
                    kioskStickerLowCount : kioskStickerLowTotal[0]?.Total != undefined ? kioskStickerLowTotal[0]?.Total : 0,
                    kioskUPSActivatedCount : kioskUPSActivatedTotal[0]?.Total != undefined ? kioskUPSActivatedTotal[0]?.Total : 0,
                }
                setKioskTopbarCount(newObj);
            }).catch((error)=>{
                console.log(error);
            });

        }

    },[companyID]);
    
  return  <>
            {/* <!-- Dashboard top bar  --> */}
            <div className="dashboard-top-bar px-3 py-2 d-flex justify-content-between align-items-center mb-3">
                <div className="dashboard-title"><span className="Page-heading">Dashboard</span></div>
                <div className="dashboard-count d-flex">
                    {/* <!-- Dashboard Details  --> */}
                    <div 
                        className="dashboard-count-sub-container d-flex ps-2 pe-4 py-2 me-3 align-items-center pointer"
                        onClick={()=>{
                            setPopupModal({ show:true, title: 'Offline' });
                            getKioskOffline({companyID}).then((result)=>{
                                // setKioskTopbar(preObj => ({...preObj,'kioskOffline' : result}));
                                setTableData(result);
                            }).catch((error)=>{
                                console.log(error);
                            });
                        }}
                    >
                        <div className="dashboard-count-value bg-red me-2">{ kioskTopbarCount.kioskOfflineCount }</div>
                        <div className="dashboard-count-name">Offline</div>
                        <div className="arrow-right bg-red"></div>
                    </div>
                    <div 
                        className="dashboard-count-sub-container d-flex ps-2 pe-4 py-2 me-3 align-items-center pointer"
                        onClick={()=>{
                            setPopupModal({ show:true, title: 'UPS Activated' });
                            getKioskUPSActivated({companyID}).then((result)=>{
                                // setKioskTopbar(preObj => ({...preObj,'kioskUPSActivated' : result}));
                                setTableData(result);
                            }).catch((error)=>{
                                console.log(error);
                            });
                        }}
                    >
                        <div className="dashboard-count-value bg-green me-2">{ kioskTopbarCount.kioskUPSActivatedCount }</div>
                        <div className="dashboard-count-name">UPS Activated</div>
                        <div className="arrow-right bg-green"></div>
                    </div>
                    <div 
                        className="dashboard-count-sub-container d-flex ps-2 pe-4 py-2 me-3 align-items-center pointer"
                        onClick={()=>{
                            setPopupModal({ show:true, title: 'Sticker Low' });
                            getKioskStickerLow({companyID}).then((result)=>{
                                // setKioskTopbar(preObj => ({...preObj,'kioskStickerLow' : result}));
                                setTableData(result);
                            }).catch((error)=>{
                                console.log(error);
                            });
                        }}
                    >
                        <div className="dashboard-count-value bg-yellow me-2">{ kioskTopbarCount.kioskStickerLowCount }</div>
                        <div className="dashboard-count-name">Sticker Low</div>
                        <div className="arrow-right bg-yellow"></div>
                    </div>
                </div>
            </div>

            <DashboardModal  
                title           = {PopupModal.title + ' Kiosk List'} 
                showPopup       = {PopupModal.show}
                tableData       = {tableData} 
                tableHeading    = {dataTableHeading}
                changeModalShow = {setPopupModal}
            />
          </>;
}

const DashboardCustomer=({setKioskDataList, logOutDashboard})=>
{
    //[Initialization]
    const [customerList,setCustomerList] = useState([]);
    const [tempCustomerList,setTempCustomerList] = useState([]);
    const [dashboardCustomerOrder,setDashboardCustomerOrder] = useState(true);
    const [activeCustomer,setActiveCustomer] = useState('');
    const [loaderDisplayCustomer,setLoaderDisplayCustomer] = useState('hide');

    // [Use Effect Hooks]
    useEffect(()=>{
        setLoaderDisplayCustomer('show');
        getCustomerDetails();
    },[]);

    useEffect(()=>{
        setTempCustomerList(customerList);
        setActiveCustomer(customerList[0]?.CompanyID || '');
    },[customerList]);

    useEffect(()=>{
        setKioskDataList(activeCustomer);
    },[activeCustomer]);

    // [Functionality]
    function dashboardCustomerChangeOrder(){
        setDashboardCustomerOrder(!dashboardCustomerOrder);
        tempCustomerList.reverse();
    }

    function showKiosList(index,CompanyID){
        setActiveCustomer(CompanyID);
    }

    function searchCustomerList(e){
        let tempArray = customerList.filter((item)=>{
            return (item.CompanyName.toLowerCase().includes(e.target.value.toLowerCase()))
        });
        setTempCustomerList(tempArray || []);
        
    }

    function getCustomerDetails(){
        getAllCompany().then((result) => {
            setLoaderDisplayCustomer('hide');
            if(result != 403){
                setCustomerList(result);
                setActiveCustomer(result[0].CompanyID);
            }else{
                console.log('403');
                logOutDashboard();
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    return  <>
            {/* <!-- Dashboard Customer container --> */}
            <div className="dashboard-customer-list-container p-3 w-100 position-relative">
            
                <Loader 
                    display={loaderDisplayCustomer}
                />

                <div className="dashboard-customer-heading d-flex align-items-center pb-2">
                    <span>Customer</span>
                    <FontAwesomeIcon onClick={()=>{dashboardCustomerChangeOrder()}} icon={dashboardCustomerOrder ? faArrowUpWideShort : faArrowDownWideShort } className="ms-2 icon"/>
                </div>
                <div className="dashbocard-customer-searh mb-2">
                    <input id="customer-search-input" className="form-control border-0" type="text" placeholder="Search here..." onKeyUp={(e)=>{searchCustomerList(e)}}/>
                    <Search id="customer-list-search" className="icon"/>
                </div>
                <div className="dashboard-customer-list">
                    {
                        tempCustomerList.map((cust,index)=>{
                            return(
                                    <div title={cust.CompanyName} key={cust.CompanyID} onClick={()=>{showKiosList(index,cust.CompanyID)}} className={activeCustomer == cust.CompanyID ? "single-customer-list-container active d-flex py-2 px-3" : "single-customer-list-container d-flex py-2 px-3" }>
                                        <div className="single-customer-content">
                                            <div>{cust.CompanyName.substring(0,30)}{cust.CompanyName.length > 30 && '...'}</div>
                                            {/* <span>{cust.kiosk} Kiosks are opening normally</span> */}
                                        </div>
                                        <div className="dashboard-single-customer-arrow d-flex justify-content-center align-items-center">
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

const DashboardKios=({CompanyID, setKioskListId})=>
{
    // [Initialization]
    const [kioskList,setKioskList] = useState([]);
    const [activekioskList,setActiveKioskList] = useState('');
    const [locationList,setLocationList] = useState([]);
    const [tempKioskList,setTempKioskList] = useState([]);
    const [dashboardKioskOrder,setDashboardKioskOrder] = useState(true);
    const dashboardLocationSelector = useRef();

    const [loaderDisplayKiosk,setLoaderDisplayKiosk] = useState('hide');

    // [Use Effect Hooks]
    useEffect(()=>{
        setTempKioskList(kioskList);
        setActiveKioskList(kioskList?.[0]?.['KioskID'] ?? '');
    },[kioskList]);

    useEffect(()=>{
        if(CompanyID != '')
        {
            setLoaderDisplayKiosk('show');

            getKioskList(CompanyID).then((data)=>{
                setLoaderDisplayKiosk('hide');
                setKioskList(data);
            }).catch((error)=>{
                console.log(error);
            });

            getLocationInformation(CompanyID).then((result)=>{
                    setLocationList(result);
            });
            dashboardLocationSelector.current.value = '';
        }
    },[CompanyID]);

    useEffect(()=>{
        setKioskListId(activekioskList);
    },[activekioskList]);

    //Functionality
    function dashboardKioskChangeOrder(){
        setDashboardKioskOrder(!dashboardKioskOrder);
        tempKioskList.reverse();
    }

    function searchDashboardKioskList(e){
        let tempArray = [];
        if(e.target.value == '')
        {
            setTempKioskList(kioskList)
        }else{
            tempArray = kioskList.filter((item) => {
                if(
                    item.KioskID.toLowerCase().includes(e.target.value.toLowerCase()) || 
                    item.DeviceNo.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.LocationID.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.Status.toLowerCase().includes(e.target.value.toLowerCase())
                )
                {
                    return 1
                }
            });
            setTempKioskList(tempArray);
        }
    }

    function getKioskDetails(){
        // getKiosk().then((result) => {
        //     if(Object.keys(result).length != 0){
        //         setKioskList(result);
        //     }
        // }).catch((error) => {
        //     console.log(error);
        // });
    }

    function filterTempKioskList(LocationID){

    }

    function onchangeLocationKiosk(e){
        if(e.target.value != '')
        {
            let tempArray = kioskList.filter((item)=>item.LocationID.toLowerCase().includes(e.target.value.toLowerCase()));
            setTempKioskList(tempArray);
        }
    }

    return  <>
            {/* <!-- Kiosk container --> */}
            <div className="dashboard-kiosk-list-container p-3 w-100 position-relative">

                <Loader 
                    display={loaderDisplayKiosk}
                />

                <div className="dashboard-kiosks-heading d-flex align-items-center pb-2">
                    <span>Kiosks</span>
                    <FontAwesomeIcon onClick={()=>{dashboardKioskChangeOrder()}} icon={dashboardKioskOrder ? faArrowUpWideShort : faArrowDownWideShort} className="ms-2 icon"/>
                </div>
                <div className="dashboard-kiosks-dropdown mb-3">
                    <select ref={dashboardLocationSelector} className="form-control kiosks-list" onChange={(e)=>{onchangeLocationKiosk(e)}}>
                        <option value='' selected>Choose location</option>
                        {
                            locationList.length != 0
                            &&
                            locationList.map((loc)=>{
                                return(
                                    <option key={loc.LocationID} value={loc.LocationID}>{loc.LocationName}</option>
                                )
                            })
                        }
                    </select>
                    <FontAwesomeIcon icon={faChevronDown} className="icon kiosks-list-dropdown"/>
                </div>
                <div className="dashboard-kiosks-search mb-2">
                    <input id="kiosks-search-input" className="form-control border-0" type="text" placeholder="Search here..." onKeyUp={(e)=>{searchDashboardKioskList(e)}}/>
                    <Search id="kiosks-list-search" className="icon"/>
                </div>
                <div className="dashboard-kiosks-list">
                {
                    tempKioskList.length != 0
                    ?
                    tempKioskList.map((kiosk,index)=>{
                        return(
                            <div key={index} onClick={()=>{setActiveKioskList(kiosk.KioskID)}} className={`single-kiosks-list-container ${ activekioskList == kiosk.KioskID && 'active' } d-flex py-2 px-3`}>
                                <div className="single-kiosks-content">
                                    <h6>{kiosk.KioskID}</h6>
                                    <span className={`single-kiosks-status ${ kiosk.Status != 'Offline' ? "positive" : "negative" }`}>{kiosk.Status}</span>
                                    <p>{index} mails in kiosk</p>
                                </div>
                            </div>
                        )
                    })
                    :
                    <div className="text-center p-4">No data found</div>
                }

                </div>
            </div>
          </>;
}

const DashboardKiosStatus=({KioskID})=>
{
    const [kisokStatus,setKioskStatus] = useState([]);
    const [kisokBox,setKioskBox] = useState([]);

    const [loaderDisplayKioskStatus,setLoaderDisplayKioskStatus] = useState('hide');

    useEffect(()=>{

        if(KioskID != '')
        {
            setLoaderDisplayKioskStatus('show');
            getKiosk(KioskID).then((data)=>{
                setKioskStatus(data?.[0] || []);
                setKioskBox(data?.[0]?.KioskBox || []);
                setLoaderDisplayKioskStatus('hide');
            }).catch((error)=>{
                console.log(error);
            });
        }else{
            setKioskStatus([]);
            setKioskBox([]);
        }

    },[KioskID]);

  return  <>
            {/* <!-- Kiosk status container --> */}
            <div className="dashboard-kiosk-status-container p-3 w-100 position-relative">

                <Loader 
                    display={loaderDisplayKioskStatus}
                />

                <div className="dashboard-kiosks-status-heading d-flex align-items-center pb-2">
                    <span>Kiosk Status</span>
                </div>

                <div className="dashboard-kiosk-status">
                    <div className="row">
                        {/* kisokBox.length != 13 && kisokBox.length != 19 ? `col-12` : 'col-6' */}
                        <div className='col-6'>
                            <div className="row">

                                <div className="col-12">
                                    <div className={`box-0 box-card`}>
                                        {/* <div className="box-heading">
                                            1
                                        </div>
                                        <div className="box-content">
                                            <span>IN12345678</span>
                                            <span>IN2345678989</span>
                                            <span>OUT12345678</span>
                                        </div> */}
                                    </div>
                                </div>
                                
                                <div className="col-6 pr-0">
                                    <div className="box-col-one-container d-flex flex-column">
                                        <div className={`box-1 box status-${ kisokBox?.[0]?.['Enable'] ? (kisokBox[1]['Enable'] == "Yes" ? "enabled" : "disabled") : "" }`}>
                                            <div className="box-heading">
                                                1
                                            </div>
                                            <div className="box-content">
                                                <span>{ kisokBox?.[0]?.['CPNo'] }</span>
                                                {/* <span>IN2345678989</span> */}
                                                {/* <span>OUT12345678</span> */}
                                            </div>
                                        </div>
                                        <div className={`box-2 box status-${ kisokBox?.[1]?.['Enable'] ? (kisokBox[2]['Enable'] == "Yes" ? "enabled" : "disabled") : "" }`}>
                                            <div className="box-heading">
                                                2
                                            </div>
                                            <div className="box-content">
                                                <span>{ kisokBox?.[1]?.['CPNo'] }</span>
                                            </div>
                                        </div>
                                        <div className={`box-3 box status-${ kisokBox?.[2]?.['Enable'] ? (kisokBox[3]['Enable'] == "Yes" ? "enabled" : "disabled") : "" }`}>
                                            <div className="box-heading">
                                                3
                                            </div>
                                            <div className="box-content">
                                                <span>{ kisokBox?.[2]?.['CPNo'] }</span>
                                                {/* <span>IN2345678989</span> */}
                                                {/* <span>OUT12345678</span> */}
                                            </div>
                                        </div>
                                        <div className={`box-4 box status-${ kisokBox?.[3]?.['Enable'] ? (kisokBox[4]['Enable'] == "Yes" ? "enabled" : "disabled") : "" }`}>
                                            <div className="box-heading">
                                                4
                                            </div>
                                            <div className="box-content">
                                                <span>{ kisokBox?.[3]?.['CPNo'] }</span>
                                                {/* <span>IN2345678989</span> */}
                                                {/* <span>OUT12345678</span> */}
                                            </div>
                                        </div>
                                        <div className={`box-5 box status-${ kisokBox?.[4]?.['Enable'] ? (kisokBox[5]['Enable'] == "Yes" ? "enabled" : "disabled") : "" }`}>
                                            <div className="box-heading">
                                                5
                                            </div>
                                            <div className="box-content">
                                                <span>{ kisokBox?.[4]?.['CPNo'] }</span>
                                            </div>
                                        </div>
                                        <div className={`box-6 box status-${ kisokBox?.[5]?.['Enable'] ? (kisokBox[5]['Enable'] == "Yes" ? "enabled" : "disabled") : "" }`}>
                                            <div className="box-heading">
                                                6
                                            </div>
                                            <div className="box-content">
                                                <span>{ kisokBox?.[5]?.['CPNo'] }</span>
                                            </div>
                                        </div>
                                        <div className="box-0 no-storage">
                                            {/* <span>Fixed panel</span>
                                            <span>(No Storage)</span> */}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div className="box-col-two-container d-flex flex-column">
                                        <div className="peripheral-device">
                                            <div>PC,Scanner<br/>Printer</div>
                                        </div>
                                        <div className={`box-8 box status-${ kisokBox?.[6]?.['Enable'] ? (kisokBox[6]['Enable'] == "Yes" ? "enabled" : "disabled") : "" }`}>
                                            <div className="box-heading">
                                                7
                                            </div>
                                            <div className="box-content">
                                                <span>{ kisokBox?.[6]?.['CPNo'] }</span>
                                            </div>
                                        </div>
                                        <div className="mail-drop">
                                            <span>Mail Drop</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {
                            kisokBox.length == 13 || kisokBox.length == 19 ? <FirstSlave kisokBox={kisokBox}/> : <></>
                        }
                        {
                            kisokBox.length == 19 ? <SecondSlave kisokBox={kisokBox}/> : <></>
                        }
                        {/* <!-- <div className="col-1"></div> --> */}
                    </div>
                </div>

                <div className="dashboard-kiosk-status-code-container">
                    <div className="dashboard-kiosk-status-code d-flex align-items-center">

                        {/* <div className="kiosk-status-color status-occupied"></div>
                        <div className="kiosk-status-text">Occupied</div> */}

                        <div className="kiosk-status-color status-empty"></div>
                        <div className="kiosk-status-text">Enabled</div>

                        {/* <div className="kiosk-status-color status-door-open"></div>
                        <div className="kiosk-status-text">Door Open</div>

                        <div className="kiosk-status-color status-door-closed"></div>
                        <div className="kiosk-status-text">Door Closed</div>

                        <div className="kiosk-status-color status-ups"></div>
                        <div className="kiosk-status-text">Running On UPS</div> */}

                        <div className="kiosk-status-color status-offline"></div>
                        <div className="kiosk-status-text">Disabled</div>
                    </div>
                </div>
            </div>
          </>;
}

export { DashboardTopbar, DashboardCustomer, DashboardKios, DashboardKiosStatus};