'use client';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import api from '@/app/services/api';
import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';
import { applyThemeLink, getThemePreferencesFromUser, updateStoredUserThemePreferences } from '@/app/utils/themePreferences';
import { AUTH_STORAGE_KEYS, readStoredUser, shouldSyncStoredUserOnReload, writeStoredUser } from '@/app/services/authStorage';

interface UserContextType {
  userConta: UsuarioContaEntity | null;
  isInitializing: boolean;
  isRefreshingUser: boolean;
  setUserData: (data: UsuarioContaEntity | null) => void;
  refreshUserData: () => Promise<UsuarioContaEntity | null>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const persistUserData = (data: UsuarioContaEntity | null) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!data) {
    writeStoredUser(null);
    return;
  }

  writeStoredUser(data);

  const themePreferences = getThemePreferencesFromUser(data);
  updateStoredUserThemePreferences({
    colorScheme: themePreferences.colorScheme,
    componentTheme: themePreferences.componentTheme
  });
  applyThemeLink(themePreferences.colorScheme, themePreferences.componentTheme);
};

const buildSyncedUser = (nextUserData: Record<string, any>, previousUser: UsuarioContaEntity | null) => {
  const { perfilUsuario: _legacyPreviousPerfilUsuario, ...previousUserData } = (previousUser ?? {}) as Record<string, any>;
  const { perfilUsuario: _legacyNextPerfilUsuario, ...normalizedNextUserData } = nextUserData;
  const themePreferences = getThemePreferencesFromUser({
    tema_componente: normalizedNextUserData?.tema_componente ?? previousUser?.tema_componente,
    esquema_cor: normalizedNextUserData?.esquema_cor ?? previousUser?.esquema_cor
  });

  return {
    ...previousUserData,
    ...normalizedNextUserData,
    tema_componente: themePreferences.colorScheme,
    esquema_cor: themePreferences.componentTheme
  } as UsuarioContaEntity;
};

const PERFIL_USUARIO_BOOLEAN_KEYS = new Set([
  'empresa',
  'financeiro',
  'pessoa',
  'servico',
  'vendedor',
  'usuarioConta',
  'perfilUsuario',
  'formaPagamento',
  'categoriaContrato',
  'contrato',
  'ordemServico',
  'integracao',
  'nfse',
  'configuracoes',
  'perfilUsuarioCadastrar',
  'perfilUsuarioAlterar',
  'perfilUsuarioDesativar',
  'perfilUsuarioPesquisar',
  'usuarioContaCadastrar',
  'usuarioContaAlterar',
  'usuarioContaDesativar',
  'usuarioContaPesquisar',
  'empresaCadastrar',
  'empresaAlterar',
  'empresaDesativar',
  'empresaPesquisar',
  'pessoaCadastrar',
  'pessoaAlterar',
  'pessoaDesativar',
  'pessoaPesquisar',
  'vendedorCadastrar',
  'vendedorAlterar',
  'vendedorDesativar',
  'vendedorPesquisar',
  'servicoCadastrar',
  'servicoAlterar',
  'servicoDesativar',
  'servicoPesquisar',
  'ordemServicoCadastrar',
  'ordemServicoAlterar',
  'ordemServicoDesativar',
  'ordemServicoPesquisar',
  'contratoCadastrar',
  'contratoAlterar',
  'contratoDesativar',
  'contratoPesquisar',
  'categoriaContratoCadastrar',
  'categoriaContratoAlterar',
  'categoriaContratoDesativar',
  'categoriaContratoPesquisar',
  'formaPagamentoCadastrar',
  'formaPagamentoAlterar',
  'formaPagamentoDesativar',
  'formaPagamentoPesquisar',
  'integracaoCadastrar',
  'integracaoAlterar',
  'integracaoDesativar',
  'integracaoPesquisar',
  'nfseCadastrar',
  'nfseAlterar',
  'nfseDesativar',
  'nfsePesquisar',
  'permiteAlterarConfiguracoes'
]);

const normalizePermissionFlagValue = (value: unknown) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    if (value === 1) {
      return true;
    }

    if (value === 0) {
      return false;
    }

    return Boolean(value);
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase();

    if (['true', '1', 'sim', 's', 'yes', 'y'].includes(normalizedValue)) {
      return true;
    }

    if (['false', '0', 'nao', 'não', 'n', 'no', 'null', 'undefined', ''].includes(normalizedValue)) {
      return false;
    }
  }

  return value;
};

const normalizePerfilUsuarioEntryValue = (key: string, value: unknown) => {
  return PERFIL_USUARIO_BOOLEAN_KEYS.has(key) ? normalizePermissionFlagValue(value) : value;
};

const normalizePerfilUsuarioShape = (perfilUsuario?: Record<string, any>) => {
  if (!perfilUsuario) {
    return undefined;
  }

  return Object.entries(perfilUsuario).reduce((accumulator, [key, value]) => {
    accumulator[key] = normalizePerfilUsuarioEntryValue(key, value);
    return accumulator;
  }, {} as Record<string, any>);
};

const extractEmbeddedPerfilUsuario = (userData: Record<string, any>) => {
  return normalizePerfilUsuarioShape(userData?.perfil_usuario);
};

const hasRecordKeys = (value: Record<string, any> | undefined) => !!value && Object.keys(value).length > 0;

const normalizeUserPayload = (
  userData: Record<string, any>,
  previousUser: UsuarioContaEntity | null,
  perfilUsuarioOverride?: Record<string, any>
) => {
  const { perfilUsuario: _legacyPerfilUsuario, ...normalizedUserData } = userData;
  const perfilUsuario =
    perfilUsuarioOverride ??
    extractEmbeddedPerfilUsuario(userData) ??
    previousUser?.perfil_usuario;

  return {
    ...normalizedUserData,
    perfil_usuario: perfilUsuario,
    id_perfil_usuario: userData?.id_perfil_usuario ?? perfilUsuario?.id
  };
};

const sortObjectKeys = (value: Record<string, any> | undefined) => {
  if (!value) {
    return null;
  }

  return Object.keys(value)
    .sort()
    .reduce((accumulator, key) => {
      accumulator[key] = value[key];
      return accumulator;
    }, {} as Record<string, any>);
};

const getChangedRecordKeys = (
  currentValue: Record<string, any> | null,
  nextValue: Record<string, any> | null
) => {
  const allKeys = Array.from(
    new Set([
      ...Object.keys(currentValue ?? {}),
      ...Object.keys(nextValue ?? {})
    ])
  ).sort();

  return allKeys.filter((key) => {
    return JSON.stringify(currentValue?.[key] ?? null) !== JSON.stringify(nextValue?.[key] ?? null);
  });
};

const normalizeIdArray = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...value]
    .map((item) => Number(item))
    .filter((item) => !Number.isNaN(item))
    .sort((left, right) => left - right);
};

const buildUserSyncSnapshot = (userData: UsuarioContaEntity | null) => {
  if (!userData) {
    return null;
  }

  return {
    id: userData.id ?? null,
    id_conta_cliente: (userData as Record<string, any>)?.id_conta_cliente ?? null,
    id_perfil_usuario:
      (userData as Record<string, any>)?.id_perfil_usuario ??
      ((userData as Record<string, any>)?.perfil_usuario as ({ id?: number } & Record<string, any>) | undefined)?.id ??
      null,
    nome: userData.nome ?? null,
    email: userData.email ?? null,
    foto_perfil: userData.foto_perfil ?? null,
    ativo: userData.ativo ?? null,
    esquema_cor: userData.esquema_cor ?? null,
    tema_componente: userData.tema_componente ?? null,
    id_empresas_acesso: normalizeIdArray(userData.id_empresas_acesso),
    perfil_usuario: sortObjectKeys((userData as Record<string, any>)?.perfil_usuario as Record<string, any> | undefined)
  };
};

const getUserSyncDifferenceKeys = (currentUser: UsuarioContaEntity | null, nextUser: UsuarioContaEntity | null) => {
  const currentSnapshot = buildUserSyncSnapshot(currentUser);
  const nextSnapshot = buildUserSyncSnapshot(nextUser);

  if (!currentSnapshot || !nextSnapshot) {
    return currentSnapshot === nextSnapshot ? [] : ['userConta'];
  }

  return Object.keys(nextSnapshot).flatMap((key) => {
    const currentValue = currentSnapshot[key as keyof typeof currentSnapshot];
    const nextValue = nextSnapshot[key as keyof typeof nextSnapshot];

    if (key === 'perfil_usuario') {
      const changedPermissionKeys = getChangedRecordKeys(
        currentValue as Record<string, any> | null,
        nextValue as Record<string, any> | null
      );

      if (changedPermissionKeys.length === 0) {
        return [];
      }

      return changedPermissionKeys.map((permissionKey) => `perfil_usuario.${permissionKey}`);
    }

    return JSON.stringify(currentValue) !== JSON.stringify(nextValue) ? [key] : [];
  });
};

const getPerfilUsuarioDebugSnapshot = (perfilUsuario: Record<string, any> | undefined) => {
  return sortObjectKeys(perfilUsuario);
};

const buildFreshAuthRequestConfig = () => ({
  params: {
    _ts: Date.now()
  },
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0'
  }
});

const resolveLatestPerfilUsuario = async (latestUserData: Record<string, any>, currentUser: UsuarioContaEntity | null) => {
  const embeddedPerfilUsuario = extractEmbeddedPerfilUsuario(latestUserData) as ({ id?: number } & Record<string, any>) | undefined;
  const currentPerfilUsuario = normalizePerfilUsuarioShape(
    currentUser?.perfil_usuario as ({ id?: number } & Record<string, any>) | undefined
  ) as ({ id?: number } & Record<string, any>) | undefined;

  const perfilId =
    latestUserData?.id_perfil_usuario ??
    latestUserData?.perfil_usuario?.id ??
    embeddedPerfilUsuario?.id ??
    (currentUser as Record<string, any>)?.id_perfil_usuario ??
    currentPerfilUsuario?.id;

  if (!perfilId) {
    return {
      perfil_usuario: embeddedPerfilUsuario ?? currentPerfilUsuario,
      source: hasRecordKeys(embeddedPerfilUsuario) ? 'usuario-conta.perfil_usuario-without-id' : 'storage-fallback',
      perfilId: null
    };
  }

  try {
    const perfilResponse = await api.get(`/perfil-usuario/${perfilId}`, buildFreshAuthRequestConfig());
    const fetchedPerfilUsuario = normalizePerfilUsuarioShape(perfilResponse.data);
    const mergedPerfilUsuario = hasRecordKeys(embeddedPerfilUsuario)
      ? {
          ...embeddedPerfilUsuario,
          ...fetchedPerfilUsuario
        }
      : fetchedPerfilUsuario;

    return {
      perfil_usuario: mergedPerfilUsuario ?? embeddedPerfilUsuario ?? currentPerfilUsuario,
      source: hasRecordKeys(embeddedPerfilUsuario) ? 'perfil-usuario.by-id.override-embedded' : 'perfil-usuario.by-id',
      perfilId
    };
  } catch (perfilError) {
    console.warn('[UserContext] Falha ao recarregar perfil/permissoes do usuario logado.', perfilError);
    return {
      perfil_usuario: embeddedPerfilUsuario ?? currentPerfilUsuario,
      source: hasRecordKeys(embeddedPerfilUsuario) ? 'usuario-conta.partial-perfil-after-error' : 'storage-fallback-after-error',
      perfilId
    };
  }
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userConta, setUserContaState] = useState<UsuarioContaEntity | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isRefreshingUser, setIsRefreshingUser] = useState(false);
  const userContaRef = useRef<UsuarioContaEntity | null>(null);
  const refreshPromiseRef = useRef<Promise<UsuarioContaEntity | null> | null>(null);

  const setUserData = useCallback((data: UsuarioContaEntity | null) => {
    userContaRef.current = data;
    setUserContaState(data);
    persistUserData(data);
  }, []);

  const refreshUserData = useCallback(async (options?: {
    sourceUser?: UsuarioContaEntity | null;
    commitCurrentIfUnchanged?: boolean;
    commitCurrentIfRequestFails?: boolean;
  }): Promise<UsuarioContaEntity | null> => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const currentUser = options?.sourceUser ?? userContaRef.current ?? readStoredUser();

    if (!currentUser?.id) {
      return currentUser ?? null;
    }

    const refreshPromise = (async () => {
      setIsRefreshingUser(true);

      try {
        console.info('[UserContext] Iniciando refresh do usuario logado.', {
          userId: currentUser.id
        });

        const response = await api.get(`/usuario-conta/${currentUser.id}`, buildFreshAuthRequestConfig());
        const latestUserData = response.data ?? {};
        console.info('[UserContext] Resposta recebida de /usuario-conta/{id}.', {
          userId: currentUser.id,
          responseKeys: Object.keys(latestUserData),
          hasPerfilUsuarioSnakeCase: !!latestUserData?.perfil_usuario,
          idPerfilUsuario:
            latestUserData?.id_perfil_usuario ??
            latestUserData?.perfil_usuario?.id ??
            null
        });

        const resolvedPerfilUsuario = await resolveLatestPerfilUsuario(latestUserData, currentUser);
        const perfilUsuario = resolvedPerfilUsuario.perfil_usuario;

        console.info('[UserContext] Perfil do usuario resolvido para sincronizacao.', {
          userId: currentUser.id,
          source: resolvedPerfilUsuario.source,
          perfilId: resolvedPerfilUsuario.perfilId,
          perfil_usuario: getPerfilUsuarioDebugSnapshot(perfilUsuario as Record<string, any> | undefined)
        });

        const syncedUser = buildSyncedUser(
          normalizeUserPayload(latestUserData, currentUser, perfilUsuario),
          currentUser
        );
        const changedFields = getUserSyncDifferenceKeys(currentUser, syncedUser);
        const hasRelevantChanges = changedFields.length > 0;
        const changedPermissionKeys = changedFields
          .filter((field) => field.startsWith('perfil_usuario.'))
          .map((field) => field.replace('perfil_usuario.', ''));

        console.info('[UserContext] Usuario sincronizado apos refresh.', {
          userId: syncedUser.id,
          nome: syncedUser.nome,
          hasRelevantChanges,
          changedFields,
          changedPermissionKeys,
          perfil_usuario: getPerfilUsuarioDebugSnapshot(syncedUser.perfil_usuario as Record<string, any> | undefined)
        });

        if (!hasRelevantChanges) {
          console.info('[UserContext] Nenhuma diferenca relevante encontrada entre storage e backend. Mantendo dados atuais em memoria/storage.', {
            userId: currentUser.id
          });

          if (options?.commitCurrentIfUnchanged) {
            setUserData(currentUser);
          }

          return currentUser;
        }

        console.info('[UserContext] Diferencas detectadas. Atualizando contexto e localStorage com dados do backend.', {
          userId: syncedUser.id,
          changedFields
        });

        setUserData(syncedUser);
        return syncedUser;
      } catch (error: any) {
        if (error?.response?.status !== 401 && error?.response?.status !== 403) {
          console.error('[UserContext] Falha ao atualizar usuario logado:', error);
        }

        if (options?.commitCurrentIfRequestFails) {
          console.warn('[UserContext] Falha no refresh. Aplicando dados do storage como fallback na memoria.', {
            userId: currentUser.id
          });
          setUserData(currentUser);
        }

        return currentUser;
      } finally {
        setIsRefreshingUser(false);
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
    let isMounted = true;

    const bootstrapUser = async () => {
      try {
        const storedUser = readStoredUser();
        const shouldRefreshStoredUser = shouldSyncStoredUserOnReload(storedUser?.id);
        const syncedStoredUser = storedUser
          ? buildSyncedUser(normalizeUserPayload(storedUser, storedUser), storedUser)
          : null;

        console.info('[UserContext] Bootstrap da sessao iniciado.', {
          hasStoredUser: !!storedUser,
          storedUserId: storedUser?.id ?? null,
          shouldSyncOnReload: shouldRefreshStoredUser,
          perfil_usuario: getPerfilUsuarioDebugSnapshot(storedUser?.perfil_usuario as Record<string, any> | undefined)
        });

        if (syncedStoredUser) {
          userContaRef.current = syncedStoredUser;

          console.info('[UserContext] Sessao encontrada. Priorizando /usuario-conta/{id} antes de popular a variavel global com os dados do usuario.', {
            userId: syncedStoredUser.id,
            nome: syncedStoredUser.nome,
            shouldSyncOnReload: shouldRefreshStoredUser,
            perfil_usuario: getPerfilUsuarioDebugSnapshot(syncedStoredUser.perfil_usuario as Record<string, any> | undefined)
          });
          await refreshUserData({
            sourceUser: syncedStoredUser,
            commitCurrentIfUnchanged: true,
            commitCurrentIfRequestFails: true
          });
          return;
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== AUTH_STORAGE_KEYS.user) {
        return;
      }

      const nextStoredUser = readStoredUser();
      userContaRef.current = nextStoredUser;
      setUserContaState(nextStoredUser);
    };

    window.addEventListener('storage', handleStorage);
    void bootstrapUser();

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorage);
    };
  }, [refreshUserData]);

  return (
    <UserContext.Provider value={{ userConta, isInitializing, isRefreshingUser, setUserData, refreshUserData }}>
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
