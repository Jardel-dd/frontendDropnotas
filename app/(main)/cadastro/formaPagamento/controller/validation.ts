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
        newErrors.descricao = 'A descrição deve ter pelo menos 2 caracteres.';
        valid = false;
    } else if (!formaPagamento.tipo_forma_pagamento) {
        newErrors.tipo_forma_pagamento = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!formaPagamento.tipo_taxa) {
        newErrors.tipo_taxa = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!formaPagamento.valor_taxa || formaPagamento.descricao.trim().length < 1) {
        newErrors.valor_taxa = 'Este campo deve ter pelo menos 1 caracter.';
        valid = false;
    } else {
        valid = true;
    }
    setErrors(newErrors);
    if (errorMessages.length > 0) {
        msgs.current?.show({ severity: 'error', summary: 'Erro', detail: errorMessages[0] });
    }
    return valid;
}