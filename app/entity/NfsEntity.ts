import { DetalTomadorEntity } from "./PessoaEntity";
import { DetalServiceEntity } from "./ServiceEntity";
import { DetalPrestadorEntity } from "./CompanyEntity";


export class PrepararNfs {
    id_cliente?: number;
    id_servico?: number;
    id_empresa!: number;
    constructor({
        id_cliente,
        id_servico,
        id_empresa,

    }: {
        id_cliente?: number;
        id_servico?: number;
        id_empresa?: number;
    }) {
        Object.assign(this, {
            id_cliente,
            id_servico,
            id_empresa,
        });
    }
    copyWith({
        id_cliente,
        id_servico,
        id_empresa,
    }: {
        id_cliente?: number;
        id_servico?: number;
        id_empresa?: number;
    }): PrepararNfs {
        return new PrepararNfs({
            id_cliente: id_cliente ?? this.id_cliente,
            id_servico: id_servico ?? this.id_servico,
            id_empresa: id_empresa ?? this.id_empresa,

        });
    }
}
export class NfsEntity {
    id!: string;
    razao_social_cliente?: string;
    numero_rps?: string;
    razao_social_empresa?: string;
    total_valor_servico?: string;
    referencia?: string;
    competencia?: string;
    data_emissao?: string;
    regime_especial_tributacao?: string;
    prestador!: DetalPrestadorEntity;
    servico!: DetalServiceEntity;
    status_nota?: string;
    tomador!: DetalTomadorEntity;
    constructor({
        id,
        razao_social_cliente,
        numero_rps,
        razao_social_empresa,
        total_valor_servico,
        referencia,
        competencia,
        regime_especial_tributacao,
        prestador,
        servico,
        status_nota,
        data_emissao,
        tomador,

    }: {
        id?: string;
        razao_social_cliente?: string;
        razao_social_empresa?: string;
        total_valor_servico?: string;
        numero_rps?: string;
        data_emissao?: string;
        referencia?: string;
        competencia?: string;
        regime_especial_tributacao?: string;
        prestador: DetalPrestadorEntity;
        servico: DetalServiceEntity;
                status_nota?: string;

        tomador: DetalTomadorEntity;
    }) {
        Object.assign(this, {
            id,
            razao_social_cliente,
            razao_social_empresa,
            total_valor_servico,
            referencia,
            competencia,
            numero_rps,
            regime_especial_tributacao,
            prestador,
            data_emissao,
            servico,
            status_nota,
            tomador,
        });
    }
    copyWith({
        id,
        razao_social_cliente,
        razao_social_empresa,
        total_valor_servico,
        numero_rps,
        referencia,
        data_emissao,
        status_nota,
        competencia,
        regime_especial_tributacao,
        prestador,
        servico,
        tomador,
    }: {
        id?: string;
        razao_social_cliente?: string;
        numero_rps?: string;
        data_emissao?: string;
        razao_social_empresa?: string;
        total_valor_servico?: string;
        referencia?: string;
        competencia?: string;
        status_nota?: string;
        regime_especial_tributacao?: string;
        prestador?: DetalPrestadorEntity;
        servico?: DetalServiceEntity;
        tomador?: DetalTomadorEntity;
    }): NfsEntity {
        return new NfsEntity({
            id: id ?? this.id,
            referencia: referencia ?? this.referencia,
                        data_emissao: data_emissao ?? this.data_emissao,
                        status_nota: status_nota ?? this.status_nota,

            numero_rps: numero_rps ?? this.numero_rps,
            razao_social_cliente: razao_social_cliente ?? this.razao_social_cliente,
            razao_social_empresa: razao_social_empresa ?? this.razao_social_empresa,
            total_valor_servico: total_valor_servico ?? this.total_valor_servico,
            competencia: competencia ?? this.competencia,
            regime_especial_tributacao: regime_especial_tributacao ?? this.regime_especial_tributacao,
            prestador: prestador ?? this.prestador,
            servico: servico ?? this.servico,
            tomador: tomador ?? this.tomador,
        });
    }
};
