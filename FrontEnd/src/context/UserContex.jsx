import React , {useState , createContext, useEffect} from 'react'

export const UserDataContext = createContext();

const UserContex = ({children}) => {

    const [userData , setUserData] = useState({
        fullName : '',
        email : '',
        phone : '',
        gender : '',
        role : ''
    });

    const [isAuthenticated , setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      }, []);

  return (
    <UserDataContext.Provider value={{
        userData,
        isAuthenticated,
        setUserData,
        setIsAuthenticated
    }}>
      {children}
    </UserDataContext.Provider>
  )
}

export default UserContex