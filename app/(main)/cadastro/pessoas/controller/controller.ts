'use client'
import axios from "axios";
import api from "@/app/services/api";
import { PessoaEntity } from "@/app/entity/PessoaEntity";
import { searchByCep } from "@/app/utils/searchCEP/controller";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { VendedorEntity } from "@/app/entity/VendedorEntity";

const nullableString = (value?: string | null) => {
    if (value === undefined || value === null) return null;
    return value.trim().length > 0 ? value : null;
};
const buildPessoaPayload = (pessoa: PessoaEntity) => ({
    ...pessoa,
    cnpj: pessoa.cnpj && pessoa.cnpj.replace(/\D/g, '').length > 0 ? pessoa.cnpj : null,
    cpf: pessoa.cpf && pessoa.cpf.replace(/\D/g, '').length > 0 ? pessoa.cpf : null,
    cnae_fiscal: nullableString(pessoa.cnae_fiscal),
    inscricao_estadual: nullableString(pessoa.inscricao_estadual),
    inscricao_municipal: nullableString(pessoa.inscricao_municipal),
});
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
    redirectAfterSave = true,
) => {
    try {
        const pessoaDataToUpdate = buildPessoaPayload(pessoa);
        console.log('Dados pessoa):', pessoaDataToUpdate);
        const response = await api.put(`/pessoa`, pessoaDataToUpdate);
        const responseData = response?.data;
        const responsePessoa =
            responseData &&
            typeof responseData === 'object' &&
            'pessoa' in responseData
                ? (responseData as { pessoa?: PessoaEntity | Record<string, unknown> }).pessoa
                : null;
        const updated =
            (responsePessoa && typeof responsePessoa === 'object' ? responsePessoa : null) ??
            (responseData && typeof responseData === 'object' ? responseData : null) ?? {
                ...pessoaDataToUpdate,
                id: Number(pessoaId)
            };
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso:',
            detail: 'Pessoa atualizado com sucesso!',
        });
        setPessoa(new PessoaEntity(updated));
        if (redirectAfterSave) {
            router.push('/cadastro/pessoas');
        }
        return updated;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            const { status, data } = error.response;
            const errorMessage = data.message || 'Erro ao atualizar Pessoa.';
            console.error("Erro de API:", status, data);
            msgs.current?.show({
                severity: 'error',
                summary: 'Atenção:',
                detail: String(errorMessage),
            });
        } else {
            console.error("Erro inesperado:", error);
            msgs.current?.show({
                severity: 'error',
                summary: 'Atenção:',
                detail: 'Erro inesperado ao atualizar Pessoa.',
            });
        }
        return null;
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
                severity: 'success',
                summary: 'Sucesso:',
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
                severity: 'error',
                summary: 'Atenção:',
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
                life: 3000,
                severity: 'success',
                summary: 'Sucesso:',
                detail: 'Cliente ou Fornecedor excluído com sucesso.'
            },
        ]);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                severity: 'error',
                summary: 'Atenção:',
                detail: 'Houve um erro ao tentar excluir o Cliente ou Fornecedor, tente novamente.'
            },
        ]);
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
        const pessoaData = buildPessoaPayload(pessoa);
        console.log('Dados pessoa):', pessoaData);
        const response = await api.post('/pessoa', pessoaData);
        const created = new PessoaEntity(response.data?.pessoa ?? response.data);
        console.log(response);
        msgs.current?.show({
            severity: 'success',
            detail: 'Cliente ou Fornecedor criado com sucesso!',
        });
        if (redirectAfterSave) {
        router.push('/cadastro/pessoas');
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
                summary: 'Atenção:',
                detail: String(errorMessage),
            });
        } else {
            console.error("Erro inesperado:", error);
            msgs.current?.show({
                severity: 'error',
                summary: 'Atenção:',
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
                summary: 'Atenção:',
                detail: 'CEP não encontrado, verifique ou inclua o endereço manualmente!',
            });
        }
        setError('Erro ao buscar CEP. Por favor, tente novamente.');
    } finally {
        setLoading(false);
    }
};
export const handleActiveOrInativePessoa = async (
    rowData: PessoaEntity,
    msgs: any,
    listPaginationPessoaId: Record<string, any>,
    listarInativos: boolean,
    cliente: boolean,
    fornecedor: boolean,
    setLoading: (loading: boolean) => void,
    searchTerm: string,
    setListPaginationClientesFornecedores: (data: any) => void
) => {
    try {
        if (rowData.ativo) {
            await deletarPessoa(rowData.id!, msgs, listPaginationPessoaId, listarInativos, cliente, fornecedor, setLoading, searchTerm);
        } else {
            await ativarPessoa(rowData.id!, msgs, listPaginationPessoaId, listarInativos, cliente, fornecedor, setLoading, searchTerm);
        }
        const refreshList = await listPessoa(listPaginationPessoaId, listarInativos, cliente, fornecedor, setLoading, searchTerm);
        setListPaginationClientesFornecedores(refreshList);
    } catch (error) {
        console.error("Erro ao ativar/desativar Cliente ou fornecedor:", error);
    }
};
export const fetchAllPessoas = async (): Promise<PessoaEntity[]> => {
    try {
        const idsResponse = await api.get('/pessoa');
                console.log('[fetchAllPessoas] response.data:', idsResponse.data);
        let pessoas = [];
        if (Array.isArray(idsResponse.data)) {
            pessoas = idsResponse.data;
        } else if (idsResponse.data && Array.isArray(idsResponse.data.content)) {
            pessoas = idsResponse.data.content;
        } else {
            throw new Error("Dados recebidos");
        }
        return pessoas.map((user: any) => ({
            id: user.id,
            razao_social: user.razao_social || 'Nome não disponível',
        }));
    } catch (error) {
        console.error('Erro ao buscar pessoas do endpoint /pessoas:', error);
        return [];
    }
};
export const fetchFilteredPessoas = async (termo: string) => {
    try {
        const response = await api.get(`/pessoa`, {
            params: {
                termo: termo
            }
        });
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content.map((user: any) => ({
                id: user.id,
                razao_social: user.razao_social || 'Nome não disponível',
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao filtrar clientes:", error);
        return [];
    }
};
export const fetchPessoasById = async (pessoaId: string) => {
    try {
        const { data: dataPessoa } = await api.get(`/pessoa/${pessoaId}`);
        console.log("Pessoa selecionada:", dataPessoa);
        const pessoaInstanciada = new PessoaEntity(dataPessoa);
        const vendedorResumo = dataPessoa?.vendedor_padrao ?? dataPessoa?.vendedor ?? null;
        const selectedVendedor: VendedorEntity | null = vendedorResumo
            ? ({
                id: vendedorResumo.id ?? dataPessoa.id_vendedor_padrao,
                razao_social: vendedorResumo.razao_social ?? vendedorResumo.nome ?? 'Nome não disponível'
            } as VendedorEntity)
            : null;
        return {
            dataPessoa: pessoaInstanciada,
            selectedVendedor,
        };
    } catch (error) {
        console.error(" Erro ao buscar cliente/fornecedor:", error);
        throw error;
    }
};
export const listThePessoas = async () => {
    try {
        const response = await api.get("/pessoa");
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar serviços:", error);
        return [];
    }
};
export const handleActiveOrInativeClientesFornecedores = handleActiveOrInativePessoa;
