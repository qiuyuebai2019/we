import commonUtil from "./common"
const userInfo={
    setJwt(jwt){
        if (!commonUtil.isStrIsNull(jwt)){
            localStorage.setItem("jwt",jwt)
        }
    },
    getJwt(){
        return localStorage.getItem("jwt")
    },
    clearJwt(){
        localStorage.removeItem("jwt")
    }
}
export default userInfo;
