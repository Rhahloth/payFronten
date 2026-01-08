
export function authHeader() {
    const token = sessionStorage.getItem("token");
        return  `Bearer ${token}` ;
}  

export const getRole = () => {
    return sessionStorage.getItem("role"); // "admin", "agent", etc.
};

export const isAuthenticated = () =>{
    return !!sessionStorage.getItem("token");
}


 // // use it
    // const res = await axios.get("http://localhost:8000/protected", {
    //      headers: authHeader(),
    // });