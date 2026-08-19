import { validateFieldsVendedor } from "@/app/(main)/cadastro/vendedores/controller/validate";
import { UsuarioContaEntity } from "@/app/entity/UsuarioContaEntity";
import { searchByCNPJ, searchByCertificate } from "@/app/utils/search/searchCNPJ/controller";

type SearchCompanyAddress = {
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
} | null | undefined;

type SearchCompanyData = {
  cnpj: string | null;
  cnae_fiscal?: string | null;
  endereco: SearchCompanyAddress;
  razao_social?: string;
  nome_fantasia?: string;
  atividade_principal?: string;
  inscricao_estadual?: string | null;
  inscricao_municipal?: string | null;
  codigo_regime_tributario?: string;
  telefone?: string;
  proximo_numero_rps?: number | null;
  proximo_numero_lote?: number | null;
  serie_emissao_nfse?: string;
  aliquota_iss?: number | null;
  aliquota_pis?: number | null;
  aliquota_cofins?: number | null;
  aliquota_inss?: number | null;
  aliquota_ir?: number | null;
  aliquota_csll?: number | null;
  aliquota_outras_retencoes?: number | null;
  tipo_rps?: string;
  regime_especial_tributacao?: string;
  incentivo_fiscal?: boolean;
  certificado_digital?: string | null;
  senha_certificado_digital?: string | null;
  webservice_usuario?: string | null;
  webservice_senha?: string | null;
  webservice_chaveacesso?: string | null;
  prestacao_sus?: boolean;
  numero?: string;
};

type SearchCompanyState = {
  cnpj: string | null;
  cnae_fiscal?: string | null;
  endereco: SearchCompanyAddress;
  razao_social?: string;
  nome_fantasia?: string;
  atividade_principal?: string;
  inscricao_estadual?: string | null;
  inscricao_municipal?: string | null;
  codigo_regime_tributario?: string;
  telefone?: string;
  proximo_numero_rps?: number | null;
  proximo_numero_lote?: number | null;
  serie_emissao_nfse?: string;
  aliquota_iss?: number | null;
  aliquota_pis?: number | null;
  aliquota_cofins?: number | null;
  aliquota_inss?: number | null;
  aliquota_ir?: number | null;
  aliquota_csll?: number | null;
  aliquota_outras_retencoes?: number | null;
  tipo_rps?: string;
  regime_especial_tributacao?: string;
  incentivo_fiscal?: boolean;
  certificado_digital?: string | null;
  senha_certificado_digital?: string | null;
  webservice_usuario?: string | null;
  webservice_senha?: string | null;
  webservice_chaveacesso?: string | null;
  prestacao_sus?: boolean;
  numero?: string;
};

const isEmptyValue = (value: unknown) =>
  value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

const keepCurrentIfFilled = <T>(currentValue: T, fetchedValue: T) =>
  isEmptyValue(currentValue) ? fetchedValue : currentValue;

const keepCurrentIfDefaultValue = <T>(currentValue: T, fetchedValue: T) => {
  if (typeof currentValue === 'number' && typeof fetchedValue === 'number') {
    return currentValue === 0 && fetchedValue !== 0 ? fetchedValue : currentValue;
  }

  if (typeof currentValue === 'boolean' && typeof fetchedValue === 'boolean') {
    return currentValue === false && fetchedValue === true ? fetchedValue : currentValue;
  }

  return keepCurrentIfFilled(currentValue, fetchedValue);
};

const hasCopyWith = (value: unknown): value is { copyWith: (updates: Record<string, unknown>) => unknown } =>
  Boolean(value && typeof (value as { copyWith?: unknown }).copyWith === 'function');

const applyCompanyDataToState = <T extends SearchCompanyState>(
  data: SearchCompanyData,
  setState: React.Dispatch<React.SetStateAction<T>>
) => {
  setState((prevState) => {
    const nextState = {
      cnpj: keepCurrentIfFilled(prevState.cnpj, data.cnpj || prevState.cnpj),
      razao_social: keepCurrentIfFilled(prevState.razao_social, data.razao_social || prevState.razao_social),
      nome_fantasia: keepCurrentIfFilled(prevState.nome_fantasia, data.nome_fantasia?.trim() || prevState.nome_fantasia),
      atividade_principal: keepCurrentIfFilled(prevState.atividade_principal, data.atividade_principal?.trim() || prevState.atividade_principal),
      inscricao_estadual: keepCurrentIfFilled(prevState.inscricao_estadual, data.inscricao_estadual ?? prevState.inscricao_estadual),
      inscricao_municipal: keepCurrentIfFilled(prevState.inscricao_municipal, data.inscricao_municipal || prevState.inscricao_municipal),
      codigo_regime_tributario: keepCurrentIfFilled(prevState.codigo_regime_tributario, data.codigo_regime_tributario || prevState.codigo_regime_tributario),
      telefone: keepCurrentIfFilled(prevState.telefone, data.telefone || prevState.telefone),
      proximo_numero_rps: keepCurrentIfDefaultValue(prevState.proximo_numero_rps, data.proximo_numero_rps ?? prevState.proximo_numero_rps),
      proximo_numero_lote: keepCurrentIfDefaultValue(prevState.proximo_numero_lote, data.proximo_numero_lote ?? prevState.proximo_numero_lote),
      serie_emissao_nfse: keepCurrentIfFilled(prevState.serie_emissao_nfse, data.serie_emissao_nfse || prevState.serie_emissao_nfse),
      aliquota_iss: keepCurrentIfFilled(prevState.aliquota_iss, data.aliquota_iss ?? prevState.aliquota_iss),
      aliquota_pis: keepCurrentIfDefaultValue(prevState.aliquota_pis, data.aliquota_pis ?? prevState.aliquota_pis),
      aliquota_cofins: keepCurrentIfDefaultValue(prevState.aliquota_cofins, data.aliquota_cofins ?? prevState.aliquota_cofins),
      aliquota_inss: keepCurrentIfDefaultValue(prevState.aliquota_inss, data.aliquota_inss ?? prevState.aliquota_inss),
      aliquota_ir: keepCurrentIfDefaultValue(prevState.aliquota_ir, data.aliquota_ir ?? prevState.aliquota_ir),
      aliquota_csll: keepCurrentIfDefaultValue(prevState.aliquota_csll, data.aliquota_csll ?? prevState.aliquota_csll),
      aliquota_outras_retencoes: keepCurrentIfDefaultValue(
        prevState.aliquota_outras_retencoes,
        data.aliquota_outras_retencoes ?? prevState.aliquota_outras_retencoes
      ),
      cnae_fiscal: keepCurrentIfFilled(prevState.cnae_fiscal, data.cnae_fiscal || prevState.cnae_fiscal),
      tipo_rps: keepCurrentIfFilled(prevState.tipo_rps, data.tipo_rps || prevState.tipo_rps),
      regime_especial_tributacao: keepCurrentIfFilled(
        prevState.regime_especial_tributacao,
        data.regime_especial_tributacao ?? prevState.regime_especial_tributacao
      ),
      incentivo_fiscal: keepCurrentIfDefaultValue(prevState.incentivo_fiscal, data.incentivo_fiscal ?? prevState.incentivo_fiscal),
      certificado_digital: keepCurrentIfFilled(prevState.certificado_digital, data.certificado_digital ?? prevState.certificado_digital),
      senha_certificado_digital: keepCurrentIfFilled(
        prevState.senha_certificado_digital,
        data.senha_certificado_digital ?? prevState.senha_certificado_digital
      ),
      webservice_usuario: keepCurrentIfFilled(prevState.webservice_usuario, data.webservice_usuario ?? prevState.webservice_usuario),
      webservice_senha: keepCurrentIfFilled(prevState.webservice_senha, data.webservice_senha ?? prevState.webservice_senha),
      webservice_chaveacesso: keepCurrentIfFilled(
        prevState.webservice_chaveacesso,
        data.webservice_chaveacesso ?? prevState.webservice_chaveacesso
      ),
      prestacao_sus: keepCurrentIfDefaultValue(prevState.prestacao_sus, data.prestacao_sus ?? prevState.prestacao_sus),
      numero: keepCurrentIfFilled(prevState.numero, data.numero || prevState.numero),
      endereco: {
        ...prevState.endereco,
        cep: keepCurrentIfFilled(prevState.endereco?.cep, data.endereco?.cep ?? prevState.endereco?.cep ?? ''),
        logradouro: keepCurrentIfFilled(prevState.endereco?.logradouro, data.endereco?.logradouro ?? prevState.endereco?.logradouro ?? ''),
        complemento: keepCurrentIfFilled(prevState.endereco?.complemento, data.endereco?.complemento ?? prevState.endereco?.complemento ?? ''),
        bairro: keepCurrentIfFilled(prevState.endereco?.bairro, data.endereco?.bairro ?? prevState.endereco?.bairro ?? ''),
        municipio: keepCurrentIfFilled(prevState.endereco?.municipio, data.endereco?.municipio ?? prevState.endereco?.municipio ?? ''),
        uf: keepCurrentIfFilled(prevState.endereco?.uf, data.endereco?.uf ?? prevState.endereco?.uf ?? ''),
        codigo_municipio: keepCurrentIfFilled(
          prevState.endereco?.codigo_municipio,
          data.endereco?.codigo_municipio ?? prevState.endereco?.codigo_municipio ?? ''
        ),
        nome_pais: keepCurrentIfFilled(prevState.endereco?.nome_pais, data.endereco?.nome_pais ?? prevState.endereco?.nome_pais ?? ''),
        codigo_pais: keepCurrentIfFilled(prevState.endereco?.codigo_pais, data.endereco?.codigo_pais ?? prevState.endereco?.codigo_pais ?? ''),
        numero: keepCurrentIfFilled(prevState.endereco?.numero, data.endereco?.numero ?? prevState.endereco?.numero ?? ''),
      }
    };

    if (hasCopyWith(prevState)) {
      return prevState.copyWith(nextState) as T;
    }

    return {
      ...prevState,
      ...nextState
    };
  });
};

const getBackendErrorMessage = (error: any): string | null => {
  const backendMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data?.mensagem ||
    error?.response?.data?.detail;

  if (typeof backendMessage === 'string' && backendMessage.trim()) {
    return backendMessage;
  }

  if (Array.isArray(backendMessage) && backendMessage.length > 0) {
    return backendMessage.join(' ');
  }

  return null;
};

const handleSearchError = (
  error: any,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  msgs: any,
  fallbackMessage: string,
  errorField = 'error'
) => {
  const detailMessage = getBackendErrorMessage(error) || fallbackMessage;

  if (msgs?.current?.show) {
    msgs.current.show({
      severity: 'error',
      summary: 'Atenção:',
      detail: detailMessage,
    });
  }

  setErrors((prev) => ({
    ...prev,
    [errorField]: detailMessage,
  }));
};

export const handleSearchCNPJ = async <
  T extends SearchCompanyState
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
      applyCompanyDataToState(data, setState);

      if (setTouchedFields) {
        setTouchedFields((prev) => ({
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

      return data;
    }
  } catch (error) {
    handleSearchError(
      error,
      setErrors,
      msgs,
      'CNPJ não encontrado. Verifique ou inclua manualmente os dados da empresa.',
      'cnpj'
    );
  }

  return null;
};

export const handleSearchCertificate = async <
  T extends SearchCompanyState
>(
  certificado_digital: string,
  senha_certificado_digital: string,
  setState: React.Dispatch<React.SetStateAction<T>>,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  msgs: any,
  setTouchedFields?: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
) => {
  if (!certificado_digital?.trim()) {
    const detail = 'Selecione um certificado digital antes de pesquisar.';

    if (msgs?.current?.show) {
      msgs.current.show({
        severity: 'warn',
        summary: 'Atenção:',
        detail,
      });
    }

    setErrors((prev) => ({
      ...prev,
      certificado_digital: detail,
    }));

    return null;
  }

  if (!senha_certificado_digital?.trim()) {
    const detail = 'Informe a senha do certificado digital para continuar.';

    if (msgs?.current?.show) {
      msgs.current.show({
        severity: 'warn',
        summary: 'Atenção:',
        detail,
      });
    }

    setErrors((prev) => ({
      ...prev,
      senha_certificado_digital: detail,
    }));

    return null;
  }

  try {
    const data = await searchByCertificate({
      certificado_digital,
      senha_certificado_digital
    });

    if (data) {
      applyCompanyDataToState(data, setState);

      setErrors((prev) => ({
        ...prev,
        certificado_digital: '',
        senha_certificado_digital: '',
      }));

      if (setTouchedFields) {
        setTouchedFields((prev) => ({
          ...prev,
          cnpj: true,
          senha_certificado_digital: true,
          telefone: true,
        }));
      }

      return data;
    }
  } catch (error: any) {
    const backendMessage = getBackendErrorMessage(error)?.toLowerCase() ?? '';
    const errorField = backendMessage.includes('senha')
      ? 'senha_certificado_digital'
      : 'certificado_digital';

    handleSearchError(
      error,
      setErrors,
      msgs,
      'Não foi possível buscar os dados pelo certificado digital. Verifique o arquivo e a senha informada.',
      errorField
    );
  }

  return null;
};
