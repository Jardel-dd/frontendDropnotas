'use client';
import './styledLogout.css';
import api from '@/app/services/api';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import LoadingScreen from '@/app/loading';
import { Button } from 'primereact/button';
import { clearAuthStorage, redirectToLogout } from './logoutRefreshToken';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';

const LOGOUT_REDIRECT_PATH = '/';
const LOGOUT_LOADING_TEXT = 'Saindo da conta...';
const LOGOUT_ERROR_MESSAGE = 'Falha ao fazer logout';
const LOGOUT_CONFIRMATION_HEADER = 'Você tem certeza que deseja sair?';

const Logout = () => {
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(false);
    const showLogoutError = () => {
        toast.current?.show({
            severity: 'error',
            summary: 'Erro',
            detail: LOGOUT_ERROR_MESSAGE,
            life: 3000
        });
    };
    const performLogout = async () => {
        try {
            setLoading(true);
            await api.post('logout');
            clearAuthStorage();
            redirectToLogout(LOGOUT_REDIRECT_PATH);
        } catch {
            setLoading(false);
            showLogoutError();
        }
    };
    const openLogoutConfirmation = () => {
        confirmDialog({
            header: LOGOUT_CONFIRMATION_HEADER,
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            className: 'p-confirm-dialog-footer',
            acceptClassName: 'btn-sim',
            rejectClassName: 'p-button-outlined btn-nao',
            accept: performLogout
        });
    };
    return (
        <>
            {loading && <LoadingScreen loadingText={LOGOUT_LOADING_TEXT} />}
            <Toast ref={toast} />
            <ConfirmDialog draggable={false} />
            <div className="logout-container">
                <Button onClick={openLogoutConfirmation} severity="secondary" icon="pi pi-sign-out" label="Sair" outlined className="logout-button" />
            </div>
        </>
    );
};

export default Logout;
