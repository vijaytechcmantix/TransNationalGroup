import React, { useState, useEffect} from "react";
import { Link, useLocation  } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DoorSlidingIcon from '@mui/icons-material/DoorSliding';
import PersonIcon from '@mui/icons-material/Person';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SettingsIcon from '@mui/icons-material/Settings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';


const Sidebar = () =>{

    const location = useLocation(); // once ready it returns the 'window.location' object
    const [url, setUrl] = useState(null);
    
    useEffect(() => {
        setUrl(location.pathname);
    }, [location]);

    var i=0;
    function toggleSidebar()
    {
        
        let toggleSidebarElement = document.getElementsByClassName('toggle-sidebar')[0];
        let sidemenuContainerElement = document.getElementsByClassName('sidemenu-container')[0];
        let sidemenuListElement = document.getElementsByClassName('sidemenu-list')[0];
        let sidemenuTextElement = document.getElementsByClassName('sidemenu-text');
        if(i == 0)
        {
            sidemenuContainerElement.style.width = '60px';
            sidemenuListElement.style.width = '60px';
            toggleSidebarElement.style.left = '13px';
            toggleSidebarElement.style.transform = 'rotate(-180deg)';
            for(let j=0;j<sidemenuTextElement.length;j++)
            {
                sidemenuTextElement[j].style.display = 'none';
            }
            i++;
        }else{
            sidemenuContainerElement.style.width = '200px';
            sidemenuListElement.style.width = '200px';
            toggleSidebarElement.style.left = '80px';
            toggleSidebarElement.style.transform = '';
            for(let j=0;j<sidemenuTextElement.length;j++)
            {
                sidemenuTextElement[j].style.display = 'block';
            }
            i = 0;
        }
    }

    return (
        <>
    {/* <!-- Side Menu --> */}
    <section className="sidemenu-container">
    <ul className="sidemenu-list">
        <Link to='/dashboard' className="link-tag">     <li className={url === "/dashboard" ?" active" : ""}> <DashboardIcon className="menu-icon"/>                    <span className="sidemenu-text">Dashboard</span> </li></Link>
        <Link to='/customer' className="link-tag">      <li className={url === "/customer" ?" active" : ""}> <ApartmentIcon className="menu-icon"/>                     <span className="sidemenu-text">Customer</span></li></Link>
        <Link to='/location' className="link-tag">      <li className={url === "/location" ?" active" : ""}> <LocationOnIcon className="menu-icon"/>                    <span className="sidemenu-text">Location</span></li></Link>
        <Link to='/kiosk' className="link-tag">         <li className={url === "/kiosk" ?" active" : ""}> <DoorSlidingIcon className="menu-icon"/>                      <span className="sidemenu-text">Kiosk</span></li></Link>
        {/* <Link to='/cpmanagement' className="link-tag">  <li className={url === "/cpmanagement" ?" active" : ""}> <AssignmentIcon className="menu-icon"/>                <span className="sidemenu-text">CP Management</span></li></Link> */}
        <Link to='/user' className="link-tag">          <li className={url === "/user" ?" active" : ""}> <PersonIcon className="menu-icon"/>                            <span className="sidemenu-text">User</span></li></Link>
        <Link to='/rolefeature' className="link-tag">   <li className={url === "/rolefeature" ?" active" : ""}> <LocalOfferIcon className="menu-icon"/>                 <span className="sidemenu-text">Role & Feature</span></li></Link>
        <Link to='/settings' className="link-tag">      <li className={url === "/settings" ?" active" : ""}> <SettingsIcon className="menu-icon"/>                      <span className="sidemenu-text">Settings</span></li></Link>
    </ul>

    <div className="toggle-sidebar-container">
        <div className="toggle-sidebar" onClick={toggleSidebar}>
            <KeyboardDoubleArrowRightIcon className="toggle-icon"/>
        </div>
    </div>
</section>
</>)
                
                
            
}

export default Sidebar;