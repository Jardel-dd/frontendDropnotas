import { PerfilTributarioEntity } from "@/app/entity/perfilTributarioEntity";

export const getPerfilTributarioValidationErrors = (perfilTributario: PerfilTributarioEntity) => {
    let newErrors: { [key: string]: string } = {};

    if (!perfilTributario.id_empresa) {
        newErrors.id_empresa = 'Selecione a empresa.';
    } else if (!perfilTributario.codigo_cnae || perfilTributario.codigo_cnae.trim().length < 2) {
        newErrors.codigo_cnae = 'Selecione o código CNAE.';
    } else if (!perfilTributario.item_lista_servico || perfilTributario.item_lista_servico.trim().length === 0) {
        newErrors.item_lista_servico = 'Selecione o serviço.';
    } else if (!perfilTributario.codigo_nbs || perfilTributario.codigo_nbs.trim().length < 2) {
        newErrors.codigo_nbs = 'Selecione o código NBS.';
    } else if (!perfilTributario.codigo_indicador_operacao || perfilTributario.codigo_indicador_operacao.trim().length < 2) {
        newErrors.codigo_indicador_operacao = 'Selecione o indicador de operação.';
    // Classificacao Tributaria is optional for this form.
    // } else if (!perfilTributario.codigo_classificacao_tributaria || perfilTributario.codigo_classificacao_tributaria.trim().length < 2) {
    //     newErrors.codigo_classificacao_tributaria = 'Este campo deve ser selecionado.';
    } else if (!perfilTributario.nome || perfilTributario.nome.trim().length < 2) {
        newErrors.nome = 'Digite pelo menos  2 caracteres.';
    } else if (!perfilTributario.iss_retido || perfilTributario.iss_retido.trim().length < 2) {
        newErrors.iss_retido = 'Campo obrigatório.';
    } else if (!perfilTributario.exigibilidade_iss || perfilTributario.exigibilidade_iss.trim().length < 2) {
        newErrors.exigibilidade_iss = 'Selecione uma Exigibilidade ISS.';
    } else if (!perfilTributario.codigo_situacao_tributaria || perfilTributario.codigo_situacao_tributaria.trim().length < 2) {
        newErrors.codigo_situacao_tributaria = 'Campo obrigatório.';
    // } else if (!perfilTributario.codigo_classificacao_tributaria || perfilTributario.codigo_classificacao_tributaria.trim().length < 2) {
    //     newErrors.codigo_classificacao_tributaria = 'Este Campo deve ser selecionado.';
    } else if (!perfilTributario.codigo_nbs || perfilTributario.codigo_nbs.trim().length < 2) {
        newErrors.codigo_nbs = 'Selecione o Codígo NBS.';
    } else if (!perfilTributario.codigo_cnae || perfilTributario.codigo_cnae.trim().length < 2) {
        newErrors.codigo_cnae = 'Selecione o Codígo CNAE.';
    } else if (!perfilTributario.item_lista_servico || perfilTributario.item_lista_servico.trim().length === 0) {
        newErrors.item_lista_servico = 'Selecione o Serviço.';
    // Indicacao Destinatario and Retencao are optional for this form.
    // } else if (!perfilTributario.indicador_destinatario || perfilTributario.indicador_destinatario.trim().length < 2) {
    //     newErrors.indicador_destinatario = 'Selecione o Indicador Destinatario.';
    // } else if (!perfilTributario.responsavel_retencao || perfilTributario.responsavel_retencao.trim().length < 2) {
    //     newErrors.responsavel_retencao = 'Selecione o Responsavel.';
    } else if (!perfilTributario.codigo_municipio || perfilTributario.codigo_municipio.trim().length === 0) {
        newErrors.codigo_municipio = 'Inclua o codígo do Município .';
    }

    return newErrors;
};

export const validateFieldsPerfilTributario= (
    perfilTributario: PerfilTributarioEntity,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: React.RefObject<any>
): boolean => {
    let errorMessages: string[] = [];
    const newErrors = getPerfilTributarioValidationErrors(perfilTributario);
    const valid = Object.keys(newErrors).length === 0;

    msgs.current?.clear();
    setErrors(newErrors);

    if (errorMessages.length > 0) {
        msgs.current?.show({ severity: 'error', summary: 'Atenção:', detail: errorMessages[0] });
    }

    return valid;
};
