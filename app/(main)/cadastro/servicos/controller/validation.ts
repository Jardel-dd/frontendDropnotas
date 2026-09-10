import { ServiceEntity } from '@/app/entity/ServiceEntity';

export const getServicoValidationErrors = (service: ServiceEntity) => {
    const newErrors: { [key: string]: string } = {};
    const hasSelectedCompanies = Array.isArray(service.id_empresas) && service.id_empresas.length > 0;

    if (!service.descricao || service.descricao.trim().length < 2) {
        newErrors.descricao = 'A Descrição deve ter pelo menos 2 caracteres.';
    } else if (service.valor_servico === null || service.valor_servico === undefined || isNaN(service.valor_servico) || service.valor_servico <= 0) {
        newErrors.valor_servico = 'Informe um valor Válido.';
    } else if (!service.id_perfil_tributario || service.id_perfil_tributario <= 0) {
        newErrors.id_perfil_tributario = 'Selecione um perfil tributário.';
    } else if (!hasSelectedCompanies) {
        newErrors.id_empresas = 'Selecione uma empresa.';
    }

    return newErrors;
};

export const validateFieldsServicos = (
    service: ServiceEntity,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: React.RefObject<any>
): boolean => {
    const newErrors = getServicoValidationErrors(service);
    const valid = Object.keys(newErrors).length === 0;

    msgs.current?.clear();
    setErrors(newErrors);

    return valid;
};
