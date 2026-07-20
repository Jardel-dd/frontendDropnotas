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
    selectedPessoa: PessoaEntity[],

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
    const hasSelectedPessoa = Array.isArray(selectedPessoa) && selectedPessoa.length > 0;
    const hasSavedPessoaIds =
        Array.isArray(contrato.id_clientes_contrato) &&
        contrato.id_clientes_contrato.some((id) => Number(id) > 0);
    msgs.current?.clear();
    if (!contrato.descricao || contrato.descricao.trim().length < 2) {
        newErrors.descricao = 'A descrição deve ter pelo menos 2 caracteres.';
        valid = false;
    } else if (!contrato.valor_servico || String(contrato.valor_servico).trim().length < 1) {
        newErrors.valor_servico = 'Digite um valor valído.';
        valid = false;
          } else if (!contrato.periodicidade) {
        newErrors.periodicidade = 'Selecione o periodo .';
        valid = false;
    } else if (!hasSelectedCompany && !hasSavedCompanyId) {
        newErrors.selectedCompany = 'Selecione a Empresa.';
        valid = false;
    } else if (!hasSelectedService && !hasSavedServiceId) {
        newErrors.selectedService = 'Selecione o Serviço.';
        valid = false;
    } else if (!hasSelectedCategoriaContrato && !hasSavedCategoriaContratoId) {
        newErrors.selectedCategoriaContrato = 'Selecione a Categoria de Contrato.';
        valid = false;
    } else if (!hasSelectedFormaPagamento && !hasSavedFormaPagamentoId) {
        newErrors.selectedFormadePagamento = 'Selecione a forma de pagamento.';
        valid = false;
  
    } else if (!hasSelectedPessoa && !hasSavedPessoaIds) {
        newErrors.selectedPessoa = 'Selecione Cliente ou Fornecedor.';
        valid = false;
    } else {
        valid = true;
    }
    setErrors(newErrors);
    if (errorMessages.length > 0) {
        msgs.current?.show({ severity: 'error', summary: 'Atenção:', detail: errorMessages[0] });
    }
    return valid;
};
