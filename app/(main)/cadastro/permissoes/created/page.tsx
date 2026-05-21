'use client';
import './TreeStyles.css';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { Messages } from 'primereact/messages';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import { useUser } from '@/app/routes/protected/UserContext';
import { PermissoesFormRef } from '../types/perfilUsuario';
import FormPermissoesCreated from '../form/controller';

export default function PerfilUserPage() {
    const router = useRouter();
    const msgs = useRef<Messages>(null);
    const searchParams = useSearchParams();
    const { userConta } = useUser();
    const perfilUserId = searchParams.get('id');
    const formRef = useRef<PermissoesFormRef>(null);
    const hasRedirectedRef = useRef(false);
    const [perfilUser, setPerfilUser] = useState<PerfilUser>(
        new PerfilUser({
            ativo: true,
            id: 0,
            nome: '',
            perfilUsuario: false,
            perfilUsuarioCadastrar: false,
            perfilUsuarioAlterar: false,
            perfilUsuarioDesativar: false,
            perfilUsuarioPesquisar: false,
            usuarioConta: false,
            usuarioContaCadastrar: false,
            usuarioContaAlterar: false,
            usuarioContaDesativar: false,
            usuarioContaPesquisar: false,
            empresa: false,
            empresaCadastrar: false,
            empresaAlterar: false,
            empresaDesativar: false,
            empresaPesquisar: false,
            pessoa: false,
            pessoaCadastrar: false,
            pessoaAlterar: false,
            pessoaDesativar: false,
            pessoaPesquisar: false,
            vendedor: false,
            vendedorCadastrar: false,
            vendedorAlterar: false,
            vendedorDesativar: false,
            vendedorPesquisar: false,
            servico: false,
            servicoCadastrar: false,
            servicoAlterar: false,
            servicoDesativar: false,
            servicoPesquisar: false,
            ordemServico: false,
            ordemServicoCadastrar: false,
            ordemServicoAlterar: false,
            ordemServicoDesativar: false,
            ordemServicoPesquisar: false,
            ordemServicoTipoVisualizacao: '',
            contrato: false,
            contratoCadastrar: false,
            contratoAlterar: false,
            contratoDesativar: false,
            contratoPesquisar: false,
            contratoTipoVisualizacao: '',
            categoriaContrato: false,
            categoriaContratoCadastrar: false,
            categoriaContratoAlterar: false,
            categoriaContratoDesativar: false,
            categoriaContratoPesquisar: false,
            formaPagamento: false,
            formaPagamentoCadastrar: false,
            formaPagamentoAlterar: false,
            formaPagamentoDesativar: false,
            formaPagamentoPesquisar: false,
            nfseTipoVisualizacao: ''
        })
    );
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const handlePerfilUserChange = (updatedPerfilUser: PerfilUser) => {
        setPerfilUser(updatedPerfilUser);
    };
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };
    const isEditRoute = !!perfilUserId;
    const canAccessPerfilUsuarioPage = isEditRoute ? !!userConta?.perfilUsuario?.perfilUsuarioAlterar : !!userConta?.perfilUsuario?.perfilUsuarioCadastrar;

    useEffect(() => {
        if (canAccessPerfilUsuarioPage || hasRedirectedRef.current) {
            return;
        }

        hasRedirectedRef.current = true;

        const hasInternalReferrer = typeof document !== 'undefined' && !!document.referrer && document.referrer.startsWith(window.location.origin);

        if (hasInternalReferrer && window.history.length > 1) {
            router.back();
            return;
        }

        router.replace('/cadastro/permissoes');
    }, [canAccessPerfilUsuarioPage, router]);

    if (!canAccessPerfilUsuarioPage) {
        return <LoadingScreen loadingText="Redirecionando..." />;
    }

    return (
        <div className="card styled-container-main-all-routes">
            <FormPermissoesCreated msgs={msgs} ref={formRef} perfilUser={perfilUser} initialId={perfilUserId} setPerfilUser={setPerfilUser} onPerfilUserChange={handlePerfilUserChange} onErrorsChange={handleErrorsChange} showBTNPGCreatedAll={true} />
        </div>
    );
}
