'use client';
import './styles.css';
import api from '@/app/services/api';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { Divider } from 'primereact/divider';
import { PrimeReactContext } from 'primereact/api';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useContext, useEffect, useCallback, useState } from 'react';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import { InputSwitch } from 'primereact/inputswitch';
import { updateStoredUserThemePreferences } from '@/app/utils/themePreferences';

const AppConfig = () => {
    const { layoutConfig, setLayoutConfig } = useContext(LayoutContext);
    const { changeTheme } = useContext(PrimeReactContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isThemeChanging, setIsThemeChanging] = useState(false);
    const [loadingBtnSaveLayout, setLoadingBtnSaveLayout] = useState(false);
    const [selectedComponentTheme, setSelectedComponentTheme] = useState(layoutConfig.componentTheme);

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

    const handleThemeSelect = (componentTheme: string) => {
        console.log('[Configuracoes/Geral] Tema selecionado:', componentTheme);
        console.log('[Configuracoes/Geral] Tema atual antes da troca:', layoutConfig.componentTheme);

        if (componentTheme === selectedComponentTheme) {
            console.log('[Configuracoes/Geral] Tema ja estava selecionado. Nenhuma troca necessaria.');
            return;
        }

        setSelectedComponentTheme(componentTheme);

        if (!changeTheme) {
            console.warn('[Configuracoes/Geral] changeTheme indisponivel. Atualizando apenas o estado local.');
            setLayoutConfig((prevState) => ({
                ...prevState,
                componentTheme,
                theme: componentTheme
            }));
            return;
        }

        setIsLoading(true);
        setIsThemeChanging(true);
        changeTheme(layoutConfig.componentTheme, componentTheme, 'theme-link', () => {
            console.log('[Configuracoes/Geral] Preview do tema aplicado:', componentTheme);
            setLayoutConfig((prevState) => ({
                ...prevState,
                componentTheme,
                theme: componentTheme
            }));
            setTimeout(() => {
                setIsLoading(false);
                setIsThemeChanging(false);
            }, 500);
        });
    };

    const applyScale = useCallback(() => {
        document.documentElement.style.fontSize = layoutConfig.scale + 'px';
    }, [layoutConfig.scale]);

    useEffect(() => {
        applyScale();
    }, [applyScale]);

    useEffect(() => {
        setSelectedComponentTheme(layoutConfig.componentTheme);
    }, [layoutConfig.componentTheme]);

    useEffect(() => {
        if (layoutConfig.colorScheme === 'dark' && layoutConfig.layoutTheme !== 'colorScheme') {
            console.log('[Configuracoes/Geral] Modo dark ativo. Cor primaria desabilitada e layoutTheme ajustado para colorScheme.');
            setLayoutConfig((prev) => ({
                ...prev,
                layoutTheme: 'colorScheme'
            }));
        }
    }, [layoutConfig.colorScheme, layoutConfig.layoutTheme, setLayoutConfig]);

    useEffect(() => {
        console.log('[Configuracoes/Geral] Estado atual do layout:', {
            colorScheme: layoutConfig.colorScheme,
            componentTheme: layoutConfig.componentTheme,
            selectedComponentTheme,
            layoutTheme: layoutConfig.layoutTheme,
            usar_cor_primaria: layoutConfig.colorScheme !== 'dark' && layoutConfig.layoutTheme === 'primaryColor'
        });
    }, [layoutConfig.colorScheme, layoutConfig.componentTheme, layoutConfig.layoutTheme, selectedComponentTheme]);

    const handleSave = async () => {
        try {
            setLoadingBtnSaveLayout(true);

            const usarCorPrimaria = layoutConfig.colorScheme !== 'dark' && layoutConfig.layoutTheme === 'primaryColor';

            const payload = {
                esquema_cor: selectedComponentTheme,
                usar_cor_primaria: usarCorPrimaria
            };

            console.log('[Configuracoes/Geral] Salvando configuracao de cor no endpoint /configuracao/cor');
            console.log('[Configuracoes/Geral] Payload enviado:', payload);

            const response = await api.patch('/configuracao/cor', payload);

            console.log('[Configuracoes/Geral] Resposta do backend:', response.status, response.data);

            updateStoredUserThemePreferences({
                componentTheme: selectedComponentTheme
            });

            setLayoutConfig((prevState) => ({
                ...prevState,
                componentTheme: selectedComponentTheme,
                theme: selectedComponentTheme,
                layoutTheme: usarCorPrimaria ? 'primaryColor' : 'colorScheme'
            }));

            console.log('[Configuracoes/Geral] Configuracao salva com sucesso.');
        } catch (error: any) {
            console.error('[Configuracoes/Geral] Erro ao salvar configuracao de cor:', error);

            if (error.response) {
                console.error('[Configuracoes/Geral] Status do erro:', error.response.status);
                console.error('[Configuracoes/Geral] Corpo do erro:', error.response.data);
            }
        } finally {
            setLoadingBtnSaveLayout(false);
        }
    };

    const isPrimaryColorEnabled = layoutConfig.colorScheme !== 'dark' && layoutConfig.layoutTheme === 'primaryColor';

    return (
        <>
            {isLoading && <LoadingScreen loadingText="Carregando cor do tema..." />}
            <div className="card styled-container-main-all-routes">
                    <div className="mb-4 lg:mb-0 custom-container">
                        {/* <Divider align="center" className="form-divider">
                            <span>Aparencia do Sistema</span>
                        </Divider>
                        <div className="field primary-color-switch-row">
                            <InputSwitch
                                inputId="primaryColorSwitch"
                                checked={isPrimaryColorEnabled}
                                onChange={(e) => {
                                    const checked = Boolean(e.value ?? e.checked);
                                    setLayoutConfig((prev) => ({
                                        ...prev,
                                        layoutTheme: checked ? 'primaryColor' : 'colorScheme'
                                    }));
                                }}
                                disabled={layoutConfig.colorScheme === 'dark'}
                            />
                            <label
                                className="primary-color-switch-label"
                                htmlFor="primaryColorSwitch"
                            >
                                Cor Primaria (Somente no modo claro)
                            </label>
                        </div> */}
                        <Divider align="center" className="form-divider">
                            <span>Modo de cores</span>
                        </Divider>
                        <div className="flex flex-wrap gap-3 p-2">
                            {componentThemes.map((t, i) => (
                                <div key={i}>
                                    <div
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleThemeSelect(t.name)}
                                        title={t.name}
                                    >
                                        <a
                                            className="inline-flex justify-content-center align-items-center w-2rem h-2rem border-round"
                                            style={{
                                                backgroundColor: t.color
                                            }}
                                        >
                                            {selectedComponentTheme === t.name && (
                                                <span className="check flex align-items-center justify-content-center">
                                                    <i className="pi pi-check text-white"></i>
                                                </span>
                                            )}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                <div
                    className="StyleContainer-btn-Created"
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        marginTop: 'auto'
                    }}
                >
                    <BTNPGCreatedAll onClick={handleSave} icon="" label={loadingBtnSaveLayout ? 'Salvando...' : isThemeChanging ? 'Aplicando tema...' : 'Salvar'} disabled={loadingBtnSaveLayout || isThemeChanging} />
                </div>
            </div>
        </>
    );
};

export default AppConfig;
