import api from '@/app/services/api';
import '@/app/styles/styledGlobal.css';
import { CompanyEntity } from '../../../../entity/CompanyEntity';
import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

const BASE64_IMAGE_DATA_URL_REGEX = /^data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=\s]+$/i;
const IMAGE_URL_REGEX = /^(https?:\/\/|blob:|\/)/i;
const RAW_BASE64_REGEX = /^[A-Za-z0-9+/=\s]+$/;

const blobToDataUrl = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Nao foi possivel ler o blob da imagem.'));
        reader.readAsDataURL(blob);
    });

const getLogoUrlCandidates = (imageUrl: string): string[] => {
    const trimmedUrl = imageUrl.trim();

    if (!trimmedUrl) {
        return [];
    }
    const candidates = [trimmedUrl];

    try {
        const parsedUrl = new URL(trimmedUrl);

        if (parsedUrl.hostname === 'backend.dropnotas.com' && parsedUrl.port === '2712') {
            const withoutPortUrl = new URL(trimmedUrl);
            withoutPortUrl.port = '';
            candidates.push(withoutPortUrl.toString());
        }
    } catch {
        return candidates;
    }

    return Array.from(new Set(candidates));
};

const inferImageMimeTypeFromBase64 = (base64Value: string): string | null => {
    const normalizedValue = base64Value.replace(/\s/g, '');

    if (normalizedValue.startsWith('iVBORw0KGgo')) {
        return 'image/png';
    }
    if (normalizedValue.startsWith('/9j/')) {
        return 'image/jpeg';
    }
    if (normalizedValue.startsWith('R0lGOD')) {
        return 'image/gif';
    }
    if (normalizedValue.startsWith('UklGR')) {
        return 'image/webp';
    }
    if (normalizedValue.startsWith('Qk')) {
        return 'image/bmp';
    }
    if (normalizedValue.startsWith('AAABAA')) {
        return 'image/x-icon';
    }
    if (normalizedValue.startsWith('PHN2Zy') || normalizedValue.startsWith('PD94bWwg')) {
        return 'image/svg+xml';
    }

    return null;
};

const normalizeLogoEmpresaForBackend = async (logoEmpresa?: string | null): Promise<string> => {
    const logoNormalizado = logoEmpresa?.trim() ?? '';

    if (!logoNormalizado) {
        return '';
    }
    if (BASE64_IMAGE_DATA_URL_REGEX.test(logoNormalizado)) {
        return logoNormalizado;
    }
    if (IMAGE_URL_REGEX.test(logoNormalizado)) {
        const convertedLogo = await convertImageUrlToBase64(logoNormalizado);

        if (convertedLogo) {
            return convertedLogo;
        }

        throw new Error('Nao foi possivel converter o logo da empresa para o formato Base64 esperado.');
    }

    const rawBase64 = logoNormalizado.replace(/\s/g, '');

    if (RAW_BASE64_REGEX.test(rawBase64)) {
        const inferredMimeType = inferImageMimeTypeFromBase64(rawBase64) ?? 'image/png';

        return `data:${inferredMimeType};base64,${rawBase64}`;
    }

    return logoNormalizado;
};

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
    logoAlterada: boolean,
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
        const logoEmpresaAtual = empresaParaEnviar.logo_empresa?.trim() ?? '';
        const shouldSkipLogoOnUpdate = !logoAlterada && IMAGE_URL_REGEX.test(logoEmpresaAtual);

        if (shouldSkipLogoOnUpdate) {
            delete (empresaParaEnviar as Partial<CompanyEntity>).logo_empresa;
        } else {
            empresaParaEnviar.logo_empresa = await normalizeLogoEmpresaForBackend(empresaParaEnviar.logo_empresa);
        }
        const empresaData = {
            ...empresaParaEnviar,
            id_usuarios_acesso:
                selectedUserConta.length > 0
                    ? selectedUserConta.map((usuario) => usuario.id)
                    : empresaParaEnviar.id_usuarios_acesso ?? [],
            inscricao_estadual: empresaParaEnviar.inscricao_estadual ?? "",
            complemento: empresaParaEnviar.endereco.complemento ?? "",
            email: empresaParaEnviar.email ?? "",
            nome_pais: empresaParaEnviar.endereco.nome_pais ?? "",
            telefone: empresaParaEnviar.telefone ?? "",
            aliquota_iss: Number(empresaParaEnviar.aliquota_iss),
            proximo_numero_lote: Number(empresaParaEnviar.proximo_numero_lote),
            proximo_numero_rps: Number(empresaParaEnviar.proximo_numero_rps),
            ...(shouldSkipLogoOnUpdate ? {} : { logo_empresa: empresaParaEnviar.logo_empresa ?? "" }),
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
        const logoEmpresaNormalizado = await normalizeLogoEmpresaForBackend(empresa.logo_empresa);
        const empresaData = {
            ...empresa,
            cnpj: empresa.cnpj?.replace(/\D/g, ''),
            cep: empresa.endereco?.cep?.replace(/\D/g, '') || '',
            logo_empresa: logoEmpresaNormalizado,
            id_usuarios_acesso:
                selectedUserConta.length > 0
                    ? selectedUserConta.map((usuario) => usuario.id)
                    : empresa.id_usuarios_acesso ?? [],
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
    const imageCandidates = getLogoUrlCandidates(imageUrl);

    try {
        for (const candidate of imageCandidates) {
            try {
                const response = await api.get(candidate, {
                    responseType: 'blob',
                    headers: {
                        Accept: 'image/*',
                    },
                });
                const blob = response.data as Blob;

                if (blob?.type?.startsWith('image/')) {
                    return await blobToDataUrl(blob);
                }
            } catch (error) {
                console.error('Erro ao buscar imagem da logo:', candidate, error);
            }
        }
    } catch (error) {
        console.error("Erro ao converter imagem para base64:", error);
    }

    return null;
};

export const resolveLogoEmpresaSource = async (imageUrl?: string | null): Promise<string> => {
    const logoSource = imageUrl?.trim() ?? '';

    if (!logoSource) {
        return '';
    }
    if (BASE64_IMAGE_DATA_URL_REGEX.test(logoSource)) {
        return logoSource;
    }

    const logoInBase64 = await convertImageUrlToBase64(logoSource);

    if (logoInBase64) {
        return logoInBase64;
    }

    const imageCandidates = getLogoUrlCandidates(logoSource);
    return imageCandidates[imageCandidates.length - 1] ?? logoSource;
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
export const listTheCompany = async () => {
    try {
        const response = await api.get('/empresa');
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar Company contrato:", error);
        return [];
    }
};
export const fetchCompanyByID = async (empresaId: string) => {
    try {
        const response = await api.get(`/empresa/${empresaId}`);
        const data = response.data;
        console.log("empresa", data)
        return {
            empresa: data,
            userConta: [],
            selectedUserConta: [],
        };
    } catch (error) {
        console.error("Erro ao buscar empresa:", error);
        throw error;
    }
};
export const fetchCompanyDropdownByID = async (empresaId: string): Promise<CompanyEntity | null> => {
    try {
        const response = await api.get(`/empresa/${empresaId}`);
        return response.data ?? null;
    } catch (error) {
        console.error("Erro ao buscar empresa por ID:", error);
        return null;
    }
};
export const fetchFilteredCompany = async (filtro: string) => {
    try {
        const response = await api.get(`/empresa`, {
            params: {
                termo: filtro
            }
        });
        console.log(" Empresa filtradas:", response.data);
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
};
export const fetchAllCompany = async (): Promise<CompanyEntity[]> => {
    try {
        const response = await api.get('/empresa');
        return response.data.content || [];
    } catch (error) {
        console.error("Erro ao buscar todas as vendedor:", error);
        return [];
    }
};
