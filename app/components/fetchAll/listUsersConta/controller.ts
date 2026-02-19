import api from "@/app/services/api";
import { CompanyEntity } from "@/app/entity/CompanyEntity";
import { EnderecoEntity } from "@/app/entity/enderecoEntity";
import { PerfilUser } from "@/app/entity/PerfilUsuarioEntity";
import { UsuarioContaEntity } from "@/app/entity/UsuarioContaEntity";

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
export const fetchAllVendedores = async (): Promise<UsuarioContaEntity[]> => {
    try {
        const response = await api.get('/usuario-conta');
        return response.data.content || [];
    } catch (error) {
        console.error("Erro ao buscar todas as vendedor:", error);
        return [];
    }
};