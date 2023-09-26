import { Navigate } from "react-router-dom";

const ProtectedRout = ({ isLoggedIn, children, UserRole }) => {
    return(isLoggedIn ? children : <Navigate to="/" replace />);
};
export default ProtectedRout;

// # TODO : Get all feature id here and validate
// import React from "react";
// import { Redirect, Route } from "react-router-dom";
// import { connect } from 'react-redux';
// function ProtectedRoute({ component: Component, ...restOfProps }) {
//   return (
//     <Route
//       {...restOfProps}
//       render={(props) =>
//         restOfProps.users.loggedin ==="yes" && restOfProps.users.data.UserRole==="Admin Staff" ? 
//           <Component {...props} /> 
//         : restOfProps.users.data.UserRole==="Student" || restOfProps.users.data.UserRole==="Normal Staff" 
//           || restOfProps.users.data.UserRole==="Approving Officer" || restOfProps.users.data.UserRole==="Manager" ?
//           <Redirect to="/loan-equipment" />
//         :
//           <Redirect to="/" />
//       }
//     />
//   );
// }
// const mapStateToProps  = (state) => ({users:state.users})
// export default connect(mapStateToProps)(ProtectedRoute);