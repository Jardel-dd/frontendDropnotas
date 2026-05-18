'use client';
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import { IconReal } from '@/app/utils/icons/icons';
import { InputSwitch } from 'primereact/inputswitch';
import Input from '@/app/shared/include/input/input-all';
import type {ContratoFieldsProps,} from '../types/contratos';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import CustomInputNumber from '@/app/shared/include/inputReal/inputReal';
import { OptionsPeriodicidade } from '@/app/shared/optionsDropDown/options';
import PessoaDropdownField from '@/app/(main)/cadastro/pessoas/dropDown/pessoa';
import ServicoDropdownField from '@/app/(main)/cadastro/servicos/dropdown/servico';
import EmpresaDropdownField from '@/app/(main)/configuracoes/empresas/dropDown/empresa';
import FormaPagamentoDropdownField from '@/app/(main)/cadastro/formaPagamento/dropDown/formaPagamento';
import CategoriaContratoDropdownField from '@/app/(main)/cadastro/categoriaContratos/dropDown/categoriaContratos';
export type {ContratoFieldsProps, ContratoFormProps, ContratoFormRef,FormContratoCreatedProps} from '../types/contratos';

export function ContratoFields({
    contrato,
    errors,
    selectedPessoa,
    selectedCompany,
    selectedService,
    selectedCategoriaContrato,
    selectedFormaPagamento,
    reloadKeyPessoa,
    reloadKeyEmpresa,
    reloadKeyServico,
    reloadKeyCategoriaContrato,
    reloadKeyFormaPagamento,
    onChange,
    onDropdownChange,
    onNumberChange,
    onCompanyChange,
    onServiceChange,
    onCategoriaContratoChange,
    onFormaPagamentoChange,
    onPessoaChange,
    onAddEmpresa,
    onAddServico,
    onAddCategoriaContrato,
    onAddFormaPagamento,
    onAddPessoa,
    onValidateDescricao
}: ContratoFieldsProps) {
    return (
        <div className="scrollable-container">
            <div className="custom-flex-row">
                <div className="w-full">
                    <div className="grid formgrid">
                        <div className="col-12 lg:col-9">
                            <Input
                                id="descricao"
                                value={contrato.descricao || ''}
                                onChange={onChange}
                                hasError={!!errors.descricao}
                                errorMessage={errors.descricao}
                                label="Descrição do Contrato"
                                onBlur={onValidateDescricao}
                                autoFocus
                                topLabel="Descrição:"
                                showTopLabel
                                required
                            />
                        </div>
                        <div className="col-12 lg:col-3">
                            <CustomInputNumber
                                id="valor_servico"
                                value={contrato.valor_servico || 0}
                                onChange={onNumberChange}
                                label="Valor Serviços"
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
                            <Dropdown
                                id="periodicidade"
                                value={contrato.periodicidade ?? ''}
                                options={OptionsPeriodicidade}
                                onChange={onDropdownChange}
                                label="Selecione a Periodicidade"
                                hasError={!!errors.periodicidade}
                                errorMessage={errors.periodicidade}
                                topLabel="Periodicidade:"
                                showTopLabel
                                required
                            />
                        </div>
                        <div className="col-12 lg:col-4">
                            <EmpresaDropdownField
                                selectedEmpresa={selectedCompany}
                                selectedEmpresaId={contrato.id_empresa ?? null}
                                onEmpresaChange={onCompanyChange}
                                reloadKey={reloadKeyEmpresa}
                                hasError={!!errors.selectedCompany}
                                errorMessage={errors.selectedCompany}
                                showAddButton
                                onAddClick={onAddEmpresa}
                                autoSelectSingle
                                required
                            />
                        </div>
                        <div className="col-12 lg:col-4">
                            <ServicoDropdownField
                                selectedService={selectedService}
                                selectedServiceId={contrato.id_servico ?? null}
                                onServiceChange={onServiceChange}
                                reloadKey={reloadKeyServico}
                                hasError={!!errors.selectedService}
                                errorMessage={errors.selectedService}
                                showAddButton
                                onAddClick={onAddServico}
                                autoSelectSingle
                                required
                            />
                        </div>
                        <div className="col-12 lg:col-4">
                            <CategoriaContratoDropdownField
                                selectedCategoriaContrato={selectedCategoriaContrato}
                                selectedCategoriaContratoId={contrato.id_categoria_contrato ?? null}
                                onCategoriaContratoChange={onCategoriaContratoChange}
                                reloadKey={reloadKeyCategoriaContrato}
                                hasError={!!errors.selectedCategoriaContrato}
                                errorMessage={errors.selectedCategoriaContrato}
                                showAddButton
                                onAddClick={onAddCategoriaContrato}
                                autoSelectSingle
                                required
                            />
                        </div>
                        <div className="col-12 lg:col-4">
                            <FormaPagamentoDropdownField
                                selectedFormaPagamento={selectedFormaPagamento}
                                selectedFormaPagamentoId={contrato.id_forma_pagamento ?? null}
                                onFormaPagamentoChange={onFormaPagamentoChange}
                                reloadKey={reloadKeyFormaPagamento}
                                hasError={!!errors.selectedFormadePagamento}
                                errorMessage={errors.selectedFormadePagamento}
                                showAddButton
                                onAddClick={onAddFormaPagamento}
                                autoSelectSingle={false}
                                required
                            />
                        </div>
                        <div className="col-12 lg:col-4">
                            <PessoaDropdownField
                                hasError={!!errors.selectedPessoa}
                                errorMessage={errors.selectedPessoa}
                                selectedPessoa={selectedPessoa}
                                selectedPessoaId={contrato.id_clientes_contrato?.[0] ?? null}
                                onPessoaChange={onPessoaChange}
                                reloadKey={reloadKeyPessoa}
                                autoSelectSingle
                                showAddButton
                                onAddClick={onAddPessoa}
                                required
                            />
                        </div>
                    </div>
                    <div className="grid formgrid contrato-switch-group">
                        <div className="col-12 md:col-2">
                            <div className="switchRow">
                                <InputSwitch
                                    inputId="emitir_boleto"
                                    checked={contrato.emitir_boleto ?? false}
                                    onChange={(event) => {
                                        onChange({
                                            target: {
                                                id: 'emitir_boleto',
                                                value: event.value,
                                                type: 'input'
                                            }
                                        });
                                    }}
                                />
                                <label htmlFor="emitir_boleto">Enviar Boleto</label>
                            </div>
                        </div>
                        <div className="col-12 md:col-2">
                            <div className="switchRow">
                                <InputSwitch
                                    inputId="enviar_email"
                                    checked={contrato.enviar_email ?? false}
                                    onChange={(event) => {
                                        onChange({
                                            target: {
                                                id: 'enviar_email',
                                                value: event.value,
                                                type: 'input'
                                            }
                                        });
                                    }}
                                />
                                <label htmlFor="enviar_email">Enviar E-mail</label>
                            </div>
                        </div>
                        <div className="col-12 md:col-2">
                            <div className="switchRow">
                                <InputSwitch
                                    inputId="enviar_whatsapp"
                                    checked={contrato.enviar_whatsapp ?? false}
                                    onChange={(event) => {
                                        onChange({
                                            target: {
                                                id: 'enviar_whatsapp',
                                                value: event.value,
                                                type: 'input'
                                            }
                                        });
                                    }}
                                />
                                <label htmlFor="enviar_whatsapp">Enviar WhatsApp</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
