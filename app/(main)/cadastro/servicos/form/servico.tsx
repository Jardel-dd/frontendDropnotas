'use client';
import '@/app/styles/styledGlobal.css';
import {ServicoFieldsProps} from '../types/servico';
import Input from '@/app/shared/include/input/input-all';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { TableCodigoNBSEntity } from '@/app/entity/TableCodigoNBS';
import { IconPorcentagem, IconReal } from '@/app/utils/icons/icons';
import CustomInputNumber from '@/app/shared/include/inputReal/inputReal';
import InputTextarea from '@/app/shared/include/inputTextArea/InputTextarea';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { TableClassificacaoTributariaEntity } from '@/app/entity/TableClassificacaoTributariaEntity';
import { codigoIndicadorOperacao, codigoSituacaoTributariaRegular, exigibilidadeISSServico, IndicadorDestinatario, issRetido, responsavelRetencao, situacaoTributaria} from '@/app/shared/optionsDropDown/options';
import { TableService } from '@/app/entity/TableServiceEntity';
import { fetchAllTabelaServico, fetchFilteredTabelaServico } from '@/app/components/fetchAll/listAllTableService/controller';
import { TableCNAEEntity } from '@/app/entity/TableCNAEEntity';
import { fetchAllCnae, fetchFilteredCnae } from '@/app/components/fetchAll/listAllCnae/controller';
export function ServicoFields({
    servico,
    errors,
    selectedService,
    selectedCodigoNBS,
    selectedCodigoCNAE,
    onCodigoCNAEChange,
    selectedCodigoServico,
    selectedClassificacaoTributaria,
    onChange,
    onDropdownChange,
    onNumberChange,
    onServicoChange,
    onCodigoNBSChange,
    onCodigoServicoChange,
    onClassificacaoTributariaChange,
    onDescriptionBlur,
    fetchServiceTable,
    fetchAllClassificacaoTributaria,
    fetchFilteredClassificacaoTributaria,
    fetchAllCodigoNBS,
    fetchFilteredCodigoNBS
}: ServicoFieldsProps) {
    return (
        <div className="grid formgrid">
            <div className="col-12  lg:col-10">
                <Input
                    value={servico.descricao || ''}
                    onChange={onChange}
                    label="Descrição completa Serviço"
                    id="descricao"
                    hasError={!!errors.descricao}
                    errorMessage={errors.descricao}
                    onBlur={onDescriptionBlur}
                    autoFocus
                    topLabel="Descrição:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12  lg:col-2">
                <CustomInputNumber
                    id="valor_servico"
                    value={servico.valor_servico || 0}
                    onChange={onNumberChange}
                    label="Valor Serviço"
                    useRightButton
                    outlined
                    hasError={!!errors.valor_servico}
                    errorMessage={errors.valor_servico}
                    iconLeft={<IconReal isDarkMode={false} />}
                    topLabel="Valor Serviço:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4">
                <CustomInputNumber
                    id="percentual_diferencial_municipal"
                    value={servico.percentual_diferencial_municipal || 0}
                    onChange={onNumberChange}
                    label="Percentual diferencial UF"
                    useRightButton
                    outlined
                    hasError={!!errors.percentual_diferencial_municipal}
                    errorMessage={errors.percentual_diferencial_municipal}
                    topLabel="Diferencial UF:"
                    showTopLabel
                    required
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 lg:col-4">
                <CustomInputNumber
                    id="aliquota_deducoes"
                    value={servico.aliquota_deducoes || 0}
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
            <div className="col-12  lg:col-4">
                <CustomInputNumber
                    id="percentual_diferencial_cbs"
                    value={servico.percentual_diferencial_cbs || 0}
                    onChange={onNumberChange}
                    label="Percentual diferencial CBS"
                    useRightButton
                    outlined
                    hasError={!!errors.percentual_diferencial_cbs}
                    errorMessage={errors.percentual_diferencial_cbs}
                    topLabel="Diferencial CBS:"
                    showTopLabel
                    required
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 lg:col-4">
                <CustomInputNumber
                    id="percentual_diferencial_uf"
                    value={servico.percentual_diferencial_uf || 0}
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
                <Dropdown
                    value={servico.iss_retido ?? ''}
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
                    value={servico.exigibilidade_iss ?? ''}
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
            <div className="col-12  lg:col-4">
                <Dropdown
                    id="codigo_situacao_tributaria"
                    value={servico.codigo_situacao_tributaria ?? ''}
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
            <div className="col-12  lg:col-4">
                <DropdownSearch<TableClassificacaoTributariaEntity>
                    id="codigo_classificacao_tributaria"
                    selectedItem={selectedClassificacaoTributaria}
                    onItemChange={onClassificacaoTributariaChange}
                    fetchAllItems={fetchAllClassificacaoTributaria}
                    fetchFilteredItems={fetchFilteredClassificacaoTributaria}
                    optionValue="codigo"
                    optionLabel="descricao"
                    hasError={!!errors.codigo_classificacao_tributaria}
                    errorMessage={errors.codigo_classificacao_tributaria}
                    topLabel="Classificação Tributária:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12  lg:col-4">
                <DropdownSearch<TableCodigoNBSEntity>
                    id="codigo_nbs"
                    selectedItem={selectedCodigoNBS}
                    onItemChange={onCodigoNBSChange}
                    fetchAllItems={fetchAllCodigoNBS}
                    fetchFilteredItems={fetchFilteredCodigoNBS}
                    optionValue="codigo"
                    optionLabel="descricao"
                    hasError={!!errors.codigo_nbs}
                    errorMessage={errors.codigo_nbs}
                    topLabel="Código NBS:"
                    showTopLabel
                    required
                />
            </div>
             <div className="col-12  lg:col-4">
                <DropdownSearch<TableCNAEEntity>
                    id="codigo_cnae"
                    selectedItem={selectedCodigoCNAE}
                    onItemChange={onCodigoCNAEChange}
                    fetchAllItems={fetchAllCnae}
                    fetchFilteredItems={fetchFilteredCnae}
                    optionValue="codigo"
                    optionLabel="descricao"
                    hasError={!!errors.codigo_cnae}
                    errorMessage={errors.codigo_cnae}
                    topLabel="Código CNAE:"
                    showTopLabel
                    required
                />
            </div>
             <div className="col-12  lg:col-4">
                <DropdownSearch<TableService>
                    id="item_lista_servico"
                    selectedItem={selectedCodigoServico}
                    onItemChange={onCodigoServicoChange}
                    fetchAllItems={fetchAllTabelaServico}
                    fetchFilteredItems={fetchFilteredTabelaServico}
                    optionValue="codigo"
                    optionLabel="descricao"
                    hasError={!!errors.item_lista_servico}
                    errorMessage={errors.item_lista_servico}
                    topLabel="Código do Serviço:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12  lg:col-4">
                <Dropdown
                    id="codigo_situacao_tributaria_regular"
                    value={servico.codigo_situacao_tributaria_regular || ''}
                    options={codigoSituacaoTributariaRegular}
                    onChange={onDropdownChange}
                    label="Selecione uma opção"
                    filterBy={false}
                    topLabel="Classificação Tributária Regular:"
                    showTopLabel
                />
            </div>
            <div className="col-12  lg:col-4">
                <Dropdown
                    id="indicador_destinatario"
                    value={servico.indicador_destinatario ?? ''}
                    options={IndicadorDestinatario}
                    onChange={onDropdownChange}
                    label="Selecione uma opção"
                    filterBy={false}
                    hasError={!!errors.indicador_destinatario}
                    errorMessage={errors.indicador_destinatario}
                    topLabel="Indicação Destinatário:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12  lg:col-4">
                <Input
                    value={servico.codigo_credito_presumido || ''}
                    onChange={onChange}
                    label="Código do crédito presumido"
                    id="codigo_credito_presumido"
                    hasError={!!errors.codigo_credito_presumido}
                    errorMessage={errors.codigo_credito_presumido}
                    topLabel="Codigo Crédito Presumido:"
                    maxLength={20}
                    showTopLabel
                />
            </div>
            <div className="col-12  lg:col-4">
                <Dropdown
                    id="responsavel_retencao"
                    value={servico.responsavel_retencao ?? ''}
                    options={responsavelRetencao}
                    onChange={onDropdownChange}
                    label="Selecione uma opção"
                    filterBy={false}
                    hasError={!!errors.responsavel_retencao}
                    errorMessage={errors.responsavel_retencao}
                    topLabel="Retenção:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12  lg:col-4">
                <Dropdown
                    id="codigo_indicador_operacao"
                    value={servico.codigo_indicador_operacao ?? ''}
                    options={codigoIndicadorOperacao}
                    onChange={onDropdownChange}
                    label="Selecione uma opção"
                    filterBy={false}
                    topLabel="Indicador de Operação:"
                    showTopLabel
                />
            </div>
            <div className="col-12  lg:col-4">
                <Input
                    value={servico.codigo_municipio || ''}
                    onChange={onChange}
                    label="Código do Município"
                    id="codigo_municipio"
                    hasError={!!errors.codigo_municipio}
                    errorMessage={errors.codigo_municipio}
                    topLabel="Código do Município:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12  lg:col-4">
                <Input
                    value={servico.numero_processo || ''}
                    onChange={onChange}
                    label="Número do Processo"
                    id="numero_processo"
                    topLabel="Número do Processo:"
                    showTopLabel
                />
            </div>
            <div className="col-12 mb-1 lg:col-3 lg:mb-0 w-full">
                <InputTextarea
                    value={servico.descricao_completa || ''}
                    onChange={onChange}
                    rows={5}
                    cols={30}
                    label=""
                    id="descricao_completa"
                    topLabel="Descrição Complementar:"
                    showTopLabel
                />
            </div>
        </div>
    );
}
