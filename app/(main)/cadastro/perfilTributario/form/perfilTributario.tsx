'use client';
import '@/app/styles/styledGlobal.css';
import Input from '@/app/shared/include/input/input-all';
import { IconPorcentagem } from '@/app/utils/icons/icons';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { TableService } from '@/app/entity/TableServiceEntity';
import { TableCNAEEntity } from '@/app/entity/TableCNAEEntity';
import { TableCodigoNBSEntity } from '@/app/entity/TableCodigoNBS';
import { PerfilTributarioFieldsProps } from '../types/perfilTributario';
import CustomInputNumber from '@/app/shared/include/inputReal/inputReal';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { TableClassificacaoTributariaEntity } from '@/app/entity/TableClassificacaoTributariaEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import EmpresaDropdownField from '@/app/(main)/configuracoes/empresas/dropDown/empresa';
import { PerfilTributarioRecommendationOption, PerfilTributarioRecommendations } from '../types/perfilTributario';
import { codigoIndicadorOperacao, codigoSituacaoTributariaRegular, exigibilidadeISSServico, IndicadorDestinatario, issRetido, responsavelRetencao, situacaoTributaria } from '@/app/shared/optionsDropDown/options';

export function NomeFields({
    perfilTributario,
    errors,
    onChange,
    onDescriptionBlur
}: PerfilTributarioFieldsProps) {
    return (
        <div className="grid formgrid">
            <div className="col-12 lg:col-10">
                <Input
                    value={perfilTributario.nome || ''}
                    onChange={onChange}
                    label="Nome Perfil Tributário"
                    id="nome"
                    hasError={!!errors.nome}
                    errorMessage={errors.nome}
                    onBlur={onDescriptionBlur}
                    autoFocus
                    topLabel="Nome:"
                    showTopLabel
                    required
                />
            </div>
        </div>
    );
}

interface EmpresaPerfilTributarioFieldsProps {
    perfilTributario: PerfilTributarioFieldsProps['perfilTributario'];
    errors: Record<string, string>;
    selectedEmpresa: CompanyEntity | null;
    selectedCodigoCNAE: TableCNAEEntity | null;
    selectedCodigoNBS: TableCodigoNBSEntity | null;
    selectedCodigoServico: TableService | null;
    selectedClassificacaoTributaria: TableClassificacaoTributariaEntity | null;
    recommendations: PerfilTributarioRecommendations | null;
    isLoadingRecommendations: boolean;
    recommendationsError: string | null;
    onEmpresaChange: (empresa: CompanyEntity | null) => void;
    onCodigoServicoChange: (service: TableService | null) => void;
    onCodigoNBSChange: (codigoNBS: TableCodigoNBSEntity | null) => void;
    onCodigoCNAEChange: (codigoCNAE: TableCNAEEntity | null) => void;
    onClassificacaoTributariaChange: (classificacaoTributaria: TableClassificacaoTributariaEntity | null) => void;
    onDropdownChange: PerfilTributarioFieldsProps['onDropdownChange'];
}

const filterRecommendedOptions = <T extends { codigo: string; descricao: string }>(
    options: T[]
) => async (filter: string): Promise<T[]> => {
    const normalizedFilter = filter.trim().toLocaleLowerCase();
    return options.filter((option) =>
        `${option.codigo} ${option.descricao}`.toLocaleLowerCase().includes(normalizedFilter)
    );
};

const toTableServiceOptions = (options?: PerfilTributarioRecommendationOption[]) =>
    (options ?? []).map((option, index) =>
        new TableService({
            id: index + 1,
            codigo: String(option.codigo),
            descricao: `${option.codigo} - ${option.descricao}`
        })
    );

const toTableCNAEOptions = (options?: PerfilTributarioRecommendationOption[]) =>
    (options ?? []).map((option, index) =>
        new TableCNAEEntity({
            id: index + 1,
            codigo: String(option.codigo),
            descricao: `${option.codigo} - ${option.descricao}`
        })
    );

const toTableNBSOptions = (options?: PerfilTributarioRecommendationOption[]) =>
    (options ?? []).map((option, index) =>
        new TableCodigoNBSEntity({
            id: index + 1,
            codigo: String(option.codigo),
            descricao: `${option.codigo} - ${option.descricao}`
        })
    );

const toTableClassificacaoOptions = (options?: PerfilTributarioRecommendationOption[]) =>
    (options ?? []).map((option, index) =>
        new TableClassificacaoTributariaEntity({
            id: index + 1,
            codigo: String(option.codigo),
            codigoCst: String(option.codigo_cst ?? ''),
            descricao: `${option.codigo} - ${option.descricao}`
        })
    );

export function EmpresaPerfilTributarioFields({
    perfilTributario,
    errors,
    selectedEmpresa,
    selectedCodigoCNAE,
    selectedCodigoNBS,
    selectedCodigoServico,
    selectedClassificacaoTributaria,
    recommendations,
    isLoadingRecommendations,
    recommendationsError,
    onEmpresaChange,
    onCodigoServicoChange,
    onCodigoNBSChange,
    onCodigoCNAEChange,
    onClassificacaoTributariaChange,
    onDropdownChange,
}: EmpresaPerfilTributarioFieldsProps) {
    const recommendedCNAEOptions = toTableCNAEOptions(recommendations?.cnaes);
    const recommendedServicoOptions = toTableServiceOptions(recommendations?.servicos);
    const recommendedNBSOptions = toTableNBSOptions(recommendations?.nbs);
    const recommendedClassificacaoOptions = toTableClassificacaoOptions(recommendations?.classificacoes_tributarias);

    return (
        <div className="grid formgrid">
            <div className="col-12 lg:col-4">
                <EmpresaDropdownField
                    id="id_empresa"
                    selectedEmpresa={selectedEmpresa}
                    selectedEmpresaId={perfilTributario.id_empresa ?? null}
                    onEmpresaChange={onEmpresaChange}
                    hasError={!!errors.id_empresa}
                    errorMessage={errors.id_empresa}
                    required
                    autoSelectSingle={false}
                    autoLoadAndSelectSingle={false}
                />
            </div>
            <div className="col-12 lg:col-4">
                <DropdownSearch<TableCNAEEntity>
                    id="codigo_cnae"
                    selectedItem={selectedCodigoCNAE}
                    onItemChange={onCodigoCNAEChange}
                    fetchAllItems={() => Promise.resolve(recommendedCNAEOptions)}
                    fetchFilteredItems={filterRecommendedOptions(recommendedCNAEOptions)}
                    optionValue="codigo"
                    optionLabel="descricao"
                    hasError={!!errors.codigo_cnae}
                    errorMessage={errors.codigo_cnae}
                    disabled={!perfilTributario.id_empresa || isLoadingRecommendations || !recommendations}
                    reloadAllOnShow
                    topLabel="Código CNAE:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4">
                <DropdownSearch<TableService>
                    id="item_lista_servico"
                    selectedItem={selectedCodigoServico}
                    onItemChange={onCodigoServicoChange}
                    fetchAllItems={() => Promise.resolve(recommendedServicoOptions)}
                    fetchFilteredItems={filterRecommendedOptions(recommendedServicoOptions)}
                    optionValue="codigo"
                    optionLabel="descricao"
                    hasError={!!errors.item_lista_servico}
                    errorMessage={errors.item_lista_servico}
                    disabled={!perfilTributario.id_empresa || isLoadingRecommendations || !recommendations}
                    reloadAllOnShow
                    topLabel="Código do Serviço:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4">
                <DropdownSearch<TableCodigoNBSEntity>
                    id="codigo_nbs"
                    selectedItem={selectedCodigoNBS}
                    onItemChange={onCodigoNBSChange}
                    fetchAllItems={() => Promise.resolve(recommendedNBSOptions)}
                    fetchFilteredItems={filterRecommendedOptions(recommendedNBSOptions)}
                    optionValue="codigo"
                    optionLabel="descricao"
                    hasError={!!errors.codigo_nbs}
                    errorMessage={errors.codigo_nbs}
                    disabled={!perfilTributario.id_empresa || isLoadingRecommendations || !recommendations}
                    reloadAllOnShow
                    topLabel="Código NBS:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4">
                <Dropdown
                    id="codigo_indicador_operacao"
                    value={perfilTributario.codigo_indicador_operacao ?? ''}
                    options={codigoIndicadorOperacao}
                    onChange={onDropdownChange}
                    label="Selecione uma opção"
                    hasError={!!errors.codigo_indicador_operacao}
                    errorMessage={errors.codigo_indicador_operacao}
                    disabled={!perfilTributario.id_empresa || isLoadingRecommendations || !recommendations}
                    topLabel="Indicador de Operação:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4">
                <DropdownSearch<TableClassificacaoTributariaEntity>
                    id="codigo_classificacao_tributaria"
                    selectedItem={selectedClassificacaoTributaria}
                    onItemChange={onClassificacaoTributariaChange}
                    fetchAllItems={() => Promise.resolve(recommendedClassificacaoOptions)}
                    fetchFilteredItems={filterRecommendedOptions(recommendedClassificacaoOptions)}
                    optionValue="codigo"
                    optionLabel="descricao"
                    hasError={!!errors.codigo_classificacao_tributaria}
                    errorMessage={errors.codigo_classificacao_tributaria}
                    disabled={!perfilTributario.id_empresa || isLoadingRecommendations || !recommendations}
                    reloadAllOnShow
                    topLabel="Classificação Tributária:"
                    showTopLabel
                />
            </div>
            {isLoadingRecommendations && (
                <div className="col-12 text-sm text-color-secondary">
                    <i className="pi pi-spin pi-spinner mr-2" />
                    Carregando recomendações para a empresa...
                </div>
            )}
            {recommendationsError && (
                <div className="col-12">
                    <small className="p-error">{recommendationsError}</small>
                </div>
            )}
            {(recommendations?.avisos ?? []).map((aviso) => (
                <div key={aviso} className="col-12 text-sm text-color-secondary">
                    <i className="pi pi-info-circle mr-2" />
                    {aviso}
                </div>
            ))}
        </div>
    );
}

export function PerfilTributarioFields({
    perfilTributario,
    errors,
    onDropdownChange
}: PerfilTributarioFieldsProps) {
    return (
        <div className="grid formgrid">
              <div className="col-12 lg:col-4">
                <Dropdown
                    value={perfilTributario.iss_retido ?? ''}
                    onChange={onDropdownChange}
                    label="Iss Retido"
                    options={issRetido}
                    id="iss_retido"
                    hasError={!!errors.iss_retido}
                    errorMessage={errors.iss_retido}
                    topLabel="Iss Retido:"
                    showTopLabel
                    required
                />
            </div>
             <div className="col-12 lg:col-4">
                <Dropdown
                    id="exigibilidade_iss"
                    value={perfilTributario.exigibilidade_iss ?? ''}
                    options={exigibilidadeISSServico}
                    onChange={onDropdownChange}
                    label="Selecione uma opção"
                    filterBy={false}
                    hasError={!!errors.exigibilidade_iss}
                    errorMessage={errors.exigibilidade_iss}
                    topLabel="Exigibilidade ISS:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4">
                <Dropdown
                    id="codigo_situacao_tributaria"
                    value={perfilTributario.codigo_situacao_tributaria ?? ''}
                    options={situacaoTributaria}
                    onChange={onDropdownChange}
                    label="Selecione uma opção"
                    filterBy={false}
                    hasError={!!errors.codigo_situacao_tributaria}
                    errorMessage={errors.codigo_situacao_tributaria}
                    topLabel="Situação Tributária:"
                    showTopLabel
                    required
                />
            </div>
              <div className="col-12 lg:col-4">
                <Dropdown
                    id="indicador_destinatario"
                    value={perfilTributario.indicador_destinatario ?? ''}
                    options={IndicadorDestinatario}
                    onChange={onDropdownChange}
                    label="Selecione uma opção"
                    filterBy={false}
                    hasError={!!errors.indicador_destinatario}
                    errorMessage={errors.indicador_destinatario}
                    topLabel="Indicação Destinatário:"
                    showTopLabel
                />
            </div>
            <div className="col-12 lg:col-4">
                <Dropdown
                    id="responsavel_retencao"
                    value={perfilTributario.responsavel_retencao ?? ''}
                    options={responsavelRetencao}
                    onChange={onDropdownChange}
                    label="Selecione uma opção"
                    filterBy={false}
                    hasError={!!errors.responsavel_retencao}
                    errorMessage={errors.responsavel_retencao}
                    topLabel="Retenção:"
                    showTopLabel
                />
            </div>
           
          
           
            <div className="col-12 lg:col-4">
                <Dropdown
                    id="codigo_situacao_tributaria_regular"
                    value={perfilTributario.codigo_situacao_tributaria_regular || ''}
                    options={codigoSituacaoTributariaRegular}
                    onChange={onDropdownChange}
                    label="Selecione uma opção"
                    filterBy={false}
                    topLabel="Classificação Tributária Regular:"
                    showTopLabel
                />
            </div>
          
           
            
          
        </div>
    );
}
export function PerfilTributarioAvancadaFields({
    perfilTributario,
    errors,
    onChange,
    onNumberChange
}: PerfilTributarioFieldsProps) {
    return (
        <div className="grid formgrid">
            <div className="col-12 lg:col-4">
                <CustomInputNumber
                    id="aliquota_deducoes"
                    value={perfilTributario.aliquota_deducoes || 0}
                    onChange={onNumberChange}
                    label="Alíquota Deduções"
                    useRightButton
                    outlined
                    hasError={!!errors.aliquota_deducoes}
                    errorMessage={errors.aliquota_deducoes}
                    topLabel="Alíquota Deduções:"
                    showTopLabel
                    required
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 lg:col-4">
                <CustomInputNumber
                    id="percentual_diferencial_uf"
                    value={perfilTributario.percentual_diferencial_uf || 0}
                    onChange={onNumberChange}
                    label="Percentual diferencial UF"
                    useRightButton
                    outlined
                    hasError={!!errors.percentual_diferencial_uf}
                    errorMessage={errors.percentual_diferencial_uf}
                    topLabel="Diferencial UF:"
                    showTopLabel
                    required
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 lg:col-4">
                <CustomInputNumber
                    id="percentual_diferencial_municipal"
                    value={perfilTributario.percentual_diferencial_municipal || 0}
                    onChange={onNumberChange}
                    label="Percentual diferencial municipal"
                    useRightButton
                    outlined
                    hasError={!!errors.percentual_diferencial_municipal}
                    errorMessage={errors.percentual_diferencial_municipal}
                    topLabel="Diferencial:"
                    showTopLabel
                    required
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 lg:col-4">
                <CustomInputNumber
                    id="percentual_diferencial_cbs"
                    value={perfilTributario.percentual_diferencial_cbs || 0}
                    onChange={onNumberChange}
                    label="Percentual diferencial CBS"
                    useRightButton
                    outlined
                    hasError={!!errors.percentual_diferencial_cbs}
                    errorMessage={errors.percentual_diferencial_cbs}
                    topLabel="CBS:"
                    showTopLabel
                    required
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 lg:col-4">
                <Input
                    value={perfilTributario.codigo_credito_presumido || ''}
                    onChange={onChange}
                    label="Código do crédito presumido"
                    id="codigo_credito_presumido"
                    hasError={!!errors.codigo_credito_presumido}
                    errorMessage={errors.codigo_credito_presumido}
                    topLabel="Código Presumido:"
                    maxLength={20}
                    showTopLabel
                />
            </div>
            <div className="col-12 lg:col-4">
                <Input
                    value={perfilTributario.codigo_municipio || ''}
                    onChange={onChange}
                    label="Código do Município"
                    id="codigo_municipio"
                    hasError={!!errors.codigo_municipio}
                    errorMessage={errors.codigo_municipio}
                    topLabel="Código Município:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4">
                <Input
                    value={perfilTributario.numero_processo || ''}
                    onChange={onChange}
                    label="Número do Processo"
                    id="numero_processo"
                    topLabel="Número do Processo:"
                    showTopLabel
                />
            </div>
        </div>
    );
}
export function PerfilFields(props: PerfilTributarioFieldsProps) {
    return (
        <>
            <NomeFields {...props} />
            <PerfilTributarioFields {...props} />
            <PerfilTributarioAvancadaFields {...props} />
        </>
    );
}
