export class ContasPagarEntity {
    ativo?: boolean;
    id!: number;
    descricao!: string;
    id_fornecedor?: number;
    valor_original!: number | null;
    valor_total!: number | null;
    data_vencimento!: string | null;
    observacao?: string;
    constructor({
        ativo,
        id,
        descricao,
        id_fornecedor,
        data_vencimento,
        valor_original,
        valor_total,
        observacao
    }: {
        ativo?: boolean;
        id?: number;
        descricao?: string;
        id_fornecedor?: number;
        data_vencimento?: string | null;
        valor_original?: number | null;
        valor_total?: number | null;
        observacao?: string;
    }) {
        Object.assign(this, {
            ativo,
            id,
            descricao,
            id_fornecedor,
            data_vencimento,
            valor_original,
            valor_total,
            observacao
        });
    }
    copyWith({
        ativo,
        id,
        descricao,
        id_fornecedor,
        valor_original,
        data_vencimento,
        valor_total,
        observacao
    }: {
        ativo?: boolean;
        id?: number;
        descricao?: string;
        id_fornecedor?: number;
        valor_original?: number | null;
        data_vencimento?: string | null;
        valor_total?: number | null;
        observacao?: string;
    }): ContasPagarEntity {
        return new ContasPagarEntity({
            ativo: ativo ?? this.ativo,
            id: id ?? this.id,
            descricao: descricao ?? this.descricao,
            id_fornecedor: id_fornecedor ?? this.id_fornecedor,
            valor_original: valor_original ?? this.valor_original,
            valor_total: valor_total ?? this.valor_total,
            data_vencimento: data_vencimento ?? this.data_vencimento,
            observacao: observacao ?? this.observacao
        });
    }
};
