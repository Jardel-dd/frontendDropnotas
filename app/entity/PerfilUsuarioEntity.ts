export class PerfilUser {
    ativo?: boolean;
    id!: number;
    nome!: string;

    perfilUsuario?: boolean;
    perfilUsuarioCadastrar?: boolean;
    perfilUsuarioAlterar?: boolean;
    perfilUsuarioDesativar?: boolean;
    perfilUsuarioPesquisar?: boolean;

    usuarioConta?: boolean;
    usuarioContaCadastrar?: boolean;
    usuarioContaAlterar?: boolean;
    usuarioContaDesativar?: boolean;
    usuarioContaPesquisar?: boolean;

    empresa?: boolean;
    empresaCadastrar?: boolean;
    empresaAlterar?: boolean;
    empresaDesativar?: boolean;
    empresaPesquisar?: boolean;

    pessoa?: boolean;
    pessoaCadastrar?: boolean;
    pessoaAlterar?: boolean;
    pessoaDesativar?: boolean;
    pessoaPesquisar?: boolean;

    vendedor?: boolean;
    vendedorCadastrar?: boolean;
    vendedorAlterar?: boolean;
    vendedorDesativar?: boolean;
    vendedorPesquisar?: boolean;

    servico?: boolean;
    servicoCadastrar?: boolean;
    servicoAlterar?: boolean;
    servicoDesativar?: boolean;
    servicoPesquisar?: boolean;

    ordemServico?: boolean;
    ordemServicoCadastrar?: boolean;
    ordemServicoAlterar?: boolean;
    ordemServicoDesativar?: boolean;
    ordemServicoPesquisar?: boolean;
    ordemServicoTipoVisualizacao!: string;

    contrato?: boolean;
    contratoCadastrar?: boolean;
    contratoAlterar?: boolean;
    contratoDesativar?: boolean;
    contratoPesquisar?: boolean;
    contratoTipoVisualizacao!: string;

    categoriaContrato?: boolean;
    categoriaContratoCadastrar?: boolean;
    categoriaContratoAlterar?: boolean;
    categoriaContratoDesativar?: boolean;
    categoriaContratoPesquisar?: boolean;

    formaPagamento?: boolean;
    formaPagamentoCadastrar?: boolean;
    formaPagamentoAlterar?: boolean;
    formaPagamentoDesativar?: boolean;
    formaPagamentoPesquisar?: boolean;

    nfseCadastrar?: boolean;
    nfseAlterar?: boolean;
    nfseDesativar?: boolean;
    nfsePesquisar?: boolean;
    nfseTipoVisualizacao!: string;

    integracaoCadastrar?: boolean;
    integracaoAlterar?: boolean;
    integracaoDesativar?: boolean;
    integracaoPesquisar?: boolean;

    perfilTributario?: boolean;
    perfilTributarioCadastrar?: boolean;
    perfilTributarioAlterar?: boolean;
    perfilTributarioDesativar?: boolean;
    perfilTributarioPesquisar?: boolean;
    
    relatorio?: boolean;
    relatorioServico?: boolean;
    relatorioRecebimento?: boolean;

    contaPagarCadastrar?: boolean;
    contaPagarPesquisar?: boolean;
    contaReceberCadastrar?: boolean;
    contaReceberPesquisar?: boolean;
    comissaoVisualizar?: boolean;
    permiteAlterarConfiguracoes?: boolean;


    constructor({
        ativo,
        id,
        nome,

        perfilUsuario,
        perfilUsuarioCadastrar,
        perfilUsuarioAlterar,
        perfilUsuarioDesativar,
        perfilUsuarioPesquisar,

        usuarioConta,
        usuarioContaCadastrar,
        usuarioContaAlterar,
        usuarioContaDesativar,
        usuarioContaPesquisar,

        empresa,
        empresaCadastrar,
        empresaAlterar,
        empresaDesativar,
        empresaPesquisar,

        pessoa,
        pessoaCadastrar,
        pessoaAlterar,
        pessoaDesativar,
        pessoaPesquisar,

        vendedor,
        vendedorCadastrar,
        vendedorAlterar,
        vendedorDesativar,
        vendedorPesquisar,

        servico,
        servicoCadastrar,
        servicoAlterar,
        servicoDesativar,
        servicoPesquisar,

        ordemServico,
        ordemServicoCadastrar,
        ordemServicoAlterar,
        ordemServicoDesativar,
        ordemServicoPesquisar,
        ordemServicoTipoVisualizacao,

        contrato,
        contratoCadastrar,
        contratoAlterar,
        contratoDesativar,
        contratoPesquisar,
        contratoTipoVisualizacao,

        categoriaContrato,
        categoriaContratoCadastrar,
        categoriaContratoAlterar,
        categoriaContratoDesativar,
        categoriaContratoPesquisar,

        formaPagamento,
        formaPagamentoCadastrar,
        formaPagamentoAlterar,
        formaPagamentoDesativar,
        formaPagamentoPesquisar,

        nfseCadastrar,
        nfseAlterar,
        nfseDesativar,
        nfsePesquisar,
        nfseTipoVisualizacao,

        integracaoCadastrar,
        integracaoAlterar,
        integracaoDesativar,
        integracaoPesquisar,

        perfilTributario,
        perfilTributarioCadastrar,
        perfilTributarioAlterar,
        perfilTributarioDesativar,
        perfilTributarioPesquisar,

        relatorio,
        relatorioServico,
        relatorioRecebimento,

        contaPagarCadastrar,
        contaPagarPesquisar,
        contaReceberCadastrar,
        contaReceberPesquisar,
        comissaoVisualizar,
        permiteAlterarConfiguracoes
    }: {
        ativo?: boolean;
        id?: number;
        nome: string;

        perfilUsuario?: boolean;
        perfilUsuarioCadastrar?: boolean;
        perfilUsuarioAlterar?: boolean;
        perfilUsuarioDesativar?: boolean;
        perfilUsuarioPesquisar?: boolean;

        usuarioConta?: boolean;
        usuarioContaCadastrar?: boolean;
        usuarioContaAlterar?: boolean;
        usuarioContaDesativar?: boolean;
        usuarioContaPesquisar?: boolean;

        empresa?: boolean;
        empresaCadastrar?: boolean;
        empresaAlterar?: boolean;
        empresaDesativar?: boolean;
        empresaPesquisar?: boolean;

        pessoa?: boolean;
        pessoaCadastrar?: boolean;
        pessoaAlterar?: boolean;
        pessoaDesativar?: boolean;
        pessoaPesquisar?: boolean;

        vendedor?: boolean;
        vendedorCadastrar?: boolean;
        vendedorAlterar?: boolean;
        vendedorDesativar?: boolean;
        vendedorPesquisar?: boolean;

        servico?: boolean;
        servicoCadastrar?: boolean;
        servicoAlterar?: boolean;
        servicoDesativar?: boolean;
        servicoPesquisar?: boolean;

        ordemServico?: boolean;
        ordemServicoCadastrar?: boolean;
        ordemServicoAlterar?: boolean;
        ordemServicoDesativar?: boolean;
        ordemServicoPesquisar?: boolean;
        ordemServicoTipoVisualizacao: string;

        contrato?: boolean;
        contratoCadastrar?: boolean;
        contratoAlterar?: boolean;
        contratoDesativar?: boolean;
        contratoPesquisar?: boolean;
        contratoTipoVisualizacao: string;

        categoriaContrato?: boolean;
        categoriaContratoCadastrar?: boolean;
        categoriaContratoAlterar?: boolean;
        categoriaContratoDesativar?: boolean;
        categoriaContratoPesquisar?: boolean;

        formaPagamento?: boolean;
        formaPagamentoCadastrar?: boolean;
        formaPagamentoAlterar?: boolean;
        formaPagamentoDesativar?: boolean;
        formaPagamentoPesquisar?: boolean;

        nfseCadastrar?: boolean;
        nfseAlterar?: boolean;
        nfseDesativar?: boolean;
        nfsePesquisar?: boolean;
        nfseTipoVisualizacao: string;

        integracaoCadastrar?: boolean;
        integracaoAlterar?: boolean;
        integracaoDesativar?: boolean;
        integracaoPesquisar?: boolean;

        perfilTributario?: boolean;
        perfilTributarioCadastrar?: boolean;
        perfilTributarioAlterar?: boolean;
        perfilTributarioDesativar?: boolean;
        perfilTributarioPesquisar?: boolean;

         relatorio?: boolean;
        relatorioServico?: boolean;
        relatorioRecebimento?: boolean;

        contaPagarCadastrar?: boolean;
        contaPagarPesquisar?: boolean;
        contaReceberCadastrar?: boolean;
        contaReceberPesquisar?: boolean;
        comissaoVisualizar?: boolean;
        permiteAlterarConfiguracoes?: boolean;


    }) {
        Object.assign(this, {
            ativo,
            id,
            nome,

            perfilUsuario,
            perfilUsuarioCadastrar,
            perfilUsuarioAlterar,
            perfilUsuarioDesativar,
            perfilUsuarioPesquisar,

            usuarioConta,
            usuarioContaCadastrar,
            usuarioContaAlterar,
            usuarioContaDesativar,
            usuarioContaPesquisar,

            empresa,
            empresaCadastrar,
            empresaAlterar,
            empresaDesativar,
            empresaPesquisar,

            pessoa,
            pessoaCadastrar,
            pessoaAlterar,
            pessoaDesativar,
            pessoaPesquisar,

            vendedor,
            vendedorCadastrar,
            vendedorAlterar,
            vendedorDesativar,
            vendedorPesquisar,

            servico,
            servicoCadastrar,
            servicoAlterar,
            servicoDesativar,
            servicoPesquisar,

            ordemServico,
            ordemServicoCadastrar,
            ordemServicoAlterar,
            ordemServicoDesativar,
            ordemServicoPesquisar,
            ordemServicoTipoVisualizacao,

            contrato,
            contratoCadastrar,
            contratoAlterar,
            contratoDesativar,
            contratoPesquisar,
            contratoTipoVisualizacao,

            categoriaContrato,
            categoriaContratoCadastrar,
            categoriaContratoAlterar,
            categoriaContratoDesativar,
            categoriaContratoPesquisar,

            formaPagamento,
            formaPagamentoCadastrar,
            formaPagamentoAlterar,
            formaPagamentoDesativar,
            formaPagamentoPesquisar,

            nfseCadastrar,
            nfseAlterar,
            nfseDesativar,
            nfsePesquisar,
            nfseTipoVisualizacao,

            integracaoCadastrar,
            integracaoAlterar,
            integracaoDesativar,
            integracaoPesquisar,

            perfilTributario,
            perfilTributarioCadastrar,
            perfilTributarioAlterar,
            perfilTributarioDesativar,
            perfilTributarioPesquisar,

            relatorio,
            relatorioServico,
            relatorioRecebimento,

            contaPagarCadastrar,
            contaPagarPesquisar,
            contaReceberCadastrar,
            contaReceberPesquisar,
            comissaoVisualizar,
            permiteAlterarConfiguracoes
        });
    }
    copyWith({
        ativo,
        id,
        nome,

        perfilUsuario,
        perfilUsuarioCadastrar,
        perfilUsuarioAlterar,
        perfilUsuarioDesativar,
        perfilUsuarioPesquisar,

        usuarioConta,
        usuarioContaCadastrar,
        usuarioContaAlterar,
        usuarioContaDesativar,
        usuarioContaPesquisar,

        empresa,
        empresaCadastrar,
        empresaAlterar,
        empresaDesativar,
        empresaPesquisar,

        pessoa,
        pessoaCadastrar,
        pessoaAlterar,
        pessoaDesativar,
        pessoaPesquisar,

        vendedor,
        vendedorCadastrar,
        vendedorAlterar,
        vendedorDesativar,
        vendedorPesquisar,

        servico,
        servicoCadastrar,
        servicoAlterar,
        servicoDesativar,
        servicoPesquisar,

        ordemServico,
        ordemServicoCadastrar,
        ordemServicoAlterar,
        ordemServicoDesativar,
        ordemServicoPesquisar,
        ordemServicoTipoVisualizacao,

        contrato,
        contratoCadastrar,
        contratoAlterar,
        contratoDesativar,
        contratoPesquisar,
        contratoTipoVisualizacao,

        categoriaContrato,
        categoriaContratoCadastrar,
        categoriaContratoAlterar,
        categoriaContratoDesativar,
        categoriaContratoPesquisar,

        formaPagamento,
        formaPagamentoCadastrar,
        formaPagamentoAlterar,
        formaPagamentoDesativar,
        formaPagamentoPesquisar,

        nfseCadastrar,
        nfseAlterar,
        nfseDesativar,
        nfsePesquisar,
        nfseTipoVisualizacao,

        integracaoCadastrar,
        integracaoAlterar,
        integracaoDesativar,
        integracaoPesquisar,

        perfilTributario,
        perfilTributarioCadastrar,
        perfilTributarioAlterar,
        perfilTributarioDesativar,
        perfilTributarioPesquisar,

        relatorio,
        relatorioServico,
        relatorioRecebimento,

        contaPagarCadastrar,
        contaPagarPesquisar,
        contaReceberCadastrar,
        contaReceberPesquisar,
        comissaoVisualizar,
        permiteAlterarConfiguracoes
    }: {
        ativo?: boolean;
        id?: number;
        nome?: string;

        perfilUsuario?: boolean;
        perfilUsuarioCadastrar?: boolean;
        perfilUsuarioAlterar?: boolean;
        perfilUsuarioDesativar?: boolean;
        perfilUsuarioPesquisar?: boolean;

        usuarioConta?: boolean;
        usuarioContaCadastrar?: boolean;
        usuarioContaAlterar?: boolean;
        usuarioContaDesativar?: boolean;
        usuarioContaPesquisar?: boolean;

        empresa?: boolean;
        empresaCadastrar?: boolean;
        empresaAlterar?: boolean;
        empresaDesativar?: boolean;
        empresaPesquisar?: boolean;

        pessoa?: boolean;
        pessoaCadastrar?: boolean;
        pessoaAlterar?: boolean;
        pessoaDesativar?: boolean;
        pessoaPesquisar?: boolean;

        vendedor?: boolean;
        vendedorCadastrar?: boolean;
        vendedorAlterar?: boolean;
        vendedorDesativar?: boolean;
        vendedorPesquisar?: boolean;

        servico?: boolean;
        servicoCadastrar?: boolean;
        servicoAlterar?: boolean;
        servicoDesativar?: boolean;
        servicoPesquisar?: boolean;

        ordemServico?: boolean;
        ordemServicoCadastrar?: boolean;
        ordemServicoAlterar?: boolean;
        ordemServicoDesativar?: boolean;
        ordemServicoPesquisar?: boolean;
        ordemServicoTipoVisualizacao?: string;

        contrato?: boolean;
        contratoCadastrar?: boolean;
        contratoAlterar?: boolean;
        contratoDesativar?: boolean;
        contratoPesquisar?: boolean;
        contratoTipoVisualizacao?: string;

        categoriaContrato?: boolean;
        categoriaContratoCadastrar?: boolean;
        categoriaContratoAlterar?: boolean;
        categoriaContratoDesativar?: boolean;
        categoriaContratoPesquisar?: boolean;

        formaPagamento?: boolean;
        formaPagamentoCadastrar?: boolean;
        formaPagamentoAlterar?: boolean;
        formaPagamentoDesativar?: boolean;
        formaPagamentoPesquisar?: boolean;

        integracaoCadastrar?: boolean;
        integracaoAlterar?: boolean;
        integracaoDesativar?: boolean;
        integracaoPesquisar?: boolean;

        nfseCadastrar?: boolean;
        nfseAlterar?: boolean;
        nfseDesativar?: boolean;
        nfsePesquisar?: boolean;
        nfseTipoVisualizacao?: string;

        perfilTributario?: boolean;
        perfilTributarioCadastrar?: boolean;
        perfilTributarioAlterar?: boolean;
        perfilTributarioDesativar?: boolean;
        perfilTributarioPesquisar?: boolean;

        relatorio?: boolean;
        relatorioServico?: boolean;
        relatorioRecebimento?: boolean;

        contaPagarCadastrar?: boolean;
        contaPagarPesquisar?: boolean;
        contaReceberCadastrar?: boolean;
        contaReceberPesquisar?: boolean;
        comissaoVisualizar?: boolean;
        permiteAlterarConfiguracoes?: boolean;
    }): PerfilUser {
        return new PerfilUser({
            ativo: ativo ?? this.ativo,
            id: id ?? this.id,
            nome: nome ?? this.nome,
            perfilUsuario: perfilUsuario ?? this.perfilUsuario,
            perfilUsuarioCadastrar: perfilUsuarioCadastrar ?? this.perfilUsuarioCadastrar,
            perfilUsuarioAlterar: perfilUsuarioAlterar ?? this.perfilUsuarioAlterar,
            perfilUsuarioDesativar: perfilUsuarioDesativar ?? this.perfilUsuarioDesativar,
            perfilUsuarioPesquisar: perfilUsuarioPesquisar ?? this.perfilUsuarioPesquisar,
            usuarioConta: usuarioConta ?? this.usuarioConta,
            usuarioContaCadastrar: usuarioContaCadastrar ?? this.usuarioContaCadastrar,
            usuarioContaAlterar: usuarioContaAlterar ?? this.usuarioContaAlterar,
            usuarioContaDesativar: usuarioContaDesativar ?? this.usuarioContaDesativar,
            usuarioContaPesquisar: usuarioContaPesquisar ?? this.usuarioContaPesquisar,
            empresa: empresa ?? this.empresa,
            empresaCadastrar: empresaCadastrar ?? this.empresaCadastrar,
            empresaAlterar: empresaAlterar ?? this.empresaAlterar,
            empresaDesativar: empresaDesativar ?? this.empresaDesativar,
            empresaPesquisar: empresaPesquisar ?? this.empresaPesquisar,
            pessoa: pessoa ?? this.pessoa,
            pessoaCadastrar: pessoaCadastrar ?? this.pessoaCadastrar,
            pessoaAlterar: pessoaAlterar ?? this.pessoaAlterar,
            pessoaDesativar: pessoaDesativar ?? this.pessoaDesativar,
            pessoaPesquisar: pessoaPesquisar ?? this.pessoaPesquisar,
            vendedor: vendedor ?? this.vendedor,
            vendedorCadastrar: vendedorCadastrar ?? this.vendedorCadastrar,
            vendedorAlterar: vendedorAlterar ?? this.vendedorAlterar,
            vendedorDesativar: vendedorDesativar ?? this.vendedorDesativar,
            vendedorPesquisar: vendedorPesquisar ?? this.vendedorPesquisar,
            servico: servico ?? this.servico,
            servicoCadastrar: servicoCadastrar ?? this.servicoCadastrar,
            servicoAlterar: servicoAlterar ?? this.servicoAlterar,
            servicoDesativar: servicoDesativar ?? this.servicoDesativar,
            servicoPesquisar: servicoPesquisar ?? this.servicoPesquisar,
            ordemServico: ordemServico ?? this.ordemServico,
            ordemServicoCadastrar: ordemServicoCadastrar ?? this.ordemServicoCadastrar,
            ordemServicoAlterar: ordemServicoAlterar ?? this.ordemServicoAlterar,
            ordemServicoDesativar: ordemServicoDesativar ?? this.ordemServicoDesativar,
            ordemServicoPesquisar: ordemServicoPesquisar ?? this.ordemServicoPesquisar,
            ordemServicoTipoVisualizacao: ordemServicoTipoVisualizacao ?? this.ordemServicoTipoVisualizacao,
            contrato: contrato ?? this.contrato,
            contratoCadastrar: contratoCadastrar ?? this.contratoCadastrar,
            contratoAlterar: contratoAlterar ?? this.contratoAlterar,
            contratoDesativar: contratoDesativar ?? this.contratoDesativar,
            contratoPesquisar: contratoPesquisar ?? this.contratoPesquisar,
            contratoTipoVisualizacao: contratoTipoVisualizacao ?? this.contratoTipoVisualizacao,
            categoriaContrato: categoriaContrato ?? this.categoriaContrato,
            categoriaContratoCadastrar: categoriaContratoCadastrar ?? this.categoriaContratoCadastrar,
            categoriaContratoAlterar: categoriaContratoAlterar ?? this.categoriaContratoAlterar,
            categoriaContratoDesativar: categoriaContratoDesativar ?? this.categoriaContratoDesativar,
            categoriaContratoPesquisar: categoriaContratoPesquisar ?? this.categoriaContratoPesquisar,
            formaPagamento: formaPagamento ?? this.formaPagamento,
            formaPagamentoCadastrar: formaPagamentoCadastrar ?? this.formaPagamentoCadastrar,
            formaPagamentoAlterar: formaPagamentoAlterar ?? this.formaPagamentoAlterar,
            formaPagamentoDesativar: formaPagamentoDesativar ?? this.formaPagamentoDesativar,
            formaPagamentoPesquisar: formaPagamentoPesquisar ?? this.formaPagamentoPesquisar,

            nfseCadastrar: nfseCadastrar ?? this.nfseCadastrar,
            nfseAlterar: nfseAlterar ?? this.nfseAlterar,
            nfseDesativar: nfseDesativar ?? this.nfseDesativar,
            nfsePesquisar: nfsePesquisar ?? this.nfsePesquisar,
            nfseTipoVisualizacao: nfseTipoVisualizacao ?? this.nfseTipoVisualizacao,

            integracaoCadastrar: integracaoCadastrar ?? this.integracaoCadastrar,
            integracaoAlterar: integracaoAlterar ?? this.integracaoAlterar,
            integracaoDesativar: integracaoDesativar ?? this.integracaoDesativar,
            integracaoPesquisar: integracaoPesquisar ?? this.integracaoPesquisar,


            perfilTributario: perfilTributario ?? this.perfilTributario,
            perfilTributarioCadastrar: perfilTributarioCadastrar ?? this.perfilTributarioCadastrar,
            perfilTributarioAlterar: perfilTributarioAlterar ?? this.perfilTributarioAlterar,
            perfilTributarioDesativar: perfilTributarioDesativar ?? this.perfilTributarioDesativar,
            perfilTributarioPesquisar: perfilTributarioPesquisar ?? this.perfilTributarioPesquisar,

            relatorio: relatorio ?? this.relatorio,
            relatorioServico: relatorioServico ?? this.relatorioServico,
            relatorioRecebimento: relatorioRecebimento ?? this.relatorioRecebimento,
            contaPagarCadastrar: contaPagarCadastrar ?? this.contaPagarCadastrar,
            contaPagarPesquisar: contaPagarPesquisar ?? this.contaPagarPesquisar,
            contaReceberCadastrar: contaReceberCadastrar ?? this.contaReceberCadastrar,
            contaReceberPesquisar: contaReceberPesquisar ?? this.contaReceberPesquisar,
            comissaoVisualizar: comissaoVisualizar ?? this.comissaoVisualizar,
            permiteAlterarConfiguracoes: permiteAlterarConfiguracoes ?? this.permiteAlterarConfiguracoes,
        });
    }
}
