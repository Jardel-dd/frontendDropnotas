import { PessoaEntity } from "@/app/entity/PessoaEntity";
import { VendedorEntity } from "@/app/entity/VendedorEntity";
import { ContratoEntity } from "@/app/entity/ContratoEntity";

type ErrorsMap = Record<string, string>;

const hasValidEmail = (email?: string) => !!email?.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const hasMinLengthWhenFilled = (value: string | null | undefined, minLength: number) =>
    !value?.trim() || value.trim().length >= minLength;

const validateEnderecoPessoa = (pessoa: PessoaEntity): ErrorsMap => {
    if (!pessoa.endereco?.cep || pessoa.endereco.cep.replace(/\D/g, '').length < 8) {
        return { cep: "Campo deve ter no minimo 8 digitos." };
    }
    if (!pessoa.endereco?.logradouro || pessoa.endereco.logradouro.length < 2) {
        return { logradouro: 'Campo deve ter no minimo 2 caracteres.' };
    }
    if (!pessoa.endereco?.numero || pessoa.endereco.numero.length < 1) {
        return { numero: "Campo deve ter no minimo 1 digito." };
    }
    if (!pessoa.endereco?.bairro || pessoa.endereco.bairro.length < 2) {
        return { bairro: 'Campo deve ter no minimo 2 caracteres.' };
    }
    if (!pessoa.endereco?.uf) {
        return { uf: 'Este Campo deve ser selecionado.' };
    }
    if (!pessoa.endereco?.municipio) {
        return { municipio: 'Este Campo deve ser selecionado.' };
    }
    if (!pessoa.endereco?.codigo_municipio || pessoa.endereco.codigo_municipio.length < 2) {
        return { codigo_municipio: 'Campo deve ter no minimo 7 numeros.' };
    }
    if (!pessoa.endereco?.codigo_pais || pessoa.endereco.codigo_pais.length < 2) {
        return { codigo_pais: 'Campo deve ter no minimo 2 numeros.' };
    }
    if (!hasValidEmail(pessoa.email)) {
        return { email: 'Email invalido. Por favor, digite um email valido.' };
    }

    return {};
};
const validateCamposComunsPessoa = (
    pessoa: PessoaEntity,
    selectedVendedor: VendedorEntity | null,
    selectedContrato: ContratoEntity | null,
): ErrorsMap => {
    if (!pessoa.codigo_regime_tributario) {
        return { selectedRegime: 'Este Campo deve ser selecionado.' };
    }
    if (!pessoa.contribuinte) {
        return { contribuinte: 'Este Campo deve ser selecionado.' };
    }
    if (!hasMinLengthWhenFilled(pessoa.inscricao_estadual, 6)) {
        return { inscricao_estadual: 'Campo deve ter no minimo 6 caracteres.' };
    }
    if (!hasMinLengthWhenFilled(pessoa.inscricao_municipal, 6)) {
        return { inscricao_municipal: 'Campo deve ter no minimo 6 caracteres.' };
    }
    if (!pessoa.pessoa_cliente && !pessoa.pessoa_fornecedor) {
        return { selectedContato: 'Este Campo deve ser selecionado.' };
    }
    if (!hasValidEmail(pessoa.email)) {
        return { email: 'Email invalido. Por favor, digite um email valido.' };
    }
    return validateEnderecoPessoa(pessoa);
};
export const validateFieldsPessoa = (
    pessoa: PessoaEntity,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: React.RefObject<any>,
    selectedVendedor: VendedorEntity | null,
    selectedContrato: ContratoEntity | null,
) => {
    let newErrors: ErrorsMap = {};
    msgs.current?.clear();

    if (pessoa.tipo_pessoa === 'PESSOA_JURIDICA') {
        if (!pessoa.cnpj || pessoa.cnpj.replace(/\D/g, '').length < 14) {
            newErrors = { cnpj: 'Campo deve ter no minimo 14 caracteres.' };
        } else if (!pessoa.razao_social || pessoa.razao_social.trim().length < 2) {
            newErrors = { razao_social: 'Campo deve ter no minimo 2 caracteres.' };
        } else if (!pessoa.nome_fantasia || pessoa.nome_fantasia.trim().length < 2) {
            newErrors = { nome_fantasia: 'Campo deve ter no minimo 2 caracteres.' };
        } else {
            newErrors = validateCamposComunsPessoa(pessoa, selectedVendedor, selectedContrato);
        }
    } else if (pessoa.tipo_pessoa === 'PESSOA_FISICA') {
        if (!pessoa.cpf || pessoa.cpf.replace(/\D/g, '').length < 11) {
            newErrors = { cpf: 'Campo deve ter no minimo 11 caracteres.' };
        } else if (!pessoa.rg || pessoa.rg.trim().length < 9) {
            newErrors = { rg: 'Campo deve ter no minimo 9 caracteres.' };
        } else if (!pessoa.razao_social || pessoa.razao_social.trim().length < 2) {
            newErrors = { razao_social: 'Campo deve ter no minimo 2 caracteres.' };
        } else if (!pessoa.cnae_fiscal) {
            newErrors = { cnae_fiscal: 'Este Campo deve ser selecionado.' };
        } else {
            newErrors = validateCamposComunsPessoa(pessoa, selectedVendedor, selectedContrato);
        }
    } else if (pessoa.tipo_pessoa === 'ESTRANGEIRO_NO_BRASIL') {
        if (!pessoa.documento_estrangeiro || pessoa.documento_estrangeiro.trim().length < 9) {
            newErrors = { documento_estrangeiro: 'Campo obrigatorio.' };
        }
    } else if (pessoa.tipo_pessoa === 'ESTRANGEIRO') {
        if (!pessoa.documento_estrangeiro || pessoa.documento_estrangeiro.trim().length < 9) {
            newErrors = { documento_estrangeiro: 'Campo obrigatorio.' };
        } else if (!pessoa.pais || pessoa.pais.trim().length < 2) {
            newErrors = { pais: 'Campo e obrigatorio.' };
        }
    }

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return false;
    }

    setErrors({});
    return true;
};
