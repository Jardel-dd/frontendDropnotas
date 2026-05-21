'use client';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import api from '@/app/services/api';
import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';
import { applyThemeLink, getThemePreferencesFromUser, updateStoredUserThemePreferences } from '@/app/utils/themePreferences';
import { USER_REFRESH_EVENT } from '@/app/routes/protected/userRefreshEvents';

const USER_STORAGE_KEY = 'userConta';

interface UserContextType {
  userConta: UsuarioContaEntity | null;
  setUserData: (data: UsuarioContaEntity | null) => void;
  refreshUserData: () => Promise<UsuarioContaEntity | null>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const readStoredUser = (): UsuarioContaEntity | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('[UserContext] Falha ao ler userConta do storage:', error);
    return null;
  }
};

const persistUserData = (data: UsuarioContaEntity | null) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!data) {
    localStorage.removeItem(USER_STORAGE_KEY);
    return;
  }

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));

  const themePreferences = getThemePreferencesFromUser(data);
  updateStoredUserThemePreferences({
    colorScheme: themePreferences.colorScheme,
    componentTheme: themePreferences.componentTheme
  });
  applyThemeLink(themePreferences.colorScheme, themePreferences.componentTheme);
};

const buildSyncedUser = (nextUserData: Record<string, any>, previousUser: UsuarioContaEntity | null) => {
  const themePreferences = getThemePreferencesFromUser({
    tema_componente: nextUserData?.tema_componente ?? previousUser?.tema_componente,
    esquema_cor: nextUserData?.esquema_cor ?? previousUser?.esquema_cor
  });

  return {
    ...previousUser,
    ...nextUserData,
    tema_componente: themePreferences.colorScheme,
    esquema_cor: themePreferences.componentTheme
  } as UsuarioContaEntity;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userConta, setUserContaState] = useState<UsuarioContaEntity | null>(null);
  const userContaRef = useRef<UsuarioContaEntity | null>(null);
  const refreshPromiseRef = useRef<Promise<UsuarioContaEntity | null> | null>(null);

  const setUserData = useCallback((data: UsuarioContaEntity | null) => {
    userContaRef.current = data;
    setUserContaState(data);
    persistUserData(data);
  }, []);

  const refreshUserData = useCallback(async (): Promise<UsuarioContaEntity | null> => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const currentUser = userContaRef.current ?? readStoredUser();

    if (!currentUser?.id) {
      return currentUser ?? null;
    }

    const refreshPromise = (async () => {
      try {
        const response = await api.get(`/usuario-conta/${currentUser.id}`);
        const latestUserData = response.data ?? {};
        const perfilId = latestUserData?.id_perfil_usuario ?? latestUserData?.perfilUsuario?.id;
        let perfilUsuario = latestUserData?.perfilUsuario ?? currentUser.perfilUsuario;

        if (!latestUserData?.perfilUsuario && perfilId) {
          try {
            const perfilResponse = await api.get(`/perfil-usuario/${perfilId}`);
            perfilUsuario = perfilResponse.data ?? perfilUsuario;
          } catch (perfilError) {
            console.warn('[UserContext] Falha ao recarregar perfil/permissoes do usuario logado.', perfilError);
          }
        }

        const syncedUser = buildSyncedUser(
          {
            ...latestUserData,
            perfilUsuario
          },
          currentUser
        );

        setUserData(syncedUser);
        return syncedUser;
      } catch (error: any) {
        if (error?.response?.status !== 401 && error?.response?.status !== 403) {
          console.error('[UserContext] Falha ao atualizar usuario logado:', error);
        }

        return currentUser;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    refreshPromiseRef.current = refreshPromise;
    return refreshPromise;
  }, [setUserData]);

  useEffect(() => {
    userContaRef.current = userConta;
  }, [userConta]);

  useEffect(() => {
    const storedUser = readStoredUser();

    if (storedUser) {
      const syncedStoredUser = buildSyncedUser(storedUser, storedUser);
      userContaRef.current = syncedStoredUser;
      setUserContaState(syncedStoredUser);
      persistUserData(syncedStoredUser);
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== USER_STORAGE_KEY) {
        return;
      }

      const nextStoredUser = readStoredUser();
      userContaRef.current = nextStoredUser;
      setUserContaState(nextStoredUser);
    };

    const handleManualRefresh = () => {
      void refreshUserData();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(USER_REFRESH_EVENT, handleManualRefresh);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(USER_REFRESH_EVENT, handleManualRefresh);
    };
  }, [refreshUserData]);

  return (
    <UserContext.Provider value={{ userConta, setUserData, refreshUserData }}>
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
