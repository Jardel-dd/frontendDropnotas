import { CompanyEntity } from "@/app/entity/CompanyEntity";
import { PrepararNfs } from "@/app/entity/NfsEntity";
import { PessoaEntity } from "@/app/entity/PessoaEntity";
import { ServiceEntity } from "@/app/entity/ServiceEntity";

export const validateFieldsPrepararNfs = (
    emitirOS: PrepararNfs,
    selectedEmpresa: CompanyEntity | null,
    selectedServico: ServiceEntity | null,
    selectedCliente: PessoaEntity | null,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: React.RefObject<any>
): boolean => {
    let valid = true;
    let errorMessages: string[] = [];
    let newErrors: { [key: string]: string } = {};
    msgs.current?.clear();

    if (!selectedEmpresa || Object.keys(selectedEmpresa).length === 0) {
        newErrors.selectedEmpresa = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!selectedCliente || Object.keys(selectedCliente).length === 0) {
        newErrors.selectedCliente = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!selectedServico || Object.keys(selectedServico).length === 0) {
        newErrors.selectedServico = 'Este Campo deve ser selecionado.';
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
