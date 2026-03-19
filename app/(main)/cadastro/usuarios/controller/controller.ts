import axios from 'axios';
import api from '@/app/services/api';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';

export const listUsuario = async (
    listPaginationUserConta: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    setLoading(true);
    try {
        const response = await api.get(
            `/usuario-conta?page=${listPaginationUserConta.pageable.pageNumber}&size=${listPaginationUserConta.pageable.pageSize}&listarInativos=${listarInativos}&termo=${searchTerm}`
        );
        console.log('status', listarInativos);
        console.log('Dados retornados da API list:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar User Conta:', error);
        throw error;
    } finally {
        setLoading(false);
    }
};
export const ativarUsuario = async (
    UserContaId: number,
    msgs: any,
    listPaginationUserConta: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    try {
        await api.patch(`/usuario-conta/${String(UserContaId)}/ativar`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'success',
                summary: 'Sucesso',
                detail: `Usuário Conta ativado com sucesso.`,
            },
        ]);
        await listUsuario(listPaginationUserConta, listarInativos, setLoading, searchTerm);
        console.log(`User Conta com ID ${UserContaId} ativada com sucesso.`);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'error',
                summary: 'Erro',
                detail: `Houve um erro ao tentar ativar este Usuário Conta, tente novamente.`,
            },
        ]);
        console.error(`Erro ao tentar ativar Usuário Conta com ID ${UserContaId}:`, error);
    }
};
export const createUsuario = async (
    userConta: UsuarioContaEntity,
    selectedEmpresa: CompanyEntity[],
    selectedPerfilUser: PerfilUser | null,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: any,
    router: AppRouterInstance,
    setUserConta: React.Dispatch<React.SetStateAction<UsuarioContaEntity>>,
    setSelectedEmpresa: React.Dispatch<React.SetStateAction<CompanyEntity[]>>,
    setSelectedPerfilUser: React.Dispatch<React.SetStateAction<PerfilUser | null>>,
) => {
    try {
        const userDataToSend = {
            ...userConta,
            id_perfil_usuario: selectedPerfilUser?.id,
            id_empresas_acesso: selectedEmpresa.map(usuario => usuario.id),
        };
        console.log('Dados enviados para criação:', userDataToSend);
        const response = await api.post('/usuario-conta', userDataToSend);
        console.log('Resposta da API após criação:', response.data);
        msgs.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Usuário cadastrado com sucesso!' });
        router.push('/cadastro/usuarios');
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const { data } = error.response;
            const errorMessage = data.message || 'Erro ao cadastrar usuário.';
            msgs.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: String(errorMessage),
            });
        } else {
            msgs.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao cadastrar usuário.',
            });
        }
    }
};
export const updateUsuario = async (
    userContaId: string,
    userConta: UsuarioContaEntity,
    confirmPassword: string,
    selectedEmpresa: CompanyEntity[] | null,
    selectedPerfilUser: PerfilUser | null,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: any,
    router: AppRouterInstance,
    setUserConta: React.Dispatch<React.SetStateAction<UsuarioContaEntity>>,
    setSelectedEmpresa: React.Dispatch<React.SetStateAction<CompanyEntity[]>>,
    setSelectedPerfilUser: React.Dispatch<React.SetStateAction<PerfilUser | null>>,
) => {
    if (selectedPerfilUser === null) {
        msgs.current?.show({ severity: 'error', summary: 'Erro', detail: 'Perfil de usuário não selecionado.' });
        return;
    }
    try {
        const userContaData = {
            ...userConta,
            id_perfil_usuario: selectedPerfilUser.id,
            perfilUsuario: selectedPerfilUser,
        };
        await api.put(`/usuario-conta/alterar-email`, userContaData);
        msgs.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'O Usuario Conta atualizado com sucesso!' });
        router.push('/cadastro/usuarios');
    } catch (error) {
        msgs.current?.show({ severity: 'error', summary: 'Erro', detail: 'Não foi possível atualizar o Usuario Conta. Tente novamente.' });
    }
};
export const deletarUsuario = async (
    UserContaId: number,
    msgs: any,
    listPaginationUserConta: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    try {
        await api.delete(`/usuario-conta/${String(UserContaId)}`);
         msgs.current?.clear();
        msgs.current?.show([
            {
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Usuário excluído com sucesso.'
            },
        ]);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                severity: 'error',
                summary: 'Erro',
                detail: 'Houve um erro ao tentar excluir o Usuário, tente novamente.'
            },
        ]);
        await listUsuario(listPaginationUserConta, listarInativos, setLoading, searchTerm);
    }
};
export const convertProfileUserToBase64 = (
    files: File[],
    setUserConta: React.Dispatch<React.SetStateAction<any>>,
    toast: any,
    msgs: any
) => {
    const file = files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        const base64String = reader.result as string;
        setUserConta((prev: any) => ({
            ...prev,
            foto_perfil: base64String,
        }));
        msgs.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Foto de perfil carregada com sucesso!' });
    };
    reader.onerror = () => {
        msgs.current?.show({ severity: 'error', summary: 'Error', detail: 'Erro ao processar a Foto de Perfil. Tente novamente!' });
        console.error(`Erro ao ler o logo`);
    };

    reader.readAsDataURL(file);
};
export const handleActiveOrInativeUserConta = async (
    rowData: UsuarioContaEntity,
    msgs: any,
    listPaginationUserConta: Record<string, any>,
    listarInativos: boolean,
    setLoading: (loading: boolean) => void,
    searchTerm: string,
    setListPaginationUserConta: (data: any) => void
) => {
    try {
        if (rowData.ativo) {
            await deletarUsuario(rowData.id!, msgs, listPaginationUserConta, listarInativos, setLoading, searchTerm);
        } else {
            await ativarUsuario(rowData.id!, msgs, listPaginationUserConta, listarInativos, setLoading, searchTerm);

        }
        const refreshList = await listUsuario(listPaginationUserConta, listarInativos, setLoading, searchTerm);
        setListPaginationUserConta(refreshList);
    } catch (error) {
        console.error("Erro ao ativar/desativar UserConta:", error);
    }
};
export const fetchUserConta = async (): Promise<UsuarioContaEntity[]> => {
    try {
        const idsResponse = await api.get('/usuario-conta');
        let usuariosConta = [];
        if (Array.isArray(idsResponse.data)) {
            usuariosConta = idsResponse.data;
        } else if (idsResponse.data && Array.isArray(idsResponse.data.content)) {
            usuariosConta = idsResponse.data.content;
        } else {
            throw new Error("Dados recebidos de /usuario-conta não são um array ou não contêm um array na propriedade 'content'");
        }
        return usuariosConta.map((user: any) => ({
            id: user.id,
            nome: user.nome || 'Nome não disponível',
        }));
    } catch (error) {
        console.error('Erro ao buscar usuários do endpoint /usuario-conta:', error);
        return [];
    }
};
export const fetchUserContaCreated = async (userContaID: string) => {
  try {
    const { data: userConta } = await api.get(`/usuario-conta/${userContaID}`);
    console.log("Dados do Usuário:", userConta);
    const { data: perfilResponse } = await api.get("/perfil-usuario");
    const perfisRaw = Array.isArray(perfilResponse?.content)
      ? perfilResponse.content
      : Array.isArray(perfilResponse)
        ? perfilResponse
        : [];
    const perfilOptions = perfisRaw.map((p: any) => ({
      id: p.id,
      nome: p.nome || "Nome não disponível",
    }));
    const perfilIdDoUsuario = userConta?.id_perfil_usuario; 
    const perfilSelecionadoRaw =
      perfisRaw.find((p: any) => p?.id === perfilIdDoUsuario) ?? null;
    const perfilDefault =  new PerfilUser({
                   ativo: true,
                   id: 0,
                   nome: '',
                   perfilUsuario: false,
                   perfilUsuarioCadastrar: false,
                   perfilUsuarioAlterar: false,
                   perfilUsuarioDesativar: false,
                   perfilUsuarioPesquisar: false,
                   usuarioConta: false,
                   usuarioContaCadastrar: false,
                   usuarioContaAlterar: false,
                   usuarioContaDesativar: false,
                   usuarioContaPesquisar: false,
                   empresa: false,
                   empresaCadastrar: false,
                   empresaAlterar: false,
                   empresaDesativar: false,
                   empresaPesquisar: false,
                   pessoa: false,
                   pessoaCadastrar: false,
                   pessoaAlterar: false,
                   pessoaDesativar: false,
                   pessoaPesquisar: false,
                   vendedor: false,
                   vendedorCadastrar: false,
                   vendedorAlterar: false,
                   vendedorDesativar: false,
                   vendedorPesquisar: false,
                   servico: false,
                   servicoCadastrar: false,
                   servicoAlterar: false,
                   servicoDesativar: false,
                   servicoPesquisar: false,
                   ordemServico: false,
                   ordemServicoCadastrar: false,
                   ordemServicoAlterar: false,
                   ordemServicoDesativar: false,
                   ordemServicoPesquisar: false,
                   ordemServicoTipoVisualizacao: '',
                   contrato: false,
                   contratoCadastrar: false,
                   contratoAlterar: false,
                   contratoDesativar: false,
                   contratoPesquisar: false,
                   contratoTipoVisualizacao: '',
                   categoriaContrato: false,
                   categoriaContratoCadastrar: false,
                   categoriaContratoAlterar: false,
                   categoriaContratoDesativar: false,
                   categoriaContratoPesquisar: false,
                   formaPagamento: false,
                   formaPagamentoCadastrar: false,
                   formaPagamentoAlterar: false,
                   formaPagamentoDesativar: false,
                   formaPagamentoPesquisar: false,
                   nfseTipoVisualizacao:''
               });
    const perfilUser = perfilSelecionadoRaw
      ? new PerfilUser({ ...perfilDefault, ...perfilSelecionadoRaw })
      : perfilDefault;
    const { data: empresaResponse } = await api.get("/empresa");
    const empresaRaw = Array.isArray(empresaResponse?.content) ? empresaResponse.content : [];
    const empresaListFormatada: CompanyEntity[] = empresaRaw.map((e: any) => ({
      id: e.id,
      razao_social: e.razao_social || "Nome não disponível",
    }));
    const selectedEmpresa: CompanyEntity[] = Array.isArray(userConta?.id_empresas_acesso)
      ? empresaListFormatada.filter((e) => userConta.id_empresas_acesso.includes(e.id))
      : [];
    const empresaDefault = new CompanyEntity({
      id: 0,
      id_usuarios_acesso: [0],
      cnpj: '',
      razao_social: '',
      nome_fantasia: '',
      logo_empresa: '',
      atividade_principal: '',
      inscricao_estadual: '',
      inscricao_municipal: '',
      codigo_regime_tributario: '',
      tipo_rps: '',
      endereco: {} as EnderecoEntity,
      cnaes_secundarios: ['0'],
      certificado_digital: '',
      data_vencimento_certificado_digital: '',
      senha_certificado_digital: '',
      nome_certificado_digital: '',
      serie_emissao_nfse: '',
      proximo_numero_rps: null,
      proximo_numero_lote: null,
      aliquota_iss: null,
      cnae_fiscal: '',
      prestacao_sus: false,
      regime_especial_tributacao: '',
      incentivo_fiscal: false,
      email: '',
      telefone: '',
      ativo: true,
      aliquota_pis: 0,
      aliquota_cofins: 0,
      aliquota_inss: 0,
      aliquota_ir: 0,
      aliquota_csll: 0,
      aliquota_outras_retencoes: 0,
      aliquota_deducoes: 0,
      percentual_desconto_incondicionado: 0,
      percentual_desconto_condicionado: 0,
    });
    const empresa =
      selectedEmpresa.length > 0
        ? new CompanyEntity({ ...empresaDefault, ...selectedEmpresa[0] })
        : empresaDefault;
    return {
      userConta,
      perfilUser,         
      perfilOptions,      
      empresa,             
      empresaList: empresaListFormatada,
      selectedEmpresa,
    };
  } catch (error) {
    console.error("Erro ao buscar usuário, perfis ou empresas:", error);
    throw error;
  }
};
export const fetchFilteredUserConta = async (query: string): Promise<UsuarioContaEntity[]> => {
    try {
        const response = await api.get('/usuario-conta', {
            params: {
                termo: query 
            }
        });
        return response.data.content || [];
    } catch (error) {
        console.error("Erro ao buscar Usuario Conta filtradas:", error);
        return [];
    }
};
