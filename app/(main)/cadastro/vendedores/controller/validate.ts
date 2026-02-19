import { VendedorEntity } from "@/app/entity/VendedorEntity";

export const validateFieldsVendedor = (
    vendedor: VendedorEntity,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: React.RefObject<any>,
) => {
    const newErrors: { [key: string]: string } = {};
    msgs.current?.clear();
    let valid = true;

    if (vendedor.tipo_pessoa === 'PESSOA_JURIDICA') {
        if (!vendedor.cnpj || vendedor.cnpj.replace(/\D/g, '').length < 14) {
            newErrors.cnpj = 'Campo deve ter no mínimo 14 caracteres.';
        }
        else if (!vendedor.razao_social || vendedor.razao_social.trim().length < 2) {
            newErrors.razao_social = 'Campo deve ter no mínimo 2 caracteres.';
            valid = false;

        } else if (vendedor.percentual_comissao === undefined || vendedor.percentual_comissao === null || String(vendedor.percentual_comissao).trim() === '') {
            newErrors.percentual_comissao = 'Informe um valor válido.';
            valid = false;
        }
        else if (!vendedor.endereco?.cep || vendedor.endereco.cep.replace(/\D/g, '').length < 8) {
            newErrors.cep = "Campo deve ter no mínimo 8 dígitos.";
            valid = false;
        }
        else if (!vendedor.endereco?.logradouro || vendedor.endereco.logradouro.length < 2) {
            newErrors.logradouro = 'Campo deve ter no mínimo 2 caracteres.';
            valid = false;
        }
        else if (!vendedor.endereco?.numero || vendedor.endereco.numero.length < 1) {
            newErrors.numero = "Campo deve ter no mínimo 1 dígito.";
            valid = false;
        }
        else if (!vendedor.endereco?.bairro || vendedor.endereco.bairro.length < 2) {
            newErrors.bairro = 'Campo deve ter no mínimo 2 caracteres.';
            valid = false;
        }
        else if (!vendedor.endereco?.uf) {
            newErrors.uf = 'Este Campo deve ser selecionado.';
            valid = false;
        }
        else if (!vendedor.endereco?.municipio) {
            newErrors.municipio = 'Este Campo deve ser selecionado.';
            valid = false;
        }
        else if (!vendedor.endereco?.codigo_municipio || vendedor.endereco.codigo_municipio.length < 2) {
            newErrors.codigo_municipio = 'Campo deve ter no mínimo 7 números.';
            valid = false;
        } else if (!vendedor.endereco?.nome_pais || vendedor.endereco.nome_pais.length < 2) {
            newErrors.nome_pais = 'Campo deve ter no mínimo 2 números.';
            valid = false;
        }
        else if (!vendedor.endereco?.codigo_pais || vendedor.endereco.codigo_pais.length < 2) {
            newErrors.codigo_pais = 'Campo deve ter no mínimo 2 números.';
            valid = false;
        }
    }
    else if (vendedor.tipo_pessoa === 'PESSOA_FISICA') {
        if (!vendedor.cpf || vendedor.cpf.replace(/\D/g, '').length < 11) {
            newErrors.cpf = 'Campo deve ter no mínimo 11 caracteres.';
            valid = false;
        }
        else if (!vendedor.rg || vendedor.rg.trim().length < 9) {
            newErrors.rg = 'Campo deve ter no mínimo 9 caracteres.';
            valid = false;
        }
        else if (!vendedor.razao_social || vendedor.razao_social.trim().length < 2) {
            newErrors.razao_social = 'Campo deve ter no mínimo 2 caracteres.';
            valid = false;
        }
        else if (vendedor.percentual_comissao === undefined || vendedor.percentual_comissao === null || String(vendedor.percentual_comissao).trim() === '') {
            newErrors.percentual_comissao = 'Informe um valor válido.';
            valid = false;
        }
        else if (!vendedor.endereco?.cep || vendedor.endereco.cep.replace(/\D/g, '').length < 8) {
            newErrors.cep = "Campo deve ter no mínimo 8 dígitos.";
            valid = false;
        }
        else if (!vendedor.endereco?.logradouro || vendedor.endereco.logradouro.length < 2) {
            newErrors.logradouro = 'Campo deve ter no mínimo 2 caracteres.';
            valid = false;
        }
        else if (!vendedor.endereco?.numero || vendedor.endereco.numero.length < 1) {
            newErrors.numero = "Campo deve ter no mínimo 1 dígito.";
            valid = false;
        }
        else if (!vendedor.endereco?.bairro || vendedor.endereco.bairro.length < 2) {
            newErrors.bairro = 'Campo deve ter no mínimo 2 caracteres.';
            valid = false;
        }
        else if (!vendedor.endereco?.uf) {
            newErrors.uf = 'Este Campo deve ser selecionado.';
            valid = false;
        }
        else if (!vendedor.endereco?.municipio) {
            newErrors.municipio = 'Este Campo deve ser selecionado.';
            valid = false;
        }
        else if (!vendedor.endereco?.codigo_municipio || vendedor.endereco.codigo_municipio.length < 2) {
            newErrors.codigo_municipio = 'Campo deve ter no mínimo 7 números.';
            valid = false;
        } else if (!vendedor.endereco?.nome_pais || vendedor.endereco.nome_pais.length < 2) {
            newErrors.nome_pais = 'Campo deve ter no mínimo 2 números.';
            valid = false;
        }
        else if (!vendedor.endereco?.codigo_pais || vendedor.endereco.codigo_pais.length < 2) {
            newErrors.codigo_pais = 'Campo deve ter no mínimo 2 números.';
            valid = false;
        }
    }
    else if (vendedor.tipo_pessoa === 'ESTRANGEIRO_NO_BRASIL') {
        if (!vendedor.documento_estrangeiro || vendedor.documento_estrangeiro.trim().length < 9) {
            newErrors.documento_estrangeiro = 'Campo obrigátorio.';
        }
    }
    else if (vendedor.tipo_pessoa === 'ESTRANGEIRO') {
        if (!vendedor.documento_estrangeiro || vendedor.documento_estrangeiro.trim().length < 9) {
            newErrors.documento_estrangeiro = 'Campo obrigátorio.';
        }
        else if (!vendedor.pais || vendedor.pais.trim().length < 2) {
            newErrors.pais = 'Campo é obrigátorio.';
        }
    }
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return false;
    }
    setErrors({});
    return true;
};
