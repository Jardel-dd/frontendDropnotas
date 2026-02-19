'use client';
import './style.css';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import Input from '@/app/shared/include/input/input-all';
import { RefObject, useEffect, useState, forwardRef } from 'react';
import { CategoryContratosEntity } from '@/app/entity/CategoryContratEntity';
import BTNPGCreatedAll from '../../buttonsComponent/btnCreatedAll/btn-created-all';
import BTNPGCreatedDialog from '../../buttonsComponent/btnCreatedAll/btn-created-dialog';
import { fetchAllCategoriaContrato, fetchCategoriaContratoByID } from '../../fetchAll/listAllCategoriaContrato/controller';
import { validateFieldsCategoriaContrato } from '@/app/(main)/cadastro/categoriaContratos/controller/validate';
import { createdCategoriaContrato, updateCategoriaContrato } from '@/app/(main)/cadastro/categoriaContratos/controller/controller';
export interface CategoriaContratoFormRef {
    handleSave: () => Promise<void>;
}
interface CategoriaContratoFormProps {
    categoriaContrato: any;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onCategoriaContratoChange?: (servico: CategoryContratosEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setCategoriaContrato: React.Dispatch<React.SetStateAction<CategoryContratosEntity>>;
    redirectAfterSave?: boolean;
    onSaved?: (created: CategoryContratosEntity) => void;
    onClose?: () => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}
const CategoriaContratoForm = forwardRef<CategoriaContratoFormRef, CategoriaContratoFormProps>(
    ({ initialId, msgs, onCategoriaContratoChange, onErrorsChange, redirectAfterSave, onSaved, onClose, showBTNPGCreatedDialog, showBTNPGCreatedAll, onBackClick }: CategoriaContratoFormProps, ref) => {
        const router = useRouter();
        const categoriaContratoId = initialId;
        const [isLoading, setIsLoading] = useState(true);
        const [isEditMode, setIsEditMode] = useState(false);
        const [errors, setErrors] = useState<{ [key: string]: string }>({});
        const [categoriaContrato, setCategoriaContrato] = useState<CategoryContratosEntity>(
            new CategoryContratosEntity({
                id: 0,
                descricao: '',
                observacoes: '',
                ativo: true
            })
        );
        const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
        const [stateDisableBtnCreatedCategoriaContrato, setStateDisableBtnCreatedCategoriaContrato] = useState(false);
        const handleAllChanges = (event: { target: { id: string; value: any; checked?: any; type: string } }) => {
            const _categoriaContrato = categoriaContrato!.copyWith({
                [event.target.id]: event.target.type === 'checkbox' || event.target.type === 'switch' ? event.target.checked : event.target.value
            });
            setCategoriaContrato(_categoriaContrato);
        };
        const handleSubmit = async (e?: React.FormEvent) => {
            if (e) e.preventDefault();
            setStateDisableBtnCreatedCategoriaContrato(true);
            setIsLoading(true);
            try {
                if (isEditMode && categoriaContratoId) {
                    await updateCategoriaContrato(
                        categoriaContratoId, 
                        categoriaContrato, 
                        msgs, 
                        router, 
                        setErrors, 
                        setIsLoading, 
                        redirectAfterSave ?? false);
                    onSaved?.(categoriaContrato);
                    onClose?.();
                    return;
                }
                const created = await createdCategoriaContrato(categoriaContrato, msgs, router, setCategoriaContrato, setErrors, setIsLoading, redirectAfterSave ?? false);
                if (created) {
                    onSaved?.(created);
                    onClose?.();
                }
            } catch (error) {
                console.error('Erro ao salvar categoria de contrato:', error);
            } finally {
                setIsLoading(false);
                setStateDisableBtnCreatedCategoriaContrato(false);
            }
        };
        const ListagemCategoriaContratoID = async (id: string) => {
            setIsLoading(true);
            try {
                const response = await fetchCategoriaContratoByID(id);
                const categoria = new CategoryContratosEntity({
                    ...response.categoriaContrato,
                    id: Number(id)
                });
                setCategoriaContrato(categoria);
            } finally {
                setIsLoading(false);
            }
        };
        useEffect(() => {
            if (categoriaContratoId) {
                setIsEditMode(true);
                ListagemCategoriaContratoID(categoriaContratoId).finally(() => setIsLoading(false));
            } else {
                setIsLoading(false);
            }
        }, [categoriaContratoId]);
        useEffect(() => {
            if (categoriaContratoId) {
                ListagemCategoriaContratoID(categoriaContratoId);
            }
        }, [categoriaContratoId]);
        useEffect(() => {
            if (Object.values(touchedFields).some((touched) => touched)) {
                validateFieldsCategoriaContrato(categoriaContrato, setErrors, msgs);
            }
        }, [categoriaContrato]);
        useEffect(() => {
            if (onErrorsChange) {
                onErrorsChange(errors);
            }
        }, [errors, onErrorsChange]);
        useEffect(() => {
            if (onCategoriaContratoChange) {
                onCategoriaContratoChange(categoriaContrato);
            }
        }, [categoriaContrato, onCategoriaContratoChange]);
        if (isLoading && categoriaContratoId) {
            return <LoadingScreen loadingText="Carregando informações da Categoria de Contrato selecionada..." />;
        }
        return (
            <>
                <div className="scrollable-container">
                    <div className="custom-flex-col">
                        <div className="col-12 mb-1 lg:col-4 lg:mb-0 w-full">
                            <Input
                                value={categoriaContrato.descricao || ''}
                                onChange={handleAllChanges}
                                label="Descrição da Categoria"
                                id="descricao"
                                autoFocus={true}
                                hasError={!!errors.descricao}
                                errorMessage={errors.descricao}
                                onBlur={() => {
                                    setTouchedFields((prev) => ({ ...prev, descricao: true }));
                                    validateFieldsCategoriaContrato(categoriaContrato, setErrors, msgs);
                                }}
                            />
                        </div>
                        <div className="col-12 mb-1 lg:col-4 lg:mb-0 w-full">
                            <Input value={categoriaContrato.observacoes || ''} onChange={handleAllChanges} label="Observações da Categoria" id="observacoes" />
                        </div>
                    </div>
                </div>
                <div className="StyleContainer-btn-Created" style={{ marginTop: 'auto' }}>
                    {showBTNPGCreatedAll && <BTNPGCreatedAll label="Salvar" disabled={stateDisableBtnCreatedCategoriaContrato || Object.keys(errors).length > 0 || !categoriaContrato.descricao} onClick={handleSubmit} />}
                    {showBTNPGCreatedDialog && (
                        <BTNPGCreatedDialog label="Salvar" 
                        disabled={stateDisableBtnCreatedCategoriaContrato 
                            || Object.keys(errors).length > 0 || 
                            !categoriaContrato.descricao} 
                            onClick={handleSubmit} onBackClick={onBackClick} onClose={onClose} />
                    )}
                </div>
            </>
        );
    }
);
CategoriaContratoForm.displayName = 'CategoriaContratoForm';
export default CategoriaContratoForm;
