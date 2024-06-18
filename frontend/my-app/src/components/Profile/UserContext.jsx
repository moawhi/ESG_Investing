import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

/**
 * Saving user infor in a useContext hook so it can be reused in other component
 * @returns
 */
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    firstName: localStorage.getItem('firstName') || '',
    lastName: localStorage.getItem('lastName') || '',
    email: localStorage.getItem('email') || '',
  });

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
    Object.entries(updates).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
