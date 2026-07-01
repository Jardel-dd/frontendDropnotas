import { ServiceEntity } from "@/app/entity/ServiceEntity";

export const getServicoValidationErrors = (service: ServiceEntity) => {
    let newErrors: { [key: string]: string } = {};

    if (!service.descricao || service.descricao.trim().length < 2) {
        newErrors.descricao = 'A descrição deve ter pelo menos 2 caracteres.';
    } else if (service.valor_servico === null || service.valor_servico === undefined || isNaN(service.valor_servico) || service.valor_servico <= 0) {
        newErrors.valor_servico = 'Informe um valor válido.';
    } else if (!service.iss_retido || service.iss_retido.trim().length < 2) {
        newErrors.iss_retido = 'Campo obrigatório.';
    } else if (!service.exigibilidade_iss || service.exigibilidade_iss.trim().length < 2) {
        newErrors.exigibilidade_iss = 'Selecione uma Exigibilidade ISS.';
    } else if (!service.codigo_situacao_tributaria || service.codigo_situacao_tributaria.trim().length < 2) {
        newErrors.codigo_situacao_tributaria = 'Este Campo deve ser selecionado.';
    } else if (!service.codigo_classificacao_tributaria || service.codigo_classificacao_tributaria.trim().length < 2) {
        newErrors.codigo_classificacao_tributaria = 'Este Campo deve ser selecionado.';
    } else if (!service.codigo_nbs || service.codigo_nbs.trim().length < 2) {
        newErrors.codigo_nbs = 'Selecione o Codígo NBS.';
    } else if (!service.codigo_cnae || service.codigo_cnae.trim().length < 2) {
        newErrors.codigo_cnae = 'Selecione o Codígo CNAE.';
    } else if (!service.item_lista_servico || service.item_lista_servico.trim().length === 0) {
        newErrors.item_lista_servico = 'Selecione o Serviço.';
    } else if (!service.indicador_destinatario || service.indicador_destinatario.trim().length < 2) {
        newErrors.indicador_destinatario = 'Selecione o Indicador Destinatario.';
    } else if (!service.responsavel_retencao || service.responsavel_retencao.trim().length < 2) {
        newErrors.responsavel_retencao = 'Selecione o Responsavel.';
    } else if (!service.codigo_municipio || service.codigo_municipio.trim().length === 0) {
        newErrors.codigo_municipio = 'Inclua o codígo do Município .';
    }

    return newErrors;
};

export const validateFieldsServicos = (
    service: ServiceEntity,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: React.RefObject<any>
): boolean => {
    let errorMessages: string[] = [];
    const newErrors = getServicoValidationErrors(service);
    const valid = Object.keys(newErrors).length === 0;

    msgs.current?.clear();
    setErrors(newErrors);

    if (errorMessages.length > 0) {
        msgs.current?.show({ severity: 'error', summary: 'Atenção:', detail: errorMessages[0] });
    }

    return valid;
};
