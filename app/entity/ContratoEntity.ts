export class ContratoEntity {
    ativo?: boolean;
    id!: number;
    descricao!: string;
    valor_servico!: number | null;
    periodicidade!: string;
    emitir_boleto?: boolean;
    enviar_email?: boolean;
    enviar_whatsapp?: boolean;
    id_servico!: number | null;
    id_empresa!: number | null;
    id_categoria_contrato!: number | null;
    id_forma_pagamento?: number | null;
    id_clientes_contrato?: number[]; 

    constructor({
        ativo,
        id,
        descricao,
        valor_servico,
        periodicidade,
        emitir_boleto,
        enviar_email,
        enviar_whatsapp,
        id_servico,
        id_empresa,
        id_categoria_contrato,
        id_forma_pagamento,
        id_clientes_contrato,
    }: {
        ativo?: boolean;
        id: number;
        descricao: string;
        valor_servico: number | null;
        periodicidade: string;
        emitir_boleto?: boolean;
        enviar_email?: boolean;
        enviar_whatsapp?: boolean;
        id_servico: number | null;
        id_empresa:number | null;
        id_categoria_contrato: number | null;
        id_forma_pagamento?: number | null;
        id_clientes_contrato?: number[]; 
    }) {
        Object.assign(this, {
            ativo,
            id,
            descricao,
            valor_servico,
            periodicidade,
            emitir_boleto,
            enviar_email,
            enviar_whatsapp,
            id_servico,
            id_empresa,
            id_categoria_contrato,
            id_forma_pagamento,
            id_clientes_contrato,
        });
    }

    copyWith({
        ativo,
        id,
        descricao,
        valor_servico,
        periodicidade,
        emitir_boleto,
        enviar_email,
        enviar_whatsapp,
        id_servico,
        id_empresa,
        id_categoria_contrato,
        id_forma_pagamento,
        id_clientes_contrato,
    }: {
        ativo?: boolean;
        id?: number;
        descricao?: string;
        valor_servico?: number | null;
        periodicidade?: string;
        emitir_boleto?: boolean;
        enviar_email?: boolean;
        enviar_whatsapp?: boolean;
        id_servico?: number | null;
        id_empresa?: number | null;
        id_categoria_contrato?: number | null;
        id_forma_pagamento?: number | null;
        id_clientes_contrato?: number[]; 
    }): ContratoEntity {
        return new ContratoEntity({
            ativo: ativo ?? this.ativo,
            id: id ?? this.id,
            descricao: descricao ?? this.descricao,
            valor_servico: valor_servico ?? this.valor_servico,
            periodicidade: periodicidade ?? this.periodicidade,
            emitir_boleto: emitir_boleto ?? this.emitir_boleto,
            enviar_email: enviar_email ?? this.enviar_email,
            enviar_whatsapp: enviar_whatsapp ?? this.enviar_whatsapp,
            id_servico: id_servico ?? this.id_servico,
            id_empresa: id_empresa ?? this.id_empresa,
            id_categoria_contrato: id_categoria_contrato ?? this.id_categoria_contrato,
            id_forma_pagamento: id_forma_pagamento ?? this.id_forma_pagamento,
            id_clientes_contrato: id_clientes_contrato ?? this.id_clientes_contrato, 
        });
    }
}
