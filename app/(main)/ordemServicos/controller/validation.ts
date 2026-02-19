import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { FormaPagamentoEntity } from '@/app/entity/FormaPagamento';
import { ServiceOrderEntity } from '@/app/entity/ServiceOrderEntity';

export const validateFieldsOrdemServico = (
    emitirOS: ServiceOrderEntity,
    selectedEmpresa: CompanyEntity | null,
    selectedCliente: PessoaEntity | null,
    selectedService: ServiceEntity | null,
    selectedVendedor: VendedorEntity | null,
    selectedFormaPagamento: FormaPagamentoEntity | null,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: React.RefObject<any>
): boolean => {
    let valid = true;
    let errorMessages: string[] = [];
    let newErrors: { [key: string]: string } = {};
    msgs.current?.clear();
    if (!emitirOS.descricao || emitirOS.descricao.trim().length < 2) {
        newErrors.descricao = 'A descrição deve ter pelo menos 2 caracteres.';
        valid = false;
    } else if (!selectedEmpresa || Object.keys(selectedEmpresa).length === 0) {
        newErrors.selectedEmpresa = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!selectedCliente || Object.keys(selectedCliente).length === 0) {
        newErrors.selectedCliente = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!selectedService || Object.keys(selectedService).length === 0) {
        newErrors.selectedService = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!selectedVendedor || Object.keys(selectedVendedor).length === 0) {
        newErrors.selectedVendedor = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!selectedFormaPagamento || Object.keys(selectedFormaPagamento).length === 0) {
        newErrors.selectedFormaPagamento = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if ((emitirOS.servicos?.quantidade ?? 0) < 1) {
        newErrors['servicos.quantidade'] = 'Quantidade mínima do serviço deve ser 1.';
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
