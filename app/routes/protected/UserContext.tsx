'user client'
import React, { createContext, useEffect, useState, useContext } from 'react';
import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';

interface UserContextType {
  userConta: UsuarioContaEntity | null;
  setUserData: (data: UsuarioContaEntity | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userConta, setUserData] = useState<UsuarioContaEntity | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('userConta');
    if (stored) setUserData(JSON.parse(stored));
  }, []);


  return (
    <UserContext.Provider value={{ userConta, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser deve ser usado dentro de um UserProvider');
  return context;
};

export { UserContext };