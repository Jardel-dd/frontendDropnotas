import api from '@/app/services/api';
import LoadingScreen from '@/app/loading';
import { PrimeReactContext } from 'primereact/api';
import React, { useContext, useState } from 'react';
import type { AppConfigProps, ColorScheme } from '@/types';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { getToken } from '@/app/services/token';

const BtnDarkLigth = (props: AppConfigProps) => {
    const { layoutConfig, setLayoutConfig } = useContext(LayoutContext);
    const { changeTheme } = useContext(PrimeReactContext);
    const [loading, setLoading] = useState(false);
   const toggleColorScheme = async () => {
    const newColorScheme: ColorScheme =
        layoutConfig.colorScheme === 'light' ? 'dark' : 'light';
    console.log('🔄 Tema atual:', layoutConfig.colorScheme);
    console.log('🆕 Novo tema:', newColorScheme);
    changeTheme?.(layoutConfig.colorScheme, newColorScheme, 'theme-link');
    setLayoutConfig((prevState) => ({
        ...prevState,
        colorScheme: newColorScheme,
        menuTheme: newColorScheme
    }));
    localStorage.setItem('colorScheme', newColorScheme);
    setLoading(true);
    const payload = {
        tema_componente: newColorScheme
    };
    console.log('Enviando para /configuracao/tema:', payload);
    try {
        const response = await api.patch('/configuracao/tema', payload, {
    headers: {
        Authorization: `Bearer ${await getToken()}`
    }
});
        console.log(' Resposta status:', response.status);
        console.log(' Dados retornados:', response.data);
    } catch (error: any) {
        console.error('Erro ao atualizar o esquema de cor:', error);
        if (error.response) {
            console.error(error.response.status);
            console.error( error.response.data);
        }
    } finally {
        setLoading(false);
    }
};
    return (
        <div className="flex">
            {loading && <LoadingScreen loadingText="Alterando tema, por favor, aguarde..." />}
            <i
                className={`pi ${layoutConfig.colorScheme === 'light' ? 'pi-sun' : 'pi-moon'} ${layoutConfig.layoutTheme === 'primaryColor' ? 'text-white' : ''}`}
                onClick={toggleColorScheme}
                style={{ cursor: 'pointer', fontSize: '1.5rem' }}
            ></i>
        </div>
    );
};
export default BtnDarkLigth;
