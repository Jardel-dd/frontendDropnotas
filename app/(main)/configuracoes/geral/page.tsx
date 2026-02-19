'use client';
import api from '@/app/services/api';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { Divider } from 'primereact/divider';
import { PrimeReactContext } from 'primereact/api';
import { RadioButton } from 'primereact/radiobutton';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useContext, useEffect, useCallback, useState } from 'react';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
const AppConfig = () => {
    const { layoutConfig, setLayoutConfig } = useContext(LayoutContext);
    const { changeTheme } = useContext(PrimeReactContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isThemeChanging, setIsThemeChanging] = useState(false);
    const [loadingBtnSaveLayout, setLoadingBtnSaveLayout] = useState(false);

    const componentThemes = [
        { name: 'indigo', color: '#3F51B5' },
        { name: 'blue', color: '#2196F3' },
        { name: 'green', color: '#4CAF50' },
        { name: 'deeppurple', color: '#673AB7' },
        { name: 'orange', color: '#FF9800' },
        { name: 'cyan', color: '#00BCD4' },
        { name: 'yellow', color: '#FFB340' },
        { name: 'pink', color: '#E91E63' },
        { name: 'purple', color: '#9C27B0' },
        { name: 'lime', color: '#CDDC39' }
    ];
    const _changeTheme = (componentTheme: string) => {
        setIsLoading(true);
        setIsThemeChanging(true);
        changeTheme?.(layoutConfig.componentTheme, componentTheme, 'theme-link', () => {
            setLayoutConfig((prevState) => ({ ...prevState, componentTheme }));
            setTimeout(() => {
                setIsLoading(false);
                setIsThemeChanging(false);
            }, 500);
        });
    };
    const changeLayoutTheme = useCallback(
        (themeLayout: string) => {
            setLayoutConfig((prevState) => ({ ...prevState, layoutTheme: themeLayout }));
        },
        [setLayoutConfig]
    );
    const applyScale = useCallback(() => {
        document.documentElement.style.fontSize = layoutConfig.scale + 'px';
    }, [layoutConfig.scale]);
    useEffect(() => {
        if (layoutConfig.colorScheme === 'dark') {
            changeLayoutTheme('colorScheme');
        }
    }, [layoutConfig.colorScheme, changeLayoutTheme]);
    useEffect(() => {
        applyScale();
    }, [applyScale]);
    return (
        <>
            {isLoading && <LoadingScreen loadingText={'Carregando cor do tema....'} />}
            <div className="card styled-container-main-all-routes">
                <div className="p-2">
                    <div className="mb-4 lg:mb-0 custom-container">
                        <Divider align="center" className="form-divider mt-1">
                            <span>Aparência do Sistema</span>
                        </Divider>
                        <div className="field-radiobutton">
                            <RadioButton name="menuTheme" value="colorScheme" checked={layoutConfig.layoutTheme === 'colorScheme'} onChange={(e) => changeLayoutTheme(e.value)} inputId="menutheme-colorscheme"></RadioButton>
                            <label htmlFor="menutheme-colorscheme"> Esquema de cores </label>
                        </div>
                        <div className="field-radiobutton">
                            <RadioButton
                                name="menuTheme"
                                value="primaryColor"
                                checked={layoutConfig.layoutTheme === 'primaryColor'}
                                onChange={(e) => changeLayoutTheme(e.value)}
                                disabled={layoutConfig.colorScheme === 'dark'}
                                inputId="menutheme-primarycolor"
                            ></RadioButton>
                            <label htmlFor="menutheme-primarycolor">Cor Primaria (Somente no modo claro)</label>
                        </div>
                        <Divider align="center" className="form-divider mt-6">
                            <span>Modo de cores</span>
                        </Divider>
                        <div className="flex flex-wrap gap-3">
                            {componentThemes.map((t, i) => {
                                return (
                                    <div key={i}>
                                        <div style={{ cursor: 'pointer' }} onClick={() => _changeTheme(t.name)} title={t.name}>
                                            <a className="inline-flex justify-content-center align-items-center w-2rem h-2rem border-round" style={{ backgroundColor: t.color }}>
                                                {layoutConfig.componentTheme === t.name && (
                                                    <span className="check flex align-items-center justify-content-center">
                                                        <i className="pi pi-check text-white"></i>
                                                    </span>
                                                )}
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="StyleContainer-btn-Created" style={{ display: 'flex', alignItems: 'flex-end', marginTop: 'auto' }}>
                    <BTNPGCreatedAll
                        onClick={async () => {
                            try {
                                setLoadingBtnSaveLayout(true);
                                console.log('Tema selecionado para envio:', layoutConfig.componentTheme);

                                await api.put('/conta-cliente', {
                                    tema_componente: layoutConfig.componentTheme
                                });
                                console.log('Tema salvo com sucesso!');
                            } catch (error) {
                                console.log('Tema selecionado para envio:', layoutConfig.componentTheme);

                                console.error('Erro ao salvar tema:', error);
                            } finally {
                                setLoadingBtnSaveLayout(false);
                            }
                        }}
                        icon={''}
                        label={loadingBtnSaveLayout ? 'Salvando...' : 'Salvar'}
                        disabled={loadingBtnSaveLayout}
                    />
                </div>
            </div>
        </>
    );
};

export default AppConfig;
