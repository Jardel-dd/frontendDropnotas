'use client'
import axios from "axios";
import api from "@/app/services/api";
import { PessoaEntity } from "@/app/entity/PessoaEntity";
import { searchByCep } from "@/app/utils/searchCEP/controller";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

export const listPessoa = async (
    listPaginationClientesFornecedores: Record<string, any>,
    listarInativos: boolean,
    cliente: boolean,
    fornecedor: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    setLoading(true);
    try {
        const response = await api.get(
            `/pessoa?page=${listPaginationClientesFornecedores.pageable.pageNumber}&size=${listPaginationClientesFornecedores.pageable.pageSize}&listarInativos=${listarInativos}&cliente=${cliente}&fornecedor=${fornecedor}&termo=${searchTerm}`
        );
        console.log('status', listarInativos);
        console.log('Dados retornados da API list:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar Cliente ou Fornecedor:', error);
        throw error;
    } finally {
        setLoading(false);
        console.log('loading.....');
    }
};
export const updatePessoa = async (
    pessoaId: string,
    pessoa: PessoaEntity,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: any,
    router: AppRouterInstance,
    setPessoa: React.Dispatch<React.SetStateAction<PessoaEntity>>,
) => {
    console.log('Dados pessoa):', pessoa);
    try {
        const pessoaDataToUpdate = {
            ...pessoa,
        };
        await api.put(`/pessoa`, pessoaDataToUpdate);
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Pessoa atualizado com sucesso!',
        });
        router.push('/cadastro/clientesFornecedores');
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            const { status, data } = error.response;
            const errorMessage = data.message || 'Erro ao atualizar Pessoa.';
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
                detail: 'Erro inesperado ao atualizar Pessoa.',
            });
        }
    }
};
export const ativarPessoa = async (
    clientesFornecedoresId: number,
    msgs: any,
    listPaginationClientesFornecedoresId: Record<string, any>,
    listarInativos: boolean,
    cliente: boolean,
    fornecedor: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    try {
        await api.patch(`/pessoa/${String(clientesFornecedoresId)}/ativar`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                className: 'messages-center',
                sticky: true,
                severity: 'success',
                summary: 'Sucesso',
                detail: `Cliente ou Fornecedor ativado com sucesso.`,
            },
        ]);
        setTimeout(() => {
            msgs.current?.clear();
        }, 2000);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                className: 'messages-center',
                sticky: true,
                severity: 'error',
                summary: 'Erro',
                detail: `Houve um erro ao tentar ativar este Cliente ou Fornecedor , tente novamente.`,
            },
        ]);
        await listPessoa(listPaginationClientesFornecedoresId, listarInativos, cliente, fornecedor, setLoading, searchTerm);
        console.error(`Erro ao tentar ativar este Cliente ou Fornecedor com ID ${clientesFornecedoresId}:`, error);
    }
};
export const deletarPessoa = async (
    clientesFornecedoresId: number,
    msgs: any,
    listPaginationClientesFornecedoresId: Record<string, any>,
    cliente: boolean,
    fornecedor: boolean,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    try {
        await api.delete(`/pessoa/${String(clientesFornecedoresId)}`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Cliente ou Fornecedor excluído com sucesso.'
            },
        ]);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                severity: 'error',
                summary: 'Erro',
                detail: 'Houve um erro ao tentar excluir o Cliente ou Fornecedor, tente novamente.'
            },
        ]);
        await listPessoa(listPaginationClientesFornecedoresId, listarInativos, cliente, fornecedor, setLoading, searchTerm);
    }
};
export const createdPessoa = async (
    pessoa: PessoaEntity,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: React.MutableRefObject<any>,
    router: AppRouterInstance,
    setPessoa: React.Dispatch<React.SetStateAction<PessoaEntity>>,
    redirectAfterSave: boolean,
) => {
    try {
        const pessoaData = {
            ...pessoa,
            cnpj: pessoa.cnpj && pessoa.cnpj.replace(/\D/g, '').length > 0 ? pessoa.cnpj : null,
            cpf: pessoa.cpf && pessoa.cpf.replace(/\D/g, '').length > 0 ? pessoa.cpf : null,
        };
        const response = await api.post('/pessoa', pessoaData);
        const created = new PessoaEntity(response.data?.pessoa ?? response.data);
        console.log(response);
        msgs.current?.show({
            severity: 'success',
            detail: 'Cliente ou Fornecedor criado com sucesso!',
        });
        if (redirectAfterSave) {
        router.push('/cadastro/clientesFornecedores');
        }
        setPessoa(created);
        return created;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            const { data } = error.response;
            console.log(" resposta:", data);
            const errorMessage = data.message || 'Erro ao cadastrar Pessoa.';
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
                detail: 'Erro inesperado ao cadastrar Pessoa.',
            });
        }
    }
};
export const handleSearchCepPessoa = async (
    cep: string,
    setLoading: (state: boolean) => void,
    setPessoa: React.Dispatch<React.SetStateAction<PessoaEntity>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    msgs: any
) => {
    setLoading(true);
    try {
        const data = await searchByCep(cep, msgs);
        if (data) {
            setPessoa((prevPessoa) =>
                prevPessoa.copyWith({
                    endereco: {
                        ...prevPessoa.endereco,
                        cep: data.cep || prevPessoa.endereco?.cep,
                        logradouro: data.logradouro || prevPessoa.endereco?.logradouro,
                        complemento: data.complemento || prevPessoa.endereco?.complemento || "",
                        codigo_municipio: data.codigoMunicipio || prevPessoa.endereco?.codigo_municipio,
                        bairro: data.bairro || prevPessoa.endereco?.bairro,
                        municipio: data.municipio || prevPessoa.endereco?.municipio,
                        codigo_pais: data.idPais || prevPessoa.endereco?.codigo_pais,
                        uf: data.uf || prevPessoa.endereco?.uf,
                    }
                })
            );

        } else {
            setError('CEP não encontrado. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        if (msgs.current) {
            msgs.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'CEP não encontrado, verifique ou inclua o endereço manualmente!',
            });
        }
        setError('Erro ao buscar CEP. Por favor, tente novamente.');
    } finally {
        setLoading(false);
    }
};
export const handleActiveOrInativeClientesFornecedores = async (
    rowData: PessoaEntity,
    msgs: any,
    listPaginationClientesFornecedoresId: Record<string, any>,
    listarInativos: boolean,
    cliente: boolean,
    fornecedor: boolean,
    setLoading: (loading: boolean) => void,
    searchTerm: string,
    setListPaginationClientesFornecedores: (data: any) => void
) => {
    try {
        if (rowData.ativo) {
            await deletarPessoa(rowData.id!, msgs, listPaginationClientesFornecedoresId, listarInativos, cliente, fornecedor, setLoading, searchTerm);
        } else {
            await ativarPessoa(rowData.id!, msgs, listPaginationClientesFornecedoresId, listarInativos, cliente, fornecedor, setLoading, searchTerm);

        }
        const refreshList = await listPessoa(listPaginationClientesFornecedoresId, listarInativos, cliente, fornecedor, setLoading, searchTerm);
        setListPaginationClientesFornecedores(refreshList);
    } catch (error) {
        console.error("Erro ao ativar/desativar Cliente ou fornecedor:", error);
    }
};

