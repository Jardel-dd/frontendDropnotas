'use client';
import { usePathname } from 'next/navigation';
import React from 'react';

const BackButtonVisib: React.FC = () => {
    const pathname = usePathname() ?? '';

    const routesWithBackButton: Record<string, string> = {
        '/configuracoes/empresas': 'Empresas',
        '/configuracoes/geral': 'Configurações',
        '/relatorios': 'Relatórios',
        '/cobrancas': 'Cobranças',
        '/notaServico': 'Notas de Serviços',
        '/ordemServicos': 'Ordens de Serviços',
        '/contratos': 'Contratos',
        '/dashboard': 'Dashboard',
        '/cadastro/clientesFornecedores': 'Clientes e Fornecedores',
        '/cadastro/servicos': 'Serviços',
        '/cadastro/vendedores': 'Vendedores',
        '/cadastro/usuarios': 'Usuários ',
        '/cadastro/permissoes': 'Permissões',
        '/cadastro/pagamento': 'Pagamentos',
        '/configuracoes/empresas/created': 'Nova Empresa',
        '/cadastro/permissoes/created': 'Nova Permissão',
        '/cadastro/usuarios/created': 'Novo Usuário',
        '/cadastro/vendedores/created': 'Novo Vendedor',
        '/cadastro/servicos/created': 'Novo Serviço',
        '/cadastro/clientesFornecedores/created': 'Novo Cliente e Fornecedor',
        '/cadastro/pagamento/created': 'Novo Pagamento',

        


    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
            <span className="layout-menuitem-text" style={{ fontSize: "16px" }}>{routesWithBackButton[pathname]}</span>
        </div>
    );
};

export default BackButtonVisib;
