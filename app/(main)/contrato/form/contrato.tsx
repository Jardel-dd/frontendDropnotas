'use client';
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import api from '@/app/services/api';
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { IconReal } from '@/app/utils/icons/icons';
import { InputSwitch } from 'primereact/inputswitch';
import Input from '@/app/shared/include/input/input-all';
import type { ContratoFieldsProps, } from '../types/contratos';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import CustomInputNumber from '@/app/shared/include/inputReal/inputReal';
import MobileSearchPicker from '@/app/shared/mobile/MobileSearchPicker';
import { OptionsPeriodicidade } from '@/app/shared/optionsDropDown/options';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { fetchFilteredPessoas, listThePessoas } from '@/app/(main)/cadastro/pessoas/controller/controller';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { CategoryContratosEntity } from '@/app/entity/CategoryContratEntity';
import ServicoDropdownField from '@/app/(main)/cadastro/servicos/dropdown/servico';
import EmpresaDropdownField from '@/app/(main)/configuracoes/empresas/dropDown/empresa';
import FormaPagamentoDropdownField from '@/app/(main)/cadastro/formaPagamento/dropDown/formaPagamento';
import CategoriaContratoDropdownField from '@/app/(main)/cadastro/categoriaContratos/dropDown/categoriaContratos';
import CustomMultiSelect from '@/app/shared/include/multSelect/Input';
import { FormaPagamentoEntity } from '@/app/entity/FormaPagamento';
import { fetchFilteredFormaPagamento, fetchFormaPagamentoMobilePage, listTheFormaPagamento } from '../../cadastro/formaPagamento/controller/controller';
import { fetchFilteredCompany, listTheCompany } from '../../configuracoes/empresas/controller/controller';
import { fetchFilteredService, fetchServiceMobilePage, listTheService } from '../../cadastro/servicos/controller/controller';
import { fetchFilteredCategoriaContrato, listTheCategoriaContrato } from '../../cadastro/categoriaContratos/controller/controller';
export type { ContratoFieldsProps, ContratoFormProps, ContratoFormRef, FormContratoCreatedProps } from '../types/contratos';

const PESSOA_CONTRATO_MULTISELECT_CACHE_TIME_MS = 5 * 60 * 1000;
const buildMobilePickerPageResult = <T,>(data: any) => {
    const items = Array.isArray(data?.content) ? (data.content as T[]) : Array.isArray(data) ? (data as T[]) : [];
    const currentPage = Number(data?.number ?? data?.pageable?.pageNumber ?? 0);
    const totalPages = Number(data?.totalPages ?? 0);
    const hasMoreFromLastFlag = typeof data?.last === 'boolean' ? !data.last : null;
    const hasMoreFromTotalPages = totalPages > currentPage + 1;

    return {
        items,
        hasMore: hasMoreFromLastFlag ?? hasMoreFromTotalPages
    };
};

export function ContratoFields({
    contrato,
    errors,
    selectedPessoa,
    pessoaOptions,
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
    onEditEmpresa,
    onAddServico,
    onEditServico,
    onAddCategoriaContrato,
    onEditCategoriaContrato,
    onAddFormaPagamento,
    onEditFormaPagamento,
    onAddPessoa,
    onEditPessoa,
    onValidateDescricao
}: ContratoFieldsProps) {
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const queryClient = useQueryClient();
    const fetchAllPessoasWithCache = useCallback(
        () =>
            queryClient.fetchQuery({
                queryKey: ['multiselect', 'contrato', 'pessoas', 'all', reloadKeyPessoa],
                queryFn: listThePessoas,
                staleTime: PESSOA_CONTRATO_MULTISELECT_CACHE_TIME_MS,
                gcTime: PESSOA_CONTRATO_MULTISELECT_CACHE_TIME_MS
            }),
        [queryClient, reloadKeyPessoa]
    );
    const fetchCompanyMobilePage = useCallback(async ({ searchTerm: termo, page, size }: { searchTerm: string; page: number; size: number }) => {
        const response = await api.get('/empresa', {
            params: {
                page,
                size,
                termo: termo || undefined
            }
        });

        return buildMobilePickerPageResult<CompanyEntity>(response.data);
    }, []);
    const fetchCategoriaContratoMobilePage = useCallback(async ({ searchTerm: termo, page, size }: { searchTerm: string; page: number; size: number }) => {
        const response = await api.get('/categoria-contrato', {
            params: {
                page,
                size,
                termo: termo || undefined
            }
        });

        return buildMobilePickerPageResult<CategoryContratosEntity>(response.data);
    }, []);
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
                        {isDesktop && (
                            <>
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
                                        onEditClick={onEditEmpresa}
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
                                        onEditClick={onEditServico}
                                        autoSelectSingle
                                        useCachedAllItems
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
                                        onEditClick={onEditCategoriaContrato}
                                        autoSelectSingle
                                        useCachedAllItems
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
                                        onEditClick={onEditFormaPagamento}
                                        autoSelectSingle={false}
                                        useCachedAllItems
                                        required
                                    />
                                </div>
                            </>
                        )}
                        {isMobile && (
                            <>
                                <div className="col-12 lg:col-4">
                                    <MobileSearchPicker<CompanyEntity>
                                        selectedItem={selectedCompany}
                                        onItemChange={onCompanyChange}
                                        fetchAllItems={listTheCompany}
                                        fetchFilteredItems={fetchFilteredCompany}
                                        fetchItemsPage={fetchCompanyMobilePage}
                                        optionLabel="razao_social"
                                        optionValue="id"
                                        topLabel="Empresa:"
                                        loadMoreRows={20}
                                        placeholder="Selecione a Empresa"
                                        dialogTitle="Selecionar a Empresa"
                                        hasError={!!errors.selectedCompany}
                                        errorMessage={errors.selectedCompany}
                                        onAddClick={onAddEmpresa}
                                        onEditClick={onEditEmpresa}
                                        autoLoadAndSelectSingle
                                    />
                                </div>
                                <div className="col-12 lg:col-4">
                                    <MobileSearchPicker<ServiceEntity>
                                        selectedItem={selectedService}
                                        onItemChange={onServiceChange}
                                        fetchAllItems={listTheService}
                                        fetchFilteredItems={fetchFilteredService}
                                        fetchItemsPage={fetchServiceMobilePage}
                                        optionLabel="descricao"
                                        optionValue="id"
                                        topLabel="Serviço:"
                                        loadMoreRows={20}
                                        placeholder="Selecione o Serviço"
                                        dialogTitle="Selecionar o Serviço"
                                        hasError={!!errors.selectedService}
                                        errorMessage={errors.selectedService}
                                        onAddClick={onAddServico}
                                        onEditClick={onEditServico}
                                        autoLoadAndSelectSingle
                                    />
                                </div>

                                <div className="col-12 lg:col-4">
                                    <MobileSearchPicker<CategoryContratosEntity>
                                        selectedItem={selectedCategoriaContrato}
                                        onItemChange={onCategoriaContratoChange}
                                        fetchAllItems={listTheCategoriaContrato}
                                        fetchFilteredItems={fetchFilteredCategoriaContrato}
                                        fetchItemsPage={fetchCategoriaContratoMobilePage}
                                        optionLabel="descricao"
                                        optionValue="id"
                                        topLabel="Categoria de Contrato:"
                                        loadMoreRows={20}
                                        placeholder="Selecione a Categoria de Contrato"
                                        dialogTitle="Selecionar a Categoria de Contrato"
                                        hasError={!!errors.selectedCategoriaContrato}
                                        errorMessage={errors.selectedCategoriaContrato}
                                        onAddClick={onAddCategoriaContrato}
                                        onEditClick={onEditCategoriaContrato}
                                        autoLoadAndSelectSingle
                                    />
                                </div>
                                <div className="col-12 lg:col-4">
                                    <MobileSearchPicker<FormaPagamentoEntity>
                                        selectedItem={selectedFormaPagamento}
                                        onItemChange={onFormaPagamentoChange}
                                        fetchAllItems={listTheFormaPagamento}
                                        fetchFilteredItems={fetchFilteredFormaPagamento}
                                        fetchItemsPage={fetchFormaPagamentoMobilePage}
                                        optionLabel="descricao"
                                        optionValue="id"
                                        topLabel="Forma de Pagamento:"
                                        loadMoreRows={20}
                                        placeholder="Selecione a Forma de Pagamento"
                                        dialogTitle="Selecionar a Forma de Pagamento"
                                        hasError={!!errors.selectedFormadePagamento}
                                        errorMessage={errors.selectedFormadePagamento}
                                        onAddClick={onAddFormaPagamento}
                                        onEditClick={onEditFormaPagamento}
                                        autoLoadAndSelectSingle
                                    />

                                </div>
                            </>
                        )}
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
                            <CustomMultiSelect
                                hasError={!!errors.selectedPessoa}
                                errorMessage={errors.selectedPessoa}
                                selectedItems={selectedPessoa}
                                onChange={(event) => onPessoaChange(event.value ?? [])}
                                id="selectedPessoa"
                                options={pessoaOptions}
                                optionLabel="razao_social"
                                dataKey="id"
                                fetchAllItems={fetchAllPessoasWithCache}
                                fetchFilteredItems={fetchFilteredPessoas}
                                reloadAllOnShow
                                initialSelectedValues={contrato.id_clientes_contrato ?? []}
                                showAddButton
                                onAddClick={onAddPessoa}
                                onEditClick={onEditPessoa}
                                placeholder="Selecione Cliente ou Fornecedor"
                                topLabel="Cliente ou Fornecedor:"
                                showTopLabel
                                required
                                showChips={false} />
                        </div>
                    </div>
                    <div className="grid formgrid contrato-switch-group w-full">
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
