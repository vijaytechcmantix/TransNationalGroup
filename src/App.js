import './App.css';
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.min.js';
import loadable from '@loadable/component';

import ProtectedRout from './services/helper/ProtectedRout';
import { useSelector } from 'react-redux';

const Login = loadable(() => import('./pages/Login'));
const Dashboard = loadable(() => import('./pages/Dashboard'));
const Customer = loadable(() => import('./pages/Customer'));
const Location = loadable(() => import('./pages/Location'));
const Kiosk = loadable(() => import('./pages/Kiosk'));
const Cpmanagement = loadable(() => import('./pages/Cpmanagement'));
const User = loadable(() => import('./pages/User'));
const RoleFeature = loadable(() => import('./pages/RoleFeature'));
const Settings = loadable(() => import('./pages/Settings'));

function App() {

  const user = useSelector(state => state.users);
  const [isLoggedIn,setIsLoggedIn] = useState(false);


  useEffect(()=>{
    // console.log(user);
    user.loggedin === 'yes' ? setIsLoggedIn(true) : setIsLoggedIn(false);
  },[user]);

  return (
    <div>
        {/* <BrowserRouter> */}
          <HashRouter>
            <Routes>
              <Route exact path="/"             element={<Login/>} />
              <Route exact path="/dashboard"    element={<ProtectedRout isLoggedIn={isLoggedIn} UserRole={user?.userDetails?.userRole || ''} ><Dashboard/></ProtectedRout>} />
              <Route exact path="/customer"     element={<ProtectedRout isLoggedIn={isLoggedIn} UserRole={user?.userDetails?.userRole || ''}><Customer/></ProtectedRout>} />
              <Route exact path="/location"     element={<ProtectedRout isLoggedIn={isLoggedIn} UserRole={user?.userDetails?.userRole || ''}><Location/></ProtectedRout>} />
              <Route exact path="/kiosk"        element={<ProtectedRout isLoggedIn={isLoggedIn} UserRole={user?.userDetails?.userRole || ''}><Kiosk/></ProtectedRout>} />
              {/* <Route exact path="/cpmanagement" element={<ProtectedRout isLoggedIn={isLoggedIn} UserRole={user?.userDetails?.userRole || ''}><Cpmanagement/></ProtectedRout>} /> */}
              <Route exact path="/user"         element={<ProtectedRout isLoggedIn={isLoggedIn} UserRole={user?.userDetails?.userRole || ''}><User/></ProtectedRout>} />
              <Route exact path="/rolefeature"  element={<ProtectedRout isLoggedIn={isLoggedIn} UserRole={user?.userDetails?.userRole || ''}><RoleFeature/></ProtectedRout>} />
              <Route exact path="/settings"     element={<ProtectedRout isLoggedIn={isLoggedIn} UserRole={user?.userDetails?.userRole || ''}><Settings/></ProtectedRout>} />
              {/* <Route exact path="/dashboard"     element={<Dashboard/>} />
              <Route exact path="/customer"     element={<Customer/>}/>
              <Route exact path="/location"     element={<Location/>}/>
              <Route exact path="/Kiosk"     element={<Kiosk/>} />
              <Route exact path="/cpmanagement"     element={<Cpmanagement/>} />
              <Route exact path="/User"     element={<User/>}/>
              <Route exact path="/rolefeature"     element={<RoleFeature/>} />
              <Route exact path="/Settings"     element={<Settings/>}/> */}
            </Routes>
          </HashRouter>
        {/* </BrowserRouter> */}
    </div>
  );
}

export default App;
