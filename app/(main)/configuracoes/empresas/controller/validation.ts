import { UsuarioContaEntity } from "@/app/entity/UsuarioContaEntity";
import { CompanyEntity } from "../../../../entity/CompanyEntity";


export const validateFieldsEmpresas = (
    empresa: CompanyEntity,
    selectedUserConta: UsuarioContaEntity | null,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: React.RefObject<any>
) => {
    let valid = true;
    let errorMessages: string[] = [];
    let newErrors: { [key: string]: string } = {};
    msgs.current?.clear();

    if (!empresa.cnpj || empresa.cnpj.replace(/\D/g, '').length < 14) {
        newErrors.cnpj = 'Campo deve ter no mínimo 14 caracteres.';
        valid = false;
    } else if (!empresa.razao_social || empresa.razao_social.trim().length < 2) {
        newErrors.razao_social = 'Campo deve ter no mínimo 2 caracteres.';
        valid = false;
    } else if (!empresa.nome_fantasia || empresa.nome_fantasia.trim().length < 2) {
        newErrors.nome_fantasia = 'Campo deve ter no mínimo 2 caracteres.';
        valid = false;
    } else if (!empresa.atividade_principal || empresa.atividade_principal.trim().length < 2) {
        newErrors.atividade_principal = 'Campo deve ter no mínimo 2 caracteres.';
        valid = false;
    } else if (!empresa.inscricao_estadual || empresa.inscricao_estadual.length < 9) {
        newErrors.inscricao_estadual = 'Campo deve ter no mínimo 9 caracteres.';
        valid = false;
    } else if (!empresa.inscricao_municipal || empresa.inscricao_municipal.length < 2) {
        newErrors.inscricao_municipal = 'Campo deve ter no mínimo 2 caracteres.';
        valid = false;
    } else if (!empresa.codigo_regime_tributario) {
        newErrors.selectedRegime = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!empresa.endereco?.cep || empresa.endereco.cep.replace(/\D/g, '').length < 8) {
        newErrors.cep = "Campo deve ter no mínimo 8 dígitos."
        valid = false;
    } else if (!empresa.endereco?.logradouro || empresa.endereco.logradouro.length < 2) {
        newErrors.logradouro = 'Campo deve ter no mínimo 2 caracteres.';
        valid = false;
    } else if (!empresa.endereco?.numero || empresa.endereco.numero.length < 1) {
        newErrors.numero = "Campo deve ter no mínimo 1 dígito."
        valid = false;
    } else if (!empresa.endereco?.bairro || empresa.endereco.bairro.length < 2) {
        newErrors.bairro = 'Campo deve ter no mínimo 2 caracteres.';
        valid = false;
    } else if (!empresa.endereco?.uf) {
        newErrors.uf = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!empresa.endereco?.municipio) {
        newErrors.municipio = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!empresa.endereco?.codigo_municipio || empresa.endereco.codigo_municipio.length < 2) {
        newErrors.codigo_municipio = 'Campo deve ter no mínimo 7 números.';
        valid = false;
    } else if (!empresa.endereco?.codigo_pais || empresa.endereco.codigo_pais.length < 2) {
        newErrors.codigo_pais = 'Campo deve ter no mínimo 2 números.';
        valid = false;
    } else if (!selectedUserConta) {
        newErrors.selectedUserConta = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!empresa.serie_emissao_nfse || String(empresa.serie_emissao_nfse).trim().length < 1) {
        newErrors.serie_emissao_nfse = "Campo deve ter no mínimo 1 dígito."
        valid = false;
    } else if (!empresa.proximo_numero_rps || String(empresa.proximo_numero_rps).trim().length < 1) {
        newErrors.proximo_numero_rps = 'Campo deve ter no mínimo 1 caractere.';
        valid = false;
    } else if (!empresa.proximo_numero_lote || String(empresa.proximo_numero_lote).trim().length < 1) {
        newErrors.proximo_numero_lote = 'Campo deve ter no mínimo 1 caractere.';
        valid = false;
    } else if (!empresa.tipo_rps) {
        newErrors.tipo_rps = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (empresa.aliquota_iss === null || empresa.aliquota_iss === undefined || String(empresa.aliquota_iss).trim() === '') {
        newErrors.aliquota_iss = 'A Alíquota ISS é obrigatória.';
        valid = false;
    } else if (empresa.aliquota_pis === null || empresa.aliquota_pis === undefined || String(empresa.aliquota_pis).trim() === '') {
        newErrors.aliquota_pis = 'A Alíquota PIS é obrigatória.';
        valid = false;
    } else if (empresa.aliquota_cofins === null || empresa.aliquota_cofins === undefined || String(empresa.aliquota_cofins).trim() === '') {
        newErrors.aliquota_cofins = 'A Alíquota COFINS é obrigatória.';
        valid = false;
    } else if (
        empresa.aliquota_inss === null ||
        empresa.aliquota_inss === undefined ||
        String(empresa.aliquota_inss).trim() === ''
    ) {
        newErrors.aliquota_inss = 'A Alíquota INSS é obrigatória.';
        valid = false;
    } else if (
        empresa.aliquota_ir === null ||
        empresa.aliquota_ir === undefined ||
        String(empresa.aliquota_ir).trim() === ''
    ) {
        newErrors.aliquota_ir = 'A Alíquota IR é obrigatória.';
        valid = false;
    } else if (
        empresa.aliquota_csll === null ||
        empresa.aliquota_csll === undefined ||
        String(empresa.aliquota_csll).trim() === ''
    ) {
        newErrors.aliquota_csll = 'A Alíquota CSLL é obrigatória.';
        valid = false;
    } else if (
        empresa.aliquota_outras_retencoes === null ||
        empresa.aliquota_outras_retencoes === undefined ||
        String(empresa.aliquota_outras_retencoes).trim() === ''
    ) {
        newErrors.aliquota_outras_retencoes = 'Outras Retenções é obrigatória.';
        valid = false;
    } else if (
        empresa.aliquota_deducoes === null ||
        empresa.aliquota_deducoes === undefined ||
        String(empresa.aliquota_deducoes).trim() === ''
    ) {
        newErrors.aliquota_deducoes = 'Deduções é obrigatória.';
        valid = false;
    } else if (
        empresa.percentual_desconto_incondicionado === null ||
        empresa.percentual_desconto_incondicionado === undefined ||
        String(empresa.percentual_desconto_incondicionado).trim() === ''
    ) {
        newErrors.percentual_desconto_incondicionado = 'Desconto Incondicionado é obrigatório.';
        valid = false;
    } else if (
        empresa.percentual_desconto_condicionado === null ||
        empresa.percentual_desconto_condicionado === undefined ||
        String(empresa.percentual_desconto_condicionado).trim() === ''
    ) {
        newErrors.percentual_desconto_condicionado = 'Desconto Condicionado é obrigatório.';
        valid = false;
    } else if (!empresa.cnae_fiscal) {
        newErrors.cnae_fiscal = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (empresa.prestacao_sus === null || empresa.prestacao_sus === undefined) {
        newErrors.prestacao_sus = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!empresa.regime_especial_tributacao) {
        newErrors.regime_especial_tributacao = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (empresa.incentivo_fiscal === null || empresa.incentivo_fiscal === undefined) {
        newErrors.incentivo_fiscal = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!empresa.certificado_digital && !empresa.nome_certificado_digital) {
        newErrors.certificado_digital = 'O certificado digital é obrigatório.';
        valid = false;
    } else if (!empresa.senha_certificado_digital || empresa.senha_certificado_digital.length < 3) {
        newErrors.senha_certificado_digital = "Campo deve ter no mínimo 3 números."
        valid = false;
    } else {
        valid = true;
    }
    setErrors(newErrors);
    if (msgs.current && errorMessages.length > 0) {
        msgs.current.show({ severity: 'error', summary: 'Erro', detail: errorMessages[0] });
    }

    return valid;
};
