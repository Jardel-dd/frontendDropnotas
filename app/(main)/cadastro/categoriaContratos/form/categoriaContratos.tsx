'use client';
import Input from '@/app/shared/include/input/input-all';
import type {CategoriaContratoFieldsProps} from '../types/categoriaContratos';
export type { CategoriaContratoFieldsProps,CategoriaContratoFormProps,CategoriaContratoFormRef,FormCategoriaContratoCreatedProps} from '../types/categoriaContratos';
export function CategoriaContratoFields({
    categoriaContrato,
    errors,
    onChange,
    onValidateDescricao
}: CategoriaContratoFieldsProps) {
    return (
        <div className="scrollable-container">
            <div className="custom-flex-col">
                <div className="col-12 mb-1 lg:col-4 lg:mb-0 w-full">
                    <Input
                        value={categoriaContrato.descricao || ''}
                        onChange={onChange}
                        label="Descrição da Categoria"
                        id="descricao"
                        autoFocus
                        hasError={!!errors.descricao}
                        errorMessage={errors.descricao}
                        onBlur={onValidateDescricao}
                    />
                </div>
                <div className="col-12 mb-1 lg:col-4 lg:mb-0 w-full">
                    <Input
                        value={categoriaContrato.observacoes || ''}
                        onChange={onChange}
                        label="Observações da Categoria"
                        id="observacoes"
                    />
                </div>
            </div>
        </div>
    );
}
