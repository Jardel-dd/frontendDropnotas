import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { ContasPagarEntity } from '@/app/entity/contasPagarEntity';

export const validateFieldsContasPagar = (
    contasPagar: ContasPagarEntity,
    setErrors: Dispatch<SetStateAction<Record<string, string>>>,
    msgs: RefObject<any>,
    selectedCliente?: PessoaEntity | null,
): boolean => {
    let newErrors: Record<string, string> = {};

    msgs.current?.clear();

    if (!contasPagar.descricao || contasPagar.descricao.trim().length < 2) {
        newErrors = { descricao: 'A descricao deve ter pelo menos 2 caracteres.' };
    } else if (!selectedCliente && !contasPagar.id_fornecedor) {
        newErrors = { selectedCliente: 'Selecione o fornecedor.' };
    } else if (!contasPagar.valor_original || Number(contasPagar.valor_original) <= 0) {
        newErrors = { valor_original: 'Informe um valor original maior que zero.' };
    } else if (!contasPagar.valor_total || Number(contasPagar.valor_total) <= 0) {
        newErrors = { valor_total: 'Informe um valor total maior que zero.' };
    } else if (!contasPagar.data_vencimento) {
        newErrors = { data_vencimento: 'Informe a data de vencimento.' };
    } 
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return false;
    }

    setErrors({});
    return true;
};
