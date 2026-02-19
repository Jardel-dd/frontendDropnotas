export class Formas_recebimento {
    id?: number;
    id_forma_recebimento?: number;
    valor_taxa!: number | null;
    valor_recebido!: number | null;
    percentual_taxa!: number | null;
    constructor({ id, id_forma_recebimento, valor_taxa, valor_recebido, percentual_taxa }: { id?: number | null; id_forma_recebimento?: number; valor_taxa: number | null; valor_recebido: number | null; percentual_taxa: number | null }) {
        Object.assign(this, {
            id,
            id_forma_recebimento,
            valor_taxa,
            valor_recebido,
            percentual_taxa
        });
    }
    copyWith({ id, id_forma_recebimento, valor_taxa, valor_recebido, percentual_taxa }: { id?: number; id_forma_recebimento: number; valor_taxa: number | null; valor_recebido: number | null; percentual_taxa: number | null }): Formas_recebimento {
        return new Formas_recebimento({
            id: id ?? this.id,
            id_forma_recebimento: id_forma_recebimento ?? this.id_forma_recebimento,
            valor_recebido: valor_recebido ?? this.valor_recebido,
            valor_taxa: valor_taxa ?? this.valor_taxa,
            percentual_taxa: percentual_taxa ?? this.percentual_taxa
        });
    }
}
export enum TipoFormaPagamento {
    DINHEIRO = 'DINHEIRO',
    CARTAO_CREDITO = 'CARTAO_CREDITO',
    CARTAO_DEBITO = 'CARTAO_DEBITO',
    PIX = 'PIX',
    BOLETO = 'BOLETO',
    CARTEIRA_DIGITAL = 'CARTEIRA_DIGITAL',
    OUTROS = 'OUTROS'
}
export class FormaPagamentoEntity {
    ativo?: boolean;
    id!: number;
    descricao!: string;
    observacao?: string;
    tipo_forma_pagamento!: TipoFormaPagamento;
    valor_taxa!: number | null;
    tipo_taxa!: string;
    percentual_taxa!: number | null;
    valor_recebido!: number | null;
    aplicar_taxa_servico!: boolean;
    constructor({
        ativo,
        id,
        descricao,
        observacao,
        tipo_forma_pagamento,
        tipo_taxa,
        valor_taxa,
        aplicar_taxa_servico,
        percentual_taxa,
        valor_recebido
    }: {
        ativo?: boolean;
        id?: number | null;
        descricao: string;
        observacao?: string;
        tipo_forma_pagamento: TipoFormaPagamento;
        valor_taxa: number | null;
        percentual_taxa?: number | null;
        valor_recebido?: number | null;
        tipo_taxa?: string;
        aplicar_taxa_servico?: boolean;
    }) {
        Object.assign(this, {
            ativo,
            id,
            descricao,
            observacao,
            tipo_forma_pagamento,
            tipo_taxa,
            valor_taxa,
            aplicar_taxa_servico,
            percentual_taxa,
            valor_recebido
        });
    }
    copyWith({
        ativo,
        id,
        descricao,
        forma_recebimento,
        observacao,
        tipo_forma_pagamento,
        tipo_taxa,
        valor_taxa,
        percentual_taxa,
        valor_recebido,
        aplicar_taxa_servico
    }: {
        ativo?: boolean;
        id?: number;
        descricao?: string;
        observacao?: string;
        forma_recebimento?: Formas_recebimento;
        tipo_forma_pagamento?: TipoFormaPagamento;
        valor_taxa?: number | null;
        tipo_taxa?: string;
        percentual_taxa?: number | null;
        valor_recebido?: number | null;
        aplicar_taxa_servico?: boolean;
    }): FormaPagamentoEntity {
        return new FormaPagamentoEntity({
            ativo: ativo ?? this.ativo,
            descricao: descricao ?? this.descricao,
            observacao: observacao ?? this.observacao,
            aplicar_taxa_servico: aplicar_taxa_servico ?? this.aplicar_taxa_servico,
            tipo_forma_pagamento: tipo_forma_pagamento ?? this.tipo_forma_pagamento,
            tipo_taxa: tipo_taxa ?? this.tipo_taxa,
            percentual_taxa: percentual_taxa ?? this.percentual_taxa,
            valor_recebido: valor_recebido ?? this.valor_recebido,
            valor_taxa: valor_taxa ?? this.valor_taxa
        });
    }
}
