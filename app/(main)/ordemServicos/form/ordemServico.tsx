'use client';
import { InputSwitch } from 'primereact/inputswitch';
import { IconNumero } from '@/app/utils/icons/icons';
import Input from '@/app/shared/include/input/input-all';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { OrdemServicoFieldsProps } from '../types/ordemServico';
import { FormaPagamentoEntity } from '@/app/entity/FormaPagamento';
import MobileSearchPicker from '@/app/shared/mobile/MobileSearchPicker';
import { DatePicker } from '@/app/components/calendarComponent/datePicker';
import InputTextarea from '@/app/shared/include/inputTextArea/InputTextarea';
import PessoaDropdownField from '@/app/(main)/cadastro/pessoas/dropDown/pessoa';
import ServicoDropdownField from '@/app/(main)/cadastro/servicos/dropdown/servico';
import EmpresaDropdownField from '@/app/(main)/configuracoes/empresas/dropDown/empresa';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import VendedorDropdownField from '@/app/(main)/cadastro/vendedores/dropDown/DropdownVendedor';
import FormaPagamentoDropdownField from '@/app/(main)/cadastro/formaPagamento/dropDown/formaPagamento';
import { fetchFilteredPessoa, fetchPessoaMobilePage, listThePessoas } from '@/app/(main)/cadastro/pessoas/controller/controller';
import { fetchFilteredService, fetchServiceMobilePage, listTheService } from '@/app/(main)/cadastro/servicos/controller/controller';
import { fetchFilteredVendedor, fetchVendedorMobilePage, listTheVendedor } from '@/app/(main)/cadastro/vendedores/controller/controller';
import {  fetchCompanyMobilePage, fetchFilteredEmpresa, listTheEmpresa } from '@/app/(main)/configuracoes/empresas/controller/controller';
export type { FormCreatedOrdemServicoProps, OrdemServicoFieldsProps, OrdemServicoFormProps, OrdemServicoFormRef } from '../types/ordemServico';
import { fetchFilteredFormaPagamento,  fetchFormaPagamentoMobilePage,  listTheFormaPagamento } from '@/app/(main)/cadastro/formaPagamento/controller/controller';

export function OrdemServicoFields({
    emitirOS,
    errors,
    reloadKeyPessoa,
    reloadKeyEmpresa,
    reloadKeyServico,
    reloadKeyVendedor,
    reloadKeyFormaPagamento,
    selectedCliente,
    selectedEmpresa,
    selectedServico,
    selectedVendedor,
    selectedFormaPagamento,
    onChange,
    onDateChange,
    onEmpresaChange,
    onPessoaChange,
    onVendedorChange,
    onFormaPagamentoChange,
    onServicoChange,
    onAddEmpresa,
    onEditEmpresa,
    onAddPessoa,
    onEditPessoa,
    onAddVendedor,
    onEditVendedor,
    onAddFormaPagamento,
    onEditFormaPagamento,
    onAddServico,
    onEditServico,
    onValidateDescricao
}: OrdemServicoFieldsProps) {
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    return (
        <>
            <div className="grid formgrid">
                <div className="col-12 lg:col-3">
                    <Input
                        value={emitirOS.numero || ''}
                        onChange={onChange}
                        label="Número"
                        id="numero"
                        disabled
                        iconLeft={<IconNumero isDarkMode={false} />}
                        showTopLabel
                        required
                        topLabel="Número:"
                    />
                </div>
                <div className="col-12 lg:col-12 ">
                    <Input
                        value={emitirOS.descricao || ''}
                        onChange={onChange}
                        label="Descrição"
                        id="descricao"
                        hasError={!!errors.descricao}
                        errorMessage={errors.descricao}
                        showTopLabel
                        required
                        topLabel="Descrição:"
                        autoFocus
                        onBlur={onValidateDescricao}
                    />
                </div>
                {isDesktop && (
                    <>
                        <div className="col-12 lg:col-4">
                            <EmpresaDropdownField
                                selectedEmpresa={selectedEmpresa}
                                onEmpresaChange={onEmpresaChange}
                                reloadKey={reloadKeyEmpresa}
                                hasError={!!errors.selectedEmpresa}
                                errorMessage={errors.selectedEmpresa}
                                showAddButton
                                onAddClick={onAddEmpresa}
                                onEditClick={onEditEmpresa}
                                autoSelectSingle
                                required
                            />
                        </div>
                        <div className="col-12 lg:col-4">
                            <ServicoDropdownField
                                id="selectedService"
                                selectedService={selectedServico}
                                onServiceChange={onServicoChange}
                                reloadKey={reloadKeyServico}
                                fetchAllItems={listTheService}
                                fetchFilteredItems={fetchFilteredService}
                                placeholder="Selecione o Serviço"
                                hasError={!!errors.selectedService}
                                errorMessage={errors.selectedService}
                                autoSelectSingle
                                showAddButton
                                onAddClick={onAddServico}
                                onEditClick={onEditServico}
                                showTopLabel
                                required
                                topLabel="Serviço:"
                            />
                        </div>
                        <div className="col-12 lg:col-4">
                            <PessoaDropdownField
                                id="selectedCliente"
                                selectedPessoa={selectedCliente}
                                onPessoaChange={onPessoaChange}
                                reloadKey={reloadKeyPessoa}
                                hasError={!!errors.selectedCliente}
                                errorMessage={errors.selectedCliente}
                                placeholder="Selecione o Cliente ou Fornecedor"
                                autoSelectSingle
                                showAddButton
                                onAddClick={onAddPessoa}
                                onEditClick={onEditPessoa}
                                required
                                topLabel="Cliente ou Fornecedor:"
                            />
                        </div>
                        <div className="col-12 lg:col-4">
                            <FormaPagamentoDropdownField
                                selectedFormaPagamento={selectedFormaPagamento}
                                onFormaPagamentoChange={onFormaPagamentoChange}
                                reloadKey={reloadKeyFormaPagamento}
                                hasError={!!errors.selectedFormaPagamento}
                                errorMessage={errors.selectedFormaPagamento}
                                showAddButton
                                onAddClick={onAddFormaPagamento}
                                onEditClick={onEditFormaPagamento}
                            />
                        </div>
                        <div className="col-12 lg:col-4">
                            <VendedorDropdownField
                                selectedVendedor={selectedVendedor}
                                reloadKey={reloadKeyVendedor}
                                onVendedorChange={onVendedorChange}
                                onAddClick={onAddVendedor}
                                onEditClick={onEditVendedor}
                                hasError={!!errors.selectedVendedor}
                                errorMessage={errors.selectedVendedor}
                                required
                            />
                        </div>
                    </>
                )}
                {isMobile && (
                    <>
                        <div className="col-12 lg:col-4">
                            <MobileSearchPicker<CompanyEntity>
                                selectedItem={selectedEmpresa}
                                onItemChange={onEmpresaChange}
                                fetchAllItems={listTheEmpresa}
                                fetchFilteredItems={fetchFilteredEmpresa}
                                fetchItemsPage={fetchCompanyMobilePage}
                                optionLabel="razao_social"
                                optionValue="id"
                                topLabel="Empresa:"
                                loadMoreRows={20}
                                placeholder="Selecione a Empresa"
                                dialogTitle="Selecionar a Empresa"
                                hasError={!!errors.selectedEmpresa}
                                errorMessage={errors.selectedEmpresa}
                                onAddClick={onAddEmpresa}
                                onEditClick={onEditEmpresa}
                                autoLoadAndSelectSingle
                            />
                        </div>
                        <div className="col-12 lg:col-4">
                            <MobileSearchPicker<ServiceEntity>
                                selectedItem={selectedServico}
                                onItemChange={onServicoChange}
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
                            <MobileSearchPicker<PessoaEntity>
                                selectedItem={selectedCliente}
                                onItemChange={onPessoaChange}
                                fetchAllItems={listThePessoas}
                                fetchFilteredItems={fetchFilteredPessoa}
                                fetchItemsPage={fetchPessoaMobilePage}
                                optionLabel="razao_social"
                                optionValue="id"
                                topLabel="Cliente ou Fornecedor:"
                                loadMoreRows={20}
                                placeholder="Selecione o Cliente ou Fornecedor"
                                dialogTitle="Selecionar Cliente ou Fornecedor"
                                hasError={!!errors.selectedCliente}
                                errorMessage={errors.selectedCliente}
                                onAddClick={onAddPessoa}
                                onEditClick={onEditPessoa}
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
                                hasError={!!errors.selectedFormaPagamento}
                                errorMessage={errors.selectedFormaPagamento}
                                onAddClick={onAddFormaPagamento}
                                onEditClick={onEditFormaPagamento}
                                autoLoadAndSelectSingle
                            />
                        </div>
                        <div className="col-12 lg:col-4">
                            <MobileSearchPicker<VendedorEntity>
                                selectedItem={selectedVendedor}
                                onItemChange={onVendedorChange}
                                fetchAllItems={listTheVendedor}
                                fetchFilteredItems={fetchFilteredVendedor}
                                fetchItemsPage={fetchVendedorMobilePage}
                                optionLabel="razao_social"
                                optionValue="id"
                                topLabel="Vendedor:"
                                loadMoreRows={20}
                                placeholder="Selecione o Vendedor"
                                dialogTitle="Selecionar o Vendedor"
                                hasError={!!errors.selectedVendedor}
                                errorMessage={errors.selectedVendedor}
                                onAddClick={onAddVendedor}
                                onEditClick={onEditVendedor}
                                autoLoadAndSelectSingle
                            />
                        </div>
                    </>
                )}
                <div className="col-12 lg:col-2">
                    <Input
                        min={1}
                        value={emitirOS.servicos.quantidade || ''}
                        onChange={onChange}
                        label="Ex: 3 servicos iguais"
                        id="servicos.quantidade"
                        type="number"
                        showTopLabel
                        topLabel="Quantidade de serviÃ§os:"
                        hasError={!!errors['servicos.quantidade']}
                        errorMessage={errors['servicos.quantidade']}
                    />
                </div>
            </div>
            <div className="grid formgrid w-full">
                <div className="col-12 lg:col-4 ">
                    <DatePicker value={emitirOS.data_hora_inicio ?? null} onChange={(date) => onDateChange('data_hora_inicio', date)} showTopLabel topLabel="Data inicio" />
                </div>
                <div className="col-12 lg:col-4 ">
                    <DatePicker value={emitirOS.data_hora_prevista ?? null} onChange={(date) => onDateChange('data_hora_prevista', date)} showTopLabel topLabel="Data prevista" />
                </div>
                <div className="col-12 lg:col-4 ">
                    <DatePicker value={emitirOS.data_hora_conclusao ?? null} onChange={(date) => onDateChange('data_hora_conclusao', date)} showTopLabel topLabel="Data conclusÃ£o" />
                </div>
            </div>
            <div className="grid formgrid w-full">
                <div className="col-12 lg:col-12 ">
                    <InputTextarea value={emitirOS.consideracoes_finais || ''} onChange={onChange} rows={5} cols={30} label="" id="consideracoes_finais" showTopLabel topLabel="ConsideraÃ§Ãµes finais:" />
                </div>
                <div className="col-12 lg:col-12 ">
                    <InputTextarea value={emitirOS.observacao_interna || ''} onChange={onChange} rows={5} cols={30} label="" id="observacao_interna" showTopLabel topLabel="ObservaÃ§Ãµes internas:" />
                </div>
                <div className="col-12 lg:col-12 ">
                    <InputTextarea value={emitirOS.observacao_servico || ''} onChange={onChange} rows={5} cols={30} label="" id="observacao_servico" showTopLabel topLabel="ObservaÃ§Ãµes do ServiÃ§o:" />
                </div>
                <div className="col-12 lg:col-12 ">
                    <div className="switchRow">
                        <InputSwitch
                            inputId="orcar"
                            checked={emitirOS.orcar ?? false}
                            onChange={(event) =>
                                onChange({
                                    target: {
                                        id: 'orcar',
                                        value: event.value,
                                        checked: event.value,
                                        type: 'switch'
                                    }
                                })
                            }
                        />
                        <label htmlFor="orcar" className="switchLabel">
                            Orcar
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
}
