'use client';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import Input from '@/app/shared/include/input/input-all';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { TableCodigoNBSEntity } from '@/app/entity/TableCodigoNBS';
import { IconPorcentagem, IconReal } from '@/app/utils/icons/icons';
import { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import CustomInputNumber from '@/app/shared/include/inputReal/inputReal';
import InputTextarea from '@/app/shared/include/inputTextArea/InputTextarea';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { fetchServicesByID } from '@/app/(main)/cadastro/servicos/controller/controller';
import { searchServiceTable } from '@/app/components/fetchAll/listAllTableService/controller';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import { validateFieldsServicos } from '@/app/(main)/cadastro/servicos/controller/validation';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import { createServico, updateServico } from '@/app/(main)/cadastro/servicos/controller/controller';
import { TableClassificacaoTributariaEntity } from '@/app/entity/TableClassificacaoTributariaEntity';
import { fetchAllClassificacaoTributaria, fetchFilteredClassificacaoTributaria } from '@/app/components/fetchAll/listAllClassficacaoTributaria/controller';
import {
    codigoIndicadorOperacao,
    codigoSituacaoTributariaRegular,
    exigibilidadeISSServico,
    issRetido,
    responsavelRetencao,
    situacaoTributaria
} from '@/app/shared/optionsDropDown/options';
import { fetchAllCodigoNBS, fetchFilteredCodigoNBS } from '@/app/components/fetchAll/listAllCodigoNBS/controller';
import {
    FormCreatedServicoProps,
    ServiceFormProps,
    ServiceFormRef,
    ServicoFieldsProps
} from '../types/servico';
import ServicoDropdownField from '../dropdown/servico';

const createEmptyServico = () =>
    new ServiceEntity({
        ativo: true,
        id: 0,
        descricao: '',
        descricao_completa: '',
        codigo: '',
        item_lista_servico: '010501',
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
        aliquota_deducoes: 0
    });
export function ServicoFields({
    servico,
    errors,
    selectedService,
    selectedCodigoNBS,
    selectedClassificacaoTributaria,
    onChange,
    onDropdownChange,
    onNumberChange,
    onServicoChange,
    onCodigoNBSChange,
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
                    label="Descricao completa do servico"
                    id="descricao"
                    hasError={!!errors.descricao}
                    errorMessage={errors.descricao}
                    onBlur={onDescriptionBlur}
                    autoFocus
                    topLabel="Descricao:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12  lg:col-2">
                <CustomInputNumber
                    id="valor_servico"
                    value={servico.valor_servico || 0}
                    onChange={onNumberChange}
                    label="Valor Servicos"
                    useRightButton
                    outlined
                    hasError={!!errors.valor_servico}
                    errorMessage={errors.valor_servico}
                    iconLeft={<IconReal isDarkMode={false} />}
                    topLabel="Valor Servico:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12  lg:col-4">
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
            <div className="col-12  lg:col-4">
                <CustomInputNumber
                    id="aliquota_deducoes"
                    value={servico.aliquota_deducoes || 0}
                    onChange={onNumberChange}
                    label="Aliquota Deducoes"
                    useRightButton
                    outlined
                    hasError={!!errors.aliquota_deducoes}
                    errorMessage={errors.aliquota_deducoes}
                    topLabel="Aliquota Deducoes:"
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
            <div className="col-12  lg:col-4">
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
            <div className="col-12  lg:col-4">
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
                    label="Selecione uma opcao"
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
                    label="Selecione uma opcao"
                    filterBy={false}
                    hasError={!!errors.codigo_situacao_tributaria}
                    errorMessage={errors.codigo_situacao_tributaria}
                    topLabel="Situacao Tributaria:"
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
                    topLabel="Classificacao Tributaria:"
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
                    topLabel="Codigo NBS:"
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
                    label="Selecione uma opcao"
                    filterBy={false}
                    hasError={!!errors.codigo_situacao_tributaria_regular}
                    errorMessage={errors.codigo_situacao_tributaria_regular}
                    topLabel="Classificacao Tributaria Regular"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12  lg:col-4">
                <Input
                    id="item_lista_servico"
                    value={servico.item_lista_servico || '010501'}
                    onChange={onChange}
                    topLabel="Descricao da Atividade do Servico:"
                    useRightButton
                    outlined
                    hasError={!!errors.item_lista_servico}
                    errorMessage={errors.item_lista_servico}
                    showTopLabel
                    required
                    label=""
                />
                {/* <ServicoDropdownField
                    id="item_lista_servico"
                    selectedService={selectedService}
                    onServiceChange={onServicoChange}
                    placeholder="Selecione um servico"
                    showTopLabel
                    required
                  
                /> */}
            </div>
            <div className="col-12  lg:col-4">
                <Input
                    value={servico.codigo_credito_presumido || ''}
                    onChange={onChange}
                    label="Codigo do credito presumido"
                    id="codigo_credito_presumido"
                    hasError={!!errors.codigo_credito_presumido}
                    errorMessage={errors.codigo_credito_presumido}
                    topLabel="Credito presumido:"
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
                    label="Selecione uma opcao"
                    filterBy={false}
                    hasError={!!errors.responsavel_retencao}
                    errorMessage={errors.responsavel_retencao}
                    topLabel="Retencao:"
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
                    label="Selecione uma opcao"
                    filterBy={false}
                    hasError={!!errors.codigo_indicador_operacao}
                    errorMessage={errors.codigo_indicador_operacao}
                    topLabel="Indicador de Operacao:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12  lg:col-4">
                <Input
                    value={servico.codigo_municipio || ''}
                    onChange={onChange}
                    label="Codigo do Municipio"
                    id="codigo_municipio"
                    hasError={!!errors.codigo_municipio}
                    errorMessage={errors.codigo_municipio}
                    topLabel="Codigo do Municipio:"
                    showTopLabel
                />
            </div>
            <div className="col-12  lg:col-4">
                <Input
                    value={servico.numero_processo || ''}
                    onChange={onChange}
                    label="Numero do Processo"
                    id="numero_processo"
                    topLabel="Numero do Processo:"
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
                    topLabel="Descricao Complementar:"
                    showTopLabel
                />
            </div>
        </div>
    );
}
const ServicoFormContainer = forwardRef<ServiceFormRef, ServiceFormProps>(
    ({ initialId, msgs, onServicoChange, onErrorsChange, redirectAfterSave, onClose, onSaved, showBTNPGCreatedDialog, showBTNPGCreatedAll, onBackClick }, ref) => {
        const router = useRouter();
        const servicoId = initialId;
        const onServicoChangeRef = useRef(onServicoChange);
        const onErrorsChangeRef = useRef(onErrorsChange);
        const [isLoading, setIsLoading] = useState(true);
        const [isEditMode, setIsEditMode] = useState(false);
        const [servico, setServico] = useState<ServiceEntity>(createEmptyServico());
        const [errors, setErrors] = useState<Record<string, string>>({});
        const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
        const [selectedService, setSelectedService] = useState<ServiceEntity | null>(null);
        const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
        const [stateDisableBtnCreatedService, setStateDisableBtnCreatedService] = useState(false);
        const [selectedCodigoNBS, setSelectedCodigoNBS] = useState<TableCodigoNBSEntity | null>(null);
        const [selectedClassificacaoTributaria, setSelectedClassificacaoTributaria] = useState<TableClassificacaoTributariaEntity | null>(null);
        const handleSubmit = async (event?: React.FormEvent) => {
            if (event) event.preventDefault();
            if (isLoadingBtnCreated) return;

            const isValid = validateFieldsServicos(servico, setErrors, msgs);
            if (!isValid) {
                setTouchedFields((prev) => ({ ...prev, submit: true }));
                return;
            }

            setIsLoadingBtnCreated(true);
            try {
                if (isEditMode && servicoId) {
                    await updateServico(servicoId, servico, setErrors, msgs, router, setServico, redirectAfterSave ?? true);
                } else {
                    const created = await createServico(servico, setErrors, msgs, router, setServico, redirectAfterSave ?? true);
                    onSaved?.(created);
                }

                onClose?.();
            } finally {
                setIsLoadingBtnCreated(false);
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

            setServico(servico.copyWith({ [event.target.id]: value }));
        };
        const handleClassificacaoTributariaChange = (classificacaoTributaria: TableClassificacaoTributariaEntity | null) => {
            setSelectedClassificacaoTributaria(classificacaoTributaria);
            const updatedClassificacaoTributaria = servico.copyWith({ codigo_classificacao_tributaria: classificacaoTributaria?.codigo || '' });
            setServico(updatedClassificacaoTributaria);
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.codigo_classificacao_tributaria;
                return newErrors;
            });
        };
        const handleCodigoNBSChange = (codigoNBS: TableCodigoNBSEntity | null) => {
            setSelectedCodigoNBS(codigoNBS);
            const updatedCodigoNBS = servico.copyWith({ codigo_nbs: codigoNBS?.codigo || '' });
            setServico(updatedCodigoNBS);
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.codigo_nbs;
                return newErrors;
            });
        };
        const handleDropdownChange = (event: DropdownChangeEvent) => {
            const updatedService = servico.copyWith({ [event.target.id]: event.value });
            setServico(updatedService);
        };
        const handleNumberChange = (event: InputNumberValueChangeEvent) => {
            const updatedServico = servico.copyWith({ [event.target.id]: event.value ?? 0 });
            setServico(updatedServico);
            setTouchedFields((prev) => ({ ...prev, [event.target.id]: true }));
            validateFieldsServicos(updatedServico, setErrors, msgs);
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
        const handleDescriptionBlur = () => {
            setTouchedFields((prev) => ({ ...prev, descricao: true }));
            validateFieldsServicos(servico, setErrors, msgs);
        };
        const listagemServicosID = async (id: string) => {
            try {
                setIsLoading(true);
                const { servico } = await fetchServicesByID(id);
                const entidade = new ServiceEntity(servico);

                setServico(
                    new ServiceEntity({
                        ...entidade,
                        item_lista_servico: '010501'
                    })
                );

                if (entidade.codigo_nbs) {
                    setSelectedCodigoNBS(
                        new TableCodigoNBSEntity({
                            id: 0,
                            codigo: entidade.codigo_nbs,
                            descricao: entidade.codigo_nbs
                        })
                    );
                }

                if (entidade.codigo_classificacao_tributaria) {
                    setSelectedClassificacaoTributaria(
                        new TableClassificacaoTributariaEntity({
                            id: 0,
                            codigo: entidade.codigo_classificacao_tributaria,
                            descricao: entidade.codigo_classificacao_tributaria,
                            codigoCst: entidade.codigo_classificacao_tributaria
                        })
                    );
                }

                const allServices = await searchServiceTable();
                const itemCodigo = entidade.item_lista_servico?.split(' - ')[0];
                const matchedServico = allServices.find((option: ServiceEntity) => option.codigo === itemCodigo);
                setSelectedService(matchedServico ?? null);
            } finally {
                setIsLoading(false);
            }
        };
        useImperativeHandle(ref, () => ({
            handleSave: handleSubmit
        }));
        useEffect(() => {
            onServicoChangeRef.current = onServicoChange;
        }, [onServicoChange]);
        useEffect(() => {
            onErrorsChangeRef.current = onErrorsChange;
        }, [onErrorsChange]);
        useEffect(() => {
            if (initialId) {
                setIsEditMode(true);
                listagemServicosID(initialId).finally(() => setIsLoading(false));
                return;
            }

            setIsLoading(false);
        }, [initialId]);
        useEffect(() => {
            if (Object.values(touchedFields).some((touched) => touched)) {
                validateFieldsServicos(servico, setErrors, msgs);
            }
        }, [servico]);
        useEffect(() => {
            onServicoChangeRef.current?.(servico);
        }, [servico]);
        useEffect(() => {
            onErrorsChangeRef.current?.(errors);
        }, [errors]);
        if (isLoading && initialId) {
            return <LoadingScreen loadingText="Carregando informacoes do Servico selecionado..." />;
        }
        const isDialogMode = Boolean(showBTNPGCreatedDialog);
        const isSubmitDisabled =
            stateDisableBtnCreatedService ||
            isLoadingBtnCreated ||
            Object.keys(errors).length > 0 ||
            !servico.descricao?.trim() ||
            !servico.valor_servico ||
            !servico.codigo_situacao_tributaria ||
            !servico.codigo_classificacao_tributaria ||
            !servico.codigo_situacao_tributaria_regular ||
            !servico.item_lista_servico ||
            !servico.iss_retido ||
            !servico.exigibilidade_iss ||
            !servico.responsavel_retencao ||
            !servico.codigo_indicador_operacao;
        return (
            <div className={`shared-form-layout ${isDialogMode ? 'shared-form-dialog-layout' : 'shared-form-page-layout'}`}>
                <Messages ref={msgs} className="custom-messages" />
                <div className="scrollable-container shared-form-content">
                    <div className="custom-flex-col">
                        <ServicoFields
                            servico={servico}
                            errors={errors}
                            selectedService={selectedService}
                            selectedCodigoNBS={selectedCodigoNBS}
                            selectedClassificacaoTributaria={selectedClassificacaoTributaria}
                            onChange={handleAllChanges}
                            onDropdownChange={handleDropdownChange}
                            onNumberChange={handleNumberChange}
                            onServicoChange={handleServicoChange}
                            onCodigoNBSChange={handleCodigoNBSChange}
                            onClassificacaoTributariaChange={handleClassificacaoTributariaChange}
                            onDescriptionBlur={handleDescriptionBlur}
                            fetchServiceTable={searchServiceTable}
                            fetchAllClassificacaoTributaria={fetchAllClassificacaoTributaria}
                            fetchFilteredClassificacaoTributaria={fetchFilteredClassificacaoTributaria}
                            fetchAllCodigoNBS={fetchAllCodigoNBS}
                            fetchFilteredCodigoNBS={fetchFilteredCodigoNBS}
                        />
                    </div>
                </div>
                <div className={`StyleContainer-btn-Created shared-form-footer ${isDialogMode ? 'shared-form-dialog-footer' : ''}`}>
                    {showBTNPGCreatedAll && (
                        <BTNPGCreatedAll
                            onClick={handleSubmit}
                            label="Salvar"
                            disabled={isSubmitDisabled}
                        />
                    )}

                    {showBTNPGCreatedDialog && (
                        <BTNPGCreatedDialog
                            onClick={handleSubmit}
                            label="Salvar"
                            onBackClick={onBackClick}
                            onClose={onClose}
                            disabled={isSubmitDisabled}
                        />
                    )}
                </div>
            </div>
        );
    }
);
ServicoFormContainer.displayName = 'ServicoFormContainer';
function isServiceFormProps(props: FormCreatedServicoProps): props is ServiceFormProps {
    return 'msgs' in props;
}
const FormCreatedServico = forwardRef<ServiceFormRef, FormCreatedServicoProps>((props, ref) => {
    if (isServiceFormProps(props)) {
        return <ServicoFormContainer {...props} ref={ref} />;
    }
    return <ServicoFields {...props} />;
});
FormCreatedServico.displayName = 'FormCreatedServico';
export default FormCreatedServico;
