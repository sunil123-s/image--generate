import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext()

const AppContextProvider = ({children}) => {
   const [user, setuser] = useState(null)
   const [showLogin, setshowLogin] = useState(false)
   const [credit, setcredit] = useState(false)
   
   const backendUrl = import.meta.env.VITE_BACKEND_URL

   const navigate = useNavigate() 

   useEffect(() => {
     const userInfo = localStorage.getItem("userdata")
     if(userInfo){
      setuser(JSON.parse(userInfo))
     }
   }, [])


   const loadCreditBalance = async() => {
    try {
      const res = await axios.get(`${backendUrl}/api/user/credit`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      });
      if(res.data.success){
        setcredit(res.data?.data?.credit)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message);
    }
   }

   useEffect(() => {
     if(user?.token){
      loadCreditBalance()
     }
   }, [user?.token])
   
  const logout = () => {
    localStorage.removeItem("userdata")
    setuser(null)
    toast.success("Logout successfully")
  }

  const generateImage = async (prompt) => {
    if (!user?.token) {
      toast.error("User not authenticated.");
      return;
    }
     
    try {
      const res = await axios.post(
        `${backendUrl}/api/image/generate-image`,
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (res.data.success) {
        loadCreditBalance();
        return res.data.resultImage;
      } else {
        loadCreditBalance();
        if (res.data.creditBalance === 0) {
          navigate("/buy");
          toast.error("No Credit Balacne");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
   

   return (
     <AppContext.Provider
       value={{
         user,
         setuser,
         showLogin,
         setshowLogin,
         backendUrl,
         credit,
         setcredit,
         logout,
         loadCreditBalance,
         generateImage,
       }}
     >
       {children}
     </AppContext.Provider>
   );
}

export default AppContextProvider