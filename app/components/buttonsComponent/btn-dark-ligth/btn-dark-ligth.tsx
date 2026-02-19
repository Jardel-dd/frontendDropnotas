import React, { useContext, useState } from 'react';
import { PrimeReactContext } from 'primereact/api';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import type { AppConfigProps, ColorScheme } from '@/types';
import LoadingScreen from '@/app/loading';
import api from '@/app/services/api';

const BtnDarkLigth = (props: AppConfigProps) => {
    const { layoutConfig, setLayoutConfig } = useContext(LayoutContext);
    const { changeTheme } = useContext(PrimeReactContext);
    const [loading, setLoading] = useState(false);
    const toggleColorScheme = async () => {
        setLoading(true);
        const newColorScheme: ColorScheme = layoutConfig.colorScheme === 'light' ? 'dark' : 'light';
        changeTheme?.(layoutConfig.colorScheme, newColorScheme, 'theme-link', async () => {
            setLayoutConfig((prevState) => ({
                ...prevState,
                colorScheme: newColorScheme,
                menuTheme: newColorScheme === 'dark' ? 'dark' : 'light'
            }));
            const payload = {
                esquema_cor: newColorScheme
            };
            console.log('Enviando para o backend:', payload); 
            try {
                await api.put('/usuario-conta', payload);
            } catch (error) {
                console.error('Erro ao atualizar o esquema de cor:', error);
            }
            setLoading(false);
        });
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
