import axios from 'axios';
import { RefObject } from 'react';
import api from '@/app/services/api';
import { Messages } from 'primereact/messages';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { ContratoEntity } from '@/app/entity/ContratoEntity';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { FormaPagamentoEntity } from '@/app/entity/FormaPagamento';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { CategoryContratosEntity } from '@/app/entity/CategoryContratEntity';
export const listContrato = async (
    listPaginationContratos: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string,
    msgs?: RefObject<Messages | null>
) => {
    setLoading(true);
    try {
        const response = await api.get(
            `/contrato?page=${listPaginationContratos.pageable.pageNumber}&size=${listPaginationContratos.pageable.pageSize}&listarInativos=${listarInativos}&termo=${searchTerm}`
        );
        console.log('status', listarInativos);
        console.log('Dados retornados da API list:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Erro ao buscar Contratos:', error);
        if (error.response?.status === 403) {
            msgs?.current?.clear();
            msgs?.current?.show({
                severity: 'warn',
                summary: 'Acesso negado',
                detail: 'Voce nao possui permissao para visualizar Contratos.',
                life: 6000
            });
            return {
                content: [],
                pageable: {
                    pageNumber: listPaginationContratos.pageable.pageNumber ?? 0,
                    pageSize: listPaginationContratos.pageable.pageSize ?? 10
                },
                totalElements: 0,
                totalPages: 0,
                last: true,
                first: true,
                empty: true
            };
        }
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
                summary: 'Sucesso:',
                detail: `Contrato ativado com sucesso.`,
            },
        ]);
        await listContrato(listPaginationContratos, listarInativos, setLoading, searchTerm, msgs);
        console.log(`Contrato com ID ${ContratoId} ativada com sucesso.`);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'error',
                summary: 'Atenção:',
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
                summary: 'Sucesso:',
                detail: 'Contrato excluido com sucesso.'
            },
        ]);
        setTimeout(() => {
            msgs.current?.clear();
        }, 20000);
        console.log(`Contrato com ID ${ContratoId} excluida com sucesso.`);
        await listContrato(listPaginationContratos, listarInativos, setLoading, searchTerm, msgs);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'error',
                summary: 'Atenção:',
                detail: 'Houve um erro ao tentar excluir este Contrato, tente novamente.'
            },
        ]);
        setTimeout(() => {
            msgs.current?.clear();
        }, 2000);
        console.error(`Erro ao tentar excluir o Usuario Conta com ID ${ContratoId}:`, error);
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
    setSelectedFormadePagamento: React.Dispatch<React.SetStateAction<FormaPagamentoEntity | null>>,
    setSelectedPessoa: React.Dispatch<React.SetStateAction<PessoaEntity[]>>,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: any,
    router: AppRouterInstance,
    redirectAfterSave = true,
) => {
    try {
        const contratoDataToSend = {
            ...contrato,
            id_forma_pagamento: selectedFormadePagamento.id,
            id_empresa: selectedCompany.id,
            id_categoria_contrato: selectedCategoriaContrato?.id,
            id_clientes_contrato: selectedPessoa.length > 0 ? selectedPessoa.map((pessoa) => pessoa.id) : (contrato.id_clientes_contrato ?? []),
        };
        console.log('Enviando dados do contrato:', contratoDataToSend);
        const response = await api.post('/contrato', contratoDataToSend);
        console.log('Resposta da API apos criacao:', response.data);
        const created = response?.data?.contrato ?? response?.data;
        msgs.current?.show({ severity: 'success', summary: 'Sucesso:', detail: 'Contrato cadastrado com sucesso!' });
        setSelectedFormadePagamento(null);
        setSelectedCompany(null);
        setSelectedCategoriaContrato(null);
        setSelectedPessoa([]);
        if (redirectAfterSave) {
            router.push('/contrato');
        }
        return created;
    } catch (error) {
        console.error('Erro ao cadastrar contrato:', error);
        if (axios.isAxiosError(error) && error.response) {
            const { data, status } = error.response;
            console.log('Erro da resposta do backend:', error);
            const errorMessage = data.message || 'Erro ao cadastrar Contrato.';
            msgs.current?.show({
                severity: 'error',
                summary: `Atenção: ${status}`,
                detail: String(errorMessage),
            });
        } else {
            msgs.current?.show({
                severity: 'error',
                summary: 'Atenção:',
                detail: 'Erro inesperado ao cadastrar Contrato.',
            });
        }
        return null;
    }
};
export const updateContrato = async (
    contratoID: string,
    contrato: ContratoEntity,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: any,
    router: AppRouterInstance,
    setContrato: React.Dispatch<React.SetStateAction<ContratoEntity>>,
    redirectAfterSave = true,
) => {
    try {
        const contratoDataToUpdate = {
            ...contrato,
        };
        const response = await api.put(`/contrato`, contratoDataToUpdate);
        const responseData = response?.data;
        const responseContrato =
            responseData &&
            typeof responseData === 'object' &&
            'contrato' in responseData
                ? (responseData as { contrato?: ContratoEntity | Record<string, unknown> }).contrato
                : null;
        const updated =
            (responseContrato && typeof responseContrato === 'object' ? responseContrato : null) ??
            (responseData && typeof responseData === 'object' ? responseData : null) ?? {
            ...contratoDataToUpdate,
            id: Number(contratoID)
        };
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso:',
            detail: 'Contrato atualizado com sucesso!',
        });
        setContrato(new ContratoEntity(updated));
        if (redirectAfterSave) {
            router.push('/contrato');
        }
        return updated;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            const { status, data } = error.response;
            const errorMessage = data.message || 'Erro ao atualizar Contrato.';
            console.error('Erro de API:', status, data);
            msgs.current?.show({
                severity: 'error',
                summary: 'Atenção:',
                detail: String(errorMessage),
            });
        } else {
            console.error('Erro inesperado:', error);
            msgs.current?.show({
                severity: 'error',
                summary: 'Atenção:',
                detail: 'Erro inesperado ao atualizar Contrato.',
            });
        }
        return null;
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
        const refreshList = await listContrato(listPaginationContrato, listarInativos, setLoading, searchTerm, msgs);
        setListPaginationContrato(refreshList);
    } catch (error) {
        console.error('Erro ao ativar/desativar Contrato:', error);
    }
};
export const fetchContratosById = async (contratoID: string) => {
    try {
        const { data: dataContrato } = await api.get(`/contrato/${contratoID}`);
        console.log('Contrato selecionado:', dataContrato);
        const contratoInstanciado = new ContratoEntity(dataContrato);
        const clientesContrato = Array.isArray(dataContrato?.clientes_contrato)
            ? dataContrato.clientes_contrato
            : [];
        const pessoasResumo = Array.isArray(dataContrato?.pessoasResumo)
            ? dataContrato.pessoasResumo
            : dataContrato?.pessoaResumo
              ? [dataContrato.pessoaResumo]
              : [];
        let selectedPessoa: PessoaEntity[] = clientesContrato
            .filter((cliente: Pick<PessoaEntity, 'id' | 'razao_social' | 'nome_fantasia'> | null) => !!cliente?.id)
            .map((cliente: Pick<PessoaEntity, 'id' | 'razao_social' | 'nome_fantasia'>) => ({
                id: cliente.id,
                razao_social: cliente.razao_social ?? cliente.nome_fantasia ?? 'Nome nao disponivel',
                nome_fantasia: cliente.nome_fantasia ?? cliente.razao_social ?? 'Nome nao disponivel'
            } as PessoaEntity));

        if (selectedPessoa.length === 0) {
            selectedPessoa = pessoasResumo
                .filter((pessoaResumo: Pick<PessoaEntity, 'id' | 'razao_social' | 'nome_fantasia'> | null) => !!pessoaResumo?.id)
                .map((pessoaResumo: Pick<PessoaEntity, 'id' | 'razao_social' | 'nome_fantasia'>) => ({
                    id: pessoaResumo.id,
                    razao_social: pessoaResumo.razao_social ?? pessoaResumo.nome_fantasia ?? 'Nome nao disponivel',
                    nome_fantasia: pessoaResumo.nome_fantasia ?? pessoaResumo.razao_social ?? 'Nome nao disponivel'
                } as PessoaEntity));
        }

        const selectedEmpresa = dataContrato?.id_empresa
            ? ({
                id: dataContrato.id_empresa,
                razao_social: dataContrato.razao_social_empresa ?? 'Empresa selecionada',
                nome_fantasia: dataContrato.nome_fantasia_empresa ?? dataContrato.razao_social_empresa ?? 'Empresa selecionada'
            } as CompanyEntity)
            : null;

        const selectedService = dataContrato?.id_servico
            ? ({
                id: dataContrato.id_servico,
                descricao: dataContrato.descricao_servico ?? 'Servico selecionado'
            } as ServiceEntity)
            : null;

        const selectedFormaPagamento = dataContrato?.id_forma_pagamento
            ? ({
                id: dataContrato.id_forma_pagamento,
                descricao: dataContrato.descricao_forma_pagamento ?? 'Forma de pagamento selecionada'
            } as FormaPagamentoEntity)
            : null;

        const selectedCategoriaContrato = dataContrato?.id_categoria_contrato &&
            (dataContrato.descricao_categoria_contrato ||
                dataContrato.nome_categoria_contrato ||
                dataContrato.categoria_contrato?.descricao)
            ? ({
                id: dataContrato.id_categoria_contrato,
                descricao:
                    dataContrato.descricao_categoria_contrato ??
                    dataContrato.nome_categoria_contrato ??
                    dataContrato.categoria_contrato?.descricao,
                ativo: true
            } as CategoryContratosEntity)
            : null;

        if (selectedPessoa.length === 0 && Array.isArray(dataContrato?.id_clientes_contrato) && dataContrato.id_clientes_contrato.length > 0) {
            const pessoasCarregadas = await Promise.all(
                dataContrato.id_clientes_contrato.map(async (pessoaId: number) => {
                    try {
                        const { data: dataPessoa } = await api.get(`/pessoa/${pessoaId}`);
                        return {
                            id: dataPessoa.id,
                            razao_social: dataPessoa.razao_social ?? 'Nome nao disponivel'
                        } as PessoaEntity;
                    } catch (pessoaError) {
                        console.error('Erro ao buscar pessoa do contrato:', pessoaError);
                        return null;
                    }
                })
            );

            selectedPessoa = pessoasCarregadas.filter((pessoa): pessoa is PessoaEntity => pessoa !== null);
        }

        return {
            dataContrato: contratoInstanciado,
            empresaList: [],
            serviceList: [],
            categoriaList: [],
            formaPagamentoList: [],
            selectedEmpresa,
            selectedService,
            selectedCategoriaContrato,
            selectedFormaPagamento,
            pessoa: selectedPessoa,
            selectedPessoa,
        };
    } catch (error) {
        console.error('Erro ao buscar contrato:', error);
        throw error;
    }
};
export const listTheContrato = async () => {
    try {
        const response = await api.get('/contrato');
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar contrato:", error);
        return [];
    }
};
export const fetchAllContrato = async () => {
       try {
        const response = await api.get('/contrato');
        return response.data.content || [];
    } catch (error) {
        console.error("Erro ao buscar contratos:", error);
        return [];
    }
};
export const fetchFilteredContrato = async (filtro: string) => {
    try {
        const response = await api.get(`/contrato`, {
            params: {
                termo: filtro
            }
        });
        console.log("Contrato filtrados:", response.data);
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        console.log("Erro ao filtrar Contrato :", error);
        return [];
    }
};
export const fetchContratoByID  = async (contratoId: string) => {
    try {
        const response = await api.get(`/contrato/${contratoId}`);
        const data = response.data;
        return {
            contrato: data,
        };
    } catch (error) {
        console.error("Erro ao buscar Contrato:", error);
        throw error;
    }
};
