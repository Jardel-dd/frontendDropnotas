'use client';
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import { useRef, useState } from 'react';
import { Messages } from 'primereact/messages';
import { useSearchParams } from 'next/navigation';
import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';
import { FormCreatedUsuario } from '../form/controller';
import { createEmptyUserConta, UsuarioFormRef } from '../types/usuario';

export default function CriarUserConta() {
    const searchParams = useSearchParams();
    const userContaID = searchParams.get('id');
    const msgs = useRef<Messages | null>(null);
    const formRef = useRef<UsuarioFormRef>(null);
    const [userConta, setUserConta] = useState<UsuarioContaEntity>(createEmptyUserConta());
    const [, setErrors] = useState<Record<string, string>>({});

    const handleUserContaChange = (updatedUserConta: UsuarioContaEntity) => {
        setUserConta(updatedUserConta);
    };

    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };

    return (
        <div className="card styled-container-main-all-routes">
            <FormCreatedUsuario
                msgs={msgs}
                ref={formRef}
                userConta={userConta}
                initialId={userContaID}
                setUserConta={setUserConta}
                onUserContaChange={handleUserContaChange}
                onErrorsChange={handleErrorsChange}
                redirectAfterSave={true}
                showBTNPGCreatedAll={true}
            />
        </div>
    );
}
