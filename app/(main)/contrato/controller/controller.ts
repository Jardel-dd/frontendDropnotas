import axios from 'axios';
import api from '@/app/services/api';
import {  PessoaEntity } from '@/app/entity/PessoaEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { ContratoEntity } from '@/app/entity/ContratoEntity';
import { FormaPagamentoEntity } from '@/app/entity/FormaPagamento';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { CategoryContratosEntity } from '@/app/entity/CategoryContratEntity';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { ApiListItem } from '../types/contratos';

export const listContrato = async (
    listPaginationContratos: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    setLoading(true);
    try {
        const response = await api.get(
            `/contrato?page=${listPaginationContratos.pageable.pageNumber}&size=${listPaginationContratos.pageable.pageSize}&listarInativos=${listarInativos}&termo=${searchTerm}`
        );
        console.log('status', listarInativos);
        console.log('Dados retornados da API list:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar Contratos:', error);
        throw error;
    } finally {
        setLoading(false);
    }
};
export const ativarContrato = async (
    ContratoId: number,
    msgs: any,
    listPaginationContratos: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    try {
        await api.patch(`/contrato/${String(ContratoId)}/ativar`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'success',
                summary: 'Sucesso',
                detail: `Contrato ativado com sucesso.`,
            },
        ]);
        await listContrato(listPaginationContratos, listarInativos, setLoading, searchTerm);
        console.log(`Contrato com ID ${ContratoId} ativada com sucesso.`);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'error',
                summary: 'Erro',
                detail: `Houve um erro ao tentar ativar este Contrato, tente novamente.`,
            },
        ]);
        console.error(`Erro ao tentar ativar Contrato com ID ${ContratoId}:`, error);
    }
};
export const deletarContrato = async (
    ContratoId: number,
    msgs: any,
    listPaginationContratos: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    try {
        await api.delete(`/contrato/${String(ContratoId)}`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Contrato excluído com sucesso.'
            },
        ]);
        fetch
        setTimeout(() => {
            msgs.current?.clear();
        }, 20000);
        console.log(`Contrato com ID ${ContratoId} excluída com sucesso.`);
        await listContrato(listPaginationContratos, listarInativos, setLoading, searchTerm);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'error',
                summary: 'Erro',
                detail: 'Houve um erro ao tentar excluir este Contrato, tente novamente.'
            },
        ]);
        setTimeout(() => {
            msgs.current?.clear();
        }, 2000);
        console.error(`Erro ao tentar excluir o Usuário Conta  com ID ${ContratoId}:`, error);
    }
};
export const createContrato = async (
    contrato: ContratoEntity,
    selectedCategoriaContrato: CategoryContratosEntity | null,
    selectedCompany: CompanyEntity,
    selectedFormadePagamento: FormaPagamentoEntity,
    selectedPessoa: PessoaEntity[],
    setSelectedCategoriaContrato: React.Dispatch<React.SetStateAction<CategoryContratosEntity | null>>,
    setSelectedCompany: React.Dispatch<React.SetStateAction<CompanyEntity | null>>,
    setSelectedFormadePagamento: React.Dispatch<React.SetStateAction<FormaPagamentoEntity| null>>,
    setSelectedPessoa: React.Dispatch<React.SetStateAction<PessoaEntity[]>>,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: any,
    router: AppRouterInstance,
) => {
    try {
        const contratoDataToSend = {
            ...contrato,
            id_forma_pagamento: selectedFormadePagamento.id,
            id_empresa: selectedCompany.id,
            id_categoria_contrato: selectedCategoriaContrato?.id,
            id_clientes_contrato: selectedPessoa.map(usuario => usuario.id),
        };
        console.log('Enviando dados do contrato:', contratoDataToSend);
        const response = await api.post('/contrato', contratoDataToSend);
        console.log('Resposta da API após criação:', response.data);
        msgs.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Contrato cadastrado com sucesso!' });
        setSelectedFormadePagamento(null);
        setSelectedCompany(null)
        setSelectedCategoriaContrato(null);
        router.push('/contrato');
    } catch (error) {
        console.error('Erro ao cadastrar contrato:', error);
        if (axios.isAxiosError(error) && error.response) {
            const { data, status } = error.response;
            console.log('Erro da resposta do backend:', error);
            const errorMessage = data.message || 'Erro ao cadastrar Contrato.';
            msgs.current?.show({
                severity: 'error',
                summary: `Erro ${status}`,
                detail: String(errorMessage),
            });
        } else {
            msgs.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro inesperado ao cadastrar Contrato.',
            });
        }
    }
};
export const updateContrato = async (
    contratoID: string,
    contrato: ContratoEntity,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: any,
    router: AppRouterInstance,
    setContrato: React.Dispatch<React.SetStateAction<ContratoEntity>>,
) => {
    try {
        const contratoDataToUpdate = {
            ...contrato,
        };
        await api.put(`/contrato`, contratoDataToUpdate);
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Contrato atualizado com sucesso!',
        });
        router.push('/contrato');
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            const { status, data } = error.response;
            const errorMessage = data.message || 'Erro ao atualizar Contrato.';
            console.error("Erro de API:", status, data);
            msgs.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: String(errorMessage),
            });
        } else {
            console.error("Erro inesperado:", error);
            msgs.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro inesperado ao atualizar Contrato.',
            });
        }
    }
};
export const handleActiveOrInativeContrato = async (
    rowData: ContratoEntity,
    msgs: any,
    listPaginationContrato: Record<string, any>,
    listarInativos: boolean,
    setLoading: (loading: boolean) => void,
    searchTerm: string,
    setListPaginationContrato: (data: any) => void
) => {
    try {
        if (rowData.ativo) {
            await deletarContrato(rowData.id!, msgs, listPaginationContrato, listarInativos, setLoading, searchTerm);
        } else {
            await ativarContrato(rowData.id!, msgs, listPaginationContrato, listarInativos, setLoading, searchTerm);
        }
        const refreshList = await listContrato(listPaginationContrato, listarInativos, setLoading, searchTerm);
        setListPaginationContrato(refreshList);
    } catch (error) {
        console.error("Erro ao ativar/desativar Contrato:", error);
    }
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
const fetchList = async <T>(
    endpoint: string,
    mapFn: (item: ApiListItem) => T
): Promise<T[]> => {
    const { data } = await api.get(endpoint);
    const list: ApiListItem[] = Array.isArray(data.content) ? data.content : [];
    return list.map(mapFn);
};
