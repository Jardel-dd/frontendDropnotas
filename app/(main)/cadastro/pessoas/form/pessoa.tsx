'use client';
import '@/app/styles/styledGlobal.css';
import {  PessoaFieldsProps } from '../types/pessoa';
import Input from '@/app/shared/include/input/input-all';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { TableCNAEEntity } from '@/app/entity/TableCNAEEntity';
import { InputMaskDrop } from '@/app/shared/include/inputMask/input';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import {contribuinteOptions, DropDownTipoPessoa, OptionsTipoContrato,regimeTributarioPessoaOptions} from '@/app/shared/optionsDropDown/options';
import ContratoDropdownField from '../dropDown/contrato';
export function PessoaFields({
    pessoa,
    errors,
    selectedContato,
    selectedContrato,
    selectedCNAE,
    loadingCnpj,
    hasFocused,
    reloadKeyContrato,
    onAddContato,
    onFocusFirstField,
    onChange,
    onDropdownChange,
    onContatoChange,
    onAddContrato,
    onContratoChange,
    onCNAEChange,
    onSearchCnpj,
    onValidateCnpj,
    fetchAllCnae,
    fetchFilteredCnae
}: PessoaFieldsProps) {
    const reloadKeyCNAE = 0;
    return (
        <div className="grid formgrid">
            <div className="col-12 lg:col-3">
                <Dropdown
                    id="tipo_pessoa"
                    value={pessoa?.tipo_pessoa || ''}
                    options={DropDownTipoPessoa}
                    onChange={onDropdownChange}
                    optionLabel="name"
                    optionValue="code"
                    label=""
                    hasError={!!errors.tipoPessoa}
                    errorMessage={errors.tipoPessoa}
                    topLabel="Tipo de Pessoa:"
                    showTopLabel
                    required
                />
            </div>
            {pessoa?.tipo_pessoa === 'PESSOA_JURIDICA' && (
                <>
                    <div className="col-12 lg:col-3 ">
                        <InputMaskDrop
                            id="cnpj"
                            value={pessoa.cnpj || ''}
                            onChange={(e) => {
                                onChange({
                                    target: {
                                        id: e.target.id,
                                        value: e.value,
                                        type: 'text'
                                    }
                                });
                            }}
                            onClickSearch={onSearchCnpj}
                            placeholder="99.999.999/9999-99"
                            mask="99.999.999/9999-99"
                            iconRight="pi pi-search"
                            outlined={false}
                            useRightButton
                            hasError={!!errors.cnpj}
                            errorMessage={errors.cnpj}
                            disabledRightButton={(pessoa.cnpj || '').replace(/\D/g, '').length !== 14}
                            loading={loadingCnpj}
                            onBlur={onValidateCnpj}
                            autoFocus={!hasFocused}
                            onFocus={onFocusFirstField}
                            showTopLabel
                            required
                            topLabel="CNPJ:"
                        />
                    </div>
                    <div className="col-12 lg:col-6 ">
                        <Input
                            id="razao_social"
                            value={pessoa?.razao_social || ''}
                            onChange={onChange}
                            label="Nome ou Razão Social:"
                            hasError={!!errors.razao_social}
                            errorMessage={errors.razao_social}
                            showTopLabel
                            required
                            topLabel="Nome ou Razão Social:"
                        />
                    </div>
                    <div className="col-12 lg:col-6 ">
                        <Input
                            value={pessoa?.nome_fantasia || ''}
                            onChange={onChange}
                            label="Nome Fantasia"
                            id="nome_fantasia"
                            hasError={!!errors.nome_fantasia}
                            errorMessage={errors.nome_fantasia}
                            showTopLabel
                            required
                            topLabel="Nome Fantasia:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 ">
                        <Dropdown
                            id="codigo_regime_tributario"
                            value={pessoa?.codigo_regime_tributario ?? ''}
                            options={regimeTributarioPessoaOptions}
                            onChange={onDropdownChange}
                            label="Selecione um Regime Tributário"
                            hasError={!!errors.selectedRegime}
                            errorMessage={errors.selectedRegime}
                            showTopLabel
                            required
                            topLabel="Código Regime Tributário:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 ">
                        <Dropdown
                            id="contribuinte"
                            value={pessoa.contribuinte ?? ''}
                            options={contribuinteOptions}
                            onChange={onDropdownChange}
                            optionValue="code"
                            label="Contribuinte"
                            hasError={!!errors.contribuinte}
                            errorMessage={errors.contribuinte}
                            showTopLabel
                            topLabel="Selecione o Contribuinte:"
                            required
                        />
                    </div>
                    <div className="col-12 lg:col-3 ">
                        <Input
                            value={pessoa.inscricao_estadual || ''}
                            onChange={onChange}
                            label="Inscrição Estadual"
                            id="inscricao_estadual"
                            hasError={!!errors.inscricao_estadual}
                            errorMessage={errors.inscricao_estadual}
                            showTopLabel
                            topLabel="Inscrição Estadual:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 ">
                        <Input
                            value={pessoa.inscricao_municipal || ''}
                            onChange={onChange}
                            label="Inscrição Municipal"
                            id="inscricao_municipal"
                            hasError={!!errors.inscricao_municipal}
                            errorMessage={errors.inscricao_municipal}
                            showTopLabel
                            topLabel="Inscrição Municipal:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 ">
                        <Input
                            value={pessoa.atividade_principal || ''}
                            onChange={onChange}
                            label="Atividade Principal"
                            id="atividade_principal"
                            hasError={!!errors.atividade_principal}
                            errorMessage={errors.atividade_principal}
                            showTopLabel
                            topLabel="Atividade Principal:"
                        />
                    </div>
                </>
            )}
            {pessoa?.tipo_pessoa === 'PESSOA_FISICA' && (
                <>
                    <div className="col-12 lg:col-2 ">
                        <InputMaskDrop
                            id="cpf"
                            value={pessoa.cpf || ''}
                            onChange={onChange}
                            placeholder="999.999.999-99"
                            mask="999.999.999-99"
                            iconRight="pi pi-search"
                            outlined
                            hasError={!!errors.cpf}
                            errorMessage={errors.cpf}
                            onClickSearch={function (): void { }}
                            autoFocus={!hasFocused}
                            onFocus={onFocusFirstField}
                            showTopLabel
                            required
                            topLabel="CPF:"
                        />
                    </div>
                    <div className="col-12 lg:col-2 ">
                        <InputMaskDrop
                            id="rg"
                            value={pessoa.rg || ''}
                            onChange={onChange}
                            placeholder="99.999.999-9"
                            mask="99.999.999-9"
                            iconRight="pi pi-search"
                            outlined
                            hasError={!!errors.rg}
                            errorMessage={errors.rg}
                            onClickSearch={function (): void { }}
                            showTopLabel
                            required
                            topLabel="RG:"
                        />
                    </div>
                    <div className="col-12 lg:col-5 ">
                        <Input
                            id="razao_social"
                            value={pessoa?.razao_social || ''}
                            onChange={onChange}
                            label="Nome:"
                            hasError={!!errors.razao_social}
                            errorMessage={errors.razao_social}
                            showTopLabel
                            required
                            topLabel="Nome:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 ">
                        <Dropdown
                            id="codigo_regime_tributario"
                            value={pessoa?.codigo_regime_tributario ?? ''}
                            options={regimeTributarioPessoaOptions}
                            onChange={onDropdownChange}
                            label="Selecione um Regime Tributario"
                            hasError={!!errors.selectedRegime}
                            errorMessage={errors.selectedRegime}
                            showTopLabel
                            required
                            topLabel="Código Regime Tributario:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 ">
                        <Dropdown
                            id="contribuinte"
                            value={pessoa.contribuinte || ''}
                            options={contribuinteOptions}
                            onChange={onDropdownChange}
                            placeholder="Selecione o Contribuinte"
                            optionValue="code"
                            label=""
                            hasError={!!errors.contribuinte}
                            errorMessage={errors.contribuinte}
                            showTopLabel
                            required
                            topLabel="Selecione o Contribuinte:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 ">
                        <Input
                            value={pessoa.inscricao_estadual || ''}
                            onChange={onChange}
                            label="Inscrição Estadual"
                            id="inscricao_estadual"
                            hasError={!!errors.inscricao_estadual}
                            errorMessage={errors.inscricao_estadual}
                            showTopLabel
                            topLabel="Inscrição Estadual:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 ">
                        <Input
                            value={pessoa.inscricao_municipal || ''}
                            onChange={onChange}
                            label="Inscrição Municipal"
                            id="inscricao_municipal"
                            hasError={!!errors.inscricao_municipal}
                            errorMessage={errors.inscricao_municipal}
                            showTopLabel
                            topLabel="Inscrição Municipal:"
                        />
                    </div>
                </>
            )}
            {pessoa?.tipo_pessoa === 'ESTRANGEIRO' && (
                <>
                    <div className="col-12 lg:col-3 ">
                        <Input
                            value={pessoa.documento_estrangeiro || ''}
                            onChange={onChange}
                            label="Documento de identificacao"
                            id="documento_estrangeiro"
                            hasError={!!errors.documentoEstrangeiro}
                            errorMessage={errors.documentoEstrangeiro}
                            showTopLabel
                            required
                            topLabel="Documento de identificacao:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 ">
                        <Input
                            value={pessoa.pais || ''}
                            onChange={onChange}
                            label="Nome do Pais"
                            id="pais"
                            hasError={!!errors.pais}
                            errorMessage={errors.pais}
                            showTopLabel
                            required
                            topLabel="Nome do Pais:"
                        />
                    </div>
                </>
            )}
            {pessoa?.tipo_pessoa === 'ESTRANGEIRO_NO_BRASIL' && (
                <div className="col-12 lg:col-3 ">
                    <Input
                        value={pessoa.documento_estrangeiro || ''}
                        onChange={onChange}
                        label="Documento de identificacao"
                        id="documento_estrangeiro"
                        hasError={!!errors.documento_estrangeiro}
                        errorMessage={errors.documento_estrangeiro}
                        showTopLabel
                        required
                        topLabel="Documento de identificacao:"
                    />
                </div>
            )}
            <div className="col-12  lg:col-3">
                <DropdownSearch<TableCNAEEntity>
                    id="cnae_fiscal"
                    selectedItem={selectedCNAE}
                    key={reloadKeyCNAE}
                    onItemChange={onCNAEChange}
                    fetchAllItems={fetchAllCnae}
                    fetchFilteredItems={fetchFilteredCnae}
                    optionLabel="descricao"
                    optionValue="id"
                    placeholder="Selecione CNAE"
                    hasError={!!errors.cnae_fiscal}
                    errorMessage={errors.cnae_fiscal}
                    topLabel="CNAE Fiscal"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-3 ">
                <Dropdown
                    id="selectedContato"
                    value={selectedContato}
                    onChange={onContatoChange}
                    options={OptionsTipoContrato}
                    optionLabel="label"
                    optionValue="value"
                    label=""
                    placeholder="Selecione o Contato"
                    hasError={!!errors.selectedContato}
                    errorMessage={errors.selectedContato}
                    showTopLabel
                    required
                    topLabel="Tipo de contato:"
                />
            </div>
             <div className="col-12 lg:col-3">
                                     <ContratoDropdownField
                                            selectedContrato={selectedContrato}
                                            selectedContratoId={pessoa.id_contrato ?? null}
                                            onContratoChange={onContratoChange}
                                            reloadKey={reloadKeyContrato}
                                            hasError={!!errors.selectedContrato}
                                            errorMessage={errors.selectedContrato}
                                            showAddButton
                                            onAddClick={onAddContrato}
                                            autoSelectSingle={false}
                                        />
                                    </div>
            <div className="col-12 lg:col-6">
                <Input
                    value={pessoa?.email || ''}
                    onChange={onChange}
                    label="E-mail"
                    id="email"
                    type="email"
                    hasError={!!errors.email}
                    errorMessage={errors.email}
                    topLabel="E-mail:"
                    showTopLabel
                    required
                />
            </div>
        </div>
    );
}
