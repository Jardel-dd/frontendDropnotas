'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import React from 'react';
import { useIsMobile } from '../../responsiveCelular/responsive';

const BackButtonVisib: React.FC = () => {
    const pathname = usePathname() ?? '';
    const router = useRouter();
    const isMobile = useIsMobile();

    const routesWithBackButton: Record<string, string> = {
        '/dashboard': 'Dashboard',
        '/cadastro/clientesFornecedores': 'Clientes e Fornecedores',
        '/cadastro/clientesFornecedores/created': 'Novo Cliente ou Fornecedor',
        '/cadastro/servicos': 'Serviços',
        '/cadastro/servicos/created': 'Novo Serviço',
        '/cadastro/vendedores': 'Vendedores',
        '/cadastro/vendedores/created': 'Novo Vendedor',
        '/cadastro/usuarios': 'Usuários',
        '/cadastro/usuarios/created': 'Novo Usuário',
        '/cadastro/perfilUsuario': 'Permissões',
        '/cadastro/perfilUsuario/created': 'Nova Permissão',
        '/cadastro/formaPagamento': 'Pagamentos',
        '/cadastro/formaPagamento/created': 'Novo Pagamento',
        '/cadastro/categoriaContratos': 'Categoria de Contratos',
        '/contrato': 'Contratos',
        '/ordemServicos': 'Ordens de Serviços',
        '/contrato/created': 'Novo Contrato',
        '/ordemServicos/created': 'Ordens de Serviços',
        '/notaServico': 'Notas de Serviços',
        '/notaServico/created': 'Emitir Nota de Serviço',
        '/relatorios/servicos': 'Relatório de Serviços',
        '/relatorios/recebimentos': 'Relatório de Recebimentos',
        '/configuracoes/empresas': 'Empresas',
        '/configuracoes/empresas/created': 'Nova Empresa',
        '/configuracoes/geral': 'Configurações de Layout',
    };

    if (!routesWithBackButton[pathname]) return null;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                gap: isMobile ? '8px' : '12px',
                marginLeft: '5px'
            }}
        >
            <Button
                label={isMobile ? '' : 'Voltar'} 
                severity="secondary"
                text
                style={{boxShadow:"none"}}
                size={isMobile ? 'small' : undefined}
                icon="pi pi-arrow-left"
                onClick={() => router.back()}
            />

            <span
                style={{
                    fontSize: isMobile ? '14px' : '18px',
                    fontWeight: isMobile ? 500 : 600,
                    letterSpacing: isMobile ? '0.3px' : '0.8px'
                }}
            >
                {routesWithBackButton[pathname]}
            </span>
        </div>
    );
};

export default BackButtonVisib;