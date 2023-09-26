const inetialState = {
    loggedin : localStorage.getItem('UserID') != null ? 'yes' : 'no',
    userDetails : {
        UserID : localStorage.getItem('UserID') != null ? atob(localStorage.getItem('UserID')) : '',
        accessToken : localStorage.getItem('accessToken') != null ? atob(localStorage.getItem('accessToken')) : '',
        features : localStorage.getItem('features') != null ? JSON.parse(atob(localStorage.getItem('features'))) : '',
        isLogin : localStorage.getItem('UserID') != null ? 'yes' : 'no',
        UserRole : localStorage.getItem('UserRole') != null ? atob(localStorage.getItem('UserRole')) : ''
    } 
}

export default function(state = inetialState,action){
    switch(action.type){
        case 'SET_USER_DETAILS': return{
            loggedin : action.isLogin,
            userDetails : action.user
        }
        default: return state
    }
}