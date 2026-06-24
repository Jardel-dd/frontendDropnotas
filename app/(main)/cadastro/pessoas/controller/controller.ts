'use client'
import axios from "axios";
import { useCallback } from "react";
import api from "@/app/services/api";
import { PessoaEntity } from "@/app/entity/PessoaEntity";
import { VendedorEntity } from "@/app/entity/VendedorEntity";
import { ContratoEntity } from "@/app/entity/ContratoEntity";
import { searchByCep } from "@/app/utils/searchCEP/controller";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { buildMobilePickerPageResult } from "@/app/shared/PageMobile/pageMobile";

const nullableString = (value?: string | null) => {
    if (value === undefined || value === null) return null;
    return value.trim().length > 0 ? value : null;
};
const buildPessoaPayload = (pessoa: PessoaEntity) => ({
    ...pessoa,
    cnpj: pessoa.cnpj && pessoa.cnpj.replace(/\D/g, '').length > 0 ? pessoa.cnpj : null,
    cpf: pessoa.cpf && pessoa.cpf.replace(/\D/g, '').length > 0 ? pessoa.cpf : null,
    email: (pessoa.email ?? '').trim(),
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
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar Cliente ou Fornecedor:', error);
        throw error;
    } finally {
        setLoading(false);
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
                detail: 'Cliente ou Fornecedor excluÃ­do com sucesso.'
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
        const response = await api.post('/pessoa', pessoaData);
        const created = new PessoaEntity(response.data?.pessoa ?? response.data);

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
            setError('CEP nÃ£o encontrado. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        if (msgs.current) {
            msgs.current.show({
                severity: 'error',
                summary: 'Atenção:',
                detail: 'CEP nÃ£o encontrado, verifique ou inclua o endereÃ§o manualmente!',
            });
        }
        setError('Erro ao buscar CEP. Por favor, tente novamente.');
    } finally {
        setLoading(false);
    }
};
const handleActiveOrInativePessoa = async (
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
export const fetchFilteredPessoas = async (termo: string) => {
    try {
        const response = await api.get(`/pessoa`, {
            params: {
                termo
            }
        });

        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content.map((user: any) => ({
                id: user.id,
                razao_social: user.razao_social || 'Nome nÃ£o disponÃ­vel',
            }));
        }

        return [];
    } catch (error) {
        console.error("Erro ao filtrar clientes:", error);
        return [];
    }
};
export const fetchPessoasById = async (pessoaId: string) => {
    try {
        const { data: dataPessoa } = await api.get(`/pessoa/${pessoaId}`);
        console.log('APIeditar pessoa:', dataPessoa);
        const pessoaInstanciada = new PessoaEntity(dataPessoa);
        const vendedorResumo = dataPessoa?.vendedor_padrao ?? dataPessoa?.vendedor ?? null;
        const contratoResumo = dataPessoa?.contrato ?? null;
        const selectedVendedor: VendedorEntity | null = vendedorResumo
            ? ({
                id: vendedorResumo.id ?? dataPessoa.id_vendedor_padrao,
                razao_social: vendedorResumo.razao_social ?? vendedorResumo.nome ?? 'Nome nÃ£o disponÃ­vel'
            } as VendedorEntity)
            : null;
        const selectedContrato: ContratoEntity | null = contratoResumo
            ? new ContratoEntity({
                id: contratoResumo.id ?? dataPessoa.id_contrato ?? 0,
                descricao: contratoResumo.descricao ?? '',
                valor_servico: contratoResumo.valor_servico ?? null,
                periodicidade: contratoResumo.periodicidade ?? '',
                emitir_boleto: contratoResumo.emitir_boleto ?? false,
                enviar_email: contratoResumo.enviar_email ?? false,
                enviar_whatsapp: contratoResumo.enviar_whatsapp ?? false,
                id_servico: contratoResumo.id_servico ?? null,
                id_empresa: contratoResumo.id_empresa ?? null,
                id_categoria_contrato: contratoResumo.id_categoria_contrato ?? null,
                id_forma_pagamento: contratoResumo.id_forma_pagamento ?? null,
                id_clientes_contrato: contratoResumo.id_clientes_contrato ?? [0]
            })
            : null;

        return {
            dataPessoa: pessoaInstanciada,
            selectedVendedor,
            selectedContrato,
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
        }
        return [];
    } catch (error) {
        console.error("Erro ao buscar serviÃ§os:", error);
        return [];
    }
};
export const handleActiveOrInativeClientesFornecedores = handleActiveOrInativePessoa;
export const fetchPessoaMobilePage = async ({
    searchTerm: termo,
    page,
    size
}: {
    searchTerm: string;
    page: number;
    size: number;
}) => {
    const response = await api.get('/pessoa', {
        params: {
            page,
            size,
            termo: termo || undefined
        }
    });

    return buildMobilePickerPageResult<PessoaEntity>(response.data);
};
