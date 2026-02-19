import { TreeNode } from 'primereact/treenode';

export const permissoes: TreeNode[] = [
    {
        key: '0',
        label: 'Perfil de Usuário',
        children: [
            { key: '0-0', label: 'Cadastrar perfil de usuário' },
            { key: '0-1', label: 'Alterar perfil de usuários' },
            { key: '0-2', label: 'Desativar perfil usuários' },
            { key: '0-3', label: 'Pesquisar perfil usuários' }
        ]
    },
    {
        key: '1',
        label: 'Conta de Usuário',
        children: [
            { key: '1-0', label: 'Alterar conta dos usuários' },
            { key: '1-1', label: 'Cadastrar conta dos usuários' },
            { key: '1-2', label: 'Desativar conta dos usuários' },
            { key: '1-3', label: 'Pesquisar conta dos usuários' }
        ]
    },
    {
        key: '2',
        label: 'Empresas',
        children: [
            { key: '2-0', label: 'Cadastrar empresas' },
            { key: '2-1', label: 'Alterar  empresas' },
            { key: '2-2', label: 'Desativar  empresas' },
            { key: '2-3', label: 'Pesquisar empresas' }
        ]
    },
    {
        key: '3',
        label: 'Pessoas',
        children: [
            { key: '3-0', label: 'Cadastrar pessoas' },
            { key: '3-1', label: 'Alterar  pessoas' },
            { key: '3-2', label: 'Desativar  pessoas' },
            { key: '3-3', label: 'Pesquisar pessoas' }
        ]
    },
    {
        key: '4',
        label: 'Vendedores',
        children: [
            { key: '4-0', label: 'Cadastrar vendedores' },
            { key: '4-1', label: 'Alterar vendedores' },
            { key: '4-2', label: 'Desativar vendedores' },
            { key: '4-3', label: 'Pesquisar vendedores' }
        ]
    },
    {
        key: '5',
        label: 'Serviços',
        children: [
            { key: '5-0', label: 'Cadastrar serviços' },
            { key: '5-1', label: 'Alterar serviços' },
            { key: '5-2', label: 'Desativar serviços' },
            { key: '5-3', label: 'Pesquisar serviços' }
        ]
    },
    {
        key: '6',
        label: 'Ordem de serviços',
        children: [
            { key: '6-0', label: 'Cadastrar ordem de serviços' },
            { key: '6-1', label: 'Alterar ordem de serviços' },
            { key: '6-2', label: 'Desativar ordem de serviços' },
            { key: '6-3', label: 'Pesquisar ordem de serviços' }
        ]
    },
    {
        key: '7',
        label: 'Contratos',
        children: [
            { key: '7-0', label: 'Cadastrar contratos' },
            { key: '7-1', label: 'Alterar contratos' },
            { key: '7-2', label: 'Desativar contratos' },
            { key: '7-3', label: 'Pesquisar contratos' },
            { key: '7-4', label: 'Tipo visualização' }
        ]
    },
    {
        key: '8',
        label: 'Categoria de contratos',
        children: [
            { key: '8-0', label: 'Cadastrar categoria de contratos' },
            { key: '8-1', label: 'Alterar categoria de contratos' },
            { key: '8-2', label: 'Desativar categoria de contratos' },
            { key: '8-3', label: 'Pesquisar categoria de contratos' }
        ]
    },
    {
        key: '9',
        label: 'Forma de pagamentos',
        children: [
            { key: '9-0', label: 'Cadastrar forma de pagamentos' },
            { key: '9-1', label: 'Alterar forma de pagamentos' },
            { key: '9-2', label: 'Desativar forma de pagamentos' },
            { key: '9-3', label: 'Pesquisar forma de pagamentos' }
        ]
    },
    {
        key: '10',
        label: 'Nota Fiscal - (NFSE)',
        children: [
            { key: '10-0', label: 'Cadastrar Nota Fiscal' },
            { key: '10-1', label: 'Alterar Nota Fiscal' },
            { key: '10-2', label: 'Desativar  Nota Fiscal' },
            { key: '10-3', label: 'Pesquisar  Nota Fiscal' }
        ]
    },
    {
        key: '11',
        label: 'Integração',
        children: [
            { key: '11-0', label: 'Cadastrar Integração' },
            { key: '11-1', label: 'Alterar Integração' },
            { key: '11-2', label: 'Desativar Integração' },
            { key: '11-3', label: 'Pesquisar Integração' }
        ]
    }
];
export const tiposVisualizacaoPermissoes = [
    { label: 'Não Listar', value: 'NAO_LISTAR' },
    { label: 'Somente Próprias', value: 'SOMENTE_PROPRIAS' },
    { label: 'Listar Todas', value: 'LISTAR_TODAS' }
];
export const ativoOptionsStatusTodas = [
    { label: 'Todas', value: 'todas' },
    { label: 'Ativa', value: 'ativas' },
    { label: 'Inativa', value: 'inativas' }
];
export const ativoOptionsStatusTodos = [
    { label: 'Todos', value: 'todos' },
    { label: 'Ativo', value: 'ativos' },
    { label: 'Inativo', value: 'inativos' }
];
export const exigibilidadeISS = [
    { label: 'Exigível', value: 'EXIGIVEL' },
    { label: 'Não Incidência', value: 'NAO_INCIDENCIA' },
    { label: 'Isenção', value: 'ISISENCAO' },
    { label: 'Exportação', value: 'EXPORTACAO' },
    { label: 'Imunidade', value: 'IMUNIDADE' },
    { label: 'Exibilidade Suspensa por Decisão Judicial', value: 'EXIGIBILIDADE_SUSPENSA_POR_DECISAO_JUDICIAL' },
    { label: 'Exibilidade Suspensa por Processo Administrativo', value: 'EXIGIBILIDADE_SUSPENSA_POR_PROCESSO_ADMINISTRATIVO ' }
];
export const exigibilidadeISSServico = [
    { label: 'Exigível', value: 'EXIGIVEL' },
    { label: 'Não Incidência', value: 'NAO_INCIDENCIA' },
    { label: 'Isenção', value: 'ISENCAO' },
    { label: 'Exportação', value: 'EXPORTACAO' },
    { label: 'Imunidade', value: 'IMUNIDADE' },
    { label: 'Exibilidade Suspensa por Decisão Judicial', value: 'EXIGIBILIDADE_SUSPENSA_POR_DECISAO_JUDICIAL' },
    { label: 'Exibilidade Suspensa por Processo Administrativo', value: 'EXIGIBILIDADE_SUSPENSA_POR_PROCESSO_ADMINISTRATIVO ' }
];
export const situacaoTributaria = [
    { label: 'Integral', value: 'INTEGRAL' },
    { label: 'Alíquotas Uniformes', value: 'ALIQUOTAS_UNIFORMES' },
    { label: 'Alíquotas Uniformes Reduzidas', value: 'ALIQUOTAS_UNIFORMES_REDUZIDAS' },
    { label: 'Alíquota Reduzida', value: 'ALIQUOTA_REDUZIDA' },
    { label: 'Alíquota Fixa Proporcional', value: 'ALIQUOTA_FIXA_PROPORCIONAL' },
    { label: 'Isenção', value: 'ISENCAO' },
    { label: 'Imunidade / Não Incidência', value: 'IMUNIDADE_NAO_INCIDENCIA' },
    { label: 'Diferimento', value: 'DIFERIMENTO' },
    { label: 'Diferimento com Redução de Alíquota', value: 'DIFERIMENTO_COM_REDUCAO_ALIQUOTA' },
    { label: 'Suspensão', value: 'SUSPENSAO' },
    { label: 'Tributação Monofásica', value: 'TRIBUTACAO_MONOFASICA' },
    { label: 'Transferência de Crédito', value: 'TRANSFERENCIA_CREDITO' },
    { label: 'Ajuste IBS ZFM', value: 'AJUSTE_IBS_ZFM' },
    { label: 'Ajustes', value: 'AJUSTES' },
    { label: 'Tributação Regime Específico', value: 'TRIBUTACAO_REGIME_ESPECIFICO' },
    { label: 'Exclusão da Base de Cálculo', value: 'EXCLUSAO_BASE_CALCULO' }
];

export const responsavelRetencao = [
    { label: 'Prestador', value: 'PRESTADOR' },
    { label: 'Tomador', value: 'TOMADOR' },
    { label: 'Intermediário ', value: 'INTERMEDIARIO ' }
];
export const regimeTributarioOptions = [
    { label: 'Simples Nacional', value: 'SIMPLES_NACIONAL' },
    { label: 'Simples Nacional Excesso Sublimite', value: 'SIMPLES_NACIONAL_EXCESSO_SUBLIMITE' },
    { label: 'Lucro Presumido', value: 'LUCRO_PRESUMIDO' },
    { label: 'MEI', value: 'MEI' }
];
export const regimeTributarioPessoaOptions = [
    { label: 'Simples Nacional', value: 'SIMPLES_NACIONAL' },
    { label: 'Simples Nacional Excesso Sublimite', value: 'SIMPLES_NACIONAL_EXCESSO_SUBLIMITE' },
    { label: 'Regime Normal', value: 'REGIME_NORMAL' },
    { label: 'MEI', value: 'MEI' }
];
export const tipo_rps = [
    { label: 'RPS', value: 'RPS' },
    { label: 'Nota Fiscal Conjugada', value: 'NOTA_FISCAL_CONJUGADA' },
    { label: 'Cupom', value: 'CUPOM' },
    { label: 'Nenhum', value: 'NENHUM ' }
];
export const regimeEspecialTributarioOptionsCompany = [
    { label: 'Microempresa Municipal', value: 'MICROEMPRESA_MUNICIPAL' },
    { label: 'Estimativa', value: 'ESTIMATIVA' },
    { label: 'Sociedade de Profissionais', value: 'SOCIEDADE_DE_PROFISSIONAIS' },
    { label: 'Cooperativa', value: 'COOPERATIVA' },
    { label: 'Micro Empresário Individual', value: 'MICROEMPRESARIO_INDIVIDUAL ' },
    { label: 'Microempreendedor e Empresa de Pequeno Porte', value: 'MICROEMPRESARIO_E_EMPRESA_DE_PEQUENO_PORTE' },
    { label: 'Numero 8', value: 'NUMERO_8' }
];
export const filterOptions = [
    { label: 'Ambos', value: 'AMBOS' },
    { label: 'Por Empresa', value: 'EMPRESA' },
    { label: 'Por Clientes ou Fornecedores', value: 'CLIENTES_FORNECEDORES' }
];
export const optnsSituacaoServicos = [
    { label: 'Sim', value: true },
    { label: 'Não', value: false }
];
export const issRetido = [
    { label: 'Sim', value: 'SIM' },
    { label: 'Não', value: 'NAO' }
];
export const prestacaoSus = [
    { label: 'Sim', value: true },
    { label: 'Não', value: false }
];
export const incentivoFiscal = [
    { label: 'Sim', value: true },
    { label: 'Não', value: false }
];
export const DropDownFilterClienteFornecedor = [
    { label: 'Todos', value: { cliente: true, fornecedor: true } },
    { label: 'Fornecedor', value: { cliente: false, fornecedor: true } },
    { label: 'Cliente', value: { cliente: true, fornecedor: false } },
];
export const statusOptionsTodas = [
    { label: 'Todas', value: 'ativas' },
    { label: 'Ativas', value: 'ativas' },
    { label: 'Inativas', value: 'inativas' }
];
export const statusOptionsTodos = [
    // { label: 'Todos', value: 'ativos' },
    { label: 'Ativos', value: 'ativos' },
    { label: 'Inativos', value: 'inativos' }
];
type InputValue = {
    name: string;
    code: string;
};
export const DropDownTipoPessoa: InputValue[] = [
    { name: 'Pessoa Jurídica', code: 'PESSOA_JURIDICA' },
    { name: 'Pessoa Física', code: 'PESSOA_FISICA' },
    { name: 'Estrangeiro', code: 'ESTRANGEIRO' },
    { name: 'Estrangeiro no Brasil', code: 'ESTRANGEIRO_NO_BRASIL' },
    { name: 'Produtor Rural', code: 'PRODUTOR_RURAL ' }
];
export const contribuinteOptions = [
    { label: '0- Não informado', code: 'NAO_INFORMADO' },
    { label: '1- Contribuinte ICMS', code: 'CONTRIBUINTE_ICMS' },
    { label: '2 - Contribuinte isento de Inscrição no cadastro do contribuinte ICMS', code: 'CONTRIBUINTE_ISENTO' },
    { label: '3 - Não Contribuinte, que pode ou não possuir Inscrição Estadual no Cadastro de contribuintes ICMS', code: 'NAO_CONTRIBUINTE' }
];
export const OptionsPeriodicidade = [
    { label: 'Mensal', value: 'MENSAL' },
    { label: 'Trimestral', value: 'TRIMESTRAL' },
    { label: 'Semestral', value: 'SEMESTRAL' },
    { label: 'Anaul', value: 'ANUAL ' }
];
export const OptionsSituacao = [
    { label: 'Ativo', value: 'ATIVO' },
    { label: 'Inativo', value: 'INATIVO' },
    { label: 'Pendente', value: 'PENDENTE ' }
];
export const OptionsTipoContrato = [
    { label: 'Cliente', value: 'pessoa_cliente' },
    { label: 'Fornecedor', value: 'pessoa_fornecedor' }
];
export const tipo_forma_pagamento = [
    { label: 'Dinheiro', value: 'DINHEIRO' },
    { label: 'Cartão de Credito', value: 'CARTAO_CREDITO' },
    { label: 'Cartão de Debíto', value: 'CARTAO_DEBITO' },
    { label: 'Pix', value: 'PIX' },
    { label: 'Boleto', value: 'BOLETO' },
    { label: 'Carteira Digital', value: 'CARTEIRA_DIGITAL' },
    { label: 'Outros', value: 'OUTROS' }
];
export const valor_taxa = [
    { label: 'Fixa', value: 'FIXA' },
    { label: 'Porcentagem', value: 'PORCENTAGEM' }
];
export const DropDownFilterNotaServico = [
    { label: ' Todos', value: '' },
    { label: ' Aberta', value: 'ABERTA' },
    { label: ' Pendente', value: 'PENDENTE' },
    { label: ' Processando', value: 'PROCESSANDO' },
    { label: ' Autorizada', value: 'AUTORIZADA' },
    { label: ' Rejeitada', value: 'REJEITADA' },
    { label: ' Cancelada', value: 'CANCELADA' }
];
export const DropDownFilterOrdemOrdemServico = [
    { label: 'Todos', value: '' },
    { label: 'Orçada', value: 'ORCADA' },
    { label: 'Em Andamento', value: 'EM_ANDAMENTO' },
    { label: 'Finalizada', value: 'FINALIZADA' },
    { label: 'Cancelada', value: 'CANCELADA' }
];

export const DropDownFilterOrdemServicoContratoNotaServico = [
    { label: 'Contratos', value: 'ABERTA' },
    { label: 'Ordem de Serviços', value: 'PENDENTE' },
    { label: 'Nota de Serviço', value: 'PENDENTE' }
];
