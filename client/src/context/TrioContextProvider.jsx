import { createContext, useState,useEffect } from "react"
import axios from 'axios'
import { jwtDecode } from "jwt-decode"

export const TrioContext = createContext()

export const TrioContextProvider = ({children}) => {

  const [user,setUser] = useState()
  const [token,setToken] = useState();
  const [sports, setSports] = useState([]);

  useEffect(()=>{
    const tokenLocal = localStorage.getItem("token")
    if(tokenLocal){
      const {id} = jwtDecode(tokenLocal);
      axios.get("http://localhost:4000/api/users/profile",{headers: {Authorization:`Bearer ${tokenLocal}`}})
      .then(res=>{
        setUser(res.data)
        setToken(tokenLocal)
      })
      .catch(err=>{
        console.log(err)
      })
    }
  },[])

  useEffect(() => {
    axios.get("http://localhost:4000/api/sports/allSports")
      .then(res => {
        setSports(res.data); 
      })
      .catch(error => {
        console.log("Error al cargar los deportes:", error);
      });
  }, []);



  return (
    <>
      <TrioContext.Provider value={{user,setUser,token,setToken, sports, setSports}}>
        {children}
      </TrioContext.Provider>
    </>
  )
}
