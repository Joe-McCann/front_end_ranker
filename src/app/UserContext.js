import { createContext, useState } from "react";

// Create Context
export const UserContext = createContext({
    username: null,
    setUsername: () => {},
    isLoggedIn: false,
    setIsLoggedIn: () => {}
  });
  

// Create Provider
export function UserProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lists, setLists] = useState(null);

  return (
    <UserContext.Provider value={{ username, setUsername, isLoggedIn, setIsLoggedIn, lists, setLists }}>
      {children}
    </UserContext.Provider>
  );
}