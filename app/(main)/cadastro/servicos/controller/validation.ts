import { ServiceEntity } from "@/app/entity/ServiceEntity";

export const validateFieldsServicos = (
    service: ServiceEntity,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: React.RefObject<any>
): boolean => {
    let valid = true;
    let errorMessages: string[] = [];
    let newErrors: { [key: string]: string } = {};
    msgs.current?.clear();
    if (!service.descricao || service.descricao.trim().length < 2) {
        newErrors.descricao = 'A descrição deve ter pelo menos 2 caracteres.';
        valid = false;
    } else if (!service.item_lista_servico) {
        newErrors.item_lista_servico = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (
        service.valor_servico === null ||
        service.valor_servico === undefined ||
        isNaN(service.valor_servico) ||
        service.valor_servico <= 0
    ) {
        newErrors.valor_servico = 'Informe um valor válido.';
        valid = false;
    } else if (service.iss_retido === null || service.iss_retido === undefined || service.iss_retido === '') {
        newErrors.iss_retido = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!service.exigibilidade_iss || service.exigibilidade_iss.trim().length < 2) {
        newErrors.exigibilidade_iss = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!service.codigo_situacao_tributaria || service.codigo_situacao_tributaria.trim().length < 2) {
        newErrors.codigo_situacao_tributaria = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!service.responsavel_retencao || service.responsavel_retencao.trim().length < 2) {
        newErrors.responsavel_retencao = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!service.codigo_municipio || service.codigo_municipio.length < 2) {
        newErrors.codigo_municipio = 'Campo deve ter no mínimo 2 números.';
        valid = false;
    } else if (!service.codigo_cnae) {
        newErrors.codigo_cnae = 'Este Campo deve ser selecionado.';
        valid = false;
         } else if (!service.codigo_cnae) {
        newErrors.codigo_cnae = 'Este Campo deve ser selecionado.';
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
