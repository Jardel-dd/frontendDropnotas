'use client'
import { useEffect, useState, useRef, useContext, forwardRef } from 'react';
import { LayoutContext } from './context/layoutcontext';
import type { AppTopbarRef } from '@/types';
import { Ripple } from 'primereact/ripple';
import { StyleClass } from 'primereact/styleclass';
import { Divider } from 'primereact/divider';
import './appStyle.css';
import BackButtonVisib from '@/app/components/buttonsComponent/backButtonVisible/btn-visible-topbar';
import BtnDarkLigth from '@/app/components/buttonsComponent/btn-dark-ligth/btn-dark-ligth';
import Logout from '@/app/(full-page)/auth/logout/logout';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/app/routes/protected/UserContext';

const AppTopbar = forwardRef<AppTopbarRef>(() => {
    const { onMenuToggle, layoutConfig } = useContext(LayoutContext);
    const [currentMenuMode, setCurrentMenuMode] = useState(layoutConfig.menuMode);
    const searchRef = useRef(null);
    const menubuttonRef = useRef(null);
    const router = useRouter();
    const { userConta , setUserData } = useContext(UserContext)!;
    const handleGoToProfile = () => {
        if (userConta?.id) {
            router.push(`/cadastro/usuarios/created?id=${userConta.id}`);
        }
    };
    useEffect(() => {
        setCurrentMenuMode(layoutConfig.menuMode);
    }, [layoutConfig.menuMode]);

    const onMenuButtonClick = () => {
        onMenuToggle();
    };
    return (
        <div className="layout-topbar">
            <div>
                <div style={{ width: '100%' }}>
                    <img
                        style={{ width:"100%", maxWidth:"10rem", height:"5rem" }}
                        alt="dropdown icon"
                        src="/layout/images/DropNotas60w40hh.png"
                    />
                </div>
            </div>
            <button ref={menubuttonRef} className="topbar-menubutton p-link" type="button" onClick={onMenuButtonClick}>
                <span></span>
            </button>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: "100%" }}>
                <BackButtonVisib />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <BtnDarkLigth />
                <div className="topbar-profile">
                    <StyleClass
                        nodeRef={searchRef}
                        selector="@next"
                        enterClassName="hidden"
                        enterActiveClassName="scalein"
                        leaveToClassName="hidden"
                        leaveActiveClassName="fadeout"
                        hideOnOutsideClick>
                        <button ref={searchRef} className="topbar-profile-button p-link" type="button">
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                }}
                            >
                                <img
                                    alt="avatar"
                                    src={userConta?.foto_perfil|| "/layout/images/perfilUser.webp"}
                                    style={{
                                        height: '3rem',
                                        width: '3rem',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        display: 'block'
                                    }}
                                />
                            </div>

                            <span className="profile-details"></span>
                            <i className="pi pi-angle-down"></i>
                        </button>
                    </StyleClass>
                    <ul style={{ minWidth: '25rem' }} className="list-none p-3 m-0 border-round shadow-2 hidden absolute surface-overlay origin-top w-full sm:w-18rem mt-2 right-0 top-auto">
                        <div style={{ margin: '0' }}>
                            <div style={{ flexDirection: 'row', display: 'flex' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <img
                                        alt="avatar"
                                        src={userConta?.foto_perfil || "/layout/images/perfilUser.webp"}
                                        style={{
                                            height: '4rem',
                                            width: '4rem',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            display: 'block'
                                        }}
                                    />
                                </div>
                                <div style={{ flexDirection: 'column', display: 'flex', width: '100%', marginLeft: '0.5rem' }}>
                                    {userConta?.nome ? (
                                        <>
                                            <strong style={{ margin: '0 0.2rem 0 0.5rem', fontSize: '1.1rem' }}>{userConta.nome}</strong>
                                            <p style={{ margin: '0.2rem 0.2rem 0 0.5rem', fontSize: '1rem' }}>{userConta.email}</p>
                                            <span
                                                onClick={handleGoToProfile}
                                                style={{
                                                    margin: '0.5rem 0.2rem 0 0.5rem',
                                                    cursor: 'pointer',
                                                    color: '#007ad9',
                                                    textDecoration: 'underline'
                                                }}
                                            >
                                                Acessar meu perfil
                                                <Ripple />
                                            </span>
                                        </>
                                    ) : (
                                        <p style={{ margin: '0.2rem 0.2rem 0 0.5rem', fontSize: '1rem' }}>Carregando dados...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <li>
                            <Divider />
                            <span style={{ marginLeft: '1rem' }}>
                                <Logout />
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
