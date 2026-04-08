export class ComissaoEntity {
    ativo?: boolean;
    id!: number;
    id_comissao!: number;
    id_vendedor!: number;
    tipo_origem!: string;
    id_origem!: number;
    valor_venda?: number | null;
    percentual_comissao?: number | null;
    valor_comissao?: number | null;
    comissao_fechada?: boolean;
    data_hora_venda?: string | null;
    data_hora_fechamento!: string | null;
    constructor({
        ativo,
        id,
        id_comissao,
        id_vendedor,
        tipo_origem,
        id_origem,
        valor_venda,
        percentual_comissao,
        valor_comissao,
        comissao_fechada,
        data_hora_venda,
        data_hora_fechamento,

    }: {
    ativo?: boolean;
    id?: number;
    id_comissao?: number;
    id_vendedor?: number;
    tipo_origem?: string;
    id_origem?: number;
    valor_venda?: number | null;
    percentual_comissao?: number | null;
    valor_comissao?: number | null;
    comissao_fechada?: boolean;
    data_hora_venda?: string | null;
    data_hora_fechamento?: string | null;
    }) {
        Object.assign(this, {
            ativo,
            id,
            id_comissao,
            id_vendedor,
            tipo_origem,
            id_origem,
            valor_venda,
            percentual_comissao,
            valor_comissao,
            comissao_fechada,
            data_hora_venda,
            data_hora_fechamento,

        });
    }
    copyWith({
        ativo,
        id,
        id_comissao,
        id_vendedor,
        tipo_origem,
        id_origem,
        valor_venda,
        percentual_comissao,
        valor_comissao,
        comissao_fechada,
        data_hora_venda,
        data_hora_fechamento,

    }: {
      ativo?: boolean;
    id?: number;
    id_comissao?: number;
    id_vendedor?: number;
    tipo_origem?: string;
    id_origem?: number;
    valor_venda?: number | null;
    percentual_comissao?: number | null;
    valor_comissao?: number | null;
    comissao_fechada?: boolean;
    data_hora_venda?: string | null;
    data_hora_fechamento?: string | null;
    }): ComissaoEntity {
        return new ComissaoEntity({
            ativo: ativo ?? this.ativo,
            id: id ?? this.id,
            id_comissao: id_comissao ?? this.id_comissao,
            id_vendedor: id_vendedor ?? this.id_vendedor,
            tipo_origem: tipo_origem ?? this.tipo_origem,
            id_origem: id_origem ?? this.id_origem,
            valor_venda: valor_venda ?? this.valor_venda,
            percentual_comissao: percentual_comissao ?? this.percentual_comissao,
            valor_comissao: valor_comissao ?? this.valor_comissao,
            comissao_fechada: comissao_fechada ?? this.comissao_fechada,
            data_hora_venda: data_hora_venda ?? this.data_hora_venda,
            data_hora_fechamento: data_hora_fechamento ?? this.data_hora_fechamento,
        });
    }
}
