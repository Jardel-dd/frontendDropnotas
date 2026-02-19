'use client';
import './styledLogout.css'
import api from '@/app/services/api';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/app/loading';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';

const Logout = () => {
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const logout = async () => {
        try {
            setLoading(true);
            await api.post('logout');
            localStorage.clear();
            router.push('/');
        } catch (error) {
            setLoading(false);
            localStorage.clear();
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao fazer logout',
                life: 3000
            });
        }
    };
    const showConfirm = () => {
        confirmDialog({
            header: 'Você tem certeza que deseja sair?',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            className: 'p-confirm-dialog-footer',
            acceptClassName: 'btn-sim',
            rejectClassName: 'p-button-outlined btn-nao',
            accept: logout,
            reject: () => { },
        });
    };

    return (
        <>
            {loading && <LoadingScreen loadingText={'Saindo da conta...'} />}

            <Toast ref={toast} />
            <ConfirmDialog draggable={false} />
            <div style={{ width: '100%', margin: '0', justifyContent: 'space-between' }}>
                <Button onClick={showConfirm} severity="secondary" icon="pi pi-sign-out" label="Sair" outlined style={{ width: '100%' }} />
            </div>
        </>
    );
};
export default Logout;
