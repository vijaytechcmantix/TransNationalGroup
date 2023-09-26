import { BaseUrl } from "./url"; 

// const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InBldGVyd29uZyIsImlhdCI6MTY3OTI4OTQ5OCwiZXhwIjoxNjc5Mzc1ODk4fQ.L3D285zNVondiIOg-SVhQiQNLTsDrowAq7vmuBCeuzs';

// const requestHeader = {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Headers': '*',
//     'Authorization':"BEARER "+ JWT
// }

const requestHeader = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
}

/*Handle 404 and 500 response with double promise*/
// if(response?.status != 404 && response?.status != 500){
//     return response.json().then((result) =>{
//         return result;
//     });
// }else{
//     return [];
// }

/*****************************************************[Login Module]*/
export function userLogin({userName, password}){ 
    var loginHeader = new Headers();
    loginHeader.append('Authorization',`Basic ${ btoa(`${userName}:${password}`) }`);
    return fetch(BaseUrl+'/login',{
        method: 'POST',
        headers : loginHeader
    })
    .then((response) => {  
        if(response?.status != 404 && response?.status != 500){
            return response.json().then(result => {
                return result
            });
        }else{
            return [];
        }
    }) 
    .catch((err) => {
        return err;
    });
}

export function forgetPassword(){ 
    return fetch(BaseUrl+'/forgot',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"username":"<username>"})
    })
    .then((response) => {  
        return {"status":200};
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

export function resetPassword(){ 
    return fetch(BaseUrl+'/resetpassword',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"password":"<password>"})
    })
    .then((response) => {   
        return {"status":200};
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

/*****************************************************[User Type Module]*/
export function getUserType(CompanyID){ 
    return fetch(BaseUrl+'/get',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query": "UserTypeGet '"+ CompanyID +"'"})
    })
    .then((response) => {   
        if(response?.status != 404 && response?.status != 500){
            return response.json();
        }else{
            return [];
        }
    }) 
    .catch((err) => {
        return err;
    });
}

export function getUserPCCode(CompanyID){
    return fetch(BaseUrl+'/get',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query": "CPCodeGet '"+ CompanyID +"'"})
    })
    .then((response) => {   
        if(response?.status != 404 && response?.status != 500){
            return response.json().then(result => {
                return result
            });
        }else{
            return [];
        }
    }) 
    .catch((err) => {
        return err;
    });
}

export function getUserMailbagCPCode(CompanyID){
    return fetch(BaseUrl+'/get',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query": "MailbagCPCodeGet '"+ CompanyID +"'"})
    })
    .then((response) => {   
        if(response?.status != 404 && response?.status != 500){
            return response.json();
        }else{
            return [];
        }
    }) 
    .catch((err) => {
        return err;
    });
}

export function getUserOutgoingLocationID(CompanyID){
    return fetch(BaseUrl+'/get',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query": "OutgoingLocationIDGet '"+ CompanyID +"'"})
    })
    .then((response) => {   
        if(response?.status != 404 && response?.status != 500){
            return response.json();
        }else{
            return [];
        }
    }) 
    .catch((err) => {
        return err;
    });
}
/*****************************************************[User Module]*/
export function getAllUser(){ 
    return fetch(BaseUrl+'/get',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query":"UserGet '',''"})
    })
    .then((response) => { 
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

export function getUser({customerID}){ 
    return fetch(BaseUrl+'/get',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query":"UserGet '"+ customerID +"',''"})
    })
    .then((response) => { 
        if(response?.status != 404 && response?.status != 500){
            return response.json();
        }else{
            return [];
        }
    }) 
    .catch((err) => {
        return err;
    });
}

export function updateUserInformation(){ 
    return fetch(BaseUrl+'/put/user',{
        method: 'PUT',
        headers : requestHeader,
        body: JSON.stringify({"query": "UserUpdate <UserID>,'<UserName>','<Company>', '<UserGroup>', '<Email>', <UserID>"})
    })
    .then((response) => {   
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

export function deleteUserInformation(){ 
    return fetch(BaseUrl+'/post',{
        method: 'DELETE',
        headers : requestHeader,
        body: JSON.stringify({"query": "<UserID>,'<UserName>'"})
    })
    .then((response) => {   
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

/*****************************************************[Feature Type Module]*/
export function getFeatureType(){ 
    return fetch(BaseUrl+'/get',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query": "FeatureTypeGet"})
    })
    .then((response) => {   
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

/*****************************************************[Feature Module]*/
export function getAllFeatures(){ 
    return fetch(BaseUrl+'/get',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query": "FeatureGet ''"})
    })
    .then((response) => {   
        if(response?.status != 404 && response?.status != 500){
            return response.json();
        }else{
            return [];
        }
    }) 
    .catch((err) => {
        return err;
    });
}

/*****************************************************[Access Rights Module]*/
export function getAllAccessRights(){ 
    return fetch(BaseUrl+'/get',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query": "AccessRightGet"})
    })
    .then((response) => {   
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

export function updateFeatureAccessRightsUpdate({ GroupID, FeatureID, AccessRightID, UserID }){ 

    return fetch(BaseUrl+'/post',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query":"GroupFeatureAccessRightUpdate '"+ GroupID +"','"+ FeatureID +"', '"+ AccessRightID +"', '"+ UserID +"'"})
    })
    .then((response) => {   
        return response;
    }) 
    .catch((err) => {
        return err;
    });
}

/*****************************************************[User Group Module]*/
export function getAllUserGroup(){ 
    return fetch(BaseUrl+'/get',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query": "UserGroupGet 'DBS'"})
    })
    .then((response) => {   
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

export function getAllUserGroupFeaturesAccessRights(){ 
    return fetch(BaseUrl+'/get',{
        method: 'GET',
        headers : requestHeader,
        body: JSON.stringify({"query": "UserGroupFeatureGet 'DBS'"})
    })
    .then((response) => {   
        return {"status":200,"data":[{"ID":1,"UserGroup":"DBS-Admin","Description":"Administrator (DBS)"}]};
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

export function addUserGroup(){ 
    return fetch(BaseUrl+'/post',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query": "UserGroupAdd '<CompanyID>','<UserGroupID>','<Description>', <UserID>"})
    })
    .then((response) => {   
        return {"status":200,"data":{"LastInsertID": 10}};
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

export function updateUserGroup(){ 
    return fetch(BaseUrl+'/post',{
        method: 'PUT',
        headers : requestHeader,
        body: JSON.stringify({"query": "UserGroupUpdate '<UserGroupID>','[{'AccessTo Web':'View Access'}]', <UserID>"})
    })
    .then((response) => {   
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

export function deleteUserGroup(){ 
    return fetch(BaseUrl+'/post',{
        method: 'DELETE',
        headers : requestHeader,
        body: JSON.stringify({"query": "UserGroupDelete <ID>, <UserID>"})
    })
    .then((response) => {
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

/*****************************************************[Group Module]*/
export function getAllGroup(){ 
    return fetch(BaseUrl+'/get',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query": "GroupGet"})
    })
    .then((response) => {   
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

export function getAllGroupID(){ 
    return fetch(BaseUrl+'/get',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query": "GroupIDGet"})
    })
    .then((response) => {  
        if(response?.status != 404 && response?.status != 500){

            // response.text().then((data) => {
            //     console.log(data);
            // });

            return response.json();

        }else{
            return [];
        }
    }) 
    .catch((err) => {
        return err;
    });
}

export function getGroupFeature(GroupID){ 
    // console.log('GroupID : '+GroupID);
    return fetch(BaseUrl+'/get',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query":"GroupFeatureGet '"+ GroupID +"'"})
    })
    .then((response) => {   
        if(response?.status != 404 && response?.status != 500){
            return response.json().then((result) =>{
                return result;
            });
        }else{
            return [];
        }
    }) 
    .catch((err) => {
        return err;
    });
}

export function addGroup({ GroupID, GroupName, UserID }){ 
    return fetch(BaseUrl+'/post',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query":"GroupAdd '"+ GroupID +"','"+ GroupName +"','"+ UserID +"'"})
    })
    .then((response) => {   
        return response;
    }) 
    .catch((err) => {
        return err;
    });
}

export function updateGroup({ GroupID, GroupName, UserID }){ 
    return fetch(BaseUrl+'/post',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query":"GroupModify '"+ GroupID +"','"+ GroupName +"', '"+ UserID +"'"})
    })
    .then((response) => {   
        return response;
    }) 
    .catch((err) => {
        return err;
    });
}

export function deleteGroup({ GroupID, UserID }){ 
    return fetch(BaseUrl+'/post',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query":"GroupDelete '"+ GroupID +"', '"+ UserID +"'"})
    })
    .then((response) => {   
        return response;
    }) 
    .catch((err) => {
        return err;
    });
}

/*****************************************************[Company Module]*/
export function getAllCompany(){
    requestHeader['Authorization'] = `BEARER ${ atob(localStorage.getItem("accessToken") != null ? localStorage.getItem("accessToken") : '') }`;
    return fetch(BaseUrl+'/get',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query":"CompanyGet ''"})
    })
    .then((response) => {
        if(response?.status == 403){
            return response.status 
        }
        else if(response?.status != 404 && response?.status != 500){
            return response.json().then(result => {
                return result
            });
        }else{
            return [];
        }
    }) 
    .catch((err) => {
        return err;
    });
}

export function getParticularCompany({companyID}){
    return fetch(BaseUrl+'/get',{
        method: 'GET',
        headers : requestHeader,
        body: JSON.stringify({"query":"CompanyGet '"+companyID+"'"})
    })
    .then((response) => {
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

export function addCompany({CompanyID, CompanyName, UserID}){
    return fetch(BaseUrl+'/post',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query":"CompanyAdd '"+CompanyID+"','"+CompanyName+"','"+UserID+"'"})
    })
    .then((response) => {
        return response;
    }) 
    .catch((err) => {
        return err;
    });
}

export function updateCompany({CompanyID,newCompanyName,UserID}){ 
    return fetch(BaseUrl+'/post',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query": "CompanyModify '"+ CompanyID +"','"+ newCompanyName +"','"+ UserID +"'"})
    })
    .then((response) => {
        return response;
    }) 
    .catch((err) => {
        return err;
    });
}

export function deleteCompany({CompanyID,user}){
    return fetch(BaseUrl+'/post',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query": "CompanyDelete '"+ CompanyID +"', '"+ user +"'"})
    })
    .then((response) => {
        return response;
    }) 
    .catch((err) => {
        return err;
    });
}

/*****************************************************[Location Module]*/
export function getLocationInformation(companyID){ 
    if(companyID != ''){
        return fetch(BaseUrl+'/get',{
            method: 'POST',
            headers : requestHeader,
            body: JSON.stringify({"query":"LocationGet '"+ companyID +"'"})
        })
        .then((response) => {
            if(response?.status != 404 && response?.status != 500){
                return response.json();
            }else{
                return [];
            }
        }) 
        .catch((err) => {
            return err;
        });
    }
}

export function addLocationInformation({CompanyID, LocationID, LocationName, UserID}){ 
    return fetch(BaseUrl+'/post',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query": "LocationAdd '"+LocationID+"','"+LocationName+"','"+CompanyID+"','"+UserID+"'"})
    })
    .then((response) => {
        return response;
    }) 
    .catch((err) => {
        return err;
    });
}

export function updateLocationInformation({LocationID,NewLocationName,CompanyID,UserID,kioskStatus}){ 
    return fetch(BaseUrl+'/post',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query": "LocationModify '"+LocationID+"','"+NewLocationName+"','"+ kioskStatus +"','"+UserID+"'"})
    })
    .then((response) => {
        return response;
    }) 
    .catch((err) => {
        return err;
    });
}

export function deleteLocationInformation({LocationID,UserID}){ 
    return fetch(BaseUrl+'/post',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query": "LocationDelete '"+ LocationID +"','"+UserID+"'"})
    })
    .then((response) => {
        return response;
    }) 
    .catch((err) => {
        return err;
    });
}

/*****************************************************[Department Module]*/
export function getAllDepartment(){ 
    return fetch(BaseUrl+'/get',{
        method: 'GET',
        headers : requestHeader,
        body: JSON.stringify({"query": "DepartmentGet '<companyID>'"})
    })
    .then((response) => {
        return {"status":200};
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

/*****************************************************[Kiosk Module]*/
export function getKioskConfigurationGet(){ 
    return fetch(BaseUrl+'/get',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query":"KioskConfigurationGet"})
    })
    .then((response) => {
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

export function getKiosk(kioskID){
    requestHeader['Authorization'] = `BEARER ${ atob(localStorage.getItem("accessToken") != null ? localStorage.getItem("accessToken") : '') }`;
    // console.log(requestHeader);
    return fetch(BaseUrl+'/get',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query":"KioskGet '"+ kioskID +"'"})
    })
    .then((response) => {
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

export function getKioskList(CompanyID){ 
    if(CompanyID != ''){
        return fetch(BaseUrl+'/get',{
            method: 'POST',
            headers : requestHeader,
            body: JSON.stringify({"query":"KioskListGet '"+ CompanyID +"'"})
        })
        .then((response) => {
            if(response?.status != 404 && response?.status != 500){
                return response.json();
            }else{
                return [];
            }
        }) 
        .catch((err) => {
            return err;
        });
    }
}

export function getKioskOfflineTotal({companyID}){ 
    requestHeader['Authorization'] = `BEARER ${ atob(localStorage.getItem("accessToken") != null ? localStorage.getItem("accessToken") : '') }`;
    return fetch(BaseUrl+'/get',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query" : "KioskOfflineTotalGet '"+ companyID +"'"})
    })
    .then((response) => {
        if(response?.status != 404 && response?.status != 500){
            return response.json();
        }else{
            return [];
        }
    }) 
    .catch((err) => {
        return err;
    });
}

export function getKioskStickerLowTotal({companyID}){ 
    return fetch(BaseUrl+'/get',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query":"KioskStickerLowTotalGet '"+ companyID +"'"})
    })
    .then((response) => {
        if(response?.status != 404 && response?.status != 500){
            return response.json();
        }else{
            return [];
        }
    }) 
    .catch((err) => {
        return err;
    });
}

export function getKioskUPSActivatedTotal({companyID}){ 
    requestHeader['Authorization'] = `BEARER ${ atob(localStorage.getItem("accessToken") != null ? localStorage.getItem("accessToken") : '') }`;
    return fetch(BaseUrl+'/get',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query":"KioskUPSActivatedTotalGet '"+ companyID +"'"})
    })
    .then((response) => {
        if(response?.status != 404 && response?.status != 500){
            return response.json();
        }else{
            return [];
        }
    }) 
    .catch((err) => {
        return err;
    });
}

// export function addUpdateKioskInformation({KioskNumber,DeviceNumber,LocationID,Password,ConfigurationID,boxCount,UserID}){ 
//     return fetch(BaseUrl+'/post',{
//         method: 'POST',
//         headers : requestHeader,
//         body: JSON.stringify({"query": "KioskAdd '"+KioskNumber+"','"+LocationID+"','"+Password+"','"+ConfigurationID+"','"+boxCount+"','"+UserID+"'"})
//     })
//     .then((response) => {
//         return response;
//     }) 
//     .catch((err) => {
//         return err;
//     });
// }

export function addKioskInformation({KioskNumber,DeviceNumber,LocationID,Password,ConfigurationID,boxCount,UserID}){ 
    return fetch(BaseUrl+'/post',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query": "KioskAdd '"+KioskNumber+"','"+LocationID+"','"+Password+"','"+ConfigurationID+"','"+boxCount+"','"+UserID+"'"})
    })
    .then((response) => {
        return response;
    }) 
    .catch((err) => {
        return err;
    });
}

export function UpdateKioskInformation({KioskNumber,DeviceNumber,LocationID,Password,ConfigurationID,boxCount,UserID}){ 
    return fetch(BaseUrl+'/post',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query": `KioskModify '${ KioskNumber }','','${ boxCount }','${ UserID }'`})
    })
    .then((response) => {
        return response;
    }) 
    .catch((err) => {
        return err;
    });
}

export function deleteKiosk({ KioskID, UserID}){
    return fetch(BaseUrl+'/post',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query": "KioskDelete '"+KioskID+"','"+UserID+"'"})
    })
    .then((response) => {
        return response;
    }) 
    .catch((err) => {
        return err;
    });
}

export function getLockerCellType(){ 
    return fetch(BaseUrl+'/post',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query":"LockerCellTypeGet <LockerCellTypeID>"})
    })
    .then((response) => {
        return {"status":200,"data":[{"LockerCellTypeID":1,"LockerCellType":"Type A","Length":2,"Width":4,"Height":3}]};
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

export function addLockerCellType(){ 
    return fetch(BaseUrl+'/post',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query":"LockerCellTypePost '<LockerCellType>', <Length>, <Width>, <Height>"})
    })
    .then((response) => {
        return {"LastInsertID":5};
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

export function addLockerCellTypeForSingleCustomer(){ 
    return fetch(BaseUrl+'/post',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query":"LockerPost '<LockerName>','"})
    })
    .then((response) => {
        return {"LastInsertID":5};
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

/*****************************************************[Faults Module]*/
export function getKioskBoxFaults(){ 
    return fetch(BaseUrl+'/post',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query":"KioskBoxFaultGet"})
    })
    .then((response) => {
        return {"status":200,"data":[{"FaultID":"Door Dented"},{"FaultID":"Hindge Broken"},{"FaultID":"None"},{"FaultID":"Unable to Open/Close"}]};
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

export function addKioskBoxFaults(){ 
    return fetch(BaseUrl+'/post',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query":"LockerFaultInsert '<fault>'"})
    })
    .then((response) => {
        return {"status":200,"data":[{"FaultID":"Lock Broken"}]};
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

export function updateKioskBoxFaults(){ 
    return fetch(BaseUrl+'/post',{
        method: 'PUT',
        headers : requestHeader,
        body: JSON.stringify({"query":"KioskBoxFaultUpdate <FaultID>,'<NewFault>'"})
    })
    .then((response) => {
        return {"status":200};
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

export function deleteKioskBoxFaults(){ 
    return fetch(BaseUrl+'/post',{
        method: 'DELETE',
        headers : requestHeader,
        body: JSON.stringify({"query":"KioskBoxFaultDelete <FaultID>"})
    })
    .then((response) => {
        return {"status":200};
        return response.json();
    }) 
    .catch((err) => {
        return err;
    });
}

/***************************************************************[PC CODE]*/
export function getCPCodeGet(customerID){ 
    return fetch(BaseUrl+'/get',{
        method: 'POST',
        headers : requestHeader,
        body: JSON.stringify({"query":"CPCodeGet '"+ customerID +"'"})
        // body: JSON.stringify({"query":"PCCodeGet '"+ customerID +"'"})
    })
    .then((response) => {
        if(response?.status != 404 && response?.status != 500){
            return response.json();
        }else{
            return [];
        }
    }) 
    .catch((err) => {
        return err;
    });
}
