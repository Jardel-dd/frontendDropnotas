import { FormaPagamentoEntity } from "@/app/entity/FormaPagamento";

export const validateFieldsFormaPagamento = (
    formaPagamento: FormaPagamentoEntity,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: React.RefObject<any>
): boolean => {
    let valid = true;
    let errorMessages: string[] = [];
    let newErrors: { [key: string]: string } = {};
    msgs.current?.clear();
    if (!formaPagamento.descricao || formaPagamento.descricao.trim().length < 2) {
        newErrors.descricao = 'A Descrição deve ter pelo menos 2 caracteres.';
        valid = false;
    } else if (!formaPagamento.tipo_forma_pagamento) {
        newErrors.tipo_forma_pagamento = 'Selecione uma Forma de Pagamento.';
        valid = false;
    } else if (!formaPagamento.tipo_taxa) {
        newErrors.tipo_taxa = 'Inclua um tipo de taxa.';
        valid = false;
    } else if (!formaPagamento.valor_taxa || formaPagamento.descricao.trim().length < 1) {
        newErrors.valor_taxa = 'Digite um valor.';
        valid = false;
    } else {
        valid = true;
    }
    setErrors(newErrors);
    if (errorMessages.length > 0) {
        msgs.current?.show({ severity: 'error', 
            summary: 'Atenção:', detail: errorMessages[0] });
    }
    return valid;
}