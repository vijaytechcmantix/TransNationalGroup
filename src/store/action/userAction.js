export const setUserDetails = ({ user,isLogin }) =>{
    return {
        type : 'SET_USER_DETAILS',
        user,
        isLogin
    }
}
