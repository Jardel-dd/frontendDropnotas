export class DetalServiceEntity {
    id_servico!: number;
    codigo?: string;
    codigo_cnae?: string;
    descricao!: string;
    descricao_completa?: string;
    codigo_municipio?: string;
    iss_retido!: string;
    valor_total!: number;
    item_lista_servico!: string;
    numero_processo?: string;
    exigibilidade_iss!: string;
    responsavel_retencao!: string;
    municipio_incidencia?: string;
    valores!: DetalPrestadorValoresEntity;
    constructor({
        id_servico,
        descricao,
        descricao_completa,
        codigo,
        codigo_municipio,
        iss_retido,
        valor_total,
        item_lista_servico,
        valores,
        numero_processo,
        codigo_cnae,
        exigibilidade_iss,
        responsavel_retencao,
        municipio_incidencia
    }: {
        descricao: string;
        id_servico: number;
        descricao_completa?: string;
        codigo?: string;
        codigo_municipio?: string;
        iss_retido?: string;
        codigo_cnae?: string;
        item_lista_servico?: string;
        numero_processo?: string;
        exigibilidade_iss?: string;
        valor_total: number;
        responsavel_retencao?: string;
        municipio_incidencia?: string;
        valores?: DetalPrestadorValoresEntity;
    }) {
        Object.assign(this, {
            descricao,
            id_servico,
            descricao_completa,
            codigo,
            codigo_municipio,
            iss_retido,
            item_lista_servico,
            valor_total,
            valores,
            numero_processo,
            codigo_cnae,
            exigibilidade_iss,
            responsavel_retencao,
            municipio_incidencia
        });
    }
    copyWith({
        descricao,
        id_servico,
        descricao_completa,
        codigo,
        codigo_municipio,
        iss_retido,
        valor_total,
        item_lista_servico,
        valores,
        codigo_cnae,
        numero_processo,
        exigibilidade_iss,
        responsavel_retencao,
        municipio_incidencia
    }: {
        descricao?: string;
        id_servico?: number;
        descricao_completa?: string;
        codigo?: string;
        codigo_municipio?: string;
        iss_retido?: string;
        valor_total?: number;
        item_lista_servico?: string;
        numero_processo?: string;
        exigibilidade_iss?: string;
        responsavel_retencao?: string;
        municipio_incidencia?: string;
        valores?: DetalPrestadorValoresEntity;
        codigo_cnae?: string;
    }): DetalServiceEntity {
        return new DetalServiceEntity({
            descricao: descricao ?? this.descricao,
            id_servico: id_servico ?? this.id_servico,
            descricao_completa: descricao_completa ?? this.descricao_completa,
            codigo: codigo ?? this.codigo,
            codigo_municipio: codigo_municipio ?? this.codigo_municipio,
            valor_total: valor_total ?? this.valor_total,
            iss_retido: iss_retido ?? this.iss_retido,
            valores: valores ?? this.valores,
            codigo_cnae: codigo_cnae ?? this.codigo_cnae,
            item_lista_servico: item_lista_servico ?? this.item_lista_servico,
            numero_processo: numero_processo ?? this.numero_processo,
            exigibilidade_iss: exigibilidade_iss ?? this.exigibilidade_iss,
            responsavel_retencao: responsavel_retencao ?? this.responsavel_retencao,
            municipio_incidencia: municipio_incidencia ?? this.municipio_incidencia
        });
    }
}
export class DetalServiceOSEntity {
    id_servico?: number;
    descricao!: string;
    descricao_completa?: string;
    codigo?: string;
    quantidade?: number | null;
    valor_servico?: number | null;
    valor_desconto!: number | null;

    constructor({
        id_servico,
        descricao,
        descricao_completa,
        codigo,
        quantidade,
        valor_servico,
        valor_desconto
    }: {
        id_servico?: number;
        descricao?: string;
        descricao_completa?: string;
        codigo?: string;
        quantidade?: number | null;
        valor_servico?: number | null;
        valor_desconto?: number | null;
    }) {
        Object.assign(this, {
            id_servico,
            descricao,
            descricao_completa,
            codigo,
            quantidade,
            valor_servico,
            valor_desconto
        });
    }
    copyWith({
        id_servico,
        descricao,
        descricao_completa,
        codigo,
        quantidade,
        valor_servico,
        valor_desconto
    }: {
        id_servico?: number;
        descricao?: string;
        descricao_completa?: string;
        codigo?: string;
        quantidade?: number | null;
        valor_servico: number | null;
        valor_desconto?: number | null;
    }): DetalServiceOSEntity {
        return new DetalServiceOSEntity({
            id_servico: id_servico ?? this.id_servico,
            descricao: descricao ?? this.descricao,
            descricao_completa: descricao_completa ?? this.descricao_completa,
            codigo: codigo ?? this.codigo,
            quantidade: quantidade ?? this.quantidade,
            valor_servico: valor_servico ?? this.valor_servico,
            valor_desconto: valor_desconto ?? this.valor_desconto
        });
    }
}
export class DetalPrestadorValoresEntity {
    base_calculo!: number | null;
    valor_servico!: number | null;
    aliquota_iss!: number | null;
    aliquota_deducoes!: number | null;
    aliquota_pis!: number | null;
    aliquota_cofins!: number | null;
    aliquota_inss!: number | null;
    aliquota_ir!: number | null;
    aliquota_csll!: number | null;
    aliquota_outras_retencoes!: number;
    percentual_desconto_incondicionado!: number | null;
    percentual_desconto_condicionado!: number | null;
    constructor({
        base_calculo,
        valor_servico,
        aliquota_iss,
        aliquota_deducoes,
        aliquota_pis,
        aliquota_cofins,
        aliquota_inss,
        aliquota_ir,
        aliquota_csll,
        aliquota_outras_retencoes,
        percentual_desconto_incondicionado,
        percentual_desconto_condicionado
    }: {
        base_calculo: number | null;
        valor_servico: number | null;
        aliquota_iss: number | null;
        aliquota_deducoes: number | null;
        aliquota_pis: number | null;
        aliquota_cofins: number | null;
        aliquota_inss: number | null;
        aliquota_ir: number | null;
        aliquota_csll: number | null;
        aliquota_outras_retencoes: number;
        percentual_desconto_incondicionado: number | null;
        percentual_desconto_condicionado: number | null;
    }) {
        Object.assign(this, {
            base_calculo,
            valor_servico,
            aliquota_iss,
            aliquota_deducoes,
            aliquota_pis,
            aliquota_cofins,
            aliquota_inss,
            aliquota_ir,
            aliquota_csll,
            aliquota_outras_retencoes,
            percentual_desconto_incondicionado,
            percentual_desconto_condicionado
        });
    }
    copyWith({
        base_calculo,
        valor_servico,
        aliquota_iss,
        aliquota_deducoes,
        aliquota_pis,
        aliquota_cofins,
        aliquota_inss,
        aliquota_ir,
        aliquota_csll,
        aliquota_outras_retencoes,
        percentual_desconto_incondicionado,
        percentual_desconto_condicionado
    }: {
        base_calculo?: number | null;
        valor_servico?: number | null;
        aliquota_iss?: number | null;
        aliquota_deducoes?: number | null;
        aliquota_pis?: number | null;
        aliquota_cofins?: number | null;
        aliquota_inss?: number | null;
        aliquota_ir?: number | null;
        aliquota_csll?: number | null;
        aliquota_outras_retencoes?: number;
        percentual_desconto_incondicionado?: number | null;
        percentual_desconto_condicionado?: number | null;
    }): DetalPrestadorValoresEntity {
        return new DetalPrestadorValoresEntity({
            base_calculo: base_calculo ?? this.base_calculo,
            valor_servico: valor_servico ?? this.valor_servico,
            aliquota_iss: aliquota_iss ?? this.aliquota_iss,
            aliquota_deducoes: aliquota_deducoes ?? this.aliquota_deducoes,
            aliquota_pis: aliquota_pis ?? this.aliquota_pis,
            aliquota_cofins: aliquota_cofins ?? this.aliquota_cofins,
            aliquota_inss: aliquota_inss ?? this.aliquota_inss,
            aliquota_ir: aliquota_ir ?? this.aliquota_ir,
            aliquota_csll: aliquota_csll ?? this.aliquota_csll,
            aliquota_outras_retencoes: aliquota_outras_retencoes ?? this.aliquota_outras_retencoes,
            percentual_desconto_incondicionado: percentual_desconto_incondicionado ?? this.percentual_desconto_incondicionado,
            percentual_desconto_condicionado: percentual_desconto_condicionado ?? this.percentual_desconto_condicionado
        });
    }
}
export class ServiceEntity {
    id_servico?: string;
    ativo?: boolean;
    id?: number;

    descricao!: string;
    descricao_completa?: string;
    codigo!: string;
    item_lista_servico!: string;

    exigibilidade_iss!: string;
    iss_retido!: string;

    observacoes?: string;

    codigo_municipio!: string;
    numero_processo?: string;
    responsavel_retencao!: string;

    codigo_cnae?: string;
    codigo_nbs?: string;
    codigo_inter_contr?: string;

    codigo_indicador_operacao?: string;

    tipo_operacao?: number;
    finalidade_nfse?: number;
    indicador_finalidade?: number;
    indicador_destinatario?: number;

    codigo_situacao_tributaria?: string;
    codigo_classificacao_tributaria?: string;
    codigo_situacao_tributaria_regular?: string;
    codigo_classificacao_tributaria_regular?: string;
    codigo_credito_presumido?: string;

    percentual_diferencial_uf?: number;
    percentual_diferencial_municipal?: number;
    percentual_diferencial_cbs?: number;

    valor_servico!: number | null;
    valor_desconto?: number;

    constructor({
        ativo,
        id_servico,
        id,
        descricao,
        descricao_completa,
        codigo,
        item_lista_servico,
        exigibilidade_iss,
        iss_retido,
        observacoes,
        codigo_municipio,
        numero_processo,
        responsavel_retencao,
        codigo_cnae,
        codigo_nbs,
        codigo_inter_contr,
        codigo_indicador_operacao,
        tipo_operacao,
        finalidade_nfse,
        indicador_finalidade,
        indicador_destinatario,
        codigo_situacao_tributaria,
        codigo_classificacao_tributaria,
        codigo_situacao_tributaria_regular,
        codigo_classificacao_tributaria_regular,
        codigo_credito_presumido,
        percentual_diferencial_uf,
        percentual_diferencial_municipal,
        percentual_diferencial_cbs,
        valor_servico,
        valor_desconto
    }: {
        ativo?: boolean;
        id_servico?: string;
        id?: number | null;

        descricao: string;
        descricao_completa?: string;
        codigo: string;
        item_lista_servico: string;

        exigibilidade_iss?: string;
        iss_retido?: string;

        observacoes?: string;

        codigo_municipio?: string;
        numero_processo?: string;
        responsavel_retencao?: string;

        codigo_cnae?: string;
        codigo_nbs?: string;
        codigo_inter_contr?: string;

        codigo_indicador_operacao?: string;

        tipo_operacao?: number;
        finalidade_nfse?: number;
        indicador_finalidade?: number;
        indicador_destinatario?: number;

        codigo_situacao_tributaria?: string;
        codigo_classificacao_tributaria?: string;
        codigo_situacao_tributaria_regular?: string;
        codigo_classificacao_tributaria_regular?: string;
        codigo_credito_presumido?: string;

        percentual_diferencial_uf?: number;
        percentual_diferencial_municipal?: number;
        percentual_diferencial_cbs?: number;

        valor_servico: number | null;
        valor_desconto?: number;
    }) {
        Object.assign(this, {
            ativo,
            id_servico,
            id,
            descricao,
            descricao_completa,
            codigo,
            item_lista_servico,
            exigibilidade_iss,
            iss_retido,
            observacoes,
            codigo_municipio,
            numero_processo,
            responsavel_retencao,
            codigo_cnae,
            codigo_nbs,
            codigo_inter_contr,
            codigo_indicador_operacao,
            tipo_operacao,
            finalidade_nfse,
            indicador_finalidade,
            indicador_destinatario,
            codigo_situacao_tributaria,
            codigo_classificacao_tributaria,
            codigo_situacao_tributaria_regular,
            codigo_classificacao_tributaria_regular,
            codigo_credito_presumido,
            percentual_diferencial_uf,
            percentual_diferencial_municipal,
            percentual_diferencial_cbs,
            valor_servico,
            valor_desconto
        });
    }

    copyWith({
        ativo,
        id,
        id_servico,
        descricao,
        descricao_completa,
        codigo,
        item_lista_servico,
        exigibilidade_iss,
        iss_retido,
        observacoes,
        codigo_municipio,
        numero_processo,
        responsavel_retencao,
        codigo_cnae,
        codigo_nbs,
        codigo_inter_contr,
        codigo_indicador_operacao,
        tipo_operacao,
        finalidade_nfse,
        indicador_finalidade,
        indicador_destinatario,
        codigo_situacao_tributaria,
        codigo_classificacao_tributaria,
        codigo_situacao_tributaria_regular,
        codigo_classificacao_tributaria_regular,
        codigo_credito_presumido,
        percentual_diferencial_uf,
        percentual_diferencial_municipal,
        percentual_diferencial_cbs,
        valor_servico,
        valor_desconto
    }: {
        ativo?: boolean;
        id?: number;
        id_servico?: string;
        descricao?: string;
        descricao_completa?: string;
        codigo?: string;
        item_lista_servico?: string;
        exigibilidade_iss?: string;
        iss_retido?: string;
        observacoes?: string;
        codigo_municipio?: string;
        numero_processo?: string;
        responsavel_retencao?: string;
        codigo_cnae?: string;
        codigo_nbs?: string;
        codigo_inter_contr?: string;
        codigo_indicador_operacao?: string;
        tipo_operacao?: number;
        finalidade_nfse?: number;
        indicador_finalidade?: number;
        indicador_destinatario?: number;
        codigo_situacao_tributaria?: string;
        codigo_classificacao_tributaria?: string;
        codigo_situacao_tributaria_regular?: string;
        codigo_classificacao_tributaria_regular?: string;
        codigo_credito_presumido?: string;
        percentual_diferencial_uf?: number;
        percentual_diferencial_municipal?: number;
        percentual_diferencial_cbs?: number;
        valor_servico?: number;
        valor_desconto?: number;
    }): ServiceEntity {
        return new ServiceEntity({
            ativo: ativo ?? this.ativo,
            id: id ?? this.id,
            id_servico: id_servico ?? this.id_servico,
            descricao: descricao ?? this.descricao,
            descricao_completa: descricao_completa ?? this.descricao_completa,
            codigo: codigo ?? this.codigo,
            item_lista_servico: item_lista_servico ?? this.item_lista_servico,
            exigibilidade_iss: exigibilidade_iss ?? this.exigibilidade_iss,
            iss_retido: iss_retido ?? this.iss_retido,
            observacoes: observacoes ?? this.observacoes,
            codigo_municipio: codigo_municipio ?? this.codigo_municipio,
            numero_processo: numero_processo ?? this.numero_processo,
            responsavel_retencao: responsavel_retencao ?? this.responsavel_retencao,
            codigo_cnae: codigo_cnae ?? this.codigo_cnae,
            codigo_nbs: codigo_nbs ?? this.codigo_nbs,
            codigo_inter_contr: codigo_inter_contr ?? this.codigo_inter_contr,
            codigo_indicador_operacao: codigo_indicador_operacao ?? this.codigo_indicador_operacao,
            tipo_operacao: tipo_operacao ?? this.tipo_operacao,
            finalidade_nfse: finalidade_nfse ?? this.finalidade_nfse,
            indicador_finalidade: indicador_finalidade ?? this.indicador_finalidade,
            indicador_destinatario: indicador_destinatario ?? this.indicador_destinatario,
            codigo_situacao_tributaria: codigo_situacao_tributaria ?? this.codigo_situacao_tributaria,
            codigo_classificacao_tributaria: codigo_classificacao_tributaria ?? this.codigo_classificacao_tributaria,
            codigo_situacao_tributaria_regular: codigo_situacao_tributaria_regular ?? this.codigo_situacao_tributaria_regular,
            codigo_classificacao_tributaria_regular: codigo_classificacao_tributaria_regular ?? this.codigo_classificacao_tributaria_regular,
            codigo_credito_presumido: codigo_credito_presumido ?? this.codigo_credito_presumido,
            percentual_diferencial_uf: percentual_diferencial_uf ?? this.percentual_diferencial_uf,
            percentual_diferencial_municipal: percentual_diferencial_municipal ?? this.percentual_diferencial_municipal,
            percentual_diferencial_cbs: percentual_diferencial_cbs ?? this.percentual_diferencial_cbs,
            valor_servico: valor_servico ?? this.valor_servico,
            valor_desconto: valor_desconto ?? this.valor_desconto
        });
    }
}
