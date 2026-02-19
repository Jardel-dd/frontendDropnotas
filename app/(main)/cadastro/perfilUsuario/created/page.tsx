'use client'
import './TreeStyles.css';
import '@/app/styles/styledGlobal.css';
import { Messages } from 'primereact/messages';
import React, { useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import PerfilUserChangeForm, { PermissoesFormRef } from '@/app/components/pages/Permissoes/permissoesForm';

export default function PerfilUserPage() {
    const msgs = useRef<Messages>(null);
    const searchParams = useSearchParams();
    const perfilUserId = searchParams.get('id');
    const formRef = useRef<PermissoesFormRef>(null);
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
            nfseTipoVisualizacao:''
        }));
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const handlePerfilUserChange = (updatedPerfilUser: PerfilUser) => {
        setPerfilUser(updatedPerfilUser);
    };
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };
    return (
        <div className="card styled-container-main-all-routes">
                <PerfilUserChangeForm
                    msgs={msgs}
                    ref={formRef}
                    perfilUser={perfilUser}
                    initialId={perfilUserId}
                    setPerfilUser={setPerfilUser}
                    onPerfilUserChange={handlePerfilUserChange}
                    onErrorsChange={handleErrorsChange}
                    showBTNPGCreatedAll={true}
                />
        </div>
    );
}
