'use client';
import '@/app/styles/styledGlobal.css';
import Input from '@/app/shared/include/input/input-all';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { IconReal } from '@/app/utils/icons/icons';
import { ServicoFieldsProps } from '../types/servico';
import CustomInputNumber from '@/app/shared/include/inputReal/inputReal';
import InputTextarea from '@/app/shared/include/inputTextArea/InputTextarea';
import CustomMultiSelect from '@/app/shared/include/multSelect/Input';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { PerfilTributarioEntity } from '@/app/entity/perfilTributarioEntity';
import { fetchFilteredEmpresa, listTheEmpresa } from '@/app/(main)/configuracoes/empresas/controller/controller';

export function ServicoDescricaoFields({
    servico,
    errors,
    onChange,
    onNumberChange,
    onDescriptionBlur
}: ServicoFieldsProps) {
    return (
        <div className="grid formgrid">
            <div className="col-12 lg:col-9">
                <Input
                    value={servico.descricao || ''}
                    onChange={onChange}
                    label="Descrição do serviço"
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
            <div className="col-12 lg:col-3">
                <CustomInputNumber
                    id="valor_servico"
                    value={servico.valor_servico || 0}
                    onChange={onNumberChange}
                    label="Valor do servico"
                    useRightButton
                    outlined
                    hasError={!!errors.valor_servico}
                    errorMessage={errors.valor_servico}
                    iconLeft={<IconReal isDarkMode={false} />}
                    topLabel="Valor do servico:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-6">
                <InputTextarea
                    value={servico.descricao_completa || ''}
                    onChange={onChange}
                    rows={5}
                    cols={30}
                    label=""
                    id="descricao_completa"
                    topLabel="Descrição complementar:"
                    showTopLabel
                />
            </div>
            <div className="col-12 lg:col-6">
                <InputTextarea
                    value={servico.observacoes || ''}
                    onChange={onChange}
                    rows={5}
                    cols={30}
                    label=""
                    id="observacoes"
                    topLabel="Observações:"
                    showTopLabel
                />
            </div>
        </div>
    );
}

export function ServicoVinculosFields({
    servico,
    errors,
    selectedPerfilTributario,
    selectedEmpresas,
    onPerfilTributarioChange,
    onCompanyChange,
    fetchAllPerfilTributario,
    fetchFilteredPerfilTributario
}: ServicoFieldsProps) {
    return (
        <div className="grid formgrid">
            <div className="col-12 lg:col-6">
                <DropdownSearch<PerfilTributarioEntity>
                    id="id_perfil_tributario"
                    selectedItem={selectedPerfilTributario}
                    onItemChange={onPerfilTributarioChange}
                    fetchAllItems={fetchAllPerfilTributario}
                    fetchFilteredItems={fetchFilteredPerfilTributario}
                    optionValue="id"
                    optionLabel="nome"
                    initialOptionValue={servico.id_perfil_tributario ?? null}
                    placeholder="Selecione o perfil Tributário"
                    hasError={!!errors.id_perfil_tributario}
                    errorMessage={errors.id_perfil_tributario}
                    showTopLabel
                    required
                    topLabel="Perfil Tributário:"
                    autoSelectSingle
                    autoLoadAndSelectSingle
                    loadOnMount={Boolean(servico.id_perfil_tributario)}
                    reloadAllOnShow
                />
            </div>
            <div className="col-12 lg:col-6">
                <CustomMultiSelect
                    id="id_empresas"
                    selectedItems={selectedEmpresas}
                    onChange={onCompanyChange}
                    options={selectedEmpresas}
                    optionLabel="razao_social"
                    dataKey="id"
                    initialSelectedValues={servico.id_empresas ?? []}
                    placeholder="Selecione as empresas"
                    maxSelectedLabels={3}
                    fetchFilteredItems={fetchFilteredEmpresa}
                    fetchAllItems={listTheEmpresa}
                    hasError={!!errors.id_empresas}
                    errorMessage={errors.id_empresas}
                    showChips
                    showTopLabel
                    topLabel="Empresas:"
                    required
                />
            </div>
        </div>
    );
}

export function ServicoFields(props: ServicoFieldsProps) {
    return (
        <>
            <ServicoDescricaoFields {...props} />
            <ServicoVinculosFields {...props} />
        </>
    );
}
