export class ContasReceberEntity {
    ativo?: boolean;
    id!: number;
    descricao!: string;
    id_forma_pagamento?: number;
    id_vendedor?: number;
    id_cliente?: number;
    valor_original!: number | null;
    valor_juros?: number | null;
    valor_total?: number | null;
    data_emissao?: string | null;
    data_vencimento!: string | null;
    data_hora_pagamento?: string | null;
    situacao?: string | null;
    origem_tipo?: string | null;
    origem_id?: number | null;
    observacao?: string;

    constructor({
        ativo,
        id,
        descricao,
        id_forma_pagamento,
        id_vendedor,
        id_cliente,
        valor_original,
        valor_juros,
        valor_total,
        data_emissao,
        data_vencimento,
        data_hora_pagamento,
        situacao,
        origem_tipo,
        origem_id,
        observacao
    }: {
        ativo?: boolean;
        id?: number;
        descricao?: string;
        id_forma_pagamento?: number;
        id_vendedor?: number;
        id_cliente?: number;
        valor_original?: number | null;
        valor_juros?: number | null;
        valor_total?: number | null;
        data_emissao?: string | null;
        data_vencimento?: string | null;
        data_hora_pagamento?: string | null;
        situacao?: string | null;
        origem_tipo?: string | null;
        origem_id?: number | null;
        observacao?: string;
    }) {
        Object.assign(this, {
            ativo,
            id,
            descricao,
            id_forma_pagamento,
            id_vendedor,
            id_cliente,
            valor_original,
            valor_juros,
            valor_total,
            data_emissao,
            data_vencimento,
            data_hora_pagamento,
            situacao,
            origem_tipo,
            origem_id,
            observacao
        });
    }

    copyWith({
        ativo,
        id,
        descricao,
        id_forma_pagamento,
        id_vendedor,
        id_cliente,
        valor_original,
        valor_juros,
        valor_total,
        data_emissao,
        data_vencimento,
        data_hora_pagamento,
        situacao,
        origem_tipo,
        origem_id,
        observacao
    }: {
        ativo?: boolean;
        id?: number;
        descricao?: string;
        id_forma_pagamento?: number;
        id_vendedor?: number;
        id_cliente?: number;
        valor_original?: number | null;
        valor_juros?: number | null;
        valor_total?: number | null;
        data_emissao?: string | null;
        data_vencimento?: string | null;
        data_hora_pagamento?: string | null;
        situacao?: string | null;
        origem_tipo?: string | null;
        origem_id?: number | null;
        observacao?: string;
    }): ContasReceberEntity {
        return new ContasReceberEntity({
            ativo: ativo ?? this.ativo,
            id: id ?? this.id,
            descricao: descricao ?? this.descricao,
            id_forma_pagamento: id_forma_pagamento ?? this.id_forma_pagamento,
            id_vendedor: id_vendedor ?? this.id_vendedor,
            id_cliente: id_cliente ?? this.id_cliente,
            valor_original: valor_original ?? this.valor_original,
            valor_juros: valor_juros ?? this.valor_juros,
            valor_total: valor_total ?? this.valor_total,
            data_emissao: data_emissao ?? this.data_emissao,
            data_vencimento: data_vencimento ?? this.data_vencimento,
            data_hora_pagamento: data_hora_pagamento ?? this.data_hora_pagamento,
            situacao: situacao ?? this.situacao,
            origem_tipo: origem_tipo ?? this.origem_tipo,
            origem_id: origem_id ?? this.origem_id,
            observacao: observacao ?? this.observacao
        });
    }
}
