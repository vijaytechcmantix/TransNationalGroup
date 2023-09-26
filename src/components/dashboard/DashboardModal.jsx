import { useEffect, useState} from "react";
import Modal from 'react-bootstrap/Modal';

// FontAwesomeIcon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpWideShort,faArrowDownWideShort,faChevronRight,faPencil,faTrash,faPlus } from "@fortawesome/free-solid-svg-icons";

// Notification 
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager} from 'react-notifications';
// Alert 
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useAsyncError } from "react-router-dom";
import { useMemo } from "react";

export default function DashboardModal({ title, showPopup, tableData, tableHeading, changeModalShow }){
    const [ showModal, setshowModal ] = useState(false);

    useEffect(()=>{
        setshowModal(showPopup);
    },[showPopup])

    const handleClose = (e) => {
        setshowModal(false);
        changeModalShow({
            title: '',
            show : false
        });
    }
    return (<>
        <Modal 
            show={showModal} 
            onHide={handleClose}
            centered
            size='lg'
        >
            <div className="modal-header p-3" style={{ backgroundColor : '#f2f2f2' }}>
                <h4 className="modal-title">{ title }</h4>
                <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body p-3" style={{ backgroundColor : '#f2f2f2' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            {
                                tableHeading.map((heading)=>{
                                    return <td>{heading.lable}</td>
                                })
                            }
                        </tr>
                    </thead>
                    <tbody className="dataTableBody">
                        {   
                            tableData.length != 0
                            ?
                            tableData.map((data,index)=>{
                                    return(<tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{data.userName}</td>
                                        {/* <td>
                                            <FontAwesomeIcon 
                                                onClick={()=>{}} 
                                                icon={faPencil} 
                                                className="pe-3 icon"
                                            />
                                            <FontAwesomeIcon 
                                                onClick={()=>{}}
                                                icon={faTrash}
                                                className="icon fa-trash"
                                            />
                                        </td> */}
                                    </tr>)
                            })
                            :
                            <tr><td colspan={tableHeading.length} style={{textAlign:'center',padding:'1rem'}}>No Data Found!</td></tr>
                        }
                    </tbody>
                </table>
            </div>
            <div className="modal-footer p-3" style={{ backgroundColor : '#f2f2f2' }}></div>
        </Modal>

        <NotificationContainer/>
    </>);
}