import React, { createContext, useContext } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  return React.createElement(
    AuthContext.Provider,
    { value: { user: null, loading: false } },
    children
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
