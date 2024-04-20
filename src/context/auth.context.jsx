import { createContext } from 'react';
import { useState } from 'react';

const AuthContext = createContext();

const AuthProviderWrapper = props => {
  const [search, setSearch] = useState('');

  return (
    <AuthContext.Provider
      value={{
        search,
        setSearch,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProviderWrapper };
