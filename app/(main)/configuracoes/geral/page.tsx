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
        changeTheme?.(
            layoutConfig.componentTheme,
            componentTheme,
            'theme-link',
            () => {
                setLayoutConfig((prevState) => ({
                    ...prevState,
                    componentTheme
                }));
                setTimeout(() => {
                    setIsLoading(false);
                    setIsThemeChanging(false);
                }, 500);
            }
        );
    };
    const applyScale = useCallback(() => {
        document.documentElement.style.fontSize =
            layoutConfig.scale + 'px';
    }, [layoutConfig.scale]);
    useEffect(() => {
        applyScale();
    }, [applyScale]);
    useEffect(() => {
        if (layoutConfig.colorScheme === 'dark') {
            setLayoutConfig((prev) => ({
                ...prev,
                layoutTheme: 'colorScheme'
            }));
        }
    }, [layoutConfig.colorScheme, setLayoutConfig]);
    const handleSave = async () => {
        try {
            setLoadingBtnSaveLayout(true);
            const usarCorPrimaria =
            layoutConfig.layoutTheme === 'primaryColor';
            console.log('layoutTheme atual:', layoutConfig.layoutTheme);
            console.log('usarCorPrimaria calculado:', usarCorPrimaria);
            const payload = {
                esquema_cor: layoutConfig.componentTheme,
                usarCorPrimaria: usarCorPrimaria
            };
            console.log(
                ' Enviando tema:',
                payload
            );
            const response = await api.patch(
                '/configuracao/tema',
                payload
            );
            console.log('Status:', response.status);
            console.log('Resposta:', response.data);
            console.log(' Configuração salva com sucesso!');
        } catch (error: any) {
            console.error(' Erro ao salvar configuração:', error);

            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
            }
        } finally {
            setLoadingBtnSaveLayout(false);
        }
    };
    return (
        <>
            {isLoading && (
                <LoadingScreen loadingText="Carregando cor do tema..." />
            )}
            <div className="card styled-container-main-all-routes">
                <div className="p-2">
                    <div className="mb-4 lg:mb-0 custom-container">
                        <Divider
                            align="center"
                            className="form-divider mt-1"
                        >
                            <span>Aparência do Sistema</span>
                        </Divider>
                        <div className="field flex align-items-center gap-2">
                            <InputSwitch
                                inputId="primaryColorSwitch"
                                checked={
                                    layoutConfig.layoutTheme ===
                                    'primaryColor'
                                }
                                onChange={(e) => {
                                    const checked =
                                        e.value ?? e.checked;

                                    console.log(
                                        'Switch mudou:',
                                        checked
                                    );

                                    setLayoutConfig((prev) => ({
                                        ...prev,
                                        layoutTheme: checked
                                            ? 'primaryColor'
                                            : 'colorScheme'
                                    }));
                                }}
                                disabled={
                                    layoutConfig.colorScheme ===
                                    'dark'
                                }
                            />

                            <label
                                htmlFor="primaryColorSwitch"
                                style={{
                                    cursor: 'pointer',
                                    marginBottom: 0
                                }}
                            >
                                Cor Primária (Somente no modo claro)
                            </label>
                        </div>

                        <Divider
                            align="center"
                            className="form-divider mt-6"
                        >
                            <span>Modo de cores</span>
                        </Divider>

                        <div className="flex flex-wrap gap-3">
                            {componentThemes.map((t, i) => (
                                <div key={i}>
                                    <div
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                        onClick={() =>
                                            _changeTheme(
                                                t.name
                                            )
                                        }
                                        title={t.name}
                                    >
                                        <a
                                            className="inline-flex justify-content-center align-items-center w-2rem h-2rem border-round"
                                            style={{
                                                backgroundColor:
                                                    t.color
                                            }}
                                        >
                                            {layoutConfig.componentTheme ===
                                                t.name && (
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
                </div>
                <div
                    className="StyleContainer-btn-Created"
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        marginTop: 'auto'
                    }}
                >
                    <BTNPGCreatedAll
                        onClick={handleSave}
                        icon=""
                        label={
                            loadingBtnSaveLayout
                                ? 'Salvando...'
                                : 'Salvar'
                        }
                        disabled={loadingBtnSaveLayout}
                    />
                </div>
            </div>
        </>
    );
};

export default AppConfig;