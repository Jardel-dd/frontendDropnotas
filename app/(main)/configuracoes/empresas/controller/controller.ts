import api from '@/app/services/api';
import '@/app/styles/styledGlobal.css';
import { CompanyEntity } from '../../../../entity/CompanyEntity';
import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

export const listEmpresa = async (
    listPaginationEmpresa: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    setLoading(true);
    try {
        const response = await api.get(
            `/empresa?page=${listPaginationEmpresa.pageable.pageNumber}&size=${listPaginationEmpresa.pageable.pageSize}&listarInativos=${listarInativos}&termo=${searchTerm}`
        );
        console.log('Dados retornados da API list:', response.data);
        return response.data;
    } finally {
        setLoading(false);
    }
};
export const updateEmpresa = async (
    empresaId: string,
    empresa: CompanyEntity,
    selectedUserConta: UsuarioContaEntity[],
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: any,
    router: AppRouterInstance,
    redirectAfterSave: boolean,
) => {
    try {
        const empresaParaEnviar = { ...empresa };
        if (empresaParaEnviar.cnpj) {
            empresaParaEnviar.cnpj = empresaParaEnviar.cnpj.replace(/\D/g, '');
        }
        const empresaData = {
            ...empresaParaEnviar,
            id_usuarios_acesso: selectedUserConta.map((usuario) => usuario.id),
            inscricao_estadual: empresaParaEnviar.inscricao_estadual ?? "",
            complemento: empresaParaEnviar.endereco.complemento ?? "",
            email: empresaParaEnviar.email ?? "",
            nome_pais: empresaParaEnviar.endereco.nome_pais ?? "",
            telefone: empresaParaEnviar.telefone ?? "",
            logo_empresa: empresaParaEnviar.logo_empresa ?? "",
            aliquota_iss: Number(empresaParaEnviar.aliquota_iss),
            proximo_numero_lote: Number(empresaParaEnviar.proximo_numero_lote),
            proximo_numero_rps: Number(empresaParaEnviar.proximo_numero_rps),
        };
        console.log(' enviado para o backend:', empresaData);
        const response = await api.put(`/empresa`, empresaData);
        const created = response?.data?.empresa ?? response?.data;
        console.log(' Resp do backend:', response?.data);
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Empresa atualizada com sucesso!',
        });
        if (redirectAfterSave) {
            router.push('/configuracoes/empresas');
        }
        return created;
    } catch (error: any) {
        console.error(' Erro ao atualizar empresa:', error);
        if (error.response) {
            console.error(' Dados enviados:', error.config?.data);
            console.error(' Status:', error.response.status);
            console.error(' Detalhes do erro:', error.response.data);
        }
        msgs.current?.show({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível atualizar esta empresa. Verifique os dados e tente novamente.',
        });
        if (error.response?.data?.errors) {
            setErrors(error.response.data.errors);
        }
    }
};
export const ativarEmpresa = async (
    empresaId: number,
    msgs: any,
    listPaginationEmpresa: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    try {
        await api.patch(`/empresa/${String(empresaId)}/ativar`);
        msgs.current.clear();
        msgs.current.show([
            {
                severity: 'success',
                summary: 'Sucesso',
                detail: `Empresa ativada com sucesso.`,
            },
        ]);
    } catch (error) {
        if (msgs.current) {
            msgs.current.clear();
            msgs.current.show([
                {

                    severity: 'error',
                    summary: 'Erro',
                    detail: `Houve um erro ao tentar ativar esta empresa, tente novamente.`,
                },
            ]);
        }
    }

};
export const deletarEmpresa = async (
    empresaId: number,
    msgs: any,
    listPaginationEmpresa: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    try {
        await api.delete(`/empresa/${String(empresaId)}`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Empresa excluída com sucesso.'
            },
        ]);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'error',
                summary: 'Erro',
                detail: 'Houve um erro ao tentar excluir esta empresa, tente novamente.'
            },
        ]);
    }
};
export const createdEmpresa = async (
    empresa: CompanyEntity,
    selectedUserConta: UsuarioContaEntity[],
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: any,
    router: AppRouterInstance,
    setEmpresa: React.Dispatch<React.SetStateAction<Partial<CompanyEntity>>>,
    setSelectedUserConta: React.Dispatch<React.SetStateAction<UsuarioContaEntity[]>>,
    redirectAfterSave: boolean,
) => {
    try {
        const empresaData = {
            ...empresa,
            cnpj: empresa.cnpj?.replace(/\D/g, ''),
            cep: empresa.endereco?.cep?.replace(/\D/g, '') || '',
            id_usuarios_acesso: selectedUserConta.map(usuario => usuario.id),
        };
        const response = await api.post('/empresa', empresaData);
        const created = response?.data?.empresa ?? response?.data;
        console.log("responde data created", response)
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Empresa cadastrada com sucesso!'
        });
        setEmpresa({});
        setSelectedUserConta([]);

        if (redirectAfterSave) {
            router.push('/configuracoes/empresas');
        }
        return created;
    } catch (error: any) {
        console.error("Erro inesperado:", error);

        let summaryMessage = 'Erro';
        let detailMessage = 'Ocorreu um erro ao cadastrar a empresa.';

        if (error.response) {
            const statusCode = error.response.status;

            if (statusCode === 400) {
                detailMessage = 'Senha do Certificado Digital inválida, por favor verifique.';
            } else {
                const backendMessage =
                    error.response.data?.message ||
                    error.response.data?.error ||
                    error.response.data?.mensagem ||
                    error.response.data?.detail;

                if (backendMessage) {
                    detailMessage = backendMessage;
                }
            }
        }
        else if (error.request) {
            summaryMessage = 'Erro de Rede';
            detailMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
        }
        else {
            summaryMessage = 'Erro Interno';
            detailMessage = error.message || 'Ocorreu um erro inesperado.';
        }
        msgs.current?.show({
            severity: 'error',
            summary: summaryMessage,
            detail: detailMessage,
            life: 6000,
        });
    }
};
export const convertLogoToBase64 = (
    files: File[],
    setEmpresa: React.Dispatch<React.SetStateAction<CompanyEntity>>,
    toast: React.RefObject<any>,
    msgs: React.RefObject<any>
) => {
    const file = files[0];
    if (!file) {

        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        const base64String = reader.result as string;
        setEmpresa((prevEmpresa) => prevEmpresa.copyWith({ logo_empresa: base64String }));
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Logo carregado com sucesso!',
        });
    };
    reader.onerror = () => {
        msgs.current?.show({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao processar o logo. Tente novamente!',
        });
        console.error('Erro ao ler o logo');
    };
    reader.readAsDataURL(file);
};
export const convertCertificadoToBase64 = (
    files: File[],
    setEmpresa: React.Dispatch<React.SetStateAction<CompanyEntity>>,
    toast: React.RefObject<any>,
    msgs: any,
    callback?: (updatedEmpresa: CompanyEntity) => void
) => {
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setEmpresa((prevEmpresa) => {
            const updated = prevEmpresa.copyWith({ certificado_digital: base64Data });
            callback?.(updated);
            return updated;
        });
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Certificado digital carregado com sucesso!',
        });
    };
    reader.onerror = () => {
        msgs.current?.show({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao processar o certificado. Tente novamente!',
        });
        console.error(`Erro ao ler o certificado`);
    };
    reader.readAsDataURL(file);
};
export const convertImageUrlToBase64 = async (
    imageUrl: string
): Promise<string | null> => {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => reject(null);
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Erro ao converter imagem para base64:", error);
        return null;
    }
};
export const handleActiveOrInativeEmpresa = async (
    rowData: CompanyEntity,
    msgs: any,
    listPaginationEmpresa: Record<string, any>,
    listarInativos: boolean,
    setLoading: (loading: boolean) => void,
    searchTerm: string,
    setListPaginationEmpresa: (data: any) => void
) => {
    try {
        if (rowData.ativo) {
            await deletarEmpresa(rowData.id!, msgs, listPaginationEmpresa, listarInativos, setLoading, searchTerm);
        } else {
            await ativarEmpresa(rowData.id!, msgs, listPaginationEmpresa, listarInativos, setLoading, searchTerm);

        }
        const refreshList = await listEmpresa(listPaginationEmpresa, listarInativos, setLoading, searchTerm);
        setListPaginationEmpresa(refreshList);
    } catch (error) {
        console.error("Erro ao ativar/desativar empresa:", error);
    }
};
