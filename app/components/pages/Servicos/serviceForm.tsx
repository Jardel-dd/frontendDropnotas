'use client';
import './style.css';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import Input from '@/app/shared/include/input/input-all';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { TableCNAEEntity } from '@/app/entity/TableCNAEEntity';
import { forwardRef, RefObject, useEffect, useState } from 'react';
import { IconPorcentagem, IconReal } from '@/app/utils/icons/icons';
import { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import CNAEDropdownField from '../../fetchAll/listAllCnae/cnaeFiscal';
import CustomInputNumber from '@/app/shared/include/inputReal/inputReal';
import InputTextarea from '@/app/shared/include/inputTextArea/InputTextarea';
import { fetchServicesByID } from '../../fetchAll/listAllService/controller';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { searchServiceTable } from '../../fetchAll/listAllTableService/controller';
import BTNPGCreatedAll from '../../buttonsComponent/btnCreatedAll/btn-created-all';
import BTNPGCreatedDialog from '../../buttonsComponent/btnCreatedAll/btn-created-dialog';
import { validateFieldsServicos } from '@/app/(main)/cadastro/servicos/controller/validation';
import { createServico, updateServico } from '@/app/(main)/cadastro/servicos/controller/controller';
import { fetchAllCnae, fetchFilteredCnae, findCNAEByCodigo } from '../../fetchAll/listAllCnae/controller';
import { codigoIndicadorOperacao, codigoSituacaoTributariaRegular, exigibilidadeISSServico, issRetido, responsavelRetencao, situacaoTributaria } from '@/app/shared/optionsDropDown/options';
import { TableClassificacaoTributariaEntity } from '@/app/entity/TableClassificacaoTributariaEntity';
import ClassificacaoTributariaEDropdownField from '../../fetchAll/listAllClassficacaoTributaria/classificacaoTributaria';
import { fetchAllClassificacaoTributaria, fetchFilteredClassificacaoTributaria } from '../../fetchAll/listAllClassficacaoTributaria/controller';

export interface ServiceFormRef {
    handleSave: () => Promise<void>;
}
interface ServiceFormProps {
    servico: ServiceEntity;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onServicoChange?: (servico: ServiceEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setServico: React.Dispatch<React.SetStateAction<ServiceEntity>>;
    redirectAfterSave?: boolean;
    onClose?: () => void;
    onSaved?: (created: ServiceEntity) => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}
const ServicoForm = forwardRef<ServiceFormRef, ServiceFormProps>(({ initialId, msgs, onServicoChange, onErrorsChange, redirectAfterSave, onClose, onSaved, showBTNPGCreatedDialog, showBTNPGCreatedAll, onBackClick }: ServiceFormProps, ref) => {
    const router = useRouter();
    const servicoId = initialId;
    const [isLoading, setIsLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [servico, setServico] = useState<ServiceEntity>(
        new ServiceEntity({
            ativo: true,
            id: 0,
            descricao: '',
            descricao_completa: '',
            codigo: '',
            item_lista_servico: '',
            exigibilidade_iss: '',
            iss_retido: '',
            observacoes: '',
            codigo_municipio: '',
            numero_processo: '',
            responsavel_retencao: '',
            codigo_cnae: '',
            codigo_nbs: '',
            codigo_inter_contr: '',
            codigo_indicador_operacao: '',
            tipo_operacao: 0,
            finalidade_nfse: 0,
            indicador_finalidade: 0,
            indicador_destinatario: 0,
            codigo_situacao_tributaria: '',
            codigo_classificacao_tributaria: '',
            codigo_situacao_tributaria_regular: '',
            codigo_classificacao_tributaria_regular: '',
            codigo_credito_presumido: '',
            percentual_diferencial_uf: 0,
            percentual_diferencial_municipal: 0,
            percentual_diferencial_cbs: 0,
            valor_servico: null,
            valor_desconto: 0, 
            aliquota_deducoes:0
        })
    );
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
    const [selectedCNAE, setSelectedCNAE] = useState<TableCNAEEntity | null>(null);
    const [selectedClassificacaoTributaria, setSelectedClassificacaoTributaria] = useState<TableClassificacaoTributariaEntity | null>(null);
    const [selectedService, setSelectedService] = useState<ServiceEntity | null>(null);
    const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
    const [stateDisableBtnCreatedService, setStateDisableBtnCreatedService] = useState(false);
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
       if (isLoadingBtnCreated) return;
        setIsLoadingBtnCreated(true);
        console.log("servico",servico)
        try {
            if (isEditMode && servicoId) {
                await updateServico(servicoId, servico, setErrors, msgs, router, setServico, redirectAfterSave ?? true);
            } else {
                const created = await createServico(servico, setErrors, msgs, router, setServico, redirectAfterSave ?? true);

                onSaved?.(created);
            }

            onClose?.();
        } finally {
            setStateDisableBtnCreatedService(false);
        }
    };
    const handleAllChanges = (event: { target: { id: string; value: any; checked?: any; type: string } }) => {
        let value = event.target.value;
        if (event.target.type === 'checkbox' || event.target.type === 'switch') {
            value = event.target.checked;
        } else if (event.target.type === 'number') {
            value = value === '' ? null : Number(value);
        }
        const _servicos = servico!.copyWith({ [event.target.id]: value });
        setServico(_servicos);
    };
   
    const handleClassificacaoTributariaChange = (classificacaoTributaria: TableClassificacaoTributariaEntity | null) => {
        setSelectedClassificacaoTributaria(classificacaoTributaria);
        const updatedService = servico.copyWith({ codigo_classificacao_tributaria: classificacaoTributaria?.codigo || '' });
        setServico(updatedService);
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.codigo_classificacao_tributaria;
            return newErrors;
        });
    };
    const handleDropdownChange = (e: DropdownChangeEvent) => {
        const updatedService = servico.copyWith({ [e.target.id]: e.value });
        setServico(updatedService);
    };
    const handleNumberChange = (e: InputNumberValueChangeEvent) => {
        const _servicos = servico.copyWith({ [e.target.id]: e.value ?? 0 });
        setServico(_servicos);
        setTouchedFields((prev) => ({ ...prev, [e.target.id]: true }));
        validateFieldsServicos(_servicos, setErrors, msgs);
    };
    const handleServicoChange = (service: ServiceEntity | null) => {
        if (!service) {
            setSelectedService(null);
            return;
        }
        setSelectedService(service);
        setServico((prev) => {
            const updated = {
                ...prev,
                item_lista_servico: service.codigo || '',
                descricao: prev.descricao && prev.descricao.trim() !== '' ? prev.descricao : service.descricao || prev.descricao
            };
            return new ServiceEntity(updated);
        });

        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.item_lista_servico;
            return newErrors;
        });

        setTouchedFields((prev) => ({
            ...prev,
            item_lista_servico: true
        }));
    };
    const ListagemSevicosID = async (id: string) => {
        try {
            setIsLoading(true);
            const { servico } = await fetchServicesByID(id);
            const entidade = new ServiceEntity(servico);
            setServico(
                new ServiceEntity({
                    ...entidade,
                    item_lista_servico: entidade.item_lista_servico ? entidade.item_lista_servico.split(' - ')[0].trim() : ''
                })
            );
            const allCnaes = await fetchAllCnae();
            const selected = findCNAEByCodigo(entidade.codigo_cnae, allCnaes);
            setSelectedCNAE(selected ?? null);
            const allServices = await searchServiceTable();
            const itemCodigo = entidade.item_lista_servico?.split(' - ')[0];
            const matchedServico = allServices.find((option: ServiceEntity) => option.codigo === itemCodigo);
            setSelectedService(matchedServico ?? null);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (onServicoChange) {
            onServicoChange(servico);
        }
    }, [servico, onServicoChange]);
    useEffect(() => {
        if (onErrorsChange) {
            onErrorsChange(errors);
        }
    }, [errors, onErrorsChange]);
    useEffect(() => {
        if (initialId) {
            setIsEditMode(true);
            ListagemSevicosID(initialId).finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [initialId]);
    useEffect(() => {
        if (Object.values(touchedFields).some((touched) => touched)) {
            validateFieldsServicos(servico, setErrors, msgs);
        }
    }, [servico]);
    if (isLoading && initialId) {
        return <LoadingScreen loadingText={'Carregando informações do Serviço selecionado...'} />;
    }
    return (
        <>
            <Messages ref={msgs} className="custom-messages" />
            <div className="scrollable-container">
                <div className="custom-flex-col">
                    <div className="grid formgrid">
                        <div className="col-12 mt-1  lg:col-10 ">
                            <Input
                                value={servico.descricao || ''}
                                onChange={handleAllChanges}
                                label="Descrição completa do serviço"
                                id="descricao"
                                hasError={!!errors.descricao}
                                errorMessage={errors.descricao}
                                onBlur={() => {
                                    setTouchedFields((prev) => ({ ...prev, descricao: true }));
                                    validateFieldsServicos(servico, setErrors, msgs);
                                }}
                                autoFocus
                                topLabel=" Descrição:"
                                showTopLabel
                                required
                            />
                        </div>
                        <div className="col-12 mt-1  lg:col-2">
                            <CustomInputNumber
                                id="valor_servico"
                                value={servico.valor_servico || 0}
                                onChange={handleNumberChange}
                                label="Valor Serviços"
                                useRightButton={true}
                                outlined={true}
                                hasError={!!errors.valor_servico}
                                errorMessage={errors.valor_servico}
                                iconLeft={<IconReal isDarkMode={false} />}
                                topLabel="Valor Serviço:"
                                showTopLabel
                                required
                            />
                        </div>
                        <div className="col-12 mt-1 lg:col-4">
                        <CustomInputNumber
                                                        id="percentual_diferencial_municipal"
                                                        value={servico.percentual_diferencial_municipal || 0}
                                                        onChange={handleNumberChange}
                                                        label="Percentual diferencial UF"
                                                        useRightButton={true}
                                                        outlined={true}
                                                        hasError={!!errors.percentual_diferencial_municipal}
                                                        errorMessage={errors.percentual_diferencial_municipal}
                                                        topLabel="Diferencial UF:"
                                                        showTopLabel
                                                        required
                                                        iconLeft={<IconPorcentagem isDarkMode={false} />}
                                                    />
                        </div>
                        <div className="col-12 mt-1 lg:col-4">
                        <CustomInputNumber
                                                        id="aliquota_deducoes"
                                                        value={servico.aliquota_deducoes || 0}
                                                        onChange={handleNumberChange}
                                                        label="Aliquota Deduções"
                                                        useRightButton={true}
                                                        outlined={true}
                                                        hasError={!!errors.aliquota_deducoes}
                                                        errorMessage={errors.aliquota_deducoes}
                                                        topLabel="Aliquota Deduções:"
                                                        showTopLabel
                                                        required
                                                                                                                iconLeft={<IconPorcentagem isDarkMode={false} />}

                                                    />
                        </div>
                        <div className="col-12 mt-1 lg:col-4">
                        <CustomInputNumber
                                                        id="percentual_diferencial_cbs"
                                                        value={servico.percentual_diferencial_cbs || 0}
                                                        onChange={handleNumberChange}
                                                        label="Percentual diferencial CBS"
                                                        useRightButton={true}
                                                        outlined={true}
                                                        hasError={!!errors.percentual_diferencial_cbs}
                                                        errorMessage={errors.percentual_diferencial_cbs}
                                                        topLabel="Diferencial CBS:"
                                                        showTopLabel
                                                        required
                                                        iconLeft={<IconPorcentagem isDarkMode={false} />}
                                                    />
                        </div>
                        <div className="col-12 mt-1 lg:col-4">
                        <CustomInputNumber
                                                        id="percentual_diferencial_uf"
                                                        value={servico.percentual_diferencial_uf || 0}
                                                        onChange={handleNumberChange}
                                                        label="Percentual diferencial UF"
                                                        useRightButton={true}
                                                        outlined={true}
                                                        hasError={!!errors.percentual_diferencial_uf}
                                                        errorMessage={errors.percentual_diferencial_uf}
                                                        topLabel="Diferencial UF:"
                                                        showTopLabel
                                                        required
                                                        iconLeft={<IconPorcentagem isDarkMode={false} />}
                                                    />
                        </div>
                        <div className="col-12 mt-1 lg:col-4">
                            <Dropdown
                                value={servico.iss_retido ?? ''}
                                onChange={handleDropdownChange}
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
                        <div className="col-12 mt-1 lg:col-4">
                            <Dropdown
                                id="exigibilidade_iss"
                                value={servico.exigibilidade_iss ?? ''}
                                options={exigibilidadeISSServico}
                                onChange={handleDropdownChange}
                                label="Selecione uma opção"
                                filterBy={false}
                                hasError={!!errors.exigibilidade_iss}
                                errorMessage={errors.exigibilidade_iss}
                                topLabel="Exigibilidade ISS:"
                                showTopLabel
                                required
                            />
                        </div>
                        <div className="col-12 mt-1  lg:col-4">
                            <Dropdown
                                id="codigo_situacao_tributaria"
                                value={servico.codigo_situacao_tributaria ?? ''}
                                options={situacaoTributaria}
                                onChange={handleDropdownChange}
                                label="Selecione uma opção"
                                filterBy={false}
                                hasError={!!errors.codigo_situacao_tributaria}
                                errorMessage={errors.codigo_situacao_tributaria}
                                topLabel="Situação Tributária:"
                                showTopLabel
                                required
                            />
                        </div>
                        <div className="col-12 mt-1  lg:col-4">
                            <ClassificacaoTributariaEDropdownField
                                selectedClassificacaoTributaria={selectedClassificacaoTributaria}
                                onClassificacaoTributariaChange={handleClassificacaoTributariaChange}
                                fetchAllClassificacaoTributaria={fetchAllClassificacaoTributaria}
                                fetchFilteredClassificacaoTributaria={fetchFilteredClassificacaoTributaria}
                                hasError={!!errors.codigo_classificacao_tributaria}
                                errorMessage={errors.codigo_classificacao_tributaria}
                                topLabel="Classificação Tributária:"
                                showTopLabel
                                required
                            />
                        </div>
                        <div className="col-12 mt-1  lg:col-4">
                             <Dropdown
                                id="codigo_situacao_tributaria_regular"
                                value={servico.codigo_situacao_tributaria_regular || ''}
                                options={codigoSituacaoTributariaRegular}
                                onChange={handleDropdownChange}
                                label="Selecione uma opção"
                                filterBy={false}
                                hasError={!!errors.codigo_situacao_tributaria_regular}
                                errorMessage={errors.codigo_situacao_tributaria_regular}
                                topLabel="Classificação Tributária Regular"
                                showTopLabel
                                required
                            />
                        </div>
                           <div className="col-12 mt-1  lg:col-4">
                            <DropdownSearch<ServiceEntity>
                                id="item_lista_servico"
                                selectedItem={selectedService}
                                onItemChange={handleServicoChange}
                                fetchAllItems={searchServiceTable}
                                fetchFilteredItems={searchServiceTable}
                                optionLabel={'descricao' as keyof ServiceEntity}
                                placeholder="Selecione um serviço"
                                hasError={!!errors.item_lista_servico}
                                errorMessage={errors.item_lista_servico}
                                topLabel="Descrição da Atividade do Serviço:"
                                showTopLabel
                                required
                            />
                        </div>
                         <div className="col-12 mt-1  lg:col-4">
                            <Input
                                value={servico.codigo_credito_presumido || ''}
                                onChange={handleAllChanges}
                                label="Codígo do crédito presumido"
                                id="codigo_credito_presumido"
                                hasError={!!errors.codigo_credito_presumido}
                                errorMessage={errors.codigo_credito_presumido}
                                topLabel="Crédito presumido:"
                                maxLength={20}
                                showTopLabel
                            />
                        </div>
                        <div className="col-12 mt-1  lg:col-4">
                            <Dropdown
                                id="responsavel_retencao"
                                value={servico.responsavel_retencao ?? ''}
                                options={responsavelRetencao}
                                onChange={handleDropdownChange}
                                label="Selecione uma opção"
                                filterBy={false}
                                hasError={!!errors.responsavel_retencao}
                                errorMessage={errors.responsavel_retencao}
                                topLabel="Retenção:"
                                showTopLabel
                                required
                            />
                        </div>
                        <div className="col-12 mt-1  lg:col-4">
                              <Dropdown
                                id="codigo_indicador_operacao"
                                value={servico.codigo_indicador_operacao ?? ''}
                                options={codigoIndicadorOperacao}
                                onChange={handleDropdownChange}
                                label="Selecione uma opção"
                                filterBy={false}
                                hasError={!!errors.codigo_indicador_operacao}
                                errorMessage={errors.codigo_indicador_operacao}
                                topLabel="Indicador de Operação:"
                                showTopLabel
                                required
                            />
                        </div>
                          <div className="col-12 mt-1  lg:col-4">
                            <Input
                                value={servico.codigo_municipio || ''}
                                onChange={handleAllChanges}
                                label="Codígo do Município"
                                id="codigo_municipio"
                                hasError={!!errors.codigo_municipio}
                                errorMessage={errors.codigo_municipio}
                                topLabel="Codígo do Município:"
                                showTopLabel
                            />
                        </div>
                           <div className="col-12 mt-1  lg:col-4">
                            <Input 
                            value={servico.numero_processo || ''} 
                            onChange={handleAllChanges} 
                            label="Numéro do Processo" 
                            id="numero_processo" 
                            topLabel="Numéro do Processo:" 
                            showTopLabel 
                             />
                        </div>
                        <div className="col-12 mb-1 lg:col-3 lg:mb-0 w-full">
                            <InputTextarea value={servico.descricao_completa || ''} onChange={handleAllChanges} rows={5} cols={30} label={''} id="descricao_completa" topLabel="Descrição Complementar:" showTopLabel />
                        </div>
                    </div>
                </div>
            </div>
            <div className="StyleContainer-btn-Created" style={{ marginTop: 'auto' }}>
                {showBTNPGCreatedAll && (
                    <BTNPGCreatedAll
                        onClick={handleSubmit}
                        label="Salvar"
                        disabled={
                            stateDisableBtnCreatedService ||
                            Object.keys(errors).length > 0 ||
                            !servico.descricao?.trim() ||
                            !servico.valor_servico ||
                            !servico.codigo_situacao_tributaria ||
                            !servico.codigo_classificacao_tributaria ||
                            !servico.codigo_situacao_tributaria_regular ||
                            !servico.item_lista_servico ||
                            !servico.iss_retido ||
                            !servico.exigibilidade_iss ||
                            !servico.responsavel_retencao  ||
                            !servico.codigo_indicador_operacao 
                        }
                    />
                )}
                {showBTNPGCreatedDialog && (
                    <BTNPGCreatedDialog
                        onClick={handleSubmit}
                        label="Salvar"
                        onBackClick={onBackClick}
                        onClose={onClose}
                        disabled={
                            stateDisableBtnCreatedService ||
                            Object.keys(errors).length > 0 ||
                            !servico.descricao?.trim() ||
                            !servico.valor_servico ||
                            !servico.codigo_situacao_tributaria ||
                            !servico.codigo_classificacao_tributaria ||
                            !servico.codigo_situacao_tributaria_regular ||
                            !servico.item_lista_servico ||
                            !servico.iss_retido ||
                            !servico.exigibilidade_iss ||
                            !servico.responsavel_retencao  ||
                            !servico.codigo_indicador_operacao 
                        }
                    />
                )}
            </div>
        </>
    );
});
ServicoForm.displayName = 'ServicoForm';
export default ServicoForm;
