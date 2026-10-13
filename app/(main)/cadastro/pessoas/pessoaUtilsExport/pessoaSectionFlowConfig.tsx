export const pessoaSectionFlowConfig = [
    {
        id: 'dados-cliente',
        errorFields: [
            'tipoPessoa',
            'cnpj',
            'cpf',
            'rg',
            'razao_social',
            'nome_fantasia',
            'documento_estrangeiro',
            'pais',
            'selectedRegime',
            'contribuinte',
            'inscricao_estadual',
            'inscricao_municipal',
            'atividade_principal',
            'cnae_fiscal',
            'selectedContato',
            'email'
        ]
    },
    {
        id: 'relacoes',
        errorFields: ['selectedContrato', 'selectedVendedor']
    },
    {
        id: 'endereco',
        errorFields: [
            'cep',
            'logradouro',
            'numero',
            'bairro',
            'uf',
            'municipio',
            'codigo_municipio',
            'codigo_pais',
            'nome_pais',
            'telefone'
        ]
    }
];