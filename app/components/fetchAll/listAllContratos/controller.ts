import api from "@/app/services/api";
import { PessoaEntity } from "@/app/entity/PessoaEntity";
import { CompanyEntity } from "@/app/entity/CompanyEntity";
import { ServiceEntity } from "@/app/entity/ServiceEntity";
import { ContratoEntity } from "@/app/entity/ContratoEntity";
import { FormaPagamentoEntity } from "@/app/entity/FormaPagamento";
import { CategoryContratosEntity } from "@/app/entity/CategoryContratEntity";

type ApiListItem = { id: string;[key: string]: any };
const fetchList = async <T>(
    endpoint: string,
    mapFn: (item: ApiListItem) => T
): Promise<T[]> => {
    const { data } = await api.get(endpoint);
    const list: ApiListItem[] = Array.isArray(data.content) ? data.content : [];
    return list.map(mapFn);
};

export const fetchContratosById = async (contratoID: string) => {
    try {
        const { data: dataContrato } = await api.get(`/contrato/${contratoID}`);
        console.log("Contrato selecionado:", dataContrato);
        const contratoInstanciado = new ContratoEntity(dataContrato);
        const empresaList = await fetchList<CompanyEntity>("/empresa", e => e as unknown as CompanyEntity);
        const selectedEmpresa = empresaList.find(e => e.id === dataContrato.id_empresa) ?? null;
        const serviceList = await fetchList<ServiceEntity>("/servico", s => s as unknown as ServiceEntity);
        const selectedService = serviceList.find(s => s.id === dataContrato.id_servico) ?? null;
        const categoriaList = await fetchList<CategoryContratosEntity>("/categoria-contrato", c => c as unknown as CategoryContratosEntity);
        const selectedCategoriaContrato = categoriaList.find(c => c.id === dataContrato.id_categoria_contrato) ?? null;
        const formaPagamentoList = await fetchList<FormaPagamentoEntity>("/forma-pagamento", f => f as unknown as FormaPagamentoEntity);
        const selectedFormaPagamento = formaPagamentoList.find(f => f.id === dataContrato.id_forma_pagamento) ?? null;
        const idsResponse = await api.get("/pessoa");
        let pessoa = [];
        if (Array.isArray(idsResponse.data)) {
            pessoa = idsResponse.data;
        } else if (idsResponse.data && Array.isArray(idsResponse.data.content)) {
            pessoa = idsResponse.data.content;
        }
        const idsData: PessoaEntity[] = pessoa.map((user: any) => ({
            id: user.id,
            razao_social: user.razao_social || "Nome não disponível",
        }));
        let selectedPessoa: PessoaEntity[] = [];
        if (Array.isArray(dataContrato.id_clientes_contrato)) {
            selectedPessoa = idsData.filter(user => dataContrato.id_clientes_contrato.includes(user.id));
        }
        return {
            dataContrato: contratoInstanciado,
            empresaList,
            serviceList,
            categoriaList,
            formaPagamentoList,
            selectedEmpresa,
            selectedService,
            selectedCategoriaContrato,
            selectedFormaPagamento,
            pessoa: idsData,
            selectedPessoa: selectedPessoa,
        };
    } catch (error) {
        console.error("Erro ao buscar contrato:", error);
        throw error;
    }
};
