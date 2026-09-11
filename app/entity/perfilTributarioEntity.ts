export class PerfilTributarioEntity {
    id_servico?: string;
    id_empresa?: number | null;
    item_lista_servico!: string;
    iss_retido!: string;
    exigibilidade_iss!: string;
    codigo_municipio!: string;
    numero_processo?: string;
    codigo_nbs?: string;
    codigo_inter_contr?: string;
    tributacao_issqn?: string;
    codigo_tributacao_municipio?: string;
    responsavel_retencao!: string;
    codigo_cnae?: string;
    aliquota_deducoes?: number;
    finalidade_nfse?: number;
    indicador_finalidade?: number;
    codigo_indicador_operacao?: string;
    tipo_operacao?: string;
    indicador_destinatario?: string;
    codigo_situacao_tributaria?: string;
    codigo_classificacao_tributaria?: string;
    codigo_situacao_tributaria_regular?: string;
    codigo_classificacao_tributaria_regular?: string;
    codigo_credito_presumido?: string;
    percentual_diferencial_uf?: number;
    percentual_diferencial_municipal?: number;
    percentual_diferencial_cbs?: number;
    id!: number;
    nome!: string;
    ativo?: boolean;
    constructor({
        ativo,
        id_servico,
        id_empresa,
        id,
        nome,
        item_lista_servico,
        exigibilidade_iss,
        iss_retido,
        codigo_municipio,
        municipio_incidencia,
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
        aliquota_deducoes,
        tributacao_issqn,
        codigo_tributacao_municipio,

    }: {
        ativo?: boolean;
        id_servico?: string;
        id_empresa?: number | null;
        id?: number | null;
        codigo_tributacao_municipio?:string;
        nome: string;
        item_lista_servico: string;
        exigibilidade_iss?: string;
        iss_retido?: string;
        observacoes?: string;
        aliquota_deducoes?: number;
        codigo_municipio?: string;
        municipio_incidencia?: string;
        numero_processo?: string;
        responsavel_retencao?: string;
        codigo_cnae?: string;
        codigo_nbs?: string;
        codigo_inter_contr?: string;
        codigo_indicador_operacao?: string;
        tipo_operacao?: string;
        finalidade_nfse?: number;
        indicador_finalidade?: number;
        indicador_destinatario?: string;
        codigo_situacao_tributaria?: string;
        codigo_classificacao_tributaria?: string;
        codigo_situacao_tributaria_regular?: string;
        codigo_classificacao_tributaria_regular?: string;
        codigo_credito_presumido?: string;
        percentual_diferencial_uf?: number;
        percentual_diferencial_municipal?: number;
        percentual_diferencial_cbs?: number;
        tributacao_issqn?:string;
    }) {
        Object.assign(this, {
            ativo,
            id_servico,
            id_empresa,
            id,
            nome,
            item_lista_servico,
            exigibilidade_iss,
            iss_retido,
            codigo_municipio,
            municipio_incidencia,
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
            aliquota_deducoes,
            tributacao_issqn,
            codigo_tributacao_municipio
        });
    }

    copyWith({
        ativo,
        id,
        id_servico,
        id_empresa,
        nome,
        item_lista_servico,
        exigibilidade_iss,
        iss_retido,
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
        aliquota_deducoes,
        tributacao_issqn,
        codigo_tributacao_municipio,
    }: {
        ativo?: boolean;
        id?: number;
        id_servico?: string;
        id_empresa?: number | null;
        nome?: string;
        aliquota_deducoes?: number;
        item_lista_servico?: string;
        exigibilidade_iss?: string;
        iss_retido?: string;
        observacoes?: string;
        codigo_municipio?: string;
        municipio_incidencia?: string;
        numero_processo?: string;
        responsavel_retencao?: string;
        codigo_cnae?: string;
        codigo_nbs?: string;
        codigo_inter_contr?: string;
        codigo_indicador_operacao?: string;
        tipo_operacao?: string;
        finalidade_nfse?: number;
        indicador_finalidade?: number;
        indicador_destinatario?: string;
        codigo_situacao_tributaria?: string;
        codigo_classificacao_tributaria?: string;
        codigo_situacao_tributaria_regular?: string;
        codigo_classificacao_tributaria_regular?: string;
        codigo_credito_presumido?: string;
        percentual_diferencial_uf?: number;
        percentual_diferencial_municipal?: number;
        percentual_diferencial_cbs?: number;
        tributacao_issqn?: string;
        codigo_tributacao_municipio?:string;
    }): PerfilTributarioEntity {
        return new PerfilTributarioEntity({
            ativo: ativo ?? this.ativo,
            id: id ?? this.id,
            id_servico: id_servico ?? this.id_servico,
            id_empresa: id_empresa ?? this.id_empresa,
            nome: nome ?? this.nome,
            aliquota_deducoes: aliquota_deducoes ?? this.aliquota_deducoes,
            item_lista_servico: item_lista_servico ?? this.item_lista_servico,
            exigibilidade_iss: exigibilidade_iss ?? this.exigibilidade_iss,
            iss_retido: iss_retido ?? this.iss_retido,
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
            tributacao_issqn: tributacao_issqn ?? this.tributacao_issqn,
            codigo_tributacao_municipio: codigo_tributacao_municipio ?? this.codigo_tributacao_municipio,
        });
    }
}
