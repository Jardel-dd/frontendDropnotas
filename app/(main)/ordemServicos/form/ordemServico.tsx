'use client';
import { InputSwitch } from 'primereact/inputswitch';
import { IconNumero } from '@/app/utils/icons/icons';
import Input from '@/app/shared/include/input/input-all';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { OrdemServicoFieldsProps } from '../types/ordemServico';
import { DatePicker } from '@/app/components/calendarComponent/datePicker';
import InputTextarea from '@/app/shared/include/inputTextArea/InputTextarea';
import PessoaDropdownField from '@/app/(main)/cadastro/pessoas/dropDown/pessoa';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import ServicoDropdownField from '@/app/(main)/cadastro/servicos/dropdown/servico';
import EmpresaDropdownField from '@/app/(main)/configuracoes/empresas/dropDown/empresa';
import FormaPagamentoDropdownField from '@/app/(main)/cadastro/formaPagamento/dropDown/formaPagamento';
import { fetchFilteredService, listTheService } from '@/app/(main)/cadastro/servicos/controller/controller';
import { fetchAllVendedores, fetchFilteredVendedor } from '@/app/(main)/cadastro/vendedores/controller/controller';
export type { FormCreatedOrdemServicoProps, OrdemServicoFieldsProps, OrdemServicoFormProps, OrdemServicoFormRef } from '../types/ordemServico';

export function OrdemServicoFields({

    emitirOS,
    errors,
    reloadKeyPessoa,
    reloadKeyEmpresa,
    reloadKeyServico,
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
    onAddPessoa,
    onAddVendedor,
    onAddFormaPagamento,
    onAddServico,
    onValidateDescricao
}: OrdemServicoFieldsProps) {
    return (
        <>
            <div className="grid formgrid">
                <div className="col-12 lg:col-3">
                    <Input value={emitirOS.numero || ''} 
                    onChange={onChange} label="Número"
                     id="numero" disabled iconLeft={<IconNumero isDarkMode={false} />}
                      showTopLabel required topLabel="Número:" />
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
                <div className="col-12 lg:col-4 ">
                    <EmpresaDropdownField
                        selectedCompany={selectedEmpresa}
                        onCompanyChange={onEmpresaChange}
                        reloadKey={reloadKeyEmpresa}
                        hasError={!!errors.selectedEmpresa}
                        errorMessage={errors.selectedEmpresa}
                        showAddButton
                        onAddClick={onAddEmpresa}
                        autoSelectSingle
                    />
                </div>
                <div className="col-12 lg:col-4 ">
                    <PessoaDropdownField
                        id="selectedCliente"
                        selectedPessoa={selectedCliente}
                        onPessoaChange={onPessoaChange}
                        reloadKey={reloadKeyPessoa}
                        hasError={!!errors.selectedCliente}
                        errorMessage={errors.selectedCliente}
                        placeholder="Selecione o Cliente"
                        autoSelectSingle
                        showAddButton
                        onAddClick={onAddPessoa}
                        topLabel="Cliente ou Fornecedor:"
                    />
                </div>
                <div className="col-12 lg:col-4 ">
                    <DropdownSearch<VendedorEntity>
                        id="selectedVendedor"
                        selectedItem={selectedVendedor}
                        onItemChange={onVendedorChange}
                        fetchAllItems={fetchAllVendedores}
                        fetchFilteredItems={fetchFilteredVendedor}
                        optionLabel="razao_social"
                        placeholder="Selecione o Vendedor"
                        hasError={!!errors.selectedVendedor}
                        errorMessage={errors.selectedVendedor}
                        autoSelectSingle={false}
                        showAddButton
                        onAddClick={onAddVendedor}
                        showTopLabel
                        required
                        topLabel="Vendedor:"
                    />
                </div>
                <div className="col-12 lg:col-4 ">
                    <FormaPagamentoDropdownField
                        selectedFormaPagamento={selectedFormaPagamento}
                        onFormaPagamentoChange={onFormaPagamentoChange}
                        reloadKey={reloadKeyFormaPagamento}
                        hasError={!!errors.selectedFormaPagamento}
                        errorMessage={errors.selectedFormaPagamento}
                        showAddButton
                        onAddClick={onAddFormaPagamento}
                    />
                </div>
                <div className="col-12 lg:col-4 ">
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
                        showTopLabel
                        required
                        topLabel="Serviço:"
                    />
                </div>
                <div className="col-12 lg:col-2">
                    <Input
                        min={1}
                        value={emitirOS.servicos.quantidade || ''}
                        onChange={onChange}
                        label="Ex: 3 servicos iguais"
                        id="servicos.quantidade"
                        type="number"
                        showTopLabel
                        topLabel="Quantidade de servicos:"
                        hasError={!!errors['servicos.quantidade']}
                        errorMessage={errors['servicos.quantidade']}
                    />
                </div>
            </div>
            <div className="grid formgrid w-full">
                <div className="col-12 lg:col-4 ">
                    <DatePicker value={emitirOS.data_hora_inicio ?? null}
                     onChange={(date) => onDateChange('data_hora_inicio', date)} showTopLabel topLabel="Data inicio" />
                </div>
                <div className="col-12 lg:col-4 ">
                    <DatePicker
                        value={emitirOS.data_hora_prevista ?? null}
                        onChange={(date) => onDateChange('data_hora_prevista', date)}
                        showTopLabel
                        topLabel="Data prevista"
                    />
                </div>
                <div className="col-12 lg:col-4 ">
                    <DatePicker
                        value={emitirOS.data_hora_conclusao ?? null}
                        onChange={(date) => onDateChange('data_hora_conclusao', date)}
                        showTopLabel
                        topLabel="Data conclusão"
                    />
                </div>
            </div>
            <div className="grid formgrid w-full">
                <div className="col-12 lg:col-12 ">
                    <InputTextarea
                        value={emitirOS.consideracoes_finais || ''}
                        onChange={onChange}
                        rows={5}
                        cols={30}
                        label=""
                        id="consideracoes_finais"
                        showTopLabel
                        topLabel="Considerações finais:"
                    />
                </div>
                <div className="col-12 lg:col-12 ">
                    <InputTextarea value={emitirOS.observacao_interna || ''} onChange={onChange} rows={5} cols={30} label="" id="observacao_interna" showTopLabel topLabel="Observações internas:" />
                </div>
                <div className="col-12 lg:col-12 ">
                    <InputTextarea value={emitirOS.observacao_servico || ''} onChange={onChange} rows={5} cols={30} label="" id="observacao_servico" showTopLabel topLabel="Observações do Serviço:" />
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

