import { NfsEntity } from '@/app/entity/NfsEntity';
import { PrepararNfs } from '@/app/entity/NfsEntity';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';

const REQUIRED_FIELD_MESSAGE = 'Este campo deve ser preenchido.';
const isBlank = (value: unknown) => value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
const hasDigits = (value: unknown) => String(value ?? '')
    .replace(/\D/g, '')
    .length > 0;
const isBooleanUnset = (value: unknown) => value === undefined || value === null || value === '';
const addRequiredError = (errors: Record<string, string>, key: string, invalid: boolean, message = REQUIRED_FIELD_MESSAGE) => {
    if (invalid) {
        errors[key] = message;
    }
};
const validateEndereco = (errors: Record<string, string>, prefix: string, endereco?: EnderecoEntity | null) => {
    addRequiredError(errors, `${prefix}.cep`, !hasDigits(endereco?.cep));
    addRequiredError(errors, `${prefix}.logradouro`, isBlank(endereco?.logradouro));
    addRequiredError(errors, `${prefix}.numero`, isBlank(endereco?.numero));
    addRequiredError(errors, `${prefix}.bairro`, isBlank(endereco?.bairro));
    addRequiredError(errors, `${prefix}.uf`, isBlank(endereco?.uf));
    addRequiredError(errors, `${prefix}.municipio`, isBlank(endereco?.municipio));
    addRequiredError(errors, `${prefix}.codigo_municipio`, isBlank(endereco?.codigo_municipio));
    addRequiredError(errors, `${prefix}.nome_pais`, isBlank(endereco?.nome_pais));
    addRequiredError(errors, `${prefix}.codigo_pais`, isBlank(endereco?.codigo_pais));
};
const buildNotaServicoErrors = (notaServico: NfsEntity) => {
    const newErrors: Record<string, string> = {};
    const tomadorEmail = (notaServico.tomador as any)?.email ?? (notaServico.tomador as any)?.contato?.email ?? '';
    addRequiredError(newErrors, 'competencia', isBlank(notaServico.competencia));
    addRequiredError(newErrors, 'prestador.cpf_cnpj', !hasDigits(notaServico.prestador?.cpf_cnpj));
    addRequiredError(newErrors, 'prestador.inscricao_municipal', isBlank(notaServico.prestador?.inscricao_municipal));
    addRequiredError(newErrors, 'prestador.razao_social', isBlank(notaServico.prestador?.razao_social));
    addRequiredError(newErrors, 'prestador.nome_fantasia', isBlank(notaServico.prestador?.nome_fantasia));
    addRequiredError(newErrors, 'prestador.telefone', !hasDigits(notaServico.prestador?.telefone));
    addRequiredError(newErrors, 'prestador.email', isBlank(notaServico.prestador?.email));
    addRequiredError(newErrors, 'prestador.prestacao_sus', isBooleanUnset(notaServico.prestador?.prestacao_sus));
    addRequiredError(newErrors, 'prestador.optante_simples_nacional', isBooleanUnset(notaServico.prestador?.optante_simples_nacional));
    addRequiredError(newErrors, 'prestador.incentivo_fiscal', isBooleanUnset(notaServico.prestador?.incentivo_fiscal));
    validateEndereco(newErrors, 'prestador.endereco', notaServico.prestador?.endereco);
    addRequiredError(newErrors, 'servico.descricao', isBlank(notaServico.servico?.descricao));
    addRequiredError(newErrors, 'servico.valores.valor_servico', Number(notaServico.servico?.valores?.valor_servico ?? 0) <= 0);
    addRequiredError(newErrors, 'servico.iss_retido', isBlank(notaServico.servico?.iss_retido));
    addRequiredError(newErrors, 'servico.item_lista_servico', isBlank(notaServico.servico?.item_lista_servico));
    addRequiredError(newErrors, 'servico.codigo_municipio', isBlank(notaServico.servico?.codigo_municipio));
    addRequiredError(newErrors, 'servico.exigibilidade_iss', isBlank(notaServico.servico?.exigibilidade_iss));
    addRequiredError(newErrors, 'servico.responsavel_retencao', isBlank(notaServico.servico?.responsavel_retencao));
    addRequiredError(newErrors, 'tomador.razao_social', isBlank(notaServico.tomador?.razao_social));
    addRequiredError(newErrors, 'tomador.cpf_cnpj', !hasDigits(notaServico.tomador?.cpf_cnpj));
    addRequiredError(newErrors, 'tomador.email', isBlank(tomadorEmail));
    validateEndereco(newErrors, 'tomador.endereco', notaServico.tomador?.endereco);

    return newErrors;
};
export const validateFieldsPrepararNfs = (
    _emitirOS: PrepararNfs,
    selectedEmpresa: CompanyEntity | null,
    selectedServico: ServiceEntity | null,
    selectedCliente: PessoaEntity | null,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: React.RefObject<any>
): boolean => {
    let newErrors: { [key: string]: string } = {};
    msgs.current?.clear();

    if (!selectedEmpresa || Object.keys(selectedEmpresa).length === 0) {
        newErrors.selectedEmpresa = 'Este Campo deve ser selecionado.';
    }  else if (!selectedCliente || Object.keys(selectedCliente).length === 0) {
        newErrors.selectedCliente = 'Este Campo deve ser selecionado.';
    } else if (!selectedServico || Object.keys(selectedServico).length === 0) {
        newErrors.selectedServico = 'Este Campo deve ser selecionado.';
    }
    const valid = Object.keys(newErrors).length === 0;
    setErrors(newErrors);
    return valid;
};
export const validateFieldsNotaServico = (
    notaServico: NfsEntity,
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    msgs?: React.RefObject<any>,
    showMessage = false
): boolean => {
    const newErrors = buildNotaServicoErrors(notaServico);
    const valid = Object.keys(newErrors).length === 0;

    setErrors(newErrors);

    if (!valid && showMessage) {
        msgs?.current?.show({
            severity: 'error',
            summary: 'Erro de validacao',
            detail: 'Por favor, preencha todos os campos obrigatorios.',
            life: 5000
        });
    }

    return valid;
};
export const getScopedErrors = (errors: Record<string, string>, prefix: string) =>
    Object.entries(errors).reduce<Record<string, string>>((acc, [key, value]) => {
        if (key.startsWith(`${prefix}.`)) {
            acc[key.slice(prefix.length + 1)] = value;
        }
        return acc;
}, {});
