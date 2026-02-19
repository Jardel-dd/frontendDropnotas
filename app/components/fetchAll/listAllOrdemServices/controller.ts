import { CategoryContratosEntity } from "@/app/entity/CategoryContratEntity";
import { CompanyEntity } from "@/app/entity/CompanyEntity";
import { FormaPagamentoEntity } from "@/app/entity/FormaPagamento";
import { PessoaEntity } from "@/app/entity/PessoaEntity";
import { ServiceEntity } from "@/app/entity/ServiceEntity";
import { ServiceOrderEntity } from "@/app/entity/ServiceOrderEntity";
import { VendedorEntity } from "@/app/entity/VendedorEntity";
import api from "@/app/services/api";
type ApiListItem = { id: string;[key: string]: any };
const fetchList = async <T>(
    endpoint: string,
    mapFn: (item: ApiListItem) => T
): Promise<T[]> => {
    const { data } = await api.get(endpoint);
    const list: ApiListItem[] = Array.isArray(data.content) ? data.content : [];
    return list.map(mapFn);
};
export const fetchOrdemServiceByID = async (ordemServicoID: string) => {
    try {
        const { data: dataOrdemServico } = await api.get(`/ordem-servico/${ordemServicoID}`);
        console.log("dataOrdemServico selecionado:", dataOrdemServico);
        const ordemServico = new ServiceOrderEntity(dataOrdemServico);
        const empresaList = await fetchList<CompanyEntity>("/empresa", e => e as unknown as CompanyEntity);
        const selectedEmpresa = empresaList.find(e => e.id === dataOrdemServico.id_empresa) ?? null;
        const vendedorList = await fetchList<VendedorEntity>("/vendedor", e => e as unknown as VendedorEntity);
        const selectedVendedor = vendedorList.find(e => e.id === dataOrdemServico.id_vendedor) ?? null;
        const serviceList = await fetchList<ServiceEntity>("/servico", s => s as unknown as ServiceEntity);
        const selectedService = serviceList.find(
            s => s.id === dataOrdemServico.servicos?.[0]?.id
        ) ?? null;


        const categoriaList = await fetchList<CategoryContratosEntity>("/categoria-contrato", c => c as unknown as CategoryContratosEntity);
        const selectedCategoriaContrato = categoriaList.find(c => c.id === dataOrdemServico.id_categoria_contrato) ?? null;
        const formaPagamentoList = await fetchList<FormaPagamentoEntity>("/forma-pagamento", f => f as unknown as FormaPagamentoEntity);
        const selectedFormaPagamento = formaPagamentoList.find(f => f.id === dataOrdemServico.id_forma_pagamento) ?? null;
        const clienteList = await fetchList<PessoaEntity>("/pessoa", f => f as unknown as PessoaEntity);
        const selectedCliente = clienteList.find(f => f.id === dataOrdemServico.id_cliente) ?? null;
        return {
            dataOrdemServico: ordemServico,
            empresaList,
            serviceList,
            vendedorList,
            categoriaList,
            clienteList,
            formaPagamentoList,
            selectedEmpresa,
            selectedCliente,
            selectedService,
            selectedVendedor,
            selectedCategoriaContrato,
            selectedFormaPagamento,
        };
    } catch (error) {
        console.error("❌ Erro ao buscar contrato:", error);
        throw error;
    }
};

export const fetchOrdemServiceBy1 = async (ordemServicoID: string) => {
    try {
        const response = await api.get(`/ordem-servico/${ordemServicoID}`);
        const data = response.data;
        return {
            ordemServico: data,
        };
    } catch (error) {
        console.error("Erro ao buscar Forma dePagamento:", error);
        throw error;
    }
};