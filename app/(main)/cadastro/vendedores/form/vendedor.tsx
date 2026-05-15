'use client';
import './style.css';
import '@/app/styles/styledGlobal.css';
import {VendedorFieldsProps,} from '../types/vendedor';
import Input from '@/app/shared/include/input/input-all';
import { IconPorcentagem } from '@/app/utils/icons/icons';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { InputMaskDrop } from '@/app/shared/include/inputMask/input';
import { DropDownTipoPessoa } from '@/app/shared/optionsDropDown/options';

export function VendedorFields({
    vendedor,
    errors,
    loadingCnpj,
    hasFocused,
    onFocusFirstField,
    onChange,
    onDropdownChange,
    onSearchCnpj,
    onValidateCnpj,
    onValidateTelefone
}: VendedorFieldsProps) {
    return (
        <div className="grid formgrid mt-3">
            <div className="col-12 lg:col-3 ">
                <Dropdown
                    id="tipo_pessoa"
                    value={vendedor?.tipo_pessoa || ''}
                    options={DropDownTipoPessoa}
                    onChange={onDropdownChange}
                    optionLabel="name"
                    optionValue="code"
                    label=""
                    hasError={!!errors.tipoPessoa}
                    errorMessage={errors.tipoPessoa}
                    showTopLabel
                    required
                    topLabel="Tipo de Pessoa:"
                />
            </div>
            {vendedor?.tipo_pessoa === 'PESSOA_JURIDICA' && (
                <>
                    <div className="col-12 lg:col-4 ">
                        <InputMaskDrop
                            id="cnpj"
                            value={vendedor.cnpj || ''}
                            onChange={(event) => {
                                onChange({
                                    target: {
                                        id: event.target.id,
                                        value: event.value,
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
                            disabledRightButton={(vendedor.cnpj || '').replace(/\D/g, '').length !== 14}
                            loading={loadingCnpj}
                            onBlur={onValidateCnpj}
                            autoFocus={!hasFocused}
                            onFocus={onFocusFirstField}
                            showTopLabel
                            required
                            topLabel="CNPJ:"
                        />
                    </div>
                    <div className="col-12 lg:col-5 ">
                        <Input
                            id="razao_social"
                            value={vendedor?.razao_social || ''}
                            onChange={onChange}
                            label="Nome ou Razao Social"
                            hasError={!!errors.razao_social}
                            errorMessage={errors.razao_social}
                            showTopLabel
                            required
                            topLabel="Razão Social:"
                        />
                    </div>
                    <div className="col-12 lg:col-6 ">
                        <Input
                            value={vendedor?.nome_fantasia || ''}
                            onChange={onChange}
                            label="Nome Fantasia"
                            id="nome_fantasia"
                            showTopLabel
                            topLabel="Nome Fantasia:"
                        />
                    </div>
                    <div className="col-12 lg:col-2 ">
                        <Input
                            value={vendedor.percentual_comissao ?? 0}
                            onChange={onChange}
                            label="Comissão"
                            id="percentual_comissao"
                            type="number"
                            useRightButton
                            hasError={!!errors.percentual_comissao}
                            errorMessage={errors.percentual_comissao}
                            iconLeft={<IconPorcentagem isDarkMode={false} />}
                            showTopLabel
                            required
                            topLabel="Comissão:"
                        />
                    </div>
                    <div className="col-12 lg:col-4 ">
                        <InputMaskDrop
                            id="telefone"
                            value={vendedor.telefone || ''}
                            onChange={onChange}
                            placeholder="+55 (99) 9999-9999"
                            mask="+99 (99) 99999-9999"
                            outlined={false}
                            hasError={!!errors.telefone}
                            errorMessage={errors.telefone}
                            onClickSearch={function (): void {}}
                            showTopLabel
                            topLabel="Telefone:"
                            onBlur={onValidateTelefone}
                        />
                    </div>
                </>
            )}
            {vendedor?.tipo_pessoa === 'PESSOA_FISICA' && (
                <>
                    <div className="col-12 lg:col-2 ">
                        <InputMaskDrop
                            id="cpf"
                            value={vendedor.cpf || ''}
                            onChange={onChange}
                            placeholder="999.999.999-99"
                            mask="999.999.999-99"
                            iconRight="pi pi-search"
                            outlined
                            hasError={!!errors.cpf}
                            errorMessage={errors.cpf}
                            onClickSearch={function (): void {}}
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
                            value={vendedor.rg || ''}
                            onChange={onChange}
                            placeholder="99.999.999-9"
                            mask="99.999.999-9"
                            iconRight="pi pi-search"
                            outlined
                            hasError={!!errors.rg}
                            errorMessage={errors.rg}
                            onClickSearch={function (): void {}}
                            showTopLabel
                            required
                            topLabel="RG:"
                        />
                    </div>
                    <div className="col-12 lg:col-5 ">
                        <Input
                            id="razao_social"
                            value={vendedor?.razao_social || ''}
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
                        <Input
                            value={vendedor.percentual_comissao ?? 0}
                            onChange={onChange}
                            label="Comissao"
                            id="percentual_comissao"
                            type="number"
                            useRightButton
                            hasError={!!errors.percentual_comissao}
                            errorMessage={errors.percentual_comissao}
                            iconLeft={<IconPorcentagem isDarkMode={false} />}
                            showTopLabel
                            required
                            topLabel="Comissao:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 ">
                        <InputMaskDrop
                            id="telefone"
                            value={vendedor.telefone || ''}
                            onChange={onChange}
                            placeholder="+55 (99) 9999-9999"
                            mask="+55 (99) 9999-9999"
                            outlined={false}
                            hasError={!!errors.telefone}
                            errorMessage={errors.telefone}
                            onClickSearch={function (): void {}}
                            showTopLabel
                            topLabel="Telefone:"
                        />
                    </div>
                </>
            )}
            {vendedor?.tipo_pessoa === 'ESTRANGEIRO' && (
                <>
                    <div className="col-12 lg:col-5 ">
                        <Input
                            value={vendedor.documento_estrangeiro || ''}
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
                    <div className="col-12 lg:col-4 ">
                        <Input
                            value={vendedor.percentual_comissao ?? 0}
                            onChange={onChange}
                            label="Comissao"
                            id="percentual_comissao"
                            type="number"
                            useRightButton
                            hasError={!!errors.percentual_comissao}
                            errorMessage={errors.percentual_comissao}
                            iconLeft={<IconPorcentagem isDarkMode={false} />}
                            showTopLabel
                            required
                            topLabel="Comissao:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 ">
                        <InputMaskDrop
                            id="telefone"
                            value={vendedor.telefone || ''}
                            onChange={onChange}
                            placeholder="+55 (99) 9999-9999"
                            mask="+55 (99) 9999-9999"
                            outlined={false}
                            hasError={!!errors.telefone}
                            errorMessage={errors.telefone}
                            onClickSearch={function (): void {}}
                            showTopLabel
                            required
                            topLabel="Telefone:"
                        />
                    </div>
                    <div className="col-12 lg:col-6 ">
                        <Input
                            value={vendedor.pais || ''}
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
            {vendedor?.tipo_pessoa === 'ESTRANGEIRO_NO_BRASIL' && (
                <>
                    <div className="col-12 lg:col-4 ">
                        <Input
                            value={vendedor.documento_estrangeiro || ''}
                            onChange={onChange}
                            label="Documento de identificacao"
                            id="documento_estrangeiro"
                            hasError={!!errors.documento_estrangeiro}
                            errorMessage={errors.documento_estrangeiro}
                            showTopLabel
                            required
                            topLabel="Doc de identificacao:"
                        />
                    </div>
                    <div className="col-12 lg:col-2 ">
                        <Input
                            value={vendedor.percentual_comissao ?? 0}
                            onChange={onChange}
                            label="Comissao"
                            id="percentual_comissao"
                            type="number"
                            useRightButton
                            hasError={!!errors.percentual_comissao}
                            errorMessage={errors.percentual_comissao}
                            iconLeft={<IconPorcentagem isDarkMode={false} />}
                            showTopLabel
                            required
                            topLabel="Comissao:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 ">
                        <InputMaskDrop
                            id="telefone"
                            value={vendedor.telefone || ''}
                            onChange={onChange}
                            placeholder="+55 (99) 9999-9999"
                            mask="+55 (99) 9999-9999"
                            outlined={false}
                            hasError={!!errors.telefone}
                            errorMessage={errors.telefone}
                            onClickSearch={function (): void {}}
                            showTopLabel
                            topLabel="Telefone:"
                        />
                    </div>
                </>
            )}
        </div>
    );
}
