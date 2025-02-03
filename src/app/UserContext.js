import { createContext, useState } from "react";

// Create Context
export const UserContext = createContext({
    username: null,
    setUsername: () => {},
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    account_info: {},
    setLists: () => {}
  });
  

// Create Provider
export function UserProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [account_info, setLists] = useState(null);

  return (
    <UserContext.Provider value={{ username, setUsername, isLoggedIn, setIsLoggedIn, account_info, setLists }}>
      {children}
    </UserContext.Provider>
  );
}