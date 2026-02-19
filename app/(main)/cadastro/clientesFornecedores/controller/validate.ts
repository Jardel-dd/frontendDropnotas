import { PessoaEntity } from "@/app/entity/PessoaEntity";
import { VendedorEntity } from "@/app/entity/VendedorEntity";

export const validateFieldsPessoa = (
    pessoa: PessoaEntity,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: React.RefObject<any>,
    selectedVendedor: VendedorEntity | null,
) => {
    const newErrors: { [key: string]: string } = {};
    msgs.current?.clear();
    let valid = true;
    if (pessoa.tipo_pessoa === 'PESSOA_JURIDICA') {

        if (!pessoa.cnpj || pessoa.cnpj.replace(/\D/g, '').length < 2) {
            newErrors.cnpj = 'Campo deve ter no mínimo 14 caracteres.';
        }
        else if (!pessoa.razao_social || pessoa.razao_social.trim().length < 2) {
            newErrors.razao_social = 'Campo deve ter no mínimo 2 caracteres.';
            valid = false;
        }
        else if (!pessoa.nome_fantasia || pessoa.nome_fantasia.trim().length < 2) {
            newErrors.nome_fantasia = 'Campo deve ter no mínimo 2 caracteres.';
            valid = false;
        }
        else if (!pessoa.codigo_regime_tributario) {
            newErrors.selectedRegime = 'Este Campo deve ser selecionado.';
            valid = false;
        }
        else if (!pessoa.contribuinte) {
            newErrors.contribuinte = 'Este Campo deve ser selecionado.';
            valid = false;
        }
        else if (!pessoa.inscricao_estadual || pessoa.inscricao_estadual.trim().length < 6) {
            newErrors.inscricao_estadual = 'Campo deve ter no mínimo 6 caracteres.';
            valid = false;
        }
        else if (!pessoa.inscricao_municipal || pessoa.inscricao_municipal.trim().length < 6) {
            newErrors.inscricao_municipal = 'Campo deve ter no mínimo 6 caracteres.';
            valid = false;
        }
          else if (!pessoa.cnae_fiscal) {
            newErrors.cnae_fiscal = 'Este Campo deve ser selecionado.';
            valid = false;
        }
        else if (!pessoa.pessoa_cliente && !pessoa.pessoa_fornecedor) {
            newErrors.selectedContato = 'Este Campo deve ser selecionado.';
            valid = false;
        }
        else if (!selectedVendedor) {
            newErrors.selectedVendedor = 'Este Campo deve ser selecionado.';
            valid = false;
        } else if (!pessoa.endereco?.cep || pessoa.endereco.cep.replace(/\D/g, '').length < 8) {
            newErrors.cep = "Campo deve ter no mínimo 8 dígitos."
            valid = false;
        } else if (!pessoa.endereco?.logradouro || pessoa.endereco.logradouro.length < 2) {
            newErrors.logradouro = 'Campo deve ter no mínimo 2 caracteres.';
            valid = false;
        } else if (!pessoa.endereco?.numero || pessoa.endereco.numero.length < 1) {
            newErrors.numero = "Campo deve ter no mínimo 1 dígito."
            valid = false;
        } else if (!pessoa.endereco?.bairro || pessoa.endereco.bairro.length < 2) {
            newErrors.bairro = 'Campo deve ter no mínimo 2 caracteres.';
            valid = false;
        } else if (!pessoa.endereco?.uf) {
            newErrors.uf = 'Este Campo deve ser selecionado.';
            valid = false;
        } else if (!pessoa.endereco?.municipio) {
            newErrors.municipio = 'Este Campo deve ser selecionado.';
            valid = false;
        } else if (!pessoa.endereco?.codigo_municipio || pessoa.endereco.codigo_municipio.length < 2) {
            newErrors.codigo_municipio = 'Campo deve ter no mínimo 7 números.';
            valid = false;
        } else if (!pessoa.endereco?.codigo_pais || pessoa.endereco.codigo_pais.length < 2) {
            newErrors.codigo_pais = 'Campo deve ter no mínimo 2 números.';
            valid = false;
            // } else if (!pessoa.endereco?.telefone || pessoa.endereco.telefone.replace(/\D/g, '').length < 10) {
            //     newErrors.telefone = "Campo deve ter no mínimo 10 dígito."
            //     valid = false;
        } else if (!pessoa.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pessoa.email)) {
            newErrors.email = 'Email inválido. Por favor, digite um email válido.';
            valid = false;
        }
    }
    else if (pessoa.tipo_pessoa === 'PESSOA_FISICA') {

        if (!pessoa.cpf || pessoa.cpf.replace(/\D/g, '').length < 11) {
            newErrors.cpf = 'Campo deve ter no mínimo 11 caracteres.';
        }
        else if (!pessoa.rg || pessoa.rg.trim().length < 9) {
            newErrors.rg = 'Campo deve ter no mínimo 9 caracteres.';
        }
        else if (!pessoa.razao_social || pessoa.razao_social.trim().length < 2) {
            newErrors.razao_social = 'Campo deve ter no mínimo 2 caracteres.';
            valid = false;
        }
        else if (!pessoa.codigo_regime_tributario) {
            newErrors.selectedRegime = 'Este Campo deve ser selecionado.';
            valid = false;
        }
        else if (!pessoa.contribuinte) {
            newErrors.contribuinte = 'Este Campo deve ser selecionado.';
            valid = false;
        }
        else if (!pessoa.inscricao_estadual || pessoa.inscricao_estadual.trim().length < 6) {
            newErrors.inscricao_estadual = 'Campo deve ter no mínimo 6 caracteres.';
            valid = false;
        }
        else if (!pessoa.inscricao_municipal || pessoa.inscricao_municipal.trim().length < 6) {
            newErrors.inscricao_municipal = 'Campo deve ter no mínimo 6 caracteres.';
            valid = false;
        }
        else if (!pessoa.pessoa_cliente && !pessoa.pessoa_fornecedor) {
            newErrors.selectedContato = 'Este Campo deve ser selecionado.';
            valid = false;
        }
        else if (!pessoa.cnae_fiscal) {
            newErrors.cnae_fiscal = 'Este Campo deve ser selecionado.';
            valid = false;
        }
        else if (!selectedVendedor) {
            newErrors.selectedVendedor = 'Este Campo deve ser selecionado.';
            valid = true;

        } else if (!pessoa.endereco?.cep || pessoa.endereco.cep.replace(/\D/g, '').length < 8) {
            newErrors.cep = "Campo deve ter no mínimo 8 dígitos."
            valid = false;
        } else if (!pessoa.endereco?.logradouro || pessoa.endereco.logradouro.length < 2) {
            newErrors.logradouro = 'Campo deve ter no mínimo 2 caracteres.';
            valid = false;
        } else if (!pessoa.endereco?.numero || pessoa.endereco.numero.length < 1) {
            newErrors.numero = "Campo deve ter no mínimo 1 dígito."
            valid = false;
        } else if (!pessoa.endereco?.bairro || pessoa.endereco.bairro.length < 2) {
            newErrors.bairro = 'Campo deve ter no mínimo 2 caracteres.';
            valid = false;
        } else if (!pessoa.endereco?.uf) {
            newErrors.uf = 'Este Campo deve ser selecionado.';
            valid = false;
        } else if (!pessoa.endereco?.municipio) {
            newErrors.municipio = 'Este Campo deve ser selecionado.';
            valid = false;
        } else if (!pessoa.endereco?.codigo_municipio || pessoa.endereco.codigo_municipio.length < 2) {
            newErrors.codigo_municipio = 'Campo deve ter no mínimo 7 números.';
            valid = false;
        } else if (!pessoa.endereco?.codigo_pais || pessoa.endereco.codigo_pais.length < 2) {
            newErrors.codigo_pais = 'Campo deve ter no mínimo 2 números.';
            valid = false;
            // } else if (!pessoa.endereco?.telefone || pessoa.endereco.telefone.replace(/\D/g, '').length < 10) {
            //     newErrors.telefone = "Campo deve ter no mínimo 10 dígito."
            //     valid = false;
        } else if (!pessoa.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pessoa.email)) {
            newErrors.email = 'Email inválido. Por favor, digite um email válido.';
            valid = false;
        }
    }
    else if (pessoa.tipo_pessoa === 'ESTRANGEIRO_NO_BRASIL') {
        if (!pessoa.documento_estrangeiro || pessoa.documento_estrangeiro.trim().length < 9) {
            newErrors.documento_estrangeiro = 'Campo obrigátorio.';
        }

    }
    else if (pessoa.tipo_pessoa === 'ESTRANGEIRO') {
        if (!pessoa.documento_estrangeiro || pessoa.documento_estrangeiro.trim().length < 9) {
            newErrors.documento_estrangeiro = 'Campo obrigátorio.';
        }
        else if (!pessoa.pais || pessoa.pais.trim().length < 9) {
            newErrors.pais = 'Campo é obrigátorio.';
        }
    }
    else {
        valid = true;
    }
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return false;
    }

    setErrors({});
    return true;
};
