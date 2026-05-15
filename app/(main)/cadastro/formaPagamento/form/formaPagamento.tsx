'use client';
import '@/app/styles/styledGlobal.css';
import { InputSwitch } from 'primereact/inputswitch';
import Input from '@/app/shared/include/input/input-all';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { FormaPagamentoFieldsProps} from '../types/formaPagamento';
import InputTextarea from '@/app/shared/include/inputTextArea/InputTextarea';
import { tipo_forma_pagamento, valor_taxa } from '@/app/shared/optionsDropDown/options';

export function FormaPagamentoFields({ formaPagamento, errors, onChange, onDropdownChange, onValidateDescricao }: FormaPagamentoFieldsProps) {
    return (
        <>
            <div className="grid formgrid">
                <div className="col-12 lg:col-12">
                    <Input
                        value={formaPagamento.descricao || ''}
                        onChange={onChange}
                        label="Descrição"
                        id="descricao"
                        hasError={!!errors.descricao}
                        errorMessage={errors.descricao}
                        onBlur={onValidateDescricao}
                        autoFocus
                        topLabel="Descrição:"
                        showTopLabel
                        required
                    />
                </div>
                <div className="col-12 lg:col-3 ">
                    <Dropdown
                        id="tipo_forma_pagamento"
                        value={formaPagamento.tipo_forma_pagamento ?? ''}
                        options={tipo_forma_pagamento}
                        onChange={onDropdownChange}
                        label="Selecione a forma de pagamento"
                        hasError={!!errors.tipo_forma_pagamento}
                        errorMessage={errors.tipo_forma_pagamento}
                        topLabel="Forma de pagamento:"
                        showTopLabel
                        required
                    />
                </div>
                <div className="col-12 lg:col-3 ">
                    <Dropdown
                        id="tipo_taxa"
                        value={formaPagamento.tipo_taxa ?? ''}
                        options={valor_taxa}
                        onChange={onDropdownChange}
                        label="Tipo da Taxa"
                        hasError={!!errors.tipo_taxa}
                        errorMessage={errors.tipo_taxa}
                        topLabel="Tipo da Taxa:"
                        showTopLabel
                        required
                    />
                </div>
                <div className="col-12 lg:col-3 ">
                    <Input
                        value={String(formaPagamento.valor_taxa ?? '')}
                        onChange={onChange}
                        label="Valor da Taxa"
                        id="valor_taxa"
                        type="number"
                        hasError={!!errors.valor_taxa}
                        errorMessage={errors.valor_taxa}
                        topLabel="Valor da Taxa:"
                        showTopLabel
                        required
                    />
                </div>
                <div className="col-12 lg:col-12 ">
                    <InputTextarea 
                    value={formaPagamento.observacao || ''} 
                    onChange={onChange} rows={5} 
                    cols={30} label="" 
                    id="observacao" 
                    topLabel="Considerações finais:" 
                    showTopLabel />
                </div>
            </div>
            <div className="switchRow">
                <InputSwitch
                    inputId="aplicar_taxa_servico"
                    checked={formaPagamento.aplicar_taxa_servico ?? false}
                    onChange={(event) =>
                        onChange({
                            target: {
                                id: 'aplicar_taxa_servico',
                                value: event.value,
                                checked: event.value,
                                type: 'switch'
                            }
                        })
                    }
                />
                <label htmlFor="aplicar_taxa_servico" >
                    Aplicar Taxa Serviço
                </label>
            </div>
        </>
    );
}

