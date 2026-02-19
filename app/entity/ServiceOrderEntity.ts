import { Formas_recebimento } from './FormaPagamento';
import { DetalServiceOSEntity } from './ServiceEntity';

export class ServiceOrderEntity {
    id!: number;
    numero!: number;
    ativo?: boolean;
    status?: string;
    descricao!: string;
    formaPagamento!: Formas_recebimento;
    consideracoes_finais?: string;
    data_hora_inicio?: Date;
    data_hora_prevista?: Date;
    data_hora_conclusao?: Date;
    observacao_servico?: string;
    observacao_interna?: string;
    id_vendedor!: number;
    id_cliente!: number;
    id_empresa!: number;
    id_forma_pagamento!: number;
    servicos!: DetalServiceOSEntity;
    formas_recebimento!: Formas_recebimento;
    orcar!: boolean;

    constructor({
        id,
        numero,
        ativo,
        status,
        descricao,
        formaPagamento,
        consideracoes_finais,
        data_hora_inicio,
        data_hora_prevista,
        data_hora_conclusao,
        observacao_servico,
        observacao_interna,
        id_vendedor,
        id_cliente,
        id_empresa,
        servicos,
        formas_recebimento,
        id_forma_pagamento,
        orcar
    }: {
        id?: number;
        numero: number;
        ativo?: boolean;
        status?: string;
        formaPagamento?: Formas_recebimento;
        descricao: string;
        consideracoes_finais?: string;
        data_hora_inicio?: Date;
        data_hora_prevista?: Date;
        data_hora_conclusao?: Date;
        observacao_servico?: string;
        observacao_interna?: string;
        id_vendedor: number;
        id_cliente: number;
        id_empresa: number;
        id_forma_pagamento: number;
        servicos: DetalServiceOSEntity;
        formas_recebimento: Formas_recebimento;
        orcar: boolean;
    }) {
        Object.assign(this, {
            id,
            numero,
            ativo,
            status,
            id_forma_pagamento,
            formaPagamento,
            descricao,
            consideracoes_finais,
            data_hora_inicio,
            data_hora_prevista,
            data_hora_conclusao,
            observacao_servico,
            observacao_interna,
            id_vendedor,
            servicos,
            id_cliente,
            id_empresa,
            formas_recebimento,
            orcar
        });
    }
    copyWith({
        id,
        numero,
        ativo,
        status,
        descricao,
        id_forma_pagamento,
        formaPagamento,
        consideracoes_finais,
        data_hora_inicio,
        data_hora_prevista,
        data_hora_conclusao,
        observacao_servico,
        observacao_interna,
        id_vendedor,
        servicos,
        id_cliente,
        id_empresa,
        formas_recebimento,
        orcar
    }: {
        id?: number;
        numero?: number;
        ativo?: boolean;
        status?: string;
        formaPagamento?: Formas_recebimento;
        descricao?: string;
        id_forma_pagamento?: number;
        consideracoes_finais?: string;
        data_hora_inicio?: Date;
        data_hora_prevista?: Date;
        data_hora_conclusao?: Date;
        observacao_servico?: string;
        observacao_interna?: string;
        id_vendedor?: number;
        servicos?: DetalServiceOSEntity;
        id_cliente?: number;
        id_empresa?: number;
        formas_recebimento?: Formas_recebimento;
        orcar?: boolean;
    }): ServiceOrderEntity {
        return new ServiceOrderEntity({
            id: id ?? this.id,
            numero: numero ?? this.numero,
            id_forma_pagamento: id_forma_pagamento ?? this.id_forma_pagamento,
            ativo: ativo ?? this.ativo,
            status: status ?? this.status,
            descricao: descricao ?? this.descricao,
            servicos: servicos ?? this.servicos,
            formaPagamento: formaPagamento ?? this.formaPagamento,
            consideracoes_finais: consideracoes_finais ?? this.consideracoes_finais,
            data_hora_inicio: data_hora_inicio ?? this.data_hora_inicio,
            data_hora_prevista: data_hora_prevista ?? this.data_hora_prevista,
            data_hora_conclusao: data_hora_conclusao ?? this.data_hora_conclusao,
            observacao_servico: observacao_servico ?? this.observacao_servico,
            observacao_interna: observacao_interna ?? this.observacao_interna,
            formas_recebimento: formas_recebimento ?? this.formas_recebimento,
            id_vendedor: id_vendedor ?? this.id_vendedor,
            id_cliente: id_cliente ?? this.id_cliente,
            id_empresa: id_empresa ?? this.id_empresa,
            orcar: orcar ?? this.orcar
        });
    }
}
export class PrepararOS {
    id_cliente!: number;
    id_servico!: number;
    id_empresa!: number;
    id_vendedor?: number;
    id_forma_recebimento?: number;
    descricao!: string;
    consideracoes_finais?: string;
    data_hora_inicio?: Date;
    data_hora_prevista?: Date;
    data_hora_conclusao?: Date;
    observacao_interna?: string;
    observacao_servico?: string;
    orcar?: boolean;
    constructor({
        id_cliente,
        id_servico,
        id_empresa,
        id_vendedor,
        descricao,
        consideracoes_finais,
        data_hora_inicio,
        id_forma_recebimento,

        data_hora_prevista,
        data_hora_conclusao,
        observacao_interna,
        observacao_servico,
        orcar
    }: {
        id_cliente?: number;
        id_servico?: number;
        id_empresa?: number;
        id_vendedor?: number;
        id_forma_recebimento?: number;
        descricao?: string;
        consideracoes_finais?: string;
        data_hora_inicio?: Date;
        data_hora_prevista?: Date;
        data_hora_conclusao?: Date;
        observacao_interna?: string;
        observacao_servico?: string;
        orcar?: boolean;
    }) {
        Object.assign(this, {
            id_cliente,
            id_servico,
            id_empresa,
            id_vendedor,
            descricao,
            id_forma_recebimento,
            consideracoes_finais,
            data_hora_inicio,
            data_hora_prevista,
            data_hora_conclusao,
            observacao_interna,
            observacao_servico,
            orcar
        });
    }
    copyWith({
        id_cliente,
        id_servico,
        id_empresa,
        id_vendedor,
        descricao,
        id_forma_recebimento,
        consideracoes_finais,
        data_hora_inicio,
        data_hora_prevista,
        data_hora_conclusao,
        observacao_interna,
        observacao_servico,
        orcar
    }: {
        id_cliente?: number;
        id_servico?: number;
        id_empresa?: number;
        id_vendedor?: number;
        id_forma_recebimento?: number;
        descricao?: string;
        consideracoes_finais?: string;
        data_hora_inicio?: Date;
        data_hora_prevista?: Date;
        data_hora_conclusao?: Date;
        observacao_interna?: string;
        observacao_servico?: string;
        orcar?: boolean;
    }): PrepararOS {
        return new PrepararOS({
            id_cliente: id_cliente ?? this.id_cliente,
            id_servico: id_servico ?? this.id_servico,
            id_empresa: id_empresa ?? this.id_empresa,
            id_forma_recebimento: id_forma_recebimento ?? this.id_forma_recebimento,
            id_vendedor: id_vendedor ?? this.id_vendedor,
            descricao: descricao ?? this.descricao,
            consideracoes_finais: consideracoes_finais ?? this.consideracoes_finais,
            data_hora_inicio: data_hora_inicio ?? this.data_hora_inicio,
            data_hora_prevista: data_hora_prevista ?? this.data_hora_prevista,
            data_hora_conclusao: data_hora_conclusao ?? this.data_hora_conclusao,
            observacao_interna: observacao_interna ?? this.observacao_interna,
            observacao_servico: observacao_servico ?? this.observacao_servico,
            orcar: orcar ?? this.orcar
        });
    }
}
