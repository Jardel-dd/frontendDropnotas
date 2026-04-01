import { PessoaEntity } from "@/app/entity/PessoaEntity";
import { ServiceEntity } from "@/app/entity/ServiceEntity";
import { CompanyEntity } from "@/app/entity/CompanyEntity";
import { ContratoEntity } from "@/app/entity/ContratoEntity";
import { FormaPagamentoEntity } from "@/app/entity/FormaPagamento";
import { CategoryContratosEntity } from "@/app/entity/CategoryContratEntity";

export const validateFieldsContrato = (
    contrato: ContratoEntity,
    selectedCompany: CompanyEntity | null,
    selectedService: ServiceEntity | null,
    selectedCategoriaContrato: CategoryContratosEntity | null,
    selectedFormadePagamento: FormaPagamentoEntity | null,
    selectedPessoa: PessoaEntity | null,

    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: React.RefObject<any>
): boolean => {
    let valid = true;
    let errorMessages: string[] = [];
    let newErrors: { [key: string]: string } = {};
    const hasSelectedCompany = !!selectedCompany;
    const hasSavedCompanyId = contrato.id_empresa !== null && contrato.id_empresa !== undefined;
    const hasSelectedService = !!selectedService;
    const hasSavedServiceId = contrato.id_servico !== null && contrato.id_servico !== undefined;
    const hasSelectedCategoriaContrato = !!selectedCategoriaContrato;
    const hasSavedCategoriaContratoId = contrato.id_categoria_contrato !== null && contrato.id_categoria_contrato !== undefined;
    const hasSelectedFormaPagamento = !!selectedFormadePagamento;
    const hasSavedFormaPagamentoId = contrato.id_forma_pagamento !== null && contrato.id_forma_pagamento !== undefined;
    const hasSelectedPessoa = !!selectedPessoa;
    const hasSavedPessoaIds =
        Array.isArray(contrato.id_clientes_contrato) &&
        contrato.id_clientes_contrato.some((id) => Number(id) > 0);
    msgs.current?.clear();
    if (!contrato.descricao || contrato.descricao.trim().length < 2) {
        newErrors.descricao = 'A descrição deve ter pelo menos 2 caracteres.';
        valid = false;
    } else if (!contrato.valor_servico || String(contrato.valor_servico).trim().length < 1) {
        newErrors.valor_servico = 'O Preço deve ter pelo menos 1 digíto.';
        valid = false;
    } else if (!hasSelectedCompany && !hasSavedCompanyId) {
        newErrors.selectedCompany = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!hasSelectedService && !hasSavedServiceId) {
        newErrors.selectedService = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!hasSelectedCategoriaContrato && !hasSavedCategoriaContratoId) {
        newErrors.selectedCategoriaContrato = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!hasSelectedFormaPagamento && !hasSavedFormaPagamentoId) {
        newErrors.selectedFormadePagamento = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!hasSelectedPessoa && !hasSavedPessoaIds) {
        newErrors.selectedPessoa = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!contrato.periodicidade) {
        newErrors.periodicidade = 'A periodicidade deve ter pelo menos 1 digíto.';
        valid = false;
    } else {
        valid = true;
    }
    setErrors(newErrors);
    if (errorMessages.length > 0) {
        msgs.current?.show({ severity: 'error', summary: 'Erro', detail: errorMessages[0] });
    }
    return valid;
};
