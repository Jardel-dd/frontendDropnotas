'use client';
import './style.css';
import '@/app/styles/styledGlobal.css';
import Input from '@/app/shared/include/input/input-all';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { PermissoesFieldsProps } from '../types/perfilUsuario';
import '@/app/(main)/cadastro/permissoes/created/TreeStyles.css';
import { Tree, TreeCheckboxSelectionKeys } from 'primereact/tree';
import { permissoes, tiposVisualizacaoPermissoes } from '@/app/shared/optionsDropDown/options';
export type { FormCreatedPermissoesProps, PermissoesFieldsProps, PermissoesFormProps, PermissoesFormRef } from '../types/perfilUsuario';
export function PermissoesFields({ perfilUser, errors, selectedKeys, isLoading, onChange, onDropdownChange, onSelectionChange, onValidateNome }: PermissoesFieldsProps) {
    return (
        <div className="grid formgrid">
            <div className="col-12 lg:col-12 ">
                <Input
                    value={perfilUser.nome || ''}
                    onChange={onChange}
                    label="Digite a descição da permissão"
                    id="nome"
                    hasError={!!errors.nome}
                    errorMessage={errors.nome}
                    onBlur={onValidateNome}
                    autoFocus
                    topLabel="Descrição da Permissão:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4 ">
                <Dropdown
                    value={perfilUser.ordemServicoTipoVisualizacao || ''}
                    onChange={onDropdownChange}
                    options={tiposVisualizacaoPermissoes}
                    id="ordemServicoTipoVisualizacao"
                    label="Selecione o tipo de visualização da ordem de servico"
                    hasError={!!errors.selectedordemServicoTipoVisualizacao}
                    errorMessage={errors.selectedordemServicoTipoVisualizacao}
                    topLabel="Tipo de Visualização da Ordem de Serviço:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4 ">
                <Dropdown
                    value={perfilUser.contratoTipoVisualizacao || ''}
                    onChange={onDropdownChange}
                    id="contratoTipoVisualizacao"
                    options={tiposVisualizacaoPermissoes}
                    label="Selecione o tipo de visualização de contratos"
                    hasError={!!errors.contratoTipoVisualizacao}
                    errorMessage={errors.contratoTipoVisualizacao}
                    topLabel="Tipo de Visualização do Contrato:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4 ">
                <Dropdown
                    value={perfilUser.nfseTipoVisualizacao || ''}
                    onChange={onDropdownChange}
                    id="nfseTipoVisualizacao"
                    options={tiposVisualizacaoPermissoes}
                    label="Selecione o tipo de visualização da Nota Fiscal"
                    hasError={!!errors.nfseTipoVisualizacao}
                    errorMessage={errors.nfseTipoVisualizacao}
                    topLabel="Tipo de Visualização da Nota Fiscal:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-12 mt-3">
                <Tree
                    id="selectedPerfilUser"
                    value={permissoes}
                    selectionMode="checkbox"
                    selectionKeys={selectedKeys}
                    onSelectionChange={(event) => onSelectionChange(event.value as TreeCheckboxSelectionKeys)}
                    className={`w-full custom-multiselect permissoes-tree ${errors.selectedPerfilUser ? 'tree-error' : ''}`}
                    disabled={isLoading}
                />
                {errors.selectedPerfilUser && <small className="p-error">{errors.selectedPerfilUser}</small>}
            </div>
        </div>
    );
}


