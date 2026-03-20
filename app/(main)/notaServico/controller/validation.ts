import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { PrepararNfs } from '@/app/entity/NfsEntity';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { ServiceEntity } from '@/app/entity/ServiceEntity';

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
    } else if (!selectedCliente || Object.keys(selectedCliente).length === 0) {
        newErrors.selectedCliente = 'Este Campo deve ser selecionado.';
    } else if (!selectedServico || Object.keys(selectedServico).length === 0) {
        newErrors.selectedServico = 'Este Campo deve ser selecionado.';
    }

    const valid = Object.keys(newErrors).length === 0;

    setErrors(newErrors);

    return valid;
};
