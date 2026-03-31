import { Dispatch, RefObject, SetStateAction } from 'react';
import { ContasReceberEntity } from '@/app/entity/contasReceberEntity';
import { FormaPagamentoEntity } from '@/app/entity/FormaPagamento';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';

export const validateFieldsContasReceber = (
    contasReceber: ContasReceberEntity,
    setErrors: Dispatch<SetStateAction<Record<string, string>>>,
    msgs: RefObject<any>,
    selectedCliente?: PessoaEntity | null,
    selectedVendedor?: VendedorEntity | null,
    selectedFormaPagamento?: FormaPagamentoEntity | null
): boolean => {
    let newErrors: Record<string, string> = {};

    msgs.current?.clear();

    if (!contasReceber.descricao || contasReceber.descricao.trim().length < 2) {
        newErrors = { descricao: 'A descricao deve ter pelo menos 2 caracteres.' };
    } else if (!selectedCliente && !contasReceber.id_cliente) {
        newErrors = { selectedCliente: 'Selecione o cliente.' };
    } else if (!selectedVendedor && !contasReceber.id_vendedor) {
        newErrors = { selectedVendedor: 'Selecione o vendedor.' };
    } else if (!selectedFormaPagamento && !contasReceber.id_forma_pagamento) {
        newErrors = { selectedFormaPagamento: 'Selecione a forma de pagamento.' };
    } else if (!contasReceber.valor_original || Number(contasReceber.valor_original) <= 0) {
        newErrors = { valor_original: 'Informe um valor original maior que zero.' };
    } else if (!contasReceber.data_vencimento) {
        newErrors = { data_vencimento: 'Informe a data de vencimento.' };
    } 
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return false;
    }

    setErrors({});
    return true;
};
