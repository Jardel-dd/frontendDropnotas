import { validateFieldsVendedor } from "@/app/(main)/cadastro/vendedores/controller/validate";
import { UsuarioContaEntity } from "@/app/entity/UsuarioContaEntity";
import { searchByCNPJ } from "@/app/utils/search/searchCNPJ/controller";

export const handleSearchCNPJ = async <
  T extends {
    cnpj: string| null;
    endereco: {
      cep?: string;
      logradouro?: string;
      complemento?: string;
      bairro?: string;
      municipio?: string;
      uf?: string;
      codigo_municipio?: string;
      nome_pais?: string;
      codigo_pais?: string;
      numero?: string;
    };
    [key: string]: any;
  }
>(
  cnpj: string,
  setState: React.Dispatch<React.SetStateAction<T>>,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  msgs: any,
  selectedUserConta?: UsuarioContaEntity[],
  setTouchedFields?: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>

) => {
  try {
    const cnpjOnlyNumbers = cnpj.replace(/\D/g, '');
    const data = await searchByCNPJ(cnpjOnlyNumbers);
    if (data) {
      setState((prevState) => ({
        ...prevState,
        cnpj: data.cnpj || prevState.cnpj,
        razao_social: data.razao_social || prevState.razao_social,
        nome_fantasia: data.nome_fantasia?.trim() || prevState.nome_fantasia,
        atividade_principal: data.atividade_principal?.trim() || prevState.atividade_principal,
        inscricao_municipal: data.inscricao_municipal || prevState.inscricao_municipal,
        codigo_regime_tributario: data.codigo_regime_tributario || prevState.codigo_regime_tributario,
        telefone: data.telefone || prevState.telefone,
        proximo_numero_rps: data.proximo_numero_rps || prevState.proximo_numero_rps,
        proximo_numero_lote: data.proximo_numero_lote || prevState.proximo_numero_lote,
        serie_emissao_nfse: data.serie_emissao_nfse || prevState.serie_emissao_nfse,
        aliquota_iss: data.aliquota_iss || prevState.aliquota_iss,
        regime_especial_tributacao: data.regime_especial_tributacao ?? prevState.regime_especial_tributacao,
        incentivo_fiscal: data.incentivo_fiscal ?? prevState.incentivo_fiscal,
        certificado_digital: data.certificado_digital ?? prevState.certificado_digital,
        prestacao_sus: data.prestacao_sus ?? prevState.prestacao_sus,
        numero: data.numero || prevState.numero,
        endereco: {
          ...prevState.endereco,
          cep: data.endereco?.cep ?? prevState.endereco?.cep ?? '',
          logradouro: data.endereco?.logradouro ?? prevState.endereco?.logradouro ?? '',
          complemento: data.endereco?.complemento ?? prevState.endereco?.complemento ?? '',
          bairro: data.endereco?.bairro ?? prevState.endereco?.bairro ?? '',
          municipio: data.endereco?.municipio ?? prevState.endereco?.municipio ?? '',
          uf: data.endereco?.uf ?? prevState.endereco?.uf ?? '',
          codigo_municipio: data.endereco?.codigo_municipio ?? prevState.endereco?.codigo_municipio ?? '',
          nome_pais: data.endereco?.nome_pais ?? prevState.endereco?.nome_pais ?? '',
          codigo_pais: data.endereco?.codigo_pais ?? prevState.endereco?.codigo_pais ?? '',
          numero: data.endereco?.numero ?? prevState.endereco?.numero ?? '',
        }

      }));
      if (setTouchedFields) {
        setTouchedFields(prev => ({
          ...prev,
          telefone: true,
          cnpj: true,
        }));
      }
      if (setTouchedFields) {
        validateFieldsVendedor({
          ...data,
          telefone: data.telefone || '',
          cnpj: data.cnpj || ''
        }, setErrors, msgs);
      }
    }
  } catch (error) {
    if (msgs?.current?.show) {
      msgs.current.show({
        severity: 'error',
        detail: 'CNPJ não encontrado. Verifique ou inclua manualmente os dados da empresa.',
      });
    }
    setErrors(prev => ({
      ...prev,
      error: 'Erro ao buscar CNPJ. Por favor, tente novamente.',
    }));
  }
};
