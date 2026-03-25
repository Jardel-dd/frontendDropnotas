import api from '@/app/services/api';
import LoadingScreen from '@/app/loading';
import React, { useContext, useState } from 'react';
import type { AppConfigProps, ColorScheme } from '@/types';
import { useUser } from '@/app/routes/protected/UserContext';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { applyThemeLink, updateStoredUserThemePreferences } from '@/app/utils/themePreferences';
import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';

const BtnDarkLigth = (_props: AppConfigProps) => {
    const { layoutConfig, setLayoutConfig } = useContext(LayoutContext);
    const { userConta, setUserData } = useUser();
    const [loading, setLoading] = useState(false);

    const toggleColorScheme = async () => {
        const previousColorScheme = layoutConfig.colorScheme;
        const previousComponentTheme = layoutConfig.componentTheme;
        const previousMenuTheme = layoutConfig.menuTheme;
        const previousLayoutTheme = layoutConfig.layoutTheme;
        const previousTopBarTheme = layoutConfig.topBarTheme;
        const newColorScheme: ColorScheme = layoutConfig.colorScheme === 'light' ? 'dark' : 'light';
        const endpoint = '/configuracao/tema';
        const payload = {
            tema_componente: newColorScheme
        };

        console.log('[BtnDarkLigth] Alternando tema. Atual:', previousColorScheme, 'Novo:', newColorScheme);
        console.log('[BtnDarkLigth] Endpoint:', endpoint);
        console.log('[BtnDarkLigth] Payload enviado:', payload);

        applyThemeLink(newColorScheme, layoutConfig.componentTheme);

        setLayoutConfig((prevState) => ({
            ...prevState,
            colorScheme: newColorScheme,
            menuTheme: newColorScheme,
            layoutTheme: 'colorScheme',
            topBarTheme: 'colorScheme'
        }));

        updateStoredUserThemePreferences({
            colorScheme: newColorScheme
        });

        if (userConta) {
            setUserData({
                ...userConta,
                tema_componente: newColorScheme
            } as UsuarioContaEntity);
            console.log('[BtnDarkLigth] userConta global atualizado imediatamente com tema_componente:', newColorScheme);
        }

        setLoading(true);

        try {
            const response = await api.patch(endpoint, payload);

            console.log('[BtnDarkLigth] Resposta do backend:', response.status, response.data);
            if (!userConta) {
                console.warn('[BtnDarkLigth] userConta nao estava carregado. Apenas layout e localStorage foram atualizados.');
            }
        } catch (error: any) {
            console.error('[BtnDarkLigth] Erro ao atualizar o esquema de cor:', error);

            applyThemeLink(previousColorScheme, previousComponentTheme);
            setLayoutConfig((prevState) => ({
                ...prevState,
                colorScheme: previousColorScheme,
                menuTheme: previousMenuTheme,
                layoutTheme: previousLayoutTheme,
                topBarTheme: previousTopBarTheme
            }));
            updateStoredUserThemePreferences({
                colorScheme: previousColorScheme
            });

            if (userConta) {
                setUserData({
                    ...userConta,
                    tema_componente: previousColorScheme
                } as UsuarioContaEntity);
            }

            if (error.response) {
                console.error('[BtnDarkLigth] Status do erro:', error.response.status);
                console.error('[BtnDarkLigth] Corpo do erro:', error.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex">
            {loading && <LoadingScreen loadingText="Alterando tema, por favor, aguarde..." />}
            <i className={`pi ${layoutConfig.colorScheme === 'light' ? 'pi-sun' : 'pi-moon'} ${layoutConfig.layoutTheme === 'primaryColor' ? 'text-white' : ''}`} onClick={toggleColorScheme} style={{ cursor: 'pointer', fontSize: '1.5rem' }}></i>
        </div>
    );
};

export default BtnDarkLigth;
